<template>
    <div class="chat-room" @[events].stop="closeAll">
        <!--  聊天室主畫面  -->
        <NavBar />
        <SearchBar />
        <!-- 聊天室主畫面 -->
        <MessageBox />
        <!-- 使用者輸入框 -->
        <Input v-if="(chatroomType === 0 && eventInfo?.dialogue === 0) || chatroomType === 1" />
    </div>
    <!-- 語音來電談窗 -->
    <n-modal
        class="chatRecordCard"
        v-model:show="isIncomingCall"
        :mask-closable="false"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <UserInfo :info="eventInfo" />
            <div class="description">語音來電</div>
            <ul class="call_container">
                <li @[events].stop="doHangup(2, eventID(route.params.eventKey), 0)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li @[events].stop="onIncomingCall(yourUsername, jsepMsg)">
                    <!-- <button
                        class="icon"
                        @[events].stop="onIncomingCall(yourUsername, jsepMsg)"
                    ></button> -->
                    <span class="icon"><img :src="pickUpIcon" alt="接聽" /></span>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
    <!-- 使用者重覆蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-if="isAlreadyTaken && !isIllegalDevice">
            <div class="popUp">
                您已在其他設備使用, 請關閉其他設備後點選重整按鈕
                <div class="btnWrap">
                    <n-button
                        color="#ffb400"
                        text-color="#fff"
                        type="primary"
                        @[events].stop="onReload"
                    >
                        重整
                    </n-button>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 連結失效蓋板 -->
    <teleport to="body">
        <div class="mask2" v-if="noChatToken">
            <div class="popUp2">此連結已失效,請關閉視窗!!!</div>
        </div>
    </teleport>
    <!-- 進入加載動畫 -->
    <loadingPage :isLoading="isLoading" />
    <!-- 上傳動畫 -->
    <uploadAnimation :isLoading="uploadIsLoading" />
</template>

<script setup lang="ts">
// @ts-nocheck
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import { nanoid } from "nanoid";
import axios from "axios";
import {
    defineComponent,
    ref,
    onMounted,
    computed,
    onUpdated,
    watchEffect,
    onUnmounted,
    nextTick,
} from "vue";
import { NModal, NCard, NButton } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { Debugout } from "debugout.js";
import { detectIncognito } from "detectincognitojs";

import { ITransactions, IAttachPlugin } from "@/util/interfaceUtil";
import { processDataEvent, onError, randomString } from "@/util/chatUtil";
import { groupChatProcessDataEvent } from "@/util/groupChatUtil";
import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import { currentTime, currentDate, unixTime } from "@/util/dateUtil";
import {
    localStorageMsg,
    eventID,
    OPAQUEID,
    MY_ROOM,
    JANUS_URL,
    chatroomID,
    convertTime,
    isMobile,
    scrollPageTo,
} from "@/util/commonUtil";
import NavBar from "@/components/Chat/NavBar.vue";
import MessageBox from "@/components/Chat/MessageBox";
import SearchBar from "@/components/Chat/SearchBar.vue";
import Input from "@/components/Chat/Input";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";
import pickUpIcon from "@/assets/Images/common/connect-round.svg";
import config from "@/config/config";
import loadingPage from "@/components/LoadingPage.vue";
import uploadAnimation from "@/components/uploadAnimation.vue";
import { signature, withoutCanvasDrawing } from "@/util/deviceUtil";

const events = ref(isMobile ? "touchend" : "click");

let myid: any = null;
let myusername: any = null;
let transactions: any = {};
let participants: any = {};
// let callPlugin: any = null;
let simulcastStarted: any = false;
const welcomeStatus: any = ref(false);
const getSMSMsgStatus: any = ref(false);
onMounted(() => {
    // 掛載時拿取歡迎訊息狀態
    welcomeStatus.value = JSON.parse(
        localStorage.getItem(`${route.params.eventKey}-welcomeStatus`) || "false"
    );
    //掛載時拿取簡訊訊息狀態
    getSMSMsgStatus.value = JSON.parse(
        localStorage.getItem(`${route.params.eventKey}-getSMSMsgStatus`) || "false"
    );
});

//router
const router = useRouter();
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);

// 彈窗 store
const modelStore = useModelStore();
const { closeAll } = modelStore;
const { phoneCallModal, isLoading, uploadIsLoading } = storeToRefs(modelStore);

// api store
const apiStore = useApiStore();
const {
    getEventListApi,
    getBackendApi2,
    getSticker,
    logDiary,
    getGroupChatMemberVisitTimeApi,
    getGroupChatPeopleInfo,
} = apiStore;
const { eventInfo, isIllegalDevice, mCode, mMobile, bugout, diaryLog, chatroomType } =
    storeToRefs(apiStore);

//Chat store
const chatStore = useChatStore();
const { scrollToBottom } = chatStore;
const {
    msgParticipantList,
    messages,
    pictures,
    textPlugin,
    participantList,
    isOnline,
    janusConnectStatus,
    janus,
} = storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

//蒐集 userError
const getlog = () => {
    diaryLog.value = bugout.value.getLog();
    diaryLog.value = `使用者資料-${route.params.eventKey}` + diaryLog.value;
    // console.log("getLog", diaryLog.value);
    let rows = diaryLog.value.split("\n").length;
    // console.log("行數", rows);
    if (rows > 5) {
        logDiary(diaryLog.value, route.params.eventKey);
        bugout.value.clear();
    }
};
const timerLog = ref(null);
onUnmounted(() => {
    clearInterval(timerLog.value);
});
// 即時拿取聊天室最後一筆訊息--登入成功後執行
const timer: any = ref(null);
const localDeviceHasChatroom = ref([]) as any;
onUnmounted(() => {
    clearInterval(timer.value);
});
const noChatToken = ref(false);
watchEffect(() => {
    messages.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}`) || "[]");
    if (participantList.value.length > 0) {
        isOnline.value = true;
    }
    pictures.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}-pictures`) || "[]");
});
//------------------------------------------------------------------------- 以下為登入流程 ----------------------------------------------------------------------------------

//janus 初始值 打login API --1
onMounted(() => {
    isLoading.value = true;
    bugout.value.log("打登入api時間", dayjs().format("HH:mm:ss"));
    axios({
        method: "get",
        url: `${config.serverUrl}/login/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            console.log("登入成功 ", res);
            bugout.value.log("登入成功時間", dayjs().format("HH:mm:ss"));
            chatroomType.value = res.data.eventType;
            isIllegalDevice.value = 0;
            localStorage.removeItem(`${route.params.eventKey}-icon`);
            localStorage.removeItem(`${route.params.eventKey}-description`);
            localStorage.removeItem(`${route.params.eventKey}-name`);
            localStorage.removeItem(`${route.params.eventKey}-homeurl`);
            //一般聊天所需api
            if (chatroomType.value === 0) {
                bugout.value.log("打eventInfo時間", dayjs().format("HH:mm:ss"));
                getBackendApi(route.params.eventKey);
            } else {
                //建立jauns
                Janus.init({
                    debug: "all",
                    dependencies: Janus.useDefaultDependencies({
                        adapter: adapter,
                    }),
                    callback: () => {
                        if (!Janus.isWebrtcSupported()) {
                            console.log("No WebRTC support... ");
                            return;
                        }
                        connect();
                    },
                });
                //獲取當前裝置聊天室
                if (localStorage.getItem("localDeviceHasChatroom") === null) {
                    localDeviceHasChatroom.value.push(eventKey.value);
                    localStorage.setItem(
                        "localDeviceHasChatroom",
                        JSON.stringify(localDeviceHasChatroom.value)
                    );
                } else {
                    localDeviceHasChatroom.value = JSON.parse(
                        localStorage.getItem("localDeviceHasChatroom")
                    );
                    if (!localDeviceHasChatroom.value.includes(eventKey.value)) {
                        localDeviceHasChatroom.value.push(eventKey.value);
                    }
                    localStorage.setItem(
                        "localDeviceHasChatroom",
                        JSON.stringify(localDeviceHasChatroom.value)
                    );
                }
                // 群聊所需api
                if (!getSMSMsgStatus.value) {
                    getSMSMsg();
                }
                getGroupChatMemberVisitTimeApi(route.params.eventKey);
                getGroupChatPeopleInfo(route.params.eventKey, true);
                getEventListApi(route.params.eventKey);
                getSticker(route.params.eventKey);
            }
            //抓log
            timerLog.value = setInterval(() => {
                getlog();
            }, 10000);
            // 判斷是否為無痕模式
            detectIncognito().then((result) => {
                // console.log("無痕模式判斷", navigator.userAgent, result.isPrivate);
                if (result.isPrivate === false) return;

                if (
                    navigator.userAgent.includes("CriOS") ||
                    navigator.userAgent.includes("Chrome")
                ) {
                    alert(
                        "提醒您！您正使用瀏覽器的『無痕視窗』模式打開「互動回覆簡訊」交談室頁面，此模式下所有對話紀錄將不被保存，若您希望保存對話紀錄，請改用一般瀏覽模式。"
                    );
                } else {
                    alert(
                        "提醒您！您正使用瀏覽器的『私密瀏覽』模式打開「互動回覆簡訊」交談室頁面，此模式下所有對話紀錄將不被保存，若您希望保存對話紀錄，請改用一般瀏覽模式。"
                    );
                }
            });
        })
        .catch((err: any) => {
            isLoading.value = false;
            console.error("login err", err);
            if (err.response.status === 401) {
                if (err.response.data.code === -1) {
                    isIllegalDevice.value = 1;
                }
                if (err.response.data.code === -3) {
                    axios({
                        method: "get",
                        url: `${config.serverUrl}/mcode/${route.params.eventKey}?device=${withoutCanvasDrawing}`,
                        headers: { Authorization: `Bearer ${signature}` },
                    })
                        .then((res: any) => {
                            isIllegalDevice.value = 3;
                            mCode.value = String(res.data.code);
                            mMobile.value = res.data.mobile.slice(4, 13);
                        })
                        .catch((err: any) => {
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.status
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.data
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.request.responseURL
                            );
                            console.error(err);
                        });
                }
            }
            if (err.response.status === 404) {
                noChatToken.value = true;
                return;
            }
        });
});

// 一般聊天室獲取使用者資訊 --2
const getBackendApi = async (chatToken) => {
    await axios({
        method: "get",
        url: `${config.serverUrl}/Event/${chatToken}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res) => {
            eventInfo.value = res.data.eventInfo;
            console.log("接收到的使用者資料", eventInfo.value);
            bugout.value.log("拿到eventInfo時間", dayjs().format("HH:mm:ss"));
            //獲取當前裝置聊天室
            if (localStorage.getItem("localDeviceHasChatroom") === null) {
                localDeviceHasChatroom.value.push(eventKey.value);
                localStorage.setItem(
                    "localDeviceHasChatroom",
                    JSON.stringify(localDeviceHasChatroom.value)
                );
            } else {
                localDeviceHasChatroom.value = JSON.parse(
                    localStorage.getItem("localDeviceHasChatroom")
                );
                if (!localDeviceHasChatroom.value.includes(eventKey.value)) {
                    localDeviceHasChatroom.value.push(eventKey.value);
                }
                localStorage.setItem(
                    "localDeviceHasChatroom",
                    JSON.stringify(localDeviceHasChatroom.value)
                );
            }
            localStorage.setItem(`${chatToken}-icon`, eventInfo.value.icon);
            localStorage.setItem(`${chatToken}-description`, eventInfo.value.description);
            localStorage.setItem(`${chatToken}-name`, eventInfo.value.name);
            localStorage.setItem(`${chatToken}-homeurl`, eventInfo.value.homeurl);
            getEventListApi(chatToken);
            getSticker(chatToken);
            //是否啟用janus  dialogue=> 0:啟用 1:禁用
            if (eventInfo.value.dialogue === 0) {
                Janus.init({
                    debug: "all",
                    dependencies: Janus.useDefaultDependencies({
                        adapter: adapter,
                    }),
                    callback: () => {
                        if (!Janus.isWebrtcSupported()) {
                            console.log("No WebRTC support... ");
                            return;
                        }
                        bugout.value.log("註冊janus時間", dayjs().format("HH:mm:ss"));
                        connect();
                    },
                });
            }
            //拿所有訊息
            messages.value = JSON.parse(localStorage.getItem(`${chatToken}`) || "[]");
            //拿圖片訊息
            pictures.value = JSON.parse(localStorage.getItem(`${chatToken}-pictures`) || "[]");

            if (eventInfo.value.unreadList !== null) {
                eventInfo.value.unreadList.forEach((unReadMsg, _, arr) => {
                    // 收回訊息
                    if (unReadMsg.janusMsg.msgType === 10) {
                        messages.value.forEach((msg) => {
                            if (msg.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                msg.janusMsg.config.recallStatus = true;
                            }
                        });
                        localStorage.setItem(`${chatToken}`, JSON.stringify(messages.value));
                        // 圖庫訊息收回
                        pictures.value.forEach((pic) => {
                            if (pic.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                pic.janusMsg.config.recallStatus = true;
                            }
                        });
                        localStorage.setItem(
                            `${chatToken}-pictures`,
                            JSON.stringify(pictures.value)
                        );
                        return;
                    }
                    // 推未讀訊息
                    if (
                        !messages.value.some((msg) => {
                            return msg.janusMsg.config.id === unReadMsg.janusMsg.config.id;
                        }) &&
                        !unReadMsg.janusMsg.config.isWelcomeMsg
                    ) {
                        arr[0].janusMsg.config.isUnread = true;
                        messages.value.push(unReadMsg);
                        messages.value.sort((a, b) => a.janusMsg.time - b.janusMsg.time);
                        initWeclomeMsg();
                        // localStorageMsg(messages.value, chatToken);
                        //更新最後一筆訊息
                        localStorage.setItem(`${chatToken}-lastMessage`, JSON.stringify(unReadMsg));
                    }
                    //將圖片及檔案推入圖庫
                    if (
                        unReadMsg.janusMsg.msgType === 6 ||
                        unReadMsg.janusMsg.msgType === 7 ||
                        unReadMsg.janusMsg.msgType === 11
                    ) {
                        pictures.value.push(unReadMsg);
                    }
                });
                localStorage.setItem(`${chatToken}-pictures`, JSON.stringify(pictures.value));
                setTimeout(() => {
                    scrollPageTo(eventInfo.value.unreadList[0].janusMsg.config.id);
                }, 500);
            } else {
                nextTick(() => {
                    scrollToBottom();
                    setTimeout(() => {
                        const chatroomToBottom = document.querySelector(".dialog-box:last-child");
                        chatroomToBottom.scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                        });
                        // console.log("chatroomToBottom", chatroomToBottom);
                    }, 100);
                });
            }
            if (!welcomeStatus.value) {
                getSMSMsg();
            }
            messages.value.forEach((msg) => {
                if (msg.janusMsg.sender == 0 && msg.janusMsg.format.phoneType == 1) {
                    msg.janusMsg.format.phoneType = 4;
                }
            });
            isLoading.value = false;
        })
        .catch((err) => {
            console.error("Event err:", err);
            if (err.response.status === 404) {
                alert("活動已關閉!!");
                if (isMobile) {
                    router.push(`/chatRecord/${route.params.eventKey}`);
                }
            }
        });
};

//簡訊api --3
const getSMSMsg = async () => {
    await axios({
        method: "get",
        url: `${config.serverUrl}/smsmsg/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res) => {
            // console.log("拿到過往簡訊的 res ", res);
            //加入簡訊訊息
            if (res.data.length === 0) {
                console.log("沒簡訊訊息!!");
                return;
            }
            res.data.msg.forEach((msg) => {
                messages.value.push(msg);
            });
            localStorageMsg(messages.value, route.params.eventKey);
            let lastMsg = messages.value.filter((_, idx, arr) => arr.length - 1 === idx);
            //存最後一筆訊息
            localStorage.setItem(
                `${route.params.eventKey}-lastMessage`,
                JSON.stringify(lastMsg[0])
            );
            //存取拿過簡訊訊息狀態
            localStorage.setItem(`${route.params.eventKey}-getSMSMsgStatus`, JSON.stringify(true));
            console.log("添加簡訊訊息!!");
            if (chatroomType.value === 0) {
                //加入歡迎訊息
                initWeclomeMsg();
            }
        })
        .catch((err) => {
            console.log("拿到過往簡訊的 err", err);
        });
};
//預設訊息 --4
const initWeclomeMsg = () => {
    console.log("添加歡迎訊息");
    let otherMsg: any = null;
    if (!welcomeStatus.value && eventInfo.value) {
        eventInfo.value.messagelist.forEach((item: any) => {
            otherMsg = {
                janusMsg: {
                    chatroomID: chatroomID(route.params.eventKey),
                    msgType: item.janusMsg.msgType,
                    sender: 0, // 0:客服, 1:使用者
                    msgContent: item.janusMsg.msgContent,
                    time: unixTime(),
                    type: 2, //1:簡訊 2: 文字
                    format: item.janusMsg.format,
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: {},
                        currentDate: currentDate(),
                        isExpire: false,
                        isPlay: false,
                        isRead: false,
                        isWelcomeMsg: true,
                        msgFunctionStatus: false,
                        msgMoreStatus: false,
                        recallPopUp: false,
                        recallStatus: false,
                        deliveryStatusSuccess: true,
                    },
                },
            };

            messages.value.push(otherMsg);
            messages.value = messages.value.reduce((unique, o) => {
                const hasRepeatId = unique.some((obj) => {
                    return obj.janusMsg.config.id === o.janusMsg.config.id;
                });
                if (!hasRepeatId) {
                    unique.push(o);
                }
                return unique;
            }, []);
            if ([6, 7, 11].includes(otherMsg.janusMsg.msgType)) {
                pictures.value.push(otherMsg);
            }
            //訊息列表存local
            localStorageMsg(messages.value, route.params.eventKey);
            //存最後一筆訊息
            localStorage.setItem(`${route.params.eventKey}-lastMessage`, JSON.stringify(otherMsg));
        });
    }
    localStorage.setItem(`${route.params.eventKey}-welcomeStatus`, JSON.stringify(true));
    localStorage.setItem(`${route.params.eventKey}-pictures`, JSON.stringify(pictures.value));
    localStorageMsg(messages.value, route.params.eventKey);
    pictures.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}-pictures`) || "[]");
};
//手機 監聽是否在聊天畫面裡
onMounted(() => {
    if (isMobile) {
        // 當前裝置是移動裝置
        document.addEventListener("visibilitychange", (event) => {
            let transaction = randomString(12);
            if (document.visibilityState === "hidden") {
                console.log("離開talkod畫面!!!!!!!!");
                if (
                    (chatroomType.value === 0 && eventInfo.value.dialogue === 0) ||
                    chatroomType.value === 1
                ) {
                    let leave = {
                        textroom: "leave",
                        transaction: transaction,
                        room: Number(eventID(route.params.eventKey)),
                    };
                    textPlugin.value.data({
                        text: JSON.stringify(leave),
                        error: function (reason: any) {
                            console.log("error leave:", reason);
                        },
                        success: function () {},
                    });
                }
            }
            if (
                document.visibilityState === "visible" &&
                !isAlreadyTaken.value &&
                route.name === "Chat"
            ) {
                console.log("回到talkod畫面!!!!!!!!");
                isLoading.value = true;
                if (chatroomType.value === 0) {
                    getBackendApi2(route.params.eventKey);
                } else {
                    getGroupChatPeopleInfo(route.params.eventKey, false);
                }
            }
        });
    }
});
//reload function
const reloadTimes = ref(0);
const reloadFunction = () => {
    if (!document.cookie) {
        document.cookie = `reloadTimes=${reloadTimes.value}`;
    }
    const cookie = document.cookie;
    const value = cookie.split("=");
    reloadTimes.value = value[1];
    if (reloadTimes.value < 3) {
        reloadTimes.value++;
        document.cookie = `reloadTimes=${reloadTimes.value}`;
        console.log("reloadTimes", reloadTimes.value);
    } else {
        reloadTimes.value = 0;
        document.cookie = `reloadTimes=${reloadTimes.value}`;
        alert(`連線異常,請按下確認重新連線`);
    }
    window.location.reload();
};
// ----------------------------------------------以下為 janus -----------------------------------------------------------------------------------------------------------------------------
// 連線
const connect = () => {
    janus.value = new Janus({
        server: JANUS_URL,
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "turn:turn.talkod.im:3478", username: "talkod", credential: "talkOD" },
            {
                urls: "turns:turn.talkod.im:443?transport=tcp",
                username: "talkod",
                credential: "talkOD",
            },
        ],
        // iceTransportPolicy: "relay",
        success: () => {
            if (route) {
                attachTextroomPlugin();
                attachVideocallPlugin();
            }
            janusConnectStatus.value = true;
            // isLoading.value = false;
            if (!document.cookie) {
                document.cookie = `reloadTimes=${reloadTimes.value}`;
            } else {
                const cookie = document.cookie;
                const value = cookie.split("=");
                reloadTimes.value = value[1];
                reloadTimes.value = 0;
                document.cookie = `reloadTimes=${reloadTimes.value}`;
            }
        },
        error: (error: any) => {
            if (
                (chatroomType.value === 0 && eventInfo.value?.dialogue === 0) ||
                chatroomType.value === 1
            ) {
                janusConnectStatus.value = false;
                const errMsg = onError("Failed to connect to janus server", error.response);
                // console.error("getSessionId", janus.value.getSessionId());
                console.error("connect error", errMsg);
                reloadFunction();
            }
            isLoading.value = false;
        },
        destroyed: () => {
            janusConnectStatus.value = false;
            console.log("聊天室已被銷毀");
            // window.location.reload();
        },
    });
};

// 註冊 for me
const registerUsername = (username: undefined | string) => {
    if (username === "") {
        return;
    }
    // myid = randomString(12);
    myid = username;
    console.log("註冊的myid", myid);
    let transaction = randomString(12);
    let register = {
        textroom: "join",
        transaction: transaction,
        room: Number(eventID(route.params.eventKey)),
        username: myid,
        display: "user",
    };

    myusername = username;
    transactions[transaction] = function (response: ITransactions) {
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                console.log("No such room : <code>" + eventID(route.params.eventKey) + "</code>");
            } else {
                console.log(response["error"]);
            }
            return;
        }

        //registration
        let register = { request: "register", username: username };
        callPlugin.value.send({ message: register });

        // Any participants already in?
        if (response.participants && response.participants.length > 0) {
            for (let i in response.participants) {
                let p = response.participants[i];
                participants[p.username] = p.display ? p.display : p.username;
            }
            //TODO do something
        }
        participantList.value = participants;
        participantList.value = Object.keys(participants).filter((participant) => {
            return participant !== myid;
        });
        participantList.value = Object.keys(participants).map((key) => {
            return {
                [key]: participants[key],
            };
        });
        // console.log("key arr:", participantList.value);

        participantList.value = participantList.value.filter((item, index) => {
            const keyName: any = Object.keys(participantList.value[index])[0];
            // console.log("keyName arr:", keyName);
            return item[keyName] === "admin";
        });

        msgParticipantList.value = participantList.value;
        participantList.value = participantList.value.map((display) => {
            return Object.keys(display)[0];
        });
        console.log("剛註冊時的發送名單", participantList.value);
        if (participantList.value.length > 0) {
            isOnline.value = true;
        }
    };

    textPlugin.value.data({
        text: JSON.stringify(register),
        success: function () {
            let participants = {
                request: "listparticipants",
                room: Number(eventID(route.params.eventKey)),
            };
            textPlugin.value.send({ message: participants });
        },
        error: function (reason: any) {
            console.log("listparticipants error", reason);
            //TODO do something
        },
    });
};
const isAlreadyTaken = ref(false);
const onReload = () => {
    isAlreadyTaken.value = false;
    location.href = `/${eventKey.value}`;
};
// attach textroom plugin
const attachTextroomPlugin = () => {
    janus.value.attach({
        plugin: "janus.plugin.textroom",
        OPAQUEID: OPAQUEID,
        success: function (pluginHandle: IAttachPlugin) {
            textPlugin.value = pluginHandle;
            console.log(
                "Plugin attached! (" +
                    textPlugin.value.getPlugin() +
                    ", id=" +
                    textPlugin.value.getId() +
                    ")"
            );
            // Setup the DataChannel
            let body = { request: "setup" };
            console.log("Sending message:", body);
            textPlugin.value.send({ message: body });
            bugout.value.log("textroom註冊成功時間", dayjs().format("HH:mm:ss"));
        },
        error: function (error: any) {
            console.error("text-> Error attaching plugin...", error);
        },
        iceState: function (state: any) {
            console.log("text-> ICE state changed to " + state);
            if (state === "disconnected" && janusConnectStatus.value === true) {
                reloadFunction();
            }
            // bugout.value.log("ICE state", state);
        },
        mediaState: function (medium: any, on: any) {
            console.log(
                "text-> Janus " + (on ? "started" : "stopped") + " receiving our " + medium
            );
        },
        webrtcState: function (on: any) {
            console.log(
                "text-> Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now"
            );
        },
        onmessage: function (msg: any, jsep: any) {
            console.log("text-> Got a message ", msg);
            if (msg["error"]) {
                console.log(msg["error"]);
            }

            if (jsep) {
                textPlugin.value.createAnswer({
                    jsep: jsep,
                    media: { audio: false, video: false, data: true },
                    success: function (jsep: any) {
                        console.log("text-> Got SDP!", jsep);
                        let body = { request: "ack" };
                        textPlugin.value.send({ message: body, jsep: jsep });
                    },

                    error: function (error: any) {
                        console.error("text-> WebRTC error:", error);
                    },
                });
            }
        },
        ondataopen: function (data: any) {
            console.log("text-> The DataChannel is available!", data);
            // registerUsername(自己的username);
            const chatroomId = chatroomID(route.params.eventKey);
            registerUsername(chatroomId);
        },
        ondata: function (item: any) {
            console.log("text-> We got data from the DataChannel!", item);

            let json = JSON.parse(item);
            if (json.error_code !== undefined) {
                alert(`您已斷線,請按下確認以利重新整理!!! 錯誤訊息代碼為:${json.error_code}`);
                window.location.reload();
            }
            // console.log("text-> json:", json);
            if (json.error == "Username already taken") {
                isAlreadyTaken.value = true;
            }
            let transaction = json["transaction"];
            if (transactions[transaction]) {
                // Someone was waiting for this
                transactions[transaction](json);
                delete transactions[transaction];
                return;
            }
            let participantlist = json["participants"];
            if (participantlist?.length > 0) {
                participantlist = participantlist
                    .filter((item) => {
                        return item.username !== myid;
                    })
                    .map((key) => {
                        return {
                            [key.username]: key.display,
                        };
                    });
                participantlist = participantlist.filter((item, index) => {
                    const chatToken: any = Object.keys(participantlist[index])[0];
                    console.log("text-> chatToken:", chatToken);
                    return item[chatToken] === "admin";
                });
                participantList.value = participantlist.map((display) => {
                    return Object.keys(display)[0];
                });
                if (participantList.value.length > 0) {
                    isOnline.value = true;
                }
                console.log("text-> participants:", participantList.value);
            }
            let what = json["textroom"];
            let data: any = { what: what };
            if (what === "message") {
                // Incoming message: public or private?
                let msg = json["text"];
                msg = msg.replace(new RegExp("<", "g"), "&lt");
                msg = msg.replace(new RegExp(">", "g"), "&gt");
                let from = json["from"];
                let dateString = json["date"];
                let whisper = json["whisper"];

                data.whisper = whisper;
                data.date = dateString;
                data.from = participants[from];
                data.msg = msg;
            } else if (what === "announcement") {
                // Room announcement
                let msg = json["text"];
                msg = msg.replace(new RegExp("<", "g"), "&lt");
                msg = msg.replace(new RegExp(">", "g"), "&gt");
                let dateString = json["date"];

                data.date = dateString;
                data.msg = msg;
            } else if (what === "join") {
                // Somebody joined
                let username = json["username"];
                let display = json["display"];
                participants[username] = display ? display : username;
                data.username = username;
                data.display = display;
                console.log("有人 join 後頻道所有參與人:", participants);
                participantList.value = participants;
                //過濾掉自己
                participantList.value = Object.keys(participants).filter((participant) => {
                    return participant !== myid;
                });
                //map成新陣列
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                participantList.value = participantList.value.filter((item, index) => {
                    const keyName: any = Object.keys(participantList.value[index])[0];
                    return item[keyName] === "admin";
                });
                msgParticipantList.value = participantList.value;
                participantList.value = participantList.value.map((display) => {
                    return Object.keys(display)[0];
                });
                console.log("整理有人 join 後 訊息發送名單", participantList.value);
                if (participantList.value.length > 0) {
                    isOnline.value = true;
                }
            } else if (what === "leave") {
                // Somebody left
                let username = json["username"];
                delete participants[username];
                data.username = username;
                participantList.value = participants;
                //過濾掉自己
                participantList.value = Object.keys(participants).filter((participant) => {
                    return participant !== myid;
                });
                //map成新陣列
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                participantList.value = participantList.value.filter((item, index) => {
                    const keyName: any = Object.keys(participantList.value[index])[0];
                    return item[keyName] === "admin";
                });
                msgParticipantList.value = participantList.value;
                participantList.value = participantList.value.map((display) => {
                    return Object.keys(display)[0];
                });
                console.log("離開後剩餘的:", participantList.value);
            } else if (what === "kicked") {
                // Somebody was kicked
                let username = json["username"];
                let when = new Date();
                delete participants[username];
                if (username === myid) {
                    isAlreadyTaken.value = true;
                    janus.value.destroy();
                }

                data.username = username;
            } else if (what === "destroyed") {
                if (json["room"] !== MY_ROOM) return;
                // Room was destroyed, goodbye!
                console.log("text-> The room has been destroyed!");
            } else if (what === "success") {
                console.log("success 訊息確定發送成功:", data);
            }

            if (chatroomType.value === 0) {
                processDataEvent(data, route.params.eventKey);
            } else {
                groupChatProcessDataEvent(data, route.params.eventKey);
            }
        },
        oncleanup: function () {
            console.log("text-> ::: Got a cleanup notification :::");
            console.log("janus:", Janus);
        },
    });
};
function updateSimulcastButtons(substream: any, temporal: any) {
    throw new Error("Function not implemented.");
}
function addSimulcastButtons(arg0: boolean) {
    throw new Error("Function not implemented.");
}
const calling = ref();
const connecting = ref();
//video call plugin
const attachVideocallPlugin = () => {
    janus.value.attach({
        plugin: "janus.plugin.videocall",
        OPAQUEID: OPAQUEID,
        success: function (pluginHandle: IAttachPlugin) {
            callPlugin.value = pluginHandle;
            callPlugin.value.simulcastStarted = false;
            console.log(
                "Plugin attached! (" +
                    callPlugin.value.getPlugin() +
                    ", id=" +
                    callPlugin.value.getId() +
                    ")"
            );
            bugout.value.log("videoCall 註冊成功時間", dayjs().format("HH:mm:ss"));
        },
        error: function (error: any) {
            console.error("call->  -- Error attaching plugin...", error);
        },
        consentDialog: function (on: any) {
            console.log("call-> Consent dialog should be " + (on ? "on" : "off") + " now");
        },
        iceState: function (state: any) {
            console.log("call-> ICE state changed to " + state);
        },
        mediaState: function (medium: any, on: any) {
            console.log(
                "call-> Janus " + (on ? "started" : "stopped") + " receiving our " + medium
            );
        },
        webrtcState: function (on: any) {
            console.log(
                "call-> Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now"
            );
        },
        onmessage: function (msg: any, jsep: any) {
            console.log("call-> ::: Got a message :::", msg);
            let result = msg["result"];
            console.log("call-> result:", msg["error_code"]);
            if (msg["error_code"] === 475) {
                alert("客服人員皆忙線中,請稍後再撥!!");
            }
            if (result) {
                if (result["list"]) {
                    let list = result["list"];

                    console.log("call-> Got a list of registered peers:", list);
                    for (let mp in list) {
                        console.log("call->  >> [" + list[mp] + "]");
                    }
                } else if (result["event"]) {
                    let event = result["event"];

                    if (event === "registered") {
                        myusername = result["username"];
                        console.log("call-> Successfully registered as " + myusername + "!");
                        // Get a list of available peers, just for fun
                        callPlugin.value.send({ message: { request: "list" } });
                        // registerUsername(myusername);
                    } else if (event === "calling") {
                        console.log("call-> Waiting for the peer to answer...");
                        // TODO Any ringtone?
                        calling.value = setTimeout(() => {
                            // 撥打超過15秒， 自動掛掉
                            doHangup(1, eventID(route.params.eventKey), 1);
                            // console.log("setTimeOut 未關閉 又掛一次");
                        }, 15000);
                    } else if (event === "incomingcall") {
                        console.log("call-> Incoming call from " + result["username"] + "!");
                        yourUsername.value = result["username"];
                        jsepMsg.value = jsep;
                        isIncomingCall.value = true;
                        isAccepted.value = false;
                        // Notify user
                        // bootbox.hideAll();
                        //TODO 處理incomingcall event
                    } else if (event === "accepted") {
                        console.log("打電話 accepted");
                        clearTimeout(calling.value);
                        isAccepted.value = true;
                        let i = 1;
                        connecting.value = setInterval(() => {
                            phoneTime.value = convertTime(i++);
                        }, 1000);
                        let peer = result["username"];
                        if (!peer) {
                            console.log("Call started!");
                        } else {
                            console.log(peer + " accepted the call!");
                            yourUsername.value = peer;
                        }
                        // Video call can start
                        if (jsep) callPlugin.value.handleRemoteJsep({ jsep: jsep });
                        // setRecord();
                    } else if (event === "update") {
                        // An 'update' event may be used to provide renegotiation attempts
                        if (jsep) {
                            if (jsep.type === "answer") {
                                callPlugin.value.handleRemoteJsep({ jsep: jsep });
                            } else {
                                callPlugin.value.createAnswer({
                                    jsep: jsep,
                                    media: { video: false }, // Let's negotiate data channels as well
                                    success: function (jsep) {
                                        console.log("call-> Got SDP!", jsep);
                                        isAccepted.value = true;
                                        var body = { request: "set" };
                                        callPlugin.value.send({ message: body, jsep: jsep });
                                    },
                                    error: function (error) {
                                        console.error("WebRTC error:", error);
                                    },
                                });
                            }
                        }
                    } else if (event === "hangup") {
                        console.log(
                            "call-> Call hung up by " +
                                result["username"] +
                                " (" +
                                result["reason"] +
                                ")!"
                        );
                        if (result["reason"] === "User busy") {
                            alert("對方忙線中,請稍後再撥!!!");
                        }
                        clearInterval(connecting.value);
                        // Reset status
                        callPlugin.value.hangup();
                        phoneTime.value = "0:00";
                        isAccepted.value = false;
                        isIncomingCall.value = false;
                        phoneCallModal.value = false;
                        clearTimeout(calling.value);
                        // window.location.reload();
                    } else if (event === "simulcast") {
                        // Is simulcast in place?
                        let substream = result["substream"];
                        let temporal = result["temporal"];
                        if (
                            (substream !== null && substream !== undefined) ||
                            (temporal !== null && temporal !== undefined)
                        ) {
                            if (!simulcastStarted) {
                                simulcastStarted = true;
                                addSimulcastButtons(result["videocodec"] === "vp8");
                            }
                            // We just received notice that there's been a switch, update the buttons
                            updateSimulcastButtons(substream, temporal);
                        }
                    } else if (event === "set") {
                        console.log("call-> setRecord OK!" + jsep);
                    }
                }
            } else {
                // FIXME Error?
                let error = msg["error"];
                console.error(error);
                if (error.indexOf("already taken") > 0) {
                    // FIXME Use status codes...
                    //window.location.reload();
                }
                isIncomingCall.value = false;
                phoneCallModal.value = false;
                // TODO Reset status
                callPlugin.value.hangup();
            }
        },
        onlocalstream: function (stream: any) {
            console.log("call-> ::: Got a local stream :::", stream);
        },
        onremotestream: function (stream: any) {
            console.log("call-> ::: Got a remote stream :::", stream);
            //@ts-ignore
            Janus.attachMediaStream(document.getElementById("remotevideo"), stream);
        },
        ondataopen: function (data: any) {
            console.log("call-> The DataChannel is available!");
        },
        ondata: function (data: any) {
            console.log("call-> We got data from the DataChannel!", data);
        },
        oncleanup: function () {
            console.log("call-> ::: Got a cleanup notification :::");
            yourUsername.value = null;
            simulcastStarted = false;
            isIncomingCall.value = false;
            phoneCallModal.value = false;
        },
    });
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.mask2 {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    .popUp {
        border-radius: 20px;
        width: 342px;
        height: auto;
        min-height: 100px;
        padding: 15px;
        line-height: 1.6;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        .btnWrap {
            text-align: center;
            display: block;
            padding-bottom: 10px;
        }
    }
    .popUp2 {
        text-align: center;
        border-radius: 20px;
        width: 342px;
        height: auto;
        min-height: 100px;
        padding: 15px;
        line-height: 100px;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
    }
}

.chat-room {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    grid-area: body;
    background-color: $gray-8;
}
.description {
    width: 100%;
    text-align: center;
    margin: 1em auto;
    color: $gray-1;
    @extend %h4;
    line-height: 1.6;
}
.call_container {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    li {
        text-align: center;
        .icon {
            display: block;
            width: 60px;
            height: 60px;
            img {
                width: 100%;
            }
        }
        // button.icon {
        //     border: none;
        //     background: url("~@/assets/Images/common/connect-round.svg") no-repeat center;
        // }
    }
    h4.text {
        @extend %h4;
        margin-top: 10px;
        color: $gray-1;
    }
}
</style>

<template>
    <n-layout-header class="header" bordered>
        <h1
            class="logo"
            v-if="
                route.path == `/chat` ||
                route.path == `/chat/${eventID}` ||
                route.path == `/gallery/${eventID}`
            "
        >
            {{ eventInfo.name }}
        </h1>
        <h1 class="logo" v-else>
            {{ showTitle() }}
        </h1>
        <ul class="pages">
            <li class="btnBg" v-if="isAdmin >= 1">
                <p>使用者:{{ userName }}</p>
            </li>
            <li class="btnBg">
                點數<span class="point">{{ point }}點</span>(<a
                    class="store-value"
                    href="https://www.teamplus.tech/product/every8d-prepaid/"
                    target="_blank"
                    >儲值</a
                >)
            </li>
            <li class="btnBg" v-if="isAdmin >= 1">
                <router-link :to="`${eventID}` ? `/manage/${eventID}/SMSSend` : `/manage/SMSSend`">
                    管理功能
                </router-link>
            </li>
            <li class="btnBg myChatRoom">
                <n-dropdown
                    class="dropdown"
                    trigger="click"
                    :options="options"
                    @select="handleSelect"
                >
                    <n-badge class="dot" :dot="hasUnread">頻道列表</n-badge>
                </n-dropdown>
            </li>
            <li v-if="!access_token" @click="gotoLogIn">登入</li>
            <li class="chevron" v-if="access_token" @click="gotoLogIn">登出</li>
        </ul>
    </n-layout-header>
    <teleport to="body" v-if="isFirstLogin">
        <div class="mask">
            <div class="previewWrap">
                <a @click="onCloseModel" class="close"><img :src="closeIcon" /></a>
                <div v-if="currentStep == 1">
                    <p>
                        歡迎加入 talkOD 客戶線上溝通雲端服務平台！<br />請點擊【我要導覽】瞭解各項功能與操作唷～
                    </p>
                    <button @click="onNext" class="button">我要導覽</button>
                </div>
                <div v-if="currentStep == 2">
                    <p>首先，請點擊【管理功能】，所有重要管理工具都能在這裡找到！</p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 3">
                    <p>接著，請點擊【活動頻道管理】</p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 4">
                    <p>
                        在【活動頻道管理】頁裡, 請點擊上方「＋」符號，來建立您的第一間『活動頻道』
                    </p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 5">
                    <p>
                        請在【編輯活動頻道】依序建立活動頻道的頭像、名稱、網址、簡介，並選擇能於此頻道與客戶對話的客服人員；此外，免費(網路)通話功能如果要啟用別忘了勾選唷～
                    </p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 6">
                    <p>
                        建立完成基本資訊後，請點擊【新增歡迎訊息】，最多能建立三則帶有文字、圖片或檔案的歡迎訊息，讓客戶一進到talkOD聊天室就能看到喔！
                    </p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 7">
                    <p>活動頻道建立完成後，就能在【活動頻道管理】的列表中看到囉！</p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 8">
                    <p>
                        接下來，回到【管理功能】發送「SMS文字簡訊」或「MMS多媒體訊息」，並在「發送頻道」選擇您建立的活動頻道，並依序填妥內容後發送簡訊；客戶收到簡訊點擊連結就能透過瀏覽器開啟聊天室並跟您對話囉！
                    </p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 9">
                    <p>
                        最後，您只要點擊【我的聊天室】並選擇活動頻道，在選擇左側客戶列表選擇對象就能開始對話！
                    </p>
                    <button @click="onNext" class="button">下一步</button>
                </div>
                <div v-if="currentStep == 10">
                    <p>
                        提醒您，點數是用來發送簡訊，請隨時注意點數是否充足，若不足請盡早【儲值】唷～
                    </p>
                    <button @click="onCloseModel" class="button">完成</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, ref, watchEffect, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { NDropdown, NBadge, NIcon, NLayoutHeader } from "naive-ui";
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import axios from "axios";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { OPAQUEID, MY_ROOM, JANUS_URL, convertTime } from "@/util/commonUtil";
import { processDataEvent, onHangup, onError, randomString } from "@/util/chatUtil";
import { ITransactions, IAttachPlugin } from "@/util/interfaceUtil";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";

const route = useRoute();
const params = route.params;
const path = ref();

//modal store
const modelStore = useModelStore();
const { phoneCallModal, showDropdown } = storeToRefs(modelStore);

//Chat store
const chatStore = useChatStore();
const { textPlugin, participantList, onlineList, isOnline, messageFrom, messageForm } =
    storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const { callPlugin, yourUserChatroomID, jsepMsg, isIncomingCall, isAccepted, phoneTime, isMuted } =
    storeToRefs(phoneCallStore);

// api store
const apiStore = useApiStore();
const { getPoint, getEventApi, getChatroomlistApi, getHistoryApi } = apiStore;
const { eventInfo, point, isJanusinit, eventList, isInput, chatroomList } = storeToRefs(apiStore);
const access_token = localStorage.getItem("access_token");
const userName = ref(localStorage.getItem("userName"));

const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);
const eventID: any = ref("");

const isFirstLogin = ref(false);
const currentStep = ref(1);

const onNext = () => {
    currentStep.value += 1;
};

const hasUnread = computed(() => {
    return (
        chatroomList.value.some((item) => {
            return item.unread === 1;
        }) || messageFrom.value !== ""
    );
});

//未登入跳回登入頁
onBeforeMount(() => {
    if (!access_token) {
        alert("您尚未登入!!!");
        location.href = "/";
    }
});

const gotoLogIn = () => {
    location.href = "/";
};

// adminStatus: 0-客服, 1-管理者,
const isAdmin: number | null = Number(localStorage.getItem("adminStatus"));
const adminStatus = localStorage.getItem("adminStatus");
const accountID = localStorage.getItem("accountID");
onMounted(() => {
    axios
        .get(`${config.serverUrl}/v1/eventlist`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then((res: any) => {
            console.log("eventlist res:", res.data.eventList);
            if (route.params.id) {
                eventID.value = route.params.id;
            }
            eventList.value = res.data.eventList;
            eventID.value = route.params.id ? route.params.id : eventList.value[0].eventID;
            isFirstLogin.value = eventList.value.length <= 0; // 判斷第一次進入開啟導覽
            getEventApi(eventID.value);
        })
        .catch((err: any) => {
            console.error(err);
            const admin = localStorage.getItem("adminStatus");
            if (err.response.status === 404 && admin === "0") {
                alert(
                    "請聯絡talkOD系統管理者(與EVERY8D系統管理者為同一人)，將您的帳號加入talkOD活動頻道，才能在「我的聊天室」內進行交談喔！"
                );
            }
            if (err.response && [-4].includes(err.response.data.status)) {
                alert("您的帳號在其他設備使用, 請重新登入!!");
                location.href = "/";
            }
        });
    getPoint();
});

const showTitle = () => {
    const managePath = eventID.value ? `/manage/${eventID.value}` : `/manage`;
    if (route.path === `${managePath}/SMSSend` || route.path === `${managePath}/SMSSendPage2`) {
        return "SMS發送";
    }
    if (route.path === `${managePath}/SMSInquire`) {
        return "SMS發送查詢";
    }
    if (route.path === `${managePath}/MMSSend` || route.path === `${managePath}/MMSSendPage2`) {
        return "MMS發送";
    }
    if (route.path === `${managePath}/MMSInquire`) {
        return "MMS發送查詢";
    }
    if (route.path === `${managePath}/activitySetting`) {
        return "活動頻道管理";
    }

    if (route.path === `${managePath}/activitySetting/addCustomService`) {
        return "編輯客服人員";
    }
    if (route.path === `${managePath}/activitySetting/addChannel`) {
        return "新增活動頻道";
    }
    if (route.path === `${managePath}/activitySetting/editChannel`) {
        return "編輯活動頻道";
    }
    if (route.path === `${managePath}/activitySetting/addAutoReply`) {
        return "建立自動回覆訊息";
    }
    if (route.path === `${managePath}/activitySetting/autoReplyList`) {
        return "自動回覆訊息列表";
    }
    if (route.path === `${managePath}/manageSetting`) {
        return "管理者設定";
    }
};

let janus: any = null;
let myid: any = null;
let myusername: any = null;
let transactions: any = {};
let participants: any = {};
let simulcastStarted: any = false;
let audioenabled = false;

const onCloseModel = () => {
    isFirstLogin.value = false;
};
const options: any = computed(() => {
    return eventList.value.map((item) => {
        return {
            label: item.name,
            key: item.eventID,
        };
    });
});
const handleSelect = (key: string | number) => {
    console.log("key:", key);
    location.href = `/chat/${key}`;
};

var iOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) !== -1;
var eventName = iOS ? "pagehide" : "beforeunload";
const getEventID = computed(() => (route.params.id ? `/chat/${route.params.id}` : "/chat"));

document.addEventListener("visibilitychange", (event) => {
    if (route.path !== getEventID.value) return;
    if (document.visibilityState === "hidden") {
        janus.destroy();
        return;
    }
    if (document.visibilityState === "visible") {
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
                getChatroomlistApi(route.params.id);
                getHistoryApi(route.query.chatroomID, route.params.id);
            },
        });
        return;
    }
});
// 連線
const connect = () => {
    janus = new Janus({
        server: JANUS_URL,
        success: () => {
            attachTextroomPlugin();
            attachVideocallPlugin();
        },
        error: (error: any) => {
            onError("Failed to connect to janus server", error);
            if (!navigator.userAgent.match("CriOS")) {
                // 判斷 Chrome for iOS
                alert("連線中斷,按下確認重新連線");
                window.location.reload();
            }
        },
        destroyed: () => {
            console.log("destroyed");
        },
    });
};
watchEffect(() => {
    const chatRoomIDArr = Object.keys(onlineList.value);
    // console.log("chatRoomIDincludes", chatRoomIDArr.includes(chatRoomID.value));

    if (chatRoomIDArr.includes(chatRoomID.value)) {
        isOnline.value = true;
        return;
    }
    isOnline.value = false;
});

//janus 初始值
watchEffect(() => {
    if (!isJanusinit.value) {
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
        isJanusinit.value = true;
    }
});

// 註冊 for me
const registerUsername = (username: undefined | string) => {
    if (username === "") {
        return;
    }

    // myid = randomString(12);
    myid = username;
    let transaction = randomString(12);
    let register = {
        textroom: "join",
        transaction: transaction,
        room: Number(eventID.value),
        username: myid,
        display: "admin",
    };

    myusername = username;
    transactions[transaction] = function (response: ITransactions) {
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                console.log("No such room : <code>" + eventID.value + "</code>");
            } else {
                console.log("response[error]", response["error"]);
            }

            console.log("chat error participants:", response.participants);
            return;
        }

        //registration
        let register = { request: "register", username: username };
        callPlugin.value.send({ message: register });

        console.log("chat participants:", response.participants);
        // Any participants already in?
        if (response.participants && response.participants.length > 0) {
            for (let i in response.participants) {
                let p = response.participants[i];
                participants[p.username] = p.display ? p.display : p.username;
            }
            //TODO do something

            participantList.value = Object.keys(participants).map((key) => {
                return {
                    [key]: participants[key],
                };
            });
            onlineList.value = participants;
            const chatRoomIDArr = Object.keys(onlineList.value);
            // console.log("chat Arr:", chatRoomIDArr);
            // console.log("chatId:", chatRoomID.value);
            // console.log("chat eventID:", eventID.value);
            if (chatRoomIDArr.includes(chatRoomID.value)) {
                isOnline.value = true;
                const message: any = {
                    textroom: "message",
                    transaction: randomString(12),
                    room: Number(eventID.value),
                    // tos: [全部在線客服1,全部在線客服2],
                    tos: [chatRoomID.value],
                    text: "pin",
                };
                textPlugin.value.data({
                    text: JSON.stringify(message),
                    error: function (reason: any) {
                        console.log("error:", reason);
                    },
                    success: function () {
                        console.log("gotoChat pin");
                    },
                });
            }
        }
    };
    textPlugin.value.data({
        text: JSON.stringify(register),
        error: function (reason: any) {
            console.log(reason);
            //TODO do something
        },
    });
};
// attach textroom plugin
const attachTextroomPlugin = () => {
    janus.attach({
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
        },
        error: function (error: any) {
            console.error("text-> Error attaching plugin...", error);
        },
        iceState: function (state: any) {
            // @ts-ignore
            Janus.log("text-> ICE state changed to " + state);
        },
        mediaState: function (medium: any, on: any) {
            // @ts-ignore
            Janus.log("text-> Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
        },
        webrtcState: function (on: any) {
            // @ts-ignore
            Janus.log(
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
            const myUserName = randomString(7);
            registerUsername(myUserName);
        },
        ondata: function (item: any) {
            console.log("text-> We got data from the DataChannel!", item);

            let json = JSON.parse(item);
            // console.log("json", json);
            let transaction = json["transaction"];
            if (transactions[transaction]) {
                // Someone was waiting for this
                transactions[transaction](json);
                delete transactions[transaction];
                return;
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
                // console.log("recall msgobj", msg);
                const isrecall = JSON.parse(msg);
                // console.log("isrecall", isrecall);
                if (isrecall.recall === "recall") {
                    isInput.value = true;
                    getHistoryApi(chatRoomID.value, route.params.id);
                }
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
                data.mobile = mobile.value;
                // console.log("participants 處理前:", participants);
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                onlineList.value = participants;
                const chatRoomIDArr = Object.keys(onlineList.value);
                if (chatRoomIDArr.includes(chatRoomID.value)) {
                    isOnline.value = true;
                }
                // console.log("participantList 處理後", participantList.value);
            } else if (what === "leave") {
                // Somebody left
                let username = json["username"];
                delete participants[username];
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                data.username = username;
                onlineList.value = participants;
                const chatRoomIDArr = Object.keys(onlineList.value);
                if (chatRoomIDArr.includes(chatRoomID.value)) {
                    isOnline.value = false;
                }
            } else if (what === "kicked") {
                // Somebody was kicked
                let username = json["username"];
                let when = new Date();
                delete participants[username];
                if (username === myid) {
                    console.log("你被踢出房間");
                    window.location.reload();
                }
                data.username = username;
            } else if (what === "destroyed") {
                if (json["room"] !== route.params.id) return;
                // Room was destroyed, goodbye!
                console.log("text-> 房間已銷毀!");
                window.location.reload();
            } else if (what === "success") {
                console.log("success:", data);

                // getHistoryApi(chatRoomID.value);
                // getChatroomlistApi(route.params.id);
            }

            processDataEvent(data, chatRoomID.value, route.params.id);
        },
        oncleanup: function () {
            // @ts-ignore
            Janus.log("text-> ::: Got a cleanup notification :::");
            console.log("janus:", Janus);
        },
    });
};
function updateSimulcastButtons(substream: any, temporal: any) {
    throw new Error("Function not implemented.");
}
function addSimulcastButtons(temporal) {
    if (!temporal)
        // No temporal layer support
        return;
}
const calling = ref();
const connecting = ref();
//video call plugin
const attachVideocallPlugin = () => {
    janus.attach({
        plugin: "janus.plugin.videocall",
        OPAQUEID: OPAQUEID,
        success: function (pluginHandle: IAttachPlugin) {
            console.log("pluginHandle:", pluginHandle);
            callPlugin.value = pluginHandle;
            console.log(
                "Plugin attached! (" +
                    callPlugin.value.getPlugin() +
                    ", id=" +
                    callPlugin.value.getId() +
                    ")"
            );
        },
        error: function (error: any) {
            // @ts-ignore
            Janus.error("call->  -- Error attaching plugin...", error);
        },
        consentDialog: function (on: any) {
            // @ts-ignore
            Janus.debug("call-> Consent dialog should be " + (on ? "on" : "off") + " now");
        },
        iceState: function (state: any) {
            // @ts-ignore
            Janus.log("call-> ICE state changed to " + state);
        },
        mediaState: function (medium: any, on: any) {
            // @ts-ignore
            Janus.log("call-> Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
        },
        webrtcState: function (on: any) {
            // @ts-ignore
            Janus.log(
                "call-> Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now"
            );
        },
        onmessage: function (msg: any, jsep: any) {
            console.log("call-> ::: Got a message :::", msg);
            let result = msg["result"];
            if (result) {
                if (result["list"]) {
                    let list = result["list"];
                    console.log("call-> Got a list of phone registered peers:", list);
                    for (let mp in list) {
                        console.log("call list->  >> [" + list[mp] + "]");
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
                        // TODO Any ringtone?
                        calling.value = setTimeout(() => {
                            // 撥打超過15秒， 自動掛掉
                            doHangup(1, chatRoomID.value, route.params.id);
                        }, 15000);
                        console.log("call-> Waiting for the peer to answer...");
                    } else if (event === "incomingcall") {
                        // @ts-ignore
                        Janus.log("call-> Incoming call from " + result["username"] + "!");
                        yourUserChatroomID.value = result["username"];
                        jsepMsg.value = jsep;
                        isIncomingCall.value = true;
                        isAccepted.value = false;
                        getChatroomlistApi(route.params.id, yourUserChatroomID.value);
                        // Notify user
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
                            yourUserChatroomID.value = peer;
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
                                    media: { audio: true }, // Let's negotiate data channels as well
                                    success: function (jsep: any) {
                                        console.log("call-> Got SDP!", jsep);
                                        isAccepted.value = true;
                                        let msg = { request: "set" };
                                        callPlugin.value.send({ message: msg, jsep: jsep });
                                    },
                                    error: function (error: any) {
                                        console.error("call-> WebRTC error:", error);
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
                        phoneTime.value = "0:00";
                        isAccepted.value = false;
                        console.log("phoneTime", phoneTime.value);
                        console.log("電話時間清0!!");
                        // Reset status
                        callPlugin.value.hangup();
                        isIncomingCall.value = false;
                        phoneCallModal.value = false;
                        clearTimeout(calling.value);
                        // location.href = route.query
                        //     ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
                        //     : `/chat/${eventID.value}`;
                    } else if (event === "simulcast") {
                        // Is simulcast in place?
                        var substream = result["substream"];
                        var temporal = result["temporal"];
                        if (
                            (substream !== null && substream !== undefined) ||
                            (temporal !== null && temporal !== undefined)
                        ) {
                            if (!simulcastStarted) {
                                simulcastStarted = true;
                                addSimulcastButtons(
                                    result["videocodec"] === "vp8" ||
                                        result["videocodec"] === "h264"
                                );
                            }
                            // We just received notice that there's been a switch, update the buttons
                            updateSimulcastButtons(substream, temporal);
                        }
                    } else if (event === "set") {
                        console.log("call-> setRecord OK!" + event);
                    }
                }
            } else {
                // FIXME Error?
                let error = msg["error"];
                console.error(error);
                if (error.indexOf("already taken") > 0) {
                    // FIXME Use status codes...
                }
                isIncomingCall.value = false;
                phoneCallModal.value = false;
                // TODO Reset status
                callPlugin.value.hangup();
                // onHangup();
                // location.href = route.query
                //     ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
                //     : `/chat/${eventID.value}`;
            }
        },
        onlocalstream: function (stream: any) {
            console.log("call-> ::: Got a local stream :::", stream);
        },
        onremotestream: function (stream: any) {
            console.log("call-> ::: Got a remote stream :::", stream);
            Janus.attachMediaStream(document.getElementById("remotevideo"), stream);
        },
        ondataopen: function (data: any) {
            // @ts-ignore
            Janus.log("call-> The DataChannel is available!");
        },
        ondata: function (data: any) {
            // @ts-ignore
            Janus.debug("call-> We got data from the DataChannel!", data);
        },
        oncleanup: function () {
            // @ts-ignore
            Janus.log("call-> ::: Got a cleanup notification :::");
            yourUserChatroomID.value = null;
            simulcastStarted = false;
            isIncomingCall.value = false;
            phoneCallModal.value = false;
            // callPlugin.value.hangup();
            // location.href = route.query
            //     ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
            //     : `/chat/${eventID.value}`;
        },
    });
};
</script>
<style lang="scss">
@import "~@/assets/scss/var";
.n-dropdown-menu.dropdown.n-popover.n-dropdown {
    margin-top: 13px !important;
}
.dropdown.n-popover {
    width: 100%;
}
.n-badge.dot {
    color: $gray-1;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
$headerHeight: 80px;

.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .previewWrap {
        position: relative;
        width: 600px;
        min-height: 200px;
        color: $gray-1;
        font-size: $font-size-20;
        border-radius: 10px;
        background: $white url("~@/assets/Images/common/guide-pages-bg.png") no-repeat top left;
        background-size: 600px auto;
        text-align: center;
        padding: 45px;
        line-height: 1.6;
        .close {
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 15px;
        }
        .button {
            background-color: $primary-1;
            border-radius: 20px;
            color: $white;
            font-size: $font-size-16;
            border: none;
            padding: 8px 25px;
            margin-top: 45px;
            cursor: pointer;
            &:hover {
                background-color: $primary-2;
            }
        }
    }
}
.userInfo {
    margin-top: 0 !important;
    .n-popover-arrow-wrapper .n-popover-arrow {
        width: 18px;
        height: 18px;
        bottom: -12px !important;
    }
}

.header-list {
    padding: 0.5em 0 1em;
    .n-divider:not(.n-divider--vertical) {
        margin-top: 1em;
        margin-bottom: 1em;
    }
    .title {
        font-size: $font-size-12;
        padding-top: 0.5em;
        margin-bottom: 1em;
        font-weight: 900;
    }
    .item {
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.8em;
        &:last-child {
            border-bottom: none;
        }
        a {
            text-decoration: none;
            color: #01bad4;
            &:hover {
                color: #95ecfa;
            }
        }
        + .item {
            margin-top: 0.8em;
        }
    }
}

.header {
    width: 100%;
    height: $headerHeight;
    background-color: $white;
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: #d9d9d9 0 0 3px 0;
}
.logo {
    display: flex;
    align-items: center;
    @extend %h1;
}
.pages {
    display: flex;
    align-items: center;
    li {
        + li {
            margin-left: 30px;
        }
        &.btnBg {
            &.myChatRoom {
                cursor: pointer;
            }
            border-radius: 20px;
            box-shadow: $gray-6 1px 2px 4px 0;
            background-color: $primary-4;
            padding: 10px 20px;
            @extend %h4;
            &:hover {
                background-color: $primary-5;
            }
        }

        a {
            text-decoration: none;
            color: $gray-1;
            &:hover {
                color: $gray-3;
            }

            &.store-value {
                text-decoration: underline;
            }
        }
        a.router-link-exact-active,
        a.active {
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: center;
            font-weight: bold;
        }
        &.chevron {
            height: auto;
            line-height: normal;
            cursor: pointer;
            .n-icon {
                font-size: $font-size-24;
            }
        }
    }
}
.point {
    color: $danger;
}
</style>

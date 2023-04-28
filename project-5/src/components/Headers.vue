<template>
    <n-layout-header class="header" bordered>
        <h1 class="header__logo">
            {{
                route.name === "ChatRoom"
                    ? eventInfo.name
                    : route.name === "GroupChatArea"
                    ? groupChatEvent?.name
                    : titleObj[route.name]
            }}
        </h1>
        <div class="header__pagesouter">
            <ul class="header__pages">
                <li v-if="isAdmin >= 1" id="guide2">
                    <div class="link" @click.stop="gotoManage">管理功能</div>
                </li>
                <li class="groupChat">
                    <div class="link" @click.stop="gotoGroupChat">群組聊天</div>
                    <div class="dot" style="color: red" v-show="groupChatHasUnread">●</div>
                </li>
                <li id="guide10" class="my-chatRoom">
                    <n-dropdown
                        class="dropdown"
                        trigger="click"
                        :options="options"
                        @select="handleSelect"
                    >
                        <n-badge class="dot" :dot="hasUnread">頻道列表</n-badge>
                    </n-dropdown>
                </li>
            </ul>
            <img
                :src="profileIcon"
                style="margin-left: 15px"
                @click="gotoProfile"
                v-if="!profile.icon"
            />
            <img
                :src="`${config.fileUrl}${profile.icon}`"
                style="margin-left: 15px"
                @click="gotoProfile"
                v-else
            />
        </div>
    </n-layout-header>
    <teleport to="body" v-if="isFirstLogin === true">
        <div :class="['mask', { closeMask: isCloseMask }]">
            <div
                :class="[
                    'wrap',
                    {
                        wrapMove: isWrapMove,
                        wrapMove2: isWrapMove2,
                        wrapMove3: isWrapMove3,
                        wrapMove4: isWrapMove4,
                    },
                ]"
            >
                <a @click="onCloseModel" class="close"><img :src="closeIcon" /></a>
                <div v-if="currentStep == 1">
                    <p>
                        歡迎加入 互動回覆簡訊 客戶線上溝通雲端服務平台！<br />請點擊【我要導覽】瞭解各項功能與操作唷～
                    </p>

                    <button @click="onNext" class="button">我要導覽</button>
                    <n-checkbox class="cancelDriver" v-model:checked="cancelDriver"
                        >不再顯示新手導覽
                    </n-checkbox>
                </div>
                <div v-if="currentStep == 2">
                    <p>首先，請點擊【管理功能】，所有重要管理工具都能在這裡找到！</p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 3">
                    <p>接著，請點擊【活動頻道管理】</p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 4">
                    <p>請點擊上方「＋」符號，來建立您的第一間『活動頻道』</p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 5">
                    <p>
                        請在【新增活動頻道】依序建立活動頻道的頭像、名稱、網址、簡介，並選擇能於此頻道與客戶對話的客服人員；此外，免費(網路)通話功能如果要啟用別忘了勾選唷～
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 6">
                    <p>
                        建立完成基本資訊後，請點擊【新增預設訊息】，最多能建立三則帶有文字、圖片或檔案的歡迎訊息，讓客戶一進到[互動回覆簡訊]聊天室就能看到喔！
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 7">
                    <p>活動頻道建立完成後，就能在【活動頻道管理】的列表中看到囉！</p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 8">
                    <p>
                        <!-- 接下來，回到【管理功能】發送「SMS文字簡訊」或「MMS多媒體訊息」，並在「發送頻道」選擇您建立的活動頻道，並依序填妥內容後發送簡訊；客戶收到簡訊點擊連結就能透過瀏覽器開啟聊天室並跟您對話囉！ -->
                        接下來，回到【管理功能】發送「SMS文字簡訊」或「MMS多媒體訊息」。
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 9">
                    <p>
                        在「發送頻道」選擇您建立的活動頻道，並依序填妥內容後發送簡訊；客戶收到簡訊點擊連結就能透過瀏覽器開啟聊天室並跟您對話囉！
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 10">
                    <p>
                        最後，您只要點擊【頻道列表】並選擇活動頻道，再選擇左側客戶列表選擇對象就能開始對話！
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onNext" class="button">下一步</button>
                    </div>
                </div>
                <div v-if="currentStep == 11">
                    <p>
                        提醒您，點數是用來發送簡訊，請隨時注意點數是否充足，若不足請盡早【儲值】唷～
                    </p>
                    <div class="buttons">
                        <button @click="onPrevious" class="button">上一步</button>
                        <button @click="onCloseModel" class="button">完成</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="isFirstLogin === true">
        <div class="mask1" :class="{ closeMask: isCloseMask1 }"></div>
    </teleport>
    <Loading :isLoading="isLoading" />
    <AlertPopUp
        :alertMessage="alertMessage"
        :alertEvent="alertEvent"
        @clearAlertMessage="clearAlertMessage"
    />
</template>

<script lang="ts" setup>
import {
    computed,
    reactive,
    onMounted,
    ref,
    watch,
    watchEffect,
    nextTick,
    onBeforeMount,
    h,
    onBeforeUnmount,
    onUnmounted,
} from "vue";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import { NDropdown, NBadge, NIcon, NLayoutHeader, NCheckbox } from "naive-ui";
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import axios from "axios";
import { Debugout } from "debugout.js";
import { RefreshOutline, SyncOutline, Ellipse } from "@vicons/ionicons5";
import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { OPAQUEID, MY_ROOM, JANUS_URL, convertTime, isMobile } from "@/util/commonUtil";
import { processDataEvent, onHangup, onError, randomString, notifyMe } from "@/util/chatUtil";
import { groupChatProcessDataEvent } from "@/util/groupChatUtil";
import { ITransactions, IAttachPlugin } from "@/util/interfaceUtil";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import profileIcon from "@/assets/Images/manage/User-round_g.svg";
import Loading from "@/components/LoadingPage.vue";
import AlertPopUp from "@/components/AlertPopUp.vue";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import { messaging } from "../firebase/config";
import { getToken, onMessage } from "firebase/messaging";

const route = useRoute();
const router = useRouter();

//modal store
const modelStore = useModelStore();
const { phoneCallModal, showDropdown } = storeToRefs(modelStore);

//Chat store
const chatStore = useChatStore();
const {
    janusArr,
    transactions,
    textPlugin,
    participantList,
    adminParticipantsWithOutMe,
    onlineList,
    isOnline,
    messageFrom,
    messageForm,
    meJoinAlready,
    notification,
} = storeToRefs(chatStore);
//groupChat store
const groupChatRecordStore = useGroupChatRecordStore();
const { groupChatRecordMessages, oldArr } = storeToRefs(groupChatRecordStore);
//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const {
    callPlugin,
    yourUserChatroomID,
    jsepMsg,
    isIncomingCall,
    isAccepted,
    phoneTime,
    isMuted,
    phoneAlertMessage,
} = storeToRefs(phoneCallStore);

// api store
const apiStore = useApiStore();
const {
    getPoint,
    getEventApi,
    getChatroomlistApi,
    getHistoryApi,
    logDiary,
    closeGuide,
    profileGetData,
    getGroupChatHistoryApi,
} = apiStore;
const {
    eventInfo,
    point,
    pointStatus,
    isJanusinit,
    eventList,
    eventListHeartBeats,
    isInput,
    chatroomList,
    messageList,
    diaryLog,
    bugout,
    isFirstLogin,
    isCloseMask,
    isCloseMask1,
    currentStep,
    apiAlertMessage,
    profile,
    chatroomListLoading,
    groupChatMessageList,
    groupChatEvent,
    labelChannelList,
} = storeToRefs(apiStore);

//alert popup
const alertMessage = ref("");
const alertEvent = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
watchEffect(() => {
    if (apiAlertMessage.value !== "") {
        alertMessage.value = apiAlertMessage.value;
    }
    if (phoneAlertMessage.value !== "") {
        alertMessage.value = phoneAlertMessage.value;
    }
});

const access_token = localStorage.getItem("access_token");
const userName = ref(localStorage.getItem("userName"));
const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);
const eventID: any = ref("");
// 第一次登入新手導覽
const driver = new Driver({
    // opacity: 0,
    // className: 'testdriver',
    // 是否開啟動畫
    animate: false,
    // 禁止点击蒙版关闭
    allowClose: false,
    // closeBtnText: "關閉",
    // nextBtnText: "下一步",
    // prevBtnText: "上一步",
    // doneBtnText: "完成",
});
//判斷新手教學
onMounted(() => {
    if (isAdmin >= 1) {
        isFirstLogin.value = localStorage.getItem("guide") === "1" ? true : false;
    }
});
//是否取消新手導引
const cancelDriver = ref(Number(localStorage.getItem("guide")) === 1 ? false : true);
// 是否顯示guide7(圖片顯示)
const isShowGuide7 = ref(false);
// 是否移動wrap
const isWrapMove = ref(false);
const isWrapMove2 = ref(false);
const isWrapMove3 = ref(false);
const isWrapMove4 = ref(false);
// 下一步
const onNext = () => {
    currentStep.value += 1;
};
// 上一步
const onPrevious = () => {
    currentStep.value -= 1;
    if (currentStep.value === 1) {
        isCloseMask1.value = false;
    }
    isShowGuide7.value = false;
    chatStore.saveGuide7(isShowGuide7.value);
};
// 關閉引導
const onCloseModel = () => {
    if ((Number(localStorage.getItem("guide")) === 1 ? true : false) === cancelDriver.value) {
        closeGuide(!cancelDriver.value);
        localStorage.setItem("guide", cancelDriver.value === true ? "0" : "1");
    }
    driver.reset();
    isFirstLogin.value = false;
    isCloseMask.value = true;
    isCloseMask1.value = true;
    isShowGuide7.value = false;
    chatStore.saveGuide7(isShowGuide7.value);
};
// 監聽引導步驟
watch(
    currentStep,
    (step) => {
        switch (step) {
            case 1:
                // isCloseMask1.value = false;
                isShowGuide7.value = false;
                driver.reset();
                break;
            case 2:
                isCloseMask1.value = true;
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                router.push(`/manage/0/SMSSend`);
                setTimeout(() => {
                    driver.highlight("#guide2");
                }, 0);
                break;
            case 3:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                driver.highlight("#guide3");
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/activitySetting`);
                } else {
                    router.push(`/manage/activitySetting`);
                }
                break;
            case 4:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                setTimeout(() => {
                    driver.highlight("#guide4");
                }, 0);
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/activitySetting`);
                } else {
                    router.push(`/manage/activitySetting`);
                }
                break;
            case 5:
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/activitySetting/addChannel`);
                } else {
                    router.push(`/manage/activitySetting/addChannel`);
                }
                isWrapMove.value = true;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                setTimeout(() => {
                    driver.highlight("#guide5");
                }, 0);
                break;
            case 6:
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/activitySetting/addChannel`);
                } else {
                    router.push(`/manage/activitySetting/addChannel`);
                }
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isWrapMove4.value = true;
                isShowGuide7.value = false;
                setTimeout(() => {
                    driver.highlight("#guide6");
                }, 0);
                break;
            case 7:
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/activitySetting`);
                } else {
                    router.push(`/manage/activitySetting`);
                }
                isCloseMask1.value = true;
                isWrapMove.value = false;
                isWrapMove2.value = true;
                isShowGuide7.value = true;
                isWrapMove4.value = false;
                chatStore.saveGuide7(isShowGuide7.value);
                setTimeout(() => {
                    driver.highlight({
                        element: "#guide7",
                    });
                }, 0);
                break;
            case 8:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                isWrapMove4.value = false;
                chatStore.saveGuide7(isShowGuide7.value);
                if (eventID.value) {
                    router.push(`/manage/${eventID.value}/SMSSend`);
                } else {
                    router.push(`/manage/SMSSend`);
                }
                driver.highlight("#guide8");
                break;
            case 9:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                isWrapMove3.value = true;
                isWrapMove4.value = false;
                chatStore.saveGuide7(isShowGuide7.value);
                driver.highlight("#guide9");
                break;
            case 10:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                isWrapMove3.value = false;
                isWrapMove4.value = false;
                chatStore.saveGuide7(isShowGuide7.value);
                driver.highlight("#guide10");
                break;
            case 11:
                isWrapMove.value = false;
                isWrapMove2.value = false;
                isShowGuide7.value = false;
                isWrapMove3.value = false;
                isWrapMove4.value = false;
                chatStore.saveGuide7(isShowGuide7.value);
                driver.highlight("#guide11");
                break;
        }
    },
    { immediate: true }
);

//頻道列表紅點判斷
const hasUnread = computed(() => {
    return eventListHeartBeats.value.length !== 0
        ? eventListHeartBeats.value.some((item) => item.unread === 1)
        : false;
});

// 傳給title，是否有未讀信息
watch(
    hasUnread,
    (curr) => {
        window.hasUnread = curr;
    },
    { immediate: true }
);
// 定期刷log
const timerLog = ref(null);
//蒐集 userError
const getlog = () => {
    diaryLog.value = bugout.value.getLog();
    diaryLog.value = `後台使用者-${userName.value}` + diaryLog.value;
    // console.log("getLog", diaryLog.value);
    let rows = diaryLog.value.split("\n").length;
    // console.log("行數", rows);
    if (rows > 5) {
        logDiary(diaryLog.value, userName.value);
        bugout.value.clear();
    }
};
onMounted(() => {
    timerLog.value = setInterval(() => {
        getlog();
    }, 180000);
});
onUnmounted(() => {
    clearInterval(timerLog.value);
});
//未登入跳回登入頁
onMounted(() => {
    if (!access_token) {
        alertMessage.value = "您尚未登入!!!";
        alertEvent.value = "toHome";
    }
});
const gotoLogIn = () => {
    location.href = "/";
};
//聊天室彈窗控管
const isLoading = ref(true);
const apiCallbackSuccess = ref(false);
const allReady = (element) => {
    return element === true;
};
watch([meJoinAlready, apiCallbackSuccess], (newVal) => {
    // console.log("聊天室彈窗管控  新值!!", newVal);
    isLoading.value = !newVal.every(allReady);
});
//聊天室至管理功能 call leave
const gotoManage = () => {
    if (
        (route.path.includes("/groupChat/chat") ||
            route.path.includes("/groupChat/editGroupChatRoom") ||
            route.path.includes("/groupChat/gallery")) &&
        route.query.eventID
    ) {
        // 從群組聊天離開 並有進入任何一間群聊
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(route.query.eventID),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
            },
            success: function () {},
        });
        router.push(`/manage/SMSSend`);
        return;
    } else if (route.path === "/groupChat") {
        router.push(`/manage/SMSSend`);
        return;
    }
    //從頻道列表離開
    if (route.path.includes("/chat")) {
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(eventID.value),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
            },
            success: function () {},
        });
        router.push(`/manage/${eventID.value}/SMSSend`);
    }
};
const gotoGroupChat = () => {
    //從頻道列表離開
    if (route.path.includes("chat")) {
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(eventID.value),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
            },
            success: function () {},
        });
    }
    router.push(`/groupChat`);
};
const gotoProfile = () => {
    if (
        (route.path.includes("/groupChat/chat") ||
            route.path.includes("/groupChat/editGroupChatRoom") ||
            route.path.includes("/groupChat/gallery")) &&
        route.query.eventID
    ) {
        // 從群組聊天離開 並有進入任何一間群聊
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(route.query.eventID),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
            },
            success: function () {},
        });
    }
    //從頻道列表離開
    if (route.path.includes("/chat")) {
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(eventID.value),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
            },
            success: function () {},
        });
    }
    router.push(`/manage/${eventID.value}/profile`);
};
// adminStatus: 0-客服, 1-管理者,
const isAdmin: number | null = Number(localStorage.getItem("adminStatus"));
const accountID = ref(localStorage.getItem("accountID"));
const timer = ref(null);
//打eventlist api
const getEventList = async (firstLogin) => {
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/eventlist`,
        headers: { Authorization: `Bearer ${access_token}` },
    })
        .then((res) => {
            // 第一次進去打
            if (firstLogin === true) {
                if (res.data.eventList.length === 0) {
                    eventList.value = [];
                    eventListHeartBeats.value = [];
                    if (isAdmin >= 1 && groupChatRecordMessages.value.length === 0) {
                        router.push("/manage/SMSSend");
                    }
                    if (isAdmin === 0) {
                        alertMessage.value =
                            "請聯絡talkOD系統管理者(與EVERY8D系統管理者為同一人)，將您的帳號加入talkOD活動頻道，才能在「我的聊天室」內進行交談喔！";
                    }
                } else {
                    eventList.value = res.data.eventList;
                    eventList.value.sort((a, b) => b.preset - a.preset);
                    labelChannelList.value = res.data.eventList;
                    eventListHeartBeats.value = res.data.eventList;
                }
                eventID.value = route.params.id
                    ? route.params.id
                    : eventList.value.length !== 0
                    ? eventList.value[0].eventID
                    : 0;
                if (!isJanusinit.value && access_token) {
                    //janus 初始化
                    Janus.init({
                        debug: "all",
                        dependencies: Janus.useDefaultDependencies({
                            adapter: adapter,
                        }),
                        callback: () => {
                            if (!Janus.isWebrtcSupported()) {
                                console.log("您不支持 webRTC!! ");
                                return;
                            }
                            connect(2);
                        },
                    });
                    isJanusinit.value = true;
                }
                // console.log("登入時的eventID", eventID.value);
                if (eventID.value != 0) {
                    // 抓 header 頻道名字
                    getEventApi(eventID.value);
                }
                setTimeout(() => {
                    apiCallbackSuccess.value = true;
                }, 300);
            } else {
                // 每五秒打一次
                if (res.data.eventList.length === 0) {
                    eventListHeartBeats.value = [];
                } else {
                    eventListHeartBeats.value = res.data.eventList;
                }
            }
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            if (err.response && [-4].includes(err.response.data.status)) {
                alertMessage.value = "您的帳號在其他設備使用, 請重新登入!!";
                alertEvent.value = "toHome";
            }
        });
};
//打群聊list api
const getGroupRoomList = async (firstLogin, eventID = "") => {
    await axios({
        method: "get",
        url: `${config.serverUrl}/v1/grouproomlist`,
        headers: { Authorization: `Bearer ${access_token}` },
    })
        .then((res) => {
            console.log("getGroupRoomList res", res);
            if (firstLogin === true) {
                getEventList(true);
            }
            groupChatRecordMessages.value = res.data.eventList !== null ? res.data.eventList : [];
            groupChatRecordMessages.value.sort((a, b) => b.time - a.time);
            groupChatRecordMessages.value.forEach((chatroom) => {
                sessionStorage.setItem(`${chatroom.eventID}-lastChatMessage`, "[]");
            });
            if (eventID !== "") {
                router.push(`/groupChat/chat?eventID=${eventID}`);
            }
            chatroomListLoading.value = false;
        })
        .catch((err) => {
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
        });
};
// 第一次進打 eventlist api 跟群聊列表
onMounted(() => {
    // 群聊list
    getGroupRoomList(true);
    getPoint();
    profileGetData(accountID.value);
});

// 每5秒刷新一次 eventList 跟 groupRooList api
onMounted(() => {
    timer.value = setInterval(() => {
        getEventList(false);
        getGroupRoomList(false);
    }, 5000);
});
onUnmounted(() => {
    clearInterval(timer.value);
});

//群組聊天紅點判斷
const groupChatHasUnread = computed(() => {
    return groupChatRecordMessages.value.length !== 0
        ? groupChatRecordMessages.value.some((item) => item.unread === 1)
        : false;
});
watch(groupChatRecordMessages, (newVal, oldVal) => {
    // 第一次取資料初始值
    if (oldVal.length === 0) {
        oldArr.value = newVal;
        console.log("header拿到群聊列表初始值", oldArr.value);
    }
    if (newVal !== null) {
        newVal.forEach((newItem) => {
            oldArr.value.forEach((oldItem) => {
                if (newItem.eventID === oldItem.eventID && newItem.time > oldItem.time) {
                    newItem.unread = 1;
                    if (newItem.eventID === Number(route.query.eventID)) {
                        newItem.unread = 0;
                    }
                }
            });
        });
    }
});
//-----------------------------webNotification--------------------------------------------------
//監聽重整關閉事件關掉 notification
onMounted(() => {
    window.addEventListener("beforeunload", () => closeNotification());
});
onUnmounted(() => {
    window.removeEventListener("beforeunload", () => closeNotification());
});

const closeNotification = () => {
    if (notification.value !== null) {
        notification.value.close();
    }
};

watch(
    () => eventListHeartBeats.value,
    (newVal, oldVal) => {
        newVal.forEach((newItem) => {
            oldVal.forEach((oldItem) => {
                if (
                    newItem.eventID === oldItem.eventID &&
                    newItem.unread === 1 &&
                    oldItem.unread === 0
                ) {
                    console.log("有人傳新訊息來!!!");
                    notifyMe(newItem.eventID);
                }
            });
        });
    },
    { deep: true }
);

const titleObj = {
    SMSSend: "SMS發送",
    SMSSendPage2: "SMS發送",
    SMSInquire: "SMS發送查詢",
    MMSSend: "MMS發送",
    MMSSendPage2: "MMS發送",
    MMSInquire: "MMS發送查詢",
    ActivitySetting: "活動頻道管理",
    AddChannel: "新增活動頻道",
    EditChannel: "編輯活動頻道",
    AddCustomService: "編輯客服人員",
    AddAutoReply: "建立自動回覆訊息",
    EditAutoReply: "編輯自動回覆訊息",
    AutoReplyList: "自動回覆訊息列表",
    ManageSetting: "管理者設定",
    AddressBookManagement: "通訊錄設定",
    Profile: "個人資料",
    EditProfile: "編輯個人資料",
    AddGroupChatRoom: "新增群組聊天室",
    EditGroupChatRoom: "編輯群組聊天室",
};
// 頻道列表清單
const options: any = computed(() => {
    return eventListHeartBeats.value
        .map((item) => {
            return {
                label: item.name,
                key: item.eventID,
                unread: item.unread,
                icon() {
                    return h(
                        NIcon,
                        { color: item.unread === 1 ? "#f9935c" : "grey" },
                        {
                            default: () => h(Ellipse),
                        }
                    );
                },
            };
        })
        .sort((a, b) => {
            return b.unread - a.unread;
        });
});
const handleSelect = (key: string | number) => {
    if (notification.value !== null) {
        notification.value.close();
    }
    location.href = `/chat/${key}`;
};

const getEventID = computed(() => (route.params.id ? `/chat/${route.params.id}` : "/chat"));
//以下為 ------------------------------------------------------------------------------janus------------------------------------------------------------------------------------------------------------------------------
let janus: any = null;
let myid: any = null;
let myusername: any = null;
// let transactions: any = {};
let participants: any = {};
let simulcastStarted: any = false;
let audioenabled = false;

//手機裝置 背景或在線時janus離開加入切換
if (isMobile) {
    // 當前裝置是移動裝置
    document.addEventListener("visibilitychange", (event) => {
        let transaction = randomString(12);
        if (route.path !== getEventID.value) return;
        if (document.visibilityState === "hidden") {
            let leave = {
                textroom: "leave",
                transaction: transaction,
                room: Number(eventID.value),
            };
            textPlugin.value.data({
                text: JSON.stringify(leave),
                error: function (reason: any) {
                    console.log("error leave:", reason);
                },
                success: function () {},
            });
            return;
        }
        if (document.visibilityState === "visible") {
            let join = {
                textroom: "join",
                transaction: transaction,
                room: Number(eventID.value),
                username: localStorage.getItem("account"),
                accountID: localStorage.getItem("accountID"),
                display: "admin",
            };
            textPlugin.value.data({
                text: JSON.stringify(join),
                error: function (reason: any) {
                    console.log("error join:", reason);
                },
                success: function () {},
            });
            return;
        }
    });
}

// janus 連線
const connect = (line) => {
    //建立 janus 連線
    janus = new Janus({
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
            attachTextroomPlugin();
            attachVideocallPlugin();
        },
        error: (error: any) => {
            onError("Failed to connect to janus server", error);
            alertMessage.value = `連線中斷,按下確認重新連線, 錯誤訊息提示: ${error}`;
            alertEvent.value = "reload";
        },
        destroyed: () => {
            console.log("janus destroyed!!!");
        },
    });
};

//上線判斷
watchEffect(() => {
    const chatRoomIDArr = Object.keys(onlineList.value);
    if (chatRoomIDArr.includes(chatRoomID.value)) {
        isOnline.value = true;
        return;
    }
    isOnline.value = false;
});

// 註冊 janus
const registerUsername = (username: undefined | string) => {
    // 沒username時,不給註冊
    if (username === "") {
        return;
    }
    //拿取隨機 username call janus 註冊
    myid = username;
    let transaction = randomString(12);
    let roomid = eventID.value == 0 ? 2196337081831823 : eventID.value;
    let register = {
        textroom: "join",
        transaction: transaction,
        room: Number(roomid),
        username: myid,
        display: "admin",
    };
    //註冊 textPlugin
    textPlugin.value.data({
        text: JSON.stringify(register),
        success: function (res) {
            console.log("textPlugin 註冊成功!!!");
        },
        error: function (reason: any) {
            console.log("textPlugin 註冊失敗, 原因為 : ", reason);
        },
    });
    myusername = username;
    transactions.value[transaction] = function (response: ITransactions) {
        console.log("自己 join 成功的 response!!", response);
        meJoinAlready.value = true;
        //join 失敗的 response
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                console.log("No such room : <code>" + eventID.value + "</code>");
            } else {
                console.log("response[error]", response["error"]);
            }
            console.log("註冊時 response 錯誤的 participants:", response.participants);
            return;
        }

        //videocall plugin註冊
        let register = { request: "register", username: username };
        callPlugin.value.send({ message: register });

        //註冊完 join room 拿到的 參與者
        if (response.participants && response.participants.length > 0) {
            for (let i in response.participants) {
                let p = response.participants[i];
                participants[p.username] = p.display ? p.display : p.username;
            }
            participantList.value = Object.keys(participants).map((key) => {
                return {
                    [key]: participants[key],
                };
            });
            console.log("自己註冊完 查看房間有誰!!", participantList.value);
            // 去除自己的admin
            adminParticipantsWithOutMe.value = Object.keys(participants)
                .filter((key) => participants[key] === "admin")
                .filter((name) => name !== myid);
            console.log("自己註冊完 沒有自己的 admin 人員列表", adminParticipantsWithOutMe.value);

            //存取在線名單
            onlineList.value = participants;
            const chatRoomIDArr = Object.keys(onlineList.value);
            //如果對方在線上 pin 對方
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
};
// attach textroom plugin
const attachTextroomPlugin = (number) => {
    janus.attach({
        plugin: "janus.plugin.textroom",
        OPAQUEID: OPAQUEID,
        success: function (pluginHandle: IAttachPlugin) {
            textPlugin.value = pluginHandle;
            console.log(
                "textPlugin attached 成功 (" +
                    textPlugin.value.getPlugin() +
                    ", id=" +
                    textPlugin.value.getId() +
                    ")"
            );
            // Setup the DataChannel
            let body = { request: "setup" };
            textPlugin.value.send({ message: body });
        },
        error: function (error: any) {
            console.error("text-> Error attaching plugin...", error);
        },
        iceState: function (state: any) {
            // @ts-ignore
            Janus.log("text-> ICE state changed to " + state);
            if (state === "disconnected") {
                alertMessage.value = `連線中斷,按下確認重新連線, 錯誤訊息提示: ${state}`;
                alertEvent.value = "reload";
            }
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
            //進 janus 前註冊名字
            const myUserName = localStorage.getItem("userName");
            registerUsername(myUserName);
        },
        ondata: function (item: any) {
            console.log("text-> We got data from the DataChannel!", item);
            //解構 janus 傳來的訊息
            let json = JSON.parse(item);
            if (json.error_code !== undefined) {
                alertMessage.value = `您已斷線,請按下確認以利重新整理!!! 錯誤訊息代碼為:${json.error_code}`;
                alertEvent.value = "reload";
            }
            let transaction = json["transaction"];
            // console.log("自己join的亂碼", transaction);
            console.log("transactions", transactions.value);
            // console.log("拿參與者的res", transactions[transaction]);
            if (transactions.value[transaction]) {
                // Someone was waiting for this
                transactions.value[transaction](json);
                delete transactions.value[transaction];
                return;
            }
            let what = json["textroom"];
            let data: any = { what: what };
            //傳來訊息
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
                // console.log("participants", participants);
                // console.log("data from", participants[from]);
                data.from = participants[from];
                data.msg = msg;
                data.eventID = json["room"];
                // console.log("recall msgobj", msg);
                const isrecall = JSON.parse(msg);
                console.log("isrecall", isrecall);
                if (isrecall.recall === "recall" && isrecall.janusMsg.type !== 3) {
                    isInput.value = true;
                    messageList.value = [];
                    getHistoryApi(chatRoomID.value, route.params.id);
                } else if (isrecall.recall === "recall" && isrecall.janusMsg.type === 3) {
                    isInput.value = true;
                    groupChatMessageList.value = [];
                    getGroupChatHistoryApi(route.query.eventID, false);
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
                //傳來有人加入聊天室
                let username = json["username"];
                let display = json["display"];
                participants[username] = display ? display : username;

                data.username = username;
                data.display = display;
                data.mobile = mobile.value;
                console.log("有人加入 participants 處理前:", participants);
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                console.log("有人加入 participantList 處理後", participantList.value);
                // 去除自己的admin
                adminParticipantsWithOutMe.value = Object.keys(participants)
                    .filter((key) => participants[key] === "admin")
                    .filter((name) => name !== myid);
                console.log("join時 沒有自己的adminarr", adminParticipantsWithOutMe.value);
                onlineList.value = participants;
                const chatRoomIDArr = Object.keys(onlineList.value);
                if (chatRoomIDArr.includes(chatRoomID.value)) {
                    isOnline.value = true;
                }
            } else if (what === "leave") {
                //傳來有人離開聊天室
                let username = json["username"];
                delete participants[username];
                console.log("有人離開 participants 處理前:", participants);
                participantList.value = Object.keys(participants).map((key) => {
                    return {
                        [key]: participants[key],
                    };
                });
                console.log("有人離開 participants 處理後:", participantList.value);
                // 去除自己的admin
                adminParticipantsWithOutMe.value = Object.keys(participants)
                    .filter((key) => participants[key] === "admin")
                    .filter((name) => name !== myid);
                console.log("leave時 沒有自己的adminarr", adminParticipantsWithOutMe.value);
                data.username = username;
                onlineList.value = participants;
                const chatRoomIDArr = Object.keys(onlineList.value);
                if (chatRoomIDArr.includes(chatRoomID.value)) {
                    isOnline.value = false;
                }
            } else if (what === "kicked") {
                // Somebody was kicked
                let username = json["username"];
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
            }
            //janus 收到訊息
            if (data.msg !== undefined) {
                if (JSON.parse(data.msg).janusMsg.type !== 3) {
                    processDataEvent(data, chatRoomID.value, route.params.id);
                    console.log("收到一般聊天室訊息!!");
                } else {
                    groupChatProcessDataEvent(data, route.query.eventID);
                    console.log("收到群組聊天室訊息!!");
                }
            }
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
                    } else if (event === "calling") {
                        console.log("calling:", result);
                        // TODO Any ringtone?
                        calling.value = setTimeout(() => {
                            // 撥打超過15秒， 自動掛掉
                            doHangup(1, chatRoomID.value, route.params.id, 0);
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
                            alertMessage.value = "對方忙線中,請稍後再撥!!!";
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
                console.error("call -> error", error);
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
// firebase推播
// const fcmPublicKey =
//     "BA1PShyoidVTSZYnMOAHJejfRKIRkfe3oBTlDtMHE0UarzjSol1LfrnKo_Ujx672J-ycRwf12NqveGutZVtK3Ko";
// // const fcmPublicKey = 'BAbr9GyZ2S-NcHo-NHKzprKYjLDqnKXW59b-QzcwXctYafs4_qb35YpCVoX8SXVWaOdp5Jte86tAPfMB0AegcPg';

// function requestPermission() {
//     console.log("Requesting permission...");
//     // console.log(Notification);
//     Notification.requestPermission()
//         .then((permission) => {
//             if (permission === "granted") {
//                 console.log("Notification permission granted.");
//             } else {
//                 console.log("denied");
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

// const getFcmToken = () => {
//     getToken(messaging, { vapidKey: fcmPublicKey })
//         .then((currentToken) => {
//             if (currentToken) {
//                 console.log("fcm token:", currentToken);
//                 // Send the token to your server and update the UI if necessary
//                 // ...
//             } else {
//                 // Show permission request UI
//                 console.log("No registration token available. Request permission to generate one.");
//                 // ...
//             }
//         })
//         .catch((err) => {
//             console.log("An error occurred while retrieving token. ", err);
//             // ...
//         });
// };
//收推播訊息
const notificationTitle = ref("");
const notificationBody = ref("");
const receiveMessage = () => {
    onMessage(messaging, function (payLoad) {
        // console.log("後端推播payload", payLoad);
        notificationTitle.value = payLoad.notification.title;
        notificationBody.value = payLoad.notification.body;
        console.log("後端推播信息: ", notificationTitle.value, notificationBody.value);
        const notificationOptions = {
            body: notificationBody.value,
        };
    });
};

onMounted(() => {
    // getFcmToken();
    receiveMessage();
    // requestPermission()
});
</script>
<style lang="scss">
@import "~@/assets/scss/var";
// 上一步/下一步按鈕組
.buttons {
    display: flex;
    justify-content: space-evenly;
}

.n-dropdown-menu.dropdown.n-popover.n-dropdown {
    margin-top: 10px !important;
}
.dropdown.n-popover {
    width: 100%;
}

.my-chatRoom {
    .n-badge.dot {
        width: 100%;
        color: $gray-1;
        display: block;
        padding: 10px 20px;
        &:hover {
            color: $gray-3;
        }
    }
}
.v-binder-follower-content {
    .n-dropdown-menu {
        max-height: 315px !important;
        overflow-y: auto !important;
        &::-webkit-scrollbar-track {
            border-radius: 5px;
            cursor: pointer;
        }
        &::-webkit-scrollbar {
            width: 5px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            cursor: pointer;
            -webkit-box-shadow: inset 5px 5px 5px $gray-4;
        }
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
$headerHeight: 80px;
// .testdriver {
//     z-index: 0 !important;
// }
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0);
    // z-index: 1000;
    z-index: 100004;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrap {
        position: relative;
        width: 600px;
        min-height: 200px;
        color: $gray-1;
        font-size: $font-size-20;
        border-radius: 10px;
        background: $white left top/100% no-repeat url("~@/assets/Images/common/guide-pages-bg.png");
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
            min-width: 98px;
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
        .cancelDriver {
            position: absolute;
            left: 20px;
            bottom: 20px;
        }
    }
    .wrapMove {
        left: 420px;
        width: 500px;
    }
    .wrapMove2 {
        top: 100px;
    }
    .wrapMove3 {
        top: 60px;
    }
    .wrapMove4 {
        top: 60px;
    }
}
.mask1 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    // background-color: rgba(0, 0, 0, 0);
    // z-index: 1000;
    z-index: 100003;
    display: flex;
    justify-content: center;
    align-items: center;
}
.closeMask {
    display: none;
}
// .driver-stage-no-animation {
//     transition: none !important;
//     // background: none !important;
//     outline: 5000px solid rgba(0,0,0,.75);
// }

// div#driver-highlighted-element-stage {
//     z-index: 100003 !important;
// }
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
    &__logo {
        display: flex;
        align-items: center;
        @extend %h1;
        // span {
        //     background-color: $primary-4;
        //     padding: 2px;
        // }
    }
    &__pagesouter {
        display: flex;
        align-items: center;
        img {
            cursor: pointer;
            width: 42px;
            height: 42px;
            border-radius: 50%;
        }
    }
    &__pages {
        display: flex;
        align-items: center;
        li {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
            box-shadow: $gray-6 1px 2px 4px 0;
            background-color: $primary-3;
            @extend %h4;
            &:hover {
                background-color: $primary-2;
            }
            + li {
                margin-left: 15px;
            }
            p,
            .link {
                padding: 10px 20px;
                cursor: pointer;
            }
            .link {
                display: block;
            }

            &.my-chatRoom {
                cursor: pointer;
            }
            &.groupChat {
                position: relative;
                .dot {
                    position: absolute;
                    top: -5px;
                    right: 0;
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
        }

        .pointList {
            padding: 0px 10px;
            color: $danger;
            .n-icon {
                color: black;
                cursor: pointer;
            }
            p,
            .link {
                padding: 10px 5px;
            }
        }
    }
}
</style>

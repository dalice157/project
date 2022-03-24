<template>
    <n-layout-header class="header" bordered>
        <h1
            class="logo"
            v-if="
                route.path == `/chat/${route.params.id}` ||
                route.path == `/gallery/${route.params.id}` ||
                route.path == `/phone/${route.params.id}`
            "
        >
            {{ eventInfo.name }}
        </h1>
        <h1 class="logo" v-else>
            {{ showTitle() }}
        </h1>
        <ul class="pages">
            <li class="btnBg">
                點數<span class="point">{{ point }}點</span>(<a
                    class="store-value"
                    href="https://www.teamplus.tech/product/every8d-prepaid/"
                    target="_blank"
                    >儲值</a
                >)
            </li>
            <li class="btnBg" v-if="isAdmin >= 1">
                <router-link :to="`/manage/${params.id}/SMSSend`">管理功能</router-link>
            </li>
            <li class="btnBg myChatRoom">
                <n-dropdown
                    class="dropdown"
                    :show="showDropdown"
                    :options="options"
                    @select="handleSelect"
                >
                    <span @click="handleClick">我的聊天室</span>
                </n-dropdown>
            </li>
            <li v-if="!access_token">
                <a :href="`/${params.id}`">登入</a>
            </li>
            <li class="chevron" v-if="access_token">
                <a :href="`/${params.id}`">登出</a>
            </li>
        </ul>
    </n-layout-header>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { NDropdown, NPopover, NIcon, NLayoutHeader } from "naive-ui";
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import { nanoid } from "nanoid";
import bootbox from "bootbox";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { OPAQUEID, MY_ROOM, JANUS_URL, convertTime } from "@/util/commonUtil";
import { processDataEvent, onHangup, onError, randomString } from "@/util/chatUtil";
import { ITransactions, IAttachPlugin } from "@/util/interfaceUtil";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import router from "@/router";

const route = useRoute();
const params = route.params;
const path = ref();

//modal store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

//Chat store
const chatStore = useChatStore();
const { textPlugin, participantList, onlineList, isOnline } = storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

// api store
const apiStore = useApiStore();
const { getPoint, getEventApi, getChatroomlistApi, getEventListApi } = apiStore;
const { eventInfo, point, isJanusinit, eventList } = storeToRefs(apiStore);
const access_token = localStorage.getItem("access_token");

const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);
const eventID = computed(() => route.params.id);

// adminStatus: 0-客服, 1-管理者,
const isAdmin: number | null = Number(localStorage.getItem("adminStatus"));

onMounted(() => {
    getEventApi(eventID.value);
    getPoint(eventID.value);
});

const showTitle = () => {
    const managePath = `/manage/${eventID.value}`;
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
let yourusername: any = null;
let simulcastStarted: any = false;

const showDropdown = ref(false);
const options: any = ref([]);
getEventListApi();

const handleSelect = (key: string | number) => {
    console.log("key:", key);
    location.href = `/chat/${key}`;
};

const handleClick = () => {
    options.value = eventList.value.map((item) => {
        return {
            label: item.name,
            key: item.eventID,
        };
    });

    showDropdown.value = !showDropdown.value;
};

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
            // alert("連線中斷,按下確認重新連線");
            // window.location.reload();
        },
        destroyed: () => {
            window.location.reload();
        },
    });
};
watchEffect(() => {
    const chatRoomIDArr = Object.keys(onlineList.value);
    if (chatRoomIDArr.includes(chatRoomID.value)) {
        isOnline.value = true;
    }
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
        room: Number(route.params.id),
        username: myid,
        display: "admin",
    };

    myusername = username;
    transactions[transaction] = function (response: ITransactions) {
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                console.log("No such room : <code>" + route.params.id + "</code>");
            } else {
                console.log("response[error]", response["error"]);
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
        }
    };
    textPlugin.value.data({
        text: JSON.stringify(register),
        error: function (reason: any) {
            bootbox.alert(reason);
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
            // @ts-ignore
            Janus.log(
                "Plugin attached! (" +
                    textPlugin.value.getPlugin() +
                    ", id=" +
                    textPlugin.value.getId() +
                    ")"
            );
            // Setup the DataChannel
            let body = { request: "setup" };
            // @ts-ignore
            Janus.debug("Sending message:", body);
            textPlugin.value.send({ message: body });
        },
        error: function (error: any) {
            console.error("text-> Error attaching plugin...", error);
            bootbox.alert("Error attaching plugin... " + error);
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
            // @ts-ignore
            Janus.debug("text-> Got a message ", msg);
            if (msg["error"]) {
                bootbox.alert(msg["error"]);
            }

            if (jsep) {
                textPlugin.value.createAnswer({
                    jsep: jsep,
                    media: { audio: false, video: false, data: true },
                    success: function (jsep: any) {
                        // @ts-ignore
                        Janus.debug("text-> Got SDP!", jsep);
                        let body = { request: "ack" };
                        textPlugin.value.send({ message: body, jsep: jsep });
                    },

                    error: function (error: any) {
                        // @ts-ignore
                        Janus.error("text-> WebRTC error:", error);
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
                // getHistoryApi(chatRoomID.value);
                getChatroomlistApi(route.params.id);
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
                    bootbox.alert("You have been kicked from the room", function () {
                        window.location.reload();
                    });
                }
                data.username = username;
            } else if (what === "destroyed") {
                if (json["room"] !== route.params.id) return;
                // Room was destroyed, goodbye!
                // @ts-ignore
                Janus.warn("text-> The room has been destroyed!");
                bootbox.alert("The room has been destroyed", function () {
                    window.location.reload();
                });
            } else if (what === "success") {
                console.log("success:", data);
                // getHistoryApi(chatRoomID.value);
                getChatroomlistApi(route.params.id);
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
function addSimulcastButtons(arg0: boolean) {
    throw new Error("Function not implemented.");
}
const calling = ref();
const connecting = ref();
//video call plugin
const attachVideocallPlugin = () => {
    janus.attach({
        plugin: "janus.plugin.videocall",
        OPAQUEID: OPAQUEID,
        success: function (pluginHandle: IAttachPlugin) {
            callPlugin.value = pluginHandle;
            // @ts-ignore
            Janus.log(
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
            // @ts-ignore
            Janus.debug("call-> ::: Got a message :::", msg);
            let result = msg["result"];
            console.log("result:", result);

            if (result) {
                if (result["list"]) {
                    let list = result["list"];
                    // @ts-ignore
                    Janus.debug("call-> Got a list of phone registered peers:", list);

                    for (let mp in list) {
                        // @ts-ignore
                        Janus.debug("call list->  >> [" + list[mp] + "]");
                    }
                } else if (result["event"]) {
                    let event = result["event"];
                    console.log("event:", event);

                    if (event === "registered") {
                        myusername = result["username"];
                        // @ts-ignore
                        Janus.log("call-> Successfully registered as " + myusername + "!");
                        // Get a list of available peers, just for fun
                        callPlugin.value.send({ message: { request: "list" } });
                        registerUsername(myusername);
                    } else if (event === "calling") {
                        // TODO Any ringtone?
                        calling.value = setTimeout(() => {
                            // 撥打超過30秒， 自動掛掉
                            doHangup(1, chatRoomID.value, route.params.id);
                        }, 15000);
                        // @ts-ignore
                        Janus.log("call-> Waiting for the peer to answer...");
                    } else if (event === "incomingcall") {
                        // @ts-ignore
                        Janus.log("call-> Incoming call from " + result["username"] + "!");
                        yourusername = result["username"];
                        yourUsername.value = yourusername;
                        jsepMsg.value = jsep;
                        isIncomingCall.value = true;
                        console.log("jsep.value:", jsepMsg.value);
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
                            // @ts-ignore
                            Janus.log("Call started!");
                        } else {
                            // @ts-ignore
                            Janus.log(peer + " accepted the call!");
                            yourusername = peer;
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
                                    media: { audio: false, video: false, data: true },
                                    success: function (jsep: any) {
                                        // @ts-ignore
                                        Janus.debug("call-> Got SDP!", jsep);
                                        isAccepted.value = true;
                                        let body = { request: "set" };
                                        callPlugin.value.send({
                                            message: body,
                                            jsep: jsep,
                                        });
                                    },
                                    error: function (error: any) {
                                        // @ts-ignore
                                        Janus.error("call-> WebRTC error:", error);
                                    },
                                });
                            }
                        }
                    } else if (event === "hangup") {
                        // @ts-ignore
                        Janus.log(
                            "call-> Call hung up by " +
                                result["username"] +
                                " (" +
                                result["reason"] +
                                ")!"
                        );
                        clearInterval(connecting.value);
                        // Reset status
                        callPlugin.value.hangup();
                        isIncomingCall.value = false;
                        phoneCallModal.value = false;
                        location.href = route.query
                            ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
                            : `/chat/${eventID.value}`;
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
                        // @ts-ignore
                        Janus.log("call-> setRecord OK!");
                    }
                }
            } else {
                // FIXME Error?
                let error = msg["error"];
                bootbox.alert(error);
                if (error.indexOf("already taken") > 0) {
                    // FIXME Use status codes...
                }
                isIncomingCall.value = false;
                phoneCallModal.value = false;
                // TODO Reset status
                callPlugin.value.hangup();
                onHangup();
                location.href = route.query
                    ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
                    : `/chat/${eventID.value}`;
            }
        },
        onlocalstream: function (stream: any) {
            // @ts-ignore
            Janus.debug("call-> ::: Got a local stream :::", stream);
        },
        onremotestream: function (stream: any) {
            // @ts-ignore
            Janus.debug("call-> ::: Got a remote stream :::", stream);
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
            yourusername = null;
            simulcastStarted = false;
            isIncomingCall.value = false;
            phoneCallModal.value = false;
            location.href = route.query
                ? `/chat/${eventID.value}?chatroomID=${chatRoomID.value}&mobile=${mobile.value}`
                : `/chat/${eventID.value}`;
        },
    });
};
</script>
<style lang="scss">
.dropdown.n-popover {
    width: 100%;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

$headerHeight: 80px;
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
        font-size: 12px;
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
                font-size: 25px;
            }
        }
    }
}
.point {
    color: $danger;
}
</style>

<template>
    <div class="chatroom">
        <!--  聊天室主畫面  -->
        <NavBar />
        <SearchBar />
        <!-- 聊天室主畫面 -->
        <MessageBox />
        <!-- 使用者輸入框 -->
        <Input />
    </div>
    <n-modal class="chatRecordCard" v-model:show="isIncomingCall" preset="card">
        <n-card :bordered="false" size="huge" class="container">
            <UserInfo :info="eventInfo" />
            <div class="description">語音來電</div>
            <ul class="call_container">
                <li @touchend="doHangup(3)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <router-link :to="`/phone?chatToken=${chatToken}`">
                        <button
                            class="icon"
                            @touchend="onIncomingCall(yourUsername, jsepMsg)"
                        ></button>
                    </router-link>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import { nanoid } from "nanoid";
import bootbox from "bootbox";
import { defineComponent, ref, onMounted, computed, watchEffect } from "vue";
import { NModal, NCard } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { txt, ITransactions, IAttachPlugin, IMessageList } from "@/util/interfaceUtil";
import {
    processDataEvent,
    onRegistered,
    onCalling,
    onAccepted,
    onHangup,
    onError,
    randomString,
    sendPrivateMsg,
} from "@/util/chatUtil";
import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { currentTime, currentDate } from "@/util/dateUtil";
import {
    localStorageMsg,
    ME_USER_NAME,
    OPAQUEID,
    MY_ROOM,
    JANUS_URL,
    chatroomID,
    convertTime,
} from "@/util/commonUtil";
import NavBar from "@/components/Chat/NavBar.vue";
import MessageBox from "@/components/Chat/MessageBox";
import SearchBar from "@/components/Chat/SearchBar.vue";
import Input from "@/components/Chat/Input";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";
import incomingIcon from "@/assets/Images/common/connect-round.svg";
import UserInfoModel from "@/components/UserInfoModel.vue";

let janus: any = null;
let myid: any = null;
let myusername: any = null;
let transactions: any = {};
let participants: any = {};
// let callPlugin: any = null;
let yourusername: any = null;
let simulcastStarted: any = false;
let welcomeStatus: any = ref(false);

//router
const router = useRouter();
const route = useRoute();
const chatToken = computed(() => route.query.chatToken);
// api store
const apiStore = useApiStore();
const { getEventListApi, getBackendApi } = apiStore;
const { eventInfo } = storeToRefs(apiStore);

//Chat store
const chatStore = useChatStore();
const { chatRoomMsg, messages, pictures, textPlugin } = storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

getEventListApi(route.query.chatToken);
getBackendApi(route.query.chatToken);

onMounted(() => {
    let otherMsg: any = {};
    if (!welcomeStatus.value) {
        eventInfo.value.messagelist.forEach((item: IMessageList) => {
            otherMsg = {
                janusMsg: {
                    chatroomID: chatroomID(route.query.chatToken),
                    sender: 0, // 0 為對方傳送的訊息
                    type: 2,
                    msgType: 1,
                    message: item.MsgContent,
                    format: {},
                },
                id: nanoid(),
                phoneType: "",
                audioInfo: "",
                ext: "",
                msgMoreStatus: false,
                msgFunctionStatus: false,
                recallStatus: false,
                recallPopUp: false,
                time: currentTime(),
                currentDate: currentDate(),
                replyObj: "",
            };

            messages.value.push(otherMsg);
        });
        localStorage.setItem(`${route.query.chatToken}-welcomeStatus`, JSON.stringify(true));
    }
    localStorageMsg(messages.value, route.query.chatToken);
});
//janus 初始值
onMounted(() => {
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
});
watchEffect(() => {
    messages.value = JSON.parse(localStorage.getItem(`${route.query.chatToken}`) || "[]");
    welcomeStatus.value = JSON.parse(
        localStorage.getItem(`${route.query.chatToken}-welcomeStatus`) || "false"
    );
    pictures.value = JSON.parse(localStorage.getItem(`${route.query.chatToken}-pictures`) || "[]");
});

// 連線
const connect = () => {
    janus = new Janus({
        server: JANUS_URL,
        success: () => {
            if (route) {
                attachTextroomPlugin();
                attachVideocallPlugin();
            }
        },
        error: (error: any) => {
            onError("Failed to connect to janus server", error);
        },
        destroyed: () => {
            window.location.reload();
        },
    });
};

// 註冊 for me
const registerUsername = (username: undefined | string) => {
    if (username === "") {
        return;
    }
    // myid = randomString(12);
    myid = ME_USER_NAME;
    let transaction = randomString(12);
    let register = {
        textroom: "join",
        transaction: transaction,
        room: MY_ROOM,
        username: myid,
        display: username,
    };

    myusername = username;
    transactions[transaction] = function (response: ITransactions) {
        if (response["textroom"] === "error") {
            // Something went wrong
            if (response["error_code"] === 417) {
                // This is a "no such room" error: give a more meaningful description
                bootbox.alert("No such room : <code>" + MY_ROOM + "</code>");
            } else {
                bootbox.alert(response["error"]);
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
            // @ts-ignore
            Janus.log("text-> The DataChannel is available!", data);
            console.log("text-> The DataChannel is available!", data);
            // registerUsername(自己的username);
            registerUsername(ME_USER_NAME);
        },
        ondata: function (item: any) {
            // @ts-ignore
            Janus.debug("text-> We got data from the DataChannel!", item);

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
            } else if (what === "leave") {
                // Somebody left
                let username = json["username"];
                delete participants[username];

                data.username = username;
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
                if (json["room"] !== MY_ROOM) return;
                // Room was destroyed, goodbye!
                // @ts-ignore
                Janus.warn("text-> The room has been destroyed!");
                bootbox.alert("The room has been destroyed", function () {
                    window.location.reload();
                });
            } else if (what === "success") {
                console.log("success:", data);
            }

            processDataEvent(data, route.query.chatToken);
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
            if (result) {
                if (result["list"]) {
                    let list = result["list"];
                    // @ts-ignore
                    Janus.debug("call-> Got a list of registered peers:", list);
                    for (let mp in list) {
                        // @ts-ignore
                        Janus.debug("call->  >> [" + list[mp] + "]");
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
                            doHangup(1);
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
                        location.href = `/?chatToken=${chatToken.value}`;
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
                // TODO Reset status
                callPlugin.value.hangup();
                onHangup();
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
            location.href = `/?chatToken=${chatToken.value}`;
        },
    });
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.chatroom {
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
        button.icon {
            border: none;
            background: url("~@/assets/Images/common/connect-round.svg") no-repeat center;
        }
    }
    h4.text {
        @extend %h4;
        margin-top: 10px;
        color: $gray-1;
    }
}
</style>

<template>
    <div class="chatroom">
        <!--  聊天室主畫面  -->
        <NavBar />
        <SearchBar />
        <!-- 聊天室主畫面 -->
        <MessageBox />
        <Gallery />
        <!-- 使用者輸入框 -->
        <Input />
    </div>
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
                <li @click="doHangup(2, eventID(route.params.eventKey))">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <button class="icon" @click="onIncomingCall(yourUsername, jsepMsg)"></button>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
    <!-- 使用者重覆蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-show="isAlreadyTaken">
            <div class="popUp">
                您已在其他設備使用, 請關閉其他設備後點選重整按鈕
                <div class="btnWrap">
                    <n-button color="#ffb400" text-color="#fff" type="primary" @click="onReload">
                        重整
                    </n-button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import adapter from "webrtc-adapter";
import Janus from "@/assets/js/janus";
import { nanoid } from "nanoid";
import bootbox from "bootbox";
import { defineComponent, ref, onMounted, computed, watchEffect, watch } from "vue";
import { NModal, NCard, NButton } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import { txt, ITransactions, IAttachPlugin, IMessageList } from "@/util/interfaceUtil";
import {
    processDataEvent,
    onRegistered,
    onCalling,
    onAccepted,
    onHangup,
    onError,
    randomString,
} from "@/util/chatUtil";
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
} from "@/util/commonUtil";
import NavBar from "@/components/Chat/NavBar.vue";
import MessageBox from "@/components/Chat/MessageBox";
import SearchBar from "@/components/Chat/SearchBar.vue";
import Input from "@/components/Chat/Input";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";

import Gallery from "./Gallery.vue";

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
const eventKey = computed(() => route.params.eventKey);

// 彈窗 store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

// api store
const apiStore = useApiStore();
const { getEventListApi, getBackendApi } = apiStore;
const { eventInfo } = storeToRefs(apiStore);

//Chat store
const chatStore = useChatStore();
const { msgParticipantList, messages, pictures, textPlugin, participantList, isOnline } =
    storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

getEventListApi(route.params.eventKey);
getBackendApi(route.params.eventKey);

var iOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;
var eventName = iOS ? "pagehide" : "beforeunload";
var oldOBF = window["on" + eventName];
window.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState === "hidden") {
        for (var s in Janus.sessions) {
            if (Janus.sessions[s] && Janus.sessions[s].destroyOnUnload) {
                console.log("Room Destroying session " + s);

                Janus.sessions[s].destroy({ unload: true, notifyDestroyed: false });
            }
        }
        if (oldOBF && typeof oldOBF == "function") {
            oldOBF();
        }
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
                getEventListApi(route.params.eventKey);
                getBackendApi(route.params.eventKey);
            },
        });
        return;
    }
});

watch(
    () => route.path,
    (newVal, oldVal) => {
        if (oldVal !== newVal) {
            for (var s in Janus.sessions) {
                if (Janus.sessions[s] && Janus.sessions[s].destroyOnUnload) {
                    console.log("Room Destroying session " + s);

                    Janus.sessions[s].destroy({ unload: true, notifyDestroyed: false });
                }
            }
            if (oldOBF && typeof oldOBF == "function") {
                oldOBF();
            }
        }
    }
);

watchEffect(() => {
    messages.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}`) || "[]");
    if (participantList.value.length > 0) {
        isOnline.value = true;
    }

    welcomeStatus.value = JSON.parse(
        localStorage.getItem(`${route.params.eventKey}-welcomeStatus`) || "false"
    );
    pictures.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}-pictures`) || "[]");
});

watchEffect(() => {
    let otherMsg: any = null;
    if (!welcomeStatus.value) {
        eventInfo.value.messagelist.forEach((item: any) => {
            // console.log("item:", item);
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
                        replyObj: "",
                        currentDate: currentDate(),
                        isExpire: false,
                        isPlay: false,
                        isRead: false,
                        msgFunctionStatus: false,
                        msgMoreStatus: false,
                        recallPopUp: false,
                        recallStatus: false,
                    },
                },
            };

            localStorage.setItem(`${route.params.eventKey}-welcomeStatus`, JSON.stringify(true));
            messages.value.push(otherMsg);
            messages.value.reduce((unique, o) => {
                const hasRepeatId = unique.some((obj) => {
                    return obj.janusMsg.config.id === o.janusMsg.config.id;
                });
                if (!hasRepeatId) {
                    unique.push(o);
                }
                return unique;
            }, []);
            if ([6, 7].includes(otherMsg.janusMsg.msgType)) {
                pictures.value.push(otherMsg);
            }
            localStorageMsg(messages.value, route.params.eventKey);
        });
    }
    localStorage.setItem(`${route.params.eventKey}-pictures`, JSON.stringify(pictures.value));
    localStorageMsg(messages.value, route.params.eventKey);
    messages.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}`) || ([] as any));
    welcomeStatus.value = JSON.parse(
        localStorage.getItem(`${route.params.eventKey}-welcomeStatus`) || "false"
    );
    pictures.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}-pictures`) || "[]");
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
            alert("連線中斷,按下確認重新連線");
            window.location.reload();
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
    myid = username;
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
                bootbox.alert("No such room : <code>" + eventID(route.params.eventKey) + "</code>");
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
        participantList.value = participants;
        participantList.value = Object.keys(participants).filter((participant) => {
            return participant !== myid;
        });
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
        console.log("剛註冊時的發送名單", participantList.value);
        if (participantList.value.length > 0) {
            isOnline.value = true;
        }
    };
    textPlugin.value.data({
        text: JSON.stringify(register),
        error: function (reason: any) {
            alert(reason);
            //TODO do something
        },
    });
};
const isAlreadyTaken = ref(false);
const onReload = () => {
    isAlreadyTaken.value = false;
    location.reload();
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
            console.log("text-> The DataChannel is available!", data);
            // registerUsername(自己的username);
            const chatroomId = chatroomID(route.params.eventKey);
            registerUsername(chatroomId);
        },
        ondata: function (item: any) {
            // @ts-ignore
            Janus.debug("text-> We got data from the DataChannel!", item);

            let json = JSON.parse(item);
            console.log("error:", json);
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

                console.log("participants:", participants);
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
                console.log("有人join後的發送名單", participantList.value);
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

            processDataEvent(data, route.params.eventKey);
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
                    Janus.debug("call-> Got a list of registered peers:", list);
                    for (let mp in list) {
                        // @ts-ignore
                        Janus.debug("call->  >> [" + list[mp] + "]");
                    }
                } else if (result["event"]) {
                    let event = result["event"];

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
                            // 撥打超過15秒， 自動掛掉
                            doHangup(1, eventID(route.params.eventKey));
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
                        location.href = `/${eventKey.value}`;
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
                location.href = `/${eventKey.value}`;
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
            location.href = `/${eventKey.value}`;
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
    z-index: 1000;
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
}

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

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
                <li @[events]="doHangup(2, eventID(route.params.eventKey), 0)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <button class="icon" @[events]="onIncomingCall(yourUsername, jsepMsg)"></button>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
    <!-- 使用者重覆蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-show="isAlreadyTaken && !isIllegalDevice">
            <div class="popUp">
                您已在其他設備使用, 請關閉其他設備後點選重整按鈕
                <div class="btnWrap">
                    <n-button color="#ffb400" text-color="#fff" type="primary" @[events]="onReload">
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
import axios from "axios";
import { defineComponent, ref, onMounted, computed, watchEffect, watch, nextTick } from "vue";
import { NModal, NCard, NButton } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import { ITransactions, IAttachPlugin } from "@/util/interfaceUtil";
import { processDataEvent, onError, randomString } from "@/util/chatUtil";
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
} from "@/util/commonUtil";
import NavBar from "@/components/Chat/NavBar.vue";
import MessageBox from "@/components/Chat/MessageBox";
import SearchBar from "@/components/Chat/SearchBar.vue";
import Input from "@/components/Chat/Input";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";
import config from "@/config/config";
import { signature } from "@/util/deviceUtil";

const events = ref(isMobile ? "touchend" : "click");

let myid: any = null;
let myusername: any = null;
let transactions: any = {};
let participants: any = {};
// let callPlugin: any = null;
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
const { getBackendApi } = apiStore;
const { eventInfo, isIllegalDevice } = storeToRefs(apiStore);

//Chat store
const chatStore = useChatStore();
const {
    msgParticipantList,
    messages,
    pictures,
    textPlugin,
    participantList,
    isOnline,
    adminCount,
    janusConnectStatus,
    janus,
} = storeToRefs(chatStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

if (isMobile) {
    // 當前裝置是移動裝置
    document.addEventListener("visibilitychange", (event) => {
        let transaction = randomString(12);
        if (document.visibilityState === "hidden") {
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
        if (document.visibilityState === "visible" && !isAlreadyTaken.value) {
            let join = {
                textroom: "join",
                transaction: transaction,
                room: Number(eventID(route.params.eventKey)),
                username: myid,
                display: "user",
            };
            textPlugin.value.data({
                text: JSON.stringify(join),
                error: function (reason: any) {
                    console.log("error join:", reason);
                },
                success: function () {
                    let participants = {
                        request: "listparticipants",
                        room: Number(eventID(route.params.eventKey)),
                    };
                    textPlugin.value.send({ message: participants });
                },
            });
            getBackendApi(route.params.eventKey);
            return;
        }
    });
}

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
const initWeclomeMsg = () => {
    let otherMsg: any = null;
    if (!welcomeStatus.value && eventInfo.value) {
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
                        isWelcomeMsg: true,
                        deliveryStatusSuccess: true,
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
    messages.value.forEach((msg) => {
        msg.janusMsg.config.isUnread = false;
    });
    welcomeStatus.value = JSON.parse(
        localStorage.getItem(`${route.params.eventKey}-welcomeStatus`) || "false"
    );
    pictures.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}-pictures`) || "[]");
};
watchEffect(() => {
    initWeclomeMsg();
});
onMounted(() => {
    initWeclomeMsg();
});

//janus 初始值
onMounted(() => {
    axios({
        method: "get",
        url: `${config.serverUrl}/login/${route.params.eventKey}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            isIllegalDevice.value = false;
            getBackendApi(route.params.eventKey);
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
        })
        .catch((err: any) => {
            console.error(err);
            if (err.response.status === 401) {
                isIllegalDevice.value = true;
                return;
            }
        });
});

// 連線
const connect = () => {
    janus.value = new Janus({
        server: JANUS_URL,
        success: () => {
            if (route) {
                attachTextroomPlugin();
                attachVideocallPlugin();
            }
            janusConnectStatus.value = true;
        },
        error: (error: any) => {
            janusConnectStatus.value = false;
            const errMsg = onError("Failed to connect to janus server", error);
            alert(`連線中斷,按下確認重新連線 ${errMsg}`);
            window.location.reload();
        },
        destroyed: () => {
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
        console.log("key arr:", participantList.value);

        participantList.value = participantList.value.filter((item, index) => {
            const keyName: any = Object.keys(participantList.value[index])[0];
            console.log("keyName arr:", keyName);
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
            console.log(reason);
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
        },
        error: function (error: any) {
            console.error("text-> Error attaching plugin...", error);
        },
        iceState: function (state: any) {
            console.log("text-> ICE state changed to " + state);
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
            console.log("text-> json:", json);
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
            } else if (what === "error") {
                console.log("error 房間註冊失敗", json);
                let errorCode = json["error_code"];
                let errorMsg = json["error"];
                let parseErrorMsg = JSON.parse(errorMsg);
                // console.log("parseErrorMsg", parseErrorMsg);
                // console.log("errorCode", errorCode);
                if (errorCode === 901) {
                    // console.log("訊息發送錯誤碼");
                    const localMsg = JSON.parse(localStorage.getItem(`${route.params.eventKey}`));
                    console.log("localMsg", localMsg);
                    localMsg.forEach((item) => {
                        if (parseErrorMsg.janusMsg.config.id === item.janusMsg.config.id) {
                            item.janusMsg.config.deliveryStatusSuccess = false;
                            // console.log("更改重傳訊息狀態成功");
                        }
                    });
                    localStorage.setItem(`${route.params.eventKey}`, JSON.stringify(localMsg));
                    window.location.reload();
                }
            }

            processDataEvent(data, route.params.eventKey);
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
                        let participants = {
                            request: "listparticipants",
                            room: Number(eventID(route.params.eventKey)),
                        };
                        textPlugin.value.send({ message: participants });
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

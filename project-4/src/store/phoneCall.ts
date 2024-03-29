import { defineStore } from "pinia";
import Janus from "@/assets/js/janus";
import { useRoute } from "vue-router";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { nextTick } from "vue";

import { currentTime, currentDate, currentMonth, unixTime } from "@/util/dateUtil";
import { chatroomID } from "@/util/commonUtil";
import { useChatStore } from "@/store/chat";
import { localStorageMsg } from "@/util/commonUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import { sendGroupMsg } from "@/util/groupChatUtil";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";

/**
 * phoneType 狀態
 * 1:無回應
 * 2:取消通話
 * 3:語音來電
 * 4:未接來電
 */

export const usePhoneCallStore = defineStore({
    id: "phoneCall",
    state: () => ({
        callPlugin: <any>null,
        yourUsername: <any>null,
        jsepMsg: <any>null,
        isIncomingCall: <boolean>false,
        isAccepted: <boolean>false,
        route: <any>useRoute(),
        phoneType: <any>0,
        phoneTime: <any>"0:00",
        isMuted: <boolean>false,
        sender: <any>null,
    }),
    getters: {},
    actions: {
        //撥打電話
        doCall(display: any) {
            // Call someone
            console.log("do Call display", display);
            if (display === "") {
                alert("Insert a username to call (e.g., pluto)");
                return;
            }
            if (/[^a-zA-Z0-9]/.test(display)) {
                alert("Input is not alphanumeric");
                return;
            }
            const that = this;
            // Call this user
            that.callPlugin.createOffer({
                // By default, it's sendrecv for audio and video...
                media: { video: false },
                success: function (jsep: any) {
                    console.log("videocall Got SDP!", jsep);
                    const body = { request: "call", username: display };
                    that.callPlugin.send({ message: body, jsep: jsep });
                },
                error: function (error: any) {
                    console.error("videocall createOffer WebRTC error...", error);
                    //TODO do something
                    alert("請檢查麥克風是否開啟!!");
                    const modelStore = useModelStore();
                    const { phoneCallModal } = storeToRefs(modelStore);
                    phoneCallModal.value = false;
                },
            });
        },
        //有電話進來
        onIncomingCall(name: any, jsep: any) {
            console.log("有電話進來");
            console.log("name:", name);
            console.log("jsep:", jsep);
            //modal store
            const modelStore = useModelStore();
            const { phoneCallModal } = storeToRefs(modelStore);
            phoneCallModal.value = true;
            this.isIncomingCall = false;
            const that = this;
            this.sender = 0;
            that.callPlugin.createAnswer({
                jsep: jsep,
                media: { video: false },
                success: function (jsep: any) {
                    console.log("video call Got SDP!", jsep);
                    const body = { request: "accept" };
                    that.callPlugin.send({ message: body, jsep: jsep });
                },
                error: function (error: any) {
                    console.error("video call WebRTC error:", error);
                    alert("請檢查麥克風是否開啟!!");
                    const modelStore = useModelStore();
                    const { phoneCallModal } = storeToRefs(modelStore);
                    phoneCallModal.value = false;
                },
            });
        },
        //掛電話
        doHangup(type: any, eventID: any, sender?) {
            console.log("掛掉電話", sender);
            // Hangup a call
            const hangup = { request: "hangup" };
            this.callPlugin.send({ message: hangup });
            this.callPlugin.hangup();
            this.yourUsername = null;
            const chatstore = useChatStore();
            const { messages, participantList, textPlugin } = storeToRefs(chatstore);
            const { scrollToBottom } = chatstore;
            const apiStore = useApiStore();
            const { chatroomType } = storeToRefs(apiStore);
            const phoneObj = {
                janusMsg: {
                    chatroomID: chatroomID(this.route.params.eventKey),
                    msgType: 9,
                    sender: sender, // 0:客服, 1:使用者
                    msgContent: "",
                    time: unixTime(),
                    type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                    format: {
                        phoneType: type,
                        phoneTypeOther: type === 2 && this.isAccepted ? 4 : null,
                        phoneTime: this.phoneTime,
                    },
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: {},
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
            const otherPhoneObj = {
                janusMsg: {
                    chatroomID: chatroomID(this.route.params.eventKey),
                    msgType: 9,
                    sender: 1, // 0:客服, 1:使用者
                    msgContent: "",
                    time: unixTime(),
                    type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                    format: {
                        phoneType: 4,
                        phoneTypeOther: type === 2 && this.isAccepted ? 4 : null,
                        phoneTime: this.phoneTime,
                    },
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: {},
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

            const sendMsgObj = {
                msg: type === 1 ? otherPhoneObj : phoneObj,
                textPlugin: textPlugin.value,
                eventKey: this.route.params.eventKey,
                msgParticipantList: participantList.value,
                eventID: eventID,
            };
            if (chatroomType.value === 0) {
                sendPrivateMsg(sendMsgObj);
            } else {
                sendGroupMsg(sendMsgObj);
            }
        },
    },
});

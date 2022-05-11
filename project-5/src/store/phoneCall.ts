import { defineStore } from "pinia";
import Janus from "@/assets/js/janus";
import { useRoute, useRouter } from "vue-router";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";

import { unixTime, currentDate, currentMonth } from "@/util/dateUtil";
import { useChatStore } from "@/store/chat";
import { sendPrivateMsg } from "@/util/chatUtil";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import router from "@/router";

/**
 * phoneType 狀態
 * 1:無回應
 * 2:取消通話
 * 3:語音來電
 * 4:未接來電
 */
// Helper to parse query string
function getQueryStringValue(name) {
    // eslint-disable-next-line no-useless-escape
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
const getUserName = localStorage.getItem("userName");
export const usePhoneCallStore = defineStore({
    id: "phoneCall",
    state: () => ({
        callPlugin: <any>null,
        yourUserChatroomID: <any>"",
        jsepMsg: <any>null,
        isIncomingCall: <boolean>false,
        isAccepted: <boolean>false,
        route: <any>useRoute(),
        router: <any>useRouter(),
        phoneType: <any>0,
        phoneTime: <any>"0:00",
        isMuted: <boolean>false,
    }),
    getters: {},
    actions: {
        //撥打電話
        doCall(display: any) {
            // Call someone
            if (/[^a-zA-Z0-9]/.test(display)) {
                alert("Input is not alphanumeric");
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            // Call this user
            that.callPlugin.createOffer({
                trickle: true,
                media: { audioRecv: true, audioSend: true, audio: true, keepAudio: true },
                success: function (jsep: any) {
                    // @ts-ignore
                    Janus.debug("videocall Got SDP!", jsep);
                    that.localJsep = jsep;
                    const body = { request: "call", username: display };
                    that.callPlugin.send({ message: body, jsep: jsep });
                    console.log("body:", body);
                },

                error: function (error: any) {
                    alert("請檢查麥克風是否開啟!!");
                    const modelStore = useModelStore();
                    const { phoneCallModal } = storeToRefs(modelStore);
                    phoneCallModal.value = false;
                    // @ts-ignore
                    Janus.error("videocall createOffer WebRTC error...", error);
                    //TODO do something
                },
            });
        },
        //有電話進來 接聽電話
        onIncomingCall(name: any, jsep: any) {
            console.log("有電話進來");
            console.log("name:", name);
            console.log("jsep:", jsep);
            // api store
            const apiStore = useApiStore();
            const { phoneCallNumber } = storeToRefs(apiStore);
            //modal store
            const modelStore = useModelStore();
            const { phoneCallModal } = storeToRefs(modelStore);
            const { gotoChat } = modelStore;
            gotoChat(this.route.params.id, this.yourUserChatroomID, phoneCallNumber.value);
            phoneCallModal.value = true;
            this.isIncomingCall = false;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            that.callPlugin.createAnswer({
                jsep: jsep,
                media: { audioRecv: true, audioSend: true, audio: true, keepAudio: true },
                success: function (jsep: any) {
                    // @ts-ignore
                    console.log("有電話進來 Got SDP!", jsep);
                    that.localJsep = jsep;
                    const body = { request: "accept" };
                    that.callPlugin.send({ message: body, jsep: jsep });
                },
                error: function (error: any) {
                    // @ts-ignore
                    Janus.error("WebRTC error:", error);
                    alert("請檢查麥克風是否開啟!!");
                    const modelStore = useModelStore();
                    const { phoneCallModal } = storeToRefs(modelStore);
                    phoneCallModal.value = false;
                },
            });
        },
        //掛電話
        doHangup(type: any, chatRoomID, eventID) {
            const chatstore = useChatStore();
            const { textPlugin, isOnline } = storeToRefs(chatstore);
            console.log("掛掉電話種類", type);
            // api store
            const apiStore = useApiStore();
            const { messageList, phoneCallNumber } = storeToRefs(apiStore);
            // model store
            const modelStore = useModelStore();
            const { gotoChat } = modelStore;
            gotoChat(eventID, this.yourUserChatroomID, phoneCallNumber.value);
            this.yourUserChatroomID = null;
            const phoneObj = {
                janusMsg: {
                    chatroomID: chatRoomID,
                    msgType: 9,
                    sender: 0,
                    msgContent: "",
                    time: unixTime(),
                    type: 2,
                    format: {
                        phoneType: type,
                        phoneTypeOther: type === 2 && this.isAccepted ? 4 : null,
                        phoneTime: this.phoneTime,
                    },
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: "",
                        currentDate: currentDate(),
                        isExpire: false,
                        isPlay: false,
                        isRead: isOnline.value ? true : false,
                        msgFunctionStatus: false,
                        msgMoreStatus: false,
                        recallPopUp: false,
                        recallStatus: false,
                        userName: getUserName,
                    },
                },
            };

            messageList.value.push(phoneObj);
            const sendMsgObj = {
                msg: phoneObj,
                textPlugin: textPlugin.value,
                chatRoomID: chatRoomID,
                eventID: eventID,
            };
            sendPrivateMsg(sendMsgObj);
            // Hangup a call
            const hangup = { request: "hangup" };
            this.callPlugin.send({ message: hangup });
            this.callPlugin.hangup();
            console.log("電話傳電話訊息掛掉");
        },
    },
});

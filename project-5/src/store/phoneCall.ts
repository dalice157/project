import { defineStore } from "pinia";
import Janus from "@/assets/js/janus";
import { useRoute } from "vue-router";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";

import { currentTime, currentDate, currentMonth } from "@/util/dateUtil";
import { useChatStore } from "@/store/chat";
import { sendPrivateMsg } from "@/util/chatUtil";
import { useModelStore } from "@/store/model";

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
        yourUsername: <any>"",
        jsepMsg: <any>null,
        isIncomingCall: <boolean>false,
        isAccepted: <boolean>false,
        route: <any>useRoute(),
        phoneType: <any>0,
        phoneTime: <any>"0:00",
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
            this.callPlugin.createOffer({
                media: { audio: false, video: false, data: true },
                success: function (jsep: any) {
                    // @ts-ignore
                    Janus.debug("videocall Got SDP!", jsep);
                    const body = { request: "call", username: display };
                    that.callPlugin.send({ message: body, jsep: jsep });
                    console.log("body:", body);
                },

                error: function (error: any) {
                    console.log("error");
                    // @ts-ignore
                    Janus.error("videocall createOffer WebRTC error...", error);
                    //TODO do something
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
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this;
            this.callPlugin.createAnswer({
                jsep: jsep,
                media: { audio: false, video: false, data: true },
                simulcast: true,
                success: function (jsep: any) {
                    // @ts-ignore
                    Janus.debug("Got SDP!", jsep);
                    const body = { request: "accept" };
                    that.callPlugin.send({ message: body, jsep: jsep });
                },
                error: function (error: any) {
                    // @ts-ignore
                    Janus.error("WebRTC error:", error);
                },
            });
        },
        //掛電話
        doHangup(type: any, chatRoomID, eventID) {
            const chatstore = useChatStore();
            const { textPlugin } = storeToRefs(chatstore);

            console.log("掛掉電話種類", type);
            this.yourUsername = null;
            const phoneObj = {
                janusMsg: {
                    chatroomID: chatRoomID,
                    sender: 0,
                    type: 2,
                    msgType: 9,
                    message: "",
                    format: {
                        id: nanoid(),
                        isReplay: false,
                        replyObj: "",
                        isMMS: false,
                        phoneType: type,
                        phoneTypeOther: type === 2 ? 4 : null,
                        phoneTime: this.phoneTime,
                    },
                },
                currentDate: currentDate(),
                time: currentTime(),
                msgMoreStatus: false,
                msgFunctionStatus: false,
                recallStatus: false,
                recallPopUp: false,
                isExpire: false,
                isRead: false,
                isPlay: false,
            };
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
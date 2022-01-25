import { defineStore } from "pinia";

import { localStorageMsg, ME_USER_NAME } from "@/util/commonUtil";

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        messages: <any>[],
        msg: <any>"",
        replyMsg: <any>"",
        isReplyBox: <boolean>false,
        inputVal: <any>null,
        deleteBoolean: <boolean>false,
        deletePopUp: <boolean>false,
        deleteGroup: <any>[],
        chatRoomMsg: <any>null,
        pictures: <any>[],
        inputFunctionBoolean: <boolean>false,
        isUnableRead: <boolean>false,
        textPlugin: <any>"",
        showRecorderModal: <any>false,
    }),
    getters: {},
    actions: {
        // 回覆訊息
        replyMsgEvent(msg: any) {
            const findId = this.messages.find((text: any) => {
                return text.id === msg.id;
            });
            this.replyMsg = findId;
            this.isReplyBox = true;
            msg.msgFunctionStatus = false;
            this.inputVal.focus();
            this.inputFunctionBoolean = false;
        },
        // 關閉回訊視窗
        replyHide() {
            this.isReplyBox = false;
            this.replyMsg = "";
            this.inputVal.focus();
        },
        //刪除訊息提示
        deleteQuestion(msg: any) {
            this.deleteGroup = [];
            this.deleteBoolean = !this.deleteBoolean;
            msg.msgFunctionStatus = false;
        },
        //刪除訊息
        confirmDelete(chatToken: any) {
            this.messages = this.messages.filter((item: any) => {
                return !this.deleteGroup.includes(item.id);
            });
            localStorageMsg(this.messages, chatToken);
            this.deleteGroup = [];
            this.deleteBoolean = false;
            this.deletePopUp = false;
        },

        //獲取janus訊息
        getCompanyMsg(msgObj: any, chatToken: any) {
            console.log("msgObj:", msgObj);

            const messagesParse = JSON.parse(msgObj.msg);
            messagesParse.janusMsg.sender = 0;
            this.messages.push(messagesParse);
            if (msgObj.display !== ME_USER_NAME) {
                this.messages = JSON.parse(localStorage.getItem(`${chatToken}`) || "[]");
                this.messages.forEach((element) => {
                    element.isRead = true;
                });
                localStorageMsg(this.messages, chatToken);
            }
        },
        // 開啟錄音視窗
        openRecorder() {
            this.showRecorderModal = true;
            this.inputFunctionBoolean = false;
            //取得麥克風權限
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                    console.log("You let me use your mic!");
                })
                .catch(function (err) {
                    console.log("No mic for you!");
                    this.closeRecorder();
                });
        },
        //關閉錄音室窗
        closeRecorder() {
            this.showRecorderModal = false;
        },
    },
});

import { defineStore } from "pinia";

import { localStorageMsg } from "@/util/commonUtil";

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
            console.log("對方傳的msgObj:", msgObj);
            const messagesParse = JSON.parse(msgObj.msg);
            messagesParse.janusMsg.sender = 0;
            this.messages.push(messagesParse);
            // localStorageMsg(this.messages,route.query.chatToken);
        },
    },
});

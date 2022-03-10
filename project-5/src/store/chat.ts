import { defineStore, storeToRefs } from "pinia";

import { useApiStore } from "@/store/api";

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
        showStickerModal: <boolean>false,
        stickerGroupID: <number>1,
        stickerGroup: <any>[],
        stickerItems: <any>[],
        isMmsSend: <boolean>false,
        participantList: <any>[],
    }),
    getters: {},
    actions: {
        // 回覆訊息
        replyMsgEvent(msg: any) {
            // api store
            const apiStore = useApiStore();
            const { chatroomMsg } = storeToRefs(apiStore);
            const findId = chatroomMsg.value.messageList.find((text: any) => {
                return text.format.id === msg.format.id;
            });

            this.replyMsg = findId;
            this.isReplyBox = true;
            msg.msgFunctionStatus = false;

            console.log("replyMsg:", this.replyMsg);
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
        //獲取janus訊息
        getCompanyMsg() {
            console.log("獲取janus訊息");

            // api store
            const apiStore = useApiStore();
            const { isInput, isUserMsg } = storeToRefs(apiStore);
            isUserMsg.value = true;
            isInput.value = true;
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
        // 貼圖
        handleStickckerGroup(id: any) {
            console.log("id:", id);

            // api store
            const apiStore = useApiStore();
            const { stickerList } = storeToRefs(apiStore);
            this.stickerGroupID = id;
            const getlist = stickerList.value.find((item) => {
                return item.stickerPackID === this.stickerGroupID;
            });
            this.stickerGroup = id == 0 ? this.stickerItems : getlist;
            // console.log('this.stickerGroup"', this.stickerGroup);
        },
    },
});

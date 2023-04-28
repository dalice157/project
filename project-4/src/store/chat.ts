import { defineStore, storeToRefs } from "pinia";
import { nextTick } from "vue";

import { localStorageMsg, eventID } from "@/util/commonUtil";
import { useApiStore } from "@/store/api";


export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        findScrollHeight: <any>null,
        messages: <any>[],
        msg: <any>"",
        replyMsg: <any>"",
        isReplyBox: <boolean>false,
        webinputVal: <any>null,
        phoneinputVal: <any>null,
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
        participantList: <any>[],
        msgParticipantList: <any>[],
        isOnline: <boolean>false,
        janusConnectStatus: <boolean>false,
        userMicrophone: <any>null,
        userMediaMicrophone: <any>null,
        janus: <any>null,
        newMsgHint: <boolean>false,
        diffHeight: <any>0,
        chatroomScrolltop: <any>0,
        chatroomWindowHeight: <any>0,
        chatroomScrolltopAndWindowHeight: <any>0,
        chatroomScrollHeight: <any>0,
        groupReadNum: <any>0,
        isCallJoin: <any>false,
        groupReadList: <any>[]
    }),
    getters: {},
    actions: {
        // 回覆訊息
        replyMsgEvent(msg: any) {
            const findId = this.messages.find((text: any) => {
                return text.janusMsg.config.id === msg.janusMsg.config.id;
            });
            this.replyMsg = findId;
            this.isReplyBox = true;
            msg.janusMsg.config.msgFunctionStatus = false;
            setTimeout(() => {
                this.webinputVal.focus();
                this.phoneinputVal.focus();
                // console.log("this.phoneinputVal", this.phoneinputVal);
                // console.log("按下回覆 focus input 框");
            }, 500);
            this.inputFunctionBoolean = false;
        },
        // 關閉回訊視窗
        replyHide() {
            this.isReplyBox = false;
            this.replyMsg = "";
            setTimeout(() => {
                this.webinputVal.focus();
                this.phoneinputVal.focus();
                // console.log("this.phoneinputVal", this.phoneinputVal);
                // console.log("關閉回覆視窗 focus input 框");
            }, 500);
        },
        //刪除訊息提示
        deleteQuestion(msg: any) {
            this.deleteGroup = [];
            this.deleteBoolean = !this.deleteBoolean;
            msg.janusMsg.config.msgFunctionStatus = false;
        },
        //刪除訊息
        confirmDelete(eventKey: any) {
            this.messages = this.messages.filter((item: any) => {
                return !this.deleteGroup.includes(item.janusMsg.config.id);
            });
            localStorageMsg(this.messages, eventKey);
            this.deleteGroup = [];
            this.deleteBoolean = false;
            this.deletePopUp = false;
        },

        //獲取janus訊息
        getJanusMsg(data: any, eventKey: any) {
            
        },
        // 開啟錄音視窗
        openRecorder() {
            this.showRecorderModal = true;
            this.inputFunctionBoolean = false;
            this.showStickerModal = false;
            // //取得麥克風權限
            // navigator.mediaDevices
            //     .getUserMedia({ audio: true })
            //     .then(function (stream) {
            //         this.userMicrophone = stream;
            //         console.log("userMicrophone", stream);
            //         console.log("You let me use your mic!");
            //     })
            //     .catch(function (err) {
            //         console.log("No mic for you !");
            //         console.log("err", err);
            //     });
        },
        //關閉錄音室窗
        closeRecorder() {
            this.showRecorderModal = false;
            this.inputFunctionBoolean = false;
            // //取得麥克風權限
            // navigator.mediaDevices
            //     .getUserMedia({ audio: true })
            //     .then(function (stream) {
            //         console.log("You let me use your mic!");
            //         // stream.getTracks().forEach((track) => track.stop());
            //     })
            //     .catch(function (err) {
            //         console.log("No mic for you !");
            //     });
        },
        // 貼圖
        handleStickckerGroup(id: any) {
            // console.log("id:", id);
            // api store
            const apiStore = useApiStore();
            const { stickerList } = storeToRefs(apiStore);
            this.stickerGroupID = id;
            const getlist = stickerList.value.find((item) => {
                return item.stickerPackID === this.stickerGroupID;
            });
            this.stickerGroup = id == 0 ? this.stickerItems : getlist;
        },
        // 聊天室置底功能
        scrollToBottom() {
            if (this.findScrollHeight !== null) {
                this.findScrollHeight.scrollTop = this.findScrollHeight.scrollHeight;
            }
            this.newMsgHint = false;
        },
        // 動態獲取輸入框的高度差
        setDiffHeight(value: any) {
            this.diffHeight = value;
        },
        // 回到高度差為0
        backToTheOrigialDiffHeight() {
            this.diffHeight = 0;
        },
        // 儲存chatRoom滾動參數
        saveChatroomParams(
            chatroomScrolltop,
            chatroomWindowHeight,
            chatroomScrolltopAndWindowHeight,
            chatroomScrollHeight
        ) {
            this.chatroomScrolltop = chatroomScrolltop;
            this.chatroomWindowHeight = chatroomWindowHeight;
            this.chatroomScrolltopAndWindowHeight = chatroomScrolltopAndWindowHeight;
            this.chatroomScrollHeight = chatroomScrollHeight;
        },
        // 儲存群聊已讀數
        saveGroupReadNum(value: any) {
            this.groupReadNum = value;
        },
    },
});

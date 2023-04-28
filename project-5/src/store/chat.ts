import { defineStore, storeToRefs } from "pinia";
import { watch, ref, onUpdated } from "vue";
import { useApiStore } from "@/store/api";
import config from "@/config/config";
import { pointCalculation } from "@/util/commonUtil";

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        //一般聊天室 messagebox template ref
        findScrollHeight: <any>null,
        //群聊聊天室 messagebox template ref
        groupChatFindScrollHeight: <any>null,
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
        janusArr: [],
        // janus 註冊拿到的 transactions
        transactions: {},
        // 註冊後拿到的textPlugin
        textPlugin: <any>"",
        showRecorderModal: <any>false,
        showStickerModal: <boolean>false,
        stickerGroupID: <number>1,
        stickerGroup: <any>[],
        stickerItems: <any>[],
        isMmsSend: <boolean>false,
        participantList: <any>[],
        adminParticipantsWithOutMe: <any>[],
        onlineList: <any>[],
        isOnline: <boolean>false,
        messageFrom: <any>"",
        messageForm: <any>"",
        newMsgHint: <boolean>false,
        meJoinAlready: <boolean>false,
        diffHeight: <any>0,
        notification: <any>null,
        word: <any>config.wordLimit,
        count: <any>0,
        computedPoint: <any>0,
        chatroomScrolltop: <any>0,
        chatroomWindowHeight: <any>0,
        chatroomScrolltopAndWindowHeight: <any>0,
        chatroomScrollHeight: <any>0,
        isShowGuide7: <boolean>false,
        groupReadNum: <any>0,
        groupReadList: <any>[]
    }),
    getters: {},
    actions: {
        // 回覆訊息
        replyMsgEvent(msg: any) {
            // console.log("reply msg:", msg);
            // api store
            const apiStore = useApiStore();
            const { groupChatMessageList, messageList } = storeToRefs(apiStore);
            let findId;
            if (msg.janusMsg.type !== 3) {
                findId = messageList.value.find((text: any) => {
                    return text.janusMsg.config.id === msg.janusMsg.config.id;
                });
            } else {
                findId = groupChatMessageList.value.find((text: any) => {
                    return text.janusMsg.config.id === msg.janusMsg.config.id;
                });
            }

            // console.log("findid", findId);
            this.replyMsg = findId;
            this.isReplyBox = true;
            msg.janusMsg.config.msgFunctionStatus = false;
            // console.log("replyMsg:", this.replyMsg);
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
        //一般聊天室置底
        scrollToBottom() {
            if (this.findScrollHeight !== null) {
                this.findScrollHeight.scrollTop = this.findScrollHeight.scrollHeight;
            }
        },
        //群聊聊天室置底
        groupChatScrollToBottom() {
            if (this.groupChatFindScrollHeight !== null) {
                this.groupChatFindScrollHeight.scrollTop =
                    this.groupChatFindScrollHeight.scrollHeight;
            }
        },
        //驗證是否含有非法字元
        isIllegalCharacter(val) {
            const illegalWord = new RegExp("talkod.tw");
            if (val.match(illegalWord)) {
                return true;
            } else {
                return false;
            }
        },
        // 動態獲取輸入框的高度差
        setDiffHeight(value: any) {
            this.diffHeight = value;
        },
        // 回到高度差為0
        backToTheOrigialDiffHeight() {
            this.diffHeight = 0;
        },
        //input 簡訊 字數計算
        smsMessageComputed() {
            this.word = this.msg.length + config.wordLimit;
            this.count =
                this.msg === "" ? 0 : pointCalculation(this.msg + config.extraString).smsCount;
            this.computedPoint =
                this.msg === "" ? 0 : pointCalculation(this.msg + config.extraString).point;
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
        //
        saveGuide7(value) {
            this.isShowGuide7 = value;
        },
        // 儲存群聊已讀數
        saveGroupReadNum(value: any) {
            this.groupReadNum = value;
        },
    },
});

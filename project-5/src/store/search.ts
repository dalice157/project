import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { useChatStore } from "@/store/chat";
import { useChatRecordStore } from "@/store/chatRecord";
import { useApiStore } from "@/store/api";
import { scrollPageTo, groupChatScrollPageTo } from "@/util/commonUtil";

export const useSearchStore = defineStore({
    id: "search",
    state: () => ({
        keyWord: <string>"",
        moreKeyWord: <string>"",
        recordKeyWord: <string>"",
        searcMessages: <any>[],
        searcRecordMessages: <any>[],
        searcMoreMessages: <any>[],
        searchBoolean: <boolean>false,
        isResult: <boolean>false,
    }),
    getters: {},
    actions: {
        //開關搜尋功能
        searchSwitch() {
            this.searchBoolean = true;
            this.isResult = false;
        },
        //清除關鍵字
        clearResultKeyWord() {
            this.keyWord = "";
        },
        clearRecordKeyWord() {
            const apiStore = useApiStore();
            const { tagArea } = storeToRefs(apiStore);
            this.recordKeyWord = "";
            this.searcRecordMessages = [];
            setTimeout(() => {
                tagArea.value = document.querySelectorAll(".tagArea");
            }, 1000);
        },
        clearMoreKeyWord() {
            this.moreKeyWord = "";
        },
        //關閉seachbar按鈕
        closeSearchBar() {
            this.searchBoolean = false;
            this.isResult = false;
        },
        //一般交談室搜尋功能
        onSearchResult(val: any) {
            const apiStore = useApiStore();
            const { messageList } = storeToRefs(apiStore);
            this.isResult = true;
            if (val) {
                this.searcMessages = [];
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    // regStr = regStr + "(" + val[i] + ")([\\s]*)";
                    regStr += s;
                });
                const reg = new RegExp(regStr);
                messageList.value.forEach((msg: any) => {
                    // console.log("msg:", msg);
                    const message =
                        ((msg.janusMsg.msgType === 6 ||
                            msg.janusMsg.msgType === 7 ||
                            msg.janusMsg.msgType === 11) &&
                            msg.janusMsg.config.ShowName) ||
                        msg.janusMsg.msgContent;
                    const regMatch = message.match(reg);
                    if (regMatch) {
                        msg.janusMsg.tagMsg = msg.janusMsg.msgContent.replace(
                            reg,
                            `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                        );
                        this.searcMessages.push(msg);
                    }
                });
            }
            this.clearResultKeyWord();
        },
        //群聊交談室搜尋功能
        groupChatSearchResult(val: any) {
            const apiStore = useApiStore();
            const { groupChatMessageList } = storeToRefs(apiStore);
            this.isResult = true;
            if (val) {
                this.searcMessages = [];
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    // regStr = regStr + "(" + val[i] + ")([\\s]*)";
                    regStr += s;
                });
                const reg = new RegExp(regStr);
                groupChatMessageList.value.forEach((msg: any) => {
                    // console.log("msg:", msg);
                    const message =
                        ((msg.janusMsg.msgType === 6 ||
                            msg.janusMsg.msgType === 7 ||
                            msg.janusMsg.msgType === 11) &&
                            msg.janusMsg.config.ShowName) ||
                        msg.janusMsg.msgContent;
                    const regMatch = message.match(reg);
                    if (regMatch) {
                        msg.janusMsg.tagMsg = msg.janusMsg.msgContent.replace(
                            reg,
                            `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                        );
                        this.searcMessages.push(msg);
                    }
                });
            }
            this.clearResultKeyWord();
        },
        //歷史紀錄搜尋功能
        onSearchRecordResult(val: any) {
            const apiStore = useApiStore();
            const { tagArea } = storeToRefs(apiStore);
            const chatRecordStore = useChatRecordStore();
            const { recordMessages } = storeToRefs(chatRecordStore);
            if (val) {
                this.searcRecordMessages = [];
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    regStr += s;
                });
                const reg = new RegExp(regStr);
                recordMessages.value.forEach((msg: any) => {
                    // console.log("recordMessages", recordMessages.value);
                    const regMatchMsg = msg.msg.match(reg);
                    const regMatchName = msg.name.match(reg);
                    const regMatchPhone = String(msg.mobile).match(reg);
                    if (regMatchMsg) {
                        if (msg.msg) {
                            msg.tagMsgMobile = msg.mobile;
                            msg.tagMsgName = msg.name;
                            msg.tagMsg = msg.msg.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                            this.searcRecordMessages.unshift(msg);
                        }
                    } else if (regMatchName) {
                        if (msg.name) {
                            msg.tagMsgMobile = msg.mobile;
                            msg.tagMsgName = msg.name.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                            msg.tagMsg = msg.msg;
                            this.searcRecordMessages.unshift(msg);
                        }
                    } else if (regMatchPhone) {
                        if (msg.mobile && msg.name === "") {
                            msg.tagMsgMobile = String(msg.mobile).replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                            msg.tagMsgName = msg.name;
                            msg.tagMsg = msg.msg;
                            this.searcRecordMessages.unshift(msg);
                        }
                    }
                });
                // console.log("searcRecordMessages", this.searcRecordMessages);
                setTimeout(() => {
                    tagArea.value = document.querySelectorAll(".tagArea");
                }, 1000);
            } else {
                this.searcRecordMessages = [];
                setTimeout(() => {
                    tagArea.value = document.querySelectorAll(".tagArea");
                }, 1000);
            }
        },
        //更多聊天室
        onSearchMoreImResult(val: any) {
            // console.log("val:", val);
            const apiStore = useApiStore();
            const { eventList } = storeToRefs(apiStore);
            if (val) {
                this.searcMoreMessages = [];
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    // regStr = regStr + "(" + val[i] + ")([\\s]*)";
                    regStr += s;
                });

                const reg = new RegExp(regStr);
                eventList.value.forEach((msg: any) => {
                    const regMatch = msg.name.match(reg);
                    if (regMatch) {
                        if (msg.name) {
                            msg.tagName = msg.name.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }

                        this.searcMoreMessages.push(msg);
                    }
                });
            }
            console.log("searcMessages:", this.searcMoreMessages);
        },
        //一般訊息點擊前往
        onClickGoto(id: string, eventID: any) {
            console.log("一般訊息 ID:", id);
            // console.log("eventID:", eventID);
            //chat store
            const chatStore = useChatStore();
            const { messages } = storeToRefs(chatStore);
            scrollPageTo(id);
            messages.value = JSON.parse(localStorage.getItem(`${eventID}-backend`) || "[]");
            this.closeSearchBar();
            this.isResult = false;
        },
        //群聊訊息點擊前往
        groupChatGoto(id: string, eventID: any) {
            console.log("群聊訊息 ID:", id);
            // console.log("eventID:", eventID);
            //chat store
            const chatStore = useChatStore();
            const { messages } = storeToRefs(chatStore);
            groupChatScrollPageTo(id);
            messages.value = JSON.parse(localStorage.getItem(`${eventID}-backend`) || "[]");
            this.closeSearchBar();
            this.isResult = false;
        },
    },
});

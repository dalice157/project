import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { useChatStore } from "@/store/chat";
import { useChatRecordStore } from "@/store/chatRecord";
import { useApiStore } from "@/store/api";
import { scrollPageTo } from "@/util/commonUtil";

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
        searchIsMove: <boolean>false,
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
            this.recordKeyWord = "";
        },
        clearMoreKeyWord() {
            this.moreKeyWord = "";
        },
        //關閉seachbar按鈕
        closeSearchBar() {
            this.searchBoolean = false;
            this.isResult = false;
        },
        //交談室搜尋功能
        onSearchResult(val: any) {
            //chat store
            const chatStore = useChatStore();
            const { messages } = storeToRefs(chatStore);
            this.isResult = true;
            if (val) {
                this.searcMessages = [];
                const regStr = val;
                messages.value.forEach((msg: any) => {
                    const message =
                        msg.janusMsg.msgType === 1
                            ? msg.janusMsg.msgContent
                            : msg.janusMsg.msgType === 6 || msg.janusMsg.msgType === 7
                            ? msg.janusMsg.format.ShowName
                            : "";

                    const regMatch = message.includes(regStr);
                    // console.log("search message", message);
                    if (regMatch) {
                        //符合的文字訊息
                        if (msg.janusMsg.msgType === 1) {
                            msg.janusMsg.tagMsg = msg.janusMsg.msgContent.replace(
                                regStr,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }
                        //符合的圖片或檔案訊息
                        if (msg.janusMsg.msgType === 6 || msg.janusMsg.msgType === 7) {
                            msg.janusMsg.tagMsg = msg.janusMsg.format.ShowName.replace(
                                regStr,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }
                        console.log("符合搜尋資格msg", msg);
                        this.searcMessages.unshift(msg);
                    }
                });
            }
            this.clearResultKeyWord();
        },
        //歷史紀錄搜尋功能
        onSearchRecordResult(val: any) {
            // console.log(val);
            const chatRecordStore = useChatRecordStore();
            const { recordMessages } = storeToRefs(chatRecordStore);
            if (val) {
                this.searcRecordMessages = [];
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    // regStr = regStr + "(" + val[i] + ")([\\s]*)";
                    regStr += s;
                });

                const reg = new RegExp(regStr);
                // console.log("regStr:", regStr);
                // console.log("recordMessages", recordMessages.value);
                recordMessages.value.forEach((msg: any) => {
                    const regMatch = msg.janusMsg.msgContent.match(reg);
                    if (regMatch) {
                        if (msg.janusMsg.msgContent) {
                            msg.janusMsg.tagMsg = msg.janusMsg.msgContent.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }

                        this.searcRecordMessages.unshift(msg);
                    }
                });
                console.log("this.searcRecordMessages", this.searcRecordMessages);
            } else {
                this.searcRecordMessages = [];
            }
        },
        //更多聊天室
        onSearchMoreImResult(val: any) {
            console.log("val:", val);
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
        onClickGoto(id: string, eventKey: any) {
            console.log("eventKey:", eventKey);
            //chat store
            if (this.searchIsMove === false) {
                const chatStore = useChatStore();
                const { messages } = storeToRefs(chatStore);
                scrollPageTo(id);
                messages.value = JSON.parse(localStorage.getItem(`${eventKey}`) || "[]");
                this.closeSearchBar();
            } else {
                this.searchIsMove = false;
            }
        },
    },
});

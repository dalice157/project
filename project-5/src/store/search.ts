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
            this.searcRecordMessages = [];
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
                console.log("regStr:", regStr);

                const reg = new RegExp(regStr);
                messageList.value.forEach((msg: any) => {
                    // console.log("msg:", msg);
                    const message =
                        ((msg.janusMsg.msgType === 6 || msg.janusMsg.msgType === 7) &&
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
                recordMessages.value.forEach((msg: any) => {
                    const regMatch = msg.msg.match(reg);
                    if (regMatch) {
                        if (msg.msg) {
                            msg.tagMsg = msg.msg.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }

                        this.searcRecordMessages.unshift(msg);
                    }
                });
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
        onClickGoto(id: string, eventID: any) {
            console.log("eventID:", eventID);
            //chat store
            const chatStore = useChatStore();
            const { messages } = storeToRefs(chatStore);
            const route = useRoute();
            scrollPageTo(id,);
            messages.value = JSON.parse(localStorage.getItem(`${eventID}-backend`) || "[]");
            this.closeSearchBar();
            this.isResult = false;
        },
    },
});

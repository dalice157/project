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
                let regStr = "";
                const ary = val.split("");
                ary.forEach((s: any) => {
                    // regStr = regStr + "(" + val[i] + ")([\\s]*)";
                    regStr += s;
                });
                console.log("regStr:", regStr);

                const reg = new RegExp(regStr);
                messages.value.forEach((msg: any) => {
                    const message =
                        (msg.janusMsg.format && msg.janusMsg.format.ShowName) ||
                        msg.janusMsg.message;
                    const regMatch = message.match(reg);
                    if (regMatch) {
                        if (msg.janusMsg.message) {
                            msg.tagMsg = msg.janusMsg.message.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }

                        this.searcMessages.push(msg);
                    }
                });
            }
            this.clearResultKeyWord();
        },
        //歷史紀錄搜尋功能
        onSearchRecordResult(val: any) {
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
                console.log("recordMessages.value:", recordMessages.value);

                recordMessages.value.forEach((msg: any) => {
                    const regMatch = msg.message.match(reg);
                    if (regMatch) {
                        if (msg.message) {
                            msg.tagMsg = msg.message.replace(
                                reg,
                                `<span style="color: #FFB400; font-weight: bold;">${regStr}</span>`
                            );
                        }

                        this.searcRecordMessages.push(msg);
                    }
                });
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
        onClickGoto(id: string, chatToken: any) {
            console.log("chatToken:", chatToken);
            //chat store
            const chatStore = useChatStore();
            const { messages } = storeToRefs(chatStore);
            const route = useRoute();
            scrollPageTo(id);
            messages.value = JSON.parse(localStorage.getItem(`${chatToken}`) || "[]");
            this.closeSearchBar();
            this.isResult = false;
        },
    },
});

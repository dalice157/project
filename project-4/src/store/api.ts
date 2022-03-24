import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import dayjs from "dayjs";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { localStorageMsg } from "@/util/commonUtil";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        eventInfo: <any>{
            name: "test",
            callable: true,
            jid: 1,
            description: "hi",
            homeurl: "http://e8d.tw/",
            icon: "logo.png",
            messagelist: [],
            unreadList: null,
        },
        eventList: <any>[],
        stickerList: <any>[],
        stickerUrl: <string>"",
    }),
    getters: {},
    actions: {
        // 1GdSC2wd
        //發api拿取聊天資料
        async getBackendApi(token: any) {
            await axios
                .get(`${config.serverUrl}/Event/${token}`)
                .then((res: any) => {
                    this.eventInfo = res.data.eventInfo;
                    console.log("this.eventInfo 的未讀訊息", this.eventInfo);
                    const chatStore = useChatStore();
                    const { messages } = storeToRefs(chatStore);
                    if (this.eventInfo.unreadList !== null) {
                        this.eventInfo.unreadList.forEach((unReadMsg) => {
                            if (
                                !messages.value.some((msg) => {
                                    return msg.janusMsg.config.id === unReadMsg.janusMsg.config.id;
                                })
                            ) {
                                messages.value.push(unReadMsg);
                                localStorageMsg(messages.value, token);
                            }
                        });

                        // console.log("this.eventInfo.unreadList", this.eventInfo.unreadList);
                    }
                })
                .catch((err: any) => {
                    console.error("Event err:", err.response);
                    if (err.response.status === 404) {
                        alert("活動不存在!!");
                        location.href = "https://www.teamplus.tech/";
                    }
                });
        },
        //發api拿取交談紀錄聊天資料
        async getEventListApi(token: any) {
            await axios
                .get(`${config.serverUrl}/events/${token}`)
                .then((res: any) => {
                    this.eventList = res.data.eventList;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        async getSticker() {
            // api store
            const chatStore = useChatStore();
            const { handleStickckerGroup } = chatStore;
            const { stickerItems } = storeToRefs(chatStore);

            if (window.localStorage.getItem("sticker") !== null) {
                stickerItems.value = JSON.parse(window.localStorage.getItem("sticker"));
            }
            const isReloadTime = stickerItems.value.length > 0 ? 0 : 1;
            await axios
                .get(`${config.serverUrl}/sticker`)
                .then((res: any) => {
                    this.stickerList = res.data.stickerList;
                    this.stickerUrl = res.data.prefix;
                    handleStickckerGroup(isReloadTime);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
    },
});

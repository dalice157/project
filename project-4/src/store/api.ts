import axios from "axios";
import { defineStore, storeToRefs } from "pinia";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        eventInfo: <any>{
            name: "test",
            callable: true,
            description: "hi",
            homeurl: "http://e8d.tw/",
            icon: "logo.png",
            messagelist: [
                {
                    format: {},
                    MsgContent: "歡迎進入我們的聊天室！需要任何協助都可以告訴我們喔:>",
                    MsgType: 0,
                },
            ],
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
                })
                .catch((err: any) => {
                    console.error(err);
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

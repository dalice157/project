import axios from "axios";
import { defineStore } from "pinia";

import config from "@/config/config";

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
    }),
    getters: {},
    actions: {
        // 1GdSC2wd
        //發api拿取聊天資料
        getBackendApi(token: any) {
            axios
                .get(`${config.serverUrl}/Event/${token}`)
                .then((res: any) => {
                    this.eventInfo = res.data.data.eventInfo;
                    console.log(this.eventInfo);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //發api拿取交談紀錄聊天資料
        getEventListApi(token: any) {
            axios
                .get(`${config.serverUrl}/events/${token}`)
                .then((res: any) => {
                    this.eventList = res.data.data.EventList;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
    },
});

import { defineStore } from "pinia";

export const useGroupChatRecordStore = defineStore({
    id: "groupChatRecord",
    state: () => ({
        groupChatRecordMessages: <any>[],
        //紀錄第一次拿到群聊列表 做群聊紅點及未讀功能
        oldArr: <any>[],
    }),
    getters: {},
    actions: {},
});

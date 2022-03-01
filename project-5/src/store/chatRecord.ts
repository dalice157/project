import { defineStore } from "pinia";

export const useChatRecordStore = defineStore({
    id: "chatRecord",
    state: () => ({
        recordMessages: <any>[],
    }),
    getters: {},
    actions: {},
});

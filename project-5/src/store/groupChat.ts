import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config/config";

export const useGroupChatStore = defineStore({
    id: "groupChat",
    state: () => ({
        // 群聊邀請流程所需全域變數
        groupChatSubject: <any>"",
        groupChatContent: <any>"",
        groupChatPoint: <any>0,
        groupChatCount: <any>0,
        groupChatWord: <any>0,
        phoneArray: <any>[],
        phoneNumberList: <any>"",
        groupChatUserinfo: <any>{ name: "", icon: "", inner: 0, outter: 0 },
        selectInnerPeoplePopUp: <any>false,
        selectOutterPeoplePopUp: <any>0,
        
    }),
    getters: {},
    actions: {},
});

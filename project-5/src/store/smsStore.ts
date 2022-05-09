import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config/config";

export const useSmsStore = defineStore({
    id: "smsStore",
    state: () => ({
        smsChannel: <any>null,
        smsSubject: <any>"",
        smsContent: <any>"",
        smsWord: <any>config.wordLimit,
        smsCount: <any>0,
        smsPoint: <any>0,
        smsSendOption: <any>0,
        smsSendTimeStamp: <any>0,
        smsSendTime: <any>null,
        smsExcelFile: <any>null,
        smsPhoneArray: <any>[],
        smsPhoneString: <any>"",
        smsTabsType: <string>"automatic",
        smsCacheComponent: <any>[],
        smsPhrases: <any>"",
    }),
    getters: {},
    actions: {},
});

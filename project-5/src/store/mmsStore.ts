import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config/config";

export const useMmsStore = defineStore({
    id: "mmsStore",
    state: () => ({
        mmsChannel: <any>null,
        mmsSubject: <any>"",
        mmsUploadImgRef: <any>null,
        mmsImageWidth: <any>0,
        mmsImageHeight: <any>0,
        mmsContent: <any>"",
        mmsKB: <any>0,
        mmsPoint: <any>0,
        mmsSendOption: <any>0,
        mmsSendTimeStamp: <any>0,
        mmsSendTime: <any>null,
        mmsExcelFile: <any>null,
        mmsPhoneArray: <any>[],
        validMMSPhoneArray: <any>[],
        invalidMMSPhoneArray: <any>[],
        mmsPhoneString: <any>"",
        mmsTabsType: <string>"automatic",
        mmsCacheComponent: <any>[],
        mmsPhrases: <any>"",
    }),
    getters: {},
    actions: {},
});

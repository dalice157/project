import { defineStore } from "pinia";
import axios from "axios";
import config from "@/config/config";

export const useActivitySettingStore = defineStore({
    id: "activitySettingStore",
    state: () => ({
        staffList: <any>[],
    }),
    getters: {},
    actions: {},
});

import { defineStore, storeToRefs } from "pinia";

import { usePhoneCallStore } from "@/store/phoneCall";
import { DO_CALL_NAME } from "@/util/commonUtil";
import { useSearchStore } from "@/store/search";
import { useChatStore } from "@/store/chat";

export const useModelStore = defineStore({
    id: "model",
    state: () => ({
        isInfoPop: <boolean>false,
        showModal: <boolean>false,
        phoneCallModal: <boolean>false,
        info: <any>"",
    }),
    getters: {},
    actions: {
        showCompanyInfo(msg: any): void {
            console.log("msg:", msg);
            this.info = msg;
            this.isInfoPop = true;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        gotoChat(token: string | null) {
            console.log("token:", token);
            location.href = `/chat/${token}`;
        },
        gotoPhone(token: string | null) {
            location.href = `/phone/${token}`;

            // const phoneCallStore = usePhoneCallStore()
            // const { doCall } = phoneCallStore
            // this.phoneCallModal = true
            // doCall(DO_CALL_NAME);
        },
        closeAll() {
            const chatStore = useChatStore();
            const { closeRecorder } = chatStore;
            const searchStore = useSearchStore();
            const { closeSearchBar } = searchStore;

            closeRecorder();
            closeSearchBar();
        },
    },
});

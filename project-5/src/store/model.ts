import { defineStore, storeToRefs } from "pinia";

import { usePhoneCallStore } from "@/store/phoneCall";
import { useApiStore } from "@/store/api";
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
        gotoChat(eventID: any, chatroomID: any, mobile: any, router: any) {
            router.push(`/chat/${eventID}?chatroomID=${chatroomID}&mobile=${mobile}`);
        },
        gotoPhone(eventID: any, chatroomID: any, mobile: any) {
            location.href = `/phone/${eventID}?chatroomID=${chatroomID}&mobile=${mobile}`;
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

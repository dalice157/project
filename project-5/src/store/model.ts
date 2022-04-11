import { defineStore, storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useChatRecordStore } from "@/store/chatRecord";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { useChatStore } from "@/store/chat";
import { randomString } from "@/util/chatUtil";

export const useModelStore = defineStore({
    id: "model",
    state: () => ({
        isInfoPop: <boolean>false,
        showModal: <boolean>false,
        phoneCallModal: <boolean>false,
        info: <any>"",
        showDropdown: <boolean>false,
        router: useRouter(),
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
        gotoChat(eventID: any, chatroomID: any, mobile: any, index?) {
            const chatStore = useChatStore();
            const { textPlugin } = storeToRefs(chatStore);
            const chatRecord = useChatRecordStore();
            const { values, lists } = storeToRefs(chatRecord);

            console.log("eventID:", eventID);
            this.router.push(`/chat/${eventID}?chatroomID=${chatroomID}&mobile=${mobile}`);
        },
        gotoPhone(eventID: any, chatroomID: any, mobile: any) {
            location.href = `/phone/${eventID}?chatroomID=${chatroomID}&mobile=${mobile}`;
        },
        closeAll(isInput?) {
            const chatStore = useChatStore();
            const { closeRecorder } = chatStore;
            const { showStickerModal } = storeToRefs(chatStore);
            const searchStore = useSearchStore();
            const { closeSearchBar } = searchStore;
            if (isInput) {
                showStickerModal.value = false;
            }
            closeRecorder();
            closeSearchBar();
        },
    },
});

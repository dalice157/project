import { defineStore, storeToRefs } from "pinia";
import { useRouter } from "vue-router";

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
        router: <any>useRouter(),
    }),
    getters: {},
    actions: {
        showCompanyInfo(msg: any): void {
            console.log("showCompanyInfo:", msg);

            this.info = msg;
            this.isInfoPop = true;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        gotoChat(eventKey: string | null) {
            setTimeout(function () {
                document.location.href = `/${eventKey}`;
            }, 300);
        },
        logGotoChat(eventKey: string | null) {
            setTimeout(function () {
                document.location.href = `/${eventKey}`;
            }, 300);
        },
        gotoPhone(eventKey: string | null) {
            this.router.push(`/phone/${eventKey}`);
        },
        closeAll() {
            const chatStore = useChatStore();
            const { closeRecorder } = chatStore;
            const {
                showRecorderModal,
                inputFunctionBoolean,
                showStickerModal,
                userMediaMicrophone,
            } = storeToRefs(chatStore);
            const searchStore = useSearchStore();
            const { closeSearchBar } = searchStore;
            showRecorderModal.value = false;
            inputFunctionBoolean.value = false;
            showStickerModal.value = false;
            if (!userMediaMicrophone.value) return;
            userMediaMicrophone.value.getTracks().forEach((track) => track.stop());
            // closeRecorder();
            closeSearchBar();
        },
    },
});

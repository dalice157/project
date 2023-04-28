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
        showUserInfoModal: <boolean>false,
        filePreviewModal: <boolean>false,
        phoneCallModal: <boolean>false,
        info: <any>"",
        router: <any>useRouter(),
        isLoading: <boolean>false,
        isMove: <boolean>false,
        uploadIsLoading: <boolean>false,
    }),
    getters: {},
    actions: {
        showCompanyInfo(msg: any): void {
            console.log("showCompanyInfo:", msg);
            if (this.isMove === false) {
                this.info = msg;
                this.isInfoPop = true;
                this.showUserInfoModal = true;
            } else {
                this.isMove = false;
            }
        },
        closeModal() {
            setTimeout(() => {
                this.showUserInfoModal = false;
            }, 300);
        },
        gotoChat(eventKey: string | null) {
            setTimeout(function () {
                document.location.href = `/${eventKey}`;
            }, 300);
        },
        logGotoChat(eventKey: string | null, arr: any) {
            if (this.isMove === false) {
                this.isLoading = true;
                arr.forEach((item: any) => {
                    item.isfunctionPopUp = false;
                    if (item.chatToken == eventKey) {
                        item.unread = false;
                    }
                });
                setTimeout(function () {
                    this.isLoading = false;
                    document.location.href = `/${eventKey}`;
                }, 300);
            } else {
                this.isMove = false;
            }
            return false;
        },
        gotoPhone(eventKey: string | null) {
            this.router.push(`/phone/${eventKey}`);
        },
        closeAll() {
            setTimeout(() => {
                console.log("觸碰背景清空所有談窗,功能");
                const chatStore = useChatStore();
                const { closeRecorder } = chatStore;
                const {
                    showRecorderModal,
                    inputFunctionBoolean,
                    showStickerModal,
                    userMediaMicrophone,
                    messages,
                } = storeToRefs(chatStore);
                const searchStore = useSearchStore();
                const { closeSearchBar } = searchStore;
                showRecorderModal.value = false;
                inputFunctionBoolean.value = false;
                showStickerModal.value = false;
                // closeRecorder();
                closeSearchBar();
                messages.value.forEach((text: any) => {
                    text.janusMsg.config.msgFunctionStatus = false;
                });
                if (!userMediaMicrophone.value) return;
                userMediaMicrophone.value.getTracks().forEach((track) => track.stop());
            }, 100);
        },
    },
});

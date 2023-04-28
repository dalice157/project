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
        router: useRouter(),
        internalPeopleInfoSwitch: <boolean>false,
        externalPeopleInfoSwitch: <boolean>false,
        phoneCallModal: <boolean>false,
        innerPeopleInfo: <any>"",
        outterPeopleInfo: <any>"",
        showDropdown: <boolean>false,
        channelArrayPopUp: <any>[],
        uploadAnimationBoolean: <boolean>false,
    }),
    getters: {},
    actions: {
        showInternalPeopleInfo(personalInfo: any): void {
            console.log("showInternalPeopleInfo:", personalInfo);
            this.innerPeopleInfo = personalInfo;
            this.internalPeopleInfoSwitch = !this.internalPeopleInfoSwitch;
        },
        showExternalPeopleInfo(personalInfo: any): void {
            console.log("showExternalPeopleInfo:", personalInfo);
            this.outterPeopleInfo = personalInfo;
            this.externalPeopleInfoSwitch = !this.externalPeopleInfoSwitch;
        },
        gotoChat(eventID: any, chatroomID: any, mobile: any, index?) {
            // console.log("eventID:", eventID);
            this.router.push(`/chat/${eventID}?chatroomID=${chatroomID}&mobile=${mobile}`);
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

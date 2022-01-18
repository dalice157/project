import { defineStore } from "pinia";

export const useModelStore = defineStore({
    id: "model",
    state: () => ({
        isInfoPop: <boolean>false,
        showModal: <boolean>false,
        phoneCallModal:<boolean>false,
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
            location.href = `/?chatToken=${token}`;
        },
        gotoPhone(token: string | null) {
            location.href = `/phone?chatToken=${token}`;
        },
    },
});

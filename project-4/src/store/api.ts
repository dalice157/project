import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import dayjs from "dayjs";
import Janus from "@/assets/js/janus";
import adapter from "webrtc-adapter";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { localStorageMsg, eventID } from "@/util/commonUtil";
import { randomString } from "@/util/chatUtil";
import { signature } from "@/util/deviceUtil";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        eventInfo: <any>null,
        eventList: <any>[],
        stickerList: <any>[],
        stickerUrl: <string>"",
        isIllegalDevice: <boolean>false,
        vOldCode: <any>null,
        vCode: <any>null,
        mCode: <any>null,
    }),
    getters: {},
    actions: {
        async logIn(chatToken) {
            await axios({
                method: "get",
                url: `${config.serverUrl}/login/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    this.isIllegalDevice = false;
                    this.getBackendApi(chatToken);
                })
                .catch((err: any) => {
                    console.error(err);
                    if (err.response.status === 401) {
                        this.isIllegalDevice = true;
                        return;
                    }
                });
        },
        //發api拿取聊天資料
        async getBackendApi(chatToken: any) {
            await axios({
                method: "get",
                url: `${config.serverUrl}/Event/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    this.eventInfo = res.data.eventInfo;
                    this.getEventListApi(chatToken);
                    this.getSticker(chatToken);
                    const chatStore = useChatStore();
                    const { messages } = storeToRefs(chatStore);
                    if (this.eventInfo.unreadList !== null) {
                        this.eventInfo.unreadList.forEach((unReadMsg, _, arr) => {
                            if (unReadMsg.janusMsg.msgType === 10) {
                                const chatStore = useChatStore();
                                const { messages } = storeToRefs(chatStore);
                                messages.value = JSON.parse(
                                    localStorage.getItem(`${chatToken}`) || "[]"
                                );
                                messages.value.forEach((msg) => {
                                    if (msg.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                        msg.janusMsg.config.recallStatus = true;
                                    }
                                });
                            }
                            if (
                                !messages.value.some((msg) => {
                                    return msg.janusMsg.config.id === unReadMsg.janusMsg.config.id;
                                })
                            ) {
                                arr[0].janusMsg.config.isUnread = true;
                                messages.value.push(unReadMsg);
                                localStorageMsg(messages.value, chatToken);
                            }
                        });
                        console.log("this.eventInfo.unreadList", this.eventInfo.unreadList);
                    }
                })
                .catch((err: any) => {
                    console.error("Event err:", err);
                    if (err.response.status === 404) {
                        alert("活動不存在!!");
                        location.href = "https://www.teamplus.tech/";
                    }
                });
        },
        //發api拿取交談紀錄聊天資料
        async getEventListApi(token: any) {
            await axios({
                method: "get",
                url: `${config.serverUrl}/events/${token}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    this.eventList = res.data.eventList;
                    // console.log("拿eventlist");
                    // console.log("getEventListApi res", res);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //拿貼圖
        async getSticker(chatToken) {
            // api store
            const chatStore = useChatStore();
            const { handleStickckerGroup } = chatStore;
            const { stickerItems } = storeToRefs(chatStore);

            if (window.localStorage.getItem("sticker") !== null) {
                stickerItems.value = JSON.parse(window.localStorage.getItem("sticker"));
            }
            const isReloadTime = stickerItems.value.length > 0 ? 0 : 1;
            await axios({
                method: "get",
                url: `${config.serverUrl}/sticker/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    this.stickerList = res.data.stickerList;
                    this.stickerUrl = res.data.prefix;
                    handleStickckerGroup(isReloadTime);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //收回訊息api
        async recallAPI(msg, chatToken) {
            // api store
            const chatStore = useChatStore();
            const { textPlugin, participantList } = storeToRefs(chatStore);
            const fd = new FormData();
            fd.append("msgType", msg.janusMsg.msgType);
            fd.append("id", msg.janusMsg.config.id);
            fd.append("config", JSON.stringify(msg.janusMsg.config));
            const msgs = {
                ...msg,
                recall: "recall",
            };
            await axios({
                method: "patch",
                url: `${config.serverUrl}/message/${chatToken}`,
                data: fd,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    const message: any = {
                        textroom: "message",
                        transaction: randomString(12),
                        room: Number(eventID(chatToken)),
                        // tos: [全部在線客服1,全部在線客服2],
                        tos: participantList.value,
                        text: `${JSON.stringify(msgs)}`,
                    };
                    console.log("recallAPI res:", message);
                    textPlugin.value.data({
                        text: JSON.stringify(message),
                        error: function (reason: any) {
                            console.log("error:", reason);
                        },
                        success: function () {},
                    });
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得換機驗證碼
    },
});

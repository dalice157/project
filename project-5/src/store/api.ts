import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { chDateFormat } from "@/util/dateUtil";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        eventInfo: <any>{
            name: "test",
            callable: true,
            description: "hi",
            homeurl: "http://e8d.tw/",
            icon: "logo.png",
            messagelist: [
                {
                    format: {},
                    MsgContent: "歡迎進入我們的聊天室！需要任何協助都可以告訴我們喔:>",
                    MsgType: 0,
                },
            ],
        },
        eventList: <any>[],
        stickerList: <any>[],
        stickerUrl: <string>"",
        staffList: <any>[],
        activetyCsList: <any>[],
        checkedCsList: <any>[],
        chatroomList: <any>[],
        chatroomEventInfo: <any>"",
        channelEvent: <any>null,
        point: <any>0,
        adminList: <any>[],
        chatroomMsg: <any>{
            mobile: "無",
            chatroomID: "0",
            messageList: [],
        },
        msgStart: <any>0,
        isInput: <boolean>false,
        staffEvents: {
            accountName: "",
            events: [],
        },
        userInfo: <any>{
            description: "",
            icon: "0",
            mobile: "無",
            name: "訪客",
            tag: [],
        },
    }),
    getters: {},
    actions: {
        //取得使用者資訊
        async getChatroomUserInfoApi(chatroomID) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/chatroom/${chatroomID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    console.log("userInfo:", res.data);
                    this.userInfo = res.data;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 編輯使用者資訊
        async sendUserInfo(data) {
            console.log("sendUserInfo:", data);

            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            bodyFormData.append("chatroomID", data.chatroomID);
            bodyFormData.append("name", data.name);
            //@ts-ignore
            bodyFormData.append("mobile", parseFloat(data.mobile));
            bodyFormData.append("icon", data.icon);
            bodyFormData.append("tag", JSON.stringify(data.tag));
            bodyFormData.append("description", data.description);

            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatroom`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("sendUserInfo res:", res.data);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 聊天室歷史內容
        async getHistoryApi(chatRoomID) {
            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            this.msgStart = this.isInput ? 0 : this.msgStart;
            bodyFormData.append("chatroomID", chatRoomID);
            bodyFormData.append("start", this.msgStart);
            bodyFormData.append("size", "30");

            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/history`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    const list = res.data.messageList
                        ? res.data.messageList
                              .map((item) => {
                                  return {
                                      ...item,
                                      format: {
                                          id: item.format.id || nanoid(),
                                          isReplay: item.format.isReplay || false,
                                          replyObj: item.format.replyObj || "",
                                          ...item.format,
                                      },
                                      phoneType: "",
                                      audioInfo: "",
                                      msgMoreStatus: false,
                                      msgFunctionStatus: false,
                                      recallStatus: false,
                                      recallPopUp: false,
                                      expirationDate: "",
                                      isPlay: false,
                                      isExpire: false,
                                      tagMsg: "",
                                  };
                              })
                              .reverse()
                        : [];
                    const getList = this.isInput ? list : list.concat(this.chatroomMsg.messageList);
                    this.chatroomMsg = {
                        ...res.data,
                        messageList: getList,
                    };
                    this.isInput = false;
                    console.log("chatroomMsg", this.chatroomMsg);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得聊天室左側列表
        async getChatroomlistApi(eventID) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/chatroomlist/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    this.chatroomList = res.data.chatroomList;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得活動資訊
        async getEventApi(eventID: any) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/event/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("event res:", res);
                    this.eventInfo = res.data.msg;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得活動資訊列表
        async getEventListApi() {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/eventlist`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("eventlist res:", res);
                    this.eventList = res.data.eventList;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //拿貼圖api
        async getSticker() {
            // api store
            const chatStore = useChatStore();
            const { handleStickckerGroup } = chatStore;
            const { stickerItems } = storeToRefs(chatStore);

            if (window.localStorage.getItem("sticker-backend") !== null) {
                stickerItems.value = JSON.parse(window.localStorage.getItem("sticker-backend"));
            }
            const isReloadTime = stickerItems.value.length > 0 ? 0 : 1;
            await axios
                .get(`${config.serverUrl}/v1/sticker`)
                .then((res: any) => {
                    this.stickerList = res.data.stickerList;
                    this.stickerUrl = res.data.prefix;
                    handleStickckerGroup(isReloadTime);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 取得所有客服人員列表
        async getCustomServiceStaffList() {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/cs`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("csList", res.data);
                    this.staffList = res.data.cslist;
                })
                .catch((err: any) => {
                    if (err.response) {
                        // console.log("data", err.response.data);
                        // console.log("status", err.response.status);
                        // console.log("headers", err.response.headers);
                        if (err.response.data.msg === "沒有客服人員") {
                            this.staffList = [];
                            console.error(err);
                        }
                    }
                });
        },
        // 取得活動客服人員列表
        async getActivetyCsList(eventID) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/cs/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("cs res:", res);
                    this.activetyCsList = res.data.cslist;
                    this.checkedCsList = Object.values(res.data.cslist).map(
                        (item) => (item as any).accountID
                    );
                })
                .catch((err: any) => {
                    console.log("cs err:", err);
                });
        },
        // 取得活動資訊
        async getChannelEvent(eventID) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/event/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("channel event res:", res.data.msg);
                    this.channelEvent = res.data.msg;
                })
                .catch((err: any) => {
                    console.log("channel event err:", err);
                });
        },
        // 編輯活動
        async sendChannelEventInfo(route, data, router) {
            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            bodyFormData.append("icon", data.icon);
            bodyFormData.append("callable", data.callable);
            bodyFormData.append("name", data.name);
            bodyFormData.append("status", data.status);
            bodyFormData.append("homeurl", data.homeurl);
            bodyFormData.append("description", data.description);
            bodyFormData.append("cslist", data.cslist);
            bodyFormData.append("message", data.message);

            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatroom/${route.query.eventID}`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("channel edit res:", res.data);
                    router.push(`/manage/${route.params.id}/activitySetting`);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //刪除活動
        async deleteChannelEventInfo(route, router) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("status", "2");
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chartroom/${route.query.eventID}`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("channel delete res:", res.data);
                    router.push(`/manage/${route.params.id}/activitySetting`);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 登入時發送 與簡訊部連線
        async connectionWithNewsletterDepartment(id: any) {
            const fd = new FormData();
            fd.append("uid", "COMMTEST");
            fd.append("pwd", "g7rabgtz");
            await axios
                .post(`${config.serverUrl}/v1/connection`, fd)
                .then((res: any) => {
                    // console.log("connection res:", res);
                    localStorage.setItem("newsletterDepartmentToken", res.data.msg);
                    location.href = `/chat/${id}`;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 拿取sms簡訊table
        async getSmsMessageTable() {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("BID", "4cfac87a-22be-4f4a-bc77-1c54774437ca");
            fd.append("Type", "0");
            await axios
                .post(`${config.serverUrl}/v1/msg`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                    data: fd,
                })
                .then((res: any) => {
                    // console.log(" SMS Table res:", res);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //獲取點數
        async getPoint() {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            const newsletterDepartmentToken = localStorage.getItem("newsletterDepartmentToken");
            fd.append("token", newsletterDepartmentToken);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/credit`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log(" point res:", res);
                    this.point = res.data.point;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得管理者list
        async getAdminList() {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/admin`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log(" adminList res:", res);
                    this.adminList = res.data.admins;
                })
                .catch((err: any) => {
                    if (err.response) {
                        // console.log("data", err.response.data);
                        // console.log("status", err.response.status);
                        // console.log("headers", err.response.headers);
                        if (err.response.data.msg === "沒有管理人員") {
                            this.adminList = [];
                        }
                    }
                });
        },
        //新增管理者list
        async addAdminList(accounts: any) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("admin", "1");
            fd.append("accounts", accounts);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/admin`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.getAdminList();
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //刪除管理者list
        async removeAdminList(accounts: any) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("admin", "0");
            fd.append("accounts", JSON.stringify(accounts));
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/admin`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.getAdminList();
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 取得編輯服務人員
        async getEvents(accountId) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/events/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    this.staffEvents = res.data;
                    console.log("staffEvents", this.staffEvents);
                    // this.channelEvent = res.data.msg;
                })
                .catch((err: any) => {
                    if (err.response) {
                        // console.log("data", err.response.data);
                        // console.log("status", err.response.status);
                        // console.log("headers", err.response.headers);
                        if (err.response.data.msg === "沒有管理人員") {
                            this.staffEvents = [];
                        }
                    }
                    console.log("events err:", err);
                });
        },

        // 更新編輯服務人員
        async sendEvents(accountId, events, router) {
            console.log("accountId:", accountId);
            console.log("events:", events);

            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "put",
                url: `${config.serverUrl}/v1/events/${accountId}`,
                data: JSON.stringify(events),
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("res:", res);
                    router.push(`/manage/${accountId}/activitySetting`);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
    },
});

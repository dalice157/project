import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { currentTime, currentDate } from "@/util/dateUtil";
import { randomString } from "@/util/chatUtil";
import { resetSetItem } from "@/util/commonUtil";
import dayjs from "dayjs";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        eventInfo: <any>{
            name: "test",
            callable: 0,
            status: 1,
            jid: 1,
            description: "hi",
            homeurl: "http://e8d.tw/",
            icon: "logo.png",
            messageList: [],
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
        totalCount: <any>0,
        msgStart: <any>0,
        staffEvents: {
            accountName: "",
            events: [],
        },
        userInfo: <any>{
            description: "",
            icon: 0,
            mobile: "0",
            name: "訪客",
            tag: [],
        },
        uploadRef: <any>null,
        invalidList: <any>[],
        commonMsgList: <any>[],
        isInput: <boolean>false,
        isUserMsg: <boolean>false,
        isJanusinit: false,
        messageList: <any>[],
        isDisabled: <boolean>false,
        inquireSMSShortMessageList: <any>[],
        inquireMMSShortMessageList: <any>[],
        accounts: <any>[],
    }),
    getters: {},
    actions: {
        // 聊天室簡訊發送
        async sendMMSMsg(data) {
            console.log("sendMMSMsg:", data);
            // chat store
            const chatStore = useChatStore();
            const { isMmsSend } = storeToRefs(chatStore);
            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            bodyFormData.append("text", data.text);

            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/msg/${data.chatRoomID}`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    isMmsSend.value = false;
                    console.log("sendMMSMsg res:", res.data);
                    this.point = res.data.point;
                })
                .catch((err: any) => {
                    isMmsSend.value = false;
                    console.error("sendMMSMsg error:", err.response);
                });
        },
        //取得使用者資訊
        async getChatroomUserInfoApi(chatroomID) {
            // console.log("chatroomid", chatroomID);
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/chatroom/${chatroomID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    // console.log("userInfo:", res.data);
                    this.userInfo = res.data;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 編輯使用者資訊
        async sendUserInfo(data) {
            // console.log("sendUserInfo:", data);

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
                    // console.log("sendUserInfo res:", res.data);
                    this.getChatroomlistApi(data.eventID);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 置頂
        async sendPinTop(data) {
            console.log("sendUserInfo:", data);

            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            bodyFormData.append("chatroomID", data.chatroomID);
            bodyFormData.append("pinTop", data.pinTop);

            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatroom`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("sendUserInfo res:", res.data);
                    this.getChatroomlistApi(data.eventID);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        // 聊天室歷史內容
        async getHistoryApi(chatRoomID, eventID) {
            console.log("1 isInput:", this.isInput);
            const getToken = localStorage.getItem("access_token");
            const welcomeList = JSON.parse(localStorage.getItem(`${eventID}-welcomeList`) || "[]");

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
                    this.totalCount = res.data.totalCount;
                    this.messageList = this.isInput
                        ? !res.data.messageList
                            ? [...welcomeList]
                            : [...welcomeList, ...res.data.messageList]
                        : this.messageList.concat(
                              !res.data.messageList
                                  ? [...welcomeList]
                                  : [...welcomeList, ...res.data.messageList]
                          );
                    this.messageList = this.messageList.reduce((unique, o) => {
                        const hasRepeatId = unique.some((obj) => {
                            return (
                                obj.janusMsg.config.id === o.janusMsg.config.id &&
                                obj.janusMsg.msgType !== 10
                            );
                        });
                        if (!hasRepeatId) {
                            unique.push(o);
                        }
                        unique.sort((a, b) => {
                            return a.janusMsg.time / 1000000 - b.janusMsg.time / 1000000;
                        });
                        return unique;
                    }, []);
                    const lastChatMessage = this.messageList.filter(
                        (item) => !item.janusMsg.config.recallStatus
                    );
                    resetSetItem(
                        `${chatRoomID}-lastChatMessage`,
                        JSON.stringify(lastChatMessage.slice(-10))
                    );

                    // sessionStorage.setItem(
                    //     `${chatRoomID}-lastChatMessage`,
                    //     JSON.stringify(lastChatMessage.slice(-10))
                    // );
                    if (
                        this.messageList.length > 0 &&
                        this.userInfo.lastVisit >
                            this.messageList[this.messageList.length - 1].janusMsg.time
                    ) {
                        this.messageList = this.messageList.map((item) => {
                            item.janusMsg.config.isRead = true;
                            return item;
                        });
                    }

                    this.isInput = false;
                    this.isUserMsg = false;
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //取得聊天室左側列表
        async getChatroomlistApi(eventID, getFrom?, chatroomID?) {
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/chatroomlist/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    this.chatroomList = res.data.chatroomList.sort((a, b) => {
                        return b.pinTop - a.pinTop;
                    });
                    // this.chatroomList.forEach((item) => {
                    //     item.unread = 0;
                    //     // console.log("chat list chatroomID:", item.chatroomID);
                    //     // console.log("chat list getFrom:", getFrom);
                    //     // if (item.chatroomID == getFrom) {
                    //     //     item.unread = 1;
                    //     // }
                    // });

                    console.log("chatroomList api:", this.chatroomList);
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
                    localStorage.setItem(
                        `${eventID}-welcomeList`,
                        JSON.stringify(res.data.msg.messageList)
                    );
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
                    console.log("this.eventList:", this.eventList);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //拿貼圖api
        async getSticker() {
            // chat store
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
                    const accountID = Number(localStorage.getItem("accountID"));
                    res.data.cslist = res.data.cslist.filter((item) => {
                        return item.accountID !== accountID;
                    });
                    this.staffList = res.data.cslist;
                })
                .catch((err: any) => {
                    // console.log("data", err.response.data);
                    // console.log("status", err.response.status);
                    // console.log("headers", err.response.headers);
                    if (err.response && err.response.data.msg === "沒有客服人員") {
                        this.staffList.events = [];
                        console.error(err);
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
            this.isDisabled = true;
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatroom/${route.query.eventID}`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("channel edit res:", res.data);
                    this.isDisabled = false;
                    route.params.id
                        ? router.push(`/manage/${route.params.id}/activitySetting`)
                        : router.push(`/manage/activitySetting`);
                })
                .catch((err: any) => {
                    this.isDisabled = false;
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
                url: `${config.serverUrl}/v1/chatroom/${route.query.eventID}`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("channel delete res:", res.data);
                    route.params.id
                        ? router.push(`/manage/${route.params.id}/activitySetting`)
                        : router.push(`/manage/activitySetting`);
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
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/credit`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    // console.log("point res:", res.data.status);
                    this.point = res.data.point === undefined ? 0 : res.data.point;
                })
                .catch((err: any) => {
                    console.error(err);
                    location.href = `/`;
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
                    this.staffEvents = { ...res.data, events: res.data.events || [] };
                    // this.channelEvent = res.data.msg;
                })
                .catch((err: any) => {
                    if (err.response && err.response.data.msg === "沒有管理人員") {
                        this.staffEvents = {
                            accountName: "",
                            events: [],
                        };
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
                    accountId
                        ? router.push(`/manage/${accountId}/activitySetting`)
                        : router.push(`/manage/activitySetting`);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //excel電話號碼驗證
        async excelVerification(file) {
            console.log("file:", file);
            const getToken = localStorage.getItem("access_token");
            const fileType = file.type;
            const fileName = file.name;
            const fd = new FormData();
            fd.append("file", new File([file], fileName, { type: fileType }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/verify`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("excel res", res);
                    this.uploadRef = res.data;
                    this.invalidList = res.data.invalid;
                })
                .catch((err: any) => {
                    if (err.response) {
                        console.log("excel err:", err.response);
                    }
                });
        },
        //取得常用簡訊列表
        async getCommonMsgList(accountID: any) {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/oftens/${accountID}`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.commonMsgList = res.data.oftens.reverse();
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //新增常用簡訊
        async addCommonMsgObj(accountID: any, msg: any) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("accountID", accountID);
            fd.append("subject", msg.subject);
            fd.append("content", msg.content);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/oftens`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.getCommonMsgList(accountID);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //刪除常用簡訊
        async removeCommonMsgObj(id: any) {
            const getToken = localStorage.getItem("access_token");
            const accountID = localStorage.getItem("accountID");
            const fd = new FormData();
            fd.append("smsID", id);
            await axios({
                method: "delete",
                url: `${config.serverUrl}/v1/oftens`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.getCommonMsgList(accountID);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //編輯常用簡訊
        async editCommonMsgObj(id: any, subject: any, content: any) {
            const getToken = localStorage.getItem("access_token");
            const accountID = localStorage.getItem("accountID");
            const fd = new FormData();
            fd.append("smsID", id);
            fd.append("subject", subject);
            fd.append("content", content);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/oftens`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    this.getCommonMsgList(accountID);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        },
        //收回訊息api
        async recallAPI(msg, params, chatroomID) {
            console.log("msg:", msg);
            // api store
            const chatStore = useChatStore();
            const { textPlugin } = storeToRefs(chatStore);
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("chatroomID", chatroomID);
            fd.append("msgType", msg.janusMsg.msgType);
            fd.append("id", msg.janusMsg.config.id);
            fd.append("config", JSON.stringify(msg.janusMsg.config));
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/message`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("recall API", res);
                    const recallMsgObj = {
                        janusMsg: {
                            ...msg.janusMsg,
                            msgType: 10,
                        },
                    };
                    const message: any = {
                        textroom: "message",
                        transaction: randomString(12),
                        room: Number(params),
                        // tos: [全部在線客服1,全部在線客服2],
                        tos: [chatroomID],
                        text: JSON.stringify(recallMsgObj),
                    };
                    textPlugin.value.data({
                        text: JSON.stringify(message),
                        error: function (reason: any) {
                            console.log("error:", reason);
                        },
                        success: function () {
                            console.log("recall pin");
                        },
                    });
                    console.log("recallAPI res:", message);
                    this.getHistoryApi(chatroomID, params);
                })
                .catch((err: any) => {
                    console.error(err.response);
                });
        },
        //查詢簡訊api
        async inquireShortMessage(type, date, mobile, status) {
            // api store
            // console.log(type, date[0], date[1], mobile ? mobile : "", status ? status[0] : -1);
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("type", type);
            fd.append("start", date[0]);
            fd.append("end", date[1]);
            fd.append("mobile", mobile ? mobile : "");
            fd.append("status", status ? status[0] : -1);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/msg`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("inquireShortMessage", res);
                    type === "0"
                        ? (this.inquireSMSShortMessageList = res.data.list || [])
                        : (this.inquireMMSShortMessageList = res.data.list || []);
                    console.log("inquireSMSShortMessageList", this.inquireSMSShortMessageList);
                    console.log("inquireMMSShortMessageList", this.inquireMMSShortMessageList);
                })
                .catch((err: any) => {
                    console.error(err.response);
                });
        },
        //取消預約簡訊
        async deleteReservationShortMsg(type, data) {
            console.log("type", type);
            console.log("bid", data.bid);
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("type", type);
            fd.append("bid", data.bid);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/cancel`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("deleteReservationShortMsg res", res);
                })
                .catch((err: any) => {
                    console.error(err.response);
                });
        },
        // 取得所有子帳號清單
        async getAccounts() {
            const getToken = localStorage.getItem("access_token");
            const accountID = Number(localStorage.getItem("accountID"));
            await axios
                .get(`${config.serverUrl}/v1/accounts`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    this.accounts = res.data.accounts.filter((item) => {
                        return item.accountID !== accountID;
                    });
                    console.log("staffEvents", this.accounts);
                    // this.channelEvent = res.data.msg;
                })
                .catch((err: any) => {
                    if (err.response && err.response.data.msg === "沒有管理人員") {
                        this.accounts = [];
                    }
                    console.log("events err:", err);
                });
        },
    },
});

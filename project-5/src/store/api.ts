import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import { nextTick, getCurrentInstance, onUpdated } from "vue";
import { useRoute, useRouter } from "vue-router";
import { nanoid } from "nanoid";
import { Debugout } from "debugout.js";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { useChatRecordStore } from "@/store/chatRecord";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { currentTime, currentDate, unixTime } from "@/util/dateUtil";
import { randomString } from "@/util/chatUtil";
import { resetSetItem, tokenExpireToLogin, scrollPageTo } from "@/util/commonUtil";
import dayjs from "dayjs";
import { LinkOutline } from "@vicons/ionicons5";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        route: useRoute(),
        router: useRouter(),
        eventInfo: <any>{
            name: "",
            callable: 0,
            status: 1,
            jid: 1,
            description: "",
            homeurl: "",
            icon: "",
            messageList: [],
        },
        eventList: <any>[],
        eventListHeartBeats: <any>[],
        stickerList: <any>[],
        stickerUrl: <string>"",
        staffList: <any>[],
        activetyCsList: <any>[],
        checkedCsList: <any>[],
        chatroomList: <any>[],
        chatroomEventInfo: <any>"",
        channelEvent: <any>null,
        point: <any>0,
        pointStatus: <any>0,
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
            lastVisit: 0,
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
        tableInformation: <any>"normal",
        pageCount: <any>1,
        timeInterval: <any>[],
        inquireSMSShortMessageList: <any>[],
        inquireMMSShortMessageList: <any>[],
        accounts: <any>[],
        phoneCallName: <any>"",
        phoneCallIcon: <any>0,
        phoneCallNumber: <any>null,
        autoReplyList: <any>[],
        bugout: new Debugout(),
        diaryLog: <any>"",
        userName: <any>localStorage.getItem("userName"),
        tagArea: <any>{},
        instance: <any>getCurrentInstance(),
        inquireLoading: <boolean>false,
        chatroomListLoading: <boolean>true,
        imgCode: <any>"",
        imgId: <any>"",
        isVarificationCodeExpire: <boolean>false,
        isFirstLogin: <boolean>false,
        isCloseMask: <boolean>false,
        isCloseMask1: <boolean>false,
        currentStep: <any>1,
        apiAlertMessage: <any>"",
        addhttps: <any>false,
        chatContent: <any>[],
        //通訊錄列表
        addressBookList: <any>[],
        addressBookLoading: <boolean>true,
        //通訊錄部門列表
        addressBookDepartment: <any>[],
        profile: <any>{},
        profileAvatarStatus: <any>0,
        labelChannelList: <any>[],
        tagList: <any>[],
        // call janus 建房ID
        eventID: <any>0,
        //內部人員首頁列表
        innerPeople: <any>[],
        //外部人員首頁列表
        outterPeople: <any>[],
        groupChatEvent: <any>null,
        groupChatMessageList: <any>[],
        chatRoomInnerPeopleInfo: <any>[],
        chatRoomOutterPeopleInfo: <any>[],
        // 群聊已讀結構
        groupMemberVisitTimeInfoList: <any>[],
        //內部彈窗選擇部門人員列表
        internalDepartmentPeople: <any>[],
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
                    // console.error("sendMMSMsg error:", err.response);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        //取得使用者資訊
        async getChatroomUserInfoApi(
            chatroomID,
            newUser = false,
            chatroomInfo = {
                chatroomID: "",
                icon: 0,
                mobile: 0,
                msg: "",
                msgType: 1,
                name: "",
                pinTop: 0,
                tag: [],
                time: 0,
                unread: 1,
                visit: 0,
            }
        ) {
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
                    // 辨認為新使用者 新建chatroom
                    if (newUser) {
                        chatroomInfo.icon = res.data.icon;
                        chatroomInfo.mobile = res.data.mobile;
                        chatroomInfo.name = res.data.name;
                        chatroomInfo.tag = res.data.tag;
                        chatroomInfo.visit = res.data.lastVisit;
                        console.log("需要創建新chatroom的資訊", chatroomInfo);
                        this.chatroomList.push(chatroomInfo);
                        this.chatroomList
                            .sort((a, b) => {
                                return b.time - a.time;
                            })
                            .sort((a, b) => {
                                return b.pinTop - a.pinTop;
                            });
                        this.chatroomList.forEach((chatroom) => {
                            sessionStorage.setItem(`${chatroom.chatroomID}-lastChatMessage`, "[]");
                        });
                        console.log("推入新chatroom");
                        return;
                    }
                    this.userInfo = res.data;
                    this.userInfo.mobile = String(res.data.mobile);
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        // 聊天室歷史內容
        async getHistoryApi(chatRoomID?, eventID?, loadingData?) {
            // console.log(" getHistoryApi isInput:", this.isInput);
            const getToken = localStorage.getItem("access_token");
            // const welcomeList = JSON.parse(localStorage.getItem(`${eventID}-welcomeList`) || "[]");
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
                    console.log("一般聊天室歷史訊息", res.data);
                    this.totalCount = res.data.totalCount;
                    this.messageList = this.isInput
                        ? !res.data.messageList
                            ? []
                            : [...res.data.messageList]
                        : this.messageList.concat(
                              !res.data.messageList ? [] : [...res.data.messageList]
                          );
                    //訊息排序去重
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
                            return a.janusMsg.time - b.janusMsg.time;
                        });
                        return unique;
                    }, []);
                    // 判斷電話型式 即刪除userName
                    this.messageList.forEach((msg) => {
                        if (msg.janusMsg.sender == 1 && msg.janusMsg.format.phoneType == 1) {
                            msg.janusMsg.format.phoneType = 4;
                        }
                        if (msg.janusMsg.sender === 1 && msg.janusMsg.msgType === 9) {
                            delete msg.janusMsg.config.userName;
                        }
                    });
                    //增加聊天室內未讀訊息判斷
                    const currentRoom = this.chatroomList.filter(
                        (room) => room.chatroomID === this.route.query.chatroomID
                    );

                    const firstUnreadListMsg = this.messageList.find(
                        (msg) =>
                            msg.janusMsg.time > currentRoom[0]?.visit &&
                            msg.janusMsg.sender === 1 &&
                            msg.janusMsg.config.recallStatus === false
                    );

                    this.chatroomList.forEach((room) => {
                        if (room.chatroomID === this.route.query.chatroomID) {
                            room.visit = unixTime();
                        }
                    });

                    if (firstUnreadListMsg !== undefined) {
                        firstUnreadListMsg.janusMsg.config.isUnread = true;
                        setTimeout(() => {
                            scrollPageTo(firstUnreadListMsg.janusMsg.config.id);
                        }, 500);
                    }

                    // 計算左側聊天室最後一筆訊息
                    const lastChatMessage = this.messageList
                        .filter((item) => !item.janusMsg.config.recallStatus)
                        .map((item) => {
                            return {
                                janusMsg: {
                                    ...item.janusMsg,
                                    chatroomID: chatRoomID,
                                },
                            };
                        });
                    resetSetItem(
                        `${chatRoomID}-lastChatMessage`,
                        JSON.stringify(lastChatMessage.slice(-10))
                    );
                    // 判斷已讀狀態
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
                    //判斷如果是往上滑load歷史資料 聊天室不置底
                    if (loadingData !== true) {
                        const chatStore = useChatStore();
                        const { scrollToBottom } = chatStore;
                        nextTick(() => {
                            scrollToBottom();
                            // console.log("撈歷史訊息 置底!!!");
                            setTimeout(() => {
                                const chatroomToBottom =
                                    document.querySelector(".dialog-box:last-child");
                                chatroomToBottom.scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                });
                                // console.log("chatroomToBottom", chatroomToBottom);
                            }, 100);
                        });
                    }
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },

        //取得一般聊天室左側列表
        async getChatroomlistApi(eventID, getFrom?, chatroomID?) {
            const chatRecordStore = useChatRecordStore();
            const { recordMessages } = storeToRefs(chatRecordStore);
            const getToken = localStorage.getItem("access_token");
            await axios
                .get(`${config.serverUrl}/v1/chatroomlist/${eventID}`, {
                    headers: {
                        Authorization: `Bearer ${getToken}`,
                    },
                })
                .then((res: any) => {
                    console.log("一般聊天室列表", res.data.chatroomList);
                    this.chatroomList = res.data.chatroomList
                        .sort((a, b) => {
                            return b.time - a.time;
                        })
                        .sort((a, b) => {
                            return b.pinTop - a.pinTop;
                        });
                    this.chatroomList.forEach((chatroom) => {
                        sessionStorage.setItem(`${chatroom.chatroomID}-lastChatMessage`, "[]");
                    });
                    recordMessages.value = this.chatroomList;
                    // console.log("聊天室列表", recordMessages.value);
                    const arr = res.data.chatroomList.filter((item) => item.chatroomID === getFrom);
                    // console.log("phopnecallperson Arr:", arr);
                    this.phoneCallName = arr[0]?.name;
                    this.phoneCallIcon = arr[0]?.icon;
                    this.phoneCallNumber = arr[0]?.mobile;
                    setTimeout(() => {
                        this.tagArea = document.querySelectorAll(".tagArea");
                    }, 1000);
                    this.chatroomListLoading = false;
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.chatroomListLoading = false;
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //取得活動資訊
        async getEventApi(eventID) {
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
                    // console.log("channel event err:", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    if (res.data.eventList.length === 0) {
                        this.eventList = [];
                    } else {
                        this.eventList = res.data.eventList;
                        this.labelChannelList = res.data.eventList;
                        this.eventList.sort((a, b) => b.preset - a.preset);
                    }
                    // console.log("eventList", this.eventList);
                })
                .catch((err: any) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
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
                    this.staffList = res.data.cslist;
                })
                .catch((err: any) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    if (err.response && err.response.data.msg === "沒有客服人員") {
                        this.staffList.events = [];
                        console.error("getCustomServiceStaffList err", err);
                    }

                    tokenExpireToLogin(err);
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
                    this.activetyCsList = res.data.cslist;
                    this.activetyCsList.forEach((cs) => {
                        if (this.channelEvent.owner === cs.accountID) {
                            cs.owner = true;
                        } else {
                            cs.owner = false;
                        }
                    });
                    this.activetyCsList.sort((a, b) => b.owner - a.owner);
                    console.log("活動客服人員 tag呈現", this.activetyCsList);
                    this.checkedCsList = Object.values(res.data.cslist).map(
                        (item) => (item as any).name
                    );
                    console.log("活動客服人員 checkbox 該勾選之人", this.checkedCsList);
                })
                .catch((err: any) => {
                    // console.log("cs err:", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    this.eventInfo = res.data.msg;
                    this.channelEvent = res.data.msg;
                    console.log("編輯頻道總資料", this.channelEvent);
                    this.getAccounts();
                    this.getActivetyCsList(eventID);
                })
                .catch((err: any) => {
                    // console.log("channel event err:", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        // 編輯活動
        async sendChannelEventInfo(route, data, router) {
            const getToken = localStorage.getItem("access_token");
            const bodyFormData = new FormData();
            bodyFormData.append("icon", data.icon);
            bodyFormData.append("callable", data.callable);
            bodyFormData.append("dialogue", data.dialogue);
            bodyFormData.append("name", data.name);
            bodyFormData.append("status", data.status);
            bodyFormData.append("homeurl", data.homeurl);
            bodyFormData.append("description", data.description);
            bodyFormData.append("cslist", data.cslist);
            bodyFormData.append("message", data.message);
            bodyFormData.append("preset", data.preset);
            this.isDisabled = true;
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatroom/${route.query.eventID}`,
                data: bodyFormData,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("channel edit res:", res.data);
                    this.isDisabled = false;
                    route.params.id
                        ? router.push(`/manage/${route.params.id}/activitySetting`)
                        : router.push(`/manage/activitySetting`);
                })
                .catch((err: any) => {
                    this.apiAlertMessage = "編輯頻道失敗,請稍後再試!!";
                    this.isDisabled = false;
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    this.pointStatus = 0;
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
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
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    if (err.response) {
                        // console.log("data", err.response.data);
                        // console.log("status", err.response.status);
                        // console.log("headers", err.response.headers);
                        if (err.response.data.msg === "沒有管理人員") {
                            this.adminList = [];
                        }
                    }
                    console.error("getAdminList err", err);

                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.log("events err:", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        //excel電話號碼驗證
        async excelVerification(file) {
            console.log("file:", file);
            //modal store
            const modelStore = useModelStore();
            const { uploadAnimationBoolean } = storeToRefs(modelStore);
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
                    setTimeout(() => {
                        uploadAnimationBoolean.value = false;
                    }, 1000);
                })
                .catch((err: any) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    if (err.response.status === 500) {
                        this.apiAlertMessage = "檔案異常，請重新上傳!!";
                    }
                    if (err.response.status === 404) {
                        this.apiAlertMessage = `${err.response.data.msg}，請重新上傳!!`;
                    }
                    if (err.response) {
                        console.log("excel err:", err.response);
                    }
                    uploadAnimationBoolean.value = false;
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        //收回訊息api
        async recallAPI(msg, params, chatroomID) {
            console.log("msg:", msg);
            // api store
            const chatStore = useChatStore();
            const { textPlugin, adminParticipantsWithOutMe } = storeToRefs(chatStore);
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
                    recallMsgObj["recall"] = "recall";
                    const message: any = {
                        textroom: "message",
                        transaction: randomString(12),
                        room: Number(params),
                        // tos: [全部在線客服1,全部在線客服2],
                        tos: [chatroomID, ...adminParticipantsWithOutMe.value],
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
                })
                .catch((err: any) => {
                    // console.error(err.response);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        //查詢簡訊api
        async inquireShortMessage(type, date, mobile, status, page) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("type", type);
            fd.append("start", date[0]);
            fd.append("end", date[1]);
            fd.append("mobile", mobile ? mobile : "");
            fd.append("status", status ? status[0] : -1);
            fd.append("page", page);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/msgs`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("inquireShortMessage", res);
                    this.tableInformation = "empty";
                    type === "0"
                        ? (this.inquireSMSShortMessageList = res.data.list.Data || [])
                        : (this.inquireMMSShortMessageList = res.data.list.Data || []);
                    type === "0"
                        ? console.log("SMS簡訊查詢 res ", this.inquireSMSShortMessageList)
                        : console.log("MMS簡訊查詢 res", this.inquireMMSShortMessageList);
                    //column 顯示一般或詳細資訊
                    if (mobile !== null || status !== null) {
                        this.tableInformation = "detail";
                        this.pageCount = res.data.list.count;
                    } else {
                        this.tableInformation = "normal";
                    }
                    this.timeInterval[0] = res.data.start;
                    this.timeInterval[1] = res.data.end;
                    setTimeout(() => {
                        this.inquireLoading = false;
                    }, 300);
                })
                .catch((err: any) => {
                    // console.error(err.response);
                    setTimeout(() => {
                        this.inquireLoading = false;
                    }, 300);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
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
                    this.point += res.data.point;
                    // console.log("deleteReservationShortMsg res", res);
                    type === "0"
                        ? console.log(
                              "需處理的 SMSShortMessageList!!!",
                              this.inquireSMSShortMessageList
                          )
                        : console.log(
                              "需處理的 MMSShortMessageList!!!",
                              this.inquireMMSShortMessageList
                          );

                    if (type === "0") {
                        this.inquireSMSShortMessageList.forEach((item) => {
                            if (data.bid === item.bid) {
                                item.statusCount.forEach((self, index, arr) => {
                                    {
                                        [arr[2], arr[3]] = [arr[3], arr[2]];
                                    }
                                });
                                item.data.forEach((self) => {
                                    if (self.status === 2) {
                                        self.status = 3;
                                    }
                                });
                            }
                        });
                    } else {
                        this.inquireMMSShortMessageList.forEach((item) => {
                            if (data.bid === item.bid) {
                                item.statusCount.forEach((self, index, arr) => {
                                    {
                                        [arr[2], arr[3]] = [arr[3], arr[2]];
                                    }
                                });
                                item.data.forEach((self) => {
                                    if (self.status === 2) {
                                        self.status = 3;
                                    }
                                });
                            }
                        });
                    }

                    this.apiAlertMessage = "取消成功";
                })
                .catch((err: any) => {
                    // console.error(err.response);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );

                    this.apiAlertMessage = "取消失敗!!";
                    tokenExpireToLogin(err);
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
                    this.accounts = res.data.accounts;
                    console.log("取得所有子帳號清單 accounts", this.accounts);
                })
                .catch((err: any) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    if (err.response && err.response.data.msg === "沒有管理人員") {
                        this.accounts = [];
                    }
                    console.error("getAccounts err", err.response);
                    tokenExpireToLogin(err);
                });
        },
        //新增自動回覆訊息api
        async autoReplyMsgAPI(data) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("eventID", data.eventID);
            fd.append("subject", data.subject);
            fd.append("status", data.status);
            fd.append("startDate", data.startDate);
            fd.append("endDate", data.endDate);
            fd.append("startTime", data.startTime);
            fd.append("endTime", data.endTime);
            fd.append("weekday", data.weekday);
            fd.append("keyword", JSON.stringify(data.keyWord));
            fd.append("msg", JSON.stringify(data.msg));
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/chatbots`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("autoReplyMsgAPI res", res);
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    // console.log("autoReplyMsgAPI err", err);
                });
        },
        //自動回覆訊息一覽表
        async autoReplyMsgList(eventID) {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/chatbots/${eventID}/0`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("autoReplyMsgList res", res.data);
                    this.autoReplyList = res.data.chatbotrule;
                    this.route.params.id
                        ? this.router.push(
                              `/manage/${this.route.params.id}/activitySetting/autoReplyList?eventID=${eventID}`
                          )
                        : this.router.push(
                              `/manage/activitySetting/autoReplyList?eventID=${eventID}`
                          );
                })
                .catch((err: any) => {
                    // console.error(err);
                    // console.log("autoReplyMsgList err", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    this.autoReplyList = [];
                    this.route.params.id
                        ? this.router.push(
                              `/manage/${this.route.params.id}/activitySetting/autoReplyList?eventID=${eventID}`
                          )
                        : this.router.push(
                              `/manage/activitySetting/autoReplyList?eventID=${eventID}`
                          );
                });
        },
        //查詢單一自動回覆訊息
        async inquireAutoReplyMsg(eventID, autoID) {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/chatbots/${eventID}/${autoID}`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("inquireAutoReplyMsg res", res.data);
                    this.autoReplyList = res.data.chatbotrule;
                    if (this.route.params.id) {
                        this.router.push(
                            `/manage/${this.route.params.id}/activitySetting/EditAutoReply?eventID=${eventID}&autoID=${autoID}`
                        );
                    } else {
                        this.router.push(
                            `/manage/activitySetting/EditAutoReply?eventID=${eventID}&autoID=${autoID}`
                        );
                    }
                })
                .catch((err: any) => {
                    // console.error(err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    // console.log("inquireAutoReplyMsg err", err);
                });
        },
        // 修改自動回覆訊息
        async editAutoReplyMsg(data) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("eventID", data.eventID);
            fd.append("subject", data.subject || "");
            fd.append("status", data.status);
            fd.append("startDate", data.startDate);
            fd.append("endDate", data.endDate);
            fd.append("startTime", data.startTime);
            fd.append("endTime", data.endTime);
            fd.append("weekday", data.weekday);
            fd.append("keyword", data.keyWord);
            fd.append("msg", JSON.stringify(data.msg));
            fd.append("autoID", data.autoID);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/chatbots`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("editAutoReplyMsg res", res);
                })
                .catch((err: any) => {
                    // console.error(err);
                    // console.log("editAutoReplyMsg err", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //刪除自動回覆訊息
        async deleteAutoReplyMsgAPI(autoID) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("autoID", autoID);
            await axios({
                method: "delete",
                url: `${config.serverUrl}/v1/chatbots`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("deleteAutoReplyMsgAPI res", res);
                })
                .catch((err: any) => {
                    // console.error(err);
                    // console.log("deleteAutoReplyMsgAPI err", err);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //後台 log 日誌輸出
        async logDiary(diaryLog, userName) {
            const fd = new FormData();
            fd.append("errorcode", diaryLog);
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "post",
                data: fd,
                url: `${config.serverUrl}/v1/getbugout/${userName}`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    // console.log("logDiary res", res);
                })
                .catch((err) => {
                    // console.log("logDiary err", err);
                });
        },
        //關閉新手導引
        async closeGuide(guide) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("guide", guide === true ? "1" : "0");
            await axios({
                method: "patch",
                data: fd,
                url: `${config.serverUrl}/v1/account`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("closeGuide res", res);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //獲取驗證碼
        async getCaptcha() {
            await axios({
                method: "get",
                url: `${config.serverUrl}/getcaptcha`,
            })
                .then((res) => {
                    console.log("getCaptcha res", res);
                    this.isVarificationCodeExpire = false;
                    this.imgCode = res.data.data_base;
                    this.imgId = res.data.data_code;
                    setTimeout(() => {
                        this.isVarificationCodeExpire = true;
                    }, 600000);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //提交驗證碼
        //一般檔案下載
        async download(file) {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/file/${file.janusMsg.format.Fileid}`,
                headers: { Authorization: `Bearer ${getToken}` },
                responseType: "blob",
            })
                .then((res) => {
                    console.log("normalDownload res", res);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", file.janusMsg.format.ShowName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        // 通訊錄 excel 上傳
        async excelUpload(file) {
            console.log("file:", file);
            //modal store
            const modelStore = useModelStore();
            const { uploadAnimationBoolean } = storeToRefs(modelStore);
            const getToken = localStorage.getItem("access_token");
            const fileType = file.type;
            const fileName = file.name;
            const fd = new FormData();
            fd.append("file", new File([file], fileName, { type: fileType }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/contact/upload`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("excel res", res);
                    this.uploadRef = res.data;
                    this.invalidList = res.data.invalid;
                    setTimeout(() => {
                        uploadAnimationBoolean.value = false;
                    }, 1000);
                })
                .catch((err: any) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    if (err.response.status === 500) {
                        this.apiAlertMessage = "檔案異常，請重新上傳!!";
                    }
                    if (err.response.status === 404) {
                        this.apiAlertMessage = `${err.response.data.msg}，請重新上傳!!`;
                    }
                    if (err.response) {
                        console.log("excel err:", err.response);
                    }
                    uploadAnimationBoolean.value = false;
                    tokenExpireToLogin(err);
                });
        },
        // excel 匯出
        async excelDownload(postObject) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("type", postObject.type);
            fd.append("start", postObject.start);
            fd.append("end", postObject.end);
            fd.append("format", postObject.format);
            fd.append("batchId", postObject.bid);
            fd.append("mobile", postObject.mobile);
            fd.append("status", postObject.status);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/export`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
                responseType: "blob",
            })
                .then((res) => {
                    console.log("excelDownload res", res);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${dayjs().valueOf()}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //查詢頁面 查看訊息內容
        async viewContent(chatroomID) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("chatroomID", chatroomID);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/chats`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    this.chatContent = res.data.messageList.reverse();
                    this.chatContent.forEach((item, index, arr) => {
                        item.change = false;
                        if (index >= 1) {
                            if (
                                item.sender === 0 &&
                                arr[index - 1].sender === 0 &&
                                item.config.userName !== arr[index - 1].config.userName
                            ) {
                                item.change = !arr[index - 1].change;
                            } else if (
                                item.sender === 0 &&
                                arr[index - 1].sender === 0 &&
                                item.config.userName == arr[index - 1].config.userName
                            ) {
                                item.change = arr[index - 1].change;
                            }
                        }
                    });
                    // console.log("訊息陣列", this.chatContent);
                })
                .catch((err) => {
                    this.chatContent = [];
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //個人資料取得
        async profileGetData(accountID) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("accountID", accountID);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/contactuser`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    // console.log("profileGetData res", res.data.contact);
                    this.profile = res.data.contact;
                    this.profileAvatarStatus = 0;
                    if (this.profile.icon !== "") {
                        this.profileAvatarStatus = 2;
                    }
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //通訊錄列表取得
        async addressBookGetData() {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/contact`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("addressBookGetData res", res.data.contact);
                    this.addressBookList = res.data.contact;
                    this.addressBookList = this.addressBookList.map((item) => {
                        return {
                            ...item,
                            isEdit: false,
                        };
                    });
                    setTimeout(() => {
                        this.addressBookLoading = false;
                    }, 300);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    setTimeout(() => {
                        this.addressBookLoading = false;
                    }, 300);
                });
        },
        //修改 通訊錄列表
        async modifyAddressBookData(modifyData) {
            const getToken = localStorage.getItem("access_token");
            const data = JSON.stringify({
                accountID: modifyData.accountID,
                account: modifyData.account,
                name: modifyData.name,
                mobile: modifyData.mobile,
                email: modifyData.email,
                departmentID: modifyData.departmentID,
                role: modifyData.role,
                telephone: modifyData.telephone,
                ext: modifyData.ext,
            });
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/contact`,
                data,
                headers: {
                    Authorization: `Bearer ${getToken}`,
                    "content-type": "application/json",
                },
            })
                .then((res) => {
                    console.log("modifyAddressBookData res", res.data.contact);
                    this.addressBookList = res.data.contact;
                    this.addressBookList = this.addressBookList.map((item) => {
                        return {
                            ...item,
                            isEdit: false,
                        };
                    });
                    setTimeout(() => {
                        this.addressBookLoading = false;
                    }, 300);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    setTimeout(() => {
                        this.addressBookLoading = false;
                    }, 300);
                });
        },
        //通訊錄下載
        async downloadAddressBookData() {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/contact/download`,
                headers: { Authorization: `Bearer ${getToken}` },
                responseType: "blob",
            })
                .then((res) => {
                    console.log("downloadAddressBookData res", res.data.contact);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${dayjs().valueOf()}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //創建群組
        async addGroup(data) {
            const chatStore = useChatStore();
            const { textPlugin } = storeToRefs(chatStore);
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("name", data.name);
            fd.append("icon", data.icon);
            fd.append("internelMember", data.internelMember);
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/grouproom`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("addGroup res", res);
                    this.eventID = res.data.eventID;
                    //創建聊天室
                    const msg = {
                        request: "create",
                        room: this.eventID,
                        permanent: true,
                    };
                    textPlugin.value.send({ message: msg });
                    this.getGroupRoomList(this.eventID);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //編輯群組
        async editGroup(data) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("name", data.name);
            fd.append("icon", data.icon);
            fd.append("internelMember", data.internelMember);
            fd.append("eventID", data.eventID);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/grouproom`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("editGroup res", res);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //取群聊聊天列表
        // async getGroupRoomList(eventID = "") {
        //     const getToken = localStorage.getItem("access_token");
        //     const groupChatRecordStore = useGroupChatRecordStore();
        //     const { groupChatRecordMessages } = storeToRefs(groupChatRecordStore);
        //     await axios({
        //         method: "get",
        //         url: `${config.serverUrl}/v1/grouproomlist`,
        //         headers: { Authorization: `Bearer ${getToken}` },
        //     })
        //         .then((res) => {
        //             // console.log("getGroupRoomList res", res);
        //             groupChatRecordMessages.value =
        //                 res.data.eventList !== null ? res.data.eventList : [];
        //             groupChatRecordMessages.value.forEach((chatroom) => {
        //                 sessionStorage.setItem(`${chatroom.eventID}-lastChatMessage`, "[]");
        //             });

        //             if (eventID !== "") {
        //                 this.router.push(`/groupChat/chat?eventID=${eventID}`);
        //             }
        //             this.chatroomListLoading = false;
        //         })
        //         .catch((err) => {
        //             this.bugout.error(`error-log${this.userName}`, err.response.status);
        //             this.bugout.error(`error-log${this.userName}`, err.response.data);
        //             this.bugout.error(
        //                 `error-log${this.userName}`,
        //                 err.response.request.responseURL
        //             );
        //         });
        // },
        //取標籤列表
        async getTagList() {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/grouproom/externel/members/tag`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    // console.log("getTagList res", res);
                    this.tagList = res.data.data;
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //取群聊歷史訊息
        async getGroupChatHistoryApi(eventID, loadingData = false) {
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            this.msgStart = this.isInput ? 0 : this.msgStart;
            fd.append("eventID", eventID);
            fd.append("start", this.msgStart);
            fd.append("size", "30");
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/historygroup`,
                headers: { Authorization: `Bearer ${getToken}` },
                data: fd,
            })
                .then((res) => {
                    console.log("群聊聊天室 歷史訊息", res.data);
                    this.totalCount = res.data.totalCount;
                    this.groupChatMessageList = this.isInput
                        ? !res.data.messageList
                            ? []
                            : [...res.data.messageList]
                        : this.groupChatMessageList.concat(
                              !res.data.messageList ? [] : [...res.data.messageList]
                          );
                    //訊息排序去重
                    this.groupChatMessageList = this.groupChatMessageList.reduce((unique, o) => {
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
                            return a.janusMsg.time - b.janusMsg.time;
                        });
                        return unique;
                    }, []);
                    // 判斷電話型式 即刪除userName
                    this.groupChatMessageList.forEach((msg) => {
                        if (msg.janusMsg.sender == 1 && msg.janusMsg.format.phoneType == 1) {
                            msg.janusMsg.format.phoneType = 4;
                        }
                        if (msg.janusMsg.sender === 1 && msg.janusMsg.msgType === 9) {
                            delete msg.janusMsg.config.userName;
                        }
                    });
                    // //增加聊天室內未讀訊息判斷
                    // const currentRoom = this.chatroomList.filter(
                    //     (room) => room.chatroomID === this.route.query.chatroomID
                    // );

                    // const firstUnreadListMsg = this.groupChatMessageList.find(
                    //     (msg) =>
                    //         msg.janusMsg.time > currentRoom[0]?.visit &&
                    //         msg.janusMsg.sender === 1 &&
                    //         msg.janusMsg.config.recallStatus === false
                    // );

                    // this.chatroomList.forEach((room) => {
                    //     if (room.chatroomID === this.route.query.chatroomID) {
                    //         room.visit = unixTime();
                    //     }
                    // });

                    // if (firstUnreadListMsg !== undefined) {
                    //     firstUnreadListMsg.janusMsg.config.isUnread = true;
                    //     setTimeout(() => {
                    //         scrollPageTo(firstUnreadListMsg.janusMsg.config.id);
                    //     }, 500);
                    // }

                    // 計算左側聊天室最後一筆訊息
                    const lastChatMessage = this.groupChatMessageList
                        .filter((item) => !item.janusMsg.config.recallStatus)
                        .map((item) => {
                            return {
                                janusMsg: {
                                    ...item.janusMsg,
                                    eventID: eventID,
                                },
                            };
                        });
                    resetSetItem(
                        `${eventID}-lastChatMessage`,
                        JSON.stringify(lastChatMessage.slice(-10))
                    );
                    // 判斷已讀狀態
                    if (
                        this.groupChatMessageList.length > 0 &&
                        this.userInfo.lastVisit >
                            this.groupChatMessageList[this.groupChatMessageList.length - 1].janusMsg
                                .time
                    ) {
                        this.groupChatMessageList = this.groupChatMessageList.map((item) => {
                            item.janusMsg.config.isRead = true;
                            return item;
                        });
                    }

                    this.isInput = false;
                    this.isUserMsg = false;
                    //判斷如果是往上滑load歷史資料 聊天室不置底
                    if (loadingData !== true) {
                        const chatStore = useChatStore();
                        const { groupChatScrollToBottom } = chatStore;
                        nextTick(() => {
                            groupChatScrollToBottom();
                            // console.log("撈歷史訊息 置底!!!");
                            setTimeout(() => {
                                const chatroomToBottom =
                                    document.querySelector(".dialog-box:last-child");
                                chatroomToBottom.scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                });
                                // console.log("chatroomToBottom", chatroomToBottom);
                            }, 100);
                        });
                    }
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //取得個別聊天室資訊
        async getGroupChatRoomInfo(eventID) {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/grouproom/${eventID}`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("取得聊天室人員訊息 res", res.data);
                    this.chatRoomInnerPeopleInfo = res.data.inter;
                    this.chatRoomOutterPeopleInfo = res.data.exter === null ? [] : res.data.exter;
                    this.groupChatEvent = res.data.event;
                    console.log("groupChatEvent", this.groupChatEvent);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //取得群組聊天室人員上線時間/群聊已讀前置api
        async getGroupChatMemberVisitTimeApi(eventID) {
            this.groupMemberVisitTimeInfoList.length = 0;
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/grouproom/${eventID}/visitime`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("Jonas Cooper取得群聊成員的上線時間", res.data);
                    for (const key in res.data.data) {
                        const groupChatReadItem = {};
                        groupChatReadItem["id"] = key;
                        (groupChatReadItem["onlineTime"] = res.data.data[key]),
                            (groupChatReadItem["isOnline"] = false),
                            this.groupMemberVisitTimeInfoList.push(groupChatReadItem);
                    }
                    console.log("Jonas取得群聊info: ", this.groupMemberVisitTimeInfoList);
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //群聊收回訊息
        async groupChatRecallAPI(msg, eventID) {
            // console.log("msg:", msg);
            // api store
            const chatStore = useChatStore();
            const { textPlugin, adminParticipantsWithOutMe } = storeToRefs(chatStore);
            const getToken = localStorage.getItem("access_token");
            const fd = new FormData();
            fd.append("eventID", eventID);
            fd.append("msgType", msg.janusMsg.msgType);
            fd.append("id", msg.janusMsg.config.id);
            fd.append("config", JSON.stringify(msg.janusMsg.config));
            console.log("群聊收回訊息config", msg.janusMsg.config);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/grouproom/message`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res: any) => {
                    console.log("groupChatRecallAPI API res", res);
                    const recallMsgObj = {
                        janusMsg: {
                            ...msg.janusMsg,
                            msgType: 10,
                        },
                    };
                    recallMsgObj["recall"] = "recall";
                    const message: any = {
                        textroom: "message",
                        transaction: randomString(12),
                        room: Number(eventID),
                        // tos: [全部在線客服1,全部在線客服2],
                        to: "all",
                        text: JSON.stringify(recallMsgObj),
                    };
                    textPlugin.value.data({
                        text: JSON.stringify(message),
                        error: function (reason: any) {
                            console.log("error:", reason);
                        },
                        success: function (res) {
                            console.log("recall pin", res);
                        },
                    });
                })
                .catch((err: any) => {
                    // console.error(err.response);
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                    tokenExpireToLogin(err);
                });
        },
        //查詢部門
        async getDepartment() {
            const getToken = localStorage.getItem("access_token");
            await axios({
                method: "get",
                url: `${config.serverUrl}/v1/contact/department`,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    console.log("getDepartment res", res.data);
                    this.addressBookDepartment = res.data.data !== null ? res.data.data : [];
                    this.addressBookDepartment = this.addressBookDepartment.map((item) => {
                        return {
                            ...item,
                            isRepeat: false,
                        };
                    });
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        //修改部門
        async editDepartment(arr) {
            const getToken = localStorage.getItem("access_token");
            console.log("patch 部門帶的arr", arr);
            const data = JSON.stringify(arr);
            await axios({
                method: "patch",
                url: `${config.serverUrl}/v1/contact/department`,
                headers: {
                    Authorization: `Bearer ${getToken}`,
                    "content-type": "application/json",
                },
                data,
            })
                .then((res) => {
                    console.log("editDepartment res", res);
                    this.getDepartment();
                })
                .catch((err) => {
                    this.bugout.error(`error-log${this.userName}`, err.response.status);
                    this.bugout.error(`error-log${this.userName}`, err.response.data);
                    this.bugout.error(
                        `error-log${this.userName}`,
                        err.response.request.responseURL
                    );
                });
        },
        // // 內部邀請彈窗 選擇內部部門人員
        // async getInternalDepartmentPeople() {
        //     const getToken = localStorage.getItem("access_token");
        //     await axios({
        //         method: "get",
        //         url: `${config.serverUrl}/v1/grouproom/department/members`,
        //         headers: { Authorization: `Bearer ${getToken}` },
        //     })
        //         .then((res) => {
        //             console.log("getInternalDepartmentPeople res", res.data.data);
        //             this.internalDepartmentPeople = res.data.data
        //         })
        //         .catch((err) => {
        //             this.bugout.error(`error-log${this.userName}`, err.response.status);
        //             this.bugout.error(`error-log${this.userName}`, err.response.data);
        //             this.bugout.error(
        //                 `error-log${this.userName}`,
        //                 err.response.request.responseURL
        //             );
        //         });
        // },
    },
});

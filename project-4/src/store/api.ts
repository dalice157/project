import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import { Debugout } from "debugout.js";
import dayjs from "dayjs";
import Janus from "@/assets/js/janus";
import adapter from "webrtc-adapter";
import { useRoute } from "vue-router";
import { nextTick } from "vue";

import config from "@/config/config";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { localStorageMsg, eventID, scrollPageTo, isMobile } from "@/util/commonUtil";
import { randomString } from "@/util/chatUtil";
import { signature } from "@/util/deviceUtil";

export const useApiStore = defineStore({
    id: "api",
    state: () => ({
        route: <any>useRoute(),
        //頻道資訊
        eventInfo: <any>null,
        eventList: <any>[],
        // 貼圖相關
        stickerList: <any>[],
        stickerUrl: <string>"",
        //是否為合法裝置
        isIllegalDevice: <number>-1,
        // 換機需要參數
        vOldCode: <any>null,
        vCode: <any>null,
        mCode: <any>null,
        mMobile: <any>null,
        // 歷史訊息
        historyMessageListFirst: <any>[],
        historyMessageList: <any>[],
        //群聊歷史訊息
        groupChatHistoryMessageListFirst: <any>[],
        groupChatHistoryMessageList: <any>[],
        // 錯誤log回報
        bugout: <any>new Debugout(),
        diaryLog: <any>"",
        // 檔案預覽txt
        preViewText: <any>"",
        // 群聊已讀結構
        groupMemberVisitTimeInfoList: <any>[],
        // 群聊已讀數
        groupChatReadNum: <any>0,
        // 後台人員資訊(主要拿icon)
        internalPeopleList: <any>[],
        // 其他usesr資訊(主要拿icon)
        externalPeopleList: <any>[],
        //群聊event
        groupChatEvent: <any>null,
        //聊天室類別 0:一般聊天室,1:群聊聊天室
        chatroomType: 0,
    }),
    getters: {},
    actions: {
        //登入
        // async logIn(chatToken) {
        //     await axios({
        //         method: "get",
        //         url: `${config.serverUrl}/login/${chatToken}`,
        //         headers: { Authorization: `Bearer ${signature}` },
        //     })
        //         .then((res: any) => {
        //             this.isIllegalDevice = false;
        //             this.getBackendApi(chatToken);
        //         })
        //         .catch((err: any) => {
        //             console.error("login err", err.response);
        //             if (err.response.status === 401) {
        //                 this.isIllegalDevice = true;
        //                 return;
        //             }
        //         });
        // },
        //發api拿取聊天資料 手機切頁回來拿未讀訊息
        async getBackendApi2(chatToken: any) {
            const chatStore = useChatStore();
            const { textPlugin } = storeToRefs(chatStore);
            const modelStore = useModelStore();
            const { isLoading } = storeToRefs(modelStore);
            await axios({
                method: "get",
                url: `${config.serverUrl}/Event/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    console.log("使用者資料", res.data.eventInfo);
                    this.eventInfo = res.data.eventInfo;
                    // 手機換頁回來後call join
                    const transaction = randomString(12);
                    const join = {
                        textroom: "join",
                        transaction: transaction,
                        room: Number(eventID(chatToken)),
                        username: chatToken.slice(-7),
                        display: "user",
                    };
                    if (
                        (this.chatroomType === 0 && this.eventInfo.dialogue === 0) ||
                        this.chatroomType === 1
                    ) {
                        textPlugin.value.data({
                            text: JSON.stringify(join),
                            error: function (reason: any) {
                                console.log("error join:", reason);
                            },
                            success: function () {
                                const participants = {
                                    request: "listparticipants",
                                    room: Number(eventID(chatToken)),
                                };
                                textPlugin.value.send({ message: participants });
                                isLoading.value = false;
                            },
                        });
                    } else {
                        isLoading.value = false;
                    }

                    localStorage.setItem(`${chatToken}-icon`, this.eventInfo.icon);
                    localStorage.setItem(`${chatToken}-description`, this.eventInfo.description);
                    localStorage.setItem(`${chatToken}-name`, this.eventInfo.name);
                    this.getEventListApi(chatToken);
                    this.getSticker(chatToken);
                    const chatStore = useChatStore();
                    const { messages, pictures } = storeToRefs(chatStore);
                    const { scrollToBottom } = chatStore;
                    //local 拿圖片訊息
                    pictures.value = JSON.parse(
                        localStorage.getItem(`${chatToken}-pictures`) || "[]"
                    );
                    //local 拿所有訊息
                    messages.value = JSON.parse(localStorage.getItem(`${chatToken}`) || "[]");
                    if (this.eventInfo.unreadList !== null) {
                        this.eventInfo.unreadList.forEach((unReadMsg, _, arr) => {
                            // 收回訊息
                            if (unReadMsg.janusMsg.msgType === 10) {
                                messages.value.forEach((msg) => {
                                    if (msg.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                        msg.janusMsg.config.recallStatus = true;
                                    }
                                });
                                localStorageMsg(messages.value, chatToken);
                                //圖庫訊息收回
                                pictures.value.forEach((pic) => {
                                    if (pic.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                        pic.janusMsg.config.recallStatus = true;
                                    }
                                });
                                localStorage.setItem(
                                    `${chatToken}-pictures`,
                                    JSON.stringify(pictures.value)
                                );
                                return;
                            }
                            // 推未讀訊息
                            if (
                                !messages.value.some((msg) => {
                                    return msg.janusMsg.config.id === unReadMsg.janusMsg.config.id;
                                }) &&
                                !unReadMsg.janusMsg.config.isWelcomeMsg
                            ) {
                                arr[0].janusMsg.config.isUnread = true;
                                messages.value.push(unReadMsg);
                                messages.value.sort((a, b) => a.janusMsg.time - b.janusMsg.time);
                                localStorageMsg(messages.value, chatToken);
                                //更新最後一筆訊息
                                localStorage.setItem(
                                    `${chatToken}-lastMessage`,
                                    JSON.stringify(unReadMsg)
                                );
                            }
                            //將圖片及檔案推入圖庫
                            if (
                                unReadMsg.janusMsg.msgType === 6 ||
                                unReadMsg.janusMsg.msgType === 7 ||
                                unReadMsg.janusMsg.msgType === 11
                            ) {
                                pictures.value.push(unReadMsg);
                            }
                        });
                        localStorage.setItem(
                            `${chatToken}-pictures`,
                            JSON.stringify(pictures.value)
                        );
                        setTimeout(() => {
                            scrollPageTo(this.eventInfo.unreadList[0].janusMsg.config.id);
                        }, 500);
                    } else {
                        nextTick(() => {
                            scrollToBottom();
                            // setTimeout(() => {
                            //     const chatroomToBottom =
                            //         document.querySelector(".dialog-box:last-child");
                            //     chatroomToBottom.scrollIntoView({
                            //         behavior: "smooth",
                            //         block: "end",
                            //     });
                            // }, 100);
                        });
                    }
                    messages.value.forEach((msg) => {
                        if (msg.janusMsg.sender == 0 && msg.janusMsg.format.phoneType == 1) {
                            msg.janusMsg.format.phoneType = 4;
                        }
                    });
                })
                .catch((err: any) => {
                    console.error("Event err:", err);
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    if (err.response.status === 404) {
                        alert("活動不存在!!");
                        if (isMobile) {
                            this.router.push(`/chatRecord/${this.route.params.eventKey}`);
                        }
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
                })
                .catch((err: any) => {
                    console.error("err", err);
                    this.bugout.error(`error-log${token}`, err.response.status);
                    this.bugout.error(`error-log${token}`, err.response.data);
                    this.bugout.error(`error-log${token}`, err.response.request.responseURL);
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
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
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
            msgs.janusMsg.msgType = 10;
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
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    console.error(err);
                });
        },
        //取得交談紀錄聊天歷史訊息
        async getHistoryMessage(chatToken, repeat) {
            const modelStore = useModelStore();
            const { isLoading } = storeToRefs(modelStore);
            await axios({
                method: "get",
                url: `${config.serverUrl}/unreads/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    console.log("getHistoryMessage res ", res);
                    // 初次
                    if (repeat === false) {
                        this.historyMessageListFirst =
                            res.data.eventListChatLog !== null ? res.data.eventListChatLog : [];
                        this.historyMessageListFirst = this.historyMessageListFirst.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    janusMsg: item.message.janusMsg,
                                    // key: index,
                                };
                            }
                        );
                        this.historyMessageListFirst.forEach((item) => {
                            delete item.message;
                        });
                        isLoading.value = false;
                    } else {
                        // 每五秒
                        this.historyMessageList = res.data.eventListChatLog;
                        this.historyMessageList = this.historyMessageList.map((item, index) => {
                            return {
                                ...item,
                                janusMsg: item.message.janusMsg,
                                // key: index,
                            };
                        });
                        this.historyMessageList.forEach((item) => {
                            delete item.message;
                        });
                    }
                })
                .catch((err) => {
                    console.log("getHistoryMessage err", err);
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    isLoading.value = false;
                    this.historyMessageListFirst = [];
                });
        },

        //前台 log 日誌輸出
        async logDiary(diaryLog, chatToken) {
            const fd = new FormData();
            fd.append("errorcode", diaryLog);
            await axios({
                method: "post",
                data: fd,
                url: `${config.serverUrl}/getbugout/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    // console.log("logDiary res", res);
                    // this.bugout.clear();
                })
                .catch((err) => {
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    // console.log("logDiary err", err);
                });
        },
        //檔案預覽API
        async preViewTxtAPI(chatToken, fileid) {
            await axios({
                method: "get",
                url: `${config.serverUrl}/file/${chatToken}/${fileid}`,
            })
                .then((res) => {
                    // console.log("預覽 txt res", res.data);
                    this.preViewText = res.data;
                })
                .catch((err) => {
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
           
                });
        },
        //取得群組聊天室人員上線時間/群聊已讀前置api
        async getGroupChatMemberVisitTimeApi(chatToken) {
            this.groupMemberVisitTimeInfoList.length = 0;
            await axios({
                method: "get",
                url: `${config.serverUrl}/grouproom/visitime/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    console.log("Jonas取得c端群聊人員的上線時間", res.data.data);
                    for (const key in res.data.data) {
                        const groupChatMemberItem = {};
                        groupChatMemberItem["id"] = key;
                        (groupChatMemberItem["onlineTime"] = res.data.data[key]),
                            this.groupMemberVisitTimeInfoList.push(groupChatMemberItem);
                    }
                    console.log("Jonas取得群聊info: ", this.groupMemberVisitTimeInfoList);

                    // this.preViewText = res.data;
                })
                .catch((err) => {
                    // console.log("預覽txt err", err);
                });
        },
        //取得群組內外部人員資訊  第二個參數判斷切頁回來時需要join janus
        async getGroupChatPeopleInfo(chatToken, firstLogin) {
            const chatStore = useChatStore();
            const { textPlugin } = storeToRefs(chatStore);
            const modelStore = useModelStore();
            const { isLoading } = storeToRefs(modelStore);
            await axios({
                method: "get",
                url: `${config.serverUrl}/grouproom/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    console.log("取得群組內外部人員資訊 res", res.data);
                    if (firstLogin === false) {
                        // 手機換頁回來後call join
                        const transaction = randomString(12);
                        const join = {
                            textroom: "join",
                            transaction: transaction,
                            room: Number(eventID(chatToken)),
                            username: chatToken.slice(-7),
                            display: "user",
                        };
                        if (
                            (this.chatroomType === 0 && this.eventInfo.dialogue === 0) ||
                            this.chatroomType === 1
                        ) {
                            textPlugin.value.data({
                                text: JSON.stringify(join),
                                error: function (reason: any) {
                                    console.log("error join:", reason);
                                },
                                success: function () {
                                    const participants = {
                                        request: "listparticipants",
                                        room: Number(eventID(chatToken)),
                                    };
                                    textPlugin.value.send({ message: participants });
                                },
                            });
                        } else {
                            isLoading.value = false;
                        }
                    }
                    this.internalPeopleList = res.data.inter;
                    this.externalPeopleList = res.data.exter;
                    this.groupChatEvent = res.data.event;
                    const chatStore = useChatStore();
                    const { messages, pictures } = storeToRefs(chatStore);
                    const { scrollToBottom } = chatStore;
                    //local 拿圖片訊息
                    pictures.value = JSON.parse(
                        localStorage.getItem(`${chatToken}-pictures`) || "[]"
                    );
                    //local 拿所有訊息
                    messages.value = JSON.parse(localStorage.getItem(`${chatToken}`) || "[]");
                    if (this.groupChatEvent.unreadList !== null) {
                        console.log("群聊推未讀訊息");
                        this.groupChatEvent.unreadList.forEach((unReadMsg, _, arr) => {
                            // 收回訊息
                            if (unReadMsg.janusMsg.msgType === 10) {
                                messages.value.forEach((msg) => {
                                    if (msg.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                        msg.janusMsg.config.recallStatus = true;
                                    }
                                });
                                localStorageMsg(messages.value, chatToken);
                                //圖庫訊息收回
                                pictures.value.forEach((pic) => {
                                    if (pic.janusMsg.config.id === unReadMsg.janusMsg.config.id) {
                                        pic.janusMsg.config.recallStatus = true;
                                    }
                                });
                                localStorage.setItem(
                                    `${chatToken}-pictures`,
                                    JSON.stringify(pictures.value)
                                );
                                return;
                            }
                            // 推未讀訊息
                            if (
                                !messages.value.some((msg) => {
                                    return msg.janusMsg.config.id === unReadMsg.janusMsg.config.id;
                                }) &&
                                !unReadMsg.janusMsg.config.isWelcomeMsg
                            ) {
                                arr[0].janusMsg.config.isUnread = true;
                                messages.value.push(unReadMsg);
                                messages.value.sort((a, b) => a.janusMsg.time - b.janusMsg.time);
                                localStorageMsg(messages.value, chatToken);
                                //更新最後一筆訊息
                                localStorage.setItem(
                                    `${chatToken}-lastMessage`,
                                    JSON.stringify(unReadMsg)
                                );
                            }
                            //將圖片及檔案推入圖庫
                            if (
                                unReadMsg.janusMsg.msgType === 6 ||
                                unReadMsg.janusMsg.msgType === 7 ||
                                unReadMsg.janusMsg.msgType === 11
                            ) {
                                pictures.value.push(unReadMsg);
                            }
                        });
                        localStorage.setItem(
                            `${chatToken}-pictures`,
                            JSON.stringify(pictures.value)
                        );
                        setTimeout(() => {
                            scrollPageTo(this.groupChatEvent.unreadList[0].janusMsg.config.id);
                        }, 500);
                    } else {
                        console.log("群聊無未讀訊息");
                        nextTick(() => {
                            scrollToBottom();
                            // setTimeout(() => {
                            //     const chatroomToBottom =
                            //         document.querySelector(".dialog-box:last-child");
                            //     chatroomToBottom.scrollIntoView({
                            //         behavior: "smooth",
                            //         block: "end",
                            //     });
                            // }, 100);
                        });
                    }
                    isLoading.value = false;
                })
                .catch((err) => {
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    isLoading.value = false;
                });
        },
        //取得群聊交談紀錄聊天歷史訊息
        async getGroupChatHistoryMessage(chatToken, repeat) {
            const modelStore = useModelStore();
            const { isLoading } = storeToRefs(modelStore);
            await axios({
                method: "get",
                url: `${config.serverUrl}/grouproomlist/${chatToken}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    console.log("getGroupChatHistoryMessage res", res);
                    // 初次
                    if (repeat === false) {
                        this.groupChatHistoryMessageListFirst =
                            res.data.msg !== null ? res.data.msg : [];
                        this.groupChatHistoryMessageListFirst =
                            this.groupChatHistoryMessageListFirst.map((item, index) => {
                                return {
                                    ...item,
                                    // janusMsg: item.msg.janusMsg,
                                };
                            });
                        this.groupChatHistoryMessageListFirst.forEach((item) => {
                            delete item.message;
                        });
                        isLoading.value = false;
                    } else {
                        // 每五秒刷新
                        this.groupChatHistoryMessageList =
                            res.data.msg !== null ? res.data.msg : [];
                        this.groupChatHistoryMessageList = this.groupChatHistoryMessageList.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    // janusMsg: item.msg.janusMsg,
                                };
                            }
                        );
                        this.historyMessageList.forEach((item) => {
                            delete item.message;
                        });
                    }
                })
                .catch((err) => {
                    console.log("getGroupChatHistoryMessage err", err);
                    this.bugout.error(`error-log${chatToken}`, err.response.status);
                    this.bugout.error(`error-log${chatToken}`, err.response.data);
                    this.bugout.error(`error-log${chatToken}`, err.response.request.responseURL);
                    isLoading.value = false;
                    this.groupChatHistoryMessageListFirst = [];
                });
        },

        // //預覽連結api
        // async previewLink(URL, chatToken) {
        //     const fd = new FormData();
        //     fd.append("url", URL);
        //     await axios({
        //         method: "post",
        //         url: `${config.serverUrl}/metadata/${chatToken}`,
        //         data: fd,
        //         headers: { Authorization: `Bearer ${signature}` },
        //     })
        //         .then((res) => {
        //             console.log("預覽 連結 res", res.data);
        //         })
        //         .catch((err) => {
        //             console.log("預覽 連結 err", err);
        //         });
        // },
    },
});

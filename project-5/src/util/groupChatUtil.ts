import Janus from "@/assets/js/janus";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { nanoid } from "nanoid";
import config from "@/config/config";

import logo from "@/assets/Images/talkOD-logo.svg";
import { useChatStore } from "@/store/chat";
import { useGroupChatStore } from "@/store/groupChat";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatRecordStore } from "@/store/chatRecord";
import { resetSetItem, isProduction, isStaging } from "@/util/commonUtil";

//發送群組訊息
export const sendGroupMsg = ({
    msg = <any>"",
    textPlugin = <any>"",
    chatRoomID = <any>"",
    eventID = <any>0,
}) => {
    //api store
    const apiStore = useApiStore();
    const { isInput, groupChatMessageList } = storeToRefs(apiStore);

    let filterDisplays: any = groupChatMessageList.value.filter((item, index) => {
        const keyName: any = Object.keys(groupChatMessageList.value[index])[0];
        return item[keyName] === "admin";
    });

    filterDisplays = filterDisplays.map((display) => {
        return Object.keys(display)[0];
    });

    const display = [...filterDisplays];
    console.log("發送私人訊息名單", display);

    if (!display) return;
    if (msg === "") {
        console.log("發送私訊 不得為空!!");
        return;
    }

    if (msg.janusMsg.sender === 1 && msg.janusMsg.msgType === 9) {
        delete msg.janusMsg.config.userName;
    }
    //textPlugin 發送訊息
    const message: any = {
        textroom: "message",
        transaction: randomString(12),
        room: Number(eventID),
        // tos: [全部在線客服1,全部在線客服2],
        to: "all",
        text: JSON.stringify(msg),
    };
    textPlugin.data({
        text: JSON.stringify(message),
        error: function (reason: any) {
            console.log(" textPlugin 發送私訊錯誤,原因為:", reason);
            isInput.value = false;
        },
        success: function () {
            console.log(" textPlugin 發送私訊成功!!");
            isInput.value = true;
        },
    });
};

/*textPlugin ondata 接收到的群組事件處理方法 */
export const groupChatProcessDataEvent = (data: any, eventID: any) => {
    //chat store
    const chatStore = useChatStore();
    const { groupChatScrollToBottom } = chatStore;
    const {
        isOnline,
        textPlugin,
        messageFrom,
        messageForm,
        findScrollHeight,
        groupChatFindScrollHeight,
        newMsgHint,
        pictures,
    } = storeToRefs(chatStore);

    // api store
    const apiStore = useApiStore();
    // const {} = apiStore;
    const { isInput, groupChatMessageList } = storeToRefs(apiStore);
    interface whatType {
        [key: string]: any;
    }
    const { what, whisper } = data;

    const getUserName = localStorage.getItem("userName");

    const whatStatus: whatType = {
        message: () => {
            console.log("群聊 message->", data);
            //解構 收到的私訊
            const parseMsg = JSON.parse(data.msg);
            const isRecall = Object.keys(parseMsg).includes("recall");

            //收到收回訊息的處理
            if (isRecall) {
                const getFrom = parseMsg.janusMsg.eventID;
                const msg = parseMsg;
                messageFrom.value = getFrom;
                delete msg.recall;
                // 收回聊天紀錄
                const lastChatMessageArr = JSON.parse(
                    sessionStorage.getItem(`${getFrom}-lastChatMessage`)
                );

                lastChatMessageArr.forEach((item, index) => {
                    if (item.janusMsg.config.id === msg.janusMsg.config.id) {
                        lastChatMessageArr.splice(index, 1);
                    }
                });
                resetSetItem(
                    `${getFrom}-lastChatMessage`,
                    JSON.stringify(lastChatMessageArr.slice(-10))
                );
            } else {
                //收到一般訊息的處理
                const msg = JSON.parse(data.msg);
                const getFrom = msg.janusMsg.eventID;
                messageFrom.value = getFrom;
                messageForm.value = msg;
                const lastChatMessageArr = JSON.parse(
                    sessionStorage.getItem(`${getFrom}-lastChatMessage`)
                );
                lastChatMessageArr.push(msg);
                resetSetItem(
                    `${getFrom}-lastChatMessage`,
                    JSON.stringify(lastChatMessageArr.slice(-10))
                );

                isInput.value = true;
                const userName = localStorage.getItem("userName");
                let scrollHeight = 0;
                let scrollTop = 0;
                let offsetHeight = 0;
                scrollHeight = groupChatFindScrollHeight.value?.scrollHeight;
                scrollTop = groupChatFindScrollHeight.value?.scrollTop;
                offsetHeight = groupChatFindScrollHeight.value?.offsetHeight;
                groupChatMessageList.value.push(msg);
                if (
                    msg.janusMsg.msgType === 6 ||
                    msg.janusMsg.msgType === 7 ||
                    msg.janusMsg.msgType === 11
                ) {
                    pictures.value.push(msg);
                }
                if (
                    scrollHeight - scrollTop < offsetHeight + 30 ||
                    msg.janusMsg.userName === userName
                ) {
                    setTimeout(() => {
                        groupChatScrollToBottom();
                    }, 100);
                } else {
                    newMsgHint.value = true;
                }
                // 訊息去重
                groupChatMessageList.value = groupChatMessageList.value.reduce((unique, o) => {
                    const hasRepeatId = unique.some((obj) => {
                        return obj.janusMsg.config.id === o.janusMsg.config.id;
                    });
                    if (!hasRepeatId) {
                        if (o.janusMsg.sender === 0 && o.janusMsg.msgType === 9) {
                            o.janusMsg.config = {
                                ...o.janusMsg.config,
                                userName: getUserName,
                            };
                        }
                        if (isOnline.value) {
                            o.janusMsg.config.isRead = true;
                        }
                        unique.push(o);
                    }
                    return unique;
                }, []);
            }
        },
        announcement: () => {
            console.log("房間公告消息->", data);
        },
        join: () => {
            console.log("有人加入房間->", data);
        },
        leave: () => {
            console.log("有人離開房間->", data);
        },
        kicked: () => {
            console.log("有人被踢出房間->", data);
        },
        destroyed: () => {
            console.log("刪除房間->", data);
        },
        send: () => {
            console.log("發送訊息->", data);
        },
        error: () => {
            console.log("error->", data);
        },
        success: () => {
            console.log("success->", data);
        },
    };

    return whatStatus[what]();
};

/*callPlugin onMessage 接收到的事件處理方法 */
//通訊註冊
export const onRegistered = (): void => {
    console.log("通訊註冊");
};
//發起通話
export const onCalling = (): void => {
    console.log("發起通話");
};

//接聽電話
export const onAccepted = (): void => {
    console.log("接聽電話");
};
//掛掉電話
export const onHangup = (): void => {
    console.log("掛掉電話");
};

// 錯誤訊息
export const onError = (message: string, error = "") => {
    // @ts-ignore
    Janus.error(message, error);
    return message + error;
};

// 亂數生成 userName
export const randomString = (len: any, charSet?: any) => {
    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};

// webNotification 通知 admin 端
export const notifyMe = (eventID: any) => {
    const webNotification = "您有新訊息。";
    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
        //Chat store
        const chatStore = useChatStore();
        const { notification } = storeToRefs(chatStore);
        //推播所攜帶的資訊
        notification.value = new Notification("互動回覆簡訊", {
            icon: `${config.fileUrl}default.png`,
            tag: "talkOD",
            body: webNotification,
            renotify: true,
        });
        //點擊推播的回調
        notification.value.onclick = function () {
            location.href = `/chat/${eventID}`;
            notification.value.close();
        };
    }
};

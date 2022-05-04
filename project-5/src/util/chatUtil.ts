import Janus from "@/assets/js/janus";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import { useChatStore } from "@/store/chat";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatRecordStore } from "@/store/chatRecord";
import { resetSetItem } from "@/util/commonUtil";

//發送私人訊息
export const sendPrivateMsg = ({
    msg = <any>"",
    textPlugin = <any>"",
    chatRoomID = <any>"0",
    eventID = <any>"0",
}) => {
    //Chat store
    const chatStore = useChatStore();
    const { participantList } = storeToRefs(chatStore);
    //api store
    const apiStore = useApiStore();
    const { isInput } = storeToRefs(apiStore);

    let filterDisplays: any = participantList.value.filter((item, index) => {
        const keyName: any = Object.keys(participantList.value[index])[0];
        return item[keyName] === "admin";
    });
    filterDisplays = filterDisplays.map((display) => {
        return Object.keys(display)[0];
    });

    const display = [chatRoomID, ...filterDisplays];
    console.log("sendPrivateMsg display", display);

    if (!display) return;

    if (msg === "") {
        console.log("Insert a message to send on the DataChannel");
        return;
    }
    const message: any = {
        textroom: "message",
        transaction: randomString(12),
        room: Number(eventID),
        // tos: [全部在線客服1,全部在線客服2],
        tos: display,
        text: JSON.stringify(msg),
    };
    textPlugin.data({
        text: JSON.stringify(message),
        error: function (reason: any) {
            console.log("error:", reason);
            isInput.value = false;
        },
        success: function () {
            const data = {
                name: msg.name,
                what: "send",
                display: display,
                text: JSON.stringify(msg),
            };
            isInput.value = true;
        },
    });
    return;
};

/*textPlugin ondata 接收到的事件處理方法 */
export const processDataEvent = (data: any, chatroomID: any, eventID: any) => {
    const chatStore = useChatStore();
    const { getCompanyMsg } = chatStore;
    const { isOnline, textPlugin, messageFrom, messageForm } = storeToRefs(chatStore);

    const chatRecordStore = useChatRecordStore();
    const { recordMessages } = storeToRefs(chatRecordStore);

    // api store
    const apiStore = useApiStore();
    const { getHistoryApi, getChatroomlistApi } = apiStore;
    const { isInput, messageList, chatroomList } = storeToRefs(apiStore);
    interface whatType {
        [key: string]: any;
    }
    const { what, whisper } = data;

    const whatStatus: whatType = {
        message: () => {
            if (whisper === true) {
                console.log("Private message->", data);
                const msg = JSON.parse(data.msg);
                const getFrom = msg.janusMsg.chatroomID;

                if (data.msg !== "recall") {
                    messageFrom.value = getFrom;
                    messageForm.value = msg;
                    console.log(" whisper messageFrom", messageFrom.value);
                    console.log(" whisper messageForm", messageForm.value);
                    const lastChatMessageArr = JSON.parse(
                        sessionStorage.getItem(`${messageFrom.value}-lastChatMessage`)
                    );
                    lastChatMessageArr.push(messageForm.value);
                    resetSetItem(
                        `${messageFrom.value}-lastChatMessage`,
                        JSON.stringify(lastChatMessageArr.slice(-10))
                    );
                } else {
                    console.log("lastChatMessageArr recall:");

                    const lastChatMessageArr = JSON.parse(
                        sessionStorage.getItem(`${messageFrom.value}-lastChatMessage`)
                    );

                    lastChatMessageArr.push(messageForm.value);
                    resetSetItem(
                        `${messageFrom.value}-lastChatMessage`,
                        JSON.stringify(lastChatMessageArr.slice(-10))
                    );
                }
                // sessionStorage.setItem(
                //     `${messageFrom.value}-lastChatMessage`,
                //     JSON.stringify(lastChatMessageArr.slice(-10))
                // );
                // console.log("lastChatMessageArr", lastChatMessageArr);
                // console.log("chatroomID:", chatroomID);
                // console.log("data.from:", data.from);
                // notifyMe(data);
                if (chatroomID == getFrom && data.from) {
                    const message: any = {
                        textroom: "message",
                        transaction: randomString(12),
                        room: Number(eventID),
                        // tos: [全部在線客服1,全部在線客服2],
                        tos: [chatroomID],
                        text: "pin",
                    };
                    textPlugin.value.data({
                        text: JSON.stringify(message),
                        error: function (reason: any) {
                            console.log("error:", reason);
                        },
                        success: function () {
                            console.log("gotoChat pin");
                        },
                    });
                    isInput.value = true;
                    messageList.value.push(msg);
                }

                messageList.value = messageList.value.reduce((unique, o) => {
                    const hasRepeatId = unique.some((obj) => {
                        return obj.janusMsg.config.id === o.janusMsg.config.id;
                    });
                    if (!hasRepeatId) {
                        if (isOnline.value) {
                            o.janusMsg.config.isRead = true;
                        }
                        unique.push(o);
                    }
                    return unique;
                }, []);
                return;
            }
            console.log("Public message->", data);
            return;
        },
        announcement: () => {
            console.log("房間公告消息->", data);
        },
        join: () => {
            // console.log("join chatroomID:", chatroomID);
            // console.log("join username:", data.username);

            console.log("onlineList join:");
            if (chatroomID == data.username) {
                isOnline.value = true;
                isInput.value = true;
                console.log(`${data.username} 加入房間`);
            }
            console.log("有人加入房間->", data);
        },
        leave: () => {
            if (chatroomID == data.username) {
                isOnline.value = false;
            }
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
    //phoneCall store
    const phoneCallStore = usePhoneCallStore();
    const { doHangup } = phoneCallStore;
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
    console.log("onError:", message + error);

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

function notifyMe(data: any) {
    const msg = JSON.parse(data.msg).janusMsg.message;
    // console.log("msg:", msg);

    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
        const notification = new Notification(data.from, {
            icon: "",
            body: msg,
        });
        notification.onclick = function () {
            // do some
        };
    }
}

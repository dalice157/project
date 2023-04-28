import Janus from "@/assets/js/janus";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { nextTick } from "vue";

import { useModelStore } from "@/store/model";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import { localStorageMsg } from "@/util/commonUtil";

//發送私人訊息
export const sendPrivateMsg = ({
    msg = <any>"",
    textPlugin = <any>"",
    eventKey = <any>"",
    msgParticipantList = <any>[],
    eventID = <any>"",
}) => {
    //  設定發送對象
    const display = msgParticipantList;
    // 加自己為發送對象
    const myRoomID = eventKey.slice(-7);
    if (!msgParticipantList.includes(myRoomID)) {
        msgParticipantList.push(myRoomID);
    }
    console.log(" janus 發送訊息對象為:", msgParticipantList);
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
            console.log("一般訊息發送失敗 原因:", reason);
        },
        success: function () {
            console.log("一般訊息發送成功");
        },
    });
    return;
};

/*textPlugin ondata 接收到的事件處理方法 */
export const processDataEvent = (data: any, eventKey: any) => {
    const chatStore = useChatStore();
    const { scrollToBottom } = chatStore;
    const { messages, pictures, findScrollHeight, newMsgHint, isOnline, participantList } =
        storeToRefs(chatStore);

    interface whatType {
        [key: string]: any;
    }
    const { what, whisper } = data;
    const whatStatus: whatType = {
        message: () => {
            if (whisper === true) {
                console.log("接收到一般訊息 ->", data);
                // 獲取local 聊天資料
                messages.value = JSON.parse(localStorage.getItem(`${eventKey}`) || "[]");
                // 已讀顯示
                if (data.msg === "pin") {
                    console.log("管理者進聊天室發出pin 所有訊息已讀");
                    messages.value.forEach((element) => {
                        element.janusMsg.config.isRead = true;
                    });
                    localStorageMsg(messages.value, eventKey);
                    return;
                }
                // 解構janus來的訊息
                const messagesParse: any = JSON.parse(data.msg);
                //收回訊息
                if (
                    messagesParse.janusMsg.config.recallStatus === true ||
                    messagesParse.janusMsg.msgType === 10
                ) {
                    messages.value.forEach((element) => {
                        if (element.janusMsg.config.id === messagesParse.janusMsg.config.id) {
                            element.janusMsg.config.recallStatus = true;
                        }
                    });
                    localStorageMsg(messages.value, eventKey);
                    //如果收回為圖片訊息 圖庫圖片失效
                    pictures.value.forEach((pic) => {
                        if (pic.janusMsg.config.id === messagesParse.janusMsg.config.id) {
                            pic.janusMsg.config.recallStatus = true;
                        }
                    });
                    pictures.value = pictures.value.reduce((unique, o) => {
                        const hasRepeatId = unique.some((obj) => {
                            return obj.janusMsg.config.id === o.janusMsg.config.id;
                        });
                        if (!hasRepeatId) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    localStorage.setItem(`${eventKey}-pictures`, JSON.stringify(pictures.value));
                    //更改最後一筆訊息
                    const lastMessage = messages.value
                        .filter((msg) => {
                            return msg.janusMsg.config.recallStatus === false;
                        })
                        .pop();
                    // console.log("收回後存的最後一筆訊息", lastMessage);
                    localStorage.setItem(`${eventKey}-lastMessage`, JSON.stringify(lastMessage));
                    return;
                }
                //添加圖庫 並推入local
                if (
                    messagesParse.janusMsg.msgType === 6 ||
                    messagesParse.janusMsg.msgType === 7 ||
                    messagesParse.janusMsg.msgType === 11
                ) {
                    pictures.value.push(messagesParse);
                    pictures.value = pictures.value.reduce((unique, o) => {
                        const hasRepeatId = unique.some((obj) => {
                            return obj.janusMsg.config.id === o.janusMsg.config.id;
                        });
                        if (!hasRepeatId) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    localStorage.setItem(`${eventKey}-pictures`, JSON.stringify(pictures.value));
                }
                // 電話判斷
                messages.value.forEach((element) => {
                    // element.janusMsg.config.isRead = true;
                    if (element.janusMsg.sender == 0 && element.janusMsg.format.phoneType == 1) {
                        element.janusMsg.format.phoneType = 4;
                    }
                });
                messages.value.push(messagesParse);
                // 訊息去重
                messages.value = messages.value.reduce((unique, o) => {
                    const hasRepeatId = unique.some((obj) => {
                        return obj.janusMsg.config.id === o.janusMsg.config.id;
                    });
                    if (!hasRepeatId) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                // 判斷是否置底
                let scrollHeight = 0;
                let scrollTop = 0;
                let offsetHeight = 0;
                scrollHeight = findScrollHeight.value.scrollHeight;
                scrollTop = findScrollHeight.value.scrollTop;
                offsetHeight = findScrollHeight.value.offsetHeight;
                //檔案上傳動畫取消
                const modelStore = useModelStore();
                const { uploadIsLoading } = storeToRefs(modelStore);
                setTimeout(() => {
                    uploadIsLoading.value = false;
                }, 500);
                //訊息存進localStorage
                localStorageMsg(messages.value, eventKey);
                //訊息最後一筆存進localStorage
                localStorage.setItem(`${eventKey}-lastMessage`, JSON.stringify(messagesParse));
                if (
                    scrollHeight - scrollTop < offsetHeight + 30 ||
                    messagesParse.janusMsg.sender === 1
                ) {
                    nextTick(() => {
                        scrollToBottom();
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
                } else {
                    newMsgHint.value = true;
                }
                return;
            }
            console.log("Public message->", data);
            return;
        },
        announcement: () => {
            console.log("房間公告消息->", data);
        },
        join: () => {
            console.log("有人加入房間->", data);
            if (participantList.value.length > 0) {
                isOnline.value = true;
            }
            console.log("有人加入後 房間的人員清單", participantList.value);
        },
        leave: () => {
            console.log("有人離開房間->", data);
            if (participantList.value.length === 0) {
                isOnline.value = false;
            }
            console.log("有人離開後 房間的人員清單", participantList.value);
        },
        kicked: () => {
            console.log("有人被踢出房間->", data);
        },
        destroyed: () => {
            console.log("刪除房間->", data);
        },
        send: () => {
            console.log("發送訊息!!!!->", data);
        },
        error: () => {
            console.log("訊息發送 error->", data);
        },
        success: () => {
            console.log("訊息發送 success->", data);
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
export const onError: any = (message: string, error = "") => {
    console.log("onError message:", message);
    console.log("onError error:", error);

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

// function notifyMe(data) {
//     const msg = JSON.parse(data.msg).janusMsg.message;
//     console.log("msg:", msg);

//     if (Notification.permission !== "granted") Notification.requestPermission();
//     else {
//         const notification = new Notification(data.from, {
//             icon: "",
//             body: msg,
//         });
//         notification.onclick = function () {
//             // do some
//         };
//     }
// }

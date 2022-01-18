import Janus from "../assets/js/janus";
import { useChatStore } from "../store/chat";
import { usePhoneCallStore } from "../store/phoneCall";
import { storeToRefs } from "pinia";
import { IProcessData } from "../util/interfaceUtil";
import { nanoid } from "nanoid";
import { MY_ROOM, YOU_USER_NAME } from "./commonUtil";

//發送私人訊息
export const sendPrivateMsg = ({ msg = <any>"", textPlugin = <any>"", chatToken = <any>"" }) => {
    console.log("sendPrivateMsg:", msg);
    // const getText = msg.message || msg.format?.ShowName;
    // const display = eventInfo.name;
    const display = YOU_USER_NAME;
    if (!display) return;

    if (msg === "") {
        console.log("Insert a message to send on the DataChannel");
        return;
    }
    const message: any = {
        textroom: "message",
        transaction: randomString(12),
        room: MY_ROOM,
        // tos: [全部在線客服1,全部在線客服2],
        tos: display,
        text: JSON.stringify(msg),
    };
    textPlugin.data({
        text: JSON.stringify(message),
        error: function (reason: any) {
            console.log("error:", reason);
        },
        success: function () {
            const data = {
                name: msg.name,
                what: "send",
                display: display,
                text: JSON.stringify(msg),
            };
            processDataEvent(data, chatToken);
        },
    });
    return;
};

/*textPlugin ondata 接收到的事件處理方法 */
export const processDataEvent = (data: any, chatToken: any) => {
    const chatStore = useChatStore();
    const { getCompanyMsg } = chatStore;
    const { chatRoomMsg, messages, replyMsg } = storeToRefs(chatStore);

    interface whatType {
        [key: string]: any;
    }
    const { what, whisper } = data;
    const whatStatus: whatType = {
        message: () => {
            if (whisper === true) {
                console.log("Private message->", data);
                notifyMe(data);
                getCompanyMsg(data, chatToken);
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
            // getCompanyMsg(data);
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

function notifyMe(data) {
    const msg = JSON.parse(data.msg).janusMsg.message;
    console.log("msg:", msg);

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

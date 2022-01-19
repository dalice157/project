import config from "@/config/config";
import { randomString } from "@/util/chatUtil";
// 預設值
export const ME_USER_NAME = randomString(3); // 自己
export const DO_CALL_NAME = "123";
export const YOU_USER_NAME = ["tony1", "da", randomString(3)]; // 對方
export const OPAQUEID = "SMS_Plugin-123456789123";
export const MY_ROOM = 1234; //Demo room
export const JANUS_URL: any = `${config.janusUrl}/janus`;
// export let JANUS_URL: any = "";
// if (window.location.protocol === "http:") {
//     // server = "http://" + window.location.hostname + ":8088/janus";
//     JANUS_URL = "wss://janus.conf.meetecho.com/ws"; //Demo server
// } else {
//     JANUS_URL = "https://" + window.location.hostname + ":8089/janus";
// }

// chatroomID
export const chatroomID = (chatToken: any) => chatToken?.slice(-7);

// 回覆點擊功能
export const scrollPageTo = (replyId: string | null) => {
    if (!replyId) return;
    const element: any = document.getElementById(`${replyId}`);

    element.scrollIntoView({ behavior: "smooth", block: "center", nearest: "center" });

    const getAnimateClassName = element.childNodes[6].childNodes[0];

    getAnimateClassName.classList.add("animate__shakeX");
    setTimeout(() => {
        getAnimateClassName.classList.remove("animate__shakeX");
    }, 1000);
};

// 存取 localStorage
export const localStorageMsg = (messageList: any, chatToken: any = "") => {
    const messageStorage = messageList.map((msg: any) => {
        return {
            janusMsg: {
                chatroomID: chatroomID(chatToken),
                sender: msg.janusMsg.sender,
                type: msg.janusMsg.type,
                msgType: msg.janusMsg.msgType,
                message: msg.janusMsg.message,
                format: msg.janusMsg.format || "",
            },
            id: msg.id,
            phoneType: msg.phoneType,
            audioInfo: msg.audioInfo,
            ext: msg.ext,
            msgMoreStatus: msg.msgMoreStatus,
            msgFunctionStatus: msg.msgFunctionStatus,
            recallStatus: msg.recallStatus,
            recallPopUp: msg.recallPopUp,
            time: msg.time,
            currentDate: msg.currentDate,
            currentMonth: msg.currentMonth,
            expirationDate: msg.expirationDate,
            isExpire: msg.isExpire,
            replyObj: msg.replyObj || "",
        };
    });

    localStorage.setItem(`${chatToken}`, JSON.stringify(messageStorage));
};
const MIMEMap: any = {
    "image/jpeg": "IMAGE",
    "image/jpg": "IMAGE",
    "image/png": "IMAGE",
    "image/svg": "IMAGE",
    "image/gif": "IMAGE",
    "image/bmp": "IMAGE",
    "image/vnd.wap.wbmp": "IMAGE",
    "text/plain": "TXT",
    "application/pdf": "PDF",
    "application/rtf": "DOC",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "DOC",
    "application/vnd.ms-word.document.macroEnabled.12": "DOC",
    "application/vnd.ms-word.template.macroEnabled.12": "DOC",
    "application/vnd.ms-excel": "EXCEL",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "EXCEL",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "EXCEL",
    "application/vnd.ms-excel.sheet.macroEnabled.12": "EXCEL",
    "application/vnd.ms-excel.template.macroEnabled.12": "EXCEL",
    "application/vnd.ms-excel.addin.macroEnabled.12": "EXCEL",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12": "EXCEL",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.ms-powerpoint.slideshow.macroenabled.12": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.template": "PPT",
    "application/vnd.ms-powerpoint.template.macroenabled.12": "PPT",
    "application/vnd.ms-powerpoint.addin.macroEnabled.12": "PPT",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12": "PPT",
    "application/vnd.oasis.opendocument.presentation": "PPT",
    "audio/x-wav": "AUDIO",
    "audio/x-ms-wma": "AUDIO",
    "audio/mp3": "AUDIO",
    "audio/mpeg": "AUDIO",
    "audio/x-m4a": "AUDIO",
    "audio/mp4": "AUDIO",
    "audio/m4a": "AUDIO",
    "video/3gpp": "VIDEO",
    "video/mpeg": "VIDEO",
    "video/x-msvideo": "VIDEO",
    "video/x-ms-wmv": "VIDEO",
    "video/vnd.uvvu.mp4": "VIDEO",
    "video/mp4": "VIDEO",
    "video/x-flv": "VIDEO",
    "video/webm": "VIDEO",
    "video/mov": "VIDEO",
    "application/x-zip-compressed": "ZIP",
};

// 取出副檔名
export function getFileExtension(ext: any) {
    return ext.split(".").pop();
}

// 時間計算
export const convertTime = (seconds: any) => {
    // Hours, minutes and seconds
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let output = "";
    if (hrs > 0) {
        output += "" + hrs + ":" + (mins < 10 ? "00" : "");
    }
    output += "" + mins + ":" + (secs < 10 ? "0" : "");
    output += "" + secs;
    return output;
};

// 判斷物件筆數為零
export const isObjToBeZero = (obj: any) => {
    return Object.keys(obj).length === 0;
};

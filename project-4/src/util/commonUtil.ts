import config from "@/config/config";
import { randomString } from "@/util/chatUtil";

// 環境設定
export const isProduction = process.env.NODE_ENV === "production";
// 預設值
export const ME_USER_NAME = "DA_Front"; // 自己
export const DO_CALL_NAME = "eee";
export const YOU_USER_NAME = ["DA"]; // 對方
export const OPAQUEID = "SMS_Plugin-123456789123";
export const MY_ROOM = 1234; //Demo room
export const JANUS_URL: any = `${config.janusUrl}/janus`;

// chatroomID
export const chatroomID = (eventKey: any) => eventKey?.slice(-7);
export const eventID = (eventKey: any) => eventKey?.slice(0, -7);

// 回覆點擊功能
export const scrollPageTo = (replyId: string | null) => {
    if (!replyId) return;
    const element: any = document.getElementById(`${replyId}`);
    element.scrollIntoView({ behavior: "smooth", block: "center", nearest: "center" });
    const shakeDom = isProduction ? 2 : 8;
    console.log("getAnimateClassName:", element.childNodes);
    const getAnimateClassName = element.childNodes[shakeDom];

    getAnimateClassName.classList.add("animate__shakeX");
    setTimeout(() => {
        getAnimateClassName.classList.remove("animate__shakeX");
    }, 1000);
};

// 存取 localStorage
export const localStorageMsg = (messageList: any, eventKey: any = "") => {
    localStorage.setItem(`${eventKey}`, JSON.stringify(messageList));
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

// 判斷是否是手機
export const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
);

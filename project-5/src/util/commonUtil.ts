import config from "@/config/config";
import { useChatStore } from "@/store/chat";

// 預設值
export const ME_USER_NAME = "admin1"; // 自己
export const DO_CALL_NAME = "123";
export const YOU_USER_NAME = ["tony1"]; // 對方
export const OPAQUEID = "SMS_Plugin-123456789123";
export const MY_ROOM = 1234; //Demo room
export const JANUS_URL: any = `${config.janusUrl}/janus`;

export const isProduction = process.env.NODE_ENV === "production";
// export let JANUS_URL: any = "";
// if (window.location.protocol === "http:") {
//     // server = "http://" + window.location.hostname + ":8088/janus";
//     JANUS_URL = "wss://janus.conf.meetecho.com/ws"; //Demo server
// } else {
//     JANUS_URL = "https://" + window.location.hostname + ":8089/janus";
// }
// 回覆點擊功能
export const scrollPageTo = (replyId: string | null) => {
    if (!replyId) return;
    const element: any = document.getElementById(`${replyId}`);
    element.scrollIntoView({ behavior: "smooth", block: "center", nearest: "center" });
    const shakeDom = isProduction ? 1 : 7;
    console.log("getAnimateClassName:", element.childNodes);
    const getAnimateClassName = element.childNodes[shakeDom];
    setTimeout(() => {
        getAnimateClassName.classList.add("animate__shakeX");
    }, 600);
    setTimeout(() => {
        getAnimateClassName.classList.remove("animate__shakeX");
    }, 1600);
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

// 判檢查每筆電話是否符合正則表達
export function isphone(ele: any) {
    return ele.match(/^09\d{2}-?\d{3}-?\d{3}$/);
}
//點數判斷
//簡訊點數計算(傳入簡訊內容)
export function pointCalculation(smsContentStr) {
    //檢查內容是否含有中文字
    const hasCh = hasChinese(smsContentStr);

    let messageArray;
    let point = 0;
    let smsCount = 0;
    if (hasCh) {
        messageArray = getSplitMessage(smsContentStr, 333); //拆則--(1-2)、(2-2)

        if (messageArray.length > 0) {
            if (messageArray[messageArray.length - 1].length <= 70) {
                point = 5 * (messageArray.length - 1) + 1;
            } else {
                point =
                    5 * (messageArray.length - 1) +
                    (Math.trunc(messageArray[messageArray.length - 1].length / 67) +
                        (messageArray[messageArray.length - 1].length % 67 != 0 ? 1 : 0));
            }
        }
    } else {
        if (!editsend_isPureEnglishCheck(smsContentStr)) {
            alert("純英文發送內容時不可有`^");
        }
        messageArray = getSplitMessage(smsContentStr, 765);
        if (messageArray.length > 0) {
            if (messageArray[messageArray.length - 1].length <= 160) {
                point = 5 * (messageArray.length - 1) + 1;
            } else {
                point =
                    5 * (messageArray.length - 1) +
                    (Math.trunc(messageArray[messageArray.length - 1].length / 153) +
                        (messageArray[messageArray.length - 1].length % 153 != 0 ? 1 : 0));
            }
        }
    }

    smsCount = messageArray.length;

    return {
        smsCount: smsCount, //拆為幾則
        point: point, //幾點
    };
}

//參考MQ扣點(MQ方法getSplitMessage)
function getSplitMessage(message, charMax) {
    let frameSize = Math.trunc(message.length / charMax) + (message.length % charMax != 0 ? 1 : 0);
    frameSize = frameSize == 0 ? 1 : frameSize;
    let messageArray = new Array(frameSize);

    if (frameSize == 1) {
        messageArray[0] = message;
    } else {
        while (frameSize > 1) {
            let fromPos = 0;
            let seqIndi;
            for (let i = 0; i < frameSize; i++) {
                seqIndi = "(" + (i + 1) + "-" + frameSize + ")";
                if (i < frameSize - 1) {
                    messageArray[i] =
                        seqIndi + message.substring(fromPos, charMax - seqIndi.length);
                } else {
                    messageArray[i] = seqIndi + message.substring(fromPos);
                }
                fromPos += charMax - seqIndi.length;
            }
            if (messageArray[frameSize - 1].length > charMax) {
                // ==表示因為加入了 seq indicator, 長度加長, 有必要再調整
                frameSize++;
                messageArray = null;
                messageArray = new Array(frameSize);
            } else {
                break;
            }
        }
    }
    return messageArray;
}

//檢查是否有中文
function hasChinese(str) {
    let i;
    let ch, cch;
    if (str.length > 0) {
        for (i = 0; i < str.length; i++) {
            ch = "";
            if (str.charCodeAt(i) > 127) {
                return true;
            }
        }
    }
    return false;
}

/*檢查發送內容是否有無法輸入字元*/
function editsend_isPureEnglishCheck(str) {
    /*
	含全形字元時
	這是發送測試~`^{}[]|\\

	純英文時候
	~=-
	`=@
	^= 
	{=(
	}=)
	[=<
	]=>
	|=/
	/=/
	*/
    let isOk = true;
    const checkCharArray = ["`", "^"];
    const checkCharArrayLength = checkCharArray.length;
    const strLength = str.length;
    for (let i = 0; i < checkCharArrayLength; i++) {
        for (let j = 0; j < strLength; j++) {
            if (checkCharArray[i] == str.charAt(j)) {
                isOk = false;
            }
        }
    }
    return isOk;
}

// 圖片展示
export const previewURL = (file: any): void => {
    console.log("file:", file);

    const fileName = file.ShowName;
    const fileID = file.Fileid;
    const wrap = document.getElementsByClassName("n-image-preview-container");
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.href = `${config.serverUrl}/v1/file/${fileID}`;
    a.target = "_blank";
    a.download = fileName;
    a.className = "download";
    a.innerHTML = `<span class="downloadImg"></span>`;
    wrap[0].appendChild(a);
};

// sms、mms罐頭訊息
export const options = [
    {
        label: "請選擇罐頭片語",
        value: "",
    },
    {
        label: "線上交談",
        value: "線上交談",
    },
    {
        label: "詢問客服",
        value: "詢問客服",
    },
    {
        label: "了解詳情",
        value: "了解詳情",
    },
    {
        label: "線上詢問",
        value: "線上詢問",
    },
    {
        label: "線上互動",
        value: "線上互動",
    },
    {
        label: "詳洽",
        value: "詳洽",
    },
];

// 大頭照
export const imgList: any = [
    `${config.fileUrl}icon/default.svg`,
    `${config.fileUrl}icon/1.png`,
    `${config.fileUrl}icon/2.png`,
    `${config.fileUrl}icon/3.png`,
    `${config.fileUrl}icon/4.png`,
    `${config.fileUrl}icon/5.png`,
    `${config.fileUrl}icon/6.png`,
    `${config.fileUrl}icon/7.png`,
    `${config.fileUrl}icon/8.png`,
    `${config.fileUrl}icon/9.png`,
    `${config.fileUrl}icon/10.png`,
    `${config.fileUrl}icon/11.png`,
    `${config.fileUrl}icon/12.png`,
];

// 聊天室可上傳檔案類型
export const chatfileAccept =
    "image/png, image/jpeg, image/gif, text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";
// 可上傳檔案類型
export const fileAccept =
    "text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";

// 可上傳圖片類型
export const imgAccept = "image/png, image/jpeg, image/gif";

//監聽sessionStorage
export const resetSetItem = (key, newVal) => {
    if (key !== null) {
        // 创建一个StorageEvent事件
        const newStorageEvent = document.createEvent("StorageEvent") as any;
        const storage = {
            setItem: function (k, val) {
                sessionStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent("setItem", false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent);
            },
        };
        return storage.setItem(key, newVal);
    }
};

//token過期導至登入頁
export const tokenExpireToLogin = (err) => {
    if (err.response.status === 401) {
        location.href = `/`;
    }
};

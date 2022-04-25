<template>
    <!-- 回覆視窗 -->
    <div
        class="reply"
        v-show="isReplyBox"
        @click.prevent="scrollPageTo(replyMsg.janusMsg.config.id, isProduction)"
    >
        <div class="usertext">
            <div class="replyText" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">[照片]</div>
            <div class="replyText" v-if="replyMsg && replyMsg.janusMsg.msgType === 3">[貼圖]</div>
            <n-ellipsis
                v-if="replyMsg && replyMsg.janusMsg.msgType === 1"
                style="width: 80%"
                class="replyText"
                :tooltip="false"
            >
                {{ replyMsg.janusMsg.msgContent }}
            </n-ellipsis>
            <div class="img" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">
                <img
                    :src="`${config.fileUrl}${replyMsg.janusMsg.format.Fileid}${replyMsg.janusMsg.format.ExtensionName}`"
                />
            </div>
            <div class="img" v-if="replyMsg && replyMsg.janusMsg.msgType === 3">
                <img
                    :src="`${replyMsg.janusMsg.format.stickerUrl}${replyMsg.janusMsg.format.stickerPackID}/${replyMsg.janusMsg.format.stickerFileID}.${replyMsg.janusMsg.format.ext}`"
                />
            </div>
            <div @click.stop="replyHide" class="closeBtn">
                <img :src="closeIcon" alt="關閉" />
            </div>
        </div>
    </div>

    <!-- 使用者輸入框 -->
    <div class="input">
        <!-- <div class="deleteOption" v-if="deleteBoolean">
            <div class="cancelBtn" @click="deleteBoolean = !deleteBoolean">取消</div>
            <div class="deleteBtn" @click="confirmDeletePopup">
                刪除{{ deleteGroup.length > 0 ? `(${deleteGroup.length})` : "" }}
            </div>
        </div> -->
        <div class="input-inner">
            <span class="mmsSend" v-if="isMmsSend">簡訊發送</span>
            <n-popover trigger="hover" placement="right" v-if="isMmsSend">
                <template #trigger>
                    <n-icon :depth="3" size="22">
                        <help-circle-outline />
                    </n-icon>
                </template>
                <span class="pop"
                    >當此處顯示以「簡訊發送」，即文字內容將以SMS簡訊發送給此人；此處SMS以70個字元為一則，每一則將扣除點數一點，依此類推。
                </span>
            </n-popover>
            <span class="file-folder" v-if="!isMmsSend">
                <input type="file" :accept="chatfileAccept" @change="onUploadFilePC" ref="file" />
            </span>
            <div class="textArea">
                <n-input
                    class="n-input-modify"
                    :placeholder="isMmsSend ? '以簡訊發送' : 'Aa'"
                    type="textarea"
                    size="small"
                    :autosize="{
                        minRows: 1,
                        maxRows: 5,
                    }"
                    v-model:value="msg"
                    @focus="closeAll('input')"
                    @keydown.enter.exact.prevent="addMsg"
                    ref="inputInstRef"
                >
                </n-input>
                <img
                    @click.stop="closeStickerBox"
                    v-if="showStickerModal && !isMmsSend"
                    :src="emojiEnabled"
                    alt="表情貼圖"
                />
                <img
                    @click.stop="openStickerBox"
                    v-if="!showStickerModal && !isMmsSend"
                    :src="emojiIcon"
                    alt="表情貼圖"
                />
            </div>
            <img class="send" :src="sendIcon" alt="傳送訊息" @click.prevent="addMsg" v-show="msg" />
            <img
                class="recorder"
                :src="voiceIcon"
                alt="開啟錄音"
                v-show="!msg && !showRecorderModal"
                @click="openRecorder()"
            />
            <img
                class="recorder"
                :src="voiceEnabled"
                alt="關閉錄音"
                v-show="!msg && showRecorderModal"
                @click="closeRecorder()"
            />
        </div>
        <!-- 貼圖視窗 -->
        <div class="stickerArea" v-show="showStickerModal">
            <div class="stickerTabsArea">
                <ul class="stickerTabs">
                    <li
                        v-if="stickerItems.length > 0"
                        class="reload-time"
                        @click="stickerGroupID == 0 ? '' : handleStickckerGroup(0)"
                        :class="{
                            active: stickerGroupID == 0,
                        }"
                    >
                        <img v-if="stickerGroupID == 0" :src="reloadTimeEnabled" alt="小圖" />
                        <img v-else :src="reloadTimeIcon" alt="小圖" />
                    </li>
                    <li
                        v-for="tab in stickerList"
                        :key="tab.stickerPackID"
                        @click="
                            stickerGroupID == tab.stickerPackID
                                ? ''
                                : handleStickckerGroup(tab.stickerPackID)
                        "
                        :class="{
                            active: stickerList.length > 0 && stickerGroupID == tab.stickerPackID,
                        }"
                    >
                        <img :src="`${stickerUrl}${tab.stickerPackID}/tab.${tab.ext}`" alt="小圖" />
                    </li>
                </ul>
            </div>
            <div class="stickerGroupID" v-show="stickerItems.length > 0 && stickerGroupID == 0">
                <n-grid :x-gap="10" :y-gap="10" :cols="4">
                    <n-grid-item
                        v-for="(item, index) in stickerItems"
                        :key="index"
                        @click="addSticker(item, item.stickerFileID)"
                    >
                        <div class="stickerIcon">
                            <img
                                :src="`${item.stickerUrl}${item.stickerPackID}/${item.stickerFileID}.${item.ext}`"
                                :alt="`${item.title}`"
                            />
                        </div>
                    </n-grid-item>
                </n-grid>
            </div>
            <div
                class="stickerGroupID"
                v-show="stickerGroupID == stickerGroup.stickerPackID && stickerGroupID != 0"
            >
                <n-grid :x-gap="10" :y-gap="10" :cols="4">
                    <n-grid-item
                        v-for="tab in stickerGroup.stickerList"
                        :key="tab"
                        @click="addSticker(stickerGroup, tab)"
                        :class="{ hide: tab == 'tab' || tab == 'main' }"
                    >
                        <div class="stickerIcon">
                            <img
                                :src="`${stickerUrl}${stickerGroup.stickerPackID}/${tab}.${stickerGroup.ext}`"
                                :alt="`${stickerGroup.stickerPackID}-${tab}`"
                            />
                        </div>
                    </n-grid-item>
                </n-grid>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";
import axios from "axios";
import { NInput, NEllipsis, NIcon, NModal, NCard, NGrid, NGridItem, NPopover } from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { storeToRefs } from "pinia";
import Recorder from "js-audio-recorder";
// import {} from "googlemaps";
import { GoogleMap, Marker } from "vue3-google-map";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import { txt } from "@/util/interfaceUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import { scrollPageTo, isObjToBeZero } from "@/util/commonUtil";
import { currentTime, currentDate, unixTime } from "@/util/dateUtil";
import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import sendIcon from "@/assets/Images/chatroom/send.svg";
import closeIcon from "@/assets/Images/chatroom/round-fill_close.svg";
import emojiEnabled from "@/assets/Images/chatroom/emoji-enabled.svg";
import emojiIcon from "@/assets/Images/chatroom/emoji.svg";
import voiceIcon from "@/assets/Images/chatroom/voice.svg";
import voiceEnabled from "@/assets/Images/chatroom/voice-enabled.svg";
import reloadTimeEnabled from "@/assets/Images/chatroom/reload-time-enabled.svg";
import reloadTimeIcon from "@/assets/Images/chatroom/reload-time.svg";
import { chatfileAccept } from "@/util/commonUtil";
import config from "@/config/config";

//環境設定
const isProduction = process.env.NODE_ENV === "production";
// model sotre
const modelStore = useModelStore();
const { closeAll } = modelStore;

// api store
const apiStore = useApiStore();
const { getSticker, sendMMSMsg } = apiStore;
const { messageList, stickerList, stickerUrl, point } = storeToRefs(apiStore);
//store
const chatStore = useChatStore();
const inputInstRef: any = ref(null);
const { replyHide, openRecorder, closeRecorder, handleStickckerGroup } = chatStore;
const {
    messages,
    pictures,
    msg,
    isReplyBox,
    replyMsg,
    inputVal,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    inputFunctionBoolean,
    textPlugin,
    showRecorderModal,
    showStickerModal,
    stickerGroupID,
    stickerGroup,
    isMmsSend,
    isOnline,
} = storeToRefs(chatStore);
//router
const route = useRoute();
onMounted(() => {
    inputInstRef.value.blur();
    inputVal.value = inputInstRef.value;
});

const getUserName = localStorage.getItem("userName");

const chatRoomID: any = computed(() => route.query.chatroomID);

// 地圖定位
const showMapModal = ref(false);
const latitude = ref();
const longitude = ref();
const handleFindMe = () => {
    showMapModal.value = !showMapModal.value;
    inputFunctionBoolean.value = false;
    gettingPosition();
};

// 取得使用者位置
const gettingPosition: any = () => {
    if (navigator.geolocation) {
        let options = {
            enableHighAccuracy: false,
            timeout: 10 * 1000,
            maximumAge: 5 * 60 * 1000,
        };
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } else {
        alert("你的裝置或瀏覽器不支援定位功能");
    }
};

const successCallback = (position: any) => {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;

    console.log("Your current position is:");
    console.log("position : ", position);
    console.log("Latitude : " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
    console.log("More or less " + position.coords.accuracy + " meters.");

    // 獲取地址資料api, 目前需要獲取付費憑證
    axios({
        method: "get",
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude.value},${longitude.value}&language=zh-TW&key=AIzaSyAx5g4E7tKTC_Q-ycGlbDMBH5UDOqa7-aY`,
    }).then((res) => {
        console.log("google geocode res:", res);
    });
};
const errorCallback = (error: any) => {
    console.log("error", error.message);
};

//發送訊息
//input v-model
const addMsg = (): void => {
    const str = msg.value.trim();
    let textObj: any = {
        janusMsg: {
            chatroomID: chatRoomID.value,
            msgType: 1,
            sender: 0,
            msgContent: str,
            time: unixTime(),
            type: isMmsSend.value ? 1 : 2,
            format: {},
            config: {
                id: nanoid(),
                isReply: replyMsg.value ? true : false,
                replyObj: replyMsg.value || "",
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: isOnline.value ? true : false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
                userName: getUserName,
            },
        },
    };

    if (str !== "") {
        messageList.value.push(textObj);
        // 送出後清除 msg 及 replyMsg
        console.log("msg", msg.value);
        const sendMsgObj = {
            msg: textObj,
            textPlugin: textPlugin.value,
            chatRoomID: chatRoomID.value,
            eventID: route.params.id,
        };
        const sendMMSObj = {
            text: str,
            chatRoomID: chatRoomID.value,
        };
        isMmsSend.value && sendMMSMsg(sendMMSObj);
        sendPrivateMsg(sendMsgObj);
    }
    msg.value = "";
    replyHide();
};
//手機版發送圖片
const image = ref();
const uploadImage = (e: any) => {
    const fileArr = e.target.files[0];
    const fileName = fileArr.name;
    if (!fileArr) {
        return;
    }
    //壓縮圖片套件 compressor js
    new Compressor(fileArr, {
        quality: 0.6,
        success(result) {
            //呼叫api
            const fd = new FormData();
            const getToken = localStorage.getItem("access_token");
            fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
            axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(fileArr);
                    reader.onload = (e: any) => {
                        image.value = e.target.result;
                        const imageObj: any = {
                            janusMsg: {
                                chatroomID: chatRoomID.value,
                                msgType: 6,
                                sender: 0,
                                msgContent: "",
                                time: unixTime(),
                                type: 2,
                                format: {
                                    Fileid: res.data.fileid,
                                    ShowName: fileName,
                                    ExtensionName: res.data.ext,
                                    FileSize: fileArr.size,
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                                config: {
                                    id: nanoid(),
                                    isReply: replyMsg.value ? true : false,
                                    replyObj: replyMsg.value ? { ...replyMsg.value } : "",
                                    currentDate: currentDate(),
                                    isExpire: false,
                                    isPlay: false,
                                    isRead: isOnline.value ? true : false,
                                    msgFunctionStatus: false,
                                    msgMoreStatus: false,
                                    recallPopUp: false,
                                    recallStatus: false,
                                    userName: getUserName,
                                },
                            },
                        };

                        const sendMsgObj = {
                            msg: imageObj,
                            textPlugin: textPlugin.value,
                            chatRoomID: chatRoomID.value,
                            eventID: route.params.id,
                        };
                        sendPrivateMsg(sendMsgObj);
                        messageList.value.push(imageObj);
                        pictures.value.push(imageObj);
                    };
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        error(err) {
            console.error(err);
        },
    });
};
//桌機版上傳檔案
const file = ref(null);
const files = ref();
const onUploadFilePC = (e: any) => {
    inputFunctionBoolean.value = false;
    const fileArr = e.target.files[0];
    console.log("fileArr", fileArr);
    const fileArrType = e.target.files[0].type;
    const fileName = fileArr.name;
    const getToken = localStorage.getItem("access_token");
    if (!fileArr) {
        return;
    }
    //辨識上傳檔案
    if (fileArrType.includes("image")) {
        new Compressor(fileArr, {
            quality: 0.6,
            success(result) {
                //呼叫api
                const fd = new FormData();
                fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                axios({
                    method: "post",
                    url: `${config.serverUrl}/v1/file`,
                    data: fd,
                    headers: { Authorization: `Bearer ${getToken}` },
                })
                    .then((res) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(fileArr);
                        reader.onload = (e: any) => {
                            image.value = e.target.result;
                            const imageObj: any = {
                                janusMsg: {
                                    chatroomID: chatRoomID.value,
                                    msgType: 6,
                                    sender: 0,
                                    msgContent: "",
                                    time: unixTime(),
                                    type: 2,
                                    format: {
                                        Fileid: res.data.fileid,
                                        ShowName: fileName,
                                        ExtensionName: res.data.ext,
                                        FileSize: fileArr.size,
                                        expirationDate: dayjs
                                            .unix(res.data.exp)
                                            .format("YYYY-MM-DD"),
                                    },
                                    config: {
                                        id: nanoid(),
                                        isReply: replyMsg.value ? true : false,
                                        replyObj: replyMsg.value ? { ...replyMsg.value } : "",
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: isOnline.value ? true : false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                        userName: getUserName,
                                    },
                                },
                            };

                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                chatRoomID: chatRoomID.value,
                                eventID: route.params.id,
                            };
                            sendPrivateMsg(sendMsgObj);
                            messageList.value.push(imageObj);
                            pictures.value.push(imageObj);
                        };
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            error(err) {
                console.error(err);
            },
        });
    } else {
        const fd = new FormData();
        console.log("fileArr:", fileArr);

        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

        axios({
            method: "post",
            url: `${config.serverUrl}/v1/file`,
            data: fd,
            headers: { Authorization: `Bearer ${getToken}` },
        })
            .then((res) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;

                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            chatroomID: chatRoomID.value,
                            msgType: 7,
                            sender: 0,
                            msgContent: "",
                            time: unixTime(),
                            type: 2,
                            format: {
                                Fileid: res.data.fileid,
                                ShowName: fileArr.name,
                                ExtensionName: res.data.ext,
                                FileSize: fileArr.size,
                                expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                            },
                            config: {
                                id: nanoid(),
                                isReply: false,
                                replyObj: "",
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: isOnline.value ? true : false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                                userName: getUserName,
                            },
                        },
                    };
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatRoomID: chatRoomID.value,
                        eventID: route.params.id,
                    };
                    sendPrivateMsg(sendMsgObj);
                    messageList.value.push(fileObj);
                    pictures.value.push(fileObj);
                };
            })
            .catch((err) => {
                console.error(err);
            });
    }
    file.value.value = null;
};
// 手機版上傳檔案
// const onUploadFileMP = (e: any) => {
//     inputFunctionBoolean.value = false;
//     const fileArr = e.target.files[0];
//     if (!fileArr) {
//         return;
//     }

//     const getToken = localStorage.getItem("access_token");
//     const fd = new FormData();
//     fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

//     axios({
//         method: "post",
//         url: `${config.serverUrl}/v1/file`,
//         data: fd,
//         headers: { Authorization: `Bearer ${getToken}` },
//     })
//         .then((res) => {
//             console.log("上傳 res:", res);
//             const reader = new FileReader();
//             reader.readAsDataURL(fileArr);
//             reader.onload = (e: any) => {
//                 files.value = e.target.result;
//                 let fileObj: any = {};
//                 fileObj = {
//                     janusMsg: {
//                         chatroomID: chatRoomID.value,
//                         msgType: 7,
//                         sender: 0,
//                         msgContent: "",
//                         time: unixTime(),
//                         type: 2,
//                         format: {
//                             Fileid: res.data.fileid,
//                             ShowName: fileArr.name,
//                             ExtensionName: res.data.ext,
//                             FileSize: fileArr.size,
//                             expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
//                         },
//                         config: {
//                             id: nanoid(),
//                             isReply: false,
//                             replyObj: "",
//                             currentDate: currentDate(),
//                             isExpire: false,
//                             isPlay: false,
//                             isRead: isOnline.value ? true : false,
//                             msgFunctionStatus: false,
//                             msgMoreStatus: false,
//                             recallPopUp: false,
//                             recallStatus: false,
//                             userName: getUserName,
//                         },
//                     },
//                 };
//                 const sendMsgObj = {
//                     msg: fileObj,
//                     textPlugin: textPlugin.value,
//                     chatRoomID: chatRoomID.value,
//                     eventID: route.params.id,
//                 };
//                 sendPrivateMsg(sendMsgObj);
//                 messageList.value.push(fileObj);
//                 pictures.value.push(fileObj);
//             };
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// };
// 貼圖功能
let stickerItems: any = ref([]);
if (window.localStorage.getItem("sticker-backend") !== null) {
    stickerItems.value = JSON.parse(window.localStorage.getItem("sticker-backend"));
}
onMounted(() => {
    getSticker();
});
const openStickerBox = () => {
    showRecorderModal.value = false;
    showStickerModal.value = true;
};

const closeStickerBox = () => {
    showStickerModal.value = false;
};

// 貼圖
const addSticker = (sticker, id) => {
    let stickerObj: any = {
        janusMsg: {
            chatroomID: chatRoomID.value,
            msgType: 3,
            sender: 0,
            msgContent: "",
            time: unixTime(),
            type: 2,
            format: {
                stickerPackID: sticker.stickerPackID,
                stickerUrl: stickerUrl.value,
                ext: sticker.ext,
                stickerFileID: id,
                title: `貼圖${sticker.stickerPackID}-${id}`,
            },
            config: {
                id: nanoid(),
                isReply: replyMsg.value ? true : false,
                replyObj: replyMsg.value ? { ...replyMsg.value } : "",
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: isOnline.value ? true : false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
                userName: getUserName,
            },
        },
    };
    const stickers = {
        stickerPackID: sticker.stickerPackID,
        stickerUrl: stickerUrl.value,
        ext: sticker.ext,
        stickerFileID: id,
        title: `貼圖${sticker.stickerPackID}-${id}`,
    };
    const sendMsgObj = {
        msg: stickerObj,
        textPlugin: textPlugin.value,
        chatRoomID: chatRoomID.value,
        eventID: route.params.id,
    };
    const isStickerPush = stickerItems.value.some((item) => {
        return item.title === stickers.title;
    });
    if (!isStickerPush) {
        stickerItems.value.push(stickers);
    }

    window.localStorage.setItem("sticker-backend", JSON.stringify(stickerItems.value));
    sendPrivateMsg(sendMsgObj);
    messageList.value.push(stickerObj);
    showStickerModal.value = false;
};

//功能欄開關
const inputFunctionOpen = () => {
    closeAll();
    inputFunctionBoolean.value = true;
    isReplyBox.value = false;
};
const inputFunctionClose = () => {
    closeAll();
    inputFunctionBoolean.value = false;
    isReplyBox.value = false;
};
//更改naive-ui 套件主題
const themeOverrides = {
    common: {},
    Input: {
        caretColor: "black",
        border: "transparent",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};
//刪除訊息談窗提示
const confirmDeletePopup = () => {
    deletePopUp.value = !deletePopUp.value;
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-input-modify {
    width: 100%;
    background-color: $gray-7;
    &.n-input .n-input__border,
    &.n-input .n-input__state-border {
        border: none;
    }
    &.n-input:not(.n-input--disabled):hover .n-input__state-border {
        border: none;
    }
    &.n-input:not(.n-input--disabled).n-input--focus {
        background-color: $gray-7;
    }
    &.n-input:not(.n-input--disabled).n-input--focus .n-input__state-border {
        border: none;
        box-shadow: none;
    }
    &.n-input .n-input__input-el,
    &.n-input .n-input__textarea-el {
        caret-color: $primary-1;
    }
    &.mmsSend .n-input__textarea-el::placeholder {
        /* CSS 3 標準 */
        color: $danger;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.n-card.map {
    width: 70%;
    > .n-card-header {
        padding: 1em;
    }
    .googleMap {
        width: 100%;
        height: 300px;
    }
    > .n-card__content,
    > .n-card__footer {
        padding: 0 1em 1em;
    }
    .shareMap {
        display: flex;
        cursor: pointer;
        &:hover,
        &:focus {
            color: $gray-4;
            .n-icon.icon {
                color: $gray-4 !important;
            }
        }
        .n-icon.icon {
            color: $gray-2 !important;
            margin-left: 4px;
        }
    }
}
@media screen and (max-width: 450px) {
    .n-card.map {
        width: 90%;
    }
}
.card {
    width: 300px;
    > .n-card-header {
        padding: 5px;
    }
}

@media screen and (max-width: 450px) {
    .card {
        width: 70%;
    }
}

.reply {
    width: 100%;
    background-color: $gray-7;
    display: flex;
    cursor: pointer;
    position: absolute;
    bottom: 60px;
    .avatar {
        width: 40px;
        height: 40px;
        margin-left: 20px;
        margin-top: 10px;
    }
    .usertext {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .replyText {
            width: 80%;
            @extend %h4;
            color: $gray-1;
        }
    }
    .closeBtn {
        cursor: pointer;
        img {
            width: 20px;
            height: 20px;
        }
    }
    .img {
        width: 100px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        overflow: hidden;
        margin-right: 10px;
        img {
            height: 100%;
            vertical-align: middle;
        }
    }
}
.inputFunctionBar {
    position: fixed;
    bottom: 60px;
    width: calc(100% - 300px);
    height: 84px;
    background-color: $white;
    display: flex;
    justify-content: space-around;
    box-shadow: -1px -1px 4px rgba(227, 227, 227, 0.5);
    .audio {
        cursor: pointer;
        img {
            width: 60px;
        }
        p {
            text-align: center;
        }
    }
    .file {
        width: 40px;
        padding-top: 15px;
        .upload_cover {
            position: relative;
            height: 69px;
            background-image: url("~@/assets/Images/chatroom/file.svg");
            background-position: center 0;
            background-size: 24px;
            background-repeat: no-repeat;
            text-align: center;
            cursor: pointer;
            display: block;
            .upload_input {
                display: none;
            }
            .upload_icon {
                width: 40px;
                position: absolute;
                @extend %h4;
                cursor: pointer;
                left: 0;
                bottom: 20px;
            }
        }
    }
    .position {
        width: 40px;
        padding-top: 15px;
        cursor: pointer;
        img {
            width: 24px;
            display: block;
            margin: 0 auto;
        }
        p {
            @extend %h4;
            text-align: center;
            margin-top: 8px;
        }
    }
}
@media (max-width: 768px) {
    .inputFunctionBar {
        width: 100%;
    }
}
.input {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    background-color: $white;
    box-shadow: -1px -1px 4px 0 $gray-6;
    .deleteOption {
        height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .cancelBtn {
            color: $gray-4;
            font-size: $font-size-20;
            cursor: pointer;
            display: flex;
            align-items: center;
            &::after {
                content: " ";
                display: inline-block;
                width: 2px;
                height: 25px;
                background-color: $gray-4;
                margin-left: 10px;
                margin-right: 10px;
            }
        }
        .line {
            color: $gray-4;
        }
        .deleteBtn {
            color: $primary-1;
            font-size: $font-size-20;
            cursor: pointer;
        }
    }
    .input-inner {
        box-sizing: border-box;
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        padding: 10px 0px;

        .mmsSend {
            display: block;
            min-width: 60px;
            color: $danger;
            font-weight: bold;
            line-height: 1.2;
        }
        .file-folder {
            display: block;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("~@/assets/Images/chatroom/file.svg");
            background-size: 24px;
            cursor: pointer;
            input {
                opacity: 0;
                box-sizing: border-box;
                border: 12px solid #00a;
                width: 24px;
                height: 24px;
                cursor: pointer;
            }
        }
        @media (max-width: 768px) {
            .file-folder {
                display: none;
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("~@/assets/Images/chatroom/file.svg");
                background-size: 24px;
                cursor: pointer;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 12px solid #00a;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
            }
        }

        .n-button.recorderBtn {
            width: 100%;
            background-color: $gray-8;
            color: $gray-2;
            height: 45px;
            &:not(.n-button--disabled):hover,
            &:not(.n-button--disabled):active {
                color: $gray-1;
                background-color: $gray-6;
            }
            .n-button__border {
                border-color: $gray-8;
            }
            &:not(.n-button--disabled):hover .n-button__state-border {
                border-color: $gray-8;
            }
        }
        .textArea {
            width: 100%;
            padding: 4px;
            border-radius: 30px;
            margin-right: 0;
            margin-left: 7px;
            background-color: $gray-7;
            overflow-x: hidden;
            display: flex;
            justify-content: space-between;
            img {
                margin-right: 5px;
                cursor: pointer;
            }
        }
        .send {
            width: 28px;
            height: 28px;
            &:hover {
                cursor: pointer;
            }
        }
        .recorder {
            display: none;
            width: 28px;
            height: 28px;
            &:hover {
                cursor: pointer;
            }
        }
        @media (max-width: 768px) {
            .send {
                display: block;
                width: 24px;
                height: 24px;
                margin-left: 9px;
            }
            .recorder {
                display: block;
                width: 24px;
                height: 24px;
                margin-left: 9px;
            }
        }
    }
    .stickerArea {
        padding-top: 0;
        padding-bottom: 10px;
        .stickerTabsArea {
            width: 100%;
            height: 55px;
            display: block;
            overflow-x: auto;
            white-space: nowrap;
        }
        .stickerTabs {
            padding-top: 10px;
            padding-bottom: 10px;
            li {
                width: 35px;
                height: 35px;
                overflow: hidden;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &.reload-time {
                    img {
                        width: 25px;
                    }
                }
                img {
                    width: 95%;
                }
                + li {
                    margin-left: 8px;
                }
                &.active {
                    border-radius: 8px;
                    background-color: $primary-3;
                }
            }
        }
        .stickerGroupID {
            width: 100%;
            min-height: 150px;
            max-height: 140px;
            display: block;
            overflow-y: auto;
            .hide {
                display: none;
            }
        }
        .stickerIcon {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 110px;
            cursor: pointer;
            &:active {
                border-radius: 8px;
                background-color: $primary-3;
            }
            img {
                width: 85%;
            }
        }
        @media (max-width: 768px) {
            .stickerIcon {
                width: auto;
                height: auto;
            }
        }
    }
    .audioRecorderArea {
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: center;

        .recorderDescription {
            @extend %h4;
            margin-bottom: 15px;
            color: $gray-1;
        }
        .recorderTime {
            @extend %h1;
            margin-bottom: 15px;
            color: $primary-1;
        }
        .audioMicrophoneDisable {
            width: 80px;
            height: 80px;
            position: relative;
            margin: 0 auto;
            background-color: $gray-7;
            border-radius: 50%;
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .audioMicrophoneEnable {
            width: 80px;
            height: 80px;
            position: relative;
            margin: 0 auto;
            background-color: $primary-3;
            border-radius: 50%;
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
@media (max-width: 768px) {
    .input {
        width: 100%;
    }
}
</style>

<template>
    <!-- 回覆視窗 -->
    <div class="reply" v-if="isReplyBox" @[events].stop="scrollPageTo(replyMsg.janusMsg.config.id)">
        <div class="reply__user-text">
            <div class="reply__text" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">[照片]</div>
            <div class="reply__text" v-if="replyMsg && replyMsg.janusMsg.msgType === 3">[貼圖]</div>
            <n-ellipsis
                v-if="replyMsg && replyMsg.janusMsg.msgContent"
                style="width: 80%"
                class="reply__text"
                :tooltip="false"
            >
                {{ replyMsg.janusMsg.msgContent }}
            </n-ellipsis>
            <div class="reply__img" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">
                <img
                    :src="`${config.fileUrl}${replyMsg.janusMsg.format.Fileid}${replyMsg.janusMsg.format.ExtensionName}`"
                />
            </div>
            <div class="reply__img" v-if="replyMsg && replyMsg.janusMsg.msgType === 3">
                <img
                    :src="`${replyMsg.janusMsg.format.stickerUrl}${replyMsg.janusMsg.format.stickerPackID}/${replyMsg.janusMsg.format.stickerFileID}.${replyMsg.janusMsg.format.ext}`"
                />
            </div>
            <div @[events].stop="replyHide" class="close-btn">
                <img :src="closeIcon" alt="close" />
            </div>
        </div>
    </div>
    <!-- 功能欄視窗 -->
    <div class="input-function" v-if="inputFunctionBoolean">
        <div class="input-function__file">
            <label class="upload-cover">
                <input
                    class="upload-cover__input"
                    type="file"
                    multiple
                    :accept="fileAcceptMP"
                    @change.stop="onUploadFileMP"
                />
                <span class="upload-cover__icon">文件</span>
            </label>
        </div>
        <div class="input-function__position" @[events].stop="handleFindMe()">
            <img :src="mapIcon" alt="map" />
            <p>位置</p>
        </div>
    </div>
    <!-- 捲動時下方有新訊息提示 -->
    <div class="newMsgHint" v-show="newMsgHint" @[events].stop="scrollToBottom()">
        <h1>下方有新信息</h1>
    </div>
    <!-- 使用者輸入框 -->
    <div class="input-bar">
        <div class="input-bar__delete" v-if="deleteBoolean">
            <div class="cancel__button" @[events].stop="deleteBoolean = !deleteBoolean">取消</div>
            <div class="delete__button" @[events].stop="confirmDeletePopup">
                刪除{{ deleteGroup.length > 0 ? `(${deleteGroup.length})` : "" }}
            </div>
        </div>
        <div class="input-bar__inner" v-else>
            <div
                class="attach--open"
                @[events].stop="inputFunctionOpen"
                v-show="!inputFunctionBoolean"
            ></div>
            <div
                class="attach--close"
                @[events].stop="inputFunctionClose"
                v-show="inputFunctionBoolean"
            ></div>
            <span class="camera">
                <input
                    type="file"
                    name="image"
                    :accept="imgfileAccept"
                    capture="user"
                    @change="uploadImage"
                />
            </span>
            <span class="photo">
                <input
                    type="file"
                    name="image"
                    :accept="imgfileAccept"
                    @change="uploadImage"
                    ref="photo"
                />
            </span>

            <span class="file-folder">
                <input type="file" :accept="fileAcceptPC" @change="onUploadFilePC" ref="file" />
            </span>
            <div id="textArea--web" @click.stop="webTextarea" @input.stop="autoHeight">
                <n-input
                    class="n-input--modify"
                    placeholder="Aa"
                    type="textarea"
                    size="small"
                    :autosize="{ minRows: 1 }"
                    v-model:value.trim="msg"
                    @input="focusMsg"
                    @keypress.enter.exact.prevent="addMsg"
                    ref="webinputRef"
                    id="webInput"
                    :autofocus="true"
                >
                </n-input>
                <img
                    @click.stop="closeStickerBox"
                    v-if="showStickerModal"
                    :src="emojiEnabled"
                    alt="表情貼圖"
                />
                <img
                    @click.stop="openStickerBox"
                    v-if="!showStickerModal"
                    :src="emojiIcon"
                    alt="表情貼圖"
                />
            </div>
            <div id="textArea--phone" @[events].stop="phoneTextarea" @input.stop="autoHeight">
                <n-input
                    class="n-input--modify"
                    placeholder="Aa"
                    type="textarea"
                    size="small"
                    :autosize="{ minRows: 1 }"
                    v-model:value.trim="msg"
                    @touchend="closeAll"
                    @input="focusMsg"
                    ref="phoneinputRef"
                    id="phoneInput"
                    :autofocus="true"
                >
                </n-input>

                <img
                    @[events].stop="closeStickerBox"
                    v-if="showStickerModal"
                    :src="emojiEnabled"
                    alt="表情貼圖"
                />
                <img
                    @[events].stop="openStickerBox"
                    v-if="!showStickerModal"
                    :src="emojiIcon"
                    alt="表情貼圖"
                />
            </div>
            <img class="send" :src="sendIcon" alt="傳送訊息" @click.stop="addMsg" v-show="msg" />
            <img
                class="recorder--disabled"
                :src="voiceIconDisabled"
                alt="開啟錄音"
                v-show="!msg && !showRecorderModal"
                @[events].stop="openRecorder()"
            />
            <img
                class="recorder--enabled"
                :src="voiceIconEnabled"
                alt="關閉錄音"
                v-show="!msg && showRecorderModal"
                @[events].stop="closeRecorder()"
            />
        </div>
        <!-- 貼圖視窗 -->
        <div class="sticker" v-show="showStickerModal" @[events].stop="">
            <div class="sticker__tabs">
                <ul class="sticker__ul">
                    <!-- 貼圖列表小圖 -->
                    <li
                        v-if="stickerItems.length > 0"
                        class="reload-time"
                        @[eventsSticker].stop="stickerGroupID == 0 ? '' : handleStickckerGroup(0)"
                        @touchmove.stop="gtouchmove()"
                        @touchend.stop="gtouchend()"
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
                        @[eventsSticker].stop="
                            stickerGroupID == tab.stickerPackID
                                ? ''
                                : handleStickckerGroup(tab.stickerPackID)
                        "
                        @touchmove.stop="gtouchmove()"
                        @touchend.stop="gtouchend()"
                        :class="{
                            active: stickerList.length > 0 && stickerGroupID == tab.stickerPackID,
                        }"
                    >
                        <img :src="`${stickerUrl}${tab.stickerPackID}/tab.${tab.ext}`" alt="小圖" />
                    </li>
                </ul>
            </div>
            <!-- 最近發送貼圖列表 -->
            <div class="sticker__group" v-show="stickerItems.length > 0 && stickerGroupID == 0">
                <n-grid :x-gap="10" :y-gap="10" :cols="4">
                    <!-- @touchend="gtouchend()" -->
                    <n-grid-item
                        v-for="(item, index) in stickerItems"
                        :key="index"
                        @[events].stop="addSticker(item, item.stickerFileID)"
                        @touchmove.stop="gtouchmove()"
                    >
                        <div class="sticker__icon">
                            <img
                                :src="`${item.stickerUrl}${item.stickerPackID}/${item.stickerFileID}.${item.ext}`"
                                :alt="`${item.title}`"
                            />
                        </div>
                    </n-grid-item>
                </n-grid>
            </div>
            <!-- 貼圖列表 -->
            <div
                class="sticker__group"
                v-show="stickerGroupID == stickerGroup.stickerPackID && stickerGroupID != 0"
            >
                <n-grid :x-gap="10" :y-gap="10" :cols="4">
                    <!-- @touchend="gtouchend()" -->
                    <n-grid-item
                        v-for="tab in stickerGroup.stickerList"
                        :key="tab"
                        @[events].stop="addSticker(stickerGroup, tab)"
                        @touchmove.stop="gtouchmove()"
                        :class="{ hide: tab == 'tab' || tab == 'main' }"
                    >
                        <div class="sticker__icon">
                            <img
                                :src="`${stickerUrl}${stickerGroup.stickerPackID}/${tab}.${stickerGroup.ext}`"
                                :alt="`${stickerGroup.stickerPackID}-${tab}`"
                            />
                        </div>
                    </n-grid-item>
                </n-grid>
            </div>
        </div>
        <!-- 錄音視窗 -->
        <div class="recording" v-show="showRecorderModal" @[events].stop="clearRecorder">
            <!--未錄音狀態  -->
            <h1 class="description" v-show="!isRecording">放開即可傳送語音，左右滑動即可取消</h1>
            <div id="audio" class="audio-microphone--disable" v-show="!isRecording">
                <img class="microphone" :src="voiceDisabled" alt="closeVoice" />
            </div>
            <!-- 錄音狀態 -->
            <h1 class="time" v-show="isRecording">{{ recorderTime }}</h1>
            <div class="audio-microphone--enable" v-show="isRecording">
                <img :src="voiceEnabled" alt="open voice" />
            </div>
        </div>

        <!-- google 地圖 -->
        <n-modal class="map" v-model:show="showMapModal" :mask-closable="maskController">
            <n-card title="位置分享" :bordered="false" size="huge">
                <template #header-extra>
                    <span class="shareMap" @[events].stop="shareMap()"
                        >分享
                        <n-icon class="icon" size="20" color="#01bad4">
                            <arrow-redo />
                        </n-icon>
                    </span>
                </template>
                <iframe
                    width="100%"
                    height="100%"
                    style="border: 0"
                    loading="lazy"
                    allowfullscreen
                    :src="`https://www.google.com/maps/embed/v1/place?q=24.9840826,121.5377334&zoom=14&key=AIzaSyA6MSxbFkvRRh_2_JjFrD6lP4GgcWcn98Y`"
                >
                </iframe>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { defineComponent, ref, onMounted, reactive, watchEffect, toRef, nextTick } from "vue";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";
import axios from "axios";
import {
    NConfigProvider,
    NInput,
    NEllipsis,
    NIcon,
    NModal,
    NCard,
    NButton,
    NGrid,
    NGridItem,
} from "naive-ui";
import { MicOutline, ArrowRedo } from "@vicons/ionicons5";
import { storeToRefs } from "pinia";
import Recorder from "js-audio-recorder";
import {} from "googlemaps";
import { GoogleMap, Marker } from "vue3-google-map";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import { txt } from "@/util/interfaceUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import { sendGroupMsg } from "@/util/groupChatUtil";
import { scrollPageTo, localStorageMsg, eventID, chatroomID, convertTime } from "@/util/commonUtil";
import { currentTime, currentDate, unixTime } from "@/util/dateUtil";
import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import closeIcon from "@/assets/Images/chatroom/round-fill_close.svg";
import mapIcon from "@/assets/Images/chatroom/location.svg";
import emojiEnabled from "@/assets/Images/chatroom/emoji-enabled.svg";
import emojiIcon from "@/assets/Images/chatroom/emoji.svg";
import sendIcon from "@/assets/Images/chatroom/send.svg";
import config from "@/config/config";
import voiceIconDisabled from "@/assets/Images/chatroom/voice.svg";
import voiceIconEnabled from "@/assets/Images/chatroom/voice-enabled.svg";
import reloadTimeEnabled from "@/assets/Images/chatroom/reload-time-enabled.svg";
import reloadTimeIcon from "@/assets/Images/chatroom/reload-time.svg";
import voiceDisabled from "@/assets/Images/chatroom/voice-fill-disabled.svg";
import voiceEnabled from "@/assets/Images/chatroom/voice-fill-enabled.svg";
import { isMobile } from "@/util/commonUtil";
import { signature } from "@/util/deviceUtil";

const events = ref(isMobile ? "touchend" : "click");
const eventsSticker = ref(isMobile ? "touchstart" : "click");

// model sotre
const modelStore = useModelStore();
const { closeAll } = modelStore;
const { uploadIsLoading } = storeToRefs(modelStore);

// api store
const apiStore = useApiStore();
const { getSticker } = apiStore;
const {
    isIllegalDevice,
    stickerList,
    stickerUrl,
    eventInfo,
    bugout,
    groupMemberVisitTimeInfoList,
    groupChatReadNum,
    chatroomType,
} = storeToRefs(apiStore);
//store
const chatStore = useChatStore();
const { replyHide, confirmDelete, handleStickckerGroup, scrollToBottom, saveGroupReadNum } =
    chatStore;
const {
    messages,
    pictures,
    msg,
    isReplyBox,
    replyMsg,
    webinputVal,
    phoneinputVal,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    inputFunctionBoolean,
    textPlugin,
    showRecorderModal,
    showStickerModal,
    stickerGroupID,
    stickerGroup,
    stickerItems,
    participantList,
    isOnline,
    userMediaMicrophone,
    janus,
    newMsgHint,
    findScrollHeight,
    chatroomScrolltop,
    chatroomWindowHeight,
    chatroomScrolltopAndWindowHeight,
    chatroomScrollHeight,
    groupReadNum,
    groupReadList
} = storeToRefs(chatStore);
//router
const route = useRoute();
// input 框
const webinputRef: any = ref(null);
const phoneinputRef: any = ref(null);
let isWebTextarea = ref(false);
const phoneTextarea = () => {
    console.log("我是手機版input");
    isWebTextarea.value = false;
    // window.location.reload();
};
const webTextarea = () => {
    console.log("我是電腦版input");
    isWebTextarea.value = true;
    // window.location.reload();
};
onMounted(() => {
    webinputRef.value.blur();
    phoneinputRef.value.blur();
    // android 適用
    webinputVal.value = webinputRef.value;
    phoneinputVal.value = phoneinputRef.value;
});

// 圖片可上傳檔案類型
const imgfileAccept = "image/png, image/jpeg, image/gif";
// PC可上傳檔案類型
const fileAcceptPC =
    "image/png, image/jpeg, image/gif, text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";
// MP可上傳檔案類型
const fileAcceptMP =
    "text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";

// 地圖定位
const showMapModal = ref(false);
const latitude = ref();
const longitude = ref();
const maskController = ref(false);
const handleFindMe = () => {
    maskController.value = false;
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
    showMapModal.value = true;
    setTimeout(() => {
        maskController.value = true;
    }, 500);
    console.log("Your current position is:");
    console.log("position : ", position);
    console.log("Latitude : " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
    console.log("More or less " + position.coords.accuracy + " meters.");

    // 獲取地址資料api, 目前需要獲取付費憑證
    // axios({
    //     method: "get",
    //     url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude.value},${longitude.value}&language=zh-TW&key=AIzaSyAx5g4E7tKTC_Q-ycGlbDMBH5UDOqa7-aY`,
    //     // headers: { Authorization: `Bearer ${signature}` },
    // })
    //     .then((res) => {
    //         console.log("google geocode res:", res);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
};
const errorCallback = (error: any) => {
    console.log("navigator.geolocation error:", error.message);
    alert("您已將位置權限關閉,請將位置權限設為允許");
    showMapModal.value = false;
};

const shareMap = () => {
    showMapModal.value = false;
    let mapObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.params.eventKey),
            eventID: Number(eventID(route.params.eventKey)),
            msgType: 8,
            sender: 1, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
            userName: "",
            format: {
                Longitude: longitude.value,
                Latitude: latitude.value,
                LocateTime: new Date(),
                LocateSource: 0,
            },
            config: {
                id: nanoid(),
                isReply: false,
                replyObj: {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
                deliveryStatusSuccess: true,
            },
        },
    };

    const sendMsgObj = {
        msg: mapObj,
        textPlugin: textPlugin.value,
        eventKey: route.params.eventKey,
        msgParticipantList: participantList.value,
        eventID: Number(eventID(route.params.eventKey)),
    };

    //一般訊息
    if (chatroomType.value === 0) {
        //一般訊息
        sendPrivateMsg(sendMsgObj);
    } else {
        //群聊訊息
        sendGroupMsg(sendMsgObj);
    }
};

// 錄音
const recorder: any = ref(null);
//是否錄音
const isRecording = ref(false);
//音檔長度
const duration = ref(0);
const recorderTime = ref("00:00");
//座標
const isClock = ref(false);
const posStart = ref(0) as any;

//開啟錄音視窗並詢問
const openRecorder = () => {
    showRecorderModal.value = true;
    inputFunctionBoolean.value = false;
    showStickerModal.value = false;
    if (chatroomScrolltopAndWindowHeight.value < chatroomScrollHeight.value - 30) {
        console.log("不置底");
    } else {
        console.log("置底");
        nextTick(() => {
            findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
        });
    }
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
            userMediaMicrophone.value = stream;
            console.log("userMicrophone", userMediaMicrophone.value);
            console.log("You let me use your mic!");
        })
        .catch(function (err) {
            console.log("No mic for you !");
            console.log("errMsg:", err.name + ":" + err.message);
            showRecorderModal.value = false;
        });
};
//關閉錄音視窗
const closeRecorder = () => {
    showRecorderModal.value = false;
    inputFunctionBoolean.value = false;
    userMediaMicrophone.value.getTracks().forEach((track) => track.stop());
    console.log("userMicrophone", userMediaMicrophone.value);
    recorder.value.stop();
};

onMounted(() => {
    const all = document.querySelector(".all") as any;
    const recordArea = document.querySelector("#audio") as any;
    const microphone = document.querySelector(".microphone");
    const phoneInput = document.getElementById("phoneInput");
    const webInput = document.getElementById("webInput");

    recordArea.addEventListener("touchstart", (e: any) => {
        e.stopPropagation();
        e.preventDefault(); //
        isClock.value = true;
        posStart.value = e.touches[0]; //獲取起點坐標
        // console.log("posStart X:", posStart.value.clientX);
        // console.log("posStart Y:", posStart.value.clientY);
        startRecorder(e);
    });
    recordArea.addEventListener("touchmove", (e: any) => {
        e.stopPropagation();
        const pon = 30; //外框界線
        const xPon = Math.abs(e.touches[e.touches.length - 1].clientX - posStart.value.clientX);
        const yPon = Math.abs(e.touches[e.touches.length - 1].clientY - posStart.value.clientY);

        // console.log("x 軸", xPon);
        // console.log("y 軸", yPon);
        if (
            (xPon > pon && yPon > pon) ||
            (xPon < pon && yPon > pon) ||
            (xPon > pon && yPon < pon)
        ) {
            isClock.value = false;
        } else {
            isClock.value = true;
        }
    });
    recordArea.addEventListener("touchend", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        if (isClock.value == true && recorderTime.value !== "0:00") {
            stopRecorder(e);
            console.log("送出錄音");
        } else if (recorderTime.value === "0:00") {
            stopClRecorder(e);
            console.log("秒數過短 取消錄音");
        } else {
            stopClRecorder(e);
            console.log("取消錄音");
        }
    });
});

// 開始錄音
const startRecorder = (e: any) => {
    isRecording.value = true;
    recorderTime.value = "0:00";
    console.log("開始錄音");
    clearRecorder();
    const config = {
        // 采樣位數，支持 8 或 16默認是16
        sampleBits: 16,
        // 采樣率，支持 11025、16000、22050、24000、44100、48000，根據瀏覽器默認直
        sampleRate: 48000,
        // 聲道，支持 1 或 2， 默認是1
        numChannels: 1,
        // 是否邊錄邊轉換，默認是false
        compiling: true,
    };
    if (!recorder.value) {
        recorder.value = new Recorder(config);
        // console.log("recorder", recorder.value);
        recorder.value.onprogress = (params: any) => {
            duration.value = params.duration;
            recorderTime.value = convertTime(duration.value);
            // console.log("錄音 params:", params);
            console.log("錄音時長(秒)", duration.value);
            // console.log("錄音大小(字節)", params.fileSize);
            // console.log("錄音音量百分比(%)", params.vol);
        };
    } else {
        recorder.value.stop();
        console.log("停止");
    }
    recorder.value
        .start()
        .then(() => {
            console.log("開錄音");
        })
        .catch((error: any) => {
            console.log(`異常了,${error.name}:${error.message}`);
            // alert(`異常了,未找到設備`);
            alert(`請開啟您的瀏覽器麥克風權限`);
            isRecording.value = false;
            isClock.value = false;
        });
};
//失敗銷毀錄音並重置
const stopClRecorder = (e: any) => {
    e.preventDefault();
    isRecording.value = false;
    isClock.value = false;
    userMediaMicrophone.value.getTracks().forEach((track) => track.stop());
    recorder.value.stream.getTracks().forEach((track) => track.stop());
    recorder.value.stop();
    recorder.value.destroy().then(function () {
        recorder.value = null;
    });
    isRecording.value = false;
    recorderTime.value = "0:00";
};
//完成錄音並送出
const stopRecorder = (e: any) => {
    e.preventDefault();
    isRecording.value = false;
    console.log("結束錄音");
    userMediaMicrophone.value.getTracks().forEach((track) => track.stop());
    recorder.value.stream.getTracks().forEach((track) => track.stop());
    recorder.value.stop();
    const audioFile = recorder.value.getWAVBlob();
    const fd = new FormData();
    fd.append(
        "file",
        new File([audioFile], `record_${audioFile.size}.wav`, { type: audioFile.type })
    );

    axios({
        method: "post",
        url: `${config.serverUrl}/file/${route.params.eventKey}`,
        data: fd,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res) => {
            console.log("audio:", res);
            let audioObj: any = {};
            audioObj = {
                janusMsg: {
                    chatroomID: chatroomID(route.params.eventKey),
                    eventID: Number(eventID(route.params.eventKey)),
                    msgType: 5,
                    sender: 1, // 0:客服, 1:使用者
                    msgContent: "",
                    time: unixTime(),
                    type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                    userName: "",
                    format: {
                        Fileid: res.data.fileid,
                        ShowName: `record_${audioFile.size}`,
                        ExtensionName: ".wav",
                        Description: "",
                        FileSize: audioFile.size,
                        SoundLength: duration.value,
                        expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                    },
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: {},
                        currentDate: currentDate(),
                        isExpire: false,
                        isPlay: false,
                        isRead: false,
                        msgFunctionStatus: false,
                        msgMoreStatus: false,
                        recallPopUp: false,
                        recallStatus: false,
                        deliveryStatusSuccess: true,
                    },
                },
            };

            const sendMsgObj = {
                msg: audioObj,
                textPlugin: textPlugin.value,
                eventKey: route.params.eventKey,
                msgParticipantList: participantList.value,
                eventID: Number(eventID(route.params.eventKey)),
            };
            if (chatroomType.value === 0) {
                //一般訊息
                sendPrivateMsg(sendMsgObj);
            } else {
                //群聊訊息
                sendGroupMsg(sendMsgObj);
            }
        })
        .catch((err) => {
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
            bugout.value.error(
                `error-log${route.params.eventKey}`,
                err.response.request.responseURL
            );
            console.error(err);
        });
};
// 清除recorder
const clearRecorder = () => {
    recorder.value = null;
};
// 發出多行文字訊息,輸入框跳回原來大小
const focusMsg = () => {
    const textArea = document.getElementById("textArea--phone");
    const str = msg.value.trim();
    if (str !== "") {
        textArea.classList.remove("small");
    }
    showRecorderModal.value = false;
    inputFunctionBoolean.value = false;
    showStickerModal.value = false;
};

// const autoHeight = () => {
//     const textArea = document.getElementById("textArea--phone");
//     textArea.style.height = 'auto';
//     textArea.style.padding = '0';
//     textArea.scrollTop = 0; //防抖动
//     textArea.style.height = textArea.scrollHeight + 'px';
// };
// 更新群組聊天成員的已讀數
const updateGroupMemberReadStatus = (groupList, participantList) => {
    nextTick(() => {
        let myGroupReadNum = 0;
        // 自定義participantList結構
        const tmpParticipantList = [];
        // 監聽watch傳進來的的now
        if (Array.isArray(participantList)) {
            for (const participant of participantList) {
                const data = {};
                data['id'] = participant;
                data['onlineTime'] = parseInt((Date.now() / 1000).toFixed(0));
                data['isRead'] = false;
                data['isMySelf'] = false;
                tmpParticipantList.push(data);
            }
        } else if (typeof participantList === 'object') {
            for (const participant of participantList.value) {
                const data = {};
                data['id'] = participant;
                data['onlineTime'] = parseInt((Date.now() / 1000).toFixed(0));
                data['isRead'] = false;
                data['isMySelf'] = false;
                tmpParticipantList.push(data);
            }
        }
        // 標記
        for (let i = 0; i < groupList.value.length; i++) {
            for (let j = 0; j < tmpParticipantList.length; j++) {
                if (groupList.value[i].id === tmpParticipantList[j].id
                    && groupList.value[i]["onlineTime"] < tmpParticipantList[j].onlineTime) {
                        tmpParticipantList[j].isRead = true;                }
                if (tmpParticipantList[j].id === chatroomID(route.params.eventKey)) {
                    tmpParticipantList[j].isMySelf = true;
                }
            }
        }
        // deepCopy
        const myParticipantList = [];
        for (const item of tmpParticipantList) {
            myParticipantList.push(JSON.parse(JSON.stringify(item)));
        }
        // 確認存儲已讀清單與已讀數
        for (const item of myParticipantList) {
            groupReadList.value = myParticipantList;
            if (item.isRead && !item.isMySelf) {
                // 群聊已讀數
                myGroupReadNum += 1;
            }
        }

        console.log('cc端群聊參與者: ', myParticipantList);
        console.log("cc端群聊已讀數(扣掉自己):" + (myGroupReadNum));
        groupReadNum.value = myGroupReadNum;
        
    });
};
//發送訊息
const addMsg = async (): void => {
    const str = msg.value.trim();
    let textObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.params.eventKey),
            eventID: Number(eventID(route.params.eventKey)),
            msgType: 1,
            sender: 1, // 0:客服, 1:使用者
            msgContent: str,
            time: unixTime(),
            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
            userName: "",
            format: {},
            config: {
                id: nanoid(),
                isReply: replyMsg.value ? true : false,
                replyObj: replyMsg.value || {},
                currentDate: currentDate(),
                isLink: false,
                isExpire: false,
                isPlay: false,
                isRead: false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
                deliveryStatusSuccess: true,
                groupReadNum: groupReadNum.value,
                groupReadList: groupReadList.value
            },
        },
    };
    // 判斷文字訊息是否為url 抓取metaData
    const reg =
        /(((^[h|H][t|T][t|T][p|P][s|S]?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
    if (reg.test(str)) {
        console.log("判斷此文字訊息 為link");
        msg.value = null;
        const fd = new FormData();
        fd.append("url", str);
        await axios({
            method: "post",
            url: `${config.serverUrl}/metadata/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("預覽 連結 res", res);
                textObj.janusMsg.config.isLink = true;
                textObj.janusMsg.format.metaTitle = res.data.title;
                textObj.janusMsg.format.metaDescription = res.data.des;
                textObj.janusMsg.format.metaImgurl = res.data.image;
            })
            .catch((err) => {
                console.log("預覽 連結 err", err);
            });
    }
    // 發送訊息給 janus server
    if (str !== "") {
        const sendMsgObj = {
            msg: textObj,
            textPlugin: textPlugin.value,
            eventKey: route.params.eventKey,
            msgParticipantList: participantList.value,
            eventID: Number(eventID(route.params.eventKey)),
        };
        if (chatroomType.value === 0) {
            //一般訊息
            console.log("單聊參與者: " + participantList.value);
            sendPrivateMsg(sendMsgObj);
        } else {
            // 群聊參與者
            console.log("串串群聊參與者: " + participantList.value);
            updateGroupMemberReadStatus(groupMemberVisitTimeInfoList, participantList);
            sendGroupMsg(sendMsgObj);
        }
    }

    // 送出後清除 msg 及 replyMsg
    msg.value = null;
    replyHide();
    const textArea = document.getElementById("textArea--phone");
    textArea.classList.add("small");
    // 傳送後，輸入框的高度差置為0
    chatStore.backToTheOrigialDiffHeight();
};

//手機板發送圖片
const photo = ref(null);
const image = ref();
const imageReload = ref(0);
const uploadImage = async (e: any) => {
    uploadIsLoading.value = true;
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    if (fileName.split(".").pop() === "gif") {
        console.log("gif 圖檔");
        const fd = new FormData();
        // console.log("file.name:", file);
        fd.append("file", new File([file], file.name, { type: "image/*" }));
        await axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("img res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async (e: any) => {
                    let image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        const imageObj = {
                            janusMsg: {
                                chatroomID: chatroomID(route.params.eventKey),
                                eventID: Number(eventID(route.params.eventKey)),
                                msgType: 6,
                                sender: 1, // 0:客服, 1:使用者
                                msgContent: "",
                                time: unixTime(),
                                type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                userName: "",
                                format: {
                                    Fileid: res.data.fileid,
                                    ShowName: fileName,
                                    ExtensionName: res.data.ext,
                                    FileSize: file.size,
                                    width: image.width,
                                    height: image.height,
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                                config: {
                                    id: nanoid(),
                                    isReply: replyMsg.value ? true : false,
                                    replyObj: replyMsg.value || {},
                                    currentDate: currentDate(),
                                    isExpire: false,
                                    isPlay: false,
                                    isRead: false,
                                    msgFunctionStatus: false,
                                    msgMoreStatus: false,
                                    recallPopUp: false,
                                    recallStatus: false,
                                    deliveryStatusSuccess: true,
                                },
                            },
                        };

                        const sendMsgObj = {
                            msg: imageObj,
                            textPlugin: textPlugin.value,
                            eventKey: route.params.eventKey,
                            msgParticipantList: participantList.value,
                            eventID: Number(eventID(route.params.eventKey)),
                        };
                        if (chatroomType.value === 0) {
                            //一般訊息
                            sendPrivateMsg(sendMsgObj);
                        } else {
                            //群聊訊息
                            sendGroupMsg(sendMsgObj);
                        }

                        // 確認圖片是否放至伺服器;
                        // await axios({
                        //     method: "get",
                        //     url: `${config.fileUrl}${imageObj.janusMsg.format.Fileid}${imageObj.janusMsg.format.ExtensionName}`,
                        // })
                        //     .then((res) => {})
                        //     .catch((err) => {
                        //         console.error("圖片尚未放至伺服器 ", err);
                        //         if (imageReload.value < 4) {
                        //             imageReload.value++;
                        //             onUploadFile(file);
                        //         }
                        //     });
                    };
                };
            })
            .catch((err) => {
                alert(`上傳圖片失敗,錯誤訊息:${err.response}!!!`);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                bugout.value.error(
                    `error-log${route.params.eventKey}`,
                    err.response.request.responseURL
                );
                console.error(err);
            });
    } else {
        //壓縮圖片套件 compressor js
        console.log("圖檔 但不是gif!!");
        new Compressor(file, {
            quality: 0.6,
            async success(result) {
                //呼叫api
                const fd = new FormData();
                // console.log("file.name:", file);
                fd.append("file", new File([result], file.name, { type: "image/*" }));
                await axios({
                    method: "post",
                    url: `${config.serverUrl}/file/${route.params.eventKey}`,
                    data: fd,
                    headers: { Authorization: `Bearer ${signature}` },
                })
                    .then((res) => {
                        console.log("img res:", res);
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = async (e: any) => {
                            let image = new Image();
                            image.src = e.target.result;
                            image.onload = function () {
                                const imageObj = {
                                    janusMsg: {
                                        chatroomID: chatroomID(route.params.eventKey),
                                        eventID: Number(eventID(route.params.eventKey)),
                                        msgType: 6,
                                        sender: 1, // 0:客服, 1:使用者
                                        msgContent: "",
                                        time: unixTime(),
                                        type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                        userName: "",
                                        format: {
                                            Fileid: res.data.fileid,
                                            ShowName: fileName,
                                            ExtensionName: res.data.ext,
                                            FileSize: file.size,
                                            width: image.width,
                                            height: image.height,
                                            expirationDate: dayjs
                                                .unix(res.data.exp)
                                                .format("YYYY-MM-DD"),
                                        },
                                        config: {
                                            id: nanoid(),
                                            isReply: replyMsg.value ? true : false,
                                            replyObj: replyMsg.value || {},
                                            currentDate: currentDate(),
                                            isExpire: false,
                                            isPlay: false,
                                            isRead: false,
                                            msgFunctionStatus: false,
                                            msgMoreStatus: false,
                                            recallPopUp: false,
                                            recallStatus: false,
                                            deliveryStatusSuccess: true,
                                        },
                                    },
                                };

                                const sendMsgObj = {
                                    msg: imageObj,
                                    textPlugin: textPlugin.value,
                                    eventKey: route.params.eventKey,
                                    msgParticipantList: participantList.value,
                                    eventID: Number(eventID(route.params.eventKey)),
                                };
                                if (chatroomType.value === 0) {
                                    //一般訊息
                                    sendPrivateMsg(sendMsgObj);
                                } else {
                                    //群聊訊息
                                    sendGroupMsg(sendMsgObj);
                                }

                                // 確認圖片是否放至伺服器;
                                // await axios({
                                //     method: "get",
                                //     url: `${config.fileUrl}${imageObj.janusMsg.format.Fileid}${imageObj.janusMsg.format.ExtensionName}`,
                                // })
                                //     .then((res) => {})
                                //     .catch((err) => {
                                //         console.error("圖片尚未放至伺服器 ", err);
                                //         if (imageReload.value < 4) {
                                //             imageReload.value++;
                                //             onUploadFile(file);
                                //         }
                                //     });
                            };
                        };
                    })
                    .catch((err) => {
                        alert(`上傳圖片失敗,錯誤訊息:${err.response}!!!`);
                        bugout.value.error(
                            `error-log${route.params.eventKey}`,
                            err.response.status
                        );
                        bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                        bugout.value.error(
                            `error-log${route.params.eventKey}`,
                            err.response.request.responseURL
                        );
                        console.error(err);
                    });
            },
            error(err) {
                console.error(err);
            },
        });
    }
    photo.value.value = null;
};

//上傳
const file = ref(null);
const files = ref();
const onUploadFilePC = async (e: any) => {
    uploadIsLoading.value = true;
    inputFunctionBoolean.value = false;
    const fileArr = e.target.files[0];
    const fileArrType = e.target.files[0].type;
    const fileName = fileArr.name;
    if (!fileArr) {
        return;
    }
    //辨識上傳檔案
    if (fileArrType.includes("image")) {
        if (fileName.split(".").pop() === "gif") {
            // console.log("gif 圖檔!!!");
            const fd = new FormData();
            // console.log("file.name:", fileArr);
            fd.append("file", new File([fileArr], fileArr.name, { type: "image/*" }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/file/${route.params.eventKey}`,
                data: fd,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    // console.log("img res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(fileArr);
                    reader.onload = async (e: any) => {
                        let image = new Image();
                        image.src = e.target.result;
                        image.onload = function () {
                            const imageObj: any = {
                                janusMsg: {
                                    chatroomID: chatroomID(route.params.eventKey),
                                    eventID: Number(eventID(route.params.eventKey)),
                                    msgType: 6,
                                    sender: 1, // 0:客服, 1:使用者
                                    msgContent: "",
                                    time: unixTime(),
                                    type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                    userName: "",
                                    format: {
                                        Fileid: res.data.fileid,
                                        ShowName: fileName,
                                        ExtensionName: res.data.ext,
                                        FileSize: fileArr.size,
                                        width: image.width,
                                        height: image.height,
                                        expirationDate: dayjs
                                            .unix(res.data.exp)
                                            .format("YYYY-MM-DD"),
                                    },
                                    config: {
                                        id: nanoid(),
                                        isReply: replyMsg.value ? true : false,
                                        replyObj: replyMsg.value || {},
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                        deliveryStatusSuccess: true,
                                    },
                                },
                            };
                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                eventKey: route.params.eventKey,
                                msgParticipantList: participantList.value,
                                eventID: Number(eventID(route.params.eventKey)),
                            };
                            if (chatroomType.value === 0) {
                                //一般訊息
                                sendPrivateMsg(sendMsgObj);
                            } else {
                                //群聊訊息
                                sendGroupMsg(sendMsgObj);
                            }
                        };
                    };
                })
                .catch((err) => {
                    alert(`上傳圖片失敗,錯誤訊息:${err.response}!!!`);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                    bugout.value.error(
                        `error-log${route.params.eventKey}`,
                        err.response.request.responseURL
                    );
                    console.error(err);
                });
        } else {
            // console.log("圖檔非gif!!!");
            new Compressor(fileArr, {
                quality: 0.6,
                async success(result) {
                    //呼叫api
                    const fd = new FormData();
                    console.log("file.name:", fileArr);
                    fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                    await axios({
                        method: "post",
                        url: `${config.serverUrl}/file/${route.params.eventKey}`,
                        data: fd,
                        headers: { Authorization: `Bearer ${signature}` },
                    })
                        .then((res) => {
                            // console.log("img res:", res);
                            const reader = new FileReader();
                            reader.readAsDataURL(fileArr);
                            reader.onload = async (e: any) => {
                                let image = new Image();
                                image.src = e.target.result;
                                image.onload = function () {
                                    const imageObj: any = {
                                        janusMsg: {
                                            chatroomID: chatroomID(route.params.eventKey),
                                            eventID: Number(eventID(route.params.eventKey)),
                                            msgType: 6,
                                            sender: 1, // 0:客服, 1:使用者
                                            msgContent: "",
                                            time: unixTime(),
                                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                            userName: "",
                                            format: {
                                                Fileid: res.data.fileid,
                                                ShowName: fileName,
                                                ExtensionName: res.data.ext,
                                                FileSize: fileArr.size,
                                                width: image.width,
                                                height: image.height,
                                                expirationDate: dayjs
                                                    .unix(res.data.exp)
                                                    .format("YYYY-MM-DD"),
                                            },
                                            config: {
                                                id: nanoid(),
                                                isReply: replyMsg.value ? true : false,
                                                replyObj: replyMsg.value || {},
                                                currentDate: currentDate(),
                                                isExpire: false,
                                                isPlay: false,
                                                isRead: false,
                                                msgFunctionStatus: false,
                                                msgMoreStatus: false,
                                                recallPopUp: false,
                                                recallStatus: false,
                                                deliveryStatusSuccess: true,
                                            },
                                        },
                                    };
                                    const sendMsgObj = {
                                        msg: imageObj,
                                        textPlugin: textPlugin.value,
                                        eventKey: route.params.eventKey,
                                        msgParticipantList: participantList.value,
                                        eventID: Number(eventID(route.params.eventKey)),
                                    };
                                    if (chatroomType.value === 0) {
                                        //一般訊息
                                        sendPrivateMsg(sendMsgObj);
                                    } else {
                                        //群聊訊息
                                        sendGroupMsg(sendMsgObj);
                                    }
                                };
                            };
                        })
                        .catch((err) => {
                            alert(`上傳圖片失敗,錯誤訊息:${err.response}!!!`);
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.status
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.data
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.request.responseURL
                            );
                            console.error(err);
                        });
                },
                error(err) {
                    console.error(err);
                },
            });
        }
    } else {
        //一般檔案
        const fd = new FormData();
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));
        await axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("上傳 res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;

                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            chatroomID: chatroomID(route.params.eventKey),
                            eventID: Number(eventID(route.params.eventKey)),
                            msgType: 7,
                            sender: 1, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                            userName: "",
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
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                                deliveryStatusSuccess: true,
                            },
                        },
                    };

                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        eventKey: route.params.eventKey,
                        msgParticipantList: participantList.value,
                        eventID: Number(eventID(route.params.eventKey)),
                    };
                    if (chatroomType.value === 0) {
                        //一般訊息
                        sendPrivateMsg(sendMsgObj);
                    } else {
                        //群聊訊息
                        sendGroupMsg(sendMsgObj);
                    }
                };
            })
            .catch((err) => {
                alert(`上傳檔案失敗,錯誤訊息:${err.response}!!!`);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                bugout.value.error(
                    `error-log${route.params.eventKey}`,
                    err.response.request.responseURL
                );
                console.error(err);
            });
    }
    file.value.value = null;
};
//上傳文件
const onUploadFileMP = async (e: any) => {
    uploadIsLoading.value = true;
    inputFunctionBoolean.value = false;
    const fileArr = e.target.files[0];
    console.log("fireArr", fileArr);
    if (!fileArr) return;
    //傳影片
    if (fileArr.type.includes("video")) {
        const fd = new FormData();
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));
        await axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("上傳檔案 res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;
                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            chatroomID: chatroomID(route.params.eventKey),
                            eventID: Number(eventID(route.params.eventKey)),
                            msgType: 11,
                            sender: 1, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                            userName: "",
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
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                                deliveryStatusSuccess: true,
                            },
                        },
                    };

                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        eventKey: route.params.eventKey,
                        msgParticipantList: participantList.value,
                        eventID: Number(eventID(route.params.eventKey)),
                    };
                    if (chatroomType.value === 0) {
                        //一般訊息
                        sendPrivateMsg(sendMsgObj);
                    } else {
                        //群聊訊息
                        sendGroupMsg(sendMsgObj);
                    }
                };
            })
            .catch((err) => {
                console.error(err);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                bugout.value.error(
                    `error-log${route.params.eventKey}`,
                    err.response.request.responseURL
                );
                alert(`檔案上傳錯誤,錯誤訊息為${err.response}`);
            });
    } else {
        //傳文件或圖片
        const fd = new FormData();
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));
        await axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("上傳檔案 res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;
                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            chatroomID: chatroomID(route.params.eventKey),
                            eventID: Number(eventID(route.params.eventKey)),
                            msgType: 7,
                            sender: 1, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                            userName: "",
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
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                                deliveryStatusSuccess: true,
                            },
                        },
                    };

                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        eventKey: route.params.eventKey,
                        msgParticipantList: participantList.value,
                        eventID: Number(eventID(route.params.eventKey)),
                    };
                    if (chatroomType.value === 0) {
                        //一般訊息
                        sendPrivateMsg(sendMsgObj);
                    } else {
                        //群聊訊息
                        sendGroupMsg(sendMsgObj);
                    }
                };
            })
            .catch((err) => {
                console.error(err);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                bugout.value.error(
                    `error-log${route.params.eventKey}`,
                    err.response.request.responseURL
                );
                alert(`檔案上傳錯誤,錯誤訊息為${err.response}`);
            });
    }
};
// 貼圖功能

const openStickerBox = () => {
    showRecorderModal.value = false;
    showStickerModal.value = true;
    if (chatroomScrolltopAndWindowHeight.value < chatroomScrollHeight.value - 30) {
        console.log("不置底");
    } else {
        console.log("置底");
        nextTick(() => {
            findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
        });
    }
};

const closeStickerBox = () => {
    showStickerModal.value = false;
};

const timeOutEvent = ref(0);

//開始按
// const gtouchstart = (msg: txt) => {
//     timeOutEvent.value = setTimeout(function () {
//         longPress(msg);
//         console.log("長按");
//     }, 500);
//     return false;
// };

//手釋放，如果在500毫秒内就釋放，則取消長按事件，此时可以執行onclick執行事件
const gtouchend = () => {
    clearInterval(timeOutEvent.value);
    if (timeOutEvent.value != 0) {
        console.log("點擊");
    }
    return false;
};

const isMove = ref(false);
//如果手指有移動，則取消所有事件，此时說名用户只是要移動而不是長按
const gtouchmove = () => {
    // clearTimeout(timeOutEvent.value); //清除定时器
    isMove.value = true;
    // timeOutEvent.value = 0;
};

const addSticker = (sticker, id) => {
    console.log("送出貼圖");
    if (isMove.value === false) {
        let stickerObj: any = {
            janusMsg: {
                chatroomID: chatroomID(route.params.eventKey),
                eventID: Number(eventID(route.params.eventKey)),
                msgType: 3,
                sender: 1, // 0:客服, 1:使用者
                msgContent: "",
                time: unixTime(),
                type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                userName: "",
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
                    replyObj: replyMsg.value || {},
                    currentDate: currentDate(),
                    isExpire: false,
                    isPlay: false,
                    isRead: false,
                    msgFunctionStatus: false,
                    msgMoreStatus: false,
                    recallPopUp: false,
                    recallStatus: false,
                    deliveryStatusSuccess: true,
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
            eventKey: route.params.eventKey,
            msgParticipantList: participantList.value,
            eventID: Number(eventID(route.params.eventKey)),
        };
        const isStickerPush = stickerItems.value.some((item) => {
            return item.title === stickers.title;
        });
        if (!isStickerPush) {
            stickerItems.value.push(stickers);
        }

        window.localStorage.setItem("sticker", JSON.stringify(stickerItems.value));
        if (chatroomType.value === 0) {
            //一般訊息
            sendPrivateMsg(sendMsgObj);
        } else {
            //群聊訊息
            sendGroupMsg(sendMsgObj);
        }
    } else {
        isMove.value = false;
    }
    return false;
};

//功能欄開關
const inputFunctionOpen = () => {
    // closeAll();
    inputFunctionBoolean.value = true;
    isReplyBox.value = false;
};
const inputFunctionClose = () => {
    // closeAll();
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
watchEffect(() => {
    messages.value;
});
//
const autoHeight = () => {
    let initHeight = 30;
    let diffHeight = 0;
    if (!isWebTextarea.value) {
        if (phoneInput.offsetHeight >= 30 && phoneInput.offsetHeight <= 120) {
            const height = Math.abs(phoneInput.offsetHeight - initHeight);
            if (height !== 90) {
                diffHeight = height;
            } else {
                diffHeight = 89;
            }
        } else {
            diffHeight = 0;
        }
        chatStore.setDiffHeight(diffHeight);
        if (chatroomScrolltopAndWindowHeight.value < chatroomScrollHeight.value - 30) {
            console.log("不置底");
        } else {
            console.log("置底");
            nextTick(() => {
                findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
            });
        }
        // nextTick(() => {
        //     findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
        // });
        console.log("手機版 test_kkk: ", chatStore.diffHeight);
    } else {
        if (webInput.offsetHeight >= 30 && webInput.offsetHeight <= 120) {
            const height = Math.abs(webInput.offsetHeight - initHeight);
            if (height !== 90) {
                diffHeight = height;
            } else {
                diffHeight = 89;
            }
        } else {
            diffHeight = 0;
        }
        chatStore.setDiffHeight(diffHeight);
        if (chatroomScrolltopAndWindowHeight.value < chatroomScrollHeight.value - 30) {
            console.log("不置底");
        } else {
            console.log("置底");
            nextTick(() => {
                findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
            });
        }
        // nextTick(() => {
        //     findScrollHeight.value.scrollTop = findScrollHeight.value.scrollHeight;
        // });
        console.log("電腦版 test_kkk: ", chatStore.diffHeight);
    }
};

onMounted(() => {
    msg.value = "";
    chatStore.backToTheOrigialDiffHeight();
});
// 解決第1次為0的問題
onMounted(() => {
    setInterval(() => {
        setTimeout(() => {
            updateGroupMemberReadStatus(groupMemberVisitTimeInfoList, participantList);
        }, 0);
    }, 10000);
});
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-input--modify {
    width: 100%;
    background-color: $gray-7;
    &.n-input,
    &.n-input .n-input-wrapper,
    &.n-input.n-input--textarea .n-input__textarea-mirror,
    &.n-input .n-input__input,
    &.n-input .n-input__textarea {
        min-height: 30px !important;
        max-height: 120px !important;
    }
    &.n-input .n-input__border,
    &.n-input .n-input__state-border {
        border: none;
        min-height: 30px !important;
        max-height: 120px !important;
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
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.close-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    img {
        width: 20px;
        height: 20px;
    }
}

.n-card.map {
    width: 70%;
    > .n-card-header {
        padding: 1em;
    }
    > .n-card__content,
    > .n-card__footer {
        padding: 0 1em 1em;
    }
}

@media screen and (max-width: 450px) {
    .n-card.map {
        width: 90%;
    }
}

.googleMap {
    width: 100%;
    height: 300px;
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

#textArea {
    &--web {
        width: 100%;
        padding: 4px;
        border-radius: 30px;
        margin-right: 0;
        margin-left: 7px;
        background-color: $gray-7;
        overflow-x: hidden;
        display: flex;
        justify-content: space-between;
        &.small {
            // height: 38px;
            height: auto;
            overflow: hidden;
        }
        img {
            margin-right: 5px;
            cursor: pointer;
        }
    }

    &--phone {
        width: 100%;
        padding: 4px;
        border-radius: 30px;
        margin-right: 0;
        margin-left: 16px;
        background-color: $gray-7;
        overflow-x: hidden;
        display: none;
        align-items: center;
        justify-content: space-between;
        &.small {
            // height: 38px;
            height: auto;
            overflow: hidden;
        }
        img {
            margin-right: 5px;
            cursor: pointer;
        }
    }
}

@media (max-width: 768px) {
    #textArea {
        &--web {
            display: none;
        }
        &--phone {
            display: flex;
        }
    }
}

.reply {
    width: calc(100% - 350px);
    background-color: $gray-7;
    display: flex;
    cursor: pointer;
    position: fixed;
    bottom: 60px;
    &__user-text {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    &__text {
        width: 80%;
        @extend %h4;
        color: $gray-1;
    }
    &__img {
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
@media (max-width: 768px) {
    .reply {
        width: 100%;
    }
}
.input-function {
    position: fixed;
    bottom: 60px;
    width: calc(100% - 350px);
    height: 84px;
    background-color: $white;
    display: flex;
    justify-content: space-around;
    box-shadow: -1px -1px 4px rgba(227, 227, 227, 0.5);
    &__file {
        width: 40px;
        padding-top: 15px;
    }
    &__position {
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
    .input-function {
        width: 100%;
    }
}
.upload-cover {
    position: relative;
    height: 69px;
    background-image: url("~@/assets/Images/chatroom/file.svg");
    background-position: center 0;
    background-size: 24px;
    background-repeat: no-repeat;
    text-align: center;
    cursor: pointer;
    display: block;
    &__input {
        display: none;
    }
    &__icon {
        width: 40px;
        position: absolute;
        @extend %h4;
        cursor: pointer;
        left: 0;
        bottom: 20px;
    }
}
.newMsgHint {
    cursor: pointer;
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 60px;
    background-color: $primary-4;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.8;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    h1 {
        color: black;
    }
}
.input-bar {
    position: fixed;
    bottom: 0;
    // width: calc(100% - 300px);
    width: calc(100vw - 350px);
    padding: 0 15px;
    background-color: $white;
    box-shadow: -1px -1px 4px $gray-6;
    &__delete {
        height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .cancel__button {
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
        .delete__button {
            color: $primary-1;
            font-size: $font-size-20;
            cursor: pointer;
        }
    }
    &__inner {
        box-sizing: border-box;
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        padding: 10px 0px;
        .attach--open {
            // outline: 1px solid red;
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 0.5em 3px 0;
            background-image: url("~@/assets/Images/chatroom/add-round.svg");
            background-size: 24px;
            cursor: pointer;
        }
        .attach--close {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 0.5em 3px 0;
            background-image: url("~@/assets/Images/chatroom/close-round.svg");
            background-size: 24px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .attach--open {
                min-width: 20px;
                height: 20px;
                margin: 3px 0.5em 3px 0;
                background-size: 20px;
                display: block;
            }
            .attach--close {
                min-width: 20px;
                height: 20px;
                background-size: 20px;
                margin: 3px 0.5em 3px 0;
                display: block;
            }
        }
        .camera {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("~@/assets/Images/chatroom/Photo.svg");
            background-size: 24px;
            // cursor: pointer;
            input {
                opacity: 0;
                box-sizing: border-box;
                // border: 12px solid #00a;
                width: 24px;
                height: 24px;
                cursor: pointer;
                position: relative;
                z-index: 10;
            }
        }
        @media (max-width: 768px) {
            .camera {
                display: block;
                min-width: 20px;
                height: 20px;
                margin: 3px 0.6em 3px 0;
                background-image: url("~@/assets/Images/chatroom/Photo.svg");
                background-size: 20px;
                // cursor: pointer;
                // outline: 1px solid red;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 10px solid #00a;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    position: relative;
                    z-index: 10;
                }
            }
        }
        .photo {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("~@/assets/Images/chatroom/pic.svg");
            background-size: 24px;
            // cursor: pointer;
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
            .photo {
                display: block;
                min-width: 20px;
                height: 20px;
                margin: 0;
                background-image: url("~@/assets/Images/chatroom/pic.svg");
                background-size: 20px;
                // cursor: pointer;
                // outline: 1px solid red;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 10px solid #00a;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    position: relative;
                    // z-index: 10;
                }
            }
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
        .send {
            width: 28px;
            height: 28px;
            &:hover {
                cursor: pointer;
            }
        }
        .recorder--disabled,
        .recorder--enabled {
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
            .recorder--disabled,
            .recorder--enabled {
                display: block;
                width: 24px;
                height: 24px;
                margin-left: 9px;
            }
        }
    }

    .sticker {
        padding-top: 0;
        padding-bottom: 10px;
        &__tabs {
            width: 100%;
            height: 55px;
            display: block;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
        }
        &__ul {
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
        &__group {
            width: 100%;
            min-height: 150px;
            max-height: 140px;
            display: block;
            overflow-y: auto;
            .hide {
                display: none;
            }
        }
        &__icon {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 110px;
            cursor: pointer;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            &:active {
                border-radius: 8px;
                background-color: $primary-3;
            }
            img {
                width: 85%;
            }
        }
        @media (max-width: 768px) {
            .sticker {
                &__icon {
                    width: auto;
                    height: auto;
                }
            }
        }
    }
    .recording {
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: center;

        .description {
            @extend %h4;
            margin-bottom: 15px;
            color: $gray-1;
        }
        .time {
            @extend %h1;
            margin-bottom: 15px;
            color: $primary-1;
        }
    }

    .audio-microphone {
        &--disable {
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
        &--enable {
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
    .input-bar {
        width: 100%;
    }
}
</style>

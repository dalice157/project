<template>
    <!-- 回覆視窗 -->
    <div
        class="reply"
        v-if="isReplyBox"
        @[events].prevent="scrollPageTo(replyMsg.janusMsg.config.id)"
    >
        <div class="usertext">
            <div class="replyText" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">[照片]</div>
            <div class="replyText" v-if="replyMsg && replyMsg.janusMsg.msgType === 3">[貼圖]</div>
            <n-ellipsis
                v-if="replyMsg && replyMsg.janusMsg.msgContent"
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
            <div @[events].stop="replyHide" class="closeBtn">
                <img :src="closeIcon" alt="close" />
            </div>
        </div>
    </div>
    <!-- 功能欄視窗 -->
    <div class="inputFunctionBar" v-if="inputFunctionBoolean">
        <div class="file">
            <label class="upload_cover">
                <input
                    class="upload_input"
                    type="file"
                    multiple
                    :accept="fileAcceptMP"
                    @change="onUploadFileMP"
                />
                <span class="upload_icon">文件</span>
            </label>
        </div>
        <div class="position" @[events]="handleFindMe()">
            <img :src="mapIcon" alt="map" />
            <p>位置</p>
        </div>
    </div>
    <!-- 使用者輸入框 -->
    <div class="input">
        <div class="deleteOption" v-if="deleteBoolean">
            <div class="cancelBtn" @[events]="deleteBoolean = !deleteBoolean">取消</div>
            <div class="deleteBtn" @[events]="confirmDeletePopup">
                刪除{{ deleteGroup.length > 0 ? `(${deleteGroup.length})` : "" }}
            </div>
        </div>
        <div class="input-inner" v-else>
            <span
                class="attachOpen"
                @[events].prevent="inputFunctionOpen"
                v-show="!inputFunctionBoolean"
            ></span>
            <span
                class="attachClose"
                @[events].prevent="inputFunctionClose"
                v-show="inputFunctionBoolean"
            ></span>
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
            <div class="textArea" id="textArea">
                <n-input
                    class="n-input-modify"
                    placeholder="Aa"
                    type="textarea"
                    size="small"
                    :autosize="{ minRows: 1 }"
                    v-model:value.trim="msg"
                    @focus="closeAll"
                    @input="focusMsg"
                    @keydown.enter.exact.prevent="addMsg"
                    ref="inputRef"
                    id="input"
                >
                </n-input>

                <img
                    @click="closeStickerBox"
                    v-if="showStickerModal"
                    :src="emojiEnabled"
                    alt="表情貼圖"
                />
                <img
                    @click="openStickerBox"
                    v-if="!showStickerModal"
                    :src="emojiIcon"
                    alt="表情貼圖"
                />
            </div>
            <img
                class="send"
                :src="sendIcon"
                alt="傳送訊息"
                @[events].prevent="addMsg"
                v-show="msg"
            />
            <img
                class="recorder"
                :src="voiceIcon"
                alt="開啟錄音"
                v-show="!msg && !showRecorderModal"
                @[events]="openRecorder()"
            />
            <img
                class="recorder"
                :src="voiceIconEnabled"
                alt="關閉錄音"
                v-show="!msg && showRecorderModal"
                @[events]="closeRecorder()"
            />
        </div>
        <!-- 貼圖視窗 -->
        <div class="stickerArea" v-show="showStickerModal">
            <div class="stickerTabsArea">
                <ul class="stickerTabs">
                    <li
                        v-if="stickerItems.length > 0"
                        class="reload-time"
                        @[events].prevent="stickerGroupID == 0 ? '' : handleStickckerGroup(0)"
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
                        @[events].prevent="
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
                        @[events].prevent="addSticker(item, item.stickerFileID)"
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
                        @[events].prevent="addSticker(stickerGroup, tab)"
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
        <!-- 錄音視窗 -->
        <div class="audioRecorderArea" v-show="showRecorderModal" @[events].prevent="clearRecorder">
            <!--未錄音狀態  -->
            <h1 class="recorderDescription" v-show="!isRecording">
                放開即可傳送語音，左右滑動即可取消
            </h1>
            <div id="audio" class="audioMicrophoneDisable" v-show="!isRecording">
                <img class="microphone" :src="voiceDisabled" alt="closeVoice" />
            </div>
            <!-- 錄音狀態 -->
            <h1 class="recorderTime" v-show="isRecording">{{ recorderTime }}</h1>
            <div class="audioMicrophoneEnable" v-show="isRecording">
                <img :src="voiceEnabled" alt="open voice" />
            </div>
        </div>

        <!-- google 地圖 -->
        <n-modal class="map" v-model:show="showMapModal">
            <n-card title="位置分享" :bordered="false" size="huge">
                <template #header-extra>
                    <span class="shareMap" @[events]="shareMap()"
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
                    :src="`https://www.google.com/maps/embed/v1/place?q=${latitude}, ${longitude}&zoom=14&key=AIzaSyA6MSxbFkvRRh_2_JjFrD6lP4GgcWcn98Y`"
                >
                </iframe>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, reactive, watchEffect, toRef } from "vue";
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
import voiceIcon from "@/assets/Images/chatroom/voice.svg";
import voiceIconEnabled from "@/assets/Images/chatroom/voice-enabled.svg";
import reloadTimeEnabled from "@/assets/Images/chatroom/reload-time-enabled.svg";
import reloadTimeIcon from "@/assets/Images/chatroom/reload-time.svg";
import voiceDisabled from "@/assets/Images/chatroom/voice-fill-disabled.svg";
import voiceEnabled from "@/assets/Images/chatroom/voice-fill-enabled.svg";
import { isMobile } from "@/util/commonUtil";

const events = ref(isMobile ? "touchend" : "click");

// model sotre
const modelStore = useModelStore();
const { closeAll } = modelStore;

// api store
const apiStore = useApiStore();
const { getSticker } = apiStore;
const { eventInfo, stickerList, stickerUrl } = storeToRefs(apiStore);
//store
const chatStore = useChatStore();
const inputRef: any = ref(null);
const { replyHide, confirmDelete, handleStickckerGroup } = chatStore;
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
    stickerItems,
    participantList,
    isOnline,
    adminCount,
    userMediaMicrophone,
} = storeToRefs(chatStore);
//router
const route = useRoute();
onMounted(() => {
    inputRef.value.blur();
    inputVal.value = inputRef.value;
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
const handleFindMe = () => {
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
    console.log("navigator.geolocation error:", error.message);
    alert("您已將位置權限關閉,請將位置權限設為允許");
    showMapModal.value = false;
};

const shareMap = () => {
    showMapModal.value = false;
    let mapObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.params.eventKey),
            msgType: 8,
            sender: 1, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
            format: {
                Longitude: longitude.value,
                Latitude: latitude.value,
                LocateTime: new Date(),
                LocateSource: 0,
            },
            config: {
                id: nanoid(),
                isReply: false,
                replyObj: "",
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: adminCount.value > 0 ? true : false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
            },
        },
    };
    messages.value.push(mapObj);
    const sendMsgObj = {
        msg: mapObj,
        textPlugin: textPlugin.value,
        eventKey: route.params.eventKey,
        msgParticipantList: participantList.value,
        eventID: eventID(route.params.eventKey),
    };
    sendPrivateMsg(sendMsgObj);
    localStorageMsg(messages.value, route.params.eventKey);
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
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
            userMediaMicrophone.value = stream;
            console.log("userMicrophone", userMediaMicrophone.value);
            console.log("You let me use your mic!");
        })
        .catch(function (err) {
            console.log("No mic for you !");
            console.log("err", err);
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

    recordArea.addEventListener("touchstart", (e: any) => {
        e.preventDefault(); //
        isClock.value = true;
        posStart.value = e.touches[0]; //獲取起點坐標
        // console.log("posStart X:", posStart.value.clientX);
        // console.log("posStart Y:", posStart.value.clientY);
        startRecorder(e);
    });
    recordArea.addEventListener("touchmove", (e: any) => {
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
            alert(`異常了,未找到設備`);
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
    })
        .then((res) => {
            console.log("audio:", res);
            let audioObj: any = {};
            audioObj = {
                janusMsg: {
                    chatroomID: chatroomID(route.params.eventKey),
                    msgType: 5,
                    sender: 1, // 0:客服, 1:使用者
                    msgContent: "",
                    time: unixTime(),
                    type: 2, //1:簡訊 2: 文字
                    format: {
                        Fileid: res.data.fileid,
                        ShowName: `record_${audioFile.size}`,
                        Description: "",
                        FileSize: audioFile.size,
                        SoundLength: duration.value,
                        expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                    },
                    config: {
                        id: nanoid(),
                        isReply: false,
                        replyObj: "",
                        currentDate: currentDate(),
                        isExpire: false,
                        isPlay: false,
                        isRead: adminCount.value > 0 ? true : false,
                        msgFunctionStatus: false,
                        msgMoreStatus: false,
                        recallPopUp: false,
                        recallStatus: false,
                    },
                },
            };
            messages.value.push(audioObj);
            const sendMsgObj = {
                msg: audioObj,
                textPlugin: textPlugin.value,
                eventKey: route.params.eventKey,
                msgParticipantList: participantList.value,
                eventID: eventID(route.params.eventKey),
            };
            sendPrivateMsg(sendMsgObj);
            localStorageMsg(messages.value, route.params.eventKey);
        })
        .catch((err) => {
            console.error(err);
        });
};
// 清除recorder
const clearRecorder = () => {
    recorder.value = null;
};

const focusMsg = () => {
    const textArea = document.getElementById("textArea");
    const str = msg.value.trim();
    if (str !== "") {
        textArea.classList.remove("small");
    }
    showRecorderModal.value = false;
    inputFunctionBoolean.value = false;
    showStickerModal.value = false;
};

//發送訊息
const addMsg = (): void => {
    const str = msg.value.trim();
    let textObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.params.eventKey),
            msgType: 1,
            sender: 1, // 0:客服, 1:使用者
            msgContent: str,
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
            format: {},
            config: {
                id: nanoid(),
                isReply: replyMsg.value ? true : false,
                replyObj: replyMsg.value || "",
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: adminCount.value > 0 ? true : false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
            },
        },
    };

    if (str !== "") {
        messages.value.push(textObj);
        const sendMsgObj = {
            msg: textObj,
            textPlugin: textPlugin.value,
            eventKey: route.params.eventKey,
            msgParticipantList: participantList.value,
            eventID: eventID(route.params.eventKey),
        };

        sendPrivateMsg(sendMsgObj);
    }
    localStorageMsg(messages.value, route.params.eventKey);
    // 送出後清除 msg 及 replyMsg
    msg.value = null;
    replyHide();
    const textArea = document.getElementById("textArea");
    textArea.classList.add("small");
};

//手機板發送圖片
const photo = ref(null);
const image = ref();
const uploadImage = (e: any) => {
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) {
        return;
    }
    //壓縮圖片套件 compressor js
    new Compressor(file, {
        quality: 0.6,
        success(result) {
            //呼叫api
            const fd = new FormData();
            console.log("file.name:", file);

            fd.append("file", new File([result], file.name, { type: "image/*" }));
            axios({
                method: "post",
                url: `${config.serverUrl}/file/${route.params.eventKey}`,
                data: fd,
            })
                .then((res) => {
                    console.log("img res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e: any) => {
                        image.value = e.target.result;
                        const imageObj = {
                            janusMsg: {
                                chatroomID: chatroomID(route.params.eventKey),
                                msgType: 6,
                                sender: 1, // 0:客服, 1:使用者
                                msgContent: "",
                                time: unixTime(),
                                type: 2, //1:簡訊 2: 文字
                                format: {
                                    Fileid: res.data.fileid,
                                    ShowName: fileName,
                                    ExtensionName: res.data.ext,
                                    FileSize: file.size,
                                    expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                                },
                                config: {
                                    id: nanoid(),
                                    isReply: replyMsg.value ? true : false,
                                    replyObj: replyMsg.value || "",
                                    currentDate: currentDate(),
                                    // currentDate: "2022-06-04",
                                    isExpire: false,
                                    isPlay: false,
                                    isRead: adminCount.value > 0 ? true : false,
                                    msgFunctionStatus: false,
                                    msgMoreStatus: false,
                                    recallPopUp: false,
                                    recallStatus: false,
                                },
                            },
                        };

                        messages.value.push(imageObj);

                        localStorageMsg(messages.value, route.params.eventKey);
                        const sendMsgObj = {
                            msg: imageObj,
                            textPlugin: textPlugin.value,
                            eventKey: route.params.eventKey,
                            msgParticipantList: participantList.value,
                            eventID: eventID(route.params.eventKey),
                        };
                        setTimeout(() => {
                            sendPrivateMsg(sendMsgObj);
                        }, 1000);
                        pictures.value.push(imageObj);
                        localStorage.setItem(
                            `${route.params.eventKey}-pictures`,
                            JSON.stringify(pictures.value)
                        );
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
    photo.value.value = null;
};

//上傳
const file = ref(null);
const files = ref();
const onUploadFilePC = (e: any) => {
    inputFunctionBoolean.value = false;
    const fileArr = e.target.files[0];
    const fileArrType = e.target.files[0].type;
    const fileName = fileArr.name;
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
                console.log("file.name:", fileArr);

                fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                axios({
                    method: "post",
                    url: `${config.serverUrl}/file/${route.params.eventKey}`,
                    data: fd,
                })
                    .then((res) => {
                        console.log("img res:", res);

                        const reader = new FileReader();
                        reader.readAsDataURL(fileArr);
                        reader.onload = (e: any) => {
                            image.value = e.target.result;
                            const imageObj: any = {
                                janusMsg: {
                                    chatroomID: chatroomID(route.params.eventKey),
                                    msgType: 6,
                                    sender: 1, // 0:客服, 1:使用者
                                    msgContent: "",
                                    time: unixTime(),
                                    type: 2, //1:簡訊 2: 文字
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
                                        replyObj: replyMsg.value || "",
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: adminCount.value > 0 ? true : false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                    },
                                },
                            };

                            messages.value.push(imageObj);
                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                eventKey: route.params.eventKey,
                                msgParticipantList: participantList.value,
                                eventID: eventID(route.params.eventKey),
                            };
                            sendPrivateMsg(sendMsgObj);
                            localStorageMsg(messages.value, route.params.eventKey);

                            pictures.value.push(imageObj);
                            localStorage.setItem(
                                `${route.params.eventKey}-pictures`,
                                JSON.stringify(pictures.value)
                            );
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
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

        axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
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
                            msgType: 7,
                            sender: 1, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: 2, //1:簡訊 2: 文字
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
                                isRead: adminCount.value > 0 ? true : false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                            },
                        },
                    };
                    messages.value.push(fileObj);
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        eventKey: route.params.eventKey,
                        msgParticipantList: participantList.value,
                        eventID: eventID(route.params.eventKey),
                    };
                    sendPrivateMsg(sendMsgObj);
                    localStorageMsg(messages.value, route.params.eventKey);
                    pictures.value.push(fileObj);
                    localStorage.setItem(
                        `${route.params.eventKey}-pictures`,
                        JSON.stringify(pictures.value)
                    );
                };
            })
            .catch((err) => {
                console.error(err);
            });
    }
    file.value.value = null;
};

const onUploadFileMP = (e: any) => {
    inputFunctionBoolean.value = false;
    const fileArr = e.target.files[0];
    if (!fileArr) {
        return;
    }

    const fd = new FormData();
    fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

    axios({
        method: "post",
        url: `${config.serverUrl}/file/${route.params.eventKey}`,
        data: fd,
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
                        msgType: 7,
                        sender: 1, // 0:客服, 1:使用者
                        msgContent: "",
                        time: unixTime(),
                        type: 2, //1:簡訊 2: 文字
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
                            isRead: adminCount.value > 0 ? true : false,
                            msgFunctionStatus: false,
                            msgMoreStatus: false,
                            recallPopUp: false,
                            recallStatus: false,
                        },
                    },
                };
                messages.value.push(fileObj);
                const sendMsgObj = {
                    msg: fileObj,
                    textPlugin: textPlugin.value,
                    eventKey: route.params.eventKey,
                    msgParticipantList: participantList.value,
                    eventID: eventID(route.params.eventKey),
                };
                sendPrivateMsg(sendMsgObj);
                localStorageMsg(messages.value, route.params.eventKey);
                pictures.value.push(fileObj);
                localStorage.setItem(
                    `${route.params.eventKey}-pictures`,
                    JSON.stringify(pictures.value)
                );
            };
        })
        .catch((err) => {
            console.error(err);
        });
};
// 貼圖功能
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

const addSticker = (sticker, id) => {
    let stickerObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.params.eventKey),
            msgType: 3,
            sender: 1, // 0:客服, 1:使用者
            msgContent: "",
            time: unixTime(),
            type: 2, //1:簡訊 2: 文字
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
                replyObj: replyMsg.value || "",
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: adminCount.value > 0 ? true : false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
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
    messages.value.push(stickerObj);
    const sendMsgObj = {
        msg: stickerObj,
        textPlugin: textPlugin.value,
        eventKey: route.params.eventKey,
        msgParticipantList: participantList.value,
        eventID: eventID(route.params.eventKey),
    };
    const isStickerPush = stickerItems.value.some((item) => {
        return item.title === stickers.title;
    });
    if (!isStickerPush) {
        stickerItems.value.push(stickers);
    }

    window.localStorage.setItem("sticker", JSON.stringify(stickerItems.value));
    sendPrivateMsg(sendMsgObj);
    localStorageMsg(messages.value, route.params.eventKey);
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
watchEffect(() => {
    messages.value;
});
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-input-modify {
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
    width: calc(100% - 300px);
    background-color: $gray-7;
    display: flex;
    cursor: pointer;
    position: fixed;
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
@media (max-width: 768px) {
    .reply {
        width: 100%;
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
    position: fixed;
    bottom: 0;
    width: calc(100% - 300px);
    padding: 0 15px;
    background-color: $white;
    box-shadow: -1px -1px 4px $gray-6;
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

        .attachOpen {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("~@/assets/Images/chatroom/add-round.svg");
            background-size: 24px;
            cursor: pointer;
        }
        .attachClose {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("~@/assets/Images/chatroom/close-round.svg");
            background-size: 24px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .attachOpen {
                display: block;
            }
            .attachClose {
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
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("~@/assets/Images/chatroom/Photo.svg");
                background-size: 24px;
                // cursor: pointer;
                // outline: 1px solid red;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 12px solid #00a;
                    width: 24px;
                    height: 24px;
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
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("~@/assets/Images/chatroom/pic.svg");
                background-size: 24px;
                // cursor: pointer;
                // outline: 1px solid red;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 12px solid #00a;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    position: relative;
                    z-index: 10;
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
            &.small {
                height: 38px;
                overflow: hidden;
            }
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

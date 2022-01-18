<template>
    <!-- 回覆視窗 -->
    <div class="reply" v-if="isReplayBox" @click.prevent="scrollPageTo(replyMsg.id)">
        <div class="usertext">
            <div
                class="replyText"
                v-if="replyMsg && replyMsg.janusMsg.format && replyMsg.janusMsg.format.ShowName"
            >
                [照片]
            </div>
            <n-ellipsis
                v-if="replyMsg && replyMsg.janusMsg.message"
                style="width: 80%"
                class="replyText"
                :tooltip="false"
            >
                {{ replyMsg.janusMsg.message }}
            </n-ellipsis>
            <div class="img" v-if="replyMsg && replyMsg.janusMsg.msgType === 6">
                <img
                    :src="`${config.serverUrl}/image/${replyMsg.janusMsg.format.Fileid}${replyMsg.ext}`"
                />
            </div>
            <div @click.stop="replyHide" class="closeBtn">
                <img src="../../assets/Images/chatroom/round-fill_close.svg" alt="#" />
            </div>
        </div>
    </div>
    <!-- 功能欄視窗 -->
    <div class="inputFunctionBar" v-if="inputFunctionBoolean">
        <!-- <div class="audio">
            <img src="../../assets/Images/m_fa_recording.png" alt="#" />
            <p>語音輸入</p>
        </div> -->
        <div class="file">
            <label class="upload_cover">
                <input
                    class="upload_input"
                    type="file"
                    multiple
                    :accept="fileAccept"
                    @change="onUploadFile"
                />
                <span class="upload_icon">文件</span>
            </label>
        </div>
        <div class="position" @click="handleFindMe()">
            <img src="../../assets/Images/chatroom/location.svg" alt="#" />
            <p>位置</p>
        </div>
    </div>
    <!-- 使用者輸入框 -->
    <div class="input">
        <div class="deleteOption" v-if="deleteBoolean">
            <div class="cancelBtn" @click="deleteBoolean = !deleteBoolean">取消</div>
            <div class="deleteBtn" @click="confirmDeletePopup">
                刪除{{ deleteGroup.length > 0 ? `(${deleteGroup.length})` : "" }}
            </div>
        </div>
        <div class="input-inner" v-else>
            <span class="attach" @click="inputFunctionSwitch"></span>
            <span class="camera">
                <input type="file" capture="environment" accept="video/*" @change="uploadImage" />
            </span>
            <span class="photo">
                <input type="file" capture="user" accept="image/*" @change="uploadImage" />
            </span>
            <span class="file-folder">
                <input type="file" multiple @change="onUploadFile" />
            </span>
            <div class="textArea">
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        class="n-input-modify"
                        autofocus
                        placeholder="Aa"
                        type="textarea"
                        size="small"
                        :autosize="{
                            minRows: 1,
                            maxRows: 5,
                        }"
                        v-model:value.trim="msg"
                        ref="inputInstRef"
                        @keydown.enter.exact.prevent="addMsg"
                    >
                        <template #suffix>
                            <img src="../../assets/Images/chatroom/emoji.svg" alt="#" />
                        </template>
                    </n-input>
                </n-config-provider>
            </div>
            <img
                class="send"
                src="../../assets/Images/chatroom/send.svg"
                alt="#"
                @click.prevent="addMsg"
                v-show="msg"
            />
            <img
                class="recorder"
                src="../../assets/Images/chatroom/voice.svg"
                alt="#"
                v-show="!msg && !showRecorderModal"
                @click="handlerRecorder()"
            />
            <img
                class="recorder"
                src="../../assets/Images/chatroom/voice-enabled.svg"
                alt="#"
                v-show="!msg && showRecorderModal"
                @click="handlerRecorder()"
            />
        </div>

        <!-- 錄音視窗 -->
        <div class="audioRecorderArea" v-show="showRecorderModal" @touchend="clearRecorder">
            <!--未錄音狀態  -->
            <h1 class="recorderDescription" v-show="!isRecording">
                放開即可傳送語音，左右滑動即可取消
            </h1>
            <div id="audio" class="audioMicrophoneDisable" v-show="!isRecording">
                <img
                    class="microphone"
                    src="../../assets/Images/chatroom/voice-fill-disabled.svg"
                    alt="#"
                />
            </div>
            <!-- 錄音狀態 -->
            <h1 class="recorderTime" v-show="isRecording">{{ recorderTime }}</h1>
            <div class="audioMicrophoneEnable" v-show="isRecording">
                <img src="../../assets/Images/chatroom/voice-fill-enabled.svg" alt="#" />
            </div>
        </div>

        <!-- google 地圖 -->
        <n-modal class="map" v-model:show="showMapModal">
            <n-card title="位置分享" :bordered="false" size="huge">
                <template #header-extra>
                    <span class="shareMap" @click="shareMap()"
                        >分享
                        <n-icon class="icon" size="20" color="#01bad4">
                            <arrow-redo />
                        </n-icon>
                    </span>
                </template>
                <!--api key 要申請, 目前是暫放demo的api key-->
                <GoogleMap
                    class="googleMap"
                    api-key="AIzaSyAx5g4E7tKTC_Q-ycGlbDMBH5UDOqa7-aY"
                    :zoom="15"
                    :center="{ lat: latitude, lng: longitude }"
                >
                    <Marker
                        :options="{
                            position: { lat: latitude, lng: longitude },
                        }"
                    />
                </GoogleMap>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, reactive, watchEffect } from "vue";
import { txt } from "../../util/interfaceUtil";
import { sendPrivateMsg } from "../../util/chatUtil";
import { scrollPageTo, localStorageMsg, isObjToBeZero, chatroomID } from "../../util/commonUtil";
import { currentTime, currentDate, currentMonth } from "../../util/dateUtil";
import { useApiStore } from "../../store/api";
import { useChatStore } from "../../store/chat";
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
    NGi,
} from "naive-ui";
import { MicOutline, ArrowRedo } from "@vicons/ionicons5";
import { storeToRefs } from "pinia";
import Recorder from "js-audio-recorder";
import {} from "googlemaps";
import { GoogleMap, Marker } from "vue3-google-map";
import { useRoute } from "vue-router";
import mapIcon from "../../assets/Images/m_fa_mappin.png";
import sendIcon from "../../assets/Images/btn_send.png";
import { convertTime } from "../../util/commonUtil";
import config from "@/config/config";
import dayjs from "dayjs";

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);
//store
const chatStore = useChatStore();
const inputInstRef: any = ref(null);
const { replyHide, confirmDelete } = chatStore;
const {
    messages,
    pictures,
    msg,
    isReplayBox,
    replyMsg,
    inputVal,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    inputFunctionBoolean,
    textPlugin,
} = storeToRefs(chatStore);
//router
const route = useRoute();
onMounted(() => {
    inputVal.value = inputInstRef.value;
});

// 可上傳檔案類型
const fileAccept =
    "text/*, video/*, audio/*, application/*, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.templat, application/vnd.ms-word.document.macroEnabled.12, application/vnd.ms-word.template.macroEnabled.12";

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

const shareMap = () => {
    showMapModal.value = false;
    let mapObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.query.chatToken),
            sender: 1, // 1 為自己傳送的訊息
            type: 2,
            msgType: 8,
            message: "",
            format: {
                Longitude: longitude.value,
                Latitude: latitude.value,
                LocateTime: new Date(),
                LocateSource: 0,
            },
        },
        id: nanoid(),
        ext: "",
        phoneType: "",
        audioInfo: "",
        msgMoreStatus: false,
        msgFunctionStatus: false,
        recallStatus: false,
        recallPopUp: false,
        time: currentTime(),
        currentDate: currentDate(),
        currentMonth: currentMonth(),
        expirationDate: "",
        isExpire: false,
        replyObj: replyMsg.value
            ? {
                  id: replyMsg.value.id,
                  ext: replyMsg.value.ext,
                  msgType: replyMsg.value.janusMsg.msgType,
                  message: replyMsg.value.janusMsg.message,
                  format: replyMsg.value.janusMsg.format,
                  recallStatus: replyMsg.value.recallStatus,
                  recallPopUp: replyMsg.value.recallPopUp,
              }
            : "",
    };
    messages.value.push(mapObj);
    const sendMsgObj = {
        msg: mapObj,
        textPlugin: textPlugin.value,
        chatToken: route.query.chatToken,
    };
    sendPrivateMsg(sendMsgObj);
    localStorageMsg(messages.value, route.query.chatToken);
};

// 錄音
const recorder: any = ref(null);
//錄音視窗開關
const showRecorderModal = ref(false);
//是否錄音
const isRecording = ref(false);
//音檔長度
const duration = ref(0);
const recorderTime = ref("00:00");
//座標
const isClock = ref(false);
const posStart = ref(0) as any;

// 開啟錄音視窗
const handlerRecorder = () => {
    showRecorderModal.value = !showRecorderModal.value;
};

onMounted(() => {
    const all = document.querySelector(".all") as any;
    const recordArea = document.querySelector("#audio") as any;
    const microphone = document.querySelector(".microphone");
    recordArea.addEventListener("touchstart", (e: any) => {
        e.preventDefault(); //
        isClock.value = true;
        posStart.value = e.touches[0]; //獲取起點坐標
        console.log("posStart X:", posStart.value.clientX);
        console.log("posStart Y:", posStart.value.clientY);
        startRecorder(e);
    });
    recordArea.addEventListener("touchmove", (e: any) => {
        const pon = 30; //外框界線
        const xPon = Math.abs(e.touches[e.touches.length - 1].clientX - posStart.value.clientX);
        const yPon = Math.abs(e.touches[e.touches.length - 1].clientY - posStart.value.clientY);

        console.log("x 軸", xPon);
        console.log("y 軸", yPon);
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
        console.log("recorderTime.value:", recorderTime.value);

        e.preventDefault();
        console.log("posStart.value end:", e);
        if (isClock.value == true && recorderTime.value !== "0:00") {
            stopRecorder(e);
            console.log("送出錄音");
        } else if (recorderTime.value === "0:00") {
            stopClRecorder(e);
            console.log("取消錄音");
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
        });
};

const stopMoveRecorder = (e: any) => {
    e.preventDefault();
};
const stopClRecorder = (e: any) => {
    recorder.value.stop();
    recorder.value.destroy().then(function () {
        recorder.value = null;
    });
    isRecording.value = false;
    recorderTime.value = "0:00";
};
// 結束錄音
const stopRecorder = (e: any) => {
    isRecording.value = false;
    console.log("結束錄音");
    recorder.value.stop();
    const audioFile = recorder.value.getWAVBlob();
    const fd = new FormData();
    fd.append(
        "file",
        new File([audioFile], `record_${audioFile.size}.wav`, { type: audioFile.type })
    );

    axios({
        method: "post",
        url: `${config.serverUrl}/file/${route.query.chatToken}`,
        data: fd,
    })
        .then((res) => {
            console.log("audio:", res);
            let audioObj: any = {};
            audioObj = {
                janusMsg: {
                    chatroomID: chatroomID(route.query.chatToken),
                    sender: 1, // 1 為自己傳送的訊息
                    type: 2,
                    msgType: 5,
                    message: "",
                    format: {
                        Fileid: res.data.data.fileid,
                        ShowName: `record_${audioFile.size}`,
                        Description: "",
                        FileSize: audioFile.size,
                        SoundLength: duration.value,
                    },
                },
                id: nanoid(),
                phoneType: "",
                audioInfo: {
                    SoundTime: convertTime(duration.value),
                    type: audioFile.type,
                    isPlay: false,
                },
                ext: res.data.data.ext,
                msgMoreStatus: false,
                msgFunctionStatus: false,
                recallStatus: false,
                recallPopUp: false,
                time: currentTime(),
                currentDate: currentDate(),
                currentMonth: currentMonth(),
                expirationDate: "",
                isExpire: false,
                replyObj: replyMsg.value
                    ? {
                          id: replyMsg.value.id,
                          ext: replyMsg.value.ext,
                          msgType: replyMsg.value.janusMsg.msgType,
                          message: replyMsg.value.janusMsg.message,
                          format: replyMsg.value.janusMsg.format,
                          recallStatus: replyMsg.value.recallStatus,
                          recallPopUp: replyMsg.value.recallPopUp,
                      }
                    : "",
            };
            messages.value.push(audioObj);
            const sendMsgObj = {
                msg: audioObj,
                textPlugin: textPlugin.value,
                chatToken: route.query.chatToken,
            };
            sendPrivateMsg(sendMsgObj);
            localStorageMsg(messages.value, route.query.chatToken);
        })
        .catch((err) => {
            console.error(err);
        });
};
// 清除recorder
const clearRecorder = () => {
    recorder.value = null;
};

//發送訊息
const addMsg = (): void => {
    const str = msg.value.trim();

    let textObj: any = {
        janusMsg: {
            chatroomID: chatroomID(route.query.chatToken),
            sender: 1, // 1 為自己傳送的訊息
            type: 2,
            msgType: 1,
            message: str,
            format: {},
        },
        id: nanoid(),
        phoneType: "",
        audioInfo: "",
        msgMoreStatus: false,
        msgFunctionStatus: false,
        recallStatus: false,
        recallPopUp: false,
        time: currentTime(),
        currentDate: currentDate(),
        currentMonth: currentMonth(),
        expirationDate: "",
        isExpire: false,
        replyObj: replyMsg.value
            ? {
                  id: replyMsg.value.id,
                  ext: replyMsg.value.ext,
                  msgType: replyMsg.value.janusMsg.msgType,
                  message: replyMsg.value.janusMsg.message,
                  format: replyMsg.value.janusMsg.format,
                  recallStatus: replyMsg.value.recallStatus,
                  recallPopUp: replyMsg.value.recallPopUp,
              }
            : "",
    };

    if (str !== "") {
        messages.value.push(textObj);
        const sendMsgObj = {
            msg: textObj,
            textPlugin: textPlugin.value,
            chatToken: route.query.chatToken,
        };
        sendPrivateMsg(sendMsgObj);
    }
    localStorageMsg(messages.value, route.query.chatToken);
    // 送出後清除 msg 及 replyMsg
    msg.value = "";
    replyHide();
};
//發送圖片
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
                url: `${config.serverUrl}/file/${route.query.chatToken}`,
                data: fd,
            })
                .then((res) => {
                    console.log("img res:", res);

                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e: any) => {
                        image.value = e.target.result;
                        const imageObj: any = {
                            janusMsg: {
                                chatroomID: chatroomID(route.query.chatToken),
                                sender: 1, // 1 為自己傳送的訊息
                                type: 2,
                                msgType: 6,
                                message: "",
                                format: {
                                    Fileid: res.data.data.fileid,
                                    ShowName: fileName,
                                    FileSize: file.size,
                                },
                            },
                            id: nanoid(),
                            phoneType: "",
                            audioInfo: "",
                            ext: res.data.data.ext,
                            msgMoreStatus: false,
                            msgFunctionStatus: false,
                            recallStatus: false,
                            recallPopUp: false,
                            time: currentTime(),
                            // currentDate: "2021-04-30",
                            currentDate: currentDate(),
                            // currentMonth: "2022-2",
                            currentMonth: currentMonth(),
                            expirationDate: dayjs.unix(res.data.data.exp).format("YYYY-MM-DD"),
                            isExpire: false,
                            replyObj: replyMsg.value
                                ? {
                                      id: replyMsg.value.id,
                                      ext: replyMsg.value.ext,
                                      msgType: replyMsg.value.janusMsg.msgType,
                                      message: replyMsg.value.janusMsg.message,
                                      format: replyMsg.value.janusMsg.format,
                                      recallStatus: replyMsg.value.recallStatus,
                                      recallPopUp: replyMsg.value.recallPopUp,
                                  }
                                : "",
                        };

                        messages.value.push(imageObj);
                        const sendMsgObj = {
                            msg: imageObj,
                            textPlugin: textPlugin.value,
                            chatToken: route.query.chatToken,
                        };
                        sendPrivateMsg(sendMsgObj);
                        localStorageMsg(messages.value, route.query.chatToken);

                        pictures.value.push(imageObj);
                        localStorage.setItem(
                            `${route.query.chatToken}-pictures`,
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
};
//上傳
const files = ref();
const onUploadFile = (e: any) => {
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
                    url: `${config.serverUrl}/file/${route.query.chatToken}`,
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
                                    chatroomID: chatroomID(route.query.chatToken),
                                    sender: 1, // 1 為自己傳送的訊息
                                    type: 2,
                                    msgType: 6,
                                    message: "",
                                    format: {
                                        Fileid: res.data.data.fileid,
                                        ShowName: fileName,
                                        FileSize: fileArr.size,
                                    },
                                },
                                id: nanoid(),
                                phoneType: "",
                                audioInfo: "",
                                ext: res.data.data.ext,
                                msgMoreStatus: false,
                                msgFunctionStatus: false,
                                recallStatus: false,
                                recallPopUp: false,
                                time: currentTime(),
                                // currentDate: "2021-04-30",
                                currentDate: currentDate(),
                                currentMonth: "2022-1",
                                // currentMonth:currentMonth(),
                                expirationDate: dayjs.unix(res.data.data.exp).format("YYYY-MM-DD"),
                                isExpire: false,
                                replyObj: replyMsg.value
                                    ? {
                                          id: replyMsg.value.id,
                                          ext: replyMsg.value.ext,
                                          msgType: replyMsg.value.janusMsg.msgType,
                                          message: replyMsg.value.janusMsg.message,
                                          format: replyMsg.value.janusMsg.format,
                                          recallStatus: replyMsg.value.recallStatus,
                                          recallPopUp: replyMsg.value.recallPopUp,
                                      }
                                    : "",
                            };

                            messages.value.push(imageObj);
                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                chatToken: route.query.chatToken,
                            };
                            sendPrivateMsg(sendMsgObj);
                            localStorageMsg(messages.value, route.query.chatToken);

                            pictures.value.push(imageObj);
                            localStorage.setItem(
                                `${route.query.chatToken}-pictures`,
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
            url: `${config.serverUrl}/file/${route.query.chatToken}`,
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
                            chatroomID: chatroomID(route.query.chatToken),
                            sender: 1, // 1 為自己傳送的訊息
                            type: 2,
                            msgType: 7,
                            message: "",
                            format: {
                                Fileid: res.data.data.fileid,
                                ShowName: fileArr.name,
                                ExtensionName: res.data.data.ext,
                                FileSize: fileArr.size,
                            },
                        },
                        id: nanoid(),
                        phoneType: "",
                        audioInfo: "",
                        ext: res.data.data.ext,
                        msgMoreStatus: false,
                        msgFunctionStatus: false,
                        recallStatus: false,
                        recallPopUp: false,
                        time: currentTime(),
                        currentDate: currentDate(),
                        currentMonth: currentMonth(),
                        expirationDate: dayjs.unix(res.data.data.exp).format("YYYY-MM-DD"),
                        isExpire: false,
                        replyObj: replyMsg.value
                            ? {
                                  id: replyMsg.value.id,
                                  ext: replyMsg.value.ext,
                                  msgType: replyMsg.value.janusMsg.msgType,
                                  message: replyMsg.value.janusMsg.message,
                                  format: replyMsg.value.janusMsg.format,
                                  recallStatus: replyMsg.value.recallStatus,
                                  recallPopUp: replyMsg.value.recallPopUp,
                              }
                            : "",
                    };
                    messages.value.push(fileObj);
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatToken: route.query.chatToken,
                    };
                    sendPrivateMsg(sendMsgObj);
                    localStorageMsg(messages.value, route.query.chatToken);
                    pictures.value.push(fileObj);
                    localStorage.setItem(
                        `${route.query.chatToken}-pictures`,
                        JSON.stringify(pictures.value)
                    );
                };
            })
            .catch((err) => {
                console.error(err);
            });
    }
    inputFunctionBoolean.value = false;
};

//功能欄開關
const inputFunctionSwitch = () => {
    inputFunctionBoolean.value = !inputFunctionBoolean.value;
    isReplayBox.value = false;
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

<style lang="scss" scoped>
@import "../../assets/scss/extend";
@import "../../assets/scss/var";

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
    background-color: $gray-7;
    display: flex;
    position: relative;
    cursor: pointer;
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
        width: 28px;
        padding-top: 15px;
        .upload_cover {
            position: relative;
            height: 69px;
            background-image: url("../../assets/Images/chatroom/file.svg");
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
                width: 28px;
                position: absolute;
                @extend %h4;
                cursor: pointer;
                left: 0;
                bottom: 20px;
            }
        }
    }
    .position {
        padding-top: 15px;
        cursor: pointer;
        img {
            width: 24px;
        }
        p {
            @extend %h4;
            text-align: center;
            margin-top: 8px;
        }
    }
}
.input {
    padding: 0 15px;
    background-color: $white;
    flex: 1;
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

        .attach {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("../../assets/Images/chatroom/add-round.svg");
            background-size: 24px;
            cursor: pointer;
        }
        @media (max-width: 768px) {
            .attach {
                display: block;
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("../../assets/Images/chatroom/add-round.svg");
                background-size: 24px;
                cursor: pointer;
            }
        }
        .camera {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("../../assets/Images/chatroom/Photo.svg");
            background-size: 24px;
            cursor: pointer;
            input {
                opacity: 0;
                box-sizing: border-box;
                border: 12px solid #00a;
                width: 24px;
                height: 24px;
                cursor: pointer;
                position: relative;
                z-index: 1;
            }
        }
        @media (max-width: 768px) {
            .camera {
                display: block;
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("../../assets/Images/chatroom/Photo.svg");
                background-size: 24px;
                cursor: pointer;
                input {
                    opacity: 0;
                    box-sizing: border-box;
                    border: 12px solid #00a;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    position: relative;
                    z-index: 1;
                }
            }
        }
        .photo {
            display: none;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("../../assets/Images/chatroom/pic.svg");
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
            .photo {
                display: block;
                min-width: 24px;
                height: 24px;
                margin: 3px 6px 3px 0;
                background-image: url("../../assets/Images/chatroom/pic.svg");
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
        .file-folder {
            display: block;
            min-width: 24px;
            height: 24px;
            margin: 3px 6px 3px 0;
            background-image: url("../../assets/Images/chatroom/file.svg");
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
                background-image: url("../../assets/Images/chatroom/file.svg");
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
            .n-input-modify {
                background-color: $gray-7;
                --padding-right: 0px !important;
                img {
                    margin-right: 5px;
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
</style>

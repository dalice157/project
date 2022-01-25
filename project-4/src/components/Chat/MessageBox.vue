<template>
    <div
        id="drop-area"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner"
        ref="findScrollHeight"
        @click="closeAll"
        @scroll="chatroomToBottom($event)"
    >
        <div class="background">
            <!-- 對話區塊 -->
            <div
                class="dialog-box"
                :class="{
                    myMsg: text.janusMsg.sender === 1,
                    yourMsg: text.janusMsg.sender === 0,
                    mapMsg: text.janusMsg.msgType === 8,
                    delChoice: deleteBoolean,
                    recallChoice: text.recallStatus,
                    dateMsg:
                        index === 0 ||
                        (index > 0 && text.currentDate !== messages[index - 1].currentDate),
                }"
                v-for="(text, index) in messages"
                :key="index"
                :id="text.id"
            >
                <!-- 日期樣板 -->
                <div
                    v-if="
                        (index > 0 && text.currentDate !== messages[index - 1].currentDate) ||
                        (index === 0 && text.currentDate)
                    "
                    class="date"
                >
                    <div>
                        {{ text.currentDate === currentDate() ? "今天" : text.currentDate }}
                    </div>
                </div>

                <n-checkbox-group
                    v-model:value="deleteGroup"
                    v-if="deleteBoolean && !text.recallStatus"
                >
                    <div class="deleteCheckBox">
                        <n-config-provider :theme-overrides="themeOverrides">
                            <n-checkbox :value="text.id" label="" />
                        </n-config-provider>
                    </div>
                </n-checkbox-group>

                <!-- 收回訊息樣板 -->
                <div class="recall" v-if="text.recallStatus">
                    <div>
                        <p>
                            您已收回訊息&emsp;
                            <span @click="reEdit(text.id)" v-if="text.janusMsg.message">
                                <u>重新編輯</u>
                            </span>
                        </p>
                    </div>
                </div>

                <!-- 聊天對話框樣板-->
                <div class="dialog" v-else>
                    <div class="dialog-inner">
                        <div class="msgFunction mobile" v-if="text.msgFunctionStatus">
                            <ul class="ulList">
                                <li v-if="text.janusMsg.message" @click.stop="copyMsg(text)">
                                    <span>複製</span>
                                </li>
                                <li
                                    v-if="
                                        text.janusMsg.msgType === 7 || text.janusMsg.msgType === 6
                                    "
                                    @click.stop="downloadImage(text)"
                                >
                                    <a
                                        :href="`${config.serverUrl}/file/${route.query.chatToken}/${text.janusMsg.format.Fileid}`"
                                    >
                                        下載
                                    </a>
                                </li>
                                <!-- <li @click.stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                <li
                                    v-if="text.janusMsg.sender === 1 && text.janusMsg.msgType !== 6"
                                    @click.stop="confirmRecallPopup(text)"
                                >
                                    <span>收回</span>
                                </li>
                                <li
                                    v-if="
                                        text.janusMsg.msgType === 1 || text.janusMsg.msgType === 6
                                    "
                                    @click.stop="replyMsgEvent(text)"
                                >
                                    <span>回覆</span>
                                </li>
                            </ul>
                        </div>
                        <!-- 收回訊息滿版 popup 出現 -->
                        <teleport to="body">
                            <div class="mask" v-if="text.recallPopUp">
                                <div class="popUp">
                                    <div class="recallMsgConfirm">您確定要收回訊息嗎 ?</div>
                                    <div class="buttonContainer">
                                        <div
                                            type="button"
                                            class="cancel"
                                            @click.stop="text.recallPopUp = !text.recallPopUp"
                                        >
                                            取消
                                        </div>
                                        <div
                                            type="button"
                                            class="confirm"
                                            @click.stop="recallMsg(text.id)"
                                        >
                                            確定
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </teleport>
                        <!-- hover出現的訊息狀態 -->
                        <div
                            class="msg_more"
                            :class="{ show: text.msgFunctionStatus }"
                            @click.stop="closeBubble(text)"
                        >
                            <img src="../../assets/Images/chatroom/more.svg" alt="#" />
                            <!-- 訊息功能框 -->
                            <div class="msgFunction" v-show="text.msgFunctionStatus">
                                <ul class="ulList">
                                    <li v-if="text.janusMsg.message" @click.stop="copyMsg(text)">
                                        <span>複製</span>
                                    </li>
                                    <li
                                        v-if="
                                            text.janusMsg.msgType === 7 ||
                                            text.janusMsg.msgType === 6
                                        "
                                        @click.stop="downloadImage(text)"
                                    >
                                        <a
                                            :href="`${config.serverUrl}/file/${route.query.chatToken}/${text.janusMsg.format.Fileid}`"
                                        >
                                            下載
                                        </a>
                                    </li>
                                    <!-- <li @click.stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                    <li
                                        v-if="
                                            text.janusMsg.sender === 1 &&
                                            text.janusMsg.msgType !== 6
                                        "
                                        @click.stop="confirmRecallPopup(text)"
                                    >
                                        <span>收回</span>
                                    </li>
                                    <li
                                        v-if="
                                            text.janusMsg.msgType === 1 ||
                                            text.janusMsg.msgType === 6
                                        "
                                        @click.stop="replyMsgEvent(text)"
                                    >
                                        <span>回覆</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 對方頭像 -->
                        <div
                            class="avatar"
                            @click="
                                showCompanyInfo({ ...eventInfo, chatToken: route.query.chatToken })
                            "
                            v-if="text.janusMsg.sender === 0 && !deleteBoolean"
                        >
                            <n-avatar
                                round
                                :size="42"
                                :src="`${config.serverUrl}/image/${eventInfo.icon}`"
                            />
                        </div>
                        <!-- 訊息 -->
                        <div
                            class="content"
                            :class="{
                                reply: text.replyObj,
                            }"
                            v-if="text.janusMsg.message"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <!-- 回覆 -->
                            <div
                                class="replyMsg"
                                :class="{
                                    noMsgClick: text.replyObj.recallStatus,
                                }"
                                v-if="text.replyObj"
                                @click.prevent="
                                    text.replyObj.recallStatus
                                        ? null
                                        : scrollPageTo(text.replyObj.id)
                                "
                            >
                                <div class="info noMsg" v-if="text.replyObj.recallStatus">
                                    無法讀取原始訊息。
                                </div>
                                <div
                                    class="info"
                                    :class="{
                                        isImg: text.replyObj.msgType === 6,
                                    }"
                                    v-else
                                >
                                    <div class="userName" v-if="text.replyObj.sender === 0">
                                        {{ eventInfo.name }}
                                    </div>
                                    <div v-if="text.replyObj.msgType === 6">[照片]</div>
                                    <n-ellipsis
                                        v-if="text.replyObj.msgType === 1"
                                        style="width: 100%"
                                        :line-clamp="2"
                                        :tooltip="false"
                                    >
                                        {{ text.replyObj.message }}
                                    </n-ellipsis>
                                </div>
                                <div class="replyImg" v-if="text.replyObj.msgType === 6">
                                    <img
                                        :src="`${config.serverUrl}/image/${text.replyObj.format.Fileid}${text.replyObj.ext}`"
                                    />
                                </div>
                            </div>
                            <!-- 文字訊息 -->
                            <div class="originalMsg">
                                <p>{{ text.janusMsg.message }}</p>
                            </div>
                        </div>
                        <!-- google maps -->
                        <div
                            class="googleMapsMsg content"
                            v-if="text.janusMsg.msgType === 8"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <a
                                :href="`https://maps.google.com/maps?q=${text.janusMsg.format.Latitude},${text.janusMsg.format.Longitude}`"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span class="img"
                                    ><img
                                        src="../../assets/Images/chatroom/map.jpg"
                                        alt="google maps"
                                /></span>
                                查看地圖
                            </a>
                        </div>
                        <!-- audio -->
                        <div
                            class="audio content"
                            :class="{ play: text.janusMsg.format.isPlay }"
                            v-if="text.janusMsg.msgType === 5"
                        >
                            <audio :id="`audio-player-${text.id}`">
                                <source
                                    :src="`${config.serverUrl}/image/${text.janusMsg.format.Fileid}${text.ext}`"
                                    type="audio/wav"
                                />
                                Your browser does not support the audio tag.
                            </audio>
                            <n-icon @click="toggleAudio(text)" size="24">
                                <pause-circle-sharp v-if="text.janusMsg.format.isPlay" />
                                <play-circle-sharp v-else />
                            </n-icon>
                            <span v-if="text.janusMsg.format.isPlay">{{ newTime }}</span>
                            <span v-if="!text.janusMsg.format.isPlay" class="totalTime">
                                {{ text.audioInfo.SoundTime }}
                            </span>
                            <img
                                class="audioWave"
                                v-if="!text.janusMsg.format.isPlay"
                                src="../../assets/Images/chatroom/audio.svg"
                            />
                        </div>
                        <!-- 圖片訊息 -->
                        <div
                            class="picture"
                            v-if="text.janusMsg.msgType === 6"
                            @click="previewURL(text.janusMsg.format.Fileid)"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img
                                :src="`${config.serverUrl}/image/${text.janusMsg.format.Fileid}${text.ext}`"
                            />
                        </div>
                        <!-- 文件訊息 -->
                        <div
                            class="content icon"
                            v-if="text.janusMsg.msgType === 7"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img src="../../assets/Images/chatroom/file-fill.svg" />
                            <div class="fileDescription">
                                <n-ellipsis
                                    class="ellipsisName"
                                    style="max-width: 120px"
                                    :tooltip="false"
                                >
                                    {{ text.janusMsg.format.ShowName }}
                                </n-ellipsis>
                                <p>
                                    檔案大小&thinsp;:&thinsp;{{ text.janusMsg.format.FileSize }}KB
                                </p>
                                <p>下載期限&thinsp;:&thinsp;{{ text.expirationDate }}</p>
                            </div>
                        </div>
                        <!-- 電話訊息 -->
                        <div
                            class="phoneMsg content"
                            v-else-if="text.janusMsg.msgType === 9"
                            @touchend="doCall(DO_CALL_NAME)"
                        >
                            <router-link
                                class="phone"
                                :to="`/phone?chatToken=${route.query.chatToken}`"
                            >
                                <div class="phonePic">
                                    <img
                                        src="../../assets/Images/chatroom/phone-fill-round-y.svg"
                                        alt=""
                                    />
                                </div>
                                <div class="phoneStatus">
                                    <h4 v-if="text.janusMsg.format.phoneType === 1">無回應</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 2">取消通話</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 3">語音來電</h4>
                                    <p v-if="text.janusMsg.format.phoneType === 3">
                                        {{ text.janusMsg.format.phoneTime }}
                                    </p>
                                    <h4 v-if="text.janusMsg.format.phoneType === 4">未接來電</h4>
                                </div>
                            </router-link>
                            <a class="phone-web" @click="onPhoneCallModal">
                                <div class="phonePic">
                                    <img
                                        src="../../assets/Images/chatroom/phone-fill-round-y.svg"
                                        alt=""
                                    />
                                </div>
                                <div class="phoneStatus">
                                    <h4 v-if="text.janusMsg.format.phoneType === 1">無回應</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 2">取消通話</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 3">語音來電</h4>
                                    <p v-if="text.janusMsg.format.phoneType === 3">
                                        {{ text.janusMsg.format.phoneTime }}
                                    </p>
                                    <h4 v-if="text.janusMsg.format.phoneType === 4">未接來電</h4>
                                </div>
                            </a>
                        </div>
                    </div>
                    <!-- 時間戳記 -->
                    <div class="timestamp" :class="{ yourTimeStamp: text.janusMsg.sender === 0 }">
                        <span v-if="text.isRead && text.janusMsg.sender === 1">已讀</span>
                        <span>{{ text.time }}</span>
                    </div>
                </div>
                <n-icon
                    size="30"
                    class="scrollToBottom"
                    v-show="
                        chatroomScrolltopAndWindowHeight < chatroomScrollHeight &&
                        !text.replyObj &&
                        !isReplyBox &&
                        !inputFunctionBoolean
                    "
                    @click="scrollToBottom"
                >
                    <arrow-down-circle />
                </n-icon>
            </div>
        </div>
    </div>
    <UserInfoModel />
    <!-- 刪除訊息滿版 poopup 出現
    <teleport to="body" v-if="deletePopUp">
        <div class="mask">
            <div class="popUp">
                <div class="recallMsgConfirm">對方仍能看到你刪除的訊息</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click.stop="deletePopUp = !deletePopUp">
                        取消
                    </div>
                    <div
                        type="button"
                        class="confirm"
                        @click.stop="confirmDelete($route.query.chatToken)"
                    >
                        確定
                    </div>
                </div>
            </div>
        </div>
    </teleport> -->
</template>

<script setup lang="ts">
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import {
    ref,
    computed,
    onMounted,
    onUpdated,
    watch,
    watchEffect,
    nextTick,
    onBeforeUpdate,
} from "vue";
import useClipboard from "vue-clipboard3";
import { api as viewerApi } from "v-viewer";
import { storeToRefs } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import Compressor from "compressorjs";
import { PlayCircleSharp, PauseCircleSharp, ArrowDownCircle } from "@vicons/ionicons5";
import { NConfigProvider, NEllipsis, NCheckboxGroup, NCheckbox, NAvatar, NIcon } from "naive-ui";
import { useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useSearchStore } from "@/store/search";
import { txt } from "@/util/interfaceUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import phoneIcon from "@/assets/Images/common/phone-round.svg";
import messageIcon from "@/assets/Images/common/message-round.svg";
import {
    scrollPageTo,
    localStorageMsg,
    chatroomID,
    convertTime,
    DO_CALL_NAME,
} from "@/util/commonUtil";
import { currentTime, currentDate, currentMonth } from "@/util/dateUtil";
import UserInfoModel from "@/components/UserInfoModel.vue";
import config from "@/config/config";

const apiStore = useApiStore();
const { getBackendApi } = apiStore;
const { eventInfo } = storeToRefs(apiStore);
const timeOutEvent = ref(0);

// 彈窗 store
const modelStore = useModelStore();
const { showCompanyInfo, gotoPhone, closeAll } = modelStore;
const { info, phoneCallModal } = storeToRefs(modelStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall, phoneTime } = phoneCallStore;

//router
const route = useRoute();

//拿取後端api
getBackendApi(route.query.chatToken);
//更改naive-ui 套件主題
const themeOverrides = {
    common: {},
    Checkbox: {
        size: "25px",
        colorChecked: "#01bad4",
        borderRadius: "50%",
        border: "2px solid #01bad4",
        borderChecked: "2px solid #01bad4",
        borderFocus: "2px solid #01bad4",
        boxShadowFocus: "0 0 0 1px #01bad4",
    },
};
//chat store
const chatStore = useChatStore();
const { replyMsgEvent, confirmDelete, deleteQuestion, closeRecorder } = chatStore;
let {
    messages,
    msg,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    replyMsg,
    pictures,
    textPlugin,
    isReplyBox,
    inputFunctionBoolean,
} = storeToRefs(chatStore);

const onPhoneCallModal = () => {
    phoneCallModal.value = true;
    doCall(DO_CALL_NAME);
};

//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;

//聊天室功能
const preDate: any = ref([]);
const viewImgs: any = ref([]);

//拖拽上傳
const dropActive = ref(false);
const files = ref();
const dropEvent = (e: any) => {
    dropActive.value = false;
    e.stopPropagation();
    e.preventDefault();
    onUploadFile(e.dataTransfer.files);
};

//開始按
const gtouchstart = (msg: txt) => {
    timeOutEvent.value = setTimeout(function () {
        longPress(msg);
        console.log("長按");
    }, 500);
    return false;
};
//手釋放，如果在500毫秒内就釋放，則取消長按事件，此时可以執行onclick執行事件
const gtouchend = () => {
    clearInterval(timeOutEvent.value);
    if (timeOutEvent.value != 0) {
        console.log("點擊");
    }
    return false;
};
//如果手指有移動，則取消所有事件，此时說名用户只是要移動而不是長按
const gtouchmove = () => {
    clearTimeout(timeOutEvent.value); //清除定时器
    timeOutEvent.value = 0;
};

//真正長按後應該執行的内容
const longPress = (msg: any) => {
    timeOutEvent.value = 0;
    closeBubble(msg);
};

//上傳檔案
const dropFiles = ref();
const image = ref();
const onUploadFile = (file: any) => {
    const fileArr = file[0];
    const fileArrType = file[0].type;
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
                                // currentMonth: "2022-1",
                                currentMonth: currentMonth(),
                                expirationDate: dayjs.unix(res.data.data.exp).format("YYYY-MM-DD"),
                                isExpire: false,
                                isRead: false,
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
                    dropFiles.value = e.target.result;

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
                        isRead: false,
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
};

const track: any = ref();
const newTime: any = ref("0:00");
const toggleAudio = (msg: any) => {
    track.value = document.getElementById(`audio-player-${msg.id}`);

    if (track.value.paused) {
        track.value.play();
        console.log(track.value);
        console.log("currentTime.value:", track.value.currentTime);
        console.log("play.paused:", track.value.paused);
        msg.janusMsg.format.isPlay = true;
        track.value.addEventListener(
            "timeupdate",
            () => {
                newTime.value = convertTime(track.value.currentTime);
            },
            false
        );
        track.value.addEventListener(
            "ended",
            () => {
                track.value.pause();
                track.value.currentTime = 0;
                newTime.value = "0:00";
                msg.janusMsg.format.isPlay = false;
            },
            false
        );
    } else {
        track.value.pause();
        track.value.currentTime = 0;
        newTime.value = "0:00";
        console.log("pause.paused:", track.value.paused);
        msg.janusMsg.format.isPlay = false;
    }
};
onMounted(() => {
    //拖拽上傳
    let dropArea = document.getElementById("drop-area");
    dropArea?.addEventListener("drop", dropEvent, false);
    dropArea?.addEventListener("dragleave", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = false;
    });
    dropArea?.addEventListener("dragenter", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = true;
    });
    dropArea?.addEventListener("dragover", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = true;
    });
});

onMounted(() => {
    scrollToBottom();
});

onUpdated(() => {
    scrollHeight.value = findScrollHeight.value.scrollHeight;
});

const chatroomScrolltop = ref(0);
const chatroomWindowHeight = ref(0);
const chatroomScrolltopAndWindowHeight = ref(0);
const chatroomScrollHeight = ref(0);

const chatroomToBottom = (e: any) => {
    chatroomScrolltop.value = e.target.scrollTop;
    chatroomWindowHeight.value = e.target.clientHeight;
    chatroomScrollHeight.value = e.target.scrollHeight;
    chatroomScrolltopAndWindowHeight.value = chatroomScrolltop.value + chatroomWindowHeight.value;
};

//聊天室置底功能
const findScrollHeight: any = ref(null);
const scrollHeight: any = ref(0);

nextTick(() => {
    scrollHeight.value = findScrollHeight.value.scrollHeight;
    scrollToBottom();
});

onUpdated(() => {
    scrollHeight.value = findScrollHeight.value.scrollHeight;
});
watch(scrollHeight, (newValue, oldValue) => {
    if (newValue > oldValue) {
        scrollToBottom();
    }
});

//聊天室滾動條置底
const scrollToBottom = (): void => {
    findScrollHeight.value.scrollTop = scrollHeight.value;
    console.log("findScorllHeight:", findScrollHeight.value.scrollTop);
};

//重新編輯
const reEdit = (id: string): void => {
    messages.value.forEach((text: txt) => {
        if (text.id === id) {
            msg.value = text.janusMsg.message;
        }
    });
};

//複製訊息
const { toClipboard } = useClipboard();
const copyMsg = async (text: any) => {
    try {
        await toClipboard(text.janusMsg.message);
    } catch (e) {
        console.error(e);
    }
    text.msgFunctionStatus = false;
};

//取消訊息功能泡泡
const closeBubble = (text: txt): void => {
    messages.value.forEach((item: txt) => {
        if (item === text) {
            text.msgFunctionStatus = !text.msgFunctionStatus;
        } else {
            item.msgFunctionStatus = false;
        }
    });
};

//下載圖片
const downloadImage = (text: txt): void => {
    text.msgFunctionStatus = false;
};

//收回訊息
const recallMsg = (id: string): void => {
    messages.value.forEach((text: txt) => {
        if (text.id === id) {
            text.recallStatus = true;
        }
        if (text.replyObj && text.replyObj.id === id) {
            text.replyObj.recallStatus = true;
        }
    });
    localStorageMsg(messages.value, route.query.chatToken);
};

//收回彈窗
const confirmRecallPopup = (text: txt): void => {
    messages.value.forEach((item: txt) => {
        if (item.id === text.id) {
            text.msgFunctionStatus = false;
            item.recallPopUp = !item.recallPopUp;
        }
        if (item.replyObj && item.replyObj.id === text.id) {
            item.replyObj.recallPopUp = !item.replyObj.recallPopUp;
        }
    });
};

// 圖片展示
const previewURL = (fileid: string): void => {
    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.serverUrl}/image/${img.janusMsg.format.Fileid}${img.ext}`
            ) &&
            img.janusMsg.msgType === 6
        ) {
            viewImgs.value.push(
                `${config.serverUrl}/image/${img.janusMsg.format.Fileid}${img.ext}`
            );
        }
    });
    console.log("picture:", viewImgs.value);

    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[4].split(".")[0]))
        .indexOf(fileid);
    viewerApi({
        options: {
            initialViewIndex: viewIndex,
            movable: false,
            scalable: false,
            className: "v-wrap",
            viewed(e) {
                const fileName = e.detail.originalImage.currentSrc.split("/").pop();
                const fileId = fileName.substring(0, fileName.lastIndexOf("."));
                const wrap = document.getElementsByClassName("v-wrap");
                const div = document.createElement("div");
                const a = document.createElement("a");
                a.href = `${config.serverUrl}/file/1GdSC2wd/${fileId}`;
                a.download = fileName;
                a.className = "download";
                a.innerHTML = `<span class="downloadImg"></span>`;
                wrap[0].appendChild(div).appendChild(a);
            },
        },
        images: viewImgs.value,
    });
};
watchEffect(() => {
    pictures.value = JSON.parse(localStorage.getItem(`${route.query.chatToken}-pictures`) || "[]");
});
</script>
<style lang="scss">
@import "~@/assets/scss/var";
// 圖片預覽套件下載按鈕
.download {
    position: fixed;
    left: 330px;
    top: 0;
    width: 40px;
    height: 40px;
    outline: none;
    a {
        display: block;
        width: 40px;
        height: 40px;
        outline: none;
    }
    .downloadImg {
        display: block;
        background: url("~@/assets/Images/common/download.svg");
        background-color: rgba(0, 0, 0, 0.8);
        background-size: 95% auto;
        width: 40px;
        height: 40px;
        border: 0;
        outline: none;
    }
}
@media (max-width: 768px) {
    .download {
        left: 0;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

@keyframes shakeX {
    from,
    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        -webkit-transform: translate3d(-3px, 0, 0);
        transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        -webkit-transform: translate3d(3px, 0, 0);
        transform: translate3d(5px, 0, 0);
    }
}
@-webkit-keyframes shakeX {
    from,
    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        -webkit-transform: translate3d(-3px, 0, 0);
        transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        -webkit-transform: translate3d(3px, 0, 0);
        transform: translate3d(5px, 0, 0);
    }
}
* {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

//收回訊息確認的彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 330px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 20px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .recallMsgConfirm {
            font-size: $font-size-16;
            color: $gray-1;
            letter-spacing: -0.1px;
            min-width: 342px;
            text-align: left;
            line-height: 22px;
        }
        .buttonContainer {
            margin-top: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            & .cancel {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $white;
                color: $gray-5;
                margin-right: 16px;
                &:hover,
                &:active {
                    background: $gray-4;
                    color: $white;
                }
            }
            & .confirm {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $primary-2;
                color: $white;
                &:hover,
                &:active {
                    background-color: $primary-1;
                }
            }
        }
    }
}
@media (max-width: 768px) {
    .mask {
        left: 0;
    }
}

.animate__shakeX {
    animation: shakeX;
    -webkit-animation: shakeX;
    animation-duration: 900ms;
    -webkit-animation-duration: shakeX;
}
.card {
    width: 300px;
    .n-card > .n-card__content,
    .n-card > .n-card__footer {
        --padding-left: 0;
        padding: 0 var(--padding-left);
    }
    .userPhoto {
        margin-bottom: 1em;
        text-align: center;
    }
    .userName {
        text-align: center;
        font-size: $font-size-20;
    }
    .description {
        width: 80%;
        text-align: center;
        margin: 1em auto;
        color: $gray-3;
        font-size: $font-size-15;
        line-height: 1.6;
    }
}
.chatroom-inner {
    width: 100%;
    position: absolute;
    top: 160px;
    bottom: 67px;
    overflow-y: scroll;
    height: auto;
    background-color: $gray-8;
    box-sizing: border-box;
    .background {
        padding-top: 0;
    }
    .dialog-box {
        display: flex;
        justify-content: flex-end;
        padding: 10px 15px;
        &:hover {
            .dialog {
                .dialog-inner {
                    .msg_more {
                        display: inline-block;
                    }
                }
            }
            @media (max-width: 768px) {
                .dialog {
                    .dialog-inner {
                        .msg_more {
                            display: none;
                        }
                    }
                }
            }
        }
        &.delChoice {
            justify-content: space-between;
            .deleteCheckBox {
                margin-right: 12px;
                .n-checkbox .n-checkbox-box {
                    --size: 20px;
                    height: var(--size);
                    width: var(--size);
                }
            }
        }
        &.recallChoice {
            justify-content: center;
        }
        &.myMsg {
            text-align: right;
            &.dateMsg {
                display: block;
            }
        }
        &.yourMsg {
            justify-content: flex-start;
            &.dateMsg {
                display: block;
            }
            .dialog {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                .dialog-inner {
                    .msgFunction {
                        left: initial;
                        right: 0px;
                        top: 30px;
                    }
                    .avatar {
                        margin-right: 10px;
                        .n-avatar {
                            cursor: pointer;
                        }
                    }
                    .content {
                        max-width: 200px;
                        border-radius: 5px 20px 20px 20px;
                        margin-left: 0px;
                        margin-right: 10px;
                        background-color: $gray-7;
                    }

                    .msg_more {
                        left: initial;
                        right: -80px;
                    }
                }
            }
        }
        @media (max-width: 768px) {
            &.yourMsg {
                .dialog {
                    .dialog-inner {
                        .msgFunction {
                            right: 0;
                            top: inherit;
                            bottom: -50px;
                        }
                    }
                }
            }
        }

        &.dateMsg {
            .date {
                display: block;
                margin-bottom: 20px;
                div {
                    max-width: 100px;
                    height: 27px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 5px 10px;
                    background-color: $gray-1;
                    opacity: 0.3;
                    color: $white;
                    font-size: $font-size-12;
                    border-radius: 14px;
                    span {
                        cursor: pointer;
                    }
                }
            }
        }

        .recall {
            padding: 10px 14px;
            div {
                width: 180px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                padding: 3px 10px;
                background-color: rgba(65, 73, 78, 0.2);
                color: $gray-3;
                font-size: $font-size-14;
                line-height: 16px;
                border-radius: 100px;
                span {
                    cursor: pointer;
                }
            }
        }
        .dialog {
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-end;
            position: relative;

            .dialog-inner {
                display: inline-flex;
                justify-content: flex-end;
                position: relative;
                .msgFunction {
                    &.mobile {
                        display: none;
                    }
                    cursor: pointer;
                    position: absolute;
                    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                    border-radius: 4px;
                    top: 30px;
                    left: 5px;
                    z-index: 1;
                    .ulList {
                        background-color: $primary-3;
                        li {
                            width: 58px;
                            height: 40px;
                            padding: 10px 15px 9px 15px;
                            text-align: center;
                            display: block;
                            color: $gray-1;
                            border-bottom: 1px solid $white;
                            span {
                                font-size: $font-size-14;
                                font-weight: 500;
                            }
                            a {
                                font-size: $font-size-14;
                                font-weight: 500;
                                color: $gray-1;
                                text-decoration: none;
                            }
                        }
                        li:last-child {
                            border-bottom: 0px;
                        }
                    }
                }

                .msg_more {
                    display: none;
                    cursor: pointer;
                    transition: 0.2s;
                    position: absolute;
                    left: -80px;
                    bottom: 0;

                    img {
                        display: block;
                        width: 20px;
                    }
                    &.show {
                        display: inline-block;
                    }
                }

                @media (max-width: 768px) {
                    .msg_more {
                        display: none;
                        &.show {
                            display: none;
                        }
                    }
                    .msgFunction {
                        &.mobile {
                            display: inline-table;
                        }
                        position: absolute;
                        box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                        border-radius: 4px;
                        top: inherit;
                        bottom: -50px;
                        left: inherit;
                        right: 0;
                        z-index: 1;
                        .ulList {
                            display: flex;
                            background-color: $primary-3;
                            li {
                                width: 58px;
                                height: 40px;
                                padding: 10px 9px 10px 10px;
                                text-align: center;
                                display: block;
                                color: $gray-1;
                                border-right: 1px solid $white;
                                border-bottom: 0;
                                span {
                                    font-size: $font-size-14;
                                    font-weight: 500;
                                }
                                a {
                                    font-size: $font-size-14;
                                    font-weight: 500;
                                    color: $gray-1;
                                    text-decoration: none;
                                }
                            }
                            li:last-child {
                                border-right: 0px;
                            }
                        }
                    }
                }
                .content {
                    max-width: 240px;
                    word-wrap: break-word;
                    word-break: break-all;
                    white-space: pre-wrap;
                    background-color: $primary-1;
                    border-radius: 20px 5px 20px 20px;
                    padding: 10px;
                    text-align: left;
                    align-items: center;
                    flex-direction: column;
                    line-height: 1.5;
                    margin-left: 10px;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    &.reply {
                        min-width: 70px;
                    }
                    &.audio {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-direction: row;
                        width: 165px;
                        &.play {
                            justify-content: flex-start;
                            span {
                                margin-left: 10%;
                            }
                        }
                        .n-icon {
                            margin-right: 10px;
                        }
                        .totalTime {
                            font-size: $font-size-14;
                            font-weight: 500;
                            margin-right: 10px;
                        }
                        .audioWave {
                            width: 55px;
                            height: 20px;
                            margin-right: 5px;
                        }
                    }
                    &.icon {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        flex-direction: row;
                        border-radius: 8px;
                        > img {
                            margin-top: 4px;
                            width: 18px;
                            -webkit-touch-callout: none;
                            -webkit-user-select: none;
                            -khtml-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                        }
                        .fileDescription {
                            margin-left: 8px;
                            .ellipsisName.n-ellipsis {
                                @extend %h4;
                                color: $gray-1;
                                font-family: $font-family;
                            }
                            p {
                                font-size: $font-size-12;
                                font-weight: 500;
                                color: $gray-1;
                                font-family: $font-family;
                            }
                        }
                    }
                    &.phoneMsg {
                        height: 57px;
                        > a.phone {
                            display: none;
                            flex-direction: row;
                            justify-content: space-around;
                            align-items: center;
                            text-decoration: none;
                            .phonePic {
                                margin-right: 10px;
                            }
                            .phoneStatus {
                                h4 {
                                    @extend %h4;
                                    color: $gray-1;
                                    font-family: $font-family;
                                }
                                p {
                                    font-size: $font-size-12;
                                    font-weight: 500;
                                    color: $gray-1;
                                    font-family: $font-family;
                                }
                            }
                        }
                        @media (max-width: 768px) {
                            > a.phone {
                                display: flex;
                            }
                        }
                        > a.phone-web {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            align-items: center;
                            text-decoration: none;
                            cursor: pointer;
                            .phonePic {
                                margin-right: 10px;
                            }
                            .phoneStatus {
                                h4 {
                                    @extend %h4;
                                    color: $gray-1;
                                    font-family: $font-family;
                                }
                                p {
                                    font-size: $font-size-12;
                                    font-weight: 500;
                                    color: $gray-1;
                                    font-family: $font-family;
                                }
                            }
                        }
                        @media (max-width: 768px) {
                            > a.phone-web {
                                display: none;
                            }
                        }
                    }
                }
                .originalMsg {
                    font-size: $font-size-14;
                    font-weight: 500;
                    color: $gray-1;
                    display: flex;
                    justify-content: flex-start;
                }

                .replyMsg {
                    font-size: $font-size-14;
                    color: #a37f29;
                    margin-left: -10px;
                    margin-right: -10px;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    line-height: 1.5;
                    border-bottom: 1px solid $primary-2;
                    &:hover {
                        cursor: pointer;
                    }
                    &.noMsgClick {
                        cursor: text;
                    }
                    .info {
                        max-width: 168px;
                        word-wrap: break-word;
                        white-space: pre-wrap;
                        font-size: $font-size-12;
                        padding-left: 10px;
                        margin-right: 5px;
                        &.noMsg {
                            color: $gray-2;
                        }
                        &.isImg {
                            min-width: 60px;
                        }
                    }
                    .userName {
                        font-weight: 900;
                        font-size: $font-size-14;
                    }
                    .replyImg {
                        width: 50%;
                        height: 30%;
                        padding-right: 10px;
                        overflow: hidden;
                    }
                    img {
                        width: 100%;
                        object-fit: cover;
                    }
                }
                .picture {
                    margin-left: 10px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 100px;
                    height: 150px;

                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    /* Firefox, Chrome */
                    line-height: 148px;
                    white-space: nowrap;
                    text-align: center;

                    /* IE */
                    *font-size: 135px; /* 200px * 0.9 = 180px */
                    overflow: hidden;
                    background-color: $white;
                    &:hover {
                        cursor: pointer;
                    }
                    &:after {
                        content: ".";
                        font-size: 0;
                        -webkit-text-size-adjust: none;
                    }
                    img {
                        vertical-align: middle;
                        max-width: 150px;
                        max-height: 150px;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                }
                .googleMapsMsg {
                    border-radius: 8px;
                    a {
                        color: $gray-1;
                        font-size: $font-size-14;
                        text-decoration: none;
                    }
                    .img {
                        width: 100%;
                        height: 100px;
                        overflow: hidden;
                        display: inline-block;
                        border-radius: 6px;
                    }
                    img {
                        width: 100%;
                        object-fit: contain;
                    }
                }
            }
            .timestamp {
                display: flex;
                flex-direction: column;
                span {
                    display: block;
                    color: $gray-3;
                    font-size: $font-size-12;
                    font-weight: 400;
                    line-height: 17px;
                }
            }
        }
    }
    .scrollToBottom {
        position: fixed;
        right: 20px;
        bottom: 70px;
        border-radius: 50%;
        z-index: 1;
        cursor: pointer;
    }
}

@media screen and (max-width: 768px) {
    .chatroom-inner {
        position: absolute;
        top: 140px;
        bottom: 67px;
        overflow-y: scroll;
        height: auto;
        padding: 0;
        .background {
            padding-top: 0;
            padding-bottom: 0px;
        }
    }
}
.dropActive {
    background-color: rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 450px) {
    .card {
        width: 90%;
    }
}
</style>

<template>
    <!-- <div
        id="drop-area"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner notMsg"
        ref="findScrollHeight"
        v-if="messageArray.length === 0"
    >
        尚無聊天訊息!!
    </div> -->
    <div
        id="drop-area"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner"
        ref="findScrollHeight"
        @click="closeAll"
        @scroll="chatroomToBottom($event)"
    >
        <div class="background" v-if="messageArray.length > 0">
            <!-- 對話區塊 -->

            <div
                class="dialog-box"
                :class="{
                    otherMsg: text.janusMsg.sender === 1,
                    myMsg: text.janusMsg.sender === 0,
                    mapMsg: text.janusMsg.msgType === 8,
                    mobileMsg:
                        text.janusMsg.msgType === 9 ||
                        text.janusMsg.msgType === 5 ||
                        text.janusMsg.msgType === 8,
                    delChoice: deleteBoolean,
                    recallChoice: text.janusMsg.config.recallStatus,
                    dateMsg:
                        index === 0 ||
                        (index > 0 &&
                            dateFormat(text.janusMsg.config.currentDate) !==
                                dateFormat(messageArray[index - 1].janusMsg.config.currentDate)),
                }"
                v-for="(text, index) in messageArray"
                :key="index"
                :id="text.janusMsg.config.id"
            >
                <!-- {{ text }} -->

                <!-- 日期樣板 -->
                <div
                    v-if="
                        (index > 0 &&
                            dateFormat(text.janusMsg.config.currentDate) !==
                                dateFormat(messageArray[index - 1].janusMsg.config.currentDate)) ||
                        (index === 0 && dateFormat(text.janusMsg.config.currentDate))
                    "
                    class="date"
                >
                    <div>
                        {{
                            dateFormat(text.janusMsg.config.currentDate) === currentDate()
                                ? "今天"
                                : dateFormat(text.janusMsg.config.currentDate)
                        }}
                    </div>
                </div>
                <!-- <n-checkbox-group
                    v-model:value="deleteGroup"
                    v-if="deleteBoolean && !text.recallStatus"
                >
                    <div class="deleteCheckBox">
                        <n-config-provider :theme-overrides="themeOverrides">
                            <n-checkbox :value="text.id" label="" />
                        </n-config-provider>
                    </div>
                </n-checkbox-group> -->

                <!-- 收回訊息樣板 -->
                <div
                    class="recall"
                    v-if="text.janusMsg.config.recallStatus && text.janusMsg.msgType !== 10"
                >
                    <!-- {{ text }} -->
                    <div>
                        <p v-if="text.janusMsg.sender === 0">
                            您已收回訊息&emsp;
                            <span
                                v-if="text.janusMsg.msgContent"
                                @click="reEdit(text.janusMsg.config.id)"
                            >
                                <u>重新編輯</u>
                            </span>
                        </p>
                        <p v-if="text.janusMsg.sender === 1">對方已收回訊息</p>
                    </div>
                </div>

                <!-- 聊天對話框樣板-->
                <div class="dialog" v-else>
                    <div class="dialog-inner">
                        <!-- 收回訊息滿版 popup 出現 -->
                        <teleport to="body">
                            <div class="mask" v-if="text.janusMsg.config.recallPopUp">
                                <div class="RecallPopUp">
                                    <div class="recallMsgConfirm">您確定要收回訊息嗎 ?</div>
                                    <div class="buttonContainer">
                                        <div
                                            type="button"
                                            class="cancel"
                                            @click.stop="
                                                text.janusMsg.config.recallPopUp =
                                                    !text.janusMsg.config.recallPopUp
                                            "
                                        >
                                            取消
                                        </div>
                                        <div
                                            type="button"
                                            class="confirm"
                                            @click.stop="recallMsg(text)"
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
                            :class="{ show: text.janusMsg.config.msgFunctionStatus }"
                            @click.stop="onBubble(text)"
                            v-if="text.janusMsg.msgType !== 10"
                        >
                            <img :src="moreIcon" alt="more" />
                            <!-- 訊息功能框 -->
                            <div
                                class="msgFunction"
                                v-show="text.janusMsg.config.msgFunctionStatus"
                            >
                                <ul class="ulList">
                                    <li
                                        v-if="text.janusMsg.msgType === 1"
                                        @click.stop="copyMsg(text)"
                                    >
                                        <span>複製</span>
                                    </li>
                                    <li
                                        v-if="[7, 6].includes(text.janusMsg.msgType)"
                                        @click.stop="downloadImage(text)"
                                    >
                                        <a
                                            :href="`${config.serverUrl}/v1/file/${text.janusMsg.format.Fileid}`"
                                            target="_blank"
                                        >
                                            下載
                                        </a>
                                    </li>
                                    <!-- <li @click.stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                    <li
                                        v-if="
                                            text.janusMsg.sender === 0 && text.janusMsg.type !== 1
                                        "
                                        @click.stop="confirmRecallPopup(text)"
                                    >
                                        <span>收回</span>
                                    </li>
                                    <li
                                        v-if="
                                            [1, 3, 6].includes(text.janusMsg.msgType) &&
                                            text.janusMsg.type === 2
                                        "
                                        @click.stop="replyMsgEvent(text)"
                                    >
                                        <span>回覆</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 對方頭像 -->
                        <div class="avatar" v-if="text.janusMsg.sender === 1 && !deleteBoolean">
                            <n-avatar
                                class="userImg"
                                :size="42"
                                round
                                object-fit="cover"
                                :fallback-src="user_pic_defaul"
                                :src="img"
                            />
                        </div>
                        <!-- 訊息 -->
                        <div
                            class="content"
                            :class="{
                                reply: text.janusMsg.config.isReply,
                            }"
                            v-if="text.janusMsg.msgType === 1"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <!-- 回覆 -->
                            <div
                                class="replyMsg"
                                :class="{
                                    noMsgClick: !text.janusMsg.config.isReply,
                                }"
                                v-if="text.janusMsg.config.isReply"
                                @click.prevent="
                                    text.janusMsg.config.isReply
                                        ? scrollPageTo(
                                              text.janusMsg.config.replyObj.janusMsg.config.id
                                          )
                                        : null
                                "
                            >
                                <!-- <div
                                    class="info noMsg"
                                    v-if="text.format.replyObj.msgContent === ''"
                                >
                                    無法讀取原始訊息。
                                </div> -->
                                <div
                                    class="info"
                                    :class="{
                                        isImg:
                                            text.janusMsg.config.replyObj.janusMsg?.msgType === 6,
                                    }"
                                >
                                    <!-- {{ text.janusMsg.config.replyObj.janusMsg }} -->
                                    <div
                                        class="userName"
                                        v-if="text.janusMsg.config.replyObj.janusMsg?.sender === 1"
                                    >
                                        {{ "+" + String(mobile).slice(0, 3) }}
                                        {{ String(mobile).slice(-9) }}
                                    </div>
                                    <!-- 回覆照片顯示照片 -->
                                    <div
                                        v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 6"
                                    >
                                        [照片]
                                    </div>

                                    <!-- 回覆訊息 -->
                                    <n-ellipsis
                                        v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 1"
                                        style="width: 100%"
                                        :line-clamp="2"
                                        :tooltip="false"
                                    >
                                        {{ text.janusMsg.config.replyObj.janusMsg.msgContent }}
                                    </n-ellipsis>
                                </div>
                                <!-- 回覆貼圖格式 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 3"
                                >
                                    <img
                                        :src="`${text.janusMsg.config.replyObj.janusMsg.format.stickerUrl}${text.janusMsg.config.replyObj.janusMsg.format.stickerPackID}/${text.janusMsg.config.replyObj.janusMsg.format.stickerFileID}.${text.janusMsg.config.replyObj.janusMsg.format.ext}`"
                                    />
                                </div>

                                <!-- 回覆圖片格式 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 6"
                                >
                                    <!-- {{ text.janusMsg.config.replyObj.janusMsg.format }} -->
                                    <img
                                        :src="`${config.fileUrl}${text.janusMsg.config.replyObj.janusMsg.format.Fileid}${text.janusMsg.config.replyObj.janusMsg.format.ExtensionName}`"
                                    />
                                </div>
                            </div>
                            <!-- 文字訊息 -->
                            <div class="originalMsg">
                                <p v-linkify:options="{ target: '_blank' }">
                                    {{ text.janusMsg.msgContent }}
                                </p>
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
                                    ><img :src="googleMapIcon" alt="google maps"
                                /></span>
                                查看地圖
                            </a>
                        </div>
                        <!-- audio -->
                        <div
                            class="audio content"
                            :class="{ play: text.janusMsg.config.isPlay }"
                            v-if="text.janusMsg.msgType === 5"
                        >
                            <audio :id="`audio-player-${text.janusMsg.config.id}`">
                                <source
                                    :src="`${config.fileUrl}${text.janusMsg.format.Fileid}.wav`"
                                    type="audio/wav"
                                />
                                Your browser does not support the audio tag.
                            </audio>
                            <n-icon @click="toggleAudio(text)" size="24">
                                <pause-circle-sharp v-show="text.janusMsg.config.isPlay" />
                                <play-circle-sharp v-show="!text.janusMsg.config.isPlay" />
                            </n-icon>
                            <span v-show="text.janusMsg.config.isPlay">{{ newTime }}</span>
                            <span v-show="!text.janusMsg.config.isPlay" class="totalTime">
                                {{ convertTime(text.janusMsg.format.SoundLength) }}
                            </span>
                            <img
                                class="audioWave"
                                v-show="!text.janusMsg.config.isPlay"
                                :src="audioIcon"
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
                                :src="`${config.fileUrl}${text.janusMsg.format.Fileid}${text.janusMsg.format.ExtensionName}`"
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
                            <img :src="fileIcon" alt="檔案" />
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
                                <p>
                                    下載期限&thinsp;:&thinsp;{{
                                        text.janusMsg.format.expirationDate
                                    }}
                                </p>
                            </div>
                        </div>
                        <!-- 電話訊息 -->
                        <div
                            class="phoneMsg content"
                            v-else-if="text.janusMsg.msgType === 9"
                            @touchend="doCall(chatRoomID)"
                        >
                            <a class="phone-web" @click="onPhoneCallModal(chatRoomID)">
                                <div class="phonePic">
                                    <img :src="phoneIcon" alt="撥打電話" />
                                </div>
                                <div
                                    class="phoneStatus"
                                    v-if="!text.janusMsg.format.phoneTypeOther"
                                >
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
                        <!-- 貼圖訊息 -->
                        <div
                            class="sticker"
                            v-if="text.janusMsg.msgType === 3"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img
                                :src="`${text.janusMsg.format.stickerUrl}${text.janusMsg.format.stickerPackID}/${text.janusMsg.format.stickerFileID}.${text.janusMsg.format.ext}`"
                            />
                        </div>
                    </div>
                    <!-- 時間戳記 -->
                    <div
                        class="timestamp"
                        :class="{ yourTimeStamp: text.janusMsg.sender === 0 }"
                        v-if="text.janusMsg.msgType !== 10"
                    >
                        <div class="mms" v-if="text.janusMsg.type === 1">以簡訊發送</div>
                        <span v-if="text.janusMsg.config.isRead && text.janusMsg.sender === 0"
                            >已讀</span
                        >
                        <span>{{ currentTime(text.janusMsg.time / 1000000) }}</span>
                    </div>
                </div>
                <n-icon
                    size="30"
                    class="scrollToBottom"
                    v-show="
                        chatroomScrolltopAndWindowHeight < chatroomScrollHeight - 1 &&
                        !text.janusMsg.config.replyObj &&
                        !isReplyBox &&
                        !inputFunctionBoolean &&
                        !showStickerModal &&
                        !isResult
                    "
                    @click="scrollToBottom"
                >
                    <arrow-down-circle />
                </n-icon>
                <div
                    class="userName"
                    v-if="text.janusMsg.config.userName && !text.janusMsg.config.recallStatus"
                >
                    由&thinsp;{{ text.janusMsg.config.userName }}&thinsp;所傳送
                </div>
            </div>
        </div>
    </div>
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
                        @click.stop="confirmDelete($route.params.id)"
                    >
                        確定
                    </div>
                </div>
            </div>
        </div>
    </teleport> -->
</template>
<script lang="ts">
export default {
    name: "MessageBox",
    inheritAttrs: false,
};
</script>
<script setup lang="ts">
import {
    ref,
    computed,
    onMounted,
    onUpdated,
    watch,
    nextTick,
    reactive,
    onBeforeUnmount,
} from "vue";
import useClipboard from "vue-clipboard3";
import { api as viewerApi } from "v-viewer";
import { storeToRefs } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import Compressor from "compressorjs";
import { PlayCircleSharp, PauseCircleSharp, ArrowDownCircle } from "@vicons/ionicons5";
import { NEllipsis, NCheckboxGroup, NCheckbox, NAvatar, NIcon } from "naive-ui";
import { useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useSearchStore } from "@/store/search";
import { txt } from "@/util/interfaceUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";
import { scrollPageTo, convertTime, imgList, resetSetItem } from "@/util/commonUtil";
import { unixTime, currentDate, dateFormat, currentTime } from "@/util/dateUtil";
import config from "@/config/config";
import moreIcon from "@/assets/Images/chatroom/more.svg";
import googleMapIcon from "@/assets/Images/chatroom/map.jpg";
import audioIcon from "@/assets/Images/chatroom/audio.svg";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";
import phoneIcon from "@/assets/Images/chatroom/phone-fill-round-y.svg";

const props = defineProps({
    eventID: String,
});

//api store
const apiStore = useApiStore();
const { getHistoryApi, recallAPI } = apiStore;
const { messageList, msgStart, totalCount, userInfo, chatroomList } = storeToRefs(apiStore);
const timeOutEvent = ref(0);

// 彈窗 store
const modelStore = useModelStore();
const { showCompanyInfo, closeAll } = modelStore;
const { info, phoneCallModal } = storeToRefs(modelStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall, phoneTime } = phoneCallStore;
const { sender } = storeToRefs(phoneCallStore);

//router
const route = useRoute();

const getUserName = localStorage.getItem("userName");
//chat store
const chatStore = useChatStore();
const { replyMsgEvent, deleteQuestion, closeRecorder } = chatStore;
let {
    messages,
    msg,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    replyMsg,
    textPlugin,
    isReplyBox,
    inputFunctionBoolean,
    showStickerModal,
    isOnline,
} = storeToRefs(chatStore);

const onPhoneCallModal = (chatRoomID) => {
    sender.value = 0;
    phoneCallModal.value = true;
    doCall(chatRoomID);
};

//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;
const { isResult } = storeToRefs(searchStore);
const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);

const messageArray: any = computed({
    get() {
        return messageList.value;
    },
    set(val) {
        messageList.value = val;
    },
});

const pictures: any = computed(() => {
    return messageList.value.filter((item) => {
        return item.janusMsg.msgType == 6;
    });
});

//聊天室功能
const preDate: any = ref([]);
const viewImgs: any = ref([]);

let getCurChatRoomId: any = reactive({});
// 環境設定
const isProduction = process.env.NODE_ENV === "production";
const getSplit = isProduction ? 4 : 5;
const img = computed(() => {
    getCurChatRoomId = chatroomList.value.find((obj) => {
        return obj.chatroomID === chatRoomID.value;
    });
    return imgList.find((item) => {
        // console.log('save item.split("/"):', getCurChatRoomId.icon);
        const icon =
            item.split("/")[getSplit] === "default.svg"
                ? 0
                : item.split("/")[getSplit].split(".")[0];
        return getCurChatRoomId?.icon ? icon == getCurChatRoomId.icon : "default.svg";
    });
});

//判斷a連結
const validURL = (str) => {
    try {
        new URL(str);
    } catch (_) {
        return false;
    }
    return true;
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
    onBubble(msg);
};

//拖拽上傳
const dropActive = ref(false);
const files = ref();
const dropEvent = (e: any) => {
    dropActive.value = false;
    e.stopPropagation();
    e.preventDefault();
    onUploadFile(e.dataTransfer.files);
};
const dropFiles = ref();
const image = ref();

onMounted(() => {
    watch(messageArray, () => {
        if (messageArray.value.length > 0) {
            const dropArea = document.getElementById("drop-area");

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
        }
    });
});

const onUploadFile = (file: any) => {
    const fileArr = file[0];
    const fileArrType = file[0].type;
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
};

const track: any = ref();
const newTime: any = ref("0:00");
const toggleAudio = (msg: any) => {
    track.value = document.getElementById(`audio-player-${msg.janusMsg.config.id}`);
    if (track.value.paused) {
        track.value.play();
        console.log(track.value);
        console.log("currentTime.value:", track.value.currentTime);
        console.log("play.paused:", track.value.paused);
        msg.janusMsg.config.isPlay = true;
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
                msg.janusMsg.config.isPlay = false;
            },
            false
        );
    } else {
        track.value.pause();
        track.value.currentTime = 0;
        newTime.value = "0:00";
        console.log("pause.paused:", track.value.paused);
        msg.janusMsg.config.isPlay = false;
    }
};
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
    // console.log("視窗滾動高", chatroomScrollHeight.value);
    // console.log("視窗離頂部距離+視窗高", chatroomScrolltopAndWindowHeight.value);
};

//聊天室置底功能
const findScrollHeight: any = ref(null);
const scrollHeight: any = ref(0);

nextTick(() => {
    scrollHeight.value = findScrollHeight.value.scrollHeight;
    scrollToBottom();
});

watch(scrollHeight, (newValue, oldValue) => {
    if (newValue > oldValue) {
        scrollToBottom();
    }
});

//聊天室滾動條置底
const scrollToBottom = (): void => {
    findScrollHeight.value.scrollTop = scrollHeight.value;
};

const handleScroll = (e) => {
    if (e.target.scrollTop == 0) {
        loadMore();
    }
};

const loadMore = () => {
    if (totalCount.value >= 30) {
        msgStart.value = msgStart.value + 30 + 1;
        getHistoryApi(chatRoomID.value, props.eventID);
    }
};

window.addEventListener("scroll", handleScroll, true);

//重新編輯
const reEdit = (id: string): void => {
    messageList.value.forEach((text: txt) => {
        if (text.janusMsg.config.id !== id) return;
        msg.value = text.janusMsg.msgContent;
    });
};

//複製訊息
const { toClipboard } = useClipboard();
const copyMsg = async (text: any) => {
    try {
        await toClipboard(text.janusMsg.msgContent);
    } catch (e) {
        console.error(e);
    }
    text.janusMsg.config.msgFunctionStatus = false;
};

//訊息功能泡泡
const onBubble = (text: txt): void => {
    let arr = messageList.value.map((item: txt) => {
        if (item.janusMsg.config.id === text.janusMsg.config.id) {
            text.janusMsg.config.msgFunctionStatus = !text.janusMsg.config.msgFunctionStatus;
        } else {
            item.janusMsg.config.msgFunctionStatus = false;
        }
        return item;
    });
    messageList.value = arr;
};

//下載圖片
const downloadImage = (text: txt): void => {
    text.janusMsg.config.msgFunctionStatus = false;
};

//收回訊息
const recallMsg = (msg): void => {
    messageList.value.forEach((text: txt) => {
        if (text.janusMsg.config.id !== msg.janusMsg.config.id) return;
        text.janusMsg.config.recallStatus = true;
        text.janusMsg.config.recallPopUp = false;
    });
    recallAPI(msg, route.params.id, chatRoomID.value);
    const lastChatMessageArr = JSON.parse(
        sessionStorage.getItem(`${route.query.chatroomID}-lastChatMessage`)
    );
    lastChatMessageArr.forEach((item, index) => {
        if (msg.janusMsg.config.id === item.janusMsg.config.id) {
            lastChatMessageArr.splice(index, 1);
        }
    });
    resetSetItem(
        `${route.query.chatroomID}-lastChatMessage`,
        JSON.stringify(lastChatMessageArr.slice(-10))
    );
};

//收回彈窗
const confirmRecallPopup = (text: txt): void => {
    messageList.value.forEach((item: txt) => {
        if (item.janusMsg.config.id !== text.janusMsg.config.id) return;
        text.janusMsg.config.msgFunctionStatus = false;
        item.janusMsg.config.recallPopUp = !item.janusMsg.config.recallPopUp;
    });
};
// 圖片展示
const previewURL = (fileid: string): void => {
    pictures.value.forEach((img: any) => {
        if (
            viewImgs.value.includes(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            )
        )
            return;
        if (img.janusMsg.msgType === 6) {
            viewImgs.value.push(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            );
        }
    });
    // console.log(
    //     "viewImgs",
    //     viewImgs.value.map((img) => img.split("/"))
    // );
    // 環境設定
    const isProduction = process.env.NODE_ENV === "production";
    const getSplit = isProduction ? 3 : 4;
    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[getSplit].split(".")[0]))
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
                a.href = `${config.serverUrl}/v1/file/${fileId}`;
                a.target = "_blank";
                a.download = fileName;
                a.className = "download";
                a.innerHTML = `<span class="downloadImg"></span>`;
                wrap[0].appendChild(div).appendChild(a);
            },
        },
        images: viewImgs.value,
    });
};
</script>
<style lang="scss">
@import "~@/assets/scss/var";
.closeView {
    position: fixed;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    .closeImg {
        width: 80%;
        height: 80%;
    }
}
// 圖片預覽套件下載按鈕
.download {
    position: fixed;
    left: 0;
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
*:not(input.field) {
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
    .RecallPopUp {
        border-radius: 5px;
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
                background-color: $primary-3;
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
    top: 46px;
    bottom: 62px;
    overflow-y: scroll;
    height: auto;
    box-sizing: border-box;
    &.notMsg {
        padding-top: 20%;
        text-align: center;
        @extend %h2;
    }
    .background {
        padding-top: 0;
    }
    .dialog-box {
        // display: flex;
        // flex-direction: column;
        // justify-content: flex-end;
        padding: 10px 15px;
        &.mobileMsg {
            &:hover {
                .dialog {
                    .dialog-inner {
                        .msg_more {
                            display: none;
                        }
                    }
                }
            }
        }
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
        &.otherMsg {
            justify-content: flex-start;
            &.dateMsg {
                display: block;
            }
            .dialog {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                .dialog-inner {
                    .replyMsg {
                        border-bottom: 1px solid $gray-5;
                        .info {
                            color: $gray-4;
                        }
                        .userName {
                            color: $gray-4;
                        }
                    }
                    .msgFunction {
                        left: initial;
                        right: 0px;
                        top: 30px;
                    }
                    .avatar {
                        margin-right: 10px;
                    }
                    .content {
                        max-width: 900px;
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
            &.otherMsg {
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
                width: 210px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                padding: 3px 10px;
                background-color: rgba(65, 73, 78, 0.2);
                color: $gray-3;
                border-radius: 100px;
                p {
                    font-size: $font-size-14;
                    line-height: 16px;
                }
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
                align-items: center;
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
                        background-color: $primary-4;
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
                            background-color: $primary-4;
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
                    max-width: 900px;
                    word-wrap: break-word;
                    word-break: break-all;
                    white-space: pre-wrap;
                    background-color: $primary-4;
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
                    border-bottom: 1px solid $primary-3;
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
                        padding-right: 10px;
                        margin-right: 5px;
                        &.noMsg {
                            color: $gray-2;
                        }
                        &.isImg {
                            min-width: 60px;
                        }
                    }
                    .userName {
                        font-weight: 600;
                        font-size: $font-size-12;
                    }
                    .replyImg {
                        width: 40%;
                        height: 30%;
                        padding-right: 10px;
                        overflow: hidden;
                    }
                    img {
                        width: 100%;
                        object-fit: cover;
                    }
                }
                .sticker {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 150px;
                    height: 150px;
                    margin-left: 10px;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    line-height: 148px;
                    white-space: nowrap;
                    text-align: center;
                    img {
                        width: 100%;
                    }
                }
                .picture {
                    margin-left: 10px;
                    margin-right: 10px;
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
                    background-color: $gray-7;
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

                .mms {
                    font-size: $font-size-12;
                    margin-bottom: 4px;
                    color: $danger;
                }
                span {
                    display: block;
                    color: $gray-3;
                    font-size: $font-size-12;
                    font-weight: 400;
                    line-height: 17px;
                }
            }
        }
        .userName {
            color: $gray-4;
            font-size: $font-size-10;
            margin-top: 5px;
        }
    }
    .scrollToBottom {
        position: fixed;
        right: 285px;
        bottom: 70px;
        border-radius: 50%;
        z-index: 100;
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

<template>
    <!-- 回覆視窗 -->
    <div
        class="reply"
        v-show="isReplyBox"
        @click.prevent="scrollPageTo(replyMsg.janusMsg.config.id)"
        :style="messageOffset"
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
    <!-- 捲動時下方有新訊息提示 -->
    <div
        class="newMsgHint"
        v-show="newMsgHint"
        @click="groupChatScrollToBottom()"
        :style="messageOffset"
    >
        <h1>下方有新信息</h1>
    </div>

    <!-- 使用者輸入框 -->
    <div class="input">
        <p
            style="color: #df3636; padding-top: 5px; margin-left: 70px"
            v-if="chatRoomOutterPeopleInfo.length > 0"
        >
            [提醒] 此群組聊天室包含「外部成員」，請妥善使用!
        </p>
        <div class="input-inner">
            <span class="file-folder" v-if="!isMmsSend">
                <input type="file" :accept="chatfileAccept" @change="onUploadFilePC" ref="file" />
            </span>
            <img
                class="sticker"
                @click.stop="closeStickerBox"
                v-if="showStickerModal && !isMmsSend"
                :src="emojiEnabled"
                alt="表情貼圖"
            />
            <img
                class="sticker"
                @click.stop="openStickerBox"
                v-if="!showStickerModal && !isMmsSend"
                :src="emojiIcon"
                alt="表情貼圖"
            />
            <div class="textArea" @input.stop="autoHeight">
                <n-input
                    class="n-input-modify"
                    :placeholder="isMmsSend ? '以傳統簡訊發送' : 'Aa'"
                    type="textarea"
                    size="small"
                    :autosize="{
                        minRows: 1,
                        maxRows: 5,
                    }"
                    v-model:value="msg"
                    @keypress.enter.exact.prevent="addMsg"
                    @focus="closeAll('input')"
                    @input="smsMessageComputed()"
                    ref="inputInstRef"
                    id="backendInput"
                >
                </n-input>
                <img
                    class="send"
                    :src="sendActiveIcon"
                    alt="傳送訊息"
                    @click.prevent="addMsg"
                    v-if="msg !== ''"
                />
                <img class="notSend" :src="sendDefaultIcon" alt="傳送訊息" v-else />
            </div>
        </div>
        <!-- 貼圖視窗 -->
        <div class="stickerArea" v-show="showStickerModal && !isMmsSend">
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
            <n-scrollbar style="max-height: 140px">
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
            </n-scrollbar>
            <n-scrollbar style="max-height: 140px">
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
            </n-scrollbar>
        </div>
    </div>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref, onMounted, nextTick } from "vue";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";
import axios from "axios";
import {
    NInput,
    NEllipsis,
    NIcon,
    NModal,
    NCard,
    NGrid,
    NGridItem,
    NPopover,
    NScrollbar,
} from "naive-ui";
import { HelpCircleOutline } from "@vicons/ionicons5";
import { storeToRefs } from "pinia";
import Recorder from "js-audio-recorder";
// import {} from "googlemaps";
import { GoogleMap, Marker } from "vue3-google-map";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import { txt } from "@/util/interfaceUtil";
import { sendGroupMsg } from "@/util/groupChatUtil";
import { scrollPageTo, isObjToBeZero } from "@/util/commonUtil";
import { currentTime, currentDate, unixTime } from "@/util/dateUtil";
import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { useGroupChatStore } from "@/store/groupChat";
import sendDefaultIcon from "@/assets/Images/chatroom/send.svg";
import sendActiveIcon from "@/assets/Images/chatroom/send_y.svg";
import closeIcon from "@/assets/Images/chatroom/round-fill_close.svg";
import emojiEnabled from "@/assets/Images/chatroom/emoji-enabled.svg";
import emojiIcon from "@/assets/Images/chatroom/emoji.svg";
import voiceIcon from "@/assets/Images/chatroom/voice.svg";
import voiceEnabled from "@/assets/Images/chatroom/voice-enabled.svg";
import reloadTimeEnabled from "@/assets/Images/chatroom/reload-time-enabled.svg";
import reloadTimeIcon from "@/assets/Images/chatroom/reload-time.svg";
import { chatfileAccept, pointCalculation } from "@/util/commonUtil";
import config from "@/config/config";
import AlertPopUp from "@/components/AlertPopUp.vue";

// model sotre
const modelStore = useModelStore();
const { closeAll } = modelStore;

// api store
const apiStore = useApiStore();
const { getSticker, sendMMSMsg } = apiStore;
const {
    stickerList,
    stickerUrl,
    point,
    groupChatMessageList,
    chatRoomOutterPeopleInfo,
    groupMemberVisitTimeInfoList,
} = storeToRefs(apiStore);

//chat store
const chatStore = useChatStore();
const inputInstRef: any = ref(null);
const {
    replyHide,
    openRecorder,
    closeRecorder,
    handleStickckerGroup,
    groupChatScrollToBottom,
    isIllegalCharacter,
    smsMessageComputed,
    saveGroupReadNum,
} = chatStore;
const {
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
    newMsgHint,
    diaryLog,
    bugout,
    word,
    count,
    computedPoint,
    findScrollHeight,
    groupChatFindScrollHeight,
    chatroomScrolltop,
    chatroomWindowHeight,
    chatroomScrolltopAndWindowHeight,
    chatroomScrollHeight,
    participantList,
    groupReadNum,
    groupReadList
} = storeToRefs(chatStore);

//router
const route = useRoute();
onMounted(() => {
    inputInstRef.value.blur();
    inputVal.value = inputInstRef.value;
    const backendInput = document.getElementById("backendInput");
});

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

const userName = localStorage.getItem("userName");

// const chatRoomID: any = computed(() => route.query.chatroomID);
const eventID: any = computed(() => Number(route.query.eventID));

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
        alertMessage.value = "你的裝置或瀏覽器不支援定位功能";
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
// 取出参与者的id
const getParticipantID = (obj) => {
    let id = '';
    for (const participantID in obj) {
        id = participantID;
        break;
    }
    return id;
};
// 更新群組聊天成員的已讀數
const updateGroupMemberReadStatus = (groupList, participantList) => {
    nextTick(() => {
        console.log('参与者list: ', participantList.value);
        let myGroupReadNum = 0;
        // 自定義participantList結構
        const tmpParticipantList = [];
        // 監聽watch傳進來的的now
        if (Array.isArray(participantList)) {
            for (const participant of participantList) {
                const data = {};
                data['id'] = getParticipantID(participant);
                data['onlineTime'] = parseInt((Date.now() / 1000).toFixed(0));
                data['isRead'] = false;
                data['isSelf'] = false;
                tmpParticipantList.push(data);
            }
        } else if (typeof participantList === 'object') {
            for (const participant of participantList.value) {
                const data = {};
                data['id'] = getParticipantID(participant);
                data['onlineTime'] = parseInt((Date.now() / 1000).toFixed(0));
                data['isRead'] = false;
                data['isSelf'] = false;
                tmpParticipantList.push(data);
            }
        }

        // 標記 // grouplist為後端來源
        for (let i = 0; i < groupList.value.length; i++) {
            for (let j = 0; j < tmpParticipantList.length; j++) {
                if (groupList.value[i].id === tmpParticipantList[j].id
                    && groupList.value[i]["onlineTime"] < tmpParticipantList[j].onlineTime) {
                        tmpParticipantList[j]['isRead'] = true;
                }
                if (tmpParticipantList[j].id === localStorage.getItem('account')) {
                        tmpParticipantList[j].isSelf = true;
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
            if (item.isRead && !item.isSelf) {
                // 群聊已讀數
                myGroupReadNum += 1;
            }
        }

        console.log('bb端群聊參與者: ', myParticipantList);
        console.log('groupReadList: ', groupReadList.value);
        console.log("bb端群聊已讀數: " + (myGroupReadNum));
        localStorage.setItem('myGroupReadNum', myGroupReadNum);
        localStorage.setItem('myGroupReadList', JSON.stringify(groupReadList.value));
        // groupReadNum.value = myGroupReadNum;
        groupReadNum.value = Number(localStorage.getItem('myGroupReadNum'));
        
    });
};
// 每秒更新已讀數，解決第1次為0的問題
onMounted(() => {
    setInterval(() => {
        setTimeout(() => {
            updateGroupMemberReadStatus(groupMemberVisitTimeInfoList, participantList);
        }, 0);
    }, 1000);
});
//發送訊息
//input v-model
const addMsg = (): void => {
    const str = msg.value.trim();
    let textObj: any = {
        janusMsg: {
            // 群組id
            eventID: eventID.value,
            // 有此id一律為外部用戶
            chatroomID: "",
            msgType: 1,
            // sender為客服
            sender: 0,
            msgContent: str,
            time: unixTime(),
            // type: isMmsSend.value ? 1 : 2,
            // 辨識是否為群聊
            type: 3,
            // b端客服帳號，是否為自己
            userName: userName,
            format: {},
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
                userName: userName,
                deliveryStatusSuccess: true,
                groupReadNum: groupReadNum.value,
                groupReadList: groupReadList.value
            },
        },
    };

    if (str !== "") {
        if (isIllegalCharacter(str)) {
            alertMessage.value = "發送內容不可含有 talkod.tw";
            return;
        }
        const sendMsgObj = {
            msg: textObj,
            textPlugin: textPlugin.value,
            chatRoomID: "",
            eventID: eventID.value,
        };
        updateGroupMemberReadStatus(groupMemberVisitTimeInfoList, participantList);
        sendGroupMsg(sendMsgObj);
    }
    msg.value = "";
    word.value = config.wordLimit;
    count.value = 0;
    computedPoint.value = 0;
    replyHide();
    // 傳送後，輸入框的高度差置為0
    chatStore.backToTheOrigialDiffHeight();
};
//桌機版上傳檔案
const image = ref();
const file = ref(null);
const files = ref();
const onUploadFilePC = async (e: any) => {
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
    //圖片檔案
    if (fileArrType.includes("image")) {
        //判斷為gif
        if (fileName.split(".").pop() === "gif") {
            // console.log("gif 檔 走這!!!");
            const fd = new FormData();
            fd.append("file", new File([fileArr], fileArr.name, { type: "image/*" }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(fileArr);
                    reader.onload = (e: any) => {
                        let image = new Image();
                        image.src = e.target.result;
                        image.onload = function () {
                            const imageObj: any = {
                                janusMsg: {
                                    eventID: eventID.value,
                                    chatroomID: "",
                                    msgType: 6,
                                    sender: 0,
                                    msgContent: "",
                                    time: unixTime(),
                                    type: 3,
                                    userName: userName,
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
                                        replyObj: replyMsg.value ? { ...replyMsg.value } : {},
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                        userName: userName,
                                        deliveryStatusSuccess: true,
                                    },
                                },
                            };

                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                chatRoomID: "",
                                eventID: eventID.value,
                            };
                            sendGroupMsg(sendMsgObj);
                        };
                    };
                })
                .catch((err) => {
                    // console.error(err);
                    bugout.value.error(`error-log${userName.value}`, err.response.status);
                    bugout.value.error(`error-log${userName.value}`, err.response.data);
                    bugout.value.error(
                        `error-log${userName.value}`,
                        err.response.request.responseURL
                    );
                });
        } else {
            //圖檔 但不是gif
            // console.log("是圖檔 但不是gif!!");
            new Compressor(fileArr, {
                quality: 0.6,
                async success(result) {
                    //呼叫api
                    const fd = new FormData();
                    fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                    await axios({
                        method: "post",
                        url: `${config.serverUrl}/v1/file`,
                        data: fd,
                        headers: { Authorization: `Bearer ${getToken}` },
                    })
                        .then((res) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(fileArr);
                            reader.onload = async (e: any) => {
                                let image = new Image();
                                image.src = e.target.result;
                                image.onload = function () {
                                    const imageObj: any = {
                                        janusMsg: {
                                            eventID: eventID.value,
                                            chatroomID: "",
                                            msgType: 6,
                                            sender: 0,
                                            msgContent: "",
                                            time: unixTime(),
                                            type: 3,
                                            userName: userName,
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
                                                replyObj: replyMsg.value
                                                    ? { ...replyMsg.value }
                                                    : {},
                                                currentDate: currentDate(),
                                                isExpire: false,
                                                isPlay: false,
                                                isRead: false,
                                                msgFunctionStatus: false,
                                                msgMoreStatus: false,
                                                recallPopUp: false,
                                                recallStatus: false,
                                                userName: userName,
                                                deliveryStatusSuccess: true,
                                            },
                                        },
                                    };

                                    const sendMsgObj = {
                                        msg: imageObj,
                                        textPlugin: textPlugin.value,
                                        chatRoomID: "",
                                        eventID: eventID.value,
                                    };
                                    sendGroupMsg(sendMsgObj);
                                };
                            };
                        })
                        .catch((err) => {
                            // console.error(err);
                            bugout.value.error(`error-log${userName.value}`, err.response.status);
                            bugout.value.error(`error-log${userName.value}`, err.response.data);
                            bugout.value.error(
                                `error-log${userName.value}`,
                                err.response.request.responseURL
                            );
                        });
                },
                error(err) {
                    console.error(err);
                },
            });
        }
    } else if (fileArrType.includes("video")) {
        ///影片檔案
        const fd = new FormData();
        console.log("fileArr:", fileArr);
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));
        await axios({
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
                            eventID: eventID.value,
                            chatroomID: "",
                            msgType: 11,
                            sender: 0,
                            msgContent: "",
                            time: unixTime(),
                            type: 3,
                            userName: userName,
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
                                userName: userName,
                                deliveryStatusSuccess: true,
                            },
                        },
                    };
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatRoomID: "",
                        eventID: eventID.value,
                    };
                    sendGroupMsg(sendMsgObj);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
    } else {
        //一般檔案
        const fd = new FormData();
        console.log("fileArr:", fileArr);
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));
        await axios({
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
                            eventID: eventID.value,
                            chatroomID: "",
                            msgType: 7,
                            sender: 0,
                            msgContent: "",
                            time: unixTime(),
                            type: 3,
                            userName: userName,
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
                                userName: userName,
                                deliveryStatusSuccess: true,
                            },
                        },
                    };
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatRoomID: "",
                        eventID: eventID.value,
                    };
                    sendGroupMsg(sendMsgObj);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
    }
    file.value.value = null;
};

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
    if (chatroomScrolltopAndWindowHeight.value < chatroomScrollHeight.value - 30) {
        console.log("不置底");
    } else {
        console.log("置底");
        nextTick(() => {
            groupChatFindScrollHeight.value.scrollTop =
                groupChatFindScrollHeight.value.scrollHeight;
        });
    }
};

const closeStickerBox = () => {
    showStickerModal.value = false;
};

// 貼圖
const addSticker = (sticker, id) => {
    let stickerObj: any = {
        janusMsg: {
            eventID: eventID.value,
            chatroomID: "",
            msgType: 3,
            sender: 0,
            msgContent: "",
            time: unixTime(),
            type: 3,
            userName: userName,
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
                replyObj: replyMsg.value ? { ...replyMsg.value } : {},
                currentDate: currentDate(),
                isExpire: false,
                isPlay: false,
                isRead: false,
                msgFunctionStatus: false,
                msgMoreStatus: false,
                recallPopUp: false,
                recallStatus: false,
                userName: userName,
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
        chatRoomID: "",
        eventID: eventID.value,
    };
    const isStickerPush = stickerItems.value.some((item) => {
        return item.title === stickers.title;
    });
    if (!isStickerPush) {
        stickerItems.value.push(stickers);
    }

    window.localStorage.setItem("sticker-backend", JSON.stringify(stickerItems.value));
    sendGroupMsg(sendMsgObj);
};
//簡訊一般文字切換
// const onChangMMSSend = () => {
//     isMmsSend.value = true;
//     nextTick(() => {
//         groupChatFindScrollHeight.value.scrollTop = groupChatFindScrollHeight.value.scrollHeight;
//     });
// };
// const onChangSMSSend = () => {
//     isMmsSend.value = false;
//     nextTick(() => {
//         groupChatFindScrollHeight.value.scrollTop = groupChatFindScrollHeight.value.scrollHeight;
//     });
// };

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
//刪除訊息談窗提示
const confirmDeletePopup = () => {
    deletePopUp.value = !deletePopUp.value;
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
// 輸入框自動高度差
const autoHeight = () => {
    let initHeight = 30;
    let diffHeight = 0;
    if (backendInput.offsetHeight >= 30 && backendInput.offsetHeight <= 120) {
        const height = Math.abs(backendInput.offsetHeight - initHeight);
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
            groupChatFindScrollHeight.value.scrollTop =
                groupChatFindScrollHeight.value.scrollHeight;
        });
    }
    // nextTick(() => {
    //     groupChatFindScrollHeight.value.scrollTop = groupChatFindScrollHeight.value.scrollHeight;
    // });
    // console.log("輸入框自動高度差: ", chatStore.diffHeight);
};
// 自定義信息框高度差的屬性
let originalHeight = 62;
let typeHeight = chatStore.isMmsSend ? 44 : 0;
const messageOffset = computed(() => {
    // console.log("是否打開了貼圖:", chatStore.showStickerModal);
    switch (chatStore.showStickerModal) {
        case true:
            typeHeight = 0;
            originalHeight = chatRoomOutterPeopleInfo.value.length > 0 ? 284 : 265;
            break;
        default:
            originalHeight = chatRoomOutterPeopleInfo.value.length > 0 ? 81 : 62;
    }
    return {
        "--messageOffset": originalHeight + typeHeight + chatStore.diffHeight + "px",
    };
});
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
    bottom: var(--messageOffset);
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
.newMsgHint {
    cursor: pointer;
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: var(--messageOffset);
    background-color: $primary-4;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.8;
    user-select: none;
    h1 {
        color: black;
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
    .mmsFunctionBar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 10px 0 10px;
        .mmsComputed {
            display: flex;
            .wordCount {
                width: 100px;
                padding: 10px 0;
                margin-right: 15px;
                border-radius: 20px;
                background-color: $primary-3;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .numOfMessage {
                width: 100px;
                padding: 10px 0;
                margin-right: 15px;
                border-radius: 20px;
                background-color: $primary-3;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .point {
                width: 100px;
                padding: 10px 0;
                border-radius: 20px;
                background-color: $primary-3;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .mmsHint {
            display: flex;
            align-items: center;
            .mmsSend {
                display: block;
                min-width: 60px;
                color: $danger;
                font-weight: bold;
                line-height: 1.2;
            }
            .n-icon {
                color: red;
                --n-opacity: 1 !important;
            }
        }
    }
    .input-inner {
        box-sizing: border-box;
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        padding: 10px 0px;

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
        .sticker {
            cursor: pointer;
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
            align-items: center;
            .send {
                width: 28px;
                height: 28px;
                margin-right: 10px;
                &:hover {
                    cursor: pointer;
                }
            }
            .notSend {
                width: 28px;
                height: 28px;
                margin-right: 10px;
                cursor: auto;
            }
        }
        .change-mms {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 120px;
            height: 30px;
            border-radius: 15px;
            border: 1px solid $primary-4;
            background-color: #ffe198;
            color: $gray-1;
            font-size: $font-size-12;
            font-weight: 400;
            // padding: 8px 8px 8px 8px;
            margin-left: 15px;
            cursor: pointer;
            &:hover {
                background-color: #ffc740;
            }
        }
        .change-text {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 120px;
            height: 30px;
            border-radius: 15px;
            border: 1px solid $primary-4;
            background-color: $primary-1;
            color: #fff;
            font-size: $font-size-12;
            font-weight: 400;
            // padding: 8px 8px 8px 8px;
            margin-left: 15px;
            cursor: pointer;
            &:hover {
                background-color: $primary-1;
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
            .notSend {
                display: block;
                width: 24px;
                height: 24px;
                margin-left: 9px;
            }
            .recorder {
                // display: block;
                // width: 24px;
                // height: 24px;
                // margin-left: 9px;
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
            // max-height: 140px;
            display: block;
            // overflow-y: auto;
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

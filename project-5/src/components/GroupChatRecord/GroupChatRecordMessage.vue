<template>
    <!--搜尋交談結果-->
    <div
        v-if="meJoinAlready === true && searcRecordMessages?.length > 0 && recordKeyWord !== ''"
        class="chat-log--search"
    >
        <div
            class="box"
            v-for="num in searcRecordMessages"
            :key="num.eventID"
            @click.stop="route.query.eventID !== num.eventID ? goGroupChat(num.eventID) : ''"
        >
            <div class="boxInner">
                <div class="box__item">
                    <!-- @click.stop="showInternalPeopleInfo(num)" -->
                    <div class="avatar">
                        <n-avatar
                            v-if="num.icon === '' && num.number_ex > 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}externalPeopleDefault.svg`"
                        />
                        <n-avatar
                            v-if="num.icon === '' && num.number_ex === 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}internalPeopleDefault.svg`"
                        />
                        <n-avatar v-else round :size="48" :src="`${config.fileUrl}${num.icon}`" />
                    </div>
                    <div class="info">
                        <h2 class="info__title">
                            <n-ellipsis>
                                {{ num.name }}
                            </n-ellipsis>
                            ({{ num.number_in + num.number_ex }})
                        </h2>
                        <n-ellipsis
                            style="max-width: 120px; line-height: 1.2"
                            :line-clamp="1"
                            :tooltip="false"
                            v-if="num.msgType === 1 && num.msg !== ''"
                        >
                            {{ num.msg }}
                        </n-ellipsis>
                        <p v-if="[3, 5, 6, 7, 8, 9, 11].includes(num.msgType)">
                            傳送了{{ sendMsgTypeObj[num.msgType] }}
                        </p>
                    </div>
                </div>
                <div class="function">
                    <div class="function__time">
                        {{
                            dayjs(num.time / 1000000).isToday()
                                ? dayjs(num.time / 1000000).format("A hh:mm")
                                : dayjs(num.time / 1000000).format("MM/DD")
                        }}
                    </div>
                    <div class="badge" v-if="num.unread === 1">
                        <div class="badge__bg">
                            <span class="badge__sup">未讀</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 交談歷史紀錄 -->
    <div
        v-if="
            meJoinAlready === true &&
            changeList?.length > 0 &&
            searcRecordMessages?.length === 0 &&
            recordKeyWord === ''
        "
        class="chat-log"
    >
        <div
            class="box"
            v-for="num in changeList"
            :key="num.eventID"
            @click.stop="route.query.eventID !== num.eventID ? goGroupChat(num.eventID) : ''"
            :class="{ 'box--active': Number(num.eventID) === highlightRoomID }"
        >
            <div class="boxInner">
                <div class="box__item">
                    <div class="avatar">
                        <n-avatar
                            v-if="num.icon === '' && num.number_ex > 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}externalPeopleDefault.svg`"
                        />
                        <n-avatar
                            v-if="num.icon === '' && num.number_ex === 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}internalPeopleDefault.svg`"
                        />
                        <n-avatar
                            v-if="num.icon !== ''"
                            round
                            :size="48"
                            :src="`${config.fileUrl}${num.icon}`"
                        />
                        <!-- <img
                            class="img"
                            :src="pinIcon"
                            alt="置頂"
                            v-if="num.pinTop"
                            draggable="false"
                        /> -->
                    </div>
                    <div class="info">
                        <h2 class="info__title">
                            <n-ellipsis>
                                {{ num.name }}
                            </n-ellipsis>
                            ({{ num.number_in + num.number_ex }})
                        </h2>
                        <n-ellipsis
                            style="max-width: 120px; line-height: 1.2"
                            :line-clamp="1"
                            :tooltip="false"
                            v-if="num.msgType === 1 && num.msg !== ''"
                        >
                            {{ num.msg }}
                        </n-ellipsis>
                        <p v-if="[3, 5, 6, 7, 8, 9, 11].includes(num.msgType)">
                            傳送了{{ sendMsgTypeObj[num.msgType] }}
                        </p>
                    </div>
                </div>
                <div class="function">
                    <div>
                        <div class="function__time">
                            {{
                                dayjs(num.time / 1000000).isToday()
                                    ? dayjs(num.time / 1000000).format("A hh:mm")
                                    : dayjs(num.time / 1000000).format("MM/DD")
                            }}
                        </div>

                        <!-- <div
                            class="function__more"
                            :class="{ 'function__more--show': num.isfunctionPopUp }"
                        >
                            <img
                                @click.stop="openFunctionPopUp(num)"
                                :src="moreIcon"
                                alt="more"
                                draggable="false"
                            />

                             <div class="popUp" v-show="num.isfunctionPopUp">
                                <ul class="popUp__ul">
                                    <li @click.stop="pin(num, index)" v-if="!num.pinTop">
                                        開啟置頂
                                    </li>
                                    <li @click.stop="unpin(num, index)" v-if="num.pinTop">
                                        取消置頂
                                    </li>
                                    <li @click.stop="deletechatRoomBox(num)">刪除</li>
                                </ul>
                            </div> 
                        </div> -->
                        <div class="badge" v-if="num.unread === 1">
                            <div class="badge__bg">
                                <span class="badge__sup">未讀</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        class="chat-log--notFound"
        v-if="
            searcRecordMessages?.length === 0 &&
            changeList?.length === 0 &&
            chatroomListLoading === false
        "
    >
        尚無交談紀錄
    </div>
</template>

<script setup>
import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    watch,
    watchEffect,
    reactive,
    onUpdated,
    getCurrentInstance,
    nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { NAvatar, NEllipsis, NModal, NCard, NTag, NIcon } from "naive-ui";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

import { randomString } from "@/util/chatUtil";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import { useModelStore } from "@/store/model";
import { useChatStore } from "@/store/chat";
import { usePhoneCallStore } from "@/store/phoneCall";
import config from "@/config/config";
import user_pic_default from "@/assets/Images/mugShot/User-round.svg";
import pinIcon from "@/assets/Images/chatRecord/pushpin-round.svg";
import moreIcon from "@/assets/Images/chatRecord/more.svg";
import { ChevronForwardOutline, ChevronBackOutline } from "@vicons/ionicons5";
import { objectExpression } from "@babel/types";
import { isProduction } from "@/util/commonUtil";
import _ from "lodash";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const { isResult, searcRecordMessages, recordKeyWord } = storeToRefs(searchStore);

const apiStore = useApiStore();
const { sendPinTop, getChatroomlistApi, getGroupChatRoomInfo, getGroupChatMemberVisitTimeApi } =
    apiStore;
const { chatroomList, eventList, staffEvents, tagArea, chatroomListLoading } =
    storeToRefs(apiStore);

const groupChatRecordStore = useGroupChatRecordStore();
const { groupChatRecordMessages, oldArr } = storeToRefs(groupChatRecordStore);

const chatStore = useChatStore();
const { textPlugin, isOnline, messageFrom, messageForm, meJoinAlready } = storeToRefs(chatStore);

const modelStore = useModelStore();
const { showInternalPeopleInfo } = modelStore;
// const {  } = storeToRefs(modelStore);
const phoneCallStore = usePhoneCallStore();
const { yourUserChatroomID } = storeToRefs(phoneCallStore);

const eventID = ref("");
const adminStatus = localStorage.getItem("adminStatus");

const goGroupChat = (eventID) => {
    router.push(`/groupChat/chat?eventID=${eventID}`);
    getGroupChatMemberVisitTimeApi(eventID);
    //換房需先call join 再 call leave
    if (route.query.eventID !== undefined && Number(route.query.eventID) !== eventID) {
        const transaction = randomString(12);
        const leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(route.query.eventID),
        };
        // console.log("離房資訊", leave);
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason) {
                console.log("換房群聊 leave error:", reason);
            },
            success: function () {
                console.log("換房群聊成功leave!!");
            },
        });
    }
    //處理unread狀態
    changeList.value.forEach((item) => {
        if (item.eventID === eventID) {
            item.unread = 0;
        }
        oldArr.value.forEach((oldItem) => {
            if (item.eventID === oldItem.eventID) {
                oldItem.time = item.time;
                oldItem.msg = item.msg;
            }
        });
    });
};
//highlight所在聊天室
const highlightRoomID = ref("");
onMounted(() => {
    highlightRoomID.value = Number(route.query.eventID);
});
watch(route, () => {
    highlightRoomID.value = Number(route.query.eventID);
});

const sendMsgTypeObj = {
    3: "貼圖",
    5: "錄音",
    6: "相片",
    7: "檔案",
    8: "地圖",
    9: "語音通話",
    11: "影片",
};

const changeList = computed({
    get() {
        const sortRecordMessages = ref([]);
        sortRecordMessages.value = groupChatRecordMessages.value;
        sortRecordMessages.value.forEach((msg) => {
            if (msg.msgType !== 1) {
                msg.msg = `傳送了${sendMsgTypeObj[msg.msgType]}`;
            }
        });
        return sortRecordMessages.value;
    },
    set(val) {
        groupChatRecordMessages.value = val;
    },
});

//最後一筆訊息陣列
const lastChatMessageArr = ref([]);
const lastObj = ref({
    janusMsg: {
        chatroomID: "",
        eventID: Number(route.query.eventID),
        msgType: 1,
        sender: 1, // 0:客服, 1:使用者
        msgContent: "",
        time: 0,
        type: 3, //1:簡訊 2: 文字 3:群聊
        userName: "",
        format: {}, // 塞如下方顯示資料,
        config: {
            id: "",
            isReply: false,
            replyObj: {},
            currentDate: "",
            isExpire: false,
            isPlay: false,
            isRead: false,
            msgFunctionStatus: false,
            msgMoreStatus: false,
            recallPopUp: false,
            recallStatus: false,
        },
    },
});
// //判斷未讀訊息提示
// watch(changeList, (newVal, oldVal) => {
//     // 第一次取資料初始值
//     if (oldVal.length === 0) {
//         oldArr.value = newVal;
//         console.log("群聊左側列表拿到初始值", oldArr.value);
//     }
//     newVal.forEach((newItem) => {
//         oldArr.value.forEach((oldItem) => {
//             if (newItem.eventID === oldItem.eventID && newItem.time > oldItem.time) {
//                 newItem.unread = 1;
//                 console.log("需被刷未讀的聊天室名字", newItem.name);
//                 if (newItem.eventID === Number(route.query.eventID)) {
//                     newItem.unread = 0;
//                 }
//             }
//         });
//     });
// });

//有即時訊息來更新左側聊天紀錄狀態
watchEffect(() => {
    if (changeList.value.length <= 0) return;
    window.addEventListener(
        "setItem",
        () => {
            if (messageFrom.value !== "") {
                // 對方收回 抓最後一筆
                lastChatMessageArr.value = JSON.parse(
                    sessionStorage.getItem(`${messageFrom.value}-lastChatMessage` || "[]")
                );
                lastChatMessageArr.value?.forEach((item, idx, arr) => {
                    lastObj.value = arr[arr.length - 1];
                });
            } else {
                // 自己收回 抓最後一筆
                lastChatMessageArr.value = JSON.parse(
                    sessionStorage.getItem(`${route.query.eventID}-lastChatMessage` || "[]")
                );
                lastChatMessageArr.value?.forEach((item, idx, arr) => {
                    lastObj.value = arr[arr.length - 1];
                });
            }
            changeList.value.forEach((msg) => {
                if (Number(lastObj.value.janusMsg.eventID) !== Number(msg.eventID)) return;
                // console.log("收到訊息刷新聊天室最後一則訊息~~");
                msg.eventID = lastObj.value.janusMsg.eventID;
                msg.time = lastObj.value.janusMsg.time;
                msg.msgType = lastObj.value.janusMsg.msgType;
                msg.msg =
                    lastObj.value.janusMsg.msgType === 1
                        ? lastObj.value.janusMsg.msgContent
                        : `傳送了${sendMsgTypeObj[lastObj.value.janusMsg.msgType]}`;
            });
            // changeList.value.sort((a, b) => b.time - a.time).sort((a, b) => b.pinTop - a.pinTop);
        },
        false
    );
});

// //開啟功能列表
// const openFunctionPopUp = (num) => {
//     let arr = changeList.value.map((item) => {
//         if (item.eventID === num.eventID) {
//             item.isfunctionPopUp = !item.isfunctionPopUp;
//         } else {
//             item.isfunctionPopUp = false;
//         }
//         return item;
//     });
//     changeList.value = arr;
// };

// //刪除功能
// const deletechatRoomBox = (item) => {
//     changeList.value = changeList.value.filter((num) => {
//         num.isfunctionPopUp = false;
//         return num.eventID !== item.eventID;
//     });
// };

// //置頂功能
// const pin = (item, idx) => {
//     const infoObj = {
//         chatroomID: item.chatroomID,
//         pinTop: 1,
//         eventID: route.query.eventID,
//     };
//     sendPinTop(infoObj);
// };

// // 取消置頂功能
// const unpin = (item, index) => {
//     const infoObj = {
//         chatroomID: item.chatroomID,
//         pinTop: 0,
//         eventID: route.query.eventID,
//     };
//     sendPinTop(infoObj);
// };
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.badge {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    &__bg {
        padding: 4px 8px;
        border-radius: 12px;
        background: $primary-1;
        width: auto;
    }
    &__sup {
        @extend %h4;
        color: $gray-1;
    }
}
.chat-log {
    height: calc(100% - 160px);
    padding-top: 20px;
    box-sizing: border-box;
    &--search {
        height: calc(100% - 160px);
        padding-top: 20px;
        box-sizing: border-box;
    }
    &--notFound {
        @extend %h2;
        margin-top: 120px;
        text-align: center;
    }
}
.box {
    padding-top: 10px;
    padding-left: 18px;
    + .box {
        border-top: 1px solid $border-line;
    }
    .boxInner {
        cursor: pointer;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        text-decoration: none;
    }
    .tagList {
        width: 286px;
        display: flex;
        align-items: center;
        justify-contents: space-around;
        .tagArea {
            white-space: nowrap;
            overflow-x: auto;
            max-width: 267px;
            &::-webkit-scrollbar {
                // height: 5px;
                display: none;
                // &::-webkit-scrollbar-track {
                //     background: $gray-4;
                // }
                // &::-webkit-scrollbar-thumb {
                //     background: #d3d3d3;
                // }
                // &::-webkit-scrollbar-thumb:hover {
                //     // background: ;
                // }
            }
        }
        .n-icon {
            cursor: pointer;
        }
        .n-tag {
            margin: 5px;
            background-color: $primary-2;
        }
    }
    &--active {
        background-color: #fff1ea;
    }
    &__item {
        max-width: 212px;
        display: flex;
        align-items: center;
        padding: 15px;
        .avatar {
            margin-right: 15px;
            position: relative;
            .img {
                position: absolute;
                width: 20px;
                right: inherit;
                left: 35px;
                bottom: 0;
            }
        }
        .info {
            max-width: 134px;
            &__title {
                @extend %h2;
                margin-bottom: 6px;
                color: $gray-2;
                display: flex;
            }
            p {
                max-width: 130px;
                @extend %h4;
                line-height: 1.2;
                color: $gray-3;
            }
        }
    }
    &:last-child {
        border-bottom: 1px solid $border-line;
    }
    &:hover {
        background-color: $primary-4;
        .function {
            .badge {
                display: none;
            }
            .function__more {
                display: flex;
            }
        }
    }
}
// .box__item {
//     max-width: 86%;
//     display: flex;
//     align-items: center;
//     padding: 15px;
//     .avatar {
//         margin-right: 15px;
//         position: relative;
//         .img {
//             position: absolute;
//             width: 20px;
//             right: inherit;
//             left: 35px;
//             bottom: 0;
//         }
//     }
// }

.function {
    max-width: 120px;
    padding-top: 15px;
    padding-right: 15px;
    display: flex;
    flex-direction: column;
    &__time {
        text-align: right;
        min-width: 68px;
        color: $gray-3;
        font-size: $font-size-14;
        font-weight: 500;
    }
    &__more {
        padding: 8px 5px 0 12px;
        position: relative;
        display: none;
        justify-content: flex-end;
        align-items: center;

        img {
            width: 25px;
        }
    }
    &__more--show {
        display: flex;
    }
}
.popUp {
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
    border-radius: 4px;
    top: 25px;
    right: 0px;
    z-index: 1;
    &__ul {
        background-color: $primary-3;
        li {
            width: 76px;
            height: 50px;
            padding: 10px 10px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            color: $gray-1;
            border-bottom: 1px solid $white;
        }
        li:last-child {
            border-bottom: 0px;
        }
    }
}
</style>

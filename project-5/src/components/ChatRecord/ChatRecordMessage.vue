<template>
    <!--搜尋交談結果-->
    <div
        v-if="meJoinAlready === true && searcRecordMessages?.length > 0 && recordKeyWord !== ''"
        class="chat-log--search"
    >
        <div
            class="box"
            v-for="(num, index) in searcRecordMessages"
            :key="num.chatroomID"
            @click.stop="
                route.query.chatroomID !== num.chatroomID
                    ? gotoChat(eventID, num.chatroomID, num.mobile)
                    : ''
            "
        >
            <div class="boxInner">
                <div class="box__item">
                    <!-- @click.stop="showInternalPeopleInfo(num)" -->
                    <div class="avatar">
                        <n-avatar
                            v-if="num.icon == 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}icon/default.svg`"
                        />
                        <n-avatar
                            v-if="num.icon !== 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}icon/${num.icon}.png`"
                        />
                    </div>
                    <div class="info">
                        <h2 class="info__title" v-if="!num.name" v-html="num.tagMsgMobile"></h2>
                        <h2 class="info__title" v-html="num.tagMsgName" v-else></h2>
                        <n-ellipsis
                            style="max-width: 600px"
                            :line-clamp="1"
                            :tooltip="false"
                            v-html="num.tagMsg"
                        >
                        </n-ellipsis>
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
            <div class="tagList">
                <n-icon
                    @click.stop="tagScrollLeft(index)"
                    v-show="
                        tagArea[index]?.scrollWidth > tagArea[index]?.clientWidth &&
                        tagArea[index]?.scrollLeft > 0
                    "
                >
                    <chevron-back-outline />
                </n-icon>
                <div class="tagArea">
                    <n-tag v-for="(tag, index) in num.tag" :key="index" round :closable="false">
                        {{ `#${tag}` }}
                    </n-tag>
                </div>
                <n-icon
                    @click.stop="tagScrollRight(index)"
                    v-show="
                        parseInt(tagArea[index]?.scrollLeft) <
                        tagArea[index]?.scrollWidth - tagArea[index]?.clientWidth
                    "
                >
                    <chevron-forward-outline />
                </n-icon>
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
            v-for="(num, index) in changeList"
            :key="num.chatroomID"
            @click.stop="route.query.chatroomID !== num.chatroomID ? goChat(num, index) : ''"
            :class="{ 'box--active': num.chatroomID === highlightRoomID }"
        >
            <div class="boxInner">
                <div class="box__item">
                    <!-- @click.stop="showInternalPeopleInfo(num)" -->
                    <div class="avatar">
                        <n-avatar
                            v-if="num.icon == 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}icon/default.svg`"
                        />
                        <n-avatar
                            v-if="num.icon !== 0"
                            round
                            :size="48"
                            :src="`${config.fileUrl}icon/${num.icon}.png`"
                        />
                        <img
                            class="img"
                            :src="pinIcon"
                            alt="置頂"
                            v-if="num.pinTop"
                            draggable="false"
                        />
                    </div>
                    <div class="info">
                        <h2 class="info__title" v-if="!num.name">
                            {{ "+" + String(num.mobile).slice(0, 3) }}
                            {{ String(num.mobile).slice(-9) }}
                        </h2>
                        <h2 class="info__title" v-else>{{ num.name }}</h2>
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

                        <div
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
                                    <!-- <li @click.stop="deletechatRoomBox(num)">刪除</li> -->
                                </ul>
                            </div>
                        </div>
                        <div class="badge" v-if="num.unread === 1">
                            <div class="badge__bg">
                                <span class="badge__sup">未讀</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tagList">
                <n-icon
                    @click.stop="tagScrollLeft(index)"
                    v-show="
                        tagArea[index]?.scrollWidth > tagArea[index]?.clientWidth &&
                        tagArea[index]?.scrollLeft > 0
                    "
                >
                    <chevron-back-outline />
                </n-icon>
                <div class="tagArea">
                    <n-tag v-for="(tag, index) in num.tag" :key="index" round :closable="false">
                        {{ `#${tag}` }}
                    </n-tag>
                </div>
                <n-icon
                    @click.stop="tagScrollRight(index)"
                    v-show="
                        parseInt(tagArea[index]?.scrollLeft) <
                        tagArea[index]?.scrollWidth - tagArea[index]?.clientWidth
                    "
                >
                    <chevron-forward-outline />
                </n-icon>
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

<script lang="ts" setup>
import {
    ref,
    computed,
    onMounted,
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
import { useChatRecordStore } from "@/store/chatRecord";
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
const { sendPinTop } = apiStore;
const { chatroomList, eventList, staffEvents, tagArea, chatroomListLoading } =
    storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const chatStore = useChatStore();
const { textPlugin, isOnline, messageFrom, messageForm, meJoinAlready } = storeToRefs(chatStore);

const modelStore = useModelStore();
const { showInternalPeopleInfo, gotoChat } = modelStore;
// const {  } = storeToRefs(modelStore);
const phoneCallStore = usePhoneCallStore();
const { yourUserChatroomID } = storeToRefs(phoneCallStore);
const eventID: any = ref("");
const adminStatus = localStorage.getItem("adminStatus");

//highlight所在聊天室
const highlightRoomID: any = ref("");
onMounted(() => {
    highlightRoomID.value = route.query.chatroomID;
});
onMounted(() => {
    watch(eventList, () => {
        eventID.value = route.params.id ? route.params.id : eventList.value[0]?.eventID;
    });
});
watch(route, () => {
    if (!route.query) return;
    if (Object.keys(route.query).includes("chatroomID")) {
        const message: any = {
            textroom: "message",
            transaction: randomString(12),
            room: Number(eventID.value),
            // tos: [全部在線客服1,全部在線客服2],
            tos: [route.query.chatroomID],
            text: "pin",
        };
        textPlugin.value.data({
            text: JSON.stringify(message),
            error: function (reason: any) {
                console.log("error:", reason);
            },
            success: function () {
                console.log("gotoChat pin");
            },
        });
    }
    highlightRoomID.value = route.query.chatroomID;
});

interface IObj {
    [propName: string]: any;
    toTop: boolean;
    show: boolean;
    currentDate: string;
    time: string;
    message: string | null;
    format: string | null;
}

interface ISendMsgTypeObj {
    [propName: string]: any;
}
const sendMsgTypeObj: ISendMsgTypeObj = {
    3: "貼圖",
    5: "錄音",
    6: "相片",
    7: "檔案",
    8: "地圖",
    9: "語音通話",
    11: "影片",
};

const changeList: any = computed({
    get() {
        const sortRecordMessages = ref([]);
        sortRecordMessages.value = recordMessages.value;
        sortRecordMessages.value.forEach((msg) => {
            if (msg.msgType !== 1) {
                msg.msg = `傳送了${sendMsgTypeObj[msg.msgType]}`;
            }
        });
        return sortRecordMessages.value;
    },
    set(val) {
        recordMessages.value = val;
    },
});
//進入聊天室
const goChat = (num, index) => {
    changeList.value.forEach((msg) => {
        if (num.chatroomID === msg.chatroomID) {
            msg.unread = 0;
        }
    });
    gotoChat(eventID.value, num.chatroomID, num.mobile, index);
};

//最後一筆訊息陣列
const lastChatMessageArr = ref([]);
const lastObj = ref({
    janusMsg: {
        chatroomID: "",
        msgType: 1,
        sender: 1, // 0:客服, 1:使用者
        msgContent: "",
        time: 0,
        type: 1, //1:簡訊 2: 文字
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
watch(messageForm, (newVal, oldVal) => {
    changeList.value.forEach((msg) => {
        if (newVal.janusMsg.chatroomID === msg.chatroomID) {
            msg.unread = 1;
            if (msg.chatroomID === route.query.chatroomID) {
                msg.unread = 0;
            }
        }
    });
});
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
                    sessionStorage.getItem(`${route.query.chatroomID}-lastChatMessage` || "[]")
                );
                lastChatMessageArr.value?.forEach((item, idx, arr) => {
                    lastObj.value = arr[arr.length - 1];
                });
            }
            changeList.value.forEach((msg) => {
                if (lastObj.value.janusMsg.chatroomID !== msg.chatroomID) return;
                msg.chatroomID = lastObj.value.janusMsg.chatroomID;
                msg.time = lastObj.value.janusMsg.time;
                msg.msgType = lastObj.value.janusMsg.msgType;
                msg.msg =
                    lastObj.value.janusMsg.msgType === 1
                        ? lastObj.value.janusMsg.msgContent
                        : `傳送了${sendMsgTypeObj[lastObj.value.janusMsg.msgType]}`;
            });
            changeList.value.sort((a, b) => b.time - a.time).sort((a, b) => b.pinTop - a.pinTop);
        },
        false
    );
});

//開啟功能列表
const openFunctionPopUp = (num: any) => {
    // console.log("popup:", num);
    let arr = changeList.value.map((item: any) => {
        if (item.chatroomID === num.chatroomID) {
            item.isfunctionPopUp = !item.isfunctionPopUp;
        } else {
            item.isfunctionPopUp = false;
        }
        return item;
    });
    changeList.value = arr;
};

//刪除功能
const deletechatRoomBox = (item: any): void => {
    changeList.value = changeList.value.filter((num: any) => {
        num.isfunctionPopUp = false;
        return num.chatroomID !== item.chatroomID;
    });
};

//置頂功能
const pin = (item: any, idx: any): void => {
    // console.log("item:", item);
    const infoObj = {
        chatroomID: item.chatroomID,
        pinTop: 1,
        eventID: route.params.id,
    };
    sendPinTop(infoObj);
};

// 取消置頂功能
const unpin = (item: any, index: any): void => {
    const infoObj = {
        chatroomID: item.chatroomID,
        pinTop: 0,
        eventID: route.params.id,
    };
    sendPinTop(infoObj);
};

//tag 滾動功能
const instance = getCurrentInstance();
const tagScrollLeft = (index) => {
    if (tagArea.value[index].scrollLeft > 0) {
        tagArea.value[index].scrollLeft -= 270;
    }
    instance.proxy.$forceUpdate();
    // console.log(`要操縱的dom${index}的scrollLeft`, tagArea.value[index].scrollLeft);
};
const tagScrollRight = (index) => {
    tagArea.value[index].scrollLeft += 270;
    instance.proxy.$forceUpdate();
    // console.log(`要操縱的dom${index}的scrollLeft`, tagAre.valuea[index].scrollLeft);
};
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

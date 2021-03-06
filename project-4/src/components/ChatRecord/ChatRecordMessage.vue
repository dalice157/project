<template>
    <!--搜尋交談結果-->
    <div
        v-if="eventInfo !== null && searcRecordMessages?.length > 0 && recordKeyWord !== ''"
        class="chat-log--search"
    >
        <div
            class="box"
            @touchend.stop="logGotoChat(num.chatroomID)"
            @click.stop="logGotoChat(num.chatroomID)"
            v-for="num in searcRecordMessages"
            :key="num.chatroomID"
        >
            <!-- v-show="num.show" -->
            <div class="box__item">
                <div class="avatar" @[events].stop="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.fileUrl}${num.icon}`" />
                </div>
                <div class="info">
                    <h2 class="info__title">{{ num.name }}</h2>
                    <n-ellipsis
                        style="max-width: 600px"
                        :line-clamp="1"
                        :tooltip="false"
                        v-html="num.janusMsg.tagMsg"
                    >
                    </n-ellipsis>
                </div>
            </div>
            <div class="function">
                <div class="function__time">
                    <div class="time">
                        {{ currentTime(num.time / 1000) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 交談歷史紀錄 -->
    <div
        v-if="
            eventInfo !== null &&
            changeList?.length > 0 &&
            searcRecordMessages?.length === 0 &&
            recordKeyWord === ''
        "
        class="chat-log"
    >
        <!-- @touchend.prevent="gotoChat(num.eventKey)" -->
        <!-- :href="`/?eventKey=${num.eventKey}`" -->
        <a class="box" v-for="(num, index) in changeList" :key="num.chatroomID">
            <!-- v-show="num.show" -->
            <!-- {{ num }} -->
            <div
                class="box__item"
                @touchend.stop="logGotoChat(num.chatroomID)"
                @click.stop="logGotoChat(num.chatroomID)"
            >
                <div class="avatar" @[events].stop="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.fileUrl}${num.icon}`" />
                    <img class="img" :src="pinIcon" alt="置頂" v-if="num.toTop" />
                </div>
                <div class="info">
                    <h2 class="info_title">{{ num.name }}</h2>
                    <n-ellipsis class="messageEllipsis" :line-clamp="1" :tooltip="false">
                        <p v-if="num.janusMsg.msgContent">
                            {{ num.janusMsg.msgContent }}
                        </p>
                        <p v-if="[3, 5, 6, 7, 8, 9].includes(num.janusMsg.msgType)">
                            {{ num.janusMsg.sender === 0 ? "對方" : "您" }}傳送了{{
                                sendMsgTypeObj[num.janusMsg.msgType]
                            }}
                        </p>
                    </n-ellipsis>
                </div>
            </div>
            <div class="function">
                <div class="function__time">
                    <div class="time">
                        {{ currentTime(num.time / 1000) }}
                    </div>
                </div>
                <div class="function__more" @[events].stop="openFunctionPopUp(num)">
                    <img :src="moreIcon" alt="more" />
                    <div class="popUp" v-show="num.isfunctionPopUp">
                        <ul class="popUp__ul">
                            <li @[events].stop="pin(num, index)" v-if="!num.toTop">開啟置頂</li>
                            <li @[events].stop="unpin(num, index)" v-if="num.toTop">取消置頂</li>
                            <!-- <li @touchend.stop="deletechatRoomBox(num)">刪除</li> -->
                        </ul>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div
        class="chat-log--notFound"
        v-if="searcRecordMessages?.length === 0 && changeList?.length === 0"
    >
        尚無交談紀錄
    </div>
    <UserInfoModel />
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, defineEmits, computed, reactive, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NAvatar, NEllipsis, NModal, NCard } from "naive-ui";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

import { isMobile, resetSetItem } from "@/util/commonUtil";
import { currentTime } from "@/util/dateUtil";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { useChatRecordStore } from "@/store/chatRecord";
import { useModelStore } from "@/store/model";
import UserInfoModel from "@/components/UserInfoModel.vue";
import config from "@/config/config";
import pinIcon from "@/assets/Images/chatRecord/pushpin-round.svg";
import moreIcon from "@/assets/Images/chatRecord/more.svg";

const events = ref(isMobile ? "touchend" : "click");

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const { isResult, searcRecordMessages, recordKeyWord } = storeToRefs(searchStore);

const apiStore = useApiStore();
const { getBackendApi, getEventListApi } = apiStore;
const { eventList, eventInfo } = storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const modelStore = useModelStore();
const { showCompanyInfo, logGotoChat, gotoPhone } = modelStore;
const { isInfoPop, info } = storeToRefs(modelStore);

let changeList = ref();
let list: any = ref([]);

const emit = defineEmits(["getChangeList"]);

const getChangeList = () => {
    const getList = changeList.value;
    emit("getChangeList", getList);
};
onMounted(() => {
    getBackendApi(route.params.eventKey);
    getEventListApi(route.params.eventKey);
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
};
watchEffect(() => {
    console.log("changeList", changeList.value);
});
// const myRecordMsg = computed({
//     get() {
//         const arr = ref([]);
//         arr.value.push(eventInfo.value);
//         return arr.value;
//     },
//     set(val) {
//         eventInfo.value = val;
//     },
// });
// const otherRecordMsgList = computed({
//     get() {
//         return eventList.value;
//     },
//     set(val) {
//         eventList.value = val;
//     },
// });
// watchEffect(() => {
//     console.log("myRecordMsg", myRecordMsg.value);
//     console.log("otherRecordMsgList", otherRecordMsgList.value);
// });
// const isDel = ref(false);
// let i = ref(0);
const recordMsgs = computed(() => {
    return JSON.parse(localStorage.getItem(`${route.params.eventKey}-record`) || "[]");
});

let lastObj = reactive({
    callable: true,
    chatroomID: "",
    description: "",
    homeurl: "",
    icon: "",
    isfunctionPopUp: false,
    janusMsg: {},
    jid: 1,
    key: 0,
    messagelist: [],
    name: "",
    show: true,
    sup: 0,
    time: 0,
    toTop: false,
    unreadList: null,
});
// 首次進入拿歷史紀錄
const init: any = () => {
    let messages = JSON.parse(localStorage.getItem(route.params.eventKey as any) || "[]");
    // if (eventList.value.length > 0) {
    //     eventList.value.forEach((item: any) => {
    //         list.value = JSON.parse(localStorage.getItem(item.chatToken) || "[]");
    //         console.log("list:", list.value);

    //         if (list.value.length > 0) {
    //             const infoLen = list.value.length;
    //             const isInfoYesterday = dayjs(
    //                 (list.value[infoLen - 1] as any).janusMsg.config.currentDate
    //             ).isYesterday();
    //             const isInfoToday = dayjs(
    //                 (list.value[infoLen - 1] as any).janusMsg.config.currentDate
    //             ).isToday();
    //             const lastObj: IObj = {
    //                 ...item,
    //                 ...list.value[infoLen - 1],
    //                 chatroomID: item.chatToken,
    //                 toTop: false,
    //                 show: true,
    //                 isfunctionPopUp: false,
    //                 time: isInfoToday
    //                     ? (list.value[infoLen - 1] as any).janusMsg.time
    //                     : isInfoYesterday
    //                     ? "昨天"
    //                     : (list.value[infoLen - 1] as any).janusMsg.config.currentDate,
    //                 sup: list.value.length,
    //             };
    //             if (!recordMessages.value.some((msg: any) => msg.eventKey === item.eventKey)) {
    //                 recordMessages.value.push(lastObj);
    //             }
    //         }
    //     });
    // }

    if (
        messages.length > 0 &&
        eventInfo.value?.messagelist.length > 0 &&
        !recordMessages.value.some((msg: any) => msg.chatroomID === route.params.eventKey)
    ) {
        let getObj = {
            chatroomID: route.params.eventKey,
            ...messages.at(-1), // .at(-1) 寫法同等於 messages.length - 1
        };
        const isInfoYesterday = dayjs(getObj.janusMsg.config.currentDate).isYesterday();
        const isInfoToday = dayjs(getObj.janusMsg.config.currentDate).isToday();
        const lastObj: IObj = {
            ...getObj,
            ...eventInfo.value,
            toTop: false,
            show: true,
            isfunctionPopUp: false,
            time: isInfoToday
                ? getObj.janusMsg.time
                : isInfoYesterday
                ? "昨天"
                : getObj.janusMsg.config.currentDate,
            sup: messages.length,
        };
        recordMessages.value.push(lastObj);
    }
    if (recordMsgs.value.length > 0) {
        recordMessages.value = [...recordMsgs.value, ...recordMessages.value];
    }
    changeList.value = recordMessages.value;
    changeList.value = changeList.value.reduce((unique, o) => {
        const hasRepeatId = unique.some((obj) => {
            return obj.chatroomID === o.chatroomID;
        });
        if (!hasRepeatId) {
            unique.push(o);
        }
        return unique;
    }, []);
    // localStorage.setItem(`${route.params.eventKey}-record`, JSON.stringify(changeList.value));
};
onMounted(() => {
    init();
});
const lastChatMessageArr: any = ref([]);

setInterval(() => {
    // const isToTop = JSON.parse(localStorage.getItem(`${route.params.eventKey}-record` || "[]"))[0]
    //     .toTop;
    lastChatMessageArr.value = JSON.parse(localStorage.getItem(`${route.params.eventKey}` || "[]"));
    lastChatMessageArr.value = lastChatMessageArr.value.filter((item, idx, arr) => {
        return !item.janusMsg.config.recallStatus;
    });

    lastChatMessageArr.value.forEach((item, idx, arr) => {
        // console.log("arr 最後一項", arr[arr.length - 1]);
        const infoLen = lastChatMessageArr.value.length;
        const isInfoYesterday = dayjs(
            (lastChatMessageArr.value[infoLen - 1] as any).janusMsg.config.currentDate
        ).isYesterday();
        const isInfoToday = dayjs(
            (lastChatMessageArr.value[infoLen - 1] as any).janusMsg.config.currentDate
        ).isToday();
        lastObj = {
            ...eventInfo.value,
            ...arr.at(-1),
            chatroomID: route.params.eventKey,
            // toTop: isToTop,
            show: true,
            isfunctionPopUp: false,
            time: isInfoToday
                ? (lastChatMessageArr.value[infoLen - 1] as any).janusMsg.time
                : isInfoYesterday
                ? "昨天"
                : (lastChatMessageArr.value[infoLen - 1] as any).janusMsg.config.currentDate,
            sup: lastChatMessageArr.value.length,
        };
    });
    recordMessages.value = [];
    recordMessages.value.push(lastObj);
    changeList.value = recordMessages.value;
    // console.log("changeList", changeList.value);
    localStorage.setItem(`${route.params.eventKey}-record`, JSON.stringify(changeList.value));
}, 5000);

onUnmounted(() => {
    clearInterval(lastChatMessageArr.value);
});

//開啟功能列表
const openFunctionPopUp = (num: any) => {
    changeList.value.forEach((item: any) => {
        if (item.chatroomID === num.chatroomID) {
            item.isfunctionPopUp = !item.isfunctionPopUp;
        } else {
            item.isfunctionPopUp = false;
        }
    });
};
// //刪除功能
// const deletechatRoomBox = (item: any): void => {
//     // changeList.value = changeList.value.filter((num: any) => {
//     //     num.isfunctionPopUp = false;
//     //     return num.chatroomID !== item.chatroomID;
//     // });
//     // if (changeList.value.length <= 0) {
//     //     alert("只有一筆,所以無法刪除");
//     // }
//     changeList.value.forEach((event, index) => {
//         event.isfunctionPopUp = false;
//         if (event.chatroomID === item.chatroomID) {
//             changeList.value.splice(index, 1);
//         }
//     });
//     isDel.value = true;
//    resetSetItem(`${route.params.eventKey}-record`, JSON.stringify(changeList.value));
// };

//置頂功能
const pin = (item: any, idx: any): void => {
    const lists = changeList.value;
    lists.unshift(lists.splice(idx, 1)[0]);
    lists.forEach((it: any, index: any) => {
        console.log("item pin:", item);
        console.log("it pin:", it);
        if (it.chatroomID === item.chatroomID) {
            it.toTop = true;
        }
        it.isfunctionPopUp = false;
    });
    changeList.value = lists;
    localStorage.setItem(`${route.params.eventKey}-record`, JSON.stringify(changeList.value));
    console.log("新增置頂nums.value:", changeList.value);
};

// 取消置頂功能
const unpin = (item: any, index: any): void => {
    const lists = changeList.value;
    const getItem = lists.splice(index, 1)[0];
    lists.splice(item.key, 0, getItem);
    lists.forEach((it) => {
        if (it.chatroomID === item.chatroomID) {
            it.toTop = false;
        }
        it.isfunctionPopUp = false;
    });

    const toTopLists = lists.filter((isTop) => {
        return isTop.toTop;
    });
    const doNotTopLists = lists
        .filter((isTop) => {
            return !isTop.toTop;
        })
        .sort((a, b) => a.key > b.key);
    changeList.value = [...toTopLists, ...doNotTopLists];
    localStorage.setItem(`${route.params.eventKey}-record`, JSON.stringify(changeList.value));
    console.log("取消nums.value:", changeList.value);
};

// //隱藏功能
// const hideChatRoomBox = (item: any) => {
//     recordMessages.value.forEach((num: any) => {
//         if (num.eventKey === item.eventKey) {
//             num.show = false;
//         }
//     });
//     isfunctionPopUp.value = false;
// };
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.box {
    cursor: pointer;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    text-decoration: none;
    position: relative;
    z-index: 1;
    + .box {
        border-top: 1px solid $border-line;
    }
    &:last-child {
        border-bottom: 1px solid $border-line;
    }
    &:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }
    &__item {
        width: 86%;
        display: flex;
        align-items: center;
        padding: 15px;
        @media (max-width: 599px) {
            width: 80%;
        }
        @media (max-width: 380px) {
            width: 78%;
        }
        @media (max-width: 320px) {
            width: 71%;
        }
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
        @media (max-width: 380px) {
            .messageEllipsis {
                max-width: 150px;
            }
        }
    }

    .info {
        &__title {
            @extend %h2;
            margin-bottom: 6px;
            color: $gray-2;
        }
        .messageEllipsis {
            max-width: 150px;
        }
        p {
            @extend %h4;
            line-height: 1.2;
            color: $gray-3;
        }
    }
    .function {
        // max-width: 120px;
        padding-top: 15px;
        padding-right: 15px;
        display: flex;
        &__time {
            .time {
                text-align: right;
                min-width: 80px;
                color: $gray-3;
                font-size: $font-size-14;
                font-weight: 500;
            }
            .badge {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 10px;
                .badgeBg {
                    padding: 4px 8px;
                    border-radius: 12px;
                    background: $primary-1;
                    width: auto;
                }
                .badgeSup {
                    @extend %h4;
                    color: $gray-1;
                }
            }
        }
        &__more {
            margin: auto 5px auto 12px;
            position: relative;
            z-index: 100;
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
                width: 90px;
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
}
.chat-log {
    height: calc(100% - 160px);
    overflow-y: auto;
    padding-top: 20px;
    box-sizing: border-box;
    &--search {
        height: 100%;
        overflow-y: auto;
    }

    &--notFound {
        @extend %h2;
        margin-top: 120px;
        text-align: center;
    }
    @media (max-width: 768px) {
        .chat-log--search {
            margin-top: 20px;
        }
    }
}
@media (max-width: 768px) {
    .chat-log {
        height: 100%;
        padding-top: 20px;
    }
}
</style>

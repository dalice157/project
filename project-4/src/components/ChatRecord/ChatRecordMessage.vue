<template>
    <!--搜尋交談結果-->
    <div v-if="searcRecordMessages?.length > 0 && recordKeyWord !== ''" class="searchRecordMessage">
        <a
            class="chatRoomBox"
            @touchend.prevent="gotoChat(num.chatToken)"
            v-for="num in searcRecordMessages"
            :key="num.chatToken"
            :href="`/?chatToken=${num.chatToken}`"
        >
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @click.prevent="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.fileUrl}/fls/${num.icon}`" />
                </div>
                <div class="chatRoomInfo">
                    <h2 class="info_title">{{ num.name }}</h2>
                    <n-ellipsis
                        style="max-width: 600px"
                        :line-clamp="1"
                        :tooltip="false"
                        v-html="num.tagMsg"
                    >
                    </n-ellipsis>
                </div>
            </div>
            <div class="functionBox">
                <div class="time">
                    {{ num.time }}
                </div>
                <div class="badge">
                    <div class="badgeBg">
                        <span class="badgeSup">{{ num.sup > 999 ? "999+" : num.sup }}</span>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <!-- 交談歷史紀錄 -->
    <div
        v-if="changeList?.length > 0 && searcRecordMessages?.length === 0 && recordKeyWord === ''"
        class="chatRecordMessage"
        @touchstart="getChangeList"
    >
        <!-- @touchend.prevent="gotoChat(num.chatToken)" -->
        <!-- :href="`/?chatToken=${num.chatToken}`" -->
        <a
            class="chatRoomBox"
            v-for="(num, index) in changeList"
            :key="num.chatToken"
            :href="`/?chatToken=${num.chatToken}`"
        >
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @click.prevent="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.fileUrl}/fls/${num.icon}`" />
                    <img
                        class="img"
                        src="../../assets/Images/chatRecord/pushpin-round.svg"
                        alt="置頂"
                        v-if="num.toTop"
                    />
                </div>
                <div class="chatRoomInfo">
                    <h2 class="info_title">{{ num.name }}</h2>
                    <n-ellipsis class="messageEllipsis" :line-clamp="1" :tooltip="false">
                        <p v-if="num.message">
                            {{ num.message }}
                        </p>
                        <p v-if="[3, 5, 6, 7, 8, 9].includes(num.msgType)">
                            {{ num.sender === 0 ? "對方" : "您" }}傳送了{{
                                sendMsgTypeObj[num.msgType]
                            }}
                        </p>
                    </n-ellipsis>
                </div>
            </div>
            <div class="functionBox">
                <div>
                    <div class="time">
                        {{ num.time }}
                    </div>
                    <div class="badge">
                        <div class="badgeBg">
                            <span class="badgeSup">{{ num.sup > 999 ? "999+" : num.sup }}</span>
                        </div>
                    </div>
                </div>
                <div class="functionBoxMore">
                    <img
                        src="@/assets/Images/chatRecord/more.svg"
                        alt="#"
                        @touchstart.prevent.stop="openFunctionPopUp(num)"
                    />
                    <div class="functionPopUp" v-show="num.isfunctionPopUp">
                        <ul class="ulList">
                            <li @click.prevent="pin(num, index)" v-if="!num.toTop">開啟置頂</li>
                            <li @click.prevent="unpin(num, index)" v-if="num.toTop">取消置頂</li>
                            <li @click.prevent="deletechatRoomBox(num)">刪除</li>
                        </ul>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div
        class="chatRecordNotFound"
        v-if="searcRecordMessages?.length === 0 && changeList?.length === 0"
    >
        尚無交談紀錄
    </div>
    <UserInfoModel />
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";
import { NAvatar, NEllipsis, NModal, NCard } from "naive-ui";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

import { getFileExtension } from "@/util/commonUtil";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { useChatRecordStore } from "@/store/chatRecord";
import { useModelStore } from "@/store/model";
import UserInfoModel from "@/components/UserInfoModel.vue";
import config from "@/config/config";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const { isResult, searcRecordMessages, recordKeyWord } = storeToRefs(searchStore);

const apiStore = useApiStore();
const { getEventListApi } = apiStore;
const { eventList, eventInfo } = storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const modelStore = useModelStore();
const { showCompanyInfo, gotoChat, gotoPhone } = modelStore;
const { isInfoPop, info } = storeToRefs(modelStore);

let changeList = ref();
let list = ref([]);

const emit = defineEmits(["getChangeList"]);

const getChangeList = () => {
    const getList = changeList.value;
    emit("getChangeList", getList);
};

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
    let messages = JSON.parse(localStorage.getItem(route.query.chatToken as any) || "[]");

    if (eventList.value.length > 0) {
        eventList.value.forEach((item: any) => {
            list.value = JSON.parse(localStorage.getItem(item.chatToken) || "[]");

            if (list.value.length > 0) {
                const infoLen = list.value.length;
                const isInfoYesterday = dayjs(
                    (list.value[infoLen - 1] as any).currentDate
                ).isYesterday();
                const isInfoToday = dayjs((list.value[infoLen - 1] as any).currentDate).isToday();
                const lastObj: IObj = {
                    ...item,
                    toTop: false,
                    show: true,
                    isfunctionPopUp: false,
                    sender: (list.value[infoLen - 1] as any).janusMsg.sender,
                    currentDate: (list.value[infoLen - 1] as any).currentDate,
                    msgType: (list.value[infoLen - 1] as any).janusMsg.msgType,
                    time: isInfoToday
                        ? (list.value[infoLen - 1] as any).time
                        : isInfoYesterday
                        ? "昨天"
                        : (list.value[infoLen - 1] as any).currentDate,
                    message: (list.value[infoLen - 1] as any).janusMsg.message,
                    format: (list.value[infoLen - 1] as any).janusMsg.format,
                    sup: list.value.length,
                };
                if (!recordMessages.value.some((msg: any) => msg.chatToken === item.chatToken)) {
                    recordMessages.value.push(lastObj);
                }
            }
        });
    }
    if (
        messages.length > 0 &&
        eventInfo.value.name !== "test" &&
        !recordMessages.value.some((msg: any) => msg.chatToken === route.query.chatToken)
    ) {
        let getObj = {
            chatToken: route.query.chatToken,
            ...messages[messages.length - 1],
        };
        const isInfoYesterday = dayjs(getObj.currentDate).isYesterday();
        const isInfoToday = dayjs(getObj.currentDate).isToday();
        const lastObj: IObj = {
            ...getObj,
            ...eventInfo.value,
            toTop: false,
            show: true,
            isfunctionPopUp: false,
            sender: getObj.janusMsg.sender,
            currentDate: getObj.currentDate,
            msgType: getObj.janusMsg.msgType,
            time: isInfoToday ? getObj.time : isInfoYesterday ? "昨天" : getObj.currentDate,
            message: getObj.janusMsg.message,
            format: getObj.janusMsg.format,
            sup: messages.length,
        };
        recordMessages.value.push(lastObj);
    }
    recordMessages.value.forEach((item: any, idx: any) => {
        item.key = idx;
    });

    changeList.value = JSON.parse(JSON.stringify(recordMessages.value));
    // console.log("recordMessages:", recordMessages.value);
});
//開啟功能列表
const openFunctionPopUp = (num: any) => {
    console.log(num);
    changeList.value.forEach((item: any) => {
        if (item.chatToken === num.chatToken) {
            item.isfunctionPopUp = !item.isfunctionPopUp;
        } else {
            item.isfunctionPopUp = false;
        }
    });
};

//刪除功能
const deletechatRoomBox = (item: any): void => {
    changeList.value = changeList.value.filter((num: any) => {
        num.isfunctionPopUp = false;
        return num.chatToken !== item.chatToken;
    });
};

//置頂功能
const pin = (item: any, idx: any): void => {
    const lists = changeList.value;
    lists.unshift(lists.splice(idx, 1)[0]);
    lists.forEach((it: any, index: any) => {
        if (it.chatToken === item.chatToken) {
            it.toTop = true;
        }
        it.isfunctionPopUp = false;
    });
    changeList.value = lists;
    console.log("新增置頂nums.value:", changeList.value);
};

// 取消置頂功能
const unpin = (item: any, index: any): void => {
    const lists = changeList.value;
    const getItem = lists.splice(index, 1)[0];
    lists.splice(item.key, 0, getItem);
    lists.forEach((it) => {
        if (it.chatToken === item.chatToken) {
            it.toTop = false;
        }
        it.isfunctionPopUp = false;
    });

    const toTopLists = lists.filter((isTop) => {
        return isTop.toTop;
    });
    const doNotTopLists = lists.filter((isTop) => {
        return !isTop.toTop;
    });
    changeList.value = [...toTopLists, ...doNotTopLists];
    console.log("取消nums.value:", changeList.value);
};

// //隱藏功能
// const hideChatRoomBox = (item: any) => {
//     recordMessages.value.forEach((num: any) => {
//         if (num.chatToken === item.chatToken) {
//             num.show = false;
//         }
//     });
//     isfunctionPopUp.value = false;
// };
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.description {
    width: 100%;
    text-align: center;
    margin: 1em auto;
    color: $gray-1;
    @extend %h4;
    line-height: 1.6;
}
.call_container {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    li {
        text-align: center;
    }
}
.chatRecordNotFound {
    @extend %h2;
    margin-top: 120px;
    text-align: center;
}
.searchRecordMessage {
    height: 100%;
    overflow-y: auto;
    .chatRoomBox {
        cursor: pointer;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        + .chatRoomBox {
            border-top: 1px solid $border-line;
        }
        &:last-child {
            border-bottom: 1px solid $border-line;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }
        .chatRoomList {
            max-width: 86%;
            display: flex;
            align-items: center;
            padding: 15px;
            @media (max-width: 599px) {
                max-width: 80%;
            }
            @media (max-width: 380px) {
                max-width: 78%;
            }
            @media (max-width: 320px) {
                max-width: 71%;
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
            .chatRoomInfo {
                h2.info_title {
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
            @media (max-width: 380px) {
                .messageEllipsis {
                    max-width: 150px;
                }
            }
        }
        .functionBox {
            max-width: 120px;
            padding-top: 15px;
            padding-right: 15px;
            display: flex;
            flex-direction: column;
            .time {
                text-align: right;
                min-width: 68px;
                color: $gray-3;
                font-size: $font-size-16;
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
    }
}
@media (max-width: 768px) {
    .searchRecordMessage {
        margin-top: 20px;
    }
}
.chatRecordMessage {
    height: calc(100% - 160px);
    overflow-y: auto;
    padding-top: 20px;
    box-sizing: border-box;
    .chatRoomBox {
        cursor: pointer;
        width: 100%;
        height: 90px;
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        + .chatRoomBox {
            border-top: 1px solid $border-line;
        }
        &:last-child {
            border-bottom: 1px solid $border-line;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }
        .chatRoomList {
            max-width: 86%;
            display: flex;
            align-items: center;
            padding: 15px;
            @media (max-width: 599px) {
                max-width: 80%;
            }
            @media (max-width: 380px) {
                max-width: 78%;
            }
            @media (max-width: 320px) {
                max-width: 71%;
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
            .chatRoomInfo {
                h2.info_title {
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
            @media (max-width: 380px) {
                .messageEllipsis {
                    max-width: 150px;
                }
            }
        }
        .functionBox {
            max-width: 120px;
            padding-top: 15px;
            padding-right: 15px;
            display: flex;
            .time {
                text-align: right;
                min-width: 68px;
                color: $gray-3;
                font-size: $font-size-16;
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
            .functionBoxMore {
                margin: auto 5px auto 12px;
                position: relative;
                .functionPopUp {
                    position: absolute;
                    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                    border-radius: 4px;
                    top: 25px;
                    right: 0px;
                    z-index: 1;
                    .ulList {
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
        }
    }
}
@media (max-width: 768px) {
    .chatRecordMessage {
        height: 100%;
        padding-top: 20px;
    }
}
</style>

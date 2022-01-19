<template>
    <div
        v-if="changeList?.length > 0 && searcRecordMessages?.length === 0 && recordKeyWord === ''"
        class="chatRecordMessage"
    >
        <a
            class="chatRoomBox"
            @touchstart.prevent="gtouchstart(num)"
            @touchmove.prevent="gtouchmove(num)"
            @touchend.prevent="gotoChat(num.chatToken)"
            v-for="num in changeList"
            :key="num.chatToken"
            :href="`/?chatToken=${num.chatToken}`"
        >
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @touchend.stop="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.serverUrl}/image/${num.icon}`" />
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
    <div v-if="searcRecordMessages?.length > 0 && recordKeyWord !== ''" class="chatRecordMessage">
        <a
            class="chatRoomBox"
            @touchstart.prevent="gtouchstart(num)"
            @touchmove.prevent="gtouchmove(num)"
            @touchend.prevent="gotoChat(num.chatToken)"
            v-for="num in searcRecordMessages"
            :key="num.chatToken"
            :href="`/?chatToken=${num.chatToken}`"
        >
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @touchend.stop="showCompanyInfo(num)">
                    <n-avatar round :size="48" :src="`${config.serverUrl}/image/${num.icon}`" />
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
    <div
        class="chatRecordNotFound"
        v-if="searcRecordMessages?.length === 0 && changeList?.length === 0"
    >
        尚無交談紀錄
    </div>
    <teleport to="body" v-if="isfunctionPopUp && !isInfoPop">
        <div class="mask" @touchend.stop="gtouchend()">
            <div class="functionPopUp">
                <ul>
                    <!-- <li @click="hideChatRoomBox(num)">隱藏</li> -->
                    <li @touchend.prevent="toTop(popMsg)" v-if="!popMsg.toTop">開啟置頂</li>
                    <li @touchend.prevent="cancelToTop(popMsg)" v-if="popMsg.toTop">取消置頂</li>
                    <li @touchend.stop="deletechatRoomBox(popMsg)">刪除</li>
                </ul>
            </div>
        </div>
    </teleport>
    <UserInfoModel />
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, watch, onUpdated } from "vue";
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
const { eventList } = storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const modelStore = useModelStore();
const { showCompanyInfo, gotoChat, gotoPhone } = modelStore;
const { isInfoPop, info } = storeToRefs(modelStore);

let changeList = ref();

let list = ref([]);

interface IObj {
    [propName: string]: any;
    toTop: boolean;
    show: boolean;
    currentDate: string;
    time: string;
    message: string | null;
    format: string | null;
}
const isfunctionPopUp = ref(false);
const popMsg = ref();
const timeOutEvent = ref(0);
//開始按
const gtouchstart = (msg: any) => {
    console.log("gtouchstart");
    timeOutEvent.value = setTimeout(function () {
        if (!isInfoPop.value) {
            longPress(msg);
            console.log("長按", msg);
        }
    }, 500);
};
//手釋放，如果在500毫秒内就釋放，則取消長按事件，此时可以執行onclick執行事件
const gtouchend = () => {
    console.log("gtouchend");

    clearInterval(timeOutEvent.value);
    isfunctionPopUp.value = false;
};
//如果手指有移動，則取消所有事件，此时說名用户只是要移動而不是長按
const gtouchmove = (msg: any) => {
    console.log("gtouchmove");
    isfunctionPopUp.value = true;
    clearTimeout(timeOutEvent.value); //清除定时器
    timeOutEvent.value = 0;
};

//真正長按後應該執行的内容
const longPress = (msg: any) => {
    timeOutEvent.value = 0;
    isfunctionPopUp.value = true;
    popMsg.value = msg;
};
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
    changeList.value = recordMessages.value;
});

//刪除功能
const deletechatRoomBox = (item: any): void => {
    changeList.value = changeList.value.filter((num: any) => {
        return num.chatToken !== item.chatToken;
    });
    isfunctionPopUp.value = false;
};
//置頂功能
const toTop = (item: any): void => {
    const lists = recordMessages.value;
    lists.forEach((num: any) => {
        if (num.chatToken === item.chatToken) {
            num.toTop = true;
        }
    });
    const topList = lists.filter((num: any) => {
        return num.toTop;
    });
    const otherList = lists.filter((num: any) => {
        return !num.toTop;
    });
    changeList.value = topList.concat(otherList);
    isfunctionPopUp.value = false;
    console.log("新增置頂nums.value:", changeList.value);
};

// 取消置頂功能
const cancelToTop = (item: any): void => {
    const lists = recordMessages.value;
    lists.forEach((num: any) => {
        if (num.chatToken === item.chatToken) {
            num.toTop = false;
        }
    });
    const topList = lists.filter((num: any) => {
        return num.toTop;
    });
    const otherList = lists.filter((num: any) => {
        return !num.toTop;
    });
    changeList.value = topList.concat(otherList);
    isfunctionPopUp.value = false;
    console.log("取消nums.value:", changeList.value);
};

//隱藏功能
const hideChatRoomBox = (item: any) => {
    recordMessages.value.forEach((num: any) => {
        if (num.chatToken === item.chatToken) {
            num.show = false;
        }
    });
    isfunctionPopUp.value = false;
};
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
.chatRecordMessage {
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
            .chatRoomInfo {
                h2.info_title {
                    @extend %h2;
                    margin-bottom: 6px;
                    color: $gray-2;
                }
                p {
                    @extend %h4;
                    line-height: 1.2;
                    color: $gray-3;
                }
            }
        }
        .functionBox {
            padding-right: 15px;
            .time {
                padding-top: 15px;
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
    }
}
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.functionPopUp {
    position: absolute;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 30%);
    background-color: $primary-3;
    border-radius: 10px;
    right: 40px;

    ul {
        padding-top: 0.3em;
        padding-bottom: 0.3em;
        li {
            text-align: center;
            margin: auto;
            display: block;
            color: $gray-1;
            font-size: $font-size-14;
            padding: 15px 10px;
            + li {
                border-top: 1px solid $white;
            }
            &:hover {
                cursor: pointer;
                background-color: $primary-1;
                transition: 0.5s;
            }
        }
    }
}
@media (max-width: 768px) {
    .functionPopUp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .chatRecordMessage {
        margin-top: 20px;
    }
}
</style>

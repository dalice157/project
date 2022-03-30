<template>
    <!--搜尋交談結果-->
    <div v-if="searcRecordMessages?.length > 0 && recordKeyWord !== ''" class="searchRecordMessage">
        <div
            class="chatRoomBox"
            v-for="num in searcRecordMessages"
            :key="num.chatroomID"
            @click.stop="gotoChat(route.params.id, num.chatroomID, num.mobile, router)"
        >
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @click.stop="showCompanyInfo(num)">
                    <n-avatar v-if="num.icon == 0" round :size="48" :src="user_pic_defaul" />
                    <n-avatar
                        v-if="num.icon !== 0"
                        round
                        :size="48"
                        :src="`${config.fileUrl}/fls/${num.icon}`"
                    />
                </div>
                <div class="chatRoomInfo">
                    <h2 class="info_title" v-if="!num.name">
                        {{ "+" + String(num.mobile).slice(0, 3) }}
                        {{ String(num.mobile).slice(-9) }}
                    </h2>
                    <h2 class="info_title" v-else>{{ num.name }}</h2>
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
                    {{
                        isToday
                            ? dayjs(num.time / 1000000).format("A hh:mm")
                            : isYesterday
                            ? "昨天"
                            : dayjs(num.time / 1000000).format("MM/DD")
                    }}
                </div>
                <div class="badge" v-if="num.unread === 0">
                    <div class="badgeBg">
                        <span class="badgeSup">未讀</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 交談歷史紀錄 -->

    <div
        v-if="changeList?.length > 0 && searcRecordMessages?.length === 0 && recordKeyWord === ''"
        class="chatRecordMessage"
    >
        <div
            class="chatRoomBox"
            v-for="(num, index) in changeList"
            :key="num.chatroomID"
            @click.stop="gotoChat(route.params.id, num.chatroomID, num.mobile, router)"
        >
            <!-- {{num.msg}} -->
            <!-- v-show="num.show" -->
            <div class="chatRoomList">
                <div class="avatar" @click.stop="showCompanyInfo(num)">
                    <n-avatar
                        v-if="num.icon == 0"
                        round
                        :size="48"
                        :src="`${config.fileUrl}/fls/icon/default.svg`"
                    />
                    <n-avatar
                        v-if="num.icon !== 0"
                        round
                        :size="48"
                        :src="`${config.fileUrl}/fls/icon/${num.icon}.png`"
                    />
                    <img
                        class="img"
                        src="../../assets/Images/chatRecord/pushpin-round.svg"
                        alt="置頂"
                        v-if="num.pinTop"
                    />
                </div>
                <div class="chatRoomInfo">
                    <h2 class="info_title" v-if="!num.name">
                        {{ "+" + String(num.mobile).slice(0, 3) }}
                        {{ String(num.mobile).slice(-9) }}
                    </h2>
                    <h2 class="info_title" v-else>{{ num.name }}</h2>
                    <n-ellipsis class="messageEllipsis" :line-clamp="1" :tooltip="false">
                        <p v-if="num.msgType === 1 && num.msg != ''">
                            {{ num.msg }}
                        </p>
                        <p v-if="[3, 5, 6, 7, 8, 9].includes(num.msgType)">
                            傳送了{{ sendMsgTypeObj[num.msgType] }}
                        </p>
                        <p v-if="num.msgType === 1 && num.msg == ''"></p>
                    </n-ellipsis>
                </div>
            </div>
            <div class="functionBox">
                <div>
                    <div class="time">
                        {{
                            isToday
                                ? dayjs(num.time / 1000000).format("A hh:mm")
                                : isYesterday
                                ? "昨天"
                                : dayjs(num.time / 1000000).format("MM/DD")
                        }}
                    </div>

                    <div class="functionBoxMore" :class="{ show: num.isfunctionPopUp }">
                        <img
                            @click.stop="openFunctionPopUp(num)"
                            src="@/assets/Images/chatRecord/more.svg"
                            alt="#"
                        />

                        <div class="functionPopUp" v-show="num.isfunctionPopUp">
                            <ul class="ulList">
                                <li @click.stop="pin(num, index)" v-if="!num.pinTop">開啟置頂</li>
                                <li @click.stop="unpin(num, index)" v-if="num.pinTop">取消置頂</li>
                                <!-- <li @click.stop="deletechatRoomBox(num)">刪除</li> -->
                            </ul>
                        </div>
                    </div>
                    <div class="badge" v-if="num.unread === 0">
                        <div class="badgeBg">
                            <span class="badgeSup">未讀</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
import { ref, computed, watchEffect, watch, onUpdated } from "vue";
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
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const { isResult, searcRecordMessages, recordKeyWord } = storeToRefs(searchStore);

const apiStore = useApiStore();
const { sendPinTop, getChatroomlistApi } = apiStore;
const { chatroomList, userInfo } = storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const modelStore = useModelStore();
const { showCompanyInfo, gotoChat } = modelStore;
const { isInfoPop, info } = storeToRefs(modelStore);

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

let changeList: any = computed({
    get() {
        return recordMessages.value;
    },
    set(val) {
        recordMessages.value = val;
    },
});

let i = ref(0);
watch(chatroomList, (newVal, oldVal) => {
    console.log("newVal:", newVal);
    console.log("oldVal:", oldVal);

    if (chatroomList.value.length > 0) {
        recordMessages.value = chatroomList.value;
    }
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
    console.log("item:", item);

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
    height: calc(100% - 160px);
    overflow-y: auto;
    padding-top: 20px;
    box-sizing: border-box;
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
.chatRecordMessage {
    height: calc(100% - 160px);
    overflow-y: auto;
    padding-top: 20px;
    box-sizing: border-box;
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
            .functionBox {
                .badge {
                    display: none;
                }
                .functionBoxMore {
                    display: flex;
                }
            }
        }
        .chatRoomList {
            max-width: 86%;
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
            .functionBoxMore {
                padding: 8px 5px 0 12px;
                position: relative;
                display: none;
                justify-content: flex-end;
                align-items: center;
                &.show {
                    display: flex;
                }
                img {
                    width: 25px;
                }
                .functionPopUp {
                    position: absolute;
                    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                    border-radius: 4px;
                    top: 25px;
                    right: 0px;
                    z-index: 1;
                    .ulList {
                        background-color: $primary-4;
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
            }
        }
    }
}
</style>

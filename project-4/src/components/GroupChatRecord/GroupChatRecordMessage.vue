<template>
    <!--搜尋交談結果-->
    <div v-if="searcRecordMessages?.length > 0 && recordKeyWord !== ''" class="chat-log--search">
        <div
            class="box"
            @touchmove.stop="gtouchmove"
            @[events].stop="logGotoChat(num.chatToken, changeList)"
            v-for="num in searcRecordMessages"
            :key="num.chatToken"
        >
            <div class="box__show">
                <div class="box__item">
                    <div
                        class="avatar"
                        @touchmove.stop="gtouchmove"
                        @[events].stop="showCompanyInfo(num)"
                    >
                        <n-avatar round :size="48" :src="`${config.fileUrl}${num.icon}`" />
                    </div>
                    <div class="info">
                        <h2 class="info__title">{{ num.name }} ({{ num.people }})</h2>
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
                            {{
                                dayjs(num.janusMsg.config?.currentDate).isToday()
                                    ? currentTime(num.janusMsg.time / 1000000)
                                    : num.janusMsg.config.currentDate
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 交談歷史紀錄 -->
    <div
        v-if="
            changeList?.length > 0 &&
            searcRecordMessages?.length === 0 &&
            recordKeyWord === '' &&
            noRecordBoolean === false
        "
        class="chat-log"
    >
        <div
            class="box"
            v-for="(num, index) in changeList"
            :key="num.chatToken"
            @touchmove.stop="gtouchmove"
            @[events].stop="logGotoChat(num.chatToken, changeList)"
        >
            <div class="box__show" v-show="num.show">
                <div class="box__item">
                    <div
                        class="avatar"
                        @touchmove.stop="gtouchmove"
                        @[events].stop="showCompanyInfo(num)"
                    >
                        <n-avatar round :size="48" :src="`${config.fileUrl}${num.icon}`" />
                        <img class="img" :src="pinIcon" alt="置頂" v-if="num.toTop" />
                    </div>
                    <div class="info">
                        <h2 class="info__title">{{ num.name }} ({{ num.people }})</h2>
                        <n-ellipsis class="messageEllipsis" :line-clamp="1" :tooltip="false">
                            <p v-if="num.janusMsg.msgContent">
                                {{ num.janusMsg.msgContent }}
                            </p>
                            <p v-if="[3, 5, 6, 7, 8, 9, 11].includes(num.janusMsg.msgType)">
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
                            {{
                                dayjs(num.janusMsg.config?.currentDate).isToday()
                                    ? currentTime(num.janusMsg.time / 1000000)
                                    : num.janusMsg.config.currentDate
                            }}
                        </div>
                        <div class="badge">
                            <div class="badge__bg" v-show="num.unread">
                                <span class="badge__sup">未讀</span>
                            </div>
                        </div>
                    </div>
                    <div class="function__more" @[events].stop="openFunctionPopUp(num)">
                        <img :src="moreIcon" alt="more" class="more-icon" />
                        <div class="popUp" v-show="num.isfunctionPopUp">
                            <ul class="popUp__ul">
                                <li @[events].stop="pin(num, index)" v-if="!num.toTop">開啟置頂</li>
                                <li @[events].stop="unpin(num, index)" v-if="num.toTop">
                                    取消置頂
                                </li>
                                <!-- <li @touchend.stop="deletechatRoomBox(num)">刪除</li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        class="chat-log--notFound"
        v-if="
            (searcRecordMessages?.length === 0 && changeList?.length === 0) ||
            noRecordBoolean == true
        "
    >
        尚無交談紀錄
    </div>
    <UserInfoModel />
    <Loading :isLoading="isLoading" />
</template>

<script lang="ts" setup>
import {
    ref,
    watchEffect,
    onMounted,
    onUpdated,
    onUnmounted,
    computed,
    reactive,
    watch,
} from "vue";
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
import Loading from "@/components/LoadingPage.vue";

const events = ref(isMobile ? "touchend" : "click");

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
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const { isResult, searcRecordMessages, recordKeyWord } = storeToRefs(searchStore);

const apiStore = useApiStore();
const { getGroupChatHistoryMessage } = apiStore;
const { groupChatHistoryMessageListFirst, groupChatHistoryMessageList } = storeToRefs(apiStore);

const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const modelStore = useModelStore();
const { showCompanyInfo, logGotoChat, gotoPhone } = modelStore;
const { isInfoPop, info, isLoading, isMove } = storeToRefs(modelStore);
// 移動判定不進聊天室
const gtouchmove = () => {
    isMove.value = true;
};
//判斷如果都沒有列表 必須顯示尚無交談紀錄
const noRecord = (room) => {
    return room.show === false;
};
const noRecordBoolean = ref(false);
onUpdated(() => {
    noRecordBoolean.value = changeList.value.every(noRecord);
});
const groupChatRecordList = ref([]) as any;
const changeList = ref([]) as any;
//首次進入打歷史訊息API
onMounted(() => {
    getGroupChatHistoryMessage(route.params.eventKey, false);
});
// 每五秒刷一次歷史訊息API
const timer = ref(null);
timer.value = setInterval(() => {
    getGroupChatHistoryMessage(route.params.eventKey, true);
}, 5000);

onUnmounted(() => {
    clearInterval(timer.value);
});
onMounted(() => {
    // 初始化陣列
    watch(
        groupChatHistoryMessageListFirst,
        () => {
            console.log("api初始化陣列", groupChatHistoryMessageListFirst.value);
            // 如果完全沒有recordList 首次創建recordList
            if (localStorage.getItem("groupChatRecordList") === null) {
                // 查看local有多少間聊天室
                const localDeviceHasChatroom = JSON.parse(
                    localStorage.getItem("localDeviceHasChatroom")
                );
                console.log("查看local聊天室", localDeviceHasChatroom);
                groupChatHistoryMessageListFirst.value.forEach((item) => {
                    // 判斷如果local有此聊天室 訊息塞聊天室最後一筆訊息
                    if (localDeviceHasChatroom.includes(item.chatToken)) {
                        let roomObj = {
                            eventID: item.eventID,
                            chatToken: item.chatToken,
                            name: item.name,
                            icon: item.icon,
                            people: item.number_ex + item.number_in,
                            janusMsg: JSON.parse(
                                localStorage.getItem(`${item.chatToken}-lastMessage`)
                            )?.janusMsg,
                            isfunctionPopUp: false,
                            toTop: false,
                            show: true,
                        };
                        groupChatRecordList.value.push(roomObj);
                    }
                });
                changeList.value = groupChatRecordList.value;
                recordMessages.value = groupChatRecordList.value;
                localStorage.setItem(
                    "groupChatRecordList",
                    JSON.stringify(groupChatRecordList.value)
                );
                console.log("首次創建recordList", groupChatRecordList.value);
            } else {
                //如果有recordlist的狀況
                groupChatRecordList.value = JSON.parse(localStorage.getItem("groupChatRecordList"));
                //更新當前聊天室歷史紀錄
                groupChatRecordList.value.forEach((item) => {
                    if (item.chatToken === route.params.eventKey) {
                        item.janusMsg =
                            JSON.parse(localStorage.getItem(`${item.chatToken}-lastMessage`))
                                ?.janusMsg !== undefined
                                ? JSON.parse(localStorage.getItem(`${item.chatToken}-lastMessage`))
                                      ?.janusMsg
                                : JSON.parse(localStorage.getItem(`${item.chatToken}`))
                                      .filter((room) => {
                                          return room.janusMsg.config.recallStatus === false;
                                      })
                                      .pop().janusMsg;
                    }
                });
                // console.log("初始化聊天室有的歷史紀錄", groupChatRecordList.value);
                const localDeviceHasChatroom = JSON.parse(
                    localStorage.getItem("localDeviceHasChatroom")
                );
                // console.log("本地裝置有的聊天室", localDeviceHasChatroom);
                // console.log(" 之前有創過的 groupChatRecordList ", groupChatRecordList.value);
                // groupChatRecordList 有的room
                const recordHasRoom = groupChatRecordList.value.map((item) => item.chatToken);
                // console.log("之前 groupChatRecordList 創過的 room", recordHasRoom);
                const addRoom = localDeviceHasChatroom.filter((item) => {
                    return recordHasRoom.indexOf(item) === -1;
                });
                // console.log("需要添加的room", addRoom);
                const apiHasRoom = groupChatHistoryMessageListFirst.value.map(
                    (item) => item.chatToken
                );
                // console.log("api 允許聊天室", apiHasRoom);
                let finalRoom = [];
                finalRoom = apiHasRoom.filter((item) => {
                    return addRoom.includes(item);
                });
                // console.log("最後可添加之聊天室", finalRoom);
                // 需要添加的room
                finalRoom.forEach((room) => {
                    let roomObj = {
                        eventID: room.slice(0, 2),
                        chatToken: room,
                        name: localStorage.getItem(`${room}-name`),
                        description: localStorage.getItem(`${room}-description`),
                        homeurl: localStorage.getItem(`${room}-homeurl`),
                        icon: localStorage.getItem(`${room}-icon`),
                        janusMsg:
                            JSON.parse(localStorage.getItem(`${room}-lastMessage`))?.janusMsg !==
                            undefined
                                ? JSON.parse(localStorage.getItem(`${room}-lastMessage`))?.janusMsg
                                : JSON.parse(localStorage.getItem(`${room}`))
                                      .filter((item) => {
                                          return item.janusMsg.config.recallStatus === false;
                                      })
                                      .pop().janusMsg,
                        isfunctionPopUp: false,
                        toTop: false,
                        show: true,
                    };
                    groupChatRecordList.value.push(roomObj);
                });
                //只顯示api允許之房間
                groupChatRecordList.value.forEach((record) => {
                    if (apiHasRoom.includes(record.chatToken)) {
                        record.show = true;
                    } else {
                        record.show = false;
                    }
                });
                groupChatRecordList.value.sort((a, b) => b.janusMsg.time - a.janusMsg.time);
                const toTopLists = groupChatRecordList.value.filter((item) => {
                    return item.toTop;
                });
                const doNotTopLists = groupChatRecordList.value.filter((item) => {
                    return !item.toTop;
                });
                // .sort((a, b) => a.key - b.key);
                groupChatRecordList.value = [...toTopLists, ...doNotTopLists];
                console.log("初始化更新過後的local資料", groupChatRecordList.value);
                changeList.value = groupChatRecordList.value;
                recordMessages.value = groupChatRecordList.value;
                localStorage.setItem(
                    "groupChatRecordList",
                    JSON.stringify(groupChatRecordList.value)
                );
            }
        },
        { deep: true }
    );
    // 每5秒API陣列
    watch(
        groupChatHistoryMessageList,
        () => {
            console.log("每5秒刷新api 更新訊息", groupChatHistoryMessageList.value);
            groupChatRecordList.value = JSON.parse(localStorage.getItem("groupChatRecordList"));
            // console.log("聊天室有的歷史紀錄", groupChatRecordList.value);
            // 若local有資料更新最後一筆訊息
            groupChatRecordList.value.forEach((record) => {
                groupChatHistoryMessageList.value.forEach((item) => {
                    //更新狀態
                    if (record.chatToken === item.chatToken) {
                        record.name = item.name;
                        record.icon = item.icon;
                        record.people = item.number_ex + item.number_in;
                        //若有訊息更新訊息
                        if (item.msg.janusMsg.config !== null) {
                            record.janusMsg = item.msg.janusMsg;
                            record.unread = true;
                        }
                    }
                });
            });
            groupChatRecordList.value.sort((a, b) => b.janusMsg.time - a.janusMsg.time);
            const toTopLists = groupChatRecordList.value.filter((item) => {
                return item.toTop;
            });
            const doNotTopLists = groupChatRecordList.value.filter((item) => {
                return !item.toTop;
            });
            // .sort((a, b) => a.key - b.key);
            groupChatRecordList.value = [...toTopLists, ...doNotTopLists];
            changeList.value = groupChatRecordList.value;
            recordMessages.value = groupChatRecordList.value;
            localStorage.setItem("groupChatRecordList", JSON.stringify(groupChatRecordList.value));
        },
        { deep: true }
    );
});

const emit = defineEmits(["getChangeList"]);
const getChangeList = () => {
    const getList = changeList.value;
    emit("getChangeList", getList);
};

//開啟功能列表
const openFunctionPopUp = (num: any) => {
    changeList.value.forEach((item: any) => {
        if (item.chatToken === num.chatToken) {
            item.isfunctionPopUp = !item.isfunctionPopUp;
        } else {
            item.isfunctionPopUp = false;
        }
    });
    localStorage.setItem(`groupChatRecordList`, JSON.stringify(changeList.value));
};
// //刪除功能
// const deletechatRoomBox = (item: any): void => {
//     changeList.value = changeList.value.filter((num: any) => {
//         num.isfunctionPopUp = false;
//         return num.chatroomID !== item.chatroomID;
//     });
//     if (changeList.value.length <= 0) {
//         alert("只有一筆,所以無法刪除");
//     }
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
        if (it.chatToken === item.chatToken) {
            it.toTop = true;
        }
        it.isfunctionPopUp = false;
    });
    changeList.value = lists;
    localStorage.setItem(`groupChatRecordList`, JSON.stringify(changeList.value));
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

    const toTopLists = lists.filter((item) => {
        return item.toTop;
    });
    const doNotTopLists = lists
        .filter((item) => {
            return !item.toTop;
        })
        .sort((a, b) => a.key - b.key);
    changeList.value = [...toTopLists, ...doNotTopLists];
    localStorage.setItem(`groupChatRecordList`, JSON.stringify(changeList.value));
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
    &__show {
        cursor: pointer;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        + .box {
            border-top: 1px solid $border-line;
        }
        &:last-child {
            border-bottom: 1px solid $border-line;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }
    }

    &__item {
        width: 86%;
        display: flex;
        align-items: center;
        padding: 15px;
        overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        // word-break: break-all;
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
        padding-top: 15px;
        padding-right: 15px;
        display: flex;
        &__time {
            .time {
                text-align: right;
                min-width: 120px;
                color: $gray-3;
                font-size: $font-size-14;
                font-weight: 500;
            }
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
        }
        &__more {
            margin: auto 5px auto 12px;
            position: relative;
            z-index: 10;
        }
    }
}
.popUp {
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
    border-radius: 4px;
    top: 25px;
    right: 0px;
    z-index: 100;

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
.chat-log {
    height: calc(100vh - 170px);
    overflow-y: auto;
    // box-sizing: border-box;
    &--search {
        height: calc(100% - 100px);
        overflow-y: auto;
    }

    &--notFound {
        @extend %h2;
        margin-top: 120px;
        text-align: center;
    }
    // @media (max-width: 768px) {
    //     .chat-log--search {
    //         margin-top: 20px;
    //     }
    // }
}
@media (max-width: 768px) {
    .chat-log {
        min-height: 100%;
        height: calc(100vh - 245px);
        overflow-y: auto;
        // margin-bottom: -80px;
        // position: absolute;
        // -webkit-overflow-scrolling: touch;
        // z-index: 1;
        &--search {
            height: calc(100vh - 120px);
            padding-top: 40px;
        }
        .more-icon {
            width: 35px;
            height: 35px;
        }
    }
}
</style>

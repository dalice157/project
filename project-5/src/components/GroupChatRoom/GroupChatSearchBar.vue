<template>
    <!-- 搜尋bar -->
    <div v-if="searchBoolean" class="searchBar">
        <div class="searchArea">
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input
                    v-model:value="keyWord"
                    type="text"
                    placeholder="訊息"
                    @keydown.enter.exact.prevent="groupChatSearchResult(keyWord)"
                >
                    <template #prefix>
                        <img :src="searchIcon" alt="搜索" />
                    </template>
                    <template #suffix>
                        <img
                            class="clearKeyWord"
                            :src="closeIcon"
                            v-if="keyWord"
                            @click="clearResultKeyWord()"
                            alt="關閉"
                        />
                    </template>
                </n-input>
            </n-config-provider>
        </div>
        <div class="searchBtn" v-if="keyWord" @click="groupChatSearchResult(keyWord)">搜尋</div>
        <div class="closeSearchBar" @click="closeSearchBar()" v-else>關閉</div>
    </div>
    <div v-if="isResult" class="result">
        <h1 class="numOfsearchMessage" v-if="searcMessages.length > 0">
            訊息{{ searcMessages.length }}則
        </h1>
        <ul class="list" v-if="searcMessages.length > 0">
            <li
                class="item"
                :key="msg.janusMsg.config.id"
                v-for="msg in searcMessages"
                @click.prevent="groupChatGoto(msg.janusMsg.config.id, route.query.eventID)"
            >
                <!-- 判斷為前台使用者 -->
                <template v-for="people in outterPeopleInfo" :key="people.accountID">
                    <!-- 預設頭貼 -->
                    <n-avatar
                        class="userAvatar"
                        v-if="
                            msg.janusMsg.userName === '' &&
                            people.accountID === msg.janusMsg.chatroomID &&
                            people.icon === '0'
                        "
                        :size="48"
                        :src="outterPeopleDefault"
                    />
                    <!-- 設定後頭貼 -->
                    <n-avatar
                        class="userAvatar"
                        v-if="
                            msg.janusMsg.userName === '' &&
                            people.accountID === msg.janusMsg.chatroomID &&
                            people.icon !== '0'
                        "
                        :size="48"
                        :src="`${config.fileUrl}icon/${people.icon}.png`"
                    />
                </template>
                <!-- 判斷為後台管理員 -->
                <template v-for="people in innerPeopleInfo" :key="people.accountID">
                    <!-- 預設頭貼 -->
                    <n-avatar
                        class="managerAvatar"
                        :size="48"
                        v-if="
                            msg.janusMsg.chatroomID === '' &&
                            people.account === msg.janusMsg.userName &&
                            !people.icon
                        "
                        :src="innerPeopleDefault"
                    />
                    <!-- 客製化頭貼-->
                    <n-avatar
                        class="managerAvatar"
                        :size="48"
                        v-if="
                            msg.janusMsg.chatroomID === '' &&
                            people.account === msg.janusMsg.userName &&
                            people.icon
                        "
                        :src="`${config.fileUrl}${people.icon}`"
                    />
                </template>
                <div class="info">
                    <!-- 群聊對方的姓名顯示 B端 -->
                    <span class="name" v-if="msg.janusMsg.userName !== ''">{{
                        msg.janusMsg.userName
                    }}</span>
                    <!-- 群聊對方的姓名顯示 C端 -->
                    <template v-for="people in outterPeopleInfo" :key="people.accountID">
                        <span
                            class="name"
                            v-if="
                                msg.janusMsg.userName === '' &&
                                people.accountID === msg.janusMsg.chatroomID
                            "
                            >{{ people.name ? people.name : people.accountID }}</span
                        >
                    </template>
                    <n-ellipsis
                        class="msg"
                        v-if="msg.janusMsg.tagMsg"
                        v-html="msg.janusMsg.tagMsg"
                        :line-clamp="2"
                        style="width: 95%"
                        :tooltip="false"
                    />
                    <div
                        class="picture"
                        v-else-if="
                            msg.janusMsg.msgType === 6 ||
                            msg.janusMsg.msgType === 7 ||
                            msg.janusMsg.msgType === 11
                        "
                    >
                        <div v-if="msg.janusMsg.msgType === 6">
                            {{ msg.janusMsg.format.ShowName }}
                        </div>
                        <span v-if="msg.janusMsg.msgType === 7">
                            {{ msg.janusMsg.format.ShowName }}
                        </span>
                        <span v-if="msg.janusMsg.msgType === 11">
                            {{ msg.janusMsg.format.ShowName }}
                        </span>
                    </div>
                </div>
                <div class="time">
                    {{
                        dayjs.unix(msg.janusMsg.time / 1000000000).isToday()
                            ? dayjs.unix(msg.janusMsg.time / 1000000000).format("A hh:mm")
                            : dayjs.unix(msg.janusMsg.time / 1000000000).isYesterday()
                            ? "昨天" + dayjs.unix(msg.janusMsg.time / 1000000000).format("A hh:mm")
                            : dayjs
                                  .unix(msg.janusMsg.time / 1000000000)
                                  .format("YYYY/MM/DD A hh:mm")
                    }}
                </div>
            </li>
        </ul>
        <p class="empty" v-else>查無資料</p>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, watch, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { NConfigProvider, NInput, NIcon, NAvatar, NEllipsis } from "naive-ui";
import dayjs from "dayjs";
import { currentDate, currentTime } from "@/util/dateUtil";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

import { useSearchStore } from "@/store/search";
import { useApiStore } from "@/store/api";
import { getFileExtension } from "@/util/commonUtil";
import config from "@/config/config";
import searchIcon from "@/assets/Images/chatroom/search.svg";
import closeIcon from "@/assets/Images/chatroom/round-fill_close.svg";
import userIcon from "@/assets/Images/mugShot/User-round.svg";
import innerPeopleDefault from "@/assets/Images/groupChat/User default-B.svg";
import outterPeopleDefault from "@/assets/Images/groupChat/User default-C.svg";

// api store
const apiStore = useApiStore();
const { getEventListApi } = apiStore;
const { eventInfo, eventList, chatRoomInnerPeopleInfo, chatRoomOutterPeopleInfo } =
    storeToRefs(apiStore);

const searchStore = useSearchStore();
const { searchSwitch, groupChatSearchResult, groupChatGoto, clearResultKeyWord, closeSearchBar } =
    searchStore;
const { searchBoolean, isResult, searcMessages, keyWord } = storeToRefs(searchStore);

const route = useRoute();
const mobile: any = computed(() => route.query.mobile);

const innerPeopleInfo: any = computed(() => chatRoomInnerPeopleInfo.value);
const outterPeopleInfo: any = computed(() => chatRoomOutterPeopleInfo.value);
// UI 主題
const themeOverrides = {
    common: {},
    Input: {
        fontSize: "14px",
        border: "1px solid #ececec",
    },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.searchBar {
    font-family: $font-family;
    padding: 10px 15px;
    position: absolute;
    width: 100%;
    height: 50px;
    left: 0;
    top: 46px;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;
    .searchArea {
        width: calc(100% - 45px);
        height: 35px;
        img {
            width: 16px;
            height: 16px;
        }
        .clearKeyWord {
            cursor: pointer;
        }
        .n-input {
            background-color: $white;
            box-shadow: 1px 1px 4px rgba(227, 227, 227, 0.5);
            border-radius: 20px;
            height: 36px;
        }
        .n-input__input-el {
            outline-style: none;
            margin: 0;
        }
        .n-input-wrapper {
            height: 36px;
        }
        .n-input__suffix {
            & .n-icon {
                cursor: pointer;
            }
        }
    }
    .closeSearchBar,
    .searchBtn {
        margin-left: 10px;
        cursor: pointer;
        text-align: center;
        line-height: 35px;
        color: $gray-1;
        font-family: $font-family;
        @extend %h4;
        text-shadow: 0px 2px 4px $gray-6;
    }
}
.result {
    position: absolute;
    top: 166px;
    width: 100%;
    top: 96px;
    height: calc(100% - 100px);
    background-color: $white;
    z-index: 100;

    .empty {
        height: calc(100% - 165px);
        text-align: center;
        margin-top: 10rem;
        color: $gray-3;
        font-size: $font-size-26;
        font-weight: 500;
    }

    .list {
        font-family: $font-family;
        width: 100%;
        height: calc(100% - 60px);
        overflow-y: auto;
        margin: 1em auto 0;
        .item {
            + .item {
                // margin-top: 0.3em;
            }
            display: flex;
            align-items: flex-start;
            cursor: pointer;
            padding: 10px 15px;
            &:hover,
            &:focus {
                background-color: $primary-4;
                border-radius: 5px;
            }
            .userAvatar {
                margin-right: 10px;
            }
            .managerAvatar {
                margin-right: 10px;
                border-radius: 50%;
            }
            .info {
                flex-direction: column;
                width: calc(100% - 200px);
                .name + .msg,
                .name + .picture {
                    margin-top: 6px;
                }
                .name {
                    display: block;
                    @extend %h4;
                }
                .picture {
                    img {
                        height: 32px;
                    }
                }
            }
            .time {
                font-size: $font-size-14;
                color: $gray-3;
            }
        }
    }
}
.numOfsearchMessage {
    margin-top: 10px;
    margin-left: 10px;
}
</style>

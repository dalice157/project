<template>
    <!-- 搜尋bar -->
    <div v-if="searchBoolean" class="search-bar--chatRoom">
        <n-input v-model:value="keyWord" type="text" placeholder="訊息">
            <template #prefix>
                <img :src="searchIcon" alt="search" />
            </template>
            <template #suffix>
                <img
                    class="clearKeyWord"
                    :src="closeIcon"
                    v-if="keyWord"
                    @[events]="clearResultKeyWord()"
                    alt="close"
                />
            </template>
        </n-input>
        <div class="searchBtn" v-if="keyWord" @[events]="onSearchResult(keyWord)">搜尋</div>
        <div class="closeSearchBar" @[events]="closeSearchBar()" v-else>關閉</div>
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
                @[events].prevent="onClickGoto(msg.janusMsg.config.id, route.params.eventKey)"
            >
                <n-avatar
                    class="avatar"
                    v-if="msg.janusMsg.sender === 0"
                    :size="48"
                    :src="`${config.fileUrl}${eventInfo.icon}`"
                />
                <img
                    class="avatar"
                    :size="48"
                    v-else-if="msg.janusMsg.sender === 1"
                    :src="userIcon"
                />
                <div class="info">
                    <span class="name">{{
                        msg.janusMsg.sender === 0 ? eventInfo.name : "自己"
                    }}</span>
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
                        v-else-if="msg.janusMsg.msgType === 6 || msg.janusMsg.msgType === 7"
                    >
                        <img
                            v-if="msg.janusMsg.msgType === 6"
                            :src="`${config.fileUrl}${msg.janusMsg.format.Fileid}${msg.janusMsg.format.ExtensionName}`"
                        />
                        <span v-if="msg.janusMsg.msgType === 7">
                            {{ msg.janusMsg.format.ShowName }}
                        </span>
                    </div>
                </div>
                <div class="time">{{ currentTime(msg.janusMsg.time / 1000000) }}</div>
            </li>
        </ul>
        <p class="empty" v-else>查無資料</p>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { NConfigProvider, NInput, NIcon, NAvatar, NEllipsis } from "naive-ui";

import { useSearchStore } from "@/store/search";
import { useApiStore } from "@/store/api";
import { isMobile } from "@/util/commonUtil";
import { currentTime } from "@/util/dateUtil";
import config from "@/config/config";
import searchIcon from "@/assets/Images/chatroom/search.svg";
import closeIcon from "@/assets/Images/chatroom/round-fill_close.svg";
import userIcon from "@/assets/Images/chatroom/User-round.svg";

const events = ref(isMobile ? "touchend" : "click");

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

const searchStore = useSearchStore();
const { searchSwitch, onSearchResult, onClickGoto, clearResultKeyWord, closeSearchBar } =
    searchStore;
const { searchBoolean, isResult, searcMessages, keyWord } = storeToRefs(searchStore);

const route = useRoute();
</script>
<style lang="scss">
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
@import "~@/assets/scss/common";
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.search-bar--chatRoom {
    .closeSearchBar,
    .searchBtn {
        margin-left: 10px;
        cursor: pointer;
        text-align: center;
        color: $gray-1;
        font-family: $font-family;
        @extend %h4;
        text-shadow: 0px 2px 4px $gray-6;
    }
}
.result {
    position: fixed;
    top: 166px;
    width: calc(100% - $siderWidth);
    height: calc(100% - 127px);
    background-color: $gray-8;
    z-index: 100;
    overflow-y: auto;
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
                background-color: $gray-8;
                border-radius: 5px;
            }
            .avatar {
                background-color: $primary-1;
                margin-right: 10px;
                border-radius: 50%;
            }
            .info {
                flex-direction: column;
                width: calc(100% - 127px);
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
                font-size: $font-size-16;
                color: $gray-3;
            }
        }
    }
}
@media (max-width: 768px) {
    .result {
        width: 100% !important;
        top: 88px !important;
        height: calc(100% - 88px) !important;
        z-index: 100;
        .numOfsearchMessage {
            margin-left: 15px;
            color: $gray-1;
            font-size: $font-size-16;
            font-weight: 600;
            font-family: $font-family;
        }
        .list {
            width: 100%;
            .item {
                padding: 10px 15px;
                + .item {
                    margin: 0;
                }
            }
            .info {
                .name {
                    color: $gray-2;
                    font-size: $font-size-18;
                    font-weight: 500;
                    font-family: $font-family;
                }
                .msg {
                    color: $gray-3;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                    line-height: 1.5;
                }
            }
            .time {
                font-size: $font-size-16;
                font-weight: 500;
                color: $gray-3;
                font-family: $font-family;
            }
        }
    }
}
</style>

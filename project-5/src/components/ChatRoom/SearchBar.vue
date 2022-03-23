<template>
    <!-- 搜尋bar -->
    <div v-if="searchBoolean" class="searchBar">
        <div class="searchArea">
            <n-config-provider :theme-overrides="themeOverrides">
                <n-input v-model:value="keyWord" type="text" placeholder="訊息">
                    <template #prefix>
                        <img src="../../assets/Images/chatroom/search.svg" alt="#" />
                    </template>
                    <template #suffix>
                        <img
                            class="clearKeyWord"
                            src="../../assets/Images/chatroom/round-fill_close.svg"
                            v-if="keyWord"
                            @click="clearResultKeyWord()"
                            alt="#"
                        />
                    </template>
                </n-input>
            </n-config-provider>
        </div>
        <div class="searchBtn" v-if="keyWord" @click="onSearchResult(keyWord)">搜尋</div>
        <div class="closeSearchBar" @click="closeSearchBar()" v-else>關閉</div>
    </div>
    <div v-if="isResult" class="result">
        <h1 class="numOfsearchMessage" v-if="searcMessages.length > 0">
            訊息{{ searcMessages.length }}則
        </h1>
        <ul class="list" v-if="searcMessages.length > 0">
            <li
                class="item"
                :key="msg.format.id"
                v-for="msg in searcMessages"
                @click.prevent="onClickGoto(msg.format.id, route.params.id)"
            >
                <n-avatar
                    class="avatar"
                    v-if="msg.sender === 1"
                    :size="48"
                    :src="`${config.serverUrl}/image/${eventInfo.icon}`"
                />
                <img
                    class="avatar"
                    :size="48"
                    v-else-if="msg.sender === 0"
                    src="../../assets/Images/chatroom/User-round.svg"
                />
                <div class="info">
                    <span class="name">{{ msg.sender === 0 ? eventInfo.name : "自己" }}</span>
                    <n-ellipsis
                        class="msg"
                        v-if="msg.tagMsg"
                        v-html="msg.tagMsg"
                        :line-clamp="2"
                        style="width: 95%"
                        :tooltip="false"
                    />
                    <div class="picture" v-else-if="msg.msgType === 6 || msg.msgType === 7">
                        <div v-if="msg.msgType === 6">{{ msg.format.ShowName }}</div>
                        <span v-if="msg.msgType === 7">
                            {{ msg.format.ShowName }}
                        </span>
                    </div>
                </div>
                <div class="time">
                    {{
                        dayjs.unix(msg.time).isToday()
                            ? dayjs.unix(msg.time).format("A hh:mm")
                            : dayjs.unix(msg.time).isYesterday()
                            ? "昨天"
                            : dayjs.unix(msg.time).format("YYYY/MM/DD A hh:mm")
                    }}
                </div>
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
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";

import { useSearchStore } from "@/store/search";
import { useApiStore } from "@/store/api";
import { getFileExtension } from "@/util/commonUtil";
import config from "@/config/config";

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

const searchStore = useSearchStore();
const { searchSwitch, onSearchResult, onClickGoto, clearResultKeyWord, closeSearchBar } =
    searchStore;
const { searchBoolean, isResult, searcMessages, keyWord } = storeToRefs(searchStore);

const route = useRoute();
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
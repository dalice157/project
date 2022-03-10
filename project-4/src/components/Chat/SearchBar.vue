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
                :key="msg.janusMsg.format.id"
                v-for="msg in searcMessages"
                @click.prevent="onClickGoto(msg.janusMsg.format.id, route.query.chatToken)"
            >
                <n-avatar
                    class="avatar"
                    v-if="msg.janusMsg.sender === 0"
                    :size="48"
                    :src="`${config.fileUrl}/fls/${eventInfo.icon}`"
                />
                <img
                    class="avatar"
                    :size="48"
                    v-else-if="msg.janusMsg.sender === 1"
                    src="../../assets/Images/chatroom/User-round.svg"
                />
                <div class="info">
                    <span class="name">{{
                        msg.janusMsg.sender === 0 ? eventInfo.name : "自己"
                    }}</span>
                    <n-ellipsis
                        class="msg"
                        v-if="msg.tagMsg"
                        v-html="msg.tagMsg"
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
                            :src="`${config.fileUrl}/fls/${msg.janusMsg.format.Fileid}${msg.ext}`"
                        />
                        <span v-if="msg.janusMsg.msgType === 7">
                            {{ msg.janusMsg.format.ShowName }}
                        </span>
                    </div>
                </div>
                <div class="time">{{ msg.time }}</div>
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
        fontSize: "16px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.searchBar {
    font-family: $font-family;
    padding: 10px 15px;
    position: fixed;
    width: calc(100% - $siderWidth);
    height: 50px;
    right: 0;
    top: 66px;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
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
    position: fixed;
    top: 166px;
    width: calc(100% - $siderWidth);
    height: calc(100% - 127px);
    background-color: $gray-8;
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
    .searchBar {
        width: 100% !important;
        top: 65px;
        background-color: transparent !important;
    }
    .result {
        width: 100% !important;
        top: 127px !important;
        height: calc(100% - 127px) !important;
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
            .time {
                font-size: $font-size-16;
                font-weight: 500;
                color: $gray-3;
            }
        }
    }
}
</style>

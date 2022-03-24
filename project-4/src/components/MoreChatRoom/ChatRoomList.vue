<template>
    <div class="chatRoomAll" v-if="moreKeyWord === ''">
        <a
            class="chatRoomBox"
            v-for="item in eventList"
            :key="item.chatToken"
            :href="`/${item.chatToken}`"
        >
            <div class="chatRoomList">
                <div class="avatar">
                    <n-avatar round :size="50" :src="`${config.fileUrl}/fls/${item.icon}`" />
                </div>
                <div class="chatRoomInfo">
                    <h3 class="name">{{ item.name }}</h3>
                    <n-ellipsis :line-clamp="2" :tooltip="false">
                        <p>
                            {{ item.description }}
                        </p>
                    </n-ellipsis>
                </div>
            </div>
        </a>
    </div>
    <div class="chatRoomAll" v-if="searcMoreMessages?.length > 0 && moreKeyWord !== ''">
        <a
            class="chatRoomBox"
            v-for="item in searcMoreMessages"
            :key="item.chatToken"
            :href="`/${item.chatToken}`"
        >
            <div class="chatRoomList">
                <div class="avatar">
                    <n-avatar round :size="48" :src="`${config.fileUrl}/fls/${item.icon}`" />
                </div>
                <div class="chatRoomInfo">
                    <h3 class="name" v-html="item.tagName"></h3>
                    <n-ellipsis :line-clamp="2" :tooltip="false">
                        <p>
                            {{ item.description }}
                        </p>
                    </n-ellipsis>
                </div>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NEllipsis } from "naive-ui";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import config from "@/config/config";

const apiStore = useApiStore();
const { eventList } = storeToRefs(apiStore);

const searchStore = useSearchStore();
const { searcMoreMessages, moreKeyWord } = storeToRefs(searchStore);

watchEffect(() => {
    console.log("searcMoreMessages:", searcMoreMessages.value.length);
});
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.chatRoomAll {
    .chatRoomBox {
        display: block;
        text-decoration: none;
        border-bottom: 1px solid $border-line;
        &:hover,
        &:focus {
            background-color: $gray-7;
        }

        .chatRoomList {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px;
            .avatar {
                margin-right: 10px;
                .n-avatar {
                    border: 1px solid $border-line;
                }
            }
            .chatRoomInfo {
                .name {
                    @extend %h3;
                    color: $gray-2;
                    margin-bottom: 6px;
                }
                p {
                    font-size: $font-size-16;
                    line-height: 1.5;
                    color: $gray-3;
                }
            }
        }
    }
}
@media (max-width: 768px) {
    .chatRoomAll {
        border-radius: 4px;
        width: 90%;
        margin: 15px auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid $border-line;
        box-shadow: 2px 0px 4px $gray-6;
        background-color: $white;
        padding: 15px;
        .chatRoomBox {
            width: 100%;
            border: none;
        }
        .chatRoomBox + .chatRoomBox {
            margin-top: 10px;
        }
    }
}
</style>

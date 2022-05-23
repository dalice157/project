<template>
    <!-- 搜尋bar -->
    <div class="search-bar">
        <n-input
            v-model:value="moreKeyWord"
            type="text"
            placeholder="直接輸入公司或店家名稱問問題吧..."
        >
            <template #prefix>
                <img :src="searchIcon" alt="search" />
            </template>
            <template #suffix>
                <img
                    class="clearKeyWord"
                    :src="closeIcon"
                    v-if="moreKeyWord"
                    @[events]="clearMoreKeyWord()"
                    alt="close"
                />
            </template>
        </n-input>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { NInput, NIcon, NAvatar, NEllipsis } from "naive-ui";

import { useSearchStore } from "@/store/search";
import { useApiStore } from "@/store/api";
import searchIcon from "@/assets/Images/search/search.svg";
import closeIcon from "@/assets/Images/search/round-fill_close.svg";
import { isMobile } from "@/util/commonUtil";

const events = ref(isMobile ? "touchend" : "click");

// api store
const apiStore = useApiStore();
const { getEventListApi } = apiStore;

const searchStore = useSearchStore();
const { onSearchMoreImResult, clearMoreKeyWord } = searchStore;
const { moreKeyWord } = storeToRefs(searchStore);

const route = useRoute();
</script>
<style lang="scss">
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
@import "~@/assets/scss/common";
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.result {
    position: fixed;
    top: 188px;
    width: 100%;
    height: calc(100% - 165px);
    background-color: $white;
    z-index: 100;
    .empty {
        height: calc(100% - 165px);
        text-align: center;
        line-height: calc(100% - 220px);
        color: $gray-3;
        font-size: $font-size-26;
        font-weight: 600;
    }
}
.list {
    width: 98%;
    margin: 1em auto 0;
    .item {
        + .item {
            margin-top: 0.3em;
        }
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5em;
        &:hover,
        &:focus {
            background-color: $gray-8;
            border-radius: 5px;
        }
    }
    .avatar {
        margin-right: 1em;
    }
    .info {
        flex-direction: column;
        width: calc(100% - 127px);
        .name,
        .msg {
            color: $gray-3;
        }
        .name + .msg,
        .name + .picture {
            margin-top: 0.3em;
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
</style>

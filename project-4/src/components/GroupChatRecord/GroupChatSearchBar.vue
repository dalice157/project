<template>
    <!-- 搜尋bar -->
    <div class="search-bar">
        <n-input
            @input="onSearchRecordResult"
            v-model:value="recordKeyWord"
            type="text"
            placeholder="搜尋"
        >
            <template #prefix>
                <img :src="searchIcon" alt="search" />
            </template>
            <template #suffix>
                <img
                    class="clearKeyWord"
                    :src="closeIcon"
                    v-if="recordKeyWord"
                    @[events].stop="clearRecordKeyWord()"
                    alt="close"
                />
            </template>
        </n-input>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { NConfigProvider, NInput } from "naive-ui";

import { useSearchStore } from "@/store/search";
import searchIcon from "@/assets/Images/search/search.svg";
import closeIcon from "@/assets/Images/search/round-fill_close.svg";
import { isMobile } from "@/util/commonUtil";

const events = ref(isMobile ? "touchend" : "click");

const searchStore = useSearchStore();
const { onSearchRecordResult, onClickGoto, clearRecordKeyWord } = searchStore;
const { recordKeyWord } = storeToRefs(searchStore);

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

// .search-bar {
//     width: 100vw;
// }
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
        font-weight: 500;
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

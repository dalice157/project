<template>
    <!-- 搜尋bar -->
    <div class="searchBar">
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
        <!-- <span class="search">
            <img :src="searchIcon" />
        </span>
        <input
            type="text"
            placeholder="直接輸入公司或店家名稱問問題吧..."
            v-model.trim="moreKeyWord"
            @input="(e:any) => onSearchMoreImResult(e.target.value)"
        />
        <span class="clearBtn" @[events]="clearMoreKeyWord()">
            <img :src="closeIcon" />
        </span> -->
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
.searchBar {
    .n-input {
        width: 100%;
        background-color: $white;
        height: 36px;
        font-size: $font-size-16;
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
    .n-input .n-input__border,
    .n-input .n-input__state-border {
        border: none;
    }
    .n-input:not(.n-input--disabled):hover .n-input__state-border {
        border: none;
    }
    .n-input:not(.n-input--disabled).n-input--focus {
        background-color: none;
    }
    .n-input:not(.n-input--disabled).n-input--focus .n-input__state-border {
        border: none;
        box-shadow: none;
    }
    .n-input .n-input__input-el,
    .n-input .n-input__textarea-el {
        caret-color: $gray-2;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.searchBar {
    display: flex;
    align-items: center;
    border-radius: 20px;
    background-color: $white;
    padding: 0 8px;
    height: 44px;
    border: 1px solid $border-line;
    box-shadow: 2px 0px 4px $gray-6;
    .search {
        display: flex;
        align-self: center;
        margin-left: 8px;
        img {
            width: 16px;
            height: 16px;
        }
    }
    input[type="text"] {
        width: 100%;
        border: none;
        outline-style: none;
        color: $gray-1;
        @extend %h4;
        margin-left: 10px;
    }
    .clearBtn {
        display: flex;
        align-self: center;
        margin-right: 8px;
        cursor: pointer;
    }
}

@media (max-width: 768px) {
    .searchBar {
        width: 93%;
        margin: 20px auto 0;
    }
}
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

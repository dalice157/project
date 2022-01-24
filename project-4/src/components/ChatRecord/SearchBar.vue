<template>
    <!-- 搜尋bar -->
    <div class="searchBar">
        <span class="search">
            <img src="../../assets/Images/search/search.svg" />
        </span>
        <input
            type="text"
            placeholder="搜尋"
            v-model.trim="recordKeyWord"
            @input="(e:any) => onSearchRecordResult(e.target.value)"
        />
        <span class="clearBtn" @click="clearRecordKeyWord()">
            <img src="../../assets/Images/search/round-fill_close.svg" />
        </span>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { useSearchStore } from "@/store/search";

const searchStore = useSearchStore();
const { onSearchRecordResult, onClickGoto, clearRecordKeyWord } = searchStore;
const { recordKeyWord } = storeToRefs(searchStore);

const route = useRoute();
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.searchBar {
    display: flex;
    border-radius: 20px;
    background-color: $white;
    padding: 0 8px;
    height: 44px;
    border: 1px solid $border-line;
    box-shadow: 2px 0px 4px $gray-6;
    position: sticky;
    top: 60px;
    z-index: 100;
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
        margin: -60px auto 0;
        display: flex;
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
        font-size: $font-size-14;
        color: $gray-3;
    }
}
</style>

<template>
    <div class="moreChatRoom" :class="{ menuToggle: hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <div class="main">
            <h1 v-if="!isResult || keyWord === ''" class="logo">talkOD</h1>
            <SeachBar />
            <ChatRoomList />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useApiStore } from "@/store/api.ts";
import { useSearchStore } from "@/store/search.ts";
import HamburgerBar from "@/components/HamburgerBar.vue";
import ChatRoomList from "@/components/MoreChatRoom/ChatRoomList.vue";
import SeachBar from "@/components/MoreChatRoom/SearchBar.vue";

//router
const route = useRoute();

// api store
const apiStore = useApiStore();
const { getEventListApi } = apiStore;
const searchStore = useSearchStore();
const { isResult, keyWord } = storeToRefs(searchStore);

getEventListApi(route.params.eventKey);
//漢堡選單
const hamburgerBoolean = ref();
const menuToggle = (menuBoolean: boolean) => {
    hamburgerBoolean.value = menuBoolean;
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.moreChatRoom {
    height: 100%;
    grid-area: body;
    display: none;
}
@media (max-width: 768px) {
    .moreChatRoom {
        width: 100%;
        height: 100%;
        display: grid;
        grid:
            "header" 120px
            "main" 1fr;
        gap: 0;
        background-color: $gray-8;
        transform: translateX(0px);
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        &.menuToggle {
            transform: translateX(250px);
            -webkit-transition: all 0.7s ease-in-out;
            -o-transition: all 0.7s ease-in-out;
            transition: all 0.7s ease-in-out;
        }
    }
    .main {
        grid-area: main;
        .logo {
            margin: 20px auto;
            width: 120px;
            height: 40px;
            background: url("~@/assets/Images/talkOD-logo.png") center no-repeat;
            background-size: 100%;
            text-indent: -9999px;
            white-space: nowrap;
            line-height: 0;
        }
    }
}
</style>

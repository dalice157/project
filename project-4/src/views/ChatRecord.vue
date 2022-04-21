<template>
    <div class="chatRecord" :class="{ menuToggle: hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <div class="main">
            <!-- 聊天室交談紀錄列表 -->
            <ChatRecordSearch />
            <ChatRecordMessage @getChangeList="getChangeList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useApiStore } from "@/store/api";
import HamburgerBar from "@/components/HamburgerBar.vue";
import ChatRecordSearch from "@/components/ChatRecord/SearchBar.vue";
import ChatRecordMessage from "@/components/ChatRecord/ChatRecordMessage.vue";

const apiStore = useApiStore();
const { getEventListApi, getBackendApi } = apiStore;
const route = useRoute();
getEventListApi(route.params.eventKey);
getBackendApi(route.params.eventKey);
//漢堡選單
const hamburgerBoolean = ref();
const menuToggle = (menuBoolean: any) => {
    hamburgerBoolean.value = menuBoolean;
};

const getChangeList = (lists: any) => {
    // console.log("=======",lists);
    lists.forEach((list: any) => {
        list.isfunctionPopUp = false;
    });
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.chatRecord {
    height: 100%;
    grid-area: body;
    display: none;
}
@media (max-width: 768px) {
    .chatRecord {
        width: 100%;
        min-height: 100%;
        display: grid;
        grid:
            "header" 120px
            "main" 1fr;
        gap: 0;
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
    }
}
</style>

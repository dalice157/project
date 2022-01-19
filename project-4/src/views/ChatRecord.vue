<template>
    <div class="chatRecord" :class="{ menuToggle: hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <!-- 聊天室交談紀錄列表 -->
        <ChatRecordSearch />
        <ChatRecordMessage />
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
const { getEventListApi } = apiStore;
const route = useRoute();
getEventListApi(route.query.chatToken);
//漢堡選單
const hamburgerBoolean = ref();
const menuToggle = (menuBoolean: any) => {
    hamburgerBoolean.value = menuBoolean;
};
</script>
<style lang="scss" scoped>
.chatRecord {
    display: none;
}
@media (max-width: 768px) {
    .chatRecord {
        display: block;
        width: 100%;
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
}
</style>

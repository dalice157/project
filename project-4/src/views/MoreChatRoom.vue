<template>
    <div class="moreChatRoom" :class="{ menuToggle: hamburgerBoolean }">
        <HamburgerBar @menuToggle="menuToggle" />
        <h1 v-if="!isResult || keyWord === ''" class="logo">溝通雲</h1>
        <SeachBar />
        <ChatRoomList />
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useApiStore } from "../store/api.ts";
import { useSearchStore } from "../store/search.ts";
import HamburgerBar from "../components/HamburgerBar.vue";
import ChatRoomList from "../components/MoreChatRoom/ChatRoomList.vue";
import SeachBar from "../components/MoreChatRoom/SearchBar.vue";

//router
const route = useRoute();

// api store
const apiStore = useApiStore();
const { getEventListApi } = apiStore;
const searchStore = useSearchStore();
const { isResult, keyWord } = storeToRefs(searchStore);

getEventListApi(route.query.chatToken);
//漢堡選單
const hamburgerBoolean = ref();
const menuToggle = (menuBoolean: boolean) => {
    hamburgerBoolean.value = menuBoolean;
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/extend";
@import "../assets/scss/var";
.moreChatRoom {
    display: none;
}
@media (max-width: 768px) {
    .moreChatRoom {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        width: 100%;
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
        .logo {
            margin-top: 20px;
            margin-bottom: 20px;
            font-size: $font-size-18;
            font-weight: 600;
            color: $primary-1;
        }
    }
}
</style>

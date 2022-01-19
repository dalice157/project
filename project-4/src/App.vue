<template>
    <div class="all" @click="closeChatBubble">
        <!-- chatroom -->
        <div class="userInterface">
            <!-- 使用者資訊 -->
            <UserInfoSider />
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import VConsole from "vconsole";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import NavBar from "@/components/Chat/NavBar.vue";
import HamburgerBar from "@/components/HamburgerBar.vue";
import UserInfoSider from "@/components/UserInfoSider.vue";
import { useChatStore } from "@/store/chat";
import { txt } from "@/util/interfaceUtil";

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messages.value.forEach((text: txt) => {
        text.msgFunctionStatus = false;
    });
};

const route = useRoute();

// notifications test
document.addEventListener("DOMContentLoaded", function () {
    if (!Notification) {
        alert("Desktop notifications not available in your browser. Try Chromium.");
        return;
    }

    if (Notification.permission !== "granted") Notification.requestPermission();
});

const vConsole = new VConsole();
</script>

<style lang="scss">
.v-wrap {
    left: 330px !important;
}

@media (max-width: 768px) {
    .v-wrap {
        left: 0 !important;
    }
}
.viewer-transition {
    left: -165px;
}
@media (max-width: 768px) {
    .viewer-transition {
        left: 0px;
    }
}
.viewer-list {
    transform: none !important;
    margin: 0 auto !important;
}
.viewer-play {
    display: none;
}
.viewer-rotate-left {
    display: none;
}
.viewer-rotate-right {
    display: none;
}
.viewer-reset {
    display: none;
}
.viewer-one-to-one {
    display: none;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
.all {
    height: 100%;
    .userInterface {
        display: flex;
        margin-left: $siderWidth;
    }
}

@media (max-width: 768px) {
    .all {
        .userInterface {
            display: block;
            margin-left: 0;
        }
    }
}
</style>

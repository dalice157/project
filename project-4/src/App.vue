<template>
    <div class="all" @click="closeChatBubble">
        <!-- 使用者資訊 -->
        <UserInfoSider />
        <router-view></router-view>
    </div>
    <!-- 橫屏時蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-show="shieldBoolean">
            <div class="popUp">
                <p>本產品不支持橫向觀看,請改回直式使用</p>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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

const shieldBoolean = ref(false);

//隱藏 url bar
window.addEventListener("load", () => {
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 0);
});
//判斷設備使用者設備瀏覽方向
onMounted(() => {
    if (
        navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
        ) &&
        window.innerWidth > window.innerHeight
    ) {
        shieldBoolean.value = true;
        const all = document.querySelector(".all") as any;
        all.style.display = "none";
    } else {
        shieldBoolean.value = false;
        const all = document.querySelector(".all") as any;
        all.style.display = "grid";
    }
});

window.addEventListener("resize", () => {
    if (
        navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
        ) &&
        document.body.clientWidth > document.body.clientHeight
    ) {
        console.log("橫屏");
        shieldBoolean.value = true;
        const all = document.querySelector(".all") as any;
        all.style.display = "none";
    } else {
        console.log("豎屏");
        shieldBoolean.value = false;
        const all = document.querySelector(".all") as any;
        all.style.display = "grid";
    }
});

// notifications test
document.addEventListener("DOMContentLoaded", function () {
    if (!Notification) {
        alert("Desktop notifications not available in your browser. Try Chromium.");
        return;
    }

    if (Notification.permission !== "granted") Notification.requestPermission();
});

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
//橫屏時蓋板popup
.mask2 {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 20px;
        width: 342px;
        height: 100px;
        padding: 15px;
        background-color: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

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
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    grid: "sidebar body" 1fr / 300px 1fr;
    gap: 0;
    user-select: none;
}

@media (max-width: 768px) {
    .all {
        grid: "body" 1fr;
    }
}
</style>

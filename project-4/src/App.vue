<template>
    <div class="all" :class="{ hide: shieldBoolean }" @click="closeChatBubble">
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
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import vConsole from "@/plugin/vConsole";
import Fingerprint from "@/assets/js/fingerprint";
import java_hashcode from "@/assets/js/java_hashcode";

import NavBar from "@/components/Chat/NavBar.vue";
import HamburgerBar from "@/components/HamburgerBar.vue";
import UserInfoSider from "@/components/UserInfoSider.vue";
import { useChatStore } from "@/store/chat";
import { useSearchStore } from "@/store/search";
import { txt } from "@/util/interfaceUtil";

//chat store
const chatStore = useChatStore();
const { messages, inputFunctionBoolean } = storeToRefs(chatStore);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messages.value.forEach((text: txt) => {
        text.janusMsg.config.msgFunctionStatus = false;
    });
    inputFunctionBoolean.value = false;
};

onMounted(() => {
    vConsole;
    /***
     * 參考
     * https://github.com/artem0/canvas-fingerprinting
     * https://www.wfublog.com/2020/11/js-track-user-device-browser-fingerprint.html
     * var withCanvasDrawing = new Fingerprint({ canvas: true });
     * var withoutCanvasDrawing = new Fingerprint({ canvas: false });
     * */
    let withCanvasDrawing = new Fingerprint({ hasher: java_hashcode });
    console.log("withCanvasDrawing :", withCanvasDrawing.get());
    localStorage.setItem("vConsole_switch_x", JSON.stringify(0));
    localStorage.setItem("vConsole_switch_y", JSON.stringify(520));
});

const shieldBoolean = ref(false);

//判斷設備使用者設備瀏覽方向
onMounted(() => {
    if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth > document.body.clientHeight
    ) {
        console.log("ios橫屏");
        shieldBoolean.value = true;
    } else if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth < document.body.clientHeight
    ) {
        console.log("ios豎屏");
        shieldBoolean.value = false;
    } else if (
        navigator.userAgent.match(
            /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
        ) &&
        (screen.orientation.type === "landscape-primary" ||
            screen.orientation.type === "landscape-secondary")
    ) {
        console.log("android橫屏");
        shieldBoolean.value = true;
    } else {
        console.log("android豎屏");
        shieldBoolean.value = false;
    }
});

onMounted(() => {
    window.addEventListener("resize", () => {
        if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth > document.body.clientHeight
        ) {
            console.log("ios橫屏");
            shieldBoolean.value = true;
        } else if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth < document.body.clientHeight
        ) {
            console.log("ios豎屏");
            shieldBoolean.value = false;
        } else if (
            navigator.userAgent.match(
                /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
            ) &&
            (screen.orientation.type === "landscape-primary" ||
                screen.orientation.type === "landscape-secondary")
        ) {
            console.log("android橫屏");
            shieldBoolean.value = true;
        } else {
            console.log("android豎屏");
            shieldBoolean.value = false;
        }
    });
});
onUnmounted(() => {
    window.removeEventListener("resize", () => {
        if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth > document.body.clientHeight
        ) {
            console.log("ios橫屏");
            shieldBoolean.value = true;
        } else if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth < document.body.clientHeight
        ) {
            console.log("ios豎屏");
            shieldBoolean.value = false;
        } else if (
            navigator.userAgent.match(
                /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
            ) &&
            (screen.orientation.type === "landscape-primary" ||
                screen.orientation.type === "landscape-secondary")
        ) {
            console.log("android橫屏");
            shieldBoolean.value = true;
        } else {
            console.log("android豎屏");
            shieldBoolean.value = false;
        }
    });
}),
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
    left: 300px !important;
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
    &.hide {
        display: none;
    }
}

@media (max-width: 768px) {
    .all {
        grid: "body" 1fr;
    }
}
</style>

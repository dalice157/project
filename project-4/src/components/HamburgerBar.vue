<template>
    <!-- 漢堡選單 -->
    <div
        class="chatroom-header"
        :class="{
            moreRoomBg: route.path === `/moreChatRoom/${route.params.eventKey}`,
            recordBg: route.path === `/chatRecord/${route.params.eventKey}`,
        }"
        v-show="route.meta.home"
    >
        <div class="hamburger" @[events]="hamburgerToggle" :class="{ isActive: isActive }">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </div>
        <div class="container">
            <ul class="hamburgerMenu">
                <li class="moreChatRoom" @[events]="goMoreChatRoom">
                    <router-link :to="`/moreChatRoom/${eventKey}`"> 更多聊天室 </router-link>
                </li>
                <li class="burgerChatHistory" @[events]="goChatRecord">
                    <a :href="`/chatRecord/${eventKey}`">交談紀錄</a>
                </li>
            </ul>
            <ul class="hamburgerMenu">
                <li v-if="!isProduction" class="burgerKnow" @[events]="getMOCode">
                    取得簡訊驗證碼
                </li>
                <li v-if="!isProduction" class="burgerKnow" @[events]="onOpenOldDevice">
                    發送原手機驗證碼
                </li>
                <li class="burgerKnow" @[events]="onBurgerKnow">認識talkOD</li>
                <li class="qa" @[events]="onQa">常見問題</li>
                <li class="terms">
                    <a href="https://www.teamplus.tech/every8d-agreement/" target="_blank"
                        >服務條款</a
                    >
                </li>
            </ul>
            <div class="title_container">
                <h2 class="title">talkOD</h2>
            </div>
        </div>
        <!-- NavBar 標題 -->
        <h1 class="title" v-if="route.path === `/chatRecord/${route.params.eventKey}`">交談紀錄</h1>
        <h1 class="title" v-if="route.path === `/moreChatRoom/${route.params.eventKey}`">
            更多聊天室
        </h1>
    </div>

    <teleport to="body" v-if="showKnowModal">
        <div class="mask">
            <div class="wrap">
                <h2 class="title">歡迎使用talkOD線上溝通雲端服務平台</h2>
                talkOD是一款線上即時雙向溝通工具，滿足目的性的溝通需求。<br />
                你可以透過網頁瀏覽器開啟對話視窗，無需下載APP軟體，也不用再經過層層註冊關卡，只要點擊連結，即刻展開對話！
                <div class="btnWrap">
                    <button @[events]="showKnowModal = false">關閉</button>
                </div>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="showQaModal">
        <div class="mask">
            <div class="wrap">
                <h2 class="title">Q1若關掉對話視窗，對話就結束了嗎?</h2>
                不會。只要連結還有留存，再次點即可進入對話視窗，瀏覽先前的歷史記錄，繼續進行對話。
                <h2 class="title">Q2若關掉視窗，對話紀錄會消失嗎?</h2>
                紀錄不會消失。只要在同一個裝置開啟連結，對話紀錄便不會消失！
                <h2 class="title">Q3可以使用不同裝置開啟視窗連結嗎?</h2>
                可以。但因應資安考量，之前裝置的聊天紀錄便會消失。
                <div class="btnWrap">
                    <button @[events]="showQaModal = false">關閉</button>
                </div>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="isOldModel">
        <div class="mask">
            <div class="deviceCode">
                <div class="closeBtn" @[events].stop="onCloseOldDevice">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>原裝置之驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="vOldCode" readonly type="text" />
                </n-config-provider>
            </div>
        </div>
    </teleport>
    <teleport to="body" v-if="isMCodeModel">
        <div class="mask">
            <div class="deviceCode">
                <div class="closeBtn" @[events].stop="onCloseMoMode">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>手機簡訊驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="mCode" readonly type="text" />
                </n-config-provider>
                <p class="psWord">請發送上列數字簡訊至<br />0912345678</p>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { NInput, NConfigProvider, NButton } from "naive-ui";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { isMobile } from "@/util/commonUtil";
import closeIcon from "@/assets/Images/common/close-round.svg";
import { signature, withCanvasDrawing } from "@/util/deviceUtil";
import config from "@/config/config";

export default defineComponent({
    name: "HamburgerBar",
    components: {
        NInput,
        NConfigProvider,
    },
    emits: ["menuToggle"],
    setup(_: any, ctx: any) {
        //漢堡選單
        const isActive = ref(false);
        const hamburgerToggle = () => {
            isActive.value = !isActive.value;
            ctx.emit("menuToggle", isActive.value);
        };

        const themeOverrides = {
            common: {},
            Input: {
                fontSize: "16px",
                caretColor: "black",
                borderHover: "transparent",
                borderFocus: "transparent",
                boxShadowFocus: "none",
            },
        };

        const isProduction = process.env.NODE_ENV == "production";
        // api store
        const apiStore = useApiStore();
        const { eventInfo, vOldCode, isIllegalDevice, mCode } = storeToRefs(apiStore);

        //search store
        const searchStore = useSearchStore();
        const { searchSwitch, closeSearchBar } = searchStore;
        const { searchBoolean } = storeToRefs(searchStore);

        //router
        const router = useRouter();
        const route = useRoute();
        const eventKey = computed(() => route.params.eventKey);

        //前往更多聊天室
        const goMoreChatRoom = () => {
            isActive.value = !isActive.value;
            ctx.emit("menuToggle", isActive.value);
        };
        //前往交談紀錄
        const goChatRecord = () => {
            isActive.value = !isActive.value;
            ctx.emit("menuToggle", isActive.value);
        };
        const showKnowModal: any = ref(false);
        const onBurgerKnow = () => {
            showKnowModal.value = true;
        };

        const showQaModal: any = ref(false);
        const onQa = () => {
            showQaModal.value = true;
        };

        const events = ref(isMobile ? "touchstart" : "click");

        const isOldModel = ref(false);
        const isMCodeModel = ref(false);
        const getMOCode = () => {
            axios({
                method: "get",
                url: `${config.serverUrl}/mcode/${route.params.eventKey}?device=${withCanvasDrawing}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    mCode.value = res.data.code;
                    isMCodeModel.value = true;
                    isActive.value = false;
                    ctx.emit("menuToggle", isActive.value);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        };

        const onCloseMoMode = () => {
            isMCodeModel.value = false;
        };
        const onOpenOldDevice = () => {
            axios({
                method: "get",
                url: `${config.serverUrl}/vcode/${route.params.eventKey}`,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    vOldCode.value = res.data.code;
                    isOldModel.value = true;
                    isActive.value = false;
                    ctx.emit("menuToggle", isActive.value);
                })
                .catch((err: any) => {
                    console.error(err);
                });
        };

        const onCloseOldDevice = () => {
            isOldModel.value = false;
        };

        return {
            isActive,
            hamburgerToggle,
            eventInfo,
            searchSwitch,
            searchBoolean,
            router,
            route,
            goMoreChatRoom,
            closeSearchBar,
            goChatRecord,
            eventKey,
            onBurgerKnow,
            showKnowModal,
            onQa,
            showQaModal,
            events,
            onOpenOldDevice,
            isOldModel,
            onCloseOldDevice,
            closeIcon,
            themeOverrides,
            vOldCode,
            isMCodeModel,
            getMOCode,
            onCloseMoMode,
            mCode,
            isProduction,
        };
    },
});
</script>

<style lang="scss">
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.deviceCode {
    .n-button {
        width: 80%;
        margin: 0 auto;
    }
    .n-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .n-form-item .n-form-item-feedback-wrapper .n-form-item-feedback {
        margin-top: 4px;
        margin-bottom: 8px;
    }
}
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrap {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1.4;
        color: rgba(0, 26, 219, 0.8);
        .title {
            @extend %h2;
            color: $black;
            margin-bottom: 10px;
            &:not(:first-child) {
                margin-top: 15px;
            }
        }
    }
    .deviceCode {
        border-radius: 20px;
        width: 220px;
        height: 200px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        .psWord {
            margin-top: 10px;
            line-height: 1.6;
        }
        .closeBtn {
            position: absolute;
            right: -5px;
            top: -10px;
            z-index: 100;
            width: 28px;
            height: 28px;
            cursor: pointer;
            background-color: $white;
            border-radius: 50px;
            img {
                width: 100%;
            }
        }
        h2 {
            @extend %h2;
            margin-bottom: 15px;
        }
    }
    .btnWrap {
        text-align: center;
        margin-top: 20px;
        > button {
            border: 1px solid $primary-1;
            background-color: $primary-1;
            color: $white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: $font-size-16;
            cursor: pointer;
        }
    }
}
@media (max-width: 320px) {
    .mask {
        .wrap {
            width: 280px;
        }
    }
}
.chatroom-header {
    grid-area: header;
    background: no-repeat center top;
    background-size: cover;
    position: sticky;
    top: 0;
    z-index: 100;
    &.recordBg {
        background-image: url("~@/assets/Images/chatRecord/chatRecordBg.svg");
    }
    &.moreRoomBg {
        background-image: url("~@/assets/Images/common/moreChatRoomBg.svg");
    }
    //漢堡選單收放動畫
    .hamburger {
        display: none;
        top: 0%;
        -webkit-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
        padding: 20px 10px;
        &:hover {
            cursor: pointer;
        }
        .line:nth-child(odd) {
            width: 20px;
            height: 2px;
            background-color: $gray-1;
            display: block;
            margin: 5px;
            -webkit-transition: all 0.5s ease-in-out;
            -o-transition: all 0.5s ease-in-out;
            transition: all 0.5s ease-in-out;
            position: relative;
            z-index: 2004;
        }
        .line:nth-child(even) {
            width: 10px;
            height: 2px;
            background-color: $gray-1;
            display: block;
            margin: 5px;
            -webkit-transition: all 0.5s ease-in-out;
            -o-transition: all 0.5s ease-in-out;
            transition: all 0.5s ease-in-out;
            position: relative;
            z-index: 2004;
        }
    }
    @media (max-width: 768px) {
        .hamburger {
            display: block;
            position: absolute;
        }
        .container {
            transform: translateX(-108%);
            -webkit-transition: all 0.7s ease-in-out;
            -o-transition: all 0.7s ease-in-out;
            transition: all 0.7s ease-in-out;
            display: block;
        }
    }

    .hamburger.isActive .line:nth-child(2) {
        opacity: 0;
    }

    .hamburger.isActive .line:nth-child(1) {
        -webkit-transform: translateY(5px) rotate(45deg);
        -ms-transform: translateY(5px) rotate(45deg);
        -o-transform: translateY(5px) rotate(45deg);
        transform: translateY(5px) rotate(45deg);
    }

    .hamburger.isActive .line:nth-child(3) {
        -webkit-transform: translateY(-9px) rotate(-45deg);
        -ms-transform: translateY(-9px) rotate(-45deg);
        -o-transform: translateY(-9px) rotate(-45deg);
        transform: translateY(-9px) rotate(-45deg);
    }
    //漢堡選單
    .container {
        width: 250px;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 150;
        background: url("~@/assets/Images/common/hambugerMenu.svg") no-repeat center bottom;
        background-size: 100% auto;
    }
    .title_container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
        h2.title {
            margin: 0 auto;
            width: 120px;
            height: 40px;
            background: url("~@/assets/Images/talkOD-logo.png") center no-repeat;
            background-size: 100%;
            text-indent: -9999px;
            white-space: nowrap;
            line-height: 0;
        }
    }
    .hamburgerMenu {
        padding-top: 60px;
        width: 220px;
        + .hamburgerMenu {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid $border-line;
        }
        li {
            &.burgerKnow,
            &.qa {
                color: $gray-2;
                @extend %h2;
                line-height: 30px;
                padding-left: 36px;
                text-decoration: none;
                display: block;
                transition: 0.4s;
                font-weight: 600;
                &:hover,
                &:focus {
                    color: $gray-3;
                }
            }
            a {
                color: $gray-2;
                @extend %h2;
                line-height: 30px;
                padding-left: 36px;
                text-decoration: none;
                display: block;
                transition: 0.4s;
                font-weight: 600;
                &:hover,
                &:focus {
                    color: $gray-3;
                }
            }
        }
        li + li {
            margin-top: 20px;
        }
    }

    //header 名字
    h1.title {
        color: $gray-1;
        @extend %h2;
        text-align: center;
        padding-top: 25px;
        &.recordBg {
        }
    }
    .chatpane {
        margin-right: 0.5em;
        .n-icon {
            cursor: pointer;
        }
        .phone {
            background-color: transparent;
        }
        .gallery {
            background-color: transparent;
        }
        .n-icon {
            margin-left: 0.4em;
            &:hover {
                opacity: 0.75;
            }
            a {
                color: $white;
            }
        }
    }
}
</style>

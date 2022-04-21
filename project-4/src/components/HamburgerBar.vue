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
        <div class="hamburger" @click="hamburgerToggle" :class="{ isActive: isActive }">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </div>
        <div class="container">
            <ul class="hamburgerMenu">
                <li class="moreChatRoom" @click="goMoreChatRoom">
                    <router-link :to="`/moreChatRoom/${eventKey}`"> 更多聊天室 </router-link>
                </li>
                <li class="burgerChatHistory" @click="goChatRecord">
                    <router-link :to="`/chatRecord/${eventKey}`">交談紀錄</router-link>
                </li>
            </ul>
            <ul class="hamburgerMenu">
                <li class="burgerKnow" @click="onBurgerKnow">認識talkOD</li>
                <li class="qa" @click="onQa">常見問題</li>
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
                    <button @click="showKnowModal = false">關閉</button>
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
                    <button @click="showQaModal = false">關閉</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";

export default defineComponent({
    name: "HamburgerBar",
    components: {},
    emits: ["menuToggle"],
    setup(_: any, ctx: any) {
        //漢堡選單
        const isActive = ref(false);
        const hamburgerToggle = () => {
            isActive.value = !isActive.value;
            ctx.emit("menuToggle", isActive.value);
        };

        // api store
        const apiStore = useApiStore();
        const { eventInfo } = storeToRefs(apiStore);

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
        };
    },
});
</script>

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
    .btnWrap {
        text-align: center;
        margin-top: 20px;
        button {
            border: 1px solid $primary-1;
            background-color: $primary-1;
            color: $white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: $font-size-16;
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

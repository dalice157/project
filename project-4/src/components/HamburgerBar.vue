<template>
    <!-- 漢堡選單 -->
    <div
        class="menu-bar"
        :class="{
            'menu-bar--moreRoom-bg': route.path === `/moreChatRoom/${route.params.eventKey}`,
            'menu-bar--chat-log-bg': route.path === `/chatRecord/${route.params.eventKey}`,
            'menu-bar--groupChat-log-bg':
                route.path === `/groupChatRecord/${route.params.eventKey}`,
        }"
        v-show="route.meta.home"
    >
        <div
            class="hamburger"
            @[events].stop="hamburgerToggle"
            :class="{ 'hamburger--isActive': isActive }"
        >
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
        </div>
        <div class="container">
            <ul class="container__menu">
                <li @[events].stop="goMoreChatRoom">
                    <router-link :to="`/moreChatRoom/${eventKey}`"> 找商家 </router-link>
                </li>
                <li @[events].stop="goChatRecord">
                    <router-link :to="`/chatRecord/${eventKey}`">交談紀錄</router-link>
                </li>
                <li @[events].stop="goGroupChatRecord" v-if="!isProduction">
                    <router-link :to="`/groupChatRecord/${eventKey}`">群聊交談紀錄</router-link>
                </li>
            </ul>
            <ul class="container__menu">
                <!-- <li v-if="!isProduction" class="device" @[events]="getMOCode">取得簡訊驗證碼</li> -->
                <li class="device" @[events].stop="onOpenOldDevice">取得原裝置驗證碼</li>
                <li class="device" @[events].stop="onBurgerKnow">認識互動回覆簡訊</li>
                <li class="qa" @[events].stop="onQa">常見問題</li>
                <li class="terms">
                    <a href="https://www.teamplus.tech/every8d-agreement/" target="_blank"
                        >服務條款</a
                    >
                </li>
                <li class="report" @[events].stop="onOpenRepoprt">我要檢舉</li>
            </ul>
            <div class="container__title">
                <h2 class="title">互動回覆簡訊</h2>
            </div>
        </div>
        <!-- NavBar 標題 -->
        <h1 class="menu-bar__title" v-if="route.path === `/chatRecord/${route.params.eventKey}`">
            交談紀錄
        </h1>
        <h1
            class="menu-bar__title"
            v-if="route.path === `/groupChatRecord/${route.params.eventKey}` && !isProduction"
        >
            群聊交談紀錄
        </h1>
        <h1 class="menu-bar__title" v-if="route.path === `/moreChatRoom/${route.params.eventKey}`">
            找商家
        </h1>
        <!-- 跳轉連結 -->
        <div class="hyperLink">
            <!--  一般聊天歷史紀錄 -->
            <div v-if="route.path === `/groupChatRecord/${route.params.eventKey}`">
                <router-link :to="`/chatRecord/${eventKey}`">
                    <img :src="chatLeft" alt="歷史紀錄" />
                </router-link>
            </div>
            <!-- 群聊歷史紀錄 -->
            <div v-if="route.path === `/chatRecord/${route.params.eventKey}` && !isProduction">
                <router-link :to="`/groupChatRecord/${eventKey}`">
                    <img :src="groupChatLeft" alt="群聊歷史紀錄" />
                </router-link>
            </div>
            <!-- 找商家 -->
            <div
                v-if="
                    route.path === `/chatRecord/${route.params.eventKey}` ||
                    route.path === `/groupChatRecord/${route.params.eventKey}`
                "
            >
                <router-link :to="`/moreChatRoom/${eventKey}`">
                    <img :src="moreChatRoom" alt="找商家" />
                </router-link>
            </div>
        </div>
    </div>
    <teleport to="body" v-if="showKnowModal">
        <div class="mask">
            <div class="wrap">
                <h2 class="title">歡迎使用互動回覆簡訊線上溝通雲端服務平台</h2>
                互動回覆簡訊是一款線上即時雙向溝通工具，滿足目的性的溝通需求。<br />
                你可以透過網頁瀏覽器開啟對話視窗，無需下載APP軟體，也不用再經過層層註冊關卡，只要點擊連結，即刻展開對話！
                <div class="btnWrap">
                    <button @[events].stop="showKnowModal = false">關閉</button>
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
                    <button @[events].stop="showQaModal = false">關閉</button>
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
    <teleport to="body" v-if="reportModal">
        <div class="mask">
            <div class="reportPopUp">
                <div class="closeBtn" @[events].stop="reportModal = false">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <!-- <h2>檢舉種類</h2> -->
                <h2>檢舉內容</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input
                        class="reportInput"
                        round
                        v-model:value="reportReason"
                        type="textarea"
                        placeholder="請說明原因"
                        :autosize="{
                            minRows: 3,
                            maxRows: 4,
                        }"
                    />
                </n-config-provider>
                <div class="btnWrap">
                    <button @[events].stop="submitReport">提交</button>
                </div>
            </div>
        </div>
    </teleport>
    <!-- <teleport to="body" v-if="isMCodeModel">
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
    </teleport> -->
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
import moreChatRoom from "@/assets/Images/chatRecord/store.svg";
import chatLeft from "@/assets/Images/chatroom/chat_left.svg";
import groupChatLeft from "@/assets/Images/chatRecord/user group.svg";

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
        const events = ref(isMobile ? "touchend" : "click");
        const isProduction = process.env.NODE_ENV == "production";
        // api store
        const apiStore = useApiStore();
        const { logDiary } = apiStore;
        const { eventInfo, vOldCode, isIllegalDevice, mCode, bugout, diaryLog } =
            storeToRefs(apiStore);

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
        //前往群聊交談紀錄
        const goGroupChatRecord = () => {
            isActive.value = !isActive.value;
            ctx.emit("menuToggle", isActive.value);
        };

        // 認識互動回覆簡訊 彈窗
        const showKnowModal: any = ref(false);
        const onBurgerKnow = () => {
            showKnowModal.value = true;
        };
        // 常見問題 彈窗
        const showQaModal: any = ref(false);
        const onQa = () => {
            showQaModal.value = true;
        };
        // 取得換機驗證碼
        const isOldModel = ref(false);
        const onCloseOldDevice = () => {
            isOldModel.value = false;
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
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                    bugout.value.error(
                        `error-log${route.params.eventKey}`,
                        err.response.request.responseURL
                    );
                    console.error(err);
                });
        };
        // 檢舉功能
        const reportModal = ref(false);
        const onOpenRepoprt = () => {
            reportModal.value = true;
        };
        const getLog = () => {
            diaryLog.value = bugout.value.getLog();
            diaryLog.value = `使用者資料-${route.params.eventKey}` + diaryLog.value;
            console.log("提交日誌", diaryLog.value);
            // logDiary(diaryLog.value, route.params.eventKey);
            bugout.value.clear();
        };
        const reportReason = ref("");
        const submitReport = () => {
            //api呼叫
            // 提交log
            getLog();
            reportModal.value = false;
            reportReason.value = "";
            alert("您已提交檢舉!!");
        };
        // const isMCodeModel = ref(false);
        // const getMOCode = () => {
        //     axios({
        //         method: "get",
        //         url: `${config.serverUrl}/mcode/${route.params.eventKey}?device=${withCanvasDrawing}`,
        //         headers: { Authorization: `Bearer ${signature}` },
        //     })
        //         .then((res: any) => {
        //             mCode.value = res.data.code;
        //             isMCodeModel.value = true;
        //             isActive.value = false;
        //             ctx.emit("menuToggle", isActive.value);
        //         })
        //         .catch((err: any) => {
        //             console.error(err);
        //         });
        // };
        // const onCloseMoMode = () => {
        //     isMCodeModel.value = false;
        // };

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
            goGroupChatRecord,
            eventKey,
            onBurgerKnow,
            showKnowModal,
            onQa,
            showQaModal,
            events,
            onOpenOldDevice,
            isOldModel,
            onCloseOldDevice,
            reportModal,
            onOpenRepoprt,
            reportReason,
            submitReport,
            closeIcon,
            moreChatRoom,
            chatLeft,
            groupChatLeft,
            themeOverrides,
            vOldCode,
            // isMCodeModel,
            // getMOCode,
            // onCloseMoMode,
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
    .reportPopUp {
        border-radius: 20px;
        min-width: 220px;
        min-height: 200px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
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
            color: $black;
            margin-bottom: 10px;
            &:not(:first-child) {
                margin-top: 15px;
            }
        }
        .reportInput {
            min-width: 200px;
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

//漢堡選單收放動畫
.hamburger {
    display: none;
    top: 0%;
    -webkit-transition: all 0.7s ease-in-out;
    -o-transition: all 0.7s ease-in-out;
    transition: all 0.7s ease-in-out;
    padding: 20px 20px;
    &:hover {
        cursor: pointer;
    }
    &__line:nth-child(odd) {
        width: 20px;
        height: 2px;
        background-color: $gray-1;
        display: block;
        margin: 5px;
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        position: relative;
        z-index: 2004;
    }
    &__line:nth-child(even) {
        width: 10px;
        height: 2px;
        background-color: $gray-1;
        display: block;
        margin: 5px;
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        position: relative;
        z-index: 2004;
    }
    &--isActive {
        .hamburger__line:nth-child(2) {
            opacity: 0;
        }
        .hamburger__line:nth-child(1) {
            -webkit-transform: translateY(5px) rotate(45deg);
            -ms-transform: translateY(5px) rotate(45deg);
            -o-transform: translateY(5px) rotate(45deg);
            transform: translateY(5px) rotate(45deg);
        }
        .hamburger__line:nth-child(3) {
            -webkit-transform: translateY(-9px) rotate(-45deg);
            -ms-transform: translateY(-9px) rotate(-45deg);
            -o-transform: translateY(-9px) rotate(-45deg);
            transform: translateY(-9px) rotate(-45deg);
        }
    }
}
@media (max-width: 768px) {
    .hamburger {
        display: block;
        position: absolute;
    }
}
.menu-bar {
    // grid-area: header;
    // background: no-repeat center top;
    width: 100vw;
    background-size: cover;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;
    height: 120px;
    &--chat-log-bg {
        background-image: url("~@/assets/Images/chatRecord/chatRecordBg.svg");
    }
    &--groupChat-log-bg {
        background-image: url("~@/assets/Images/chatRecord/chatRecordBg.svg");
    }
    &--moreRoom-bg {
        background-image: url("~@/assets/Images/common/moreChatRoomBg.svg");
    }
    //header 名字
    &__title {
        color: $gray-1;
        @extend %h2;
        text-align: center;
        padding-top: 25px;
        height: 120px;
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
    .hyperLink {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px 20px;
        img {
            width: 24px;
            height: 24px;
            margin: 0 5px;
        }
    }
}
.container {
    width: 280px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 150;
    background: url("~@/assets/Images/common/hambugerMenu.svg") no-repeat center bottom;
    background-size: 100% auto;
    &__menu {
        padding-top: 60px;
        width: 220px;
        + .container__menu {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid $border-line;
        }
        li {
            &.device,
            &.qa,
            &.report {
                color: $gray-2;
                @extend %h2;
                line-height: 30px;
                padding-left: 5px;
                text-decoration: none;
                display: block;
                // transition: 0.7s;
                font-weight: 600;
                &:hover,
                &:focus {
                    color: $gray-3;
                }
            }
            &.terms {
                color: $gray-2;
                @extend %h2;
                line-height: 30px;
                text-decoration: none;
                display: block;
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
                padding-left: 5px;
                text-decoration: none;
                display: block;
                // transition: 0.7s;
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
    &__title {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
        h2.title {
            margin: 0 auto;
            width: 165px;
            height: 39.72px;
            background: url("~@/assets/Images/talkod-logo-confirm.png") center no-repeat;
            background-size: 100%;
            text-indent: -9999px;
            white-space: nowrap;
            line-height: 0;
        }
    }
}
@media (max-width: 768px) {
    .container {
        transform: translateX(-100%);
        -webkit-transition: all 0.7s ease-in-out;
        -o-transition: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;
        display: block;
    }
}
</style>

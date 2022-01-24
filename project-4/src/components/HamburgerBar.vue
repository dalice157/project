<template>
    <!-- 漢堡選單 -->
    <div
        class="chatroom-header"
        :class="{
            isChatRecord: route.path === '/chatRecord',
            isMoreChatRoom: route.path === '/moreChatRoom',
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
                    <router-link :to="`/moreChatRoom?chatToken=${chatToken}`">
                        更多聊天室
                    </router-link>
                </li>
                <li class="burgerChatHistory" @click="goChatRecord">
                    <router-link :to="`/chatRecord?chatToken=${chatToken}`">交談紀錄</router-link>
                </li>
                <li class="burgerKnow">
                    <a href="http://global.every8d.com.tw/" target="_blank">我們是誰？來認識吧</a>
                </li>
            </ul>
            <ul class="hamburgerMenu">
                <li class="qa">
                    <a href="#" target="_blank">常見問題</a>
                </li>
                <li class="terms">
                    <a href="#" target="_blank">服務條款</a>
                </li>
            </ul>
            <div class="title_container">
                <h2 class="title">溝通雲</h2>
            </div>
        </div>
        <!-- NavBar 標題 -->
        <h1 class="title" v-if="route.path === '/chatRecord'">交談紀錄</h1>
        <h1 class="title" v-if="route.path === '/moreChatRoom'">更多聊天室</h1>
    </div>
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
        const chatToken = computed(() => route.query.chatToken);

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
            chatToken,
        };
    },
});
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.chatroom-header {
    grid-area: header;
    background: no-repeat center top;
    background-size: cover;
    position: sticky;
    top: 0;
    z-index: 100;
    &.isChatRecord {
        background-image: url("~@/assets/Images/chatRecord/chatRecordBg.svg");
    }
    &.isMoreChatRoom {
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
    }
    .hamburgerMenu {
        padding-top: 60px;
        width: 250px;
        li {
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

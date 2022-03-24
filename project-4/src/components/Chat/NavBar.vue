<template>
    <div class="navbar" @click="closeSearchBar">
        <div class="navbarFuncitonbar">
            <div class="navbartitle">
                <router-link class="back" :to="`/chatRecord/${eventKey}`">
                    <img src="../../assets/Images/chatroom/arrow-left.svg" alt="回交談紀錄" />
                </router-link>
                <!-- NavBar 大頭貼 -->
                <div class="navbarAvatar">
                    <n-avatar round :size="42" :src="`${config.fileUrl}/fls/${eventInfo.icon}`" />
                </div>
                <!-- NavBar 標題 -->
                <h1 class="title" v-show="route.meta.show">{{ eventInfo.name }}</h1>
            </div>
            <!-- 功能欄 -->
            <div class="chatpane">
                <router-link class="back" :to="`/chatRecord/${eventKey}`">
                    <img src="../../assets/Images/chatroom/comment.svg" alt="回交談紀錄" />
                </router-link>
                <a class="phone" v-if="eventInfo.callable === true">
                    <img
                        src="../../assets/Images/chatroom/phone.svg"
                        alt="撥打電話"
                        @click="webPhoneCall"
                    />
                </a>
                <phoneCallModel />
                <router-link class="gallery" :to="`/gallery/${eventKey}`">
                    <img src="../../assets/Images/chatroom/list.svg" alt="進入相本" />
                </router-link>
                <router-link class="search" :to="`/${eventKey}`" @click.stop="searchSwitch">
                    <img src="../../assets/Images/chatroom/search.svg" alt="搜尋" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch, watchEffect, computed } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";
import { useRouter, useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import { DO_CALL_NAME } from "@/util/commonUtil";
import config from "@/config/config";
import phoneCallModel from "@/components/phoneCallModel.vue";

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

// chat store
const chatStore = useChatStore();
const { participantList } = storeToRefs(chatStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch, closeSearchBar } = searchStore;
const { searchBoolean } = storeToRefs(searchStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;

//modal store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

//router
const router = useRouter();
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);

const webPhoneCall = () => {
    phoneCallModal.value = true;
    console.log("participantList phone", participantList.value);
    const getCutomer = participantList.value.filter((item) => !item.includes("DA1"))[0];
    console.log("getCutomer", getCutomer);
    doCall(getCutomer);
};
const phoneCall = () => {
    console.log("participantList phone", participantList.value);
    const getCutomer = participantList.value.filter((item) => !item.includes("DA1"))[0];
    console.log("getCutomer", getCutomer);
    doCall(getCutomer);
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.navbar {
    width: calc(100% - 300px);
    height: 160px;
    background: transparent url("~@/assets/Images/chatroom/header-bg-pc.svg") no-repeat center top;
    background-size: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    .back {
        display: none;
    }
    .navbarFuncitonbar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        .navbartitle {
            margin-left: 15px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .back {
                display: none;
                img {
                    width: 24px;
                    height: 24px;
                }
            }
            @media (max-width: 768px) {
                .back {
                    display: block;
                }
            }

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
                    width: 14px;
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
                }
            }

            //navbar 頭貼
            .navbarAvatar {
                margin: 0 10px;
            }
            //navbar 標題
            .title {
                color: $gray-1;
                @extend %h4;
            }
        }
        .chatpane {
            margin-right: 10px;
            display: flex;
            .phone {
                display: block;
                cursor: pointer;
            }
            a {
                background-color: transparent;
                margin: 0 5px;
            }
        }
    }
    //漢堡選單收放動畫
}
@media (max-width: 768px) {
    .navbar {
        width: 100%;
        height: 112px;
        background: transparent url("~@/assets/Images/chatroom/header-bg.png") no-repeat center top;
        background-size: 120% 150px;
        .back {
            display: block;
        }
    }
}
@media (max-width: 420px) {
    .navbar {
        background: transparent url("~@/assets/Images/chatroom/header-bg-s.svg") no-repeat center
            top;
        background-size: 100%;
    }
}
</style>

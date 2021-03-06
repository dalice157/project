<template>
    <div v-if="eventInfo !== null" class="navbar" @[events]="closeSearchBar">
        <div class="navbar__funcitonbar">
            <div class="navbar__title">
                <a class="back" @[events]="goToRecord">
                    <img :src="arrowLeft" alt="回交談紀錄" />
                </a>
                <!-- NavBar 大頭貼 -->
                <div class="avatar">
                    <n-avatar round :size="42" :src="`${config.fileUrl}${eventInfo.icon}`" />
                </div>
                <!-- NavBar 標題 -->
                <h1 class="title" v-show="route.meta.show">{{ eventInfo.name }}</h1>
            </div>
            <!-- 功能欄 -->
            <div class="navbar__chatpane">
                <a class="back" @[events]="goToRecord">
                    <img :src="commentIcon" alt="回交談紀錄" />
                </a>
                <a class="phone" v-if="eventInfo.callable === true">
                    <video
                        class="hide"
                        id="remotevideo"
                        width="320"
                        height="240"
                        autoplay
                        playsinline
                    />
                    <img :src="phoneIcon" alt="撥打電話" @[events]="webPhoneCall" />
                </a>
                <phoneCallModel />
                <a class="gallery" @[events]="goToGallery">
                    <img :src="galleryIcon" alt="進入相本" />
                </a>
                <router-link class="search" :to="`/${eventKey}`" @[events].stop="searchSwitch">
                    <img :src="searchIcon" alt="搜尋" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";
import { useRouter, useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import { isMobile, eventID } from "@/util/commonUtil";
import config from "@/config/config";
import { randomString } from "@/util/chatUtil";
import phoneCallModel from "@/components/phoneCallModel.vue";
import arrowLeft from "@/assets/Images/chatroom/arrow-left.svg";
import commentIcon from "@/assets/Images/chatroom/comment.svg";
import phoneIcon from "@/assets/Images/chatroom/phone.svg";
import galleryIcon from "@/assets/Images/chatroom/list.svg";
import searchIcon from "@/assets/Images/chatroom/search.svg";

const events = ref(isMobile ? "touchend" : "click");

// api store
const apiStore = useApiStore();
const { eventInfo } = storeToRefs(apiStore);

// chat store
const chatStore = useChatStore();
const { participantList, textPlugin, janus } = storeToRefs(chatStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch, closeSearchBar } = searchStore;
const { searchBoolean } = storeToRefs(searchStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
const { sender } = storeToRefs(phoneCallStore);

//modal store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

//router
const router = useRouter();
const route = useRoute();
const eventKey = computed(() => route.params.eventKey);
let transaction = randomString(12);

const webPhoneCall = () => {
    sender.value = 1;
    phoneCallModal.value = true;
    const getCutomer = participantList.value[0];
    console.log("participantList phone", getCutomer);
    doCall(getCutomer);
};

const goToRecord = () => {
    janus.value.destroy();
    router.push(`/chatRecord/${eventKey.value}`);
};

const goToGallery = () => {
    let leave = {
        textroom: "leave",
        transaction: transaction,
        room: Number(eventID(eventKey.value)),
    };
    textPlugin.value.data({
        text: JSON.stringify(leave),
        error: function (reason: any) {
            console.log("error leave:", reason);
        },
        success: function () {},
    });
    router.push(`/gallery/${eventKey.value}`);
    // isOpenGallery.value = true;
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.hide {
    display: none;
}
.gallery {
    cursor: pointer;
}

.back {
    display: none;
}

//navbar 頭貼
.avatar {
    margin: 0 10px;
}
//navbar 標題
.title {
    color: $gray-1;
    @extend %h4;
}
.navbar {
    width: calc(100% - 300px);
    height: 160px;
    background: transparent url("~@/assets/Images/chatroom/header-bg-pc.svg") no-repeat center top;
    background-size: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    &__funcitonbar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
    }

    &__title {
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
    }
    &__chatpane {
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
        height: 102px;
        background: transparent url("~@/assets/Images/chatroom/header-bg-s.svg") no-repeat center
            center;
        background-size: 100%;
    }
}
</style>

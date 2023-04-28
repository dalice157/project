<template>
    <!-- @[events].stop="closeSearchBar" -->
    <div class="navbar">
        <div class="navbar__funcitonbar">
            <div class="navbar__title">
                <div class="back" @[events].stop="goToRecord">
                    <img :src="chatLeft" alt="回交談紀錄" />
                </div>
                <!-- NavBar 大頭貼 -->
                <div class="avatar" v-if="chatroomType === 0 && eventInfo !== null">
                    <n-avatar round :size="42" :src="`${config.fileUrl}${eventInfo.icon}`" />
                </div>
                <div class="avatar" v-if="chatroomType === 1 && groupChatEvent !== null">
                    <n-avatar round :size="42" :src="`${config.fileUrl}${groupChatEvent.icon}`" />
                </div>
                <!-- NavBar 標題 -->
                <h1
                    class="title"
                    v-if="route.meta.show && chatroomType === 0 && eventInfo !== null"
                >
                    {{ eventInfo.name }}
                </h1>
                <h1
                    class="title"
                    v-if="route.meta.show && chatroomType === 1 && groupChatEvent !== null"
                >
                    {{ groupChatEvent.name }}
                </h1>
            </div>
            <!-- 功能欄 -->
            <div class="navbar__chatpane">
                <!-- <div class="back" @[events].stop="goToRecord">
                    <img :src="commentIcon" alt="回交談紀錄" />
                </div> -->
                <div class="phone" v-if="chatroomType === 0 && eventInfo?.callable === true">
                    <video
                        class="hide"
                        id="remotevideo"
                        width="320"
                        height="240"
                        autoplay
                        playsinline
                    />
                    <img :src="phoneIcon" alt="撥打電話" @[events].stop="webPhoneCall" />
                </div>
                <phoneCallModel />
                <div class="gallery" @[events].stop="goToGallery">
                    <img :src="galleryIcon" alt="進入相本" />
                </div>
                <div class="search" @[events].stop="searchSwitch">
                    <img :src="searchIcon" alt="搜尋" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
// import { Debugout } from "debugout.js";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useModelStore } from "@/store/model";
import { isMobile, eventID } from "@/util/commonUtil";
import config from "@/config/config";
import { randomString } from "@/util/chatUtil";
import phoneCallModel from "@/components/phoneCallModel.vue";
import chatLeft from "@/assets/Images/chatroom/chat_left.svg";
import commentIcon from "@/assets/Images/chatroom/comment.svg";
import phoneIcon from "@/assets/Images/chatroom/phone.svg";
import galleryIcon from "@/assets/Images/chatroom/list.svg";
import searchIcon from "@/assets/Images/chatroom/search.svg";

const events = ref(isMobile ? "touchend" : "click");
// const bugout = new Debugout();
// api store
const apiStore = useApiStore();
const { logDiary } = apiStore;
const { eventInfo, diaryLog, bugout, chatroomType, groupChatEvent } = storeToRefs(apiStore);

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
    //一般聊天,群聊判斷
    if (chatroomType.value === 0) {
        // 不互動判斷
        if (eventInfo.value.dialogue === 0) {
            let leave = {
                textroom: "leave",
                transaction: transaction,
                room: Number(eventID(eventKey.value)),
            };
            textPlugin.value.data({
                text: JSON.stringify(leave),
                error: function (reason: any) {
                    console.log("error leave:", reason);
                    window.location.reload();
                },
                success: function () {
                    janus.value.destroy();
                    router.push(`/chatRecord/${eventKey.value}`);
                },
            });
        } else {
            router.push(`/chatRecord/${eventKey.value}`);
        }
    } else {
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(eventID(eventKey.value)),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
                window.location.reload();
            },
            success: function () {
                janus.value.destroy();
                router.push(`/groupChatRecord/${eventKey.value}`);
            },
        });
    }
};

const goToGallery = () => {
    if ((chatroomType.value === 0 && eventInfo.value.dialogue === 0) || chatroomType.value === 1) {
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(eventID(eventKey.value)),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("error leave:", reason);
                window.location.reload();
            },
            success: function () {
                router.push(`/gallery/${eventKey.value}`);
            },
        });
    } else {
        router.push(`/gallery/${eventKey.value}`);
    }
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
    margin: 0 15px;
}
//navbar 標題
.title {
    color: $gray-1;
    @extend %h4;
}
.navbar {
    width: calc(100vw - 350px);
    height: 160px;
    background: transparent url("~@/assets/Images/chatroom/header-bg-pc.svg") no-repeat center top;
    background-size: cover;
    background-position: 50%;
    position: fixed;
    z-index: 100;
    top: 0;
    &__funcitonbar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        // outline: 1px solid red;
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
        // .phone {
        //     display: block;
        //     cursor: pointer;
        // }
        .back,
        .phone,
        .gallery,
        .search {
            cursor: pointer;
            background-color: transparent;
            margin: 0 6px;
        }
    }
}
@media (max-width: 768px) {
    .navbar {
        width: 100%;
        height: 112px;
        background: transparent url("~@/assets/Images/chatroom/header-bg.png") no-repeat center top;
        background-size: cover;
        background-position: 50%;
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
        background-size: cover;
        background-position: 50%;
    }
}
</style>

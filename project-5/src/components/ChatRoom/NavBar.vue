<template>
    <div class="navbar" @click="closeSearchBar">
        <h2 class="title">
            {{ "+" + String(mobile).slice(0, 3) }}
            {{ String(mobile).slice(-9) }}
            <span class="lastTime">{{ lastTime }}</span>
            <n-badge :color="isOnline ? 'green' : 'grey'" dot> </n-badge>
            <!-- <span class="time"> 30分鐘前上線 </span> -->
        </h2>
        <!-- 功能欄 -->
        <div class="chatpane">
            <button v-show="!isMmsSend" @click="onChangMMSSend" class="change-mms">
                切換發送簡訊
            </button>
            <button v-show="isMmsSend" @click="onChangSMSSend" class="change-mms">
                切換發送文字
            </button>
            <a class="phone-web" v-if="!isProduction && eventInfo.callable === 1">
                <img :src="phoneIcon" alt="撥打電話" @click="onPhoneCallModal(chatroomID)" />
                <video
                    class="hide"
                    id="remotevideo"
                    width="320"
                    height="240"
                    autoplay
                    playsinline
                />
            </a>
            <phoneCallModel />
            <router-link
                class="gallery"
                :to="`/gallery/${route.params.id}?chatroomID=${chatroomID}&mobile=${mobile}`"
            >
                <img :src="galleryIcon" alt="進入相本" />
            </router-link>
            <div class="search" @click.stop="searchSwitch">
                <img :src="searchIcon" alt="搜尋" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { NBadge } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { dateFormat } from "@/util/dateUtil";
import config from "@/config/config";
import phoneCallModel from "@/components/phoneCallModel.vue";
import phoneIcon from "@/assets/Images/chatroom/phone.svg";
import galleryIcon from "@/assets/Images/chatroom/list.svg";
import searchIcon from "@/assets/Images/chatroom/search.svg";

//router
const router = useRouter();
const route = useRoute();
const eventID = computed(() => route.params.id);

const isProduction = process.env.NODE_ENV === "production";

// api store
const apiStore = useApiStore();
const { getChatroomUserInfoApi } = apiStore;
const { chatroomList: getChatroomList, eventInfo, messageList, userInfo } = storeToRefs(apiStore);

const chatroomList: any = computed(() => getChatroomList.value);
const mobile: any = computed(() => route.query.mobile);
const chatroomID: any = computed(() => route.query.chatroomID);
//chat store
const chatStore = useChatStore();
const { isMmsSend, isOnline, onlineList } = storeToRefs(chatStore);

//search store
const searchStore = useSearchStore();
const { searchSwitch, closeSearchBar } = searchStore;

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
const { isAccepted } = storeToRefs(phoneCallStore);

//modal store
const modelStore = useModelStore();
const { phoneCallModal } = storeToRefs(modelStore);

const onPhoneCallModal = (chatroomID) => {
    if (isOnline.value === true) {
        phoneCallModal.value = true;
        doCall(chatroomID);
    } else {
        alert("對方已離線,電話無法撥通!!!");
    }
};

const onChangMMSSend = () => {
    isMmsSend.value = true;
};
const onChangSMSSend = () => {
    isMmsSend.value = false;
};

const onLines = computed(() => {
    return Object.entries(onlineList.value);
});

const filterOnLine = computed(() => {
    return onLines.value
        .filter((item) => {
            console.log("item:", item);
            return item[1] === "user";
        })
        .map((id) => id[0]);
});

const lastTime: any = ref(null);
const timer: any = ref("");
const lastTimeStart: any = () => {
    timer.value = setInterval(() => {
        lastTime.value = `${dayjs(userInfo.value.lastVisit / 1000000).fromNow()}上線`;
    }, 1000);
};
getChatroomUserInfoApi(chatroomID.value);
watchEffect(() => {
    if (isOnline.value && route.path.split("/")[1] === "chat" && route.query) {
        messageList.value = messageList.value.map((item) => {
            item.janusMsg.config.isRead = true;
            return item;
        });
        clearInterval(timer.value);
        lastTime.value = "使用者在線中";
    } else {
        lastTimeStart();
    }
});
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
</style>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.hide {
    display: none;
}

.navbar {
    height: 46px;
    background-color: $primary-1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        color: $gray-1;
        @extend %h2;
        margin-left: 30px;
        .lastTime {
            font-size: $font-size-12;
            font-weight: normal;
            color: $white;
            margin-left: 20px;
            margin-right: 10px;
        }
        .time {
            font-size: $font-size-12;
            color: $white;
            display: inline-block;
            margin-left: 12px;
            font-weight: normal;
        }
    }
    .search {
        cursor: pointer;
    }
    .chatpane {
        margin-right: 0.5em;
        display: flex;
        .change-mms {
            border-radius: 50px;
            border: 1px solid $primary-4;
            background-color: $primary-4;
            color: $gray-1;
            font-size: $font-size-12;
            padding: 5px 10px;
            margin-right: 10px;
            cursor: pointer;
            &:hover {
                background-color: $primary-5;
            }
        }
        .phone-web {
            display: block;
            cursor: pointer;
        }
        .phone {
            display: none;
        }
        @media (max-width: 768px) {
            .phone-web {
                display: none;
            }
            .phone {
                display: block;
            }
        }
        a {
            background-color: transparent;
            margin: 0 10px;
        }
    }
}
@media (max-width: 768px) {
    .navbar {
        width: 100%;
        height: 140px;
        background: transparent url("~@/assets/Images/chatroom/header-bg.png") no-repeat center top;
        background-size: cover;
        .back {
            display: block;
        }
    }
}
@media (max-width: 420px) {
    .navbar {
        background: transparent url("~@/assets/Images/chatroom/header-bg-s.svg") no-repeat center
            top;
        background-size: cover;
    }
}
</style>

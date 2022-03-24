<template>
    <div class="navbar" @click="closeSearchBar">
        <h2 class="title">
            {{ "+" + String(mobile).slice(0, 3) }}
            {{ String(mobile).slice(-9) }}
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
            <a class="phone-web" v-if="eventInfo.callable === 1">
                <img
                    src="../../assets/Images/chatroom/phone.svg"
                    alt="#"
                    @click="onPhoneCallModal(chatroomID)"
                />
            </a>
            <phoneCallModel />
            <!-- <router-link
                class="phone"
                :to="`/phone/${route.params.id}?chatroomID=${chatroomID}&mobile=${mobile}`"
            >
                <img
                    src="../../assets/Images/chatroom/phone.svg"
                    alt="#"
                    @touchend="doCall(DO_CALL_NAME)"
                />
            </router-link> -->
            <router-link
                class="gallery"
                :to="`/gallery/${route.params.id}?chatroomID=${chatroomID}&mobile=${mobile}`"
            >
                <img src="../../assets/Images/chatroom/list.svg" alt="#" />
            </router-link>
            <div class="search" @click.stop="searchSwitch">
                <img src="../../assets/Images/chatroom/search.svg" alt="#" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { NBadge } from "naive-ui";
import { useRouter, useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { DO_CALL_NAME } from "@/util/commonUtil";
import config from "@/config/config";
import phoneCallModel from "@/components/phoneCallModel.vue";

//router
const router = useRouter();
const route = useRoute();
const eventID = computed(() => route.params.id);

// api store
const apiStore = useApiStore();
const { chatroomList: getChatroomList, eventInfo, messageList } = storeToRefs(apiStore);

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

watchEffect(() => {
    if (isOnline.value) {
        messageList.value = messageList.value.map((item) => {
            item.janusMsg.config.isRead = true;
            return item;
        });

        console.log("messageList watchEffect:", messageList.value);
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

<template>
    <n-layout has-sider class="chatroom" @click="closeChatBubble">
        <n-layout-sider width="330px" bordered>
            <Sidebar eventId="eventID" />
        </n-layout-sider>
        <n-layout class="content">
            <Headers />
            <n-layout-content
                ref="content"
                content-style="padding: 24px;"
                :native-scrollbar="false"
                v-if="Object.keys(route.query).length == 0"
                class="notFound"
                >點擊左側開始交談</n-layout-content
            >
            <n-layout
                class="room-wrap"
                v-if="Object.keys(route.query).length > 0"
                has-sider
                sider-placement="right"
            >
                <n-layout-content ref="content" content-style="padding: 0;" class="msg-wrap">
                    <NavBar />
                    <SearchBar />
                    <!-- 聊天室主畫面 -->
                    <MessageBox />
                    <!-- 使用者輸入框 -->
                    <Input />
                </n-layout-content>
                <n-layout-sider class="user-info" width="230px" content-style="padding: 0;">
                    <UserInfoSider />
                </n-layout-sider>
            </n-layout>
        </n-layout>
    </n-layout>

    <n-modal
        class="chatRecordCard"
        v-model:show="isIncomingCall"
        :mask-closable="false"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <UserInfo :info="eventInfo" />
            <div class="description">語音來電</div>
            <ul class="call_container">
                <li @click="doHangup(2, chatRoomID, route.params.id)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <button class="icon" @click="onIncomingCall(yourUsername, jsepMsg)"></button>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch, ref, onMounted, computed, onUpdated } from "vue";
import { NModal, NCard, NLayout, NLayoutSider, NLayoutContent } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { txt, ITransactions, IAttachPlugin } from "@/util/interfaceUtil";

import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";

import NavBar from "@/components/ChatRoom/NavBar.vue";
import MessageBox from "@/components/ChatRoom/MessageBox";
import SearchBar from "@/components/ChatRoom/SearchBar.vue";
import Input from "@/components/ChatRoom/Input";
import UserInfoSider from "@/components/ChatRoom/UserInfoSider";
import Sidebar from "@/components/ChatRoom/Sidebar";
import Headers from "@/components/Headers.vue";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";

//router
const route = useRoute();
const router = useRouter();
// api store
const apiStore = useApiStore();
const { getChatroomlistApi, getHistoryApi, getChatroomUserInfoApi } = apiStore;
const { eventInfo, isInput, eventList, staffEvents } = storeToRefs(apiStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUsername, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

//chat store
const chatStore = useChatStore();
const { showStickerModal, isOnline } = storeToRefs(chatStore);

const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);
const eventID: any = ref("");
const adminStatus = localStorage.getItem("adminStatus");

onMounted(() => {
    watch(eventList, () => {
        eventID.value = route.params.id ? route.params.id : eventList.value[0].eventID;
        getChatroomlistApi(eventID.value);
    });
});

// 監聽route query change寫法 2
const initData = () => {
    console.log("initData");
    getChatroomUserInfoApi(route.query.chatroomID);
    getHistoryApi(route.query.chatroomID);
};
if (Object.keys(route.query).length > 0) {
    isInput.value = true;
    initData();
}

watch(
    () => route.query,
    (val) => {
        if (Object.keys(val).length > 0) {
            isInput.value = true;
            initData();
        }
    }
);

const { messageList } = storeToRefs(apiStore);
const messageListLength = computed(() => {
    return messageList.value.length;
});
//監聽 messageList 打chatroomlist api
watch(messageListLength, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        setTimeout(() => {
            getChatroomlistApi(route.params.id);
        }, 500);
    }
});

const messages: any = computed({
    get() {
        return messageList.value;
    },
    set(val) {
        messageList.value = val;
    },
});

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messages.value = messageList.value.map((text: txt) => {
        text.janusMsg.config.msgFunctionStatus = false;
        return text;
    });
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.chatRecordCard.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
    background-size: 100% auto;
    .description {
        width: 100%;
        text-align: center;
        margin: 1em auto;
        color: $gray-1;
        font-size: $font-size-16;
        font-weight: 500;
        line-height: 1.6;
    }
    .call_container {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
        li {
            text-align: center;
            .icon {
                display: block;
                width: 60px;
                height: 60px;
                cursor: pointer;
                img {
                    width: 100%;
                }
            }
            button.icon {
                cursor: pointer;
                border: none;
                background: url("~@/assets/Images/common/connect-round.svg") no-repeat center;
            }
        }
        h4.text {
            @extend %h4;
            margin-top: 10px;
            color: $gray-1;
        }
    }
}
.room-wrap {
    height: calc(100% - 80px);
    background-color: $gray-8;
    .msg-wrap {
        position: relative;
        width: 100%;
        margin-top: 15px;
        margin-left: 15px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    .user-info {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-top: 15px;
        margin-left: 15px;
        margin-right: 15px;
    }
}
.chatroom {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    background-color: $gray-8;
    .content {
        border-right: 1px solid rgb(239, 239, 245);
    }
    .notFound {
        height: calc(100% - 80px);
        font-size: $font-size-30;
        padding-top: 15%;
        color: $gray-3;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

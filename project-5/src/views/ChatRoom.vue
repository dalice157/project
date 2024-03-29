<template>
    <n-layout class="chatroom" @click="closeChatBubble">
        <n-layout-header style="height: 60px">
            <IntegrateHeader />
        </n-layout-header>
        <n-layout position="absolute" style="top: 60px" has-sider>
            <n-layout-sider width="330px" bordered :native-scrollbar="false">
                <Sidebar />
            </n-layout-sider>
            <n-layout class="content">
                <Headers />
                <n-layout-content
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
                    <n-layout-content content-style="padding: 0;" class="msg-wrap">
                        <NavBar />
                        <SearchBar />
                        <!-- 聊天室主畫面 -->
                        <MessageBox :eventID="eventID" />
                        <!-- 使用者輸入框 -->
                        <Input />
                    </n-layout-content>
                    <n-layout-sider class="user-info" width="230px" content-style="padding: 0;">
                        <UserInfoSider />
                    </n-layout-sider>
                </n-layout>
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
            <UserInfo :info="userInfo" />
            <div class="description">語音來電</div>
            <ul class="call_container">
                <li @click="doHangup(2, yourUserChatroomID, route.params.id, 1)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <button
                        class="icon"
                        @click="onIncomingCall(yourUserChatroomID, jsepMsg)"
                    ></button>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
    <AlertPopUp
        :alertMessage="alertMessage"
        :alertEvent="alertEvent"
        @clearAlertMessage="clearAlertMessage"
    />
</template>
<script lang="ts">
export default {
    name: "ChatRoom",
    inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch, ref, onMounted, computed, watchEffect } from "vue";
import {
    NModal,
    NCard,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NLayoutHeader,
    NScrollbar,
} from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { txt, ITransactions, IAttachPlugin } from "@/util/interfaceUtil";

import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import { useChatRecordStore } from "@/store/chatRecord";
import { sendPrivateMsg } from "@/util/chatUtil";
import { currentDate, unixTime } from "@/util/dateUtil";
import { nanoid } from "nanoid";

import AlertPopUp from "@/components/AlertPopUp.vue";
import IntegrateHeader from "@/components/IntegrateHeader.vue";
import NavBar from "@/components/ChatRoom/NavBar.vue";
import MessageBox from "@/components/ChatRoom/MessageBox";
import SearchBar from "@/components/ChatRoom/SearchBar.vue";
import Input from "@/components/ChatRoom/Input";
import UserInfoSider from "@/components/ChatRoom/UserInfoSider";
import Sidebar from "@/components/ChatRoom/Sidebar";
import Headers from "@/components/Headers.vue";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";

//router
const route = useRoute();
const router = useRouter();
// api store
const apiStore = useApiStore();
const { getChatroomlistApi, getHistoryApi, getChatroomUserInfoApi } = apiStore;
const { eventInfo, userInfo, isInput, eventList, chatroomList, messageList, chatroomListLoading } =
    storeToRefs(apiStore);

//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUserChatroomID, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

//chat store
const chatStore = useChatStore();
const { textPlugin, isOnline } = storeToRefs(chatStore);
//chatRecord store
const chatRecordStore = useChatRecordStore();
const { recordMessages } = storeToRefs(chatRecordStore);

const chatRoomID: any = computed(() => route.query.chatroomID);
const mobile: any = computed(() => route.query.mobile);
const eventID: any = ref("");
const adminStatus = localStorage.getItem("adminStatus");

//alert popup
const alertMessage = ref("");
const alertEvent = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
onMounted(() => {
    watch(eventList, () => {
        eventID.value = route.params.id ? route.params.id : eventList.value[0]?.eventID;
        if (eventID.value) {
            getChatroomlistApi(eventID.value);
        } else {
            chatroomListLoading.value = false;
        }
    });
});
//local 沒token 導至登入頁
onMounted(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alertMessage.value = "您帳號已登出，請重新登入!!";
        alertEvent.value = "toHome";
    }
});

// 監聽route query change寫法 2
const initData = () => {
    console.log("initData ChatRoom");
    messageList.value = [];
    getChatroomUserInfoApi(chatRoomID.value);
    getHistoryApi(chatRoomID.value, eventID.value);
};
watch(
    () => route.query,
    (val) => {
        // console.log("route.query", val);
        if (Object.keys(val).length > 1 && route.name == "ChatRoom") {
            isInput.value = true;
            initData();
        }
    },
    {
        immediate: true,
    }
);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messageList.value = messageList.value.map((text: txt) => {
        text.janusMsg.config.msgFunctionStatus = false;
        return text;
    });
    recordMessages.value.forEach((msg) => {
        msg.isfunctionPopUp = false;
    });
};
</script>

<style lang="scss">
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

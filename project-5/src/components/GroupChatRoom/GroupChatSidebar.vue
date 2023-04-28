<template>
    <div class="search">
        <GroupChatSearchBar />
    </div>
    <div class="openGroupChatRoom" @click="gotoAddGroupChatRoom">
        <img :src="addRoom" />
        <p>新增群組聊天室</p>
    </div>
    <GroupChatRecordMessage />
    <Loading :isLoading="chatroomListLoading" />
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { useChatStore } from "@/store/chat";
import { randomString } from "@/util/chatUtil";
import GroupChatSearchBar from "@/components/GroupChatRecord/GroupChatSearchBar.vue";
import GroupChatRecordMessage from "@/components/GroupChatRecord/GroupChatRecordMessage.vue";
import logo from "@/assets/Images/talkod-logo-confirm.png";
import Loading from "@/components/WhiteLoadingPage.vue";
import addRoom from "@/assets/Images/groupChat/plus_o.svg";
//api store
const apiStore = useApiStore();
const { eventInfo, chatroomListLoading } = storeToRefs(apiStore);

//router
const route = useRoute();
const router = useRouter();
const eventID = computed(() => route.params.id);
//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;

//chat store
const chatStore = useChatStore();
const { textPlugin } = storeToRefs(chatStore);

const gotoAddGroupChatRoom = () => {
    if (route.query.eventID !== undefined) {
        let transaction = randomString(12);
        let leave = {
            textroom: "leave",
            transaction: transaction,
            room: Number(route.query.eventID),
        };
        textPlugin.value.data({
            text: JSON.stringify(leave),
            error: function (reason: any) {
                console.log("聊天頁面到新增頁面 leave error:", reason);
            },
            success: function () {
                console.log("聊天頁面到新增頁面 leave 成功");
            },
        });
    }
    router.push(`/groupChat/addGroupChatRoom`);
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";

.search {
    padding: 15px;
    margin-top: 60px;
}
.openGroupChatRoom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-top: 15px;
    margin-bottom: 10px;
    width: 150px;
    height: 36px;
    border-radius: 19.5px;
    background-color: #ffdbc8;
    cursor: pointer;
    img {
        margin-right: 5px;
    }
    p {
        font-size: $font-size-14;
        font-weight: 400;
        font-family: $font-family;
        color: $primary-1;
    }
}

.logo {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    justify-content: center;
    align-items: center;

    .logoImg {
        width: 55%;
        // height: 50%;
        cursor: pointer;
    }
}
</style>

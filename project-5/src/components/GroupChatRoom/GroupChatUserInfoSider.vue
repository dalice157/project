<template>
    <div class="userInfo">
        <img @click.stop="editGroupChatRoom" class="editIcon" :src="editIcon" alt="編輯" />
        <div class="userPhoto">
            <n-avatar
                v-if="groupChatUserinfo.icon"
                class="userImg"
                :size="72"
                round
                object-fit="cover"
                :src="`${config.fileUrl}${groupChatUserinfo.icon}`"
            />
            <h1>{{ groupChatUserinfo.name }}</h1>
            <p>人數&ensp;{{ groupChatUserinfo.inner + groupChatUserinfo.outter }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import config from "@/config/config";

import { useApiStore } from "@/store/api";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import { useGroupChatStore } from "@/store/groupChat";
import editIcon from "@/assets/Images/manage/edit-round.svg";

//groupChatRecord store
const groupChatRecordStore = useGroupChatRecordStore();
const { recordMessages } = storeToRefs(groupChatRecordStore);

//groupChat store
const groupChatStore = useGroupChatStore();
const { groupChatUserinfo } = storeToRefs(groupChatStore);
//api store
const apiStore = useApiStore();
const { innerPeople } = storeToRefs(apiStore);

//路由
const route = useRoute();
const router = useRouter();
//前往編輯群組聊天室
const editGroupChatRoom = () => {
    innerPeople.value = [];
    router.push(`/groupChat/editGroupChatRoom?eventID=${route.query.eventID}`);
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.userInfo {
    position: relative;
    .editIcon {
        right: 10px;
        top: -20px;
        position: absolute;
        cursor: pointer;
        font-weight: bold;
        color: #666;
        margin-left: 0.3em;
        width: 25px;
    }
    .userPhoto {
        margin-top: 30px;
        margin-bottom: 10px;
        text-align: center;
        .userImg {
            margin-bottom: 20px;
        }
        h1 {
            color: $gray-1;
            font-size: $font-size-16;
            font-weight: 500;
            margin-bottom: 10px;
        }
        p {
            color: $gray-3;
        }
    }
}
</style>

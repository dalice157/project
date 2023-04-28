<template>
    <n-layout-content content-style="padding: 0;" class="msg-wrap">
        <GroupChatNavBar />
        <GroupChatSearchBar />
        <!-- 聊天室主畫面 -->
        <GroupChatMessageBox :eventID="eventID" />
        <!-- 使用者輸入框 -->
        <GroupChatInput />
    </n-layout-content>
    <n-layout-sider class="user-info" width="230px" content-style="padding: 0;">
        <GroupChatUserInfoSider />
    </n-layout-sider>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { NLayoutSider, NLayoutContent } from "naive-ui";
import GroupChatNavBar from "@/components/GroupChatRoom/GroupChatNavBar.vue";
import GroupChatMessageBox from "@/components/GroupChatRoom/GroupChatMessageBox";
import GroupChatSearchBar from "@/components/GroupChatRoom/GroupChatSearchBar.vue";
import GroupChatInput from "@/components/GroupChatRoom/GroupChatInput";
import GroupChatUserInfoSider from "@/components/GroupChatRoom/GroupChatUserInfoSider";
import GroupChatSidebar from "@/components/GroupChatRoom/GroupChatSidebar";

const eventID = ref("");
</script>

<style lang="scss" scoped></style>

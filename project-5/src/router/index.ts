import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import ChatRoom from "@/views/ChatRoom.vue";
import Login from "@/views/Login.vue";
import AutoLogin from "@/views/AutoLogin.vue";
import Manage from "@/views/Manage.vue";
import SMSSend from "@/views/SMS/Send";
import SMSSendPage2 from "@/views/SMS/Send/SMSSendPage2.vue";
import SMSInquire from "@/views/SMS/Inquire";
import MMSSend from "@/views/MMS/Send";
import MMSSendPage2 from "@/views/MMS/Send/MMSSendPage2.vue";
import MMSInquire from "@/views/MMS/Inquire";
import ActivitySetting from "@/views/Management/ActivitySetting";
import ManageSetting from "@/views/Management/ManageSetting";
import Gallery from "@/views/Gallery.vue";
import AddChannel from "@/views/Management/AddChannel.vue";
import EditChannel from "@/views/Management/EditChannel.vue";
import AddCustomService from "@/views/Management/AddCustomService.vue";
import AddAutoReply from "@/views/Management/AddAutoReply.vue";
import EditAutoReply from "@/views/Management/EditAutoReply.vue";
import AutoReplyList from "@/views/Management/AutoReplyList.vue";
import AddressBookManagement from "@/views/GroupChat/addressBookManagement.vue";
import Profile from "@/views/Profile.vue";
import EditProfile from "@/views/EditProfile.vue";
import GroupChatRoom from "@/views/GroupChatRoom.vue";
import GroupChatArea from "@/views/GroupChatRoom/GroupChatArea.vue";
import AddGroupChatRoom from "@/views/GroupChatRoom/AddGroupChatRoom.vue";
import EditGroupChatRoom from "@/views/GroupChatRoom/EditGroupChatRoom.vue";
import GroupChatGallery from "@/views/GroupChatRoom/GroupChatGallery.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Login",
        components: {
            login: Login,
        },
        meta: { show: true, home: false },
    },
    {
        path: "/autoLogin",
        name: "AutoLogin",
        components: {
            login: AutoLogin,
        },
    },
    {
        path: "/chat/:id?",
        name: "ChatRoom",
        components: {
            container: ChatRoom,
        },
        meta: { show: true, home: false, keepAlive: true },
    },
    {
        path: "/groupChat",
        name: "GroupChatRoom",
        components: {
            container: GroupChatRoom,
        },
        children: [
            {
                path: "/groupChat/chat",
                name: "GroupChatArea",
                components: {
                    groupChat: GroupChatArea,
                },
            },
            {
                path: "/groupChat/gallery",
                name: "GroupChatGallery",
                components: {
                    groupChat: GroupChatGallery,
                },
            },
            {
                path: "/groupChat/addGroupChatRoom",
                name: "AddGroupChatRoom",
                components: {
                    groupChat: AddGroupChatRoom,
                },
            },
            {
                path: "/groupChat/editGroupChatRoom",
                name: "EditGroupChatRoom",
                components: {
                    groupChat: EditGroupChatRoom,
                },
            },
        ],
        meta: { show: true, home: false, keepAlive: true },
    },
    {
        path: "/gallery/:id?",
        name: "Gallery",
        components: {
            container: Gallery,
        },
        meta: { show: true, home: false },
    },
    {
        path: "/manage/:id?",
        name: "Manage",
        components: {
            container: Manage,
        },
        children: [
            {
                path: "/manage/:id?/SMSSend",
                name: "SMSSend",
                components: {
                    manage: SMSSend,
                },
                meta: { keepAlive: true },
            },
            {
                path: "/manage/:id?/SMSSendPage2",
                name: "SMSSendPage2",
                components: {
                    manage: SMSSendPage2,
                },
            },
            {
                path: "/manage/:id?/SMSInquire",
                name: "SMSInquire",
                components: {
                    manage: SMSInquire,
                },
            },
            {
                path: "/manage/:id?/MMSSend",
                name: "MMSSend",
                components: {
                    manage: MMSSend,
                },
                meta: { keepAlive: true },
            },
            {
                path: "/manage/:id?/MMSSendPage2",
                name: "MMSSendPage2",
                components: {
                    manage: MMSSendPage2,
                },
            },
            {
                path: "/manage/:id?/MMSInquire",
                name: "MMSInquire",
                components: {
                    manage: MMSInquire,
                },
            },
            {
                path: "/manage/:id?/activitySetting",
                name: "ActivitySetting",
                components: {
                    manage: ActivitySetting,
                },
            },
            {
                path: "/manage/:id?/activitySetting/addChannel",
                name: "AddChannel",
                components: {
                    manage: AddChannel,
                },
            },
            {
                path: "/manage/:id?/activitySetting/addCustomService",
                name: "AddCustomService",
                components: {
                    manage: AddCustomService,
                },
            },
            {
                path: "/manage/:id?/activitySetting/editChannel",
                name: "EditChannel",
                components: {
                    manage: EditChannel,
                },
            },
            {
                path: "/manage/:id?/activitySetting/addAutoReply",
                name: "AddAutoReply",
                components: {
                    manage: AddAutoReply,
                },
            },
            {
                path: "/manage/:id?/activitySetting/EditAutoReply",
                name: "EditAutoReply",
                components: {
                    manage: EditAutoReply,
                },
            },
            {
                path: "/manage/:id?/activitySetting/autoReplyList",
                name: "AutoReplyList",
                components: {
                    manage: AutoReplyList,
                },
            },
            {
                path: "/manage/:id?/manageSetting",
                name: "ManageSetting",
                components: {
                    manage: ManageSetting,
                },
            },
            {
                path: "/manage/:id?/addressBookManagement",
                name: "AddressBookManagement",
                components: {
                    manage: AddressBookManagement,
                },
            },
            {
                path: "/manage/:id?/profile",
                name: "Profile",
                components: {
                    manage: Profile,
                },
            },
            {
                path: "/manage/:id?/editprofile",
                name: "EditProfile",
                components: {
                    manage: EditProfile,
                },
            },
        ],
        meta: { show: true, home: false, keepAlive: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;

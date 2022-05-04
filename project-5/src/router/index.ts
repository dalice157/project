import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import ChatRoom from "@/views/ChatRoom.vue";
import Login from "@/views/Login.vue";
import Header from "@/components/Headers";
import Manage from "@/views/Manage.vue";
import SMSSend from "@/views/SMS/Send";
import SMSSendPage2 from "@/views/SMS/Send/SMSSendPage2.vue";
import SMSInquire from "@/views/SMS/Inquire";
import MMSSend from "@/views/MMS/Send";
import MMSSendPage2 from "@/views/MMS/Send/MMSSendPage2.vue";
import MMSInquire from "@/views/MMS/Inquire";
import ActivitySetting from "@/views/activityChannelSetting/ActivitySetting";
import ManageSetting from "@/views/ManageSetting";
import Gallery from "@/views/Gallery.vue";
import AddChannel from "@/views/activityChannelSetting/AddChannel.vue";
import EditChannel from "@/views/activityChannelSetting/EditChannel.vue";
import AddCustomService from "@/views/activityChannelSetting/AddCustomService.vue";
import AddAutoReply from "@/views/activityChannelSetting/AddAutoReply.vue";
import AutoReplyList from "@/views/activityChannelSetting/AutoReplyList.vue";

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
        path: "/chat/:id?",
        name: "ChatRoom",
        components: {
            container: ChatRoom,
        },
        meta: { show: true, home: false, keepAlive: true },
    },
    {
        path: "/gallery/:id",
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
        ],
        meta: { show: true, home: false, keepAlive: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;

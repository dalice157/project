import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import ChatRoom from "@/views/ChatRoom.vue";
import Phone from "@/views/Phone.vue";
import MoreChatRoom from "@/views/MoreChatRoom.vue";
import ChatRecord from "@/views/ChatRecord.vue";
import Gallery from "@/views/Gallery.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/:eventKey",
        name: "Chat",
        component: ChatRoom,
        meta: { show: true, home: false },
    },
    {
        path: "/phone/:eventKey",
        name: "Phone",
        component: Phone,
        meta: { show: true, home: false },
    },
    {
        path: "/moreChatRoom/:eventKey",
        name: "MoreChatRoom",
        component: MoreChatRoom,
        meta: { show: false, home: true },
    },
    {
        path: "/chatRecord/:eventKey",
        name: "ChatRecord",
        component: ChatRecord,
        meta: { show: false, home: true },
    },
    {
        path: "/gallery/:eventKey",
        name: "Gallery",
        component: Gallery,
        meta: { show: false, home: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;

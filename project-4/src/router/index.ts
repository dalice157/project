import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ChatRoom from "../views/ChatRoom.vue";
import Gallery from "../views/Gallery.vue";
import Phone from "../views/Phone.vue";
import MoreChatRoom from "../views/MoreChatRoom.vue";
import ChatRecord from "../views/ChatRecord.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/:chatToken",
        redirect: (to) => ({
            name: "Chat",
            query: { chatToken: to.params.chatToken },
        }),
    },
    {
        path: "/",
        name: "Chat",
        component: ChatRoom,
        meta: { show: true, home: false },
    },
    {
        path: "/gallery",
        name: "Gallery",
        component: Gallery,
        meta: { show: true, home: false },
    },
    {
        path: "/phone",
        name: "Phone",
        component: Phone,
        meta: { show: true, home: false },
    },
    {
        path: "/moreChatRoom",
        name: "MoreChatRoom",
        component: MoreChatRoom,
        meta: { show: false, home: true },
    },
    {
        path: "/chatRecord",
        name: "ChatRecord",
        component: ChatRecord,
        meta: { show: false, home: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
<template>
    <div>
        <LoadPage :isLoading="isLoading" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import LoadPage from "@/components/LoadingPage.vue";
import { clearAllCookie } from "@/util/commonUtil";
import { Base64 } from "js-base64";
import jwt from "jws";

import { useApiStore } from "@/store/api";
const apiStore = useApiStore();
const { autoLogin } = apiStore;
const isLoading = ref(true);
const router = useRouter();
const cookie = ref("");
//檢查 cookie 是否有 sign 的 cookie
const getCookie = (name) => {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
};
onMounted(() => {
    cookie.value = getCookie("sign");
    if (cookie.value === null) {
        // console.log("???");
        setTimeout(() => {
            location.href = "/";
        }, 300);
    } else {
        console.log("cookie", JSON.parse(Base64.decode(cookie.value)));
        const sign = JSON.parse(Base64.decode(cookie.value));
        const secret = sign.key;
        const accountID = sign.id;
        const admin = sign.admin;
        const name = sign.name;
        const eid = sign.eid;
        const headers = {
            alg: "ES256",
            typ: "JWT",
        };
        const payload = {
            eid,
            act: sign.name,
            exp: sign.expire,
        };
        const access_token = jwt.sign({
            header: headers,
            payload,
            secret,
        });
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("accountID", accountID);
        localStorage.setItem("adminStatus", admin);
        localStorage.setItem("userName", name);
        clearAllCookie("/autoLogin");
        router.push("/chat");
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
</style>

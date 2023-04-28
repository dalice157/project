<template>
    <div class="login">
        <div class="loginScreen">
            <div class="logo">
                <!-- <div class="logoImg"></div> -->
                <img class="logoImg" :src="logoImg" alt="talkOD" />
            </div>
            <n-form class="loginForm" :model="modelRef" ref="formRef" :rules="rules">
                <n-form-item label="帳號" path="account">
                    <n-input
                        v-model:value="modelRef.account"
                        type="text"
                        placeholder="請輸入帳號"
                    />
                </n-form-item>
                <span class="error" v-show="loginError === -1">尚有欄位未填寫</span>
                <span class="error" v-show="loginError === 0">服務異常，請與所屬業務人員聯繫</span>
                <span class="error" v-show="loginError === 1">帳號或密碼輸入錯誤</span>
                <span class="error" v-show="loginError === 2">請至EVERY8D網站完成帳號註冊程序</span>
                <span class="error" v-show="loginError === 3"
                    >帳號未啟用，請與所屬業務人員聯繫</span
                >
                <span class="error" v-show="loginError === 4">{{ errReason }}</span>
                <n-form-item label="密碼" path="password">
                    <n-input
                        v-model:value="modelRef.password"
                        :type="passwordShow"
                        placeholder="請輸入密碼"
                    >
                        <template #suffix>
                            <n-icon
                                v-show="passwordShow === 'password'"
                                @click="passwordShow = 'text'"
                            >
                                <eye-outline />
                            </n-icon>
                            <n-icon
                                v-show="passwordShow === 'text'"
                                @click="passwordShow = 'password'"
                            >
                                <eye-off-outline />
                            </n-icon>
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item label="驗證碼" path="varificationCode">
                    <n-input
                        class="varificationCode"
                        v-model:value="modelRef.varificationCode"
                        type="text"
                        placeholder="請輸入驗證碼"
                        @keyup.enter.prevent="login"
                    >
                        <template #suffix>
                            <!-- <identify :identifyCode="identifyCode"></identify> -->
                            <img :src="imgCode.replace(/[\r\n]/g, '')" />
                            <n-icon>
                                <refresh-outline @click="getCaptcha()" />
                            </n-icon>
                        </template>
                    </n-input>
                </n-form-item>
                <span class="error" v-show="varificationCodeError">驗證碼輸入錯誤</span>
                <span class="error" v-show="loginError === 5">驗證碼已過期</span>

                <div class="loginService">
                    <div class="rememberAccount">
                        <n-checkbox v-model:checked="rememberAccountPassword">
                            記住帳號
                        </n-checkbox>
                    </div>
                    <a
                        href="https://every8d.teamplus.tech/every8d30/Account/ForgotPwd.aspx"
                        target="_blank"
                        >忘記密碼</a
                    >
                </div>
                <div
                    id="submitTarget"
                    class="loginBtnFail"
                    v-if="disable"
                    :class="{ disable: disable }"
                >
                    登入
                </div>
                <div id="submitTarget" class="loginBtn" v-else @click="login">登入</div>
            </n-form>
        </div>
    </div>
    <Loading :isLoading="isLoading" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount, reactive, watchEffect, nextTick } from "vue";
import { NInput, NCheckbox, NForm, NFormItem, NIcon } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { storeToRefs } from "pinia";
import { Base64 } from "js-base64";
import { useApiStore } from "@/store/api";
import jwt from "jws";
import { RefreshOutline, EyeOutline, EyeOffOutline } from "@vicons/ionicons5";
import logoImg from "@/assets/Images/talkod-logo-confirm.png";

import config from "@/config/config";
import identify from "@/components/imageCode.vue";
import Loading from "@/components/LoadingPage.vue";
import { messaging } from "../firebase/config";
import { getToken, onMessage } from "firebase/messaging";
//store
const apiStore = useApiStore();
const { getCaptcha } = apiStore;
const { imgCode, imgId, isVarificationCodeExpire } = storeToRefs(apiStore);
//密碼變為文字
const passwordShow = ref("password");
//圖形驗證碼
onMounted(() => {
    getCaptcha();
});
// const identifyCode = ref("1234");
// const identifyCodes = "123456789";
// onMounted(() => {
//     identifyCode.value = "";
//     makeCode(identifyCodes, 4);
// });
// //刷新驗證碼
// const changeCode = () => {
//     isLoading.value = false;
//     identifyCode.value = "";
//     makeCode(identifyCodes, 4);
// };
// //生成隨機數
// const randomNum = (min: any, max: any) => {
//     max = max + 1;
//     return Math.floor(Math.random() * (max - min) + min);
// };
// //隨機生成驗證碼字符串
// const makeCode = (data: any, len: any) => {
//     for (let i = 0; i < len; i++) {
//         identifyCode.value += data[randomNum(0, data.length - 1)];
//     }
// };

//
//-1:必填欄位未填 0:服務異常洽業務 1:帳密錯誤 2:EVERY8D帳密註冊問題 3:登入過多被鎖
const loginError = ref(-2);

//顯示驗證碼輸入錯誤
const varificationCodeError = ref(false);
//記住帳密
const rememberAccountPassword = ref(false);
onMounted(() => {
    const remember = localStorage.getItem("是否記住帳號");
    nextTick(() => {
        if (remember === "true") {
            rememberAccountPassword.value = true;
            modelRef.account = localStorage.getItem("account") as string;
        }
    });
});
//取domain
const hostName = ref(null);
onMounted(() => {
    hostName.value = window.location.hostname;
});
//登入帳密前端驗證
const modelRef = reactive({
    account: "",
    password: "",
    varificationCode: "",
});
const rules = {
    account: {
        // required: true,
        validator(rule: any, value: any) {
            if (!value) {
                return new Error("帳號為必填");
            }
            // else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            //     return new Error("帳號只能為英數組合");
            // }
        },
        trigger: ["input", "blur"],
    },
    password: {
        // required: true,
        validator(rule: any, value: any) {
            if (!value) {
                return new Error("密碼為必填");
            }
            // else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            //     return new Error("密碼只能為英數組合");
            // }
        },
        trigger: ["input", "blur"],
    },
    varificationCode: {
        // required: true,
        validator(rule: any, value: any) {
            if (!value) {
                return new Error("驗證碼為必填");
            }
        },
        trigger: ["input", "blur"],
    },
};

//登入發送api
const router = useRouter();
const route = useRoute();
const params = route.params;
// 刪除localStorage
onMounted(() => {
    localStorage.removeItem("adminStatus");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accountID");
    localStorage.removeItem("userName");
    localStorage.removeItem("guide");
    localStorage.removeItem("eid");
});

const isLoading = ref(false);
const disable = ref(false);
const errReason = ref(null);
const login = async () => {
    disable.value = true;
    isLoading.value = true;
    //登入是否記住帳密
    if (rememberAccountPassword.value === true) {
        localStorage.setItem("是否記住帳號", "true");
        // localStorage.setItem("account", modelRef.account);
    } else if (rememberAccountPassword.value === false) {
        localStorage.removeItem("是否記住帳號");
        localStorage.removeItem("account");
    }
    // 檢查是否有欄位為空
    if (modelRef.account === "" || modelRef.password === "" || modelRef.varificationCode === "") {
        loginError.value = -1;
        disable.value = false;
        isLoading.value = false;
    } else {
        //檢查驗證碼是否過期
        if (isVarificationCodeExpire.value === true) {
            loginError.value = 5;
            disable.value = false;
            isLoading.value = false;
            getCaptcha();
            return;
        }
        //驗證碼驗證
        const bodyFormData = new FormData();
        bodyFormData.append("data_text", modelRef.varificationCode);
        bodyFormData.append("data_code", imgId.value);
        await axios
            .post(`${config.serverUrl}/captcha`, bodyFormData)
            .then((response) => {
                console.log("驗證碼 res", response);
                //登入發送api拿取 JWT token
                bodyFormData.append("account", modelRef.account);
                bodyFormData.append("password", modelRef.password);
                bodyFormData.append("domain", hostName.value === "localhost" ? 1 : hostName.value);
                bodyFormData.append("DeviceToken", deviceToken.value);
                bodyFormData.append("source", "WEB");
                axios
                    .post(`${config.serverUrl}/v1/token`, bodyFormData)
                    .then((res) => {
                        console.log("token res", JSON.stringify(res.data));
                        const secret = res.data.key;
                        const admin = res.data.admin;
                        const accountID = res.data.id;
                        const guide = res.data.guide;
                        const exp = res.data.expire;
                        const eid = res.data.eid;
                        console.log("secret", secret);
                        console.log("admin", admin);
                        console.log("accountID", accountID);
                        console.log("guide", guide);
                        console.log("exp", exp);
                        console.log("eid", eid);
                        // 塞cookie用
                        const expires = new Date(exp * 1000);
                        const headers = {
                            alg: "ES256",
                            typ: "JWT",
                        };
                        const payload = {
                            eid,
                            act: modelRef.account,
                            exp: exp,
                        };
                        const access_token = jwt.sign({
                            header: headers,
                            payload,
                            secret,
                        });
                        localStorage.setItem("eid", eid);
                        localStorage.setItem("access_token", access_token);
                        localStorage.setItem("account", modelRef.account);
                        localStorage.setItem("accountID", accountID);
                        localStorage.setItem("guide", guide);
                        localStorage.setItem("adminStatus", admin);
                        localStorage.setItem("userName", res.data.name);
                        location.href = `/chat`;
                        isLoading.value = false;
                    })
                    .catch((err) => {
                        console.log("err", err.response);
                        if (err.response.status === 401) {
                            switch (err.response.data.code) {
                                case 95:
                                    errReason.value = err.response.data.reason;
                                    loginError.value = 4;
                                    getCaptcha();
                                    break;
                                case 96:
                                    errReason.value = err.response.data.reason;
                                    loginError.value = 4;
                                    getCaptcha();
                                    break;
                                case 97:
                                    errReason.value = err.response.data.reason;
                                    loginError.value = 4;
                                    getCaptcha();
                                    break;
                                case 98:
                                    errReason.value = err.response.data.reason;
                                    loginError.value = 4;
                                    getCaptcha();
                                    break;
                                case 99:
                                    errReason.value = err.response.data.reason;
                                    loginError.value = 4;
                                    getCaptcha();
                                    break;
                                case -998:
                                    loginError.value = 2;
                                    getCaptcha();
                                    break;
                                case -999:
                                    loginError.value = 3;
                                    getCaptcha();
                                    break;
                                default:
                                    loginError.value = 1;
                                    getCaptcha();
                                    break;
                            }
                        } else {
                            loginError.value = 0;
                            getCaptcha();
                        }
                        disable.value = false;
                        isLoading.value = false;
                    });
            })
            .catch((err) => {
                getCaptcha();
                isLoading.value = false;
                disable.value = false;
                varificationCodeError.value = true;
            });
    }
};
//firebase 推播
const deviceToken = ref("");
const fcmPublicKey =
    "BA1PShyoidVTSZYnMOAHJejfRKIRkfe3oBTlDtMHE0UarzjSol1LfrnKo_Ujx672J-ycRwf12NqveGutZVtK3Ko";
const getFcmToken = () => {
    getToken(messaging, { vapidKey: fcmPublicKey })
        .then((currentToken) => {
            if (currentToken) {
                console.log("fcm token:", currentToken);
                deviceToken.value = currentToken;
                // Send the token to your server and update the UI if necessary
                // ...
            } else {
                // Show permission request UI
                console.log("No registration token available. Request permission to generate one.");
                // ...
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
        });
};
const notificationTitle = ref("");
const notificationBody = ref("");

const receiveMessage = () => {
    onMessage(messaging, (payLoad) => {
        notificationTitle.value = payLoad.data.title;
        notificationBody.value = payLoad.data.body;
        console.log("前景信息: ", notificationTitle.value, notificationBody.value);
    });
    // onMessage(function(payload) {
    //   console.log('Received background message ', payload);

    //   const notificationTitle = payload.notification.title;
    //   const notificationOptions = {
    //     body: payload.notification.body,
    //   };

    //   self.registration.showNotification(notificationTitle,
    //     notificationOptions);
    // });
};
onMounted(() => {
    getFcmToken();
    receiveMessage();
});
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.rememberAccount {
    .n-checkbox .n-checkbox__label {
        color: $gray-3;
    }
}
.login {
    .n-form-item .n-form-item-label {
        padding: 0;
        height: 20px;
        font-size: $font-size-16;
        color: $gray-1;
    }
    .n-form-item .n-form-item-feedback-wrapper {
        min-height: 17.5px;
    }
    .n-input {
        display: block;
        margin: 0 auto;
        width: 300px;
        border-radius: 4px;
        margin-top: 10px;
        &.varificationCode {
            .n-input-wrapper {
                padding-right: 5px;
            }
        }
        .n-input-wrapper {
            width: 300px;
            .n-input__input {
                width: 300px;
                --height: 40px;
                font-size: $font-size-14 !important;
                .n-input__input-el {
                    height: 40px;
                    line-height: 40px;
                }
            }
            .n-input__suffix {
                position: relative;
                #s-canvas {
                    width: 97px;
                    position: absolute;
                    top: 5px;
                    right: 20px;
                }
                .n-icon {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    svg {
                        width: 16px;
                        height: 16px;
                        color: $black;
                    }
                }
            }
        }
    }

    .n-form-item {
        margin-bottom: 10px;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.login {
    background-color: $gray-5;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("~@/assets/Images/login/login_backgroundImage.png");
    background-size: cover;
    .loginScreen {
        background-color: $white;
        width: 590px;
        height: 600px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .logo {
            // width: 243.4px;
            // height: 58.6px;
            margin-top: 25px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            .logoImg {
                width: 35%;
                // height: 70%;
                // background: url("~@/assets/Images/talkod-logo-confirm.png") center no-repeat;
                // background-size: 90%;
                // text-indent: -9999px;
                // white-space: nowrap;
                // line-height: 0;
            }
        }
        .error {
            color: $danger;
            font-size: 14px;
        }

        .loginService {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-left: 10px;
            margin-bottom: 40px;
            .rememberAccount {
                display: flex;
                align-items: center;
            }
            a {
                font-size: $font-size-14;
                color: $gray-1;
                &:hover {
                    color: $gray-3;
                    text-decoration: none;
                }
            }
        }
        .loginBtn {
            cursor: pointer;
            width: 300px;
            height: 36px;
            line-height: 36px;
            margin-bottom: 55px;
            border-radius: 18px;
            background-color: $gray-1;
            text-align: center;
            font-size: $font-size-14;
            font-weight: 400;
            color: $white;
            text-align: center;
        }
        .loginBtnFail {
            width: 300px;
            height: 36px;
            line-height: 36px;
            margin-bottom: 55px;
            border-radius: 18px;
            background-color: $gray-1;
            text-align: center;
            font-size: $font-size-14;
            font-weight: 400;
            color: $white;
            text-align: center;
            &.disable {
                background-color: $gray-4;
            }
        }
    }
}
</style>

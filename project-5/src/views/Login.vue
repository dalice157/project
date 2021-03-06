<template>
    <div class="login">
        <div class="loginScreen">
            <div class="logo">
                <div class="logoImg"></div>
            </div>
            <n-form class="loginForm" :model="modelRef" ref="formRef" :rules="rules">
                <n-form-item label="帳號" path="account">
                    <n-input
                        v-model:value="modelRef.account"
                        type="text"
                        placeholder="請輸入帳號"
                    />
                </n-form-item>
                <span class="error" v-show="varificationError">帳號或密碼輸入錯誤</span>
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
                            <identify :identifyCode="identifyCode"></identify>
                            <n-icon>
                                <refresh-outline @click="changeCode" />
                            </n-icon>
                        </template>
                    </n-input>
                </n-form-item>
                <span class="error" v-show="varificationCodeError">驗證碼輸入錯誤</span>

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
                <div id="submitTarget" class="loginBtn" @click="login">登入</div>
            </n-form>
        </div>
    </div>
    <Loading :isLoading="isLoading" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount, reactive, watchEffect } from "vue";
import { NInput, NCheckbox, NForm, NFormItem, NIcon } from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import jwt from "jws";
import { RefreshOutline, EyeOutline, EyeOffOutline } from "@vicons/ionicons5";

import config from "@/config/config";
import identify from "@/components/imageCode.vue";
import Loading from "@/components/LoadingPage.vue";

//密碼變為文字
const passwordShow = ref("password");

//圖形驗證碼
let identifyCode = ref("1234");
const identifyCodes = "123456789";

onMounted(() => {
    identifyCode.value = "";
    makeCode(identifyCodes, 4);
});
//刷新驗證碼
const changeCode = () => {
    isLoading.value = false;
    identifyCode.value = "";
    makeCode(identifyCodes, 4);
};
//生成隨機數
const randomNum = (min: any, max: any) => {
    max = max + 1;
    return Math.floor(Math.random() * (max - min) + min);
};
//隨機生成驗證碼字符串
const makeCode = (data: any, len: any) => {
    for (let i = 0; i < len; i++) {
        identifyCode.value += data[randomNum(0, data.length - 1)];
    }
};

//登入帳密驗證
const varificationError = ref(false);
//登入驗證碼驗證
const varificationCodeError = ref(false);
//記住帳密
const rememberAccountPassword = ref(false);
onBeforeMount(() => {
    const remember = localStorage.getItem("是否記住帳號");
    if (remember === "true") {
        rememberAccountPassword.value = true;
        modelRef.account = localStorage.getItem("account") as string;
    }
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
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return new Error("帳號只能為英數組合");
            }
        },
        trigger: ["input", "blur"],
    },
    password: {
        // required: true,
        validator(rule: any, value: any) {
            if (!value) {
                return new Error("密碼為必填");
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return new Error("密碼只能為英數組合");
            }
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
watchEffect(() => {
    // console.log("rules", rules);
});

//登入發送api
const router = useRouter();
const route = useRoute();
const params = route.params;
onMounted(() => {
    localStorage.removeItem("adminStatus");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accountID");
    localStorage.removeItem("userName");
});

const isLoading = ref(false);

const login = () => {
    isLoading.value = true;
    //登入是否記住帳密
    if (rememberAccountPassword.value === true) {
        localStorage.setItem("是否記住帳號", "true");
        localStorage.setItem("account", modelRef.account);
    } else if (rememberAccountPassword.value === false) {
        localStorage.removeItem("是否記住帳號");
        localStorage.removeItem("account");
    }
    //驗證碼驗證
    if (modelRef.varificationCode !== identifyCode.value) {
        varificationCodeError.value = true;
        changeCode();
        //英數驗證
    } else {
        //登入發送api拿取 JWT token
        const bodyFormData = new FormData();
        bodyFormData.append("account", modelRef.account);
        bodyFormData.append("password", modelRef.password);
        bodyFormData.append("domain", config.domain);
        axios
            .post(`${config.serverUrl}/v1/token/`, bodyFormData)
            .then((res) => {
                // console.log("res", res);
                const secret = res.data.key;
                const admin = res.data.admin;
                const accountID = res.data.id;
                // const exp = res.data.expire;
                const headers = {
                    alg: "ES256",
                    typ: "JWT",
                };
                const payload = {
                    eid: "1",
                    act: modelRef.account,
                    exp: 1671187174,
                };
                const access_token = jwt.sign({
                    header: headers,
                    payload,
                    secret,
                });

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("accountID", accountID);
                localStorage.setItem("adminStatus", admin);
                localStorage.setItem("userName", res.data.name);
                location.href = `/chat`;
                isLoading.value = false;
            })
            .catch((err) => {
                console.error("err", err);
                varificationError.value = true;
                changeCode();
            });
    }
};
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
            margin-top: 40px;
            margin-bottom: 39px;
            display: flex;
            align-items: center;
            .logoImg {
                width: 180px;
                height: 80px;
                background: url("~@/assets/Images/talkOD-logo.png") center no-repeat;
                background-size: 100%;
                text-indent: -9999px;
                white-space: nowrap;
                line-height: 0;
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
    }
}
</style>

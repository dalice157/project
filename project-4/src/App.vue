<template>
    <div class="all" :class="{ hide: shieldBoolean }" @click="closeChatBubble">
        <!-- 使用者資訊 -->
        <UserInfoSider />
        <router-view></router-view>
    </div>
    <!-- 橫屏時蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-show="shieldBoolean">
            <div class="popUp">
                <p>本產品不支持橫向觀看,請改回直式使用</p>
            </div>
        </div>
    </teleport>
    <!-- 身份不可否認 新裝置彈窗 -->
    <teleport to="body">
        <div class="mask2" v-show="isIllegalDevice">
            <div class="deviceCode">
                <!-- 測試用 <div class="closeBtn" @[events].stop="onCloseIllegalDevice">
                    <img :src="closeIcon" alt="關閉" />
                </div> -->
                <p class="notes">
                    若要使用這個裝置打開 talkOD，請到原裝置的 talkOD
                    聊天室內取得驗證碼，輸入驗證碼後即可使用。
                </p>
                <n-form ref="formRef" label-width="auto" :model="formValue" :rules="rules">
                    <n-form-item path="deviceCode">
                        <n-config-provider :theme-overrides="themeOverrides">
                            <n-input
                                round
                                v-model:value="formValue.deviceCode"
                                type="text"
                                placeholder="請輸入驗證碼"
                            />
                        </n-config-provider>
                    </n-form-item>
                    <n-button
                        round
                        size="medium"
                        @click="onSendVcode"
                        color="#ffb400"
                        text-color="#fff"
                        type="primary"
                        >送出</n-button
                    >
                    <span v-if="errText" class="error">驗證碼錯誤</span>
                </n-form>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import vConsole from "@/plugin/vConsole";
import { NInput, NConfigProvider, NButton, NForm, NFormItem, NSpin } from "naive-ui";

import config from "@/config/config";
import UserInfoSider from "@/components/UserInfoSider.vue";
import { useChatStore } from "@/store/chat";
import { useApiStore } from "@/store/api";
import { txt } from "@/util/interfaceUtil";
import { isMobile } from "@/util/commonUtil";
import { signature, withCanvasDrawing } from "@/util/deviceUtil";
import closeIcon from "@/assets/Images/common/close-round.svg";

const route = useRoute();

//chat store
const chatStore = useChatStore();
const { messages, inputFunctionBoolean } = storeToRefs(chatStore);

// api store
const apiStore = useApiStore();
const { getBackendApi } = apiStore;
const { isIllegalDevice, vCode, eventInfo } = storeToRefs(apiStore);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messages.value.forEach((text: txt) => {
        text.janusMsg.config.msgFunctionStatus = false;
    });
    inputFunctionBoolean.value = false;
};

const onCloseIllegalDevice = () => {
    isIllegalDevice.value = false;
};
const formRef = ref();
const formValue = ref({
    deviceCode: null,
});
const rules = {
    deviceCode: {
        required: true,
        trigger: ["blur", "input"],
        message: "驗證碼輸入錯誤",
        validator: (rule, value) => {
            console.log("code value:", /^\d+$/.test(value));
            return /^\d{6}$/.test(value);
        },
    },
};

const themeOverrides = {
    common: {},
    Input: {
        fontSize: "16px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
};
const errText = ref(null);
const onSendVcode = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("device", withCanvasDrawing);
    fd.append("code", formValue.value.deviceCode);
    formRef.value?.validate((errors) => {
        console.log(formValue.value.deviceCode);

        if (!errors) {
            axios({
                method: "post",
                url: `${config.serverUrl}/vcode/${route.params.eventKey}`,
                data: fd,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res: any) => {
                    vCode.value = res.data.code;
                    isIllegalDevice.value = false;
                    location.reload();
                })
                .catch((err: any) => {
                    console.log("err res", err.response);
                    errText.value = err.response.data.msg;
                    location.reload();
                });
        } else {
            console.log("errors", errors);
        }
    });
};

onMounted(() => {
    // vconsole x 及 y 軸設定調整
    vConsole;
    localStorage.setItem("vConsole_switch_x", JSON.stringify(0));
    localStorage.setItem("vConsole_switch_y", JSON.stringify(520));
});

const shieldBoolean = ref(false);

//判斷設備使用者設備瀏覽方向
onMounted(() => {
    if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth > document.body.clientHeight
    ) {
        console.log("ios橫屏");
        shieldBoolean.value = true;
    } else if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth < document.body.clientHeight
    ) {
        console.log("ios豎屏");
        shieldBoolean.value = false;
    } else if (
        navigator.userAgent.match(
            /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
        ) &&
        (screen.orientation.type === "landscape-primary" ||
            screen.orientation.type === "landscape-secondary")
    ) {
        console.log("android橫屏");
        shieldBoolean.value = true;
    } else {
        console.log("android豎屏");
        shieldBoolean.value = false;
    }
});

onMounted(() => {
    window.addEventListener("resize", () => {
        if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth > document.body.clientHeight
        ) {
            console.log("ios橫屏");
            shieldBoolean.value = true;
        } else if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth < document.body.clientHeight
        ) {
            console.log("ios豎屏");
            shieldBoolean.value = false;
        } else if (
            navigator.userAgent.match(
                /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
            ) &&
            (screen.orientation.type === "landscape-primary" ||
                screen.orientation.type === "landscape-secondary")
        ) {
            console.log("android橫屏");
            shieldBoolean.value = true;
        } else {
            console.log("android豎屏");
            shieldBoolean.value = false;
        }
    });
});
onUnmounted(() => {
    window.removeEventListener("resize", () => {
        if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth > document.body.clientHeight
        ) {
            console.log("ios橫屏");
            shieldBoolean.value = true;
        } else if (
            navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
            document.body.clientWidth < document.body.clientHeight
        ) {
            console.log("ios豎屏");
            shieldBoolean.value = false;
        } else if (
            navigator.userAgent.match(
                /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone)/i
            ) &&
            (screen.orientation.type === "landscape-primary" ||
                screen.orientation.type === "landscape-secondary")
        ) {
            console.log("android橫屏");
            shieldBoolean.value = true;
        } else {
            console.log("android豎屏");
            shieldBoolean.value = false;
        }
    });
});
</script>

<style lang="scss">
.v-wrap {
    left: 300px !important;
}

@media (max-width: 768px) {
    .v-wrap {
        left: 0 !important;
    }
}
.viewer-transition {
    left: -165px;
}
@media (max-width: 768px) {
    .viewer-transition {
        left: 0px;
    }
}
.viewer-list {
    transform: none !important;
    margin: 0 auto !important;
}
.viewer-play {
    display: none;
}
.viewer-rotate-left {
    display: none;
}
.viewer-rotate-right {
    display: none;
}
.viewer-reset {
    display: none;
}
.viewer-one-to-one {
    display: none;
}
.deviceCode {
    .n-button {
        width: 80%;
        margin: 0 auto;
    }
    .n-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .n-form-item .n-form-item-feedback-wrapper .n-form-item-feedback {
        margin-top: 4px;
        margin-bottom: 8px;
    }

    .n-form-item.n-form-item--top-labelled {
        --label-height: 10px !important;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.error {
    display: block;
    text-align: center;
    color: $danger;
    font-size: $font-size-12;
    margin-top: 8px;
}
//橫屏時蓋板popup
.mask2 {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 20px;
        width: 342px;
        height: 100px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .deviceCode {
        border-radius: 20px;
        width: 220px;
        height: auto;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        .notes {
            font-size: $font-size-14;
            margin: 10px auto;
            color: $gray-1;
            line-height: 1.5;
            width: 96%;
        }
        .closeBtn {
            position: absolute;
            right: -5px;
            top: -10px;
            z-index: 100;
            width: 28px;
            height: 28px;
            cursor: pointer;
            background-color: $white;
            border-radius: 50px;
            img {
                width: 100%;
            }
        }
        h2 {
            @extend %h2;
        }
    }
}
.all {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    grid: "sidebar body" 1fr / 300px 1fr;
    gap: 0;
    // user-select: none;
    &.hide {
        display: none;
    }
}

@media (max-width: 768px) {
    .all {
        grid: "body" 1fr;
    }
}
</style>

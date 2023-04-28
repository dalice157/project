<template>
    <div
        class="all"
        :class="{ hide: shieldBoolean }"
        @[events]="closeChatBubble"
        :theme-overrides="themeOverrides"
    >
        <!-- 使用者資訊 -->

        <UserInfoSider />
        <router-view></router-view>
    </div>
    <!-- 橫屏時蓋板popup -->
    <teleport to="body">
        <div class="mask2" v-if="shieldBoolean">
            <div class="popUp">
                <p>本產品不支持橫向觀看,請改回直式使用</p>
            </div>
        </div>
    </teleport>
    <!-- 什麼都沒有 彈窗 -->
    <teleport to="body">
        <div class="mask2" v-if="isIllegalDevice === -1"></div>
    </teleport>
    <!-- 身份不可否認 新裝置彈窗 -->
    <teleport to="body">
        <div class="mask2" v-if="isIllegalDevice === 1">
            <div class="deviceCode">
                <!-- 測試用
                <div class="closeBtn" @[events].stop="onCloseIllegalDevice">
                    <img :src="closeIcon" alt="關閉" />
                </div> -->
                <h1>請輸入裝置驗證碼</h1>
                <p class="notes">
                    若要使用此<span>手機/平板/電腦</span>網頁打開互動回覆簡訊，請到原手機的互動回覆簡訊聊天室內取得驗證碼並輸入於此<span>手機/平板/電腦</span>後即可使用。
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
                    <span class="sendNewVcode" @[events].stop="getMOCode()">找不到原裝置?</span>
                </n-form>
            </div>
        </div>
    </teleport>
    <!-- 找不原裝置彈窗 -->
    <teleport to="body" v-if="isIllegalDevice === 2">
        <div class="mask">
            <div class="deviceCode">
                <div class="closeBtn" @[events].stop="onCloseMoMode">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>簡訊回傳驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="mCode" readonly type="text" />
                </n-config-provider>
                <p class="information">
                    由於您已無原手機可驗證，為確保資訊安全， 請將上方<span
                        >6位數驗證碼，以此新手機簡訊發送到0{{ mMobile }}</span
                    >
                    簡訊發送完成請等待3分鐘後，回到本網頁並刷新，即可開啟互動回覆簡訊
                </p>
                <!-- <p class="psWord">請發送上列數字簡訊至<br />0{{ mMobile }}</p> -->
            </div>
        </div>
    </teleport>
    <!-- 驗證後錯誤彈窗 -->
    <teleport to="body" v-if="isIllegalDevice === 3">
        <div class="mask">
            <div class="deviceCode">
                <div class="closeBtn" @[events].stop="onCloseMoMode">
                    <img :src="closeIcon" alt="關閉" />
                </div>
                <h2>簡訊回傳驗證碼</h2>
                <n-config-provider :theme-overrides="themeOverrides">
                    <n-input round v-model:value="mCode" readonly type="text" />
                </n-config-provider>
                <p class="information">
                    您稍早透過簡訊回傳的驗證碼錯誤， 請重新將上方<span
                        >6位數驗證碼，以此新手機簡訊發送到0{{ mMobile }}</span
                    >
                    簡訊發送完成請等待3分鐘後，回到本網頁並刷新，即可開啟互動回覆簡訊
                </p>
                <!-- <p class="psWord">請發送上列數字簡訊至<br />0{{ mMobile }}</p> -->
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
import {
    NInput,
    NConfigProvider,
    NButton,
    NForm,
    NFormItem,
    NSpin,
    GlobalThemeOverrides,
} from "naive-ui";

import config from "@/config/config";
import UserInfoSider from "@/components/UserInfoSider.vue";
import { useChatStore } from "@/store/chat";
import { useApiStore } from "@/store/api";
import { txt } from "@/util/interfaceUtil";
import { isMobile } from "@/util/commonUtil";
import { signature, withCanvasDrawing, withoutCanvasDrawing } from "@/util/deviceUtil";
import closeIcon from "@/assets/Images/common/close-round.svg";

const route = useRoute();

//chat store
const chatStore = useChatStore();
const { messages, inputFunctionBoolean, msg } = storeToRefs(chatStore);

// api store
const apiStore = useApiStore();
const { logDiary } = apiStore;
const { isIllegalDevice, vCode, eventInfo, mCode, mMobile, bugout, diaryLog } =
    storeToRefs(apiStore);

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    messages.value.forEach((text: txt) => {
        text.janusMsg.config.msgFunctionStatus = false;
    });
    setTimeout(() => {
        inputFunctionBoolean.value = false;
    }, 50);
};
const events = ref(isMobile ? "touchend" : "click");
const getMOCode = () => {
    axios({
        method: "get",
        url: `${config.serverUrl}/mcode/${route.params.eventKey}?device=${withoutCanvasDrawing}`,
        headers: { Authorization: `Bearer ${signature}` },
    })
        .then((res: any) => {
            // console.log("getMCODE res", res);
            isIllegalDevice.value = 2;
            mCode.value = String(res.data.code);
            mMobile.value = res.data.mobile.slice(4, 13);
        })
        .catch((err: any) => {
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
            bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
            bugout.value.error(
                `error-log${route.params.eventKey}`,
                err.response.request.responseURL
            );
            console.error(err);
        });
};

const onCloseMoMode = () => {
    isIllegalDevice.value = 1;
};

const formRef = ref();
const formValue = ref({
    deviceCode: null,
});
const rules = {
    deviceCode: {
        // required: true,
        trigger: ["blur", "input"],
        message: "驗證碼輸入錯誤",
        validator: (rule, value) => {
            // console.log("code value:", /^\d+$/.test(value));
            return /^\d{6}$/.test(value);
        },
    },
};

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#ffb400",
    },
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
    fd.append("device", withoutCanvasDrawing);
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
                    isIllegalDevice.value = 0;
                    location.reload();
                })
                .catch((err: any) => {
                    console.log("vcodeerr res", err.response);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                    bugout.value.error(
                        `error-log${route.params.eventKey}`,
                        err.response.request.responseURL
                    );
                    errText.value = err.response.data.msg;
                    location.reload();
                });
        } else {
            console.log("validate Errors", errors);
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
const judgeUserBrowseDirection = () => {
    if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth > document.body.clientHeight
    ) {
        console.log("ios橫屏");
        shieldBoolean.value = true;
        // 轉屏時，將輸入框的值置為空
        // msg.value = '';
        // 轉屏時，還原置底按鈕的初始位置
        // chatStore.backToTheOrigialDiffHeight();
    } else if (
        navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i) &&
        document.body.clientWidth < document.body.clientHeight
    ) {
        console.log("ios豎屏");
        shieldBoolean.value = false;
        // 轉屏時，將輸入框的值置為空
        // msg.value = '';
        // 轉屏時，還原置底按鈕的初始位置
        // chatStore.backToTheOrigialDiffHeight();
    } else if (
        navigator.userAgent.match(
            /(Android|SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennc|wOSBrowser|BrowserNG|WebOS|Symbian|Windos Phone|mi\s)/i
        ) &&
        (screen.orientation.type === "landscape-primary" ||
            screen.orientation.type === "landscape-secondary")
    ) {
        console.log("android橫屏");
        shieldBoolean.value = true;
        // 轉屏時，將輸入框的值置為空
        // msg.value = '';
        // 轉屏時，還原置底按鈕的初始位置
        // chatStore.backToTheOrigialDiffHeight();
    } else {
        console.log("android豎屏");
        shieldBoolean.value = false;
        // 轉屏時，將輸入框的值置為空
        // msg.value = '';
        // 轉屏時，還原置底按鈕的初始位置
        // chatStore.backToTheOrigialDiffHeight();
    }
};
onMounted(() => {
    judgeUserBrowseDirection();
});
onMounted(() => {
    window.addEventListener("resize", judgeUserBrowseDirection);
});
onUnmounted(() => {
    window.removeEventListener("resize", judgeUserBrowseDirection);
});
</script>

<style lang="scss">
.v-wrap {
    left: 348.5px !important;
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
    h1 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }
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
.sendNewVcode {
    display: block;
    text-align: center;
    color: $danger;
    font-size: $font-size-14;
    margin-top: 20px;
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
        width: 280px;
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
            line-height: 1.6;
            width: 80%;
            span {
                font-size: $font-size-16;
                font-weight: 900;
            }
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
// 找不到原裝置蓋板
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrap {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1.4;
        color: rgba(0, 26, 219, 0.8);
        .title {
            @extend %h2;
            color: $black;
            margin-bottom: 10px;
            &:not(:first-child) {
                margin-top: 15px;
            }
        }
    }
    .deviceCode {
        border-radius: 20px;
        width: 280px;
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
        .information {
            font-size: 0.875rem;
            margin-top: 15px;
            width: 200px;
            line-height: 1.6;
            span {
                color: red;
            }
        }
        // .psWord {
        //     margin-top: 10px;
        //     line-height: 1.6;
        // }
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
            margin-bottom: 15px;
        }
    }
    .btnWrap {
        text-align: center;
        margin-top: 20px;
        > button {
            border: 1px solid $primary-1;
            background-color: $primary-1;
            color: $white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: $font-size-16;
            cursor: pointer;
        }
    }
}
@media (max-width: 320px) {
    .mask {
        .wrap {
            width: 280px;
        }
    }
}
.all {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    grid: "sidebar body" 1fr / 350px 1fr;
    gap: 0;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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

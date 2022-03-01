<template>
    <!-- <div class="timeSetting"> -->
    <div class="timeSetting">
        <h2>發送時間設定</h2>
        <n-divider></n-divider>
        <div class="settingRadio">
            <n-radio-group v-model:value="radio" name="radioGroup" class="radioGroup">
                <div class="immediate">
                    <n-config-provider :theme-overrides="themeOverrides">
                        <n-radio :value="0">
                            <h3>立即發送</h3>
                        </n-radio>
                    </n-config-provider>
                </div>
                <div class="reserve">
                    <n-config-provider :theme-overrides="themeOverrides">
                        <n-radio :value="1">
                            <h3>預約發送</h3>
                        </n-radio>
                    </n-config-provider>
                    <n-config-provider :theme-overrides="themeOverrides">
                        <n-date-picker
                            v-model:value="date"
                            type="datetime"
                            clearable
                            :disabled="disabled"
                            size="small"
                        />
                    </n-config-provider>
                </div>
            </n-radio-group>
        </div>
    </div>
    <!-- </div> -->
</template>
<script lang="ts" setup>
import { ref, watchEffect, watch} from "vue";
import { NRadioGroup, NRadio, NDatePicker, NDivider, NConfigProvider } from "naive-ui";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { storeToRefs } from "pinia";

//store
const smsStore = useSmsStore();
const { smsSendOption, smsSendTimeStamp, smsSendTime } = storeToRefs(smsStore);
const mmsStore = useMmsStore();
const { mmsSendOption, mmsSendTimeStamp, mmsSendTime } = storeToRefs(mmsStore);
//單選框 v-model
const radio = ref(0);
//時間日期v-model
const date = ref(null);

//判斷預約發送時才可選擇日期
const disabled = ref(false);
watchEffect(() => {
    if (radio.value === 0) {
        disabled.value = true;
    } else {
        disabled.value = false;
    }
});

const props = defineProps({
    optionType: String,
});
//監視 radio 跟 datepicker 狀態
watch(
    radio,
    () => {
        if (props.optionType === "sms") {
            smsSendOption.value = radio.value;
        } else {
            mmsSendOption.value = radio.value;
        }
    },
    { immediate: true }
);
watch(
    date,
    () => {
        if (props.optionType === "sms") {
            smsSendTimeStamp.value = date.value;
        } else {
            mmsSendTimeStamp.value = date.value;
        }
    },
    { immediate: true }
);
watchEffect(() => {
    if (smsSendOption.value === 0) {
        smsSendTime.value = 0;
    } else {
        smsSendTime.value = parseInt(String(smsSendTimeStamp.value).slice(0, 10));
    }
    // console.log("smsSendTime.value", smsSendTime.value);
});
watchEffect(() => {
    if (mmsSendOption.value === 0) {
        mmsSendTime.value = 0;
    } else {
        mmsSendTime.value = parseInt(String(mmsSendTimeStamp.value).slice(0, 10));
    }
    // console.log("mmsSendTime.value", mmsSendTime.value);
});

//更改naive-ui 套件主題
const themeOverrides = {
    common: { primaryColor: "#FFb400" },
    Radio: {
        dotColorActive: "#ffb400",
        boxShadowHover: "inset 0 0 0 1px #ffb400",
        boxShadowFocus: "inset 0 0 0 1px #ffb400",
        boxShadowActive: "inset 0 0 0 1px #ffb400",
    },
    Input: {
        borderHover: "trasparent",
        borderFocus: "trasparent",
        boxShadowFocus: "trasparent",
    },
    Card: {
        titleTextColor: "#fff",
        closeColor: "#fff",
        closeColorHover: "#fff",
        titleFontSize: "24px",
    },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.timeSetting {
    h2 {
        margin-top: 30px;
        color: $gray-1;
        @extend %h2;
        font-family: $font-family;
    }
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .settingRadio {
        padding-top: 5px;
        .radioGroup {
            display: flex;
            align-items: center;
            h3 {
                display: inline;
                @extend %h3;
                color: $gray-1;
                font-family: $font-family;
            }
            .immediate {
                margin-right: 60px;
            }
            .reserve {
                display: flex;
                .n-config-provider {
                    display: flex;
                    .n-date-picker {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
}
</style>

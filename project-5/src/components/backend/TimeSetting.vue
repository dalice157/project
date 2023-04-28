<template>
    <div class="time-setting">
        <h2>發送時間設定</h2>
        <n-divider></n-divider>
        <n-radio-group
            v-model:value="timeSettingRadio"
            name="radioGroup"
            class="time-setting__radio"
        >
            <div class="immediate">
                <n-radio :value="0">
                    <h3>立即發送</h3>
                </n-radio>
            </div>
            <div class="reserve">
                <n-radio :value="1">
                    <h3>預約發送</h3>
                </n-radio>
                <n-date-picker
                    placeholder="請選擇日期與時間"
                    v-model:value="date"
                    type="datetime"
                    clearable
                    :disabled="timeSettingRadio === 0"
                    size="small"
                    :default-value="Date.now()"
                    :is-date-disabled="dateTimeLimit"
                />
            </div>
        </n-radio-group>
        <n-checkbox class="msgTimelinessSetting" v-model:checked="msgTimelinessSetting"
            >啟用簡訊連結時效設定(二選一)</n-checkbox
        >
        <n-radio-group
            v-model:value="timeLinessRadio"
            name="radioGroup2"
            class="time-setting__radio2"
            v-if="msgTimelinessSetting === true"
        >
            <div class="expiryTime">
                <n-radio :value="0">
                    <h3>到期時間</h3>
                </n-radio>
                <n-input
                    placeholder=""
                    v-model:value="hour"
                    :disabled="timeLinessRadio === 1"
                    minlength="1"
                    maxlength="2"
                    @input="numberOnlyHours"
                />
                時
                <n-input
                    placeholder=""
                    v-model:value="minute"
                    :disabled="timeLinessRadio === 1"
                    minlength="2"
                    maxlength="2"
                    @input="numberOnlyMinutes"
                    @blur="inputLimit"
                />
                分
            </div>
            <div class="expiryDate">
                <n-radio :value="1">
                    <h3>到期日期</h3>
                </n-radio>
                <n-date-picker
                    placeholder="請選擇到期日期"
                    :actions="action"
                    v-model:value="expiryDate"
                    type="datetime"
                    :default-value="Date.now()"
                    clearable
                    :disabled="timeLinessRadio === 0"
                    size="small"
                    :is-date-disabled="dateLimit"
                    :is-time-disabled="timeLimit"
                />
            </div>
        </n-radio-group>
    </div>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>
<script lang="ts" setup>
import { ref, watchEffect, watch } from "vue";
import { NRadioGroup, NRadio, NDatePicker, NDivider, NCheckbox, NInput } from "naive-ui";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { isProduction } from "@/util/commonUtil";
import AlertPopUp from "@/components/AlertPopUp.vue";

//store
const smsStore = useSmsStore();
const {
    smsSendOption,
    smsSendTimeStamp,
    smsSendTime,
    smsTimelinessSetting,
    smsHour,
    smsMinute,
    smsExpireDate,
} = storeToRefs(smsStore);
const mmsStore = useMmsStore();
const { mmsSendOption, mmsSendTimeStamp, mmsSendTime } = storeToRefs(mmsStore);
const props = defineProps({
    optionType: String,
});
//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
//發送時間 v-model
//單選框 v-model
const timeSettingRadio = ref(0);
//時間日期 v-model
const date = ref(null);

//限制不能選過去時間
const dateTimeLimit = (ts) => {
    return ts < dayjs().startOf("day").valueOf();
};

//監視 發送時間 radio 跟 datepicker 狀態
watch(
    timeSettingRadio,
    () => {
        if (props.optionType === "sms") {
            smsSendOption.value = timeSettingRadio.value;
        } else {
            mmsSendOption.value = timeSettingRadio.value;
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
});
watchEffect(() => {
    if (mmsSendOption.value === 0) {
        mmsSendTime.value = 0;
    } else {
        mmsSendTime.value = parseInt(String(mmsSendTimeStamp.value).slice(0, 10));
    }
});

//到期設定 v-model
// 啟用簡訊時效性 勾選框
const msgTimelinessSetting = ref(false);
//時效設定單選框 v-model
const timeLinessRadio = ref(0);
//時效設定 日期 v-model
const expiryDate = ref(null);
const action = ["clear", "confirm"];
//限制不能選過去日期
const dateLimit = (ts) => {
    return ts < dayjs().startOf("day");
};
//限制不能選已過時間
const timeLimit = (ts) => {
    // datepicker 傳來的時間戳
    const year = new Date(ts).getFullYear();
    const month = new Date(ts).getMonth();
    const today = new Date(ts).getDate();
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    return {
        isHourDisabled: (hour) => {
            // console.log("hour", hour);
            if (
                year === new Date().getFullYear() &&
                month === new Date().getMonth() &&
                today === new Date().getDate()
            ) {
                if (currentMinutes < 30) {
                    return hour < currentHour;
                } else {
                    return hour < currentHour + 1;
                }
            }
        },
        isMinuteDisabled: (minutes, hour) => {
            if (
                year === new Date().getFullYear() &&
                month === new Date().getMonth() &&
                today === new Date().getDate()
            ) {
                if (currentMinutes < 30 && hour === currentHour) {
                    return minutes < currentMinutes + 30;
                } else if (currentMinutes > 30 && hour === currentHour + 1) {
                    const corssMinutes = 30 - Math.abs(currentMinutes - 60);
                    return minutes < corssMinutes;
                }
            }
        },
    };
};
//小時 v-model
const hour = ref("");
//分鐘 v-model
const minute = ref("");
const numberOnlyHours = () => {
    hour.value = hour.value.replace(/[^\d]/g, "");
};
const numberOnlyMinutes = () => {
    minute.value = minute.value.replace(/[^\d]/g, "");
};
//監聽簡訊連結 checkbox
watch(
    msgTimelinessSetting,
    () => {
        smsTimelinessSetting.value = msgTimelinessSetting.value;
    },
    { immediate: true }
);
//限制到期時間輸入框
const inputLimit = () => {
    if (timeLinessRadio.value === 0 && Number(hour.value) === 0) {
        if (minute.value.length === 1) {
            minute.value = "0" + minute.value;
        }
        if (minute.value.length === 2 && Number(minute.value) < 30) {
            alertMessage.value = "設定時間最少30分鐘!!!";
            minute.value = "";
        }
    }
};
watchEffect(() => {
    // console.log("timeLimit", timeLimit().isMinuteDisabled());
    if (msgTimelinessSetting.value === true && timeLinessRadio.value === 0) {
        smsHour.value = hour.value;
        smsMinute.value = minute.value;
        expiryDate.value = null;
        smsExpireDate.value = null;
    } else if (msgTimelinessSetting.value === true && timeLinessRadio.value === 1) {
        smsExpireDate.value =
            expiryDate.value !== null
                ? parseInt(String(expiryDate.value).slice(0, 10))
                : expiryDate.value;
        hour.value = "";
        minute.value = "";
        smsHour.value = "";
        smsMinute.value = "";
    } else {
        hour.value = "";
        minute.value = "";
        smsHour.value = "";
        smsMinute.value = "";
        expiryDate.value = null;
        smsExpireDate.value = null;
    }
    //最大小時限制
    if (Number(hour.value) > 23) {
        alertMessage.value = "設定的小時必須小於24!!!";
        hour.value = "";
    }
    //最大分鐘限制
    if (Number(minute.value) > 59) {
        alertMessage.value = "設定的分鐘必須小於60!!!";
        minute.value = "";
    }
    if (
        timeSettingRadio.value === 1 &&
        timeLinessRadio.value === 1 &&
        date.value !== null &&
        expiryDate.value !== null &&
        date.value + 1800000 > expiryDate.value
    ) {
        alertMessage.value = "簡訊連結時效之到期時間必須大於預約發送時間30分鐘以上!!!";
        expiryDate.value = null;
    }
});
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.expiryTime {
    .n-input {
        max-width: 70px;
        margin-left: 5px;
        margin-right: 5px;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.time-setting {
    h2 {
        margin-top: 15px;
        color: $gray-1;
        @extend %h2;
        font-family: $font-family;
    }
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .msgTimelinessSetting {
        margin-top: 5px;
    }
    &__radio {
        display: flex;
        align-items: center;
        margin-top: 5px;
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
    &__radio2 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 5px;
        h3 {
            @extend %h3;
            color: $gray-1;
            font-family: $font-family;
        }
        .expiryTime {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .expiryDate {
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
</style>

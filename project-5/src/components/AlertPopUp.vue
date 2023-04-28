<template>
    <teleport to="body" v-if="props.alertMessage !== ''">
        <div class="mask">
            <div class="wrap">
                <a class="close" @click="clearAlertMessage"><img :src="closeIcon" /></a>
                <p>{{ props.alertMessage }}</p>
                <div class="buttons">
                    <button @click="clearAlertMessage" class="button">確認</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { storeToRefs } from "pinia";
//store
const apiStore = useApiStore();
const { apiAlertMessage } = storeToRefs(apiStore);
const phoneCallStore = usePhoneCallStore();
const { phoneAlertMessage } = storeToRefs(phoneCallStore);
//router
const router = useRouter();
//props
const props = defineProps({
    alertMessage: String,
    alertEvent: String,
    guideRouter: String,
});

const emit = defineEmits(["clearAlertMessage", "clearRouter"]);
const clearAlertMessage = () => {
    emit("clearAlertMessage");
    apiAlertMessage.value = "";
    phoneAlertMessage.value = "";
    if (props.alertEvent === "reload") {
        window.location.reload();
        return;
    }
    if (props.alertEvent === "toHome") {
        location.href = "/";
        return;
    }
    if (props.alertEvent === "guide") {
        router.push(props.guideRouter);
        emit("clearRouter");
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
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
        position: relative;
        width: 500px;
        min-height: 190px;
        color: $gray-1;
        font-size: $font-size-18;
        border-radius: 10px;
        background: $white left top/100% no-repeat url("~@/assets/Images/common/guide-pages-bg.png");
        text-align: left;
        padding: 30px 45px 20px 45px;
        line-height: 1.4;
        .close {
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 15px;
        }
        p {
            text-align: center;
            margin-top: 50px;
            span {
                color: red;
            }
            .remark {
                color: $gray-1;
                font-size: $font-size-16;
            }
        }
        .buttons {
            display: flex;
            justify-content: space-evenly;
            .button {
                min-width: 98px;
                background-color: $primary-1;
                border-radius: 20px;
                color: $white;
                font-size: $font-size-16;
                border: none;
                padding: 8px 25px;
                margin-top: 15px;
                cursor: pointer;
                &:hover {
                    background-color: $primary-2;
                }
            }
        }
    }
}
</style>

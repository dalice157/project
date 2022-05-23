<template>
    <div class="user__photo">
        <n-avatar round :size="75" object-fit="cover" :fallback-src="user_pic_defaul" :src="img" />
    </div>
    <h3 class="user__name">
        {{ userName }}
    </h3>
</template>
<script setup lang="ts">
import { watchEffect, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar } from "naive-ui";

import config from "@/config/config";
import { imgList } from "@/util/commonUtil";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";
import { useApiStore } from "@/store/api";

const props = defineProps({
    info: {
        type: Object,
    },
});
const apiStore = useApiStore();
const { phoneCallName, phoneCallIcon } = storeToRefs(apiStore);
const userName = computed(() => {
    return phoneCallName.value;
});
// let img = computed(() => {
//     return phoneCallIcon.value;
// });
const img = ref(null);
// 環境設定
const isProduction = process.env.NODE_ENV === "production";
const getSplit = isProduction ? 4 : 5;
watchEffect(() => {
    img.value = imgList.find((item) => {
        // console.log('save item.split("/"):', item.split("/"));
        const icon =
            item.split("/")[getSplit] === "default.svg"
                ? 0
                : item.split("/")[getSplit].split(".")[0];
        return icon == phoneCallIcon.value;
    });
    console.log("props.info.icon", props.info.icon);
    console.log("phoneCallIcon", phoneCallIcon.value);
});
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.user__photo {
    margin-bottom: 1em;
    text-align: center;
    .n-avatar {
        border: 1px solid $border-line;
    }
}
.user__name {
    text-align: center;
    @extend %h3;
}
</style>

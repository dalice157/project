<template>
    <div class="userPhoto">
        <n-avatar
            round
            :size="75"
            object-fit="cover"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :src="`${config.serverUrl}/image/${userInfo.icon}`"
        />
    </div>
    <h3 class="userName">
        {{ userInfo.name }}
    </h3>
</template>
<script setup lang="ts">
import { defineComponent, computed } from "vue";
import { NAvatar } from "naive-ui";

import config from "@/config/config";

const props = defineProps({
    info: {
        type: Object,
    },
});

let userInfo: any = computed({
    get() {
        return props.info;
    },
    set(val) {},
});
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.userPhoto {
    margin-bottom: 1em;
    text-align: center;
    .n-avatar {
        border: 1px solid $border-line;
    }
}
.userName {
    text-align: center;
    @extend %h3;
}
</style>

<template>
    <teleport to="body" v-if="props.isLoading">
        <div class="mask">
            <n-spin size="large" />
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { NSpin } from "naive-ui";
const props = defineProps({
    isLoading: Boolean,
});
</script>
<style lang="scss" scoped>
.mask {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

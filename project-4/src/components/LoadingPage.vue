<template>
    <teleport to="body" v-if="props.isLoading">
        <div class="mask">
            <n-spin :size="size" />
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { NSpin } from "naive-ui";
const props = defineProps({
    isLoading: Boolean,
});
const size = ref(80);
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.n-spin {
    color: $primary-1;
}
</style>
<style lang="scss" scoped>
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

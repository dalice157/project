<template>
    <div class="more-chatRoom" v-if="moreKeyWord === ''">
        <div v-if="eventList.length > 0">
            <a
                class="more-chatRoom__box"
                v-for="item in eventList"
                :key="item.chatToken"
                :href="`/${item.chatToken}`"
            >
                <div class="more-chatRoom__list">
                    <div class="avatar">
                        <n-avatar
                            round
                            :size="50"
                            :src="`${config.fileUrl}${item.icon}`"
                            @touchmove.stop="gtouchmove"
                            @[events].stop="showCompanyInfo(item)"
                        />
                    </div>
                    <div class="info">
                        <h3 class="info__name">{{ item.name }}</h3>
                        <n-ellipsis :line-clamp="2" :tooltip="false">
                            <p>
                                {{ item.description }}
                            </p>
                        </n-ellipsis>
                    </div>
                </div>
            </a>
        </div>
        <div v-else class="more-chatRoom__notFound">尚無更多聊天室</div>
    </div>
    <div class="more-chatRoom" v-if="searcMoreMessages?.length > 0 && moreKeyWord !== ''">
        <a
            class="more-chatRoom__box"
            v-for="item in searcMoreMessages"
            :key="item.chatToken"
            :href="`/${item.chatToken}`"
        >
            <div class="more-chatRoom__list">
                <div class="avatar">
                    <n-avatar round :size="48" :src="`${config.fileUrl}${item.icon}`" />
                </div>
                <div class="info">
                    <h3 class="info__name" v-html="item.tagName"></h3>
                    <n-ellipsis :line-clamp="2" :tooltip="false">
                        <p>
                            {{ item.description }}
                        </p>
                    </n-ellipsis>
                </div>
            </div>
        </a>
    </div>
    <UserInfoModel />
</template>

<script setup lang="ts">
import { defineComponent, watchEffect, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { NAvatar, NEllipsis } from "naive-ui";
import { useModelStore } from "@/store/model";
import { useApiStore } from "@/store/api";
import { useSearchStore } from "@/store/search";
import { isMobile } from "@/util/commonUtil";
import UserInfoModel from "@/components/UserInfoModel.vue";
import config from "@/config/config";

const events = ref(isMobile ? "touchend" : "click");

const apiStore = useApiStore();
const { eventList } = storeToRefs(apiStore);

const searchStore = useSearchStore();
const { searcMoreMessages, moreKeyWord } = storeToRefs(searchStore);

const modelStore = useModelStore();
const { isMove } = storeToRefs(modelStore);
const { showCompanyInfo } = modelStore;

const gtouchmove = () => {
    isMove.value = true;
};
watchEffect(() => {
    console.log("searcMoreMessages:", searcMoreMessages.value.length);
    console.log("eventList的長度: ", eventList.value.length);
});
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
.more-chatRoom {
    height: calc(100vh - 200px);
    overflow-y: auto;
    &__box {
        display: block;
        text-decoration: none;
        border-bottom: 1px solid $border-line;
        &:hover,
        &:focus {
            background-color: $gray-7;
        }
    }
    &__list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;
    }
    &__notFound {
        font-size: 18px;
        margin-top: 30px;
        text-align: center;
    }
}
.avatar {
    margin-right: 10px;
    .n-avatar {
        border: 1px solid $border-line;
    }
}
.info {
    &__name {
        @extend %h3;
        color: $gray-2;
        margin-bottom: 6px;
    }
    p {
        font-size: $font-size-16;
        line-height: 1.5;
        color: $gray-3;
    }
}
@media (max-width: 768px) {
    .more-chatRoom {
        border-radius: 4px;
        width: 90%;
        margin: 0px auto;
        display: flex;
        flex-direction: column;
        // margin-top: 70px;
        // align-items: center;
        border: 1px solid $border-line;
        box-shadow: 2px 0px 4px $gray-6;
        background-color: $white;
        padding: 15px;
        height: calc(100vh - 390px);
        overflow-y: auto;
        &__box {
            width: 100%;
            border: none;
        }
        .more-chatRoom__box + .more-chatRoom__box {
            margin-top: 10px;
        }
    }
}
</style>

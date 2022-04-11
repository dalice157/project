<template>
    <n-button
        class="channelPreview"
        strong
        secondary
        round
        color="#3E3E3E"
        text-color="#fff"
        @click="onOpenPreview"
    >
        預覽
    </n-button>
    <teleport to="body" v-if="isPreview">
        <div class="mask">
            <div class="previewWrap">
                <n-icon size="28" class="previewClose" color="#fff" @click="onClosePreview">
                    <CloseCircleOutline />
                </n-icon>
                <header class="header">
                    <div class="titleWrap">
                        <img :src="arrowLeft" alt="回交談紀錄" />
                        <!-- NavBar 大頭貼 -->
                        <n-avatar
                            round
                            :size="42"
                            :src="avatarImg ? `${config.fileUrl}${avatarImg}` : user_pic_defaul"
                        />
                        <!-- NavBar 標題 -->
                        <h1 class="title">{{ activeName }}</h1>
                    </div>
                    <div class="iconWrap">
                        <img :src="phoneIcon" alt="打電話" />
                        <img :src="galleryIcon" alt="圖片瀏覽" />
                        <img :src="searchIcon" alt="搜索" />
                    </div>
                </header>
                <div class="wrap noMsg" v-if="welcomeMsgs.length === 0">尚無訊息</div>
                <div class="wrap" v-if="welcomeMsgs.length > 0">
                    <div class="date">
                        <span>{{ currentDate() }}</span>
                    </div>
                    <div class="inner" v-for="(msg, index) in welcomeMsgs" :key="index">
                        <!-- 對方頭像 -->
                        <div class="avatar">
                            <n-avatar
                                round
                                :size="42"
                                :src="avatarImg ? `${config.fileUrl}${avatarImg}` : user_pic_defaul"
                            />
                        </div>
                        <!-- 文字訊息 -->
                        <div class="content" v-if="msg.janusMsg.msgType === 1">
                            <div class="originalMsg">
                                {{ msg.janusMsg.msgContent }}
                            </div>
                        </div>
                        <!-- 圖片訊息 -->
                        <div class="picture" v-if="msg.janusMsg.msgType === 6">
                            <img
                                :src="`${config.fileUrl}${msg.janusMsg.format.Fileid}${msg.janusMsg.format.ExtensionName}`"
                            />
                        </div>
                        <!-- 文件訊息 -->
                        <div class="content icon" v-if="msg.janusMsg.msgType === 7">
                            <img :src="fileIcon" />
                            <div class="fileDescription">
                                <n-ellipsis
                                    class="ellipsisName"
                                    style="max-width: 120px"
                                    :tooltip="false"
                                >
                                    {{ msg.janusMsg.format.ShowName }}
                                </n-ellipsis>
                                <p>檔案大小&thinsp;:&thinsp;{{ msg.janusMsg.format.FileSize }}KB</p>
                                <p>
                                    下載期限&thinsp;:&thinsp;{{
                                        msg.janusMsg.format.expirationDate
                                    }}
                                </p>
                            </div>
                        </div>
                        <!-- 時間戳記 -->
                        <div class="timestamp">
                            <span class="time">{{ currentTime(msg.janusMsg.time / 1000000) }}</span>
                        </div>
                    </div>
                </div>
                <footer class="inputWrap">
                    <img :src="addIcon" alt="開啟文件" />
                    <img :src="cameraIcon" alt="拍照" />
                    <img :src="photoIcon" alt="開啟圖檔" />
                    <div class="textArea">Aa</div>
                    <img :src="voiceIcon" alt="錄音" />
                </footer>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { ref, toRef } from "vue";
import { NButton, NIcon, NAvatar, NEllipsis } from "naive-ui";
import { CloseCircleOutline } from "@vicons/ionicons5";
import dayjs from "dayjs";

import { currentDate, currentTime } from "@/util/dateUtil";
import user_pic_defaul from "@/assets/Images/mugShot/User-round.svg";
import config from "@/config/config";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";
import arrowLeft from "@/assets/Images/chatroom/arrow-left.svg";
import phoneIcon from "@/assets/Images/chatroom/phone.svg";
import galleryIcon from "@/assets/Images/chatroom/list.svg";
import searchIcon from "@/assets/Images/chatroom/search.svg";
import addIcon from "@/assets/Images/chatroom/add-round.svg";
import cameraIcon from "@/assets/Images/chatroom/Photo.svg";
import photoIcon from "@/assets/Images/chatroom/pic.svg";
import voiceIcon from "@/assets/Images/chatroom/voice.svg";

const isPreview = ref(false);
const onOpenPreview = () => {
    isPreview.value = true;
};
const onClosePreview = () => {
    isPreview.value = false;
};

const props = defineProps({
    welcomeMsgCount: Object,
    name: String,
    avatar: String,
});

const welcomeMsgs = toRef(props, "welcomeMsgCount");
const activeName = toRef(props, "name");
const avatarImg = toRef(props, "avatar");
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/var";
@import "~@/assets/scss/extend";
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
    .header {
        padding: 0 15px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .titleWrap,
        .iconWrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .title {
            color: $gray-1;
            @extend %h4;
            margin-left: 10px;
        }
        .iconWrap {
            width: 25%;
        }
    }
    .previewWrap {
        width: 375px;
        height: 572px;
        background-color: $white;
        background-image: url("~@/assets/Images/common/chatRoom-header.svg");
        background-repeat: no-repeat;
        position: relative;
        .previewClose {
            position: absolute;
            right: -10%;
            top: -10px;
            cursor: pointer;
        }
    }
    .wrap {
        height: calc(100% - 120px);
        overflow-y: auto;
        &.noMsg {
            text-align: center;
            font-size: $font-size-16;
            padding-top: 3em;
        }
    }
    .inputWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        padding: 0 15px;
        box-shadow: -1px -1px 4px rgba(227, 227, 227, 0.5);
        .textArea {
            border-radius: 20px;
            background-color: $gray-7;
            padding: 0 15px;
            line-height: 40px;
            height: 40px;
            color: $gray-3;
            font-size: $font-size-14;
            width: 205px;
        }
        img {
            width: 25px;
        }
    }
}

.channelPreview {
    width: 100px;
}
.inner {
    display: flex;
    align-items: flex-end;
    position: relative;
    margin: 15px;
}

.avatar {
    position: absolute;
    top: 0;
}
.date {
    display: block;
    opacity: 0.3;
    height: 27px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    span {
        background-color: $gray-1;
        display: inline-block;
        width: 100px;
        margin: 0 auto;
        text-align: center;
        color: $white;
        border-radius: 14px;
        font-size: $font-size-12;
        padding: 5px 10px;
    }
}
.content {
    max-width: 1000px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    background-color: $gray-7;
    border-radius: 5px 20px 20px 20px;
    padding: 10px;
    text-align: left;
    align-items: center;
    flex-direction: column;
    line-height: 1.5;
    margin-left: 0;
    margin-right: 10px;
    margin-left: 55px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &.icon {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: row;
        border-radius: 8px;
        > img {
            margin-top: 4px;
            width: 18px;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .fileDescription {
            margin-left: 8px;
            .ellipsisName.n-ellipsis {
                @extend %h4;
                color: $gray-1;
                font-family: $font-family;
            }
            p {
                font-size: $font-size-12;
                font-weight: 500;
                color: $gray-1;
                font-family: $font-family;
            }
        }
    }
}
.picture {
    margin-left: 55px;
    margin-right: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    height: 150px;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* Firefox, Chrome */
    line-height: 148px;
    white-space: nowrap;
    text-align: center;

    /* IE */
    *font-size: 135px; /* 200px * 0.9 = 180px */
    overflow: hidden;
    background-color: $gray-7;
    &:after {
        content: ".";
        font-size: 0;
        -webkit-text-size-adjust: none;
    }
    img {
        vertical-align: middle;
        max-width: 205px;
        max-height: 150px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
}
.originalMsg {
    font-size: $font-size-14;
    font-weight: normal;
    color: $gray-1;
    display: flex;
    justify-content: flex-start;
}
.timestamp {
    display: block;
    flex-direction: column;
    color: $gray-3;
    font-size: $font-size-12;
    font-weight: 400;
    line-height: 17px;
    height: 100%;
    .time {
        display: inline-block;
    }
}
</style>

<template>
    <!-- 下載專用 -->
    <!-- <iframe ref="fileDownPage"></iframe> -->
    <div
        id="drop-area"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner"
        ref="findScrollHeight"
        @scroll="chatroomToBottom($event)"
        :style="messageOffset"
    >
        <div class="background">
            <!-- 對話區塊 -->
            <div
                class="dialog-box"
                :class="{
                    myMsg:
                        chatroomType === 0
                            ? text.janusMsg.sender === 1
                            : chatroomID(route.params.eventKey) === text.janusMsg.chatroomID,
                    otherMsg:
                        chatroomType === 0
                            ? text.janusMsg.sender === 0
                            : chatroomID(route.params.eventKey) !== text.janusMsg.chatroomID,
                    mapMsg: text.janusMsg.msgType === 8,
                    mobileMsg: text.janusMsg.msgType === 9,
                    delChoice: deleteBoolean,
                    recallChoice: text.janusMsg.config.recallStatus,
                    dateMsg:
                        index === 0 ||
                        (index > 0 &&
                            chDateFormat(text.janusMsg.time) !==
                                chDateFormat(messages[index - 1].janusMsg.time)) ||
                        text.janusMsg.config.isUnread,
                    smsMsg: text.janusMsg.config.isSMS === true || text.janusMsg.type === 1,
                }"
                v-for="(text, index) in messages"
                :key="text.janusMsg.config.id"
                :id="text.janusMsg.config.id"
            >
                <!-- 日期樣板 -->
                <div
                    v-if="
                        (index > 0 &&
                            chDateFormat(text.janusMsg.time) !==
                                chDateFormat(messages[index - 1].janusMsg.time)) ||
                        (index === 0 && chDateFormat(text.janusMsg.time))
                    "
                    class="date"
                >
                    <div>
                        {{
                            chDateFormat(text.janusMsg.time) === currentDate()
                                ? "今天"
                                : chDateFormat(text.janusMsg.time)
                        }}
                    </div>
                </div>
                <!-- 未讀訊息樣板 -->
                <div v-if="text.janusMsg.config.isUnread && index !== 0" class="date">
                    <div>以下為未讀訊息</div>
                </div>
                <!-- <n-checkbox-group
                    v-model:value="deleteGroup"
                    v-if="deleteBoolean && !text.recallStatus"
                >
                    <div class="deleteCheckBox">
                        <n-config-provider :theme-overrides="themeOverrides">
                            <n-checkbox :value="text.id" label="" />
                        </n-config-provider>
                    </div>
                </n-checkbox-group> -->
                <!-- 群聊對方的姓名顯示 B端-->
                <p
                    v-if="
                        chatroomType === 1 &&
                        text.janusMsg.userName !== '' &&
                        text.janusMsg.userName !== messages[index - 1]?.janusMsg.userName
                    "
                    style="color: #8d8d8d; margin-left: 54px"
                >
                    {{ text.janusMsg.userName || ""
                    }}<span style="margin-left: 10px; color: #ffb400">(內部人員)</span>
                </p>
                <!-- 群聊對方的姓名顯示 C端-->
                <template v-for="people in outterPeopleInfo" :key="people.accountID">
                    <p
                        v-if="
                            chatroomType === 1 &&
                            chatroomID(route.params.eventKey) !== text.janusMsg.chatroomID &&
                            text.janusMsg.chatroomID !== '' &&
                            text.janusMsg.chatroomID !== messages[index - 1]?.janusMsg.chatroomID &&
                            text.janusMsg.chatroomID === people.accountID
                        "
                        style="color: #8d8d8d; margin-left: 54px"
                    >
                        {{ people.name ? people.name : people.mobile }}
                    </p>
                </template>
                <!-- 收回訊息樣板 -->
                <div class="recall" v-if="text.janusMsg.config.recallStatus">
                    <div>
                        <p v-if="text.janusMsg.sender === 1 && text.janusMsg.msgContent">
                            您已收回訊息&emsp;
                            <span @[events].stop="reEdit(text.janusMsg.config.id)">
                                <u>重新編輯</u>
                            </span>
                        </p>
                        <p v-if="text.janusMsg.sender === 1 && !text.janusMsg.msgContent">
                            您已收回訊息
                        </p>
                        <p v-if="text.janusMsg.sender === 0">對方已收回訊息</p>
                    </div>
                </div>

                <!-- 聊天對話框樣板-->
                <div class="dialog" v-else>
                    <div
                        class="resendMsg"
                        v-if="text.janusMsg.config.deliveryStatusSuccess === false"
                        @[events].stop="resendMsg(text)"
                    >
                        <img :src="resendIcon" alt="重傳訊息" />
                    </div>
                    <div class="dialog-inner">
                        <div
                            class="msgFunction mobile"
                            v-if="text.janusMsg.config.msgFunctionStatus"
                        >
                            <ul class="ulList">
                                <li v-if="text.janusMsg.msgContent" @[events].stop="copyMsg(text)">
                                    <span>複製</span>
                                </li>
                                <li
                                    v-if="
                                        (text.janusMsg.type === 2 &&
                                            [6, 7, 11].includes(text.janusMsg.msgType) &&
                                            dayjs().isBefore(
                                                dayjs(text.janusMsg.format.expirationDate)
                                            )) ||
                                        (text.janusMsg.type === 2 &&
                                            text.janusMsg.config.isWelcomeMsg &&
                                            [6, 7, 11].includes(text.janusMsg.msgType)) ||
                                        (text.janusMsg.type === 1 &&
                                            [6, 7, 11].includes(text.janusMsg.msgType))
                                    "
                                    @[events].stop="downloadImage(text)"
                                >
                                    下載
                                </li>
                                <!-- <li @[events].stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                <li
                                    v-if="
                                        text.janusMsg.sender === 1 &&
                                        ![8, 9].includes(text.janusMsg.msgType) &&
                                        parseInt((text.janusMsg.time + 120000000000) / 1000000) >
                                            Date.now()
                                    "
                                    @[events].stop="confirmRecallPopup(text)"
                                >
                                    <span>收回</span>
                                </li>
                                <li
                                    v-show="[1, 3, 6].includes(text.janusMsg.msgType)"
                                    @[events].stop="replyMsgEvent(text)"
                                >
                                    <span>回覆</span>
                                </li>
                            </ul>
                        </div>
                        <!-- 收回訊息滿版 popup 出現 -->
                        <teleport to="body">
                            <div class="mask" v-if="text.janusMsg.config.recallPopUp">
                                <div class="popUp">
                                    <div class="recallMsgConfirm">您確定要收回訊息嗎 ?</div>
                                    <div class="buttonContainer">
                                        <div
                                            type="button"
                                            class="cancel"
                                            @[events].stop="
                                                text.janusMsg.config.recallPopUp =
                                                    !text.janusMsg.config.recallPopUp
                                            "
                                        >
                                            取消
                                        </div>
                                        <div
                                            type="button"
                                            class="confirm"
                                            @[events].stop="recallMsg(text)"
                                        >
                                            確定
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </teleport>
                        <!-- hover出現的訊息狀態 -->
                        <div
                            class="msg_more"
                            :class="{ show: text.janusMsg.config.msgFunctionStatus }"
                            @[events].stop="openFunctionBox(text)"
                        >
                            <img :src="moreIcon" alt="more" />
                            <!-- 訊息功能框 -->
                            <div
                                class="msgFunction"
                                v-show="text.janusMsg.config.msgFunctionStatus"
                            >
                                <ul class="ulList">
                                    <li
                                        v-if="text.janusMsg.msgContent"
                                        @[events].stop="copyMsg(text)"
                                    >
                                        <span>複製</span>
                                    </li>
                                    <li
                                        v-if="
                                            [6, 7].includes(text.janusMsg.msgType) &&
                                            dayjs().isBefore(
                                                dayjs(text.janusMsg.format.expirationDate)
                                            )
                                        "
                                        @[events].stop="downloadImage(text)"
                                    >
                                        下載
                                    </li>
                                    <!-- <li @[events].stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                    <li
                                        v-if="
                                            text.janusMsg.sender === 1 &&
                                            ![8, 9].includes(text.janusMsg.msgType) &&
                                            currentTime(
                                                parseInt(
                                                    (text.janusMsg.time + 120000000000) / 1000000
                                                )
                                            ) > currentTime(Date.now())
                                        "
                                        @[events].stop="confirmRecallPopup(text)"
                                    >
                                        <span>收回</span>
                                    </li>
                                    <li
                                        v-if="[1, 3, 6].includes(text.janusMsg.msgType)"
                                        @[events].stop="replyMsgEvent(text)"
                                    >
                                        <span>回覆</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 對方頭像 -->
                        <!-- 電腦版頭像 -->
                        <!-- 一般聊天頭像 -->
                        <div
                            class="avatar"
                            v-if="
                                chatroomType === 0 &&
                                eventInfo !== null &&
                                text.janusMsg.sender === 0 &&
                                !deleteBoolean &&
                                !isMobile
                            "
                        >
                            <n-avatar
                                round
                                :size="42"
                                :src="`${config.fileUrl}${eventInfo.icon}`"
                                @[events].stop="
                                    showCompanyInfo({
                                        ...eventInfo,
                                        eventKey: route.params.eventKey,
                                    })
                                "
                            />
                        </div>
                        <!-- 判斷為群聊的頭像 -->
                        <div
                            class="avatar"
                            v-if="
                                chatroomType === 1 &&
                                groupChatEvent !== null &&
                                chatroomID(route.params.eventKey) !== text.janusMsg.chatroomID &&
                                !deleteBoolean &&
                                !isMobile
                            "
                        >
                            <!-- 後台人員 -->
                            <template v-for="people in innerPeopleInfo" :key="people.accountID">
                                <n-avatar
                                    v-if="
                                        people.account === text.janusMsg.userName &&
                                        text.janusMsg.userName !==
                                            messages[index - 1]?.janusMsg.userName &&
                                        people.icon
                                    "
                                    round
                                    :size="42"
                                    :src="`${config.fileUrl}${people.icon}`"
                                />
                                <n-avatar
                                    v-if="
                                        people.account === text.janusMsg.userName &&
                                        text.janusMsg.userName !==
                                            messages[index - 1]?.janusMsg.userName &&
                                        !people.icon
                                    "
                                    round
                                    :size="42"
                                    :src="innerPeopleDefaultIcon"
                                />
                            </template>
                            <!--其他user  -->
                            <template v-for="people in outterPeopleInfo" :key="people.accountID">
                                <n-avatar
                                    v-if="
                                        text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID &&
                                        text.janusMsg.chatroomID !==
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        people.icon !== '0'
                                    "
                                    round
                                    :size="42"
                                    :src="`${config.fileUrl}icon/${people.icon}.png`"
                                />
                                <n-avatar
                                    v-if="
                                        text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID &&
                                        text.janusMsg.chatroomID !==
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        people.icon === '0'
                                    "
                                    round
                                    :size="42"
                                    :src="outterPeopleDefaultIcon"
                                />
                            </template>
                        </div>
                        <!-- 手機版頭像 -->
                        <!-- 一般聊天頭像 -->
                        <div
                            class="avatar"
                            v-if="
                                chatroomType === 0 &&
                                eventInfo !== null &&
                                text.janusMsg.sender === 0 &&
                                !deleteBoolean &&
                                isMobile
                            "
                        >
                            <n-avatar
                                round
                                :size="42"
                                :src="`${config.fileUrl}${eventInfo.icon}`"
                                @touchstart.stop="fingerTouch()"
                                @touchmove.stop="fingerMove()"
                                @touchend.stop="fingerLeave(4)"
                            />
                        </div>
                        <!-- 判斷為群聊的頭像 -->
                        <div
                            class="avatar"
                            v-if="
                                chatroomType === 1 &&
                                chatroomID(route.params.eventKey) !== text.janusMsg.chatroomID &&
                                !deleteBoolean &&
                                isMobile
                            "
                        >
                            <!-- 後台人員 -->
                            <template v-for="people in innerPeopleInfo" :key="people.accountID">
                                <n-avatar
                                    v-if="
                                        people.account === text.janusMsg.userName &&
                                        text.janusMsg.userName !==
                                            messages[index - 1]?.janusMsg.userName &&
                                        people.icon
                                    "
                                    round
                                    :size="42"
                                    :src="`${config.fileUrl}${people.icon}`"
                                />
                                <n-avatar
                                    v-if="
                                        people.account === text.janusMsg.userName &&
                                        text.janusMsg.userName !==
                                            messages[index - 1]?.janusMsg.userName &&
                                        !people.icon
                                    "
                                    round
                                    :size="42"
                                    :src="innerPeopleDefaultIcon"
                                />
                            </template>
                            <!--其他user  -->
                            <template v-for="people in outterPeopleInfo" :key="people.accountID">
                                <n-avatar
                                    v-if="
                                        text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID &&
                                        text.janusMsg.chatroomID !==
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        people.icon !== '0'
                                    "
                                    round
                                    :size="42"
                                    :src="`${config.fileUrl}icon/${people.icon}.png`"
                                />
                                <n-avatar
                                    v-if="
                                        text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID &&
                                        text.janusMsg.chatroomID !==
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        people.icon === '0'
                                    "
                                    round
                                    :size="42"
                                    :src="outterPeopleDefaultIcon"
                                />
                            </template>
                        </div>

                        <!-- 訊息 -->
                        <div
                            class="content"
                            :class="{
                                reply: text.janusMsg.config.isReply,
                                textMsgSelect: text.janusMsg.msgType === 1,
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 1"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave()"
                        >
                            <!-- 回覆 -->
                            <div
                                class="replyMsg"
                                :class="{
                                    noMsgClick: !text.janusMsg.config.isReply,
                                }"
                                v-if="text.janusMsg.config.isReply"
                                @touchstart.stop="fingerTouch(text)"
                                @touchmove.stop="fingerMove()"
                                @touchend.stop="fingerLeave(3, _, text)"
                            >
                                <!-- @touchstart.stop="
                                    text.janusMsg.config.isReply
                                        ? scrollPageTo(
                                              text.janusMsg.config.replyObj.janusMsg.config.id
                                          )
                                        : null
                                " -->
                                <div
                                    class="info noMsg"
                                    v-if="
                                        text.janusMsg.config.replyObj.janusMsg.config.recallStatus
                                    "
                                >
                                    無法讀取原始訊息。
                                </div>
                                <div
                                    class="info"
                                    :class="{
                                        isImg: text.janusMsg.config.replyObj.janusMsg.msgType === 6,
                                    }"
                                    v-else
                                >
                                    <!--一般訊息回覆對方訊息顯示名字 -->
                                    <div
                                        class="userName"
                                        v-if="
                                            chatroomType === 0 &&
                                            eventInfo !== null &&
                                            text.janusMsg.config.replyObj.janusMsg.sender === 0
                                        "
                                    >
                                        {{ eventInfo.name }}
                                    </div>
                                    <!--  群聊訊息回覆後台人員顯示名字-->
                                    <div
                                        class="userName"
                                        v-if="
                                            chatroomType === 1 &&
                                            text.janusMsg.config.replyObj.janusMsg.userName !== ''
                                        "
                                    >
                                        {{ text.janusMsg.config.replyObj.janusMsg.userName }}
                                    </div>
                                    <!--  群聊訊息回覆其他user顯示名字--->
                                    <template
                                        v-for="people in outterPeopleInfo"
                                        :key="people.accountID"
                                    >
                                        <div
                                            class="userName"
                                            v-if="
                                                chatroomType === 1 &&
                                                text.janusMsg.config.replyObj.janusMsg
                                                    .chatroomID === people.accountID
                                            "
                                        >
                                            {{ people.name }}
                                        </div>
                                    </template>
                                    <!-- 自己回覆照片顯示 -->
                                    <div
                                        v-if="text.janusMsg.config.replyObj.janusMsg.msgType === 6"
                                    >
                                        [照片]
                                    </div>
                                    <!-- 回覆訊息格式 訊息過長顯示...-->
                                    <n-ellipsis
                                        v-if="text.janusMsg.config.replyObj.janusMsg.msgType === 1"
                                        style="width: 100%"
                                        :line-clamp="2"
                                        :tooltip="false"
                                    >
                                        {{ text.janusMsg.config.replyObj.janusMsg.msgContent }}
                                    </n-ellipsis>
                                </div>
                                <!-- 回覆貼圖 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg.msgType === 3"
                                >
                                    <img
                                        :src="`${text.janusMsg.config.replyObj.janusMsg.format.stickerUrl}${text.janusMsg.config.replyObj.janusMsg.format.stickerPackID}/${text.janusMsg.config.replyObj.janusMsg.format.stickerFileID}.${text.janusMsg.config.replyObj.janusMsg.format.ext}`"
                                    />
                                </div>
                                <!-- 回覆圖片格式 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg.msgType === 6"
                                >
                                    <img
                                        :src="`${config.fileUrl}${text.janusMsg.config.replyObj.janusMsg.format.Fileid}${text.janusMsg.config.replyObj.janusMsg.format.ExtensionName}`"
                                    />
                                </div>
                            </div>
                            <!-- 文字訊息 -->
                            <div class="originalMsg">
                                <a
                                    v-if="
                                        /^[h|H][t|T][t|T][p|P][s|S]?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/.test(
                                            text.janusMsg.msgContent
                                        )
                                    "
                                    :href="`${text.janusMsg.msgContent}`"
                                    target="_blank"
                                >
                                    {{ text.janusMsg.msgContent }}
                                </a>
                                <p v-else>
                                    {{ text.janusMsg.msgContent }}
                                </p>
                                <!-- 預覽連結meta -->
                                <div class="urlpreview" v-if="text.janusMsg.config.isLink">
                                    <h1 v-if="text.janusMsg.format.metaTitle !== ''">
                                        {{ text.janusMsg.format.metaTitle }}
                                    </h1>
                                    <p v-if="text.janusMsg.format.metaDescription !== ''">
                                        {{ text.janusMsg.format.metaDescription }}
                                    </p>
                                    <img
                                        v-if="text.janusMsg.format.metaImgurl !== ''"
                                        style="width: 50%; height: 50%"
                                        :src="text.janusMsg.format.metaImgurl"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- google maps -->
                        <div
                            class="googleMapsMsg content"
                            :class="{
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 8"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave()"
                        >
                            <a
                                :href="`https://maps.google.com/maps?q=${text.janusMsg.format.Latitude},${text.janusMsg.format.Longitude}`"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span class="img"><img :src="googleMap" alt="google maps" /></span>
                                查看地圖
                            </a>
                        </div>
                        <!-- audio -->
                        <div
                            class="audio content"
                            :class="{
                                play: text.janusMsg.config.isPlay,
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 5"
                        >
                            <audio :id="`audio-player-${text.janusMsg.config.id}`">
                                <source
                                    :src="`${config.fileUrl}${text.janusMsg.format.Fileid}.wav`"
                                    type="audio/wav"
                                />
                                Your browser does not support the audio tag.
                            </audio>
                            <n-icon @[events].stop="toggleAudio(text)" size="24">
                                <pause-circle-sharp v-show="text.janusMsg.config.isPlay" />
                                <play-circle-sharp v-show="!text.janusMsg.config.isPlay" />
                            </n-icon>
                            <span v-show="text.janusMsg.config.isPlay">{{ newTime }}</span>
                            <span v-show="!text.janusMsg.config.isPlay" class="totalTime">
                                {{ convertTime(text.janusMsg.format.SoundLength) }}
                            </span>
                            <img
                                class="audioWave"
                                v-show="!text.janusMsg.config.isPlay"
                                :src="audioIcon"
                            />
                        </div>
                        <!-- 圖片訊息 -->
                        <div
                            class="picture"
                            :class="{
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 6"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave(1, text.janusMsg.format.Fileid, text)"
                            @click.stop="viewPictureComputer(text.janusMsg.format.Fileid, _, text)"
                        >
                            <img
                                :src="`${config.fileUrl}${text.janusMsg.format.Fileid}${text.janusMsg.format.ExtensionName}`"
                                :style="`max-width:${
                                    text.janusMsg.format.width > 200
                                        ? 200 + 'px'
                                        : text.janusMsg.format.width + 'px'
                                };height:${
                                    (text.janusMsg.format.height * 200) /
                                        text.janusMsg.format.width +
                                    'px'
                                }`"
                            />
                        </div>
                        <!-- 影片訊息 -->
                        <video
                            style="margin: 0 5px; background-color: black"
                            :class="{
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            controls
                            playsinline
                            width="200"
                            v-if="text.janusMsg.msgType === 11"
                        >
                            <source
                                :src="`${config.fileUrl}${text.janusMsg.format.Fileid}${text.janusMsg.format.ExtensionName}${iosVideoDefaultTag}`"
                            />
                        </video>
                        <!-- 檔案訊息 -->
                        <div
                            class="content icon"
                            :class="{
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 7"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave(5, _, text)"
                        >
                            <img :src="fileIcon" />
                            <div class="fileDescription">
                                <n-ellipsis
                                    class="ellipsisName"
                                    style="max-width: 120px"
                                    :tooltip="false"
                                >
                                    {{ text.janusMsg.format.ShowName }}
                                </n-ellipsis>
                                <p>
                                    檔案大小&thinsp;:&thinsp;{{ text.janusMsg.format.FileSize }}Byte
                                </p>
                                <p>
                                    下載期限&thinsp;:&thinsp;{{
                                        text.janusMsg.format.expirationDate
                                    }}
                                </p>
                            </div>
                        </div>
                        <!-- 電話訊息 -->
                        <div
                            class="phoneMsg content"
                            v-else-if="text.janusMsg.msgType === 9"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave(2)"
                        >
                            <a class="phone-web" v-if="isMobile">
                                <div class="phonePic">
                                    <img :src="phoneIcon" alt="phone" />
                                </div>
                                <div
                                    class="phoneStatus"
                                    v-if="!text.janusMsg.format.phoneTypeOther"
                                >
                                    <h4 v-if="text.janusMsg.format.phoneType === 1">無回應</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 2">取消通話</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 3">語音來電</h4>
                                    <p v-if="text.janusMsg.format.phoneType === 3">
                                        {{ text.janusMsg.format.phoneTime }}
                                    </p>
                                    <h4 v-if="text.janusMsg.format.phoneType === 4">未接來電</h4>
                                </div>
                            </a>
                            <a class="phone-web" @[events].stop="onPhoneCallModal" v-else>
                                <div class="phonePic">
                                    <img :src="phoneIcon" alt="phone" />
                                </div>
                                <div
                                    class="phoneStatus"
                                    v-if="!text.janusMsg.format.phoneTypeOther"
                                >
                                    <h4 v-if="text.janusMsg.format.phoneType === 1">無回應</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 2">取消通話</h4>
                                    <h4 v-if="text.janusMsg.format.phoneType === 3">語音來電</h4>
                                    <p v-if="text.janusMsg.format.phoneType === 3">
                                        {{ text.janusMsg.format.phoneTime }}
                                    </p>
                                    <h4 v-if="text.janusMsg.format.phoneType === 4">未接來電</h4>
                                </div>
                            </a>
                        </div>
                        <!-- 貼圖訊息 -->
                        <div
                            class="sticker"
                            :class="{
                                samePeople:
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messages[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (chatroomID(route.params.eventKey) !==
                                        text.janusMsg.chatroomID &&
                                        text.janusMsg.sender ===
                                            messages[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messages[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 3"
                            @touchstart.stop="fingerTouch(text)"
                            @touchmove.stop="fingerMove()"
                            @touchend.stop="fingerLeave()"
                        >
                            <img
                                :src="`${text.janusMsg.format.stickerUrl}${text.janusMsg.format.stickerPackID}/${text.janusMsg.format.stickerFileID}.${text.janusMsg.format.ext}`"
                            />
                        </div>
                    </div>
                    <!-- 時間戳記 -->
                    <div
                        class="timestamp"
                        :class="{ yourTimeStamp: text.janusMsg.sender === 0 }"
                        :id="text.janusMsg.config.id + 'time'"
                    >
                        <span
                            class="textMsg"
                            v-if="text.janusMsg.type === 1 || text.janusMsg.config.isSMS === true"
                            >以簡訊發送</span
                        >
                        <!-- 單聊已讀 -->
                        <span
                            v-if="
                                text.janusMsg.config.isRead &&
                                text.janusMsg.sender === 1 &&
                                chatroomType === 0
                            "
                            >已讀</span
                        >
                        <!-- 群聊已讀 -->
                        <span
                            v-else-if="
                                chatroomType === 1 &&
                                chatroomID(route.params.eventKey) === text.janusMsg.chatroomID
                            "
                        >   
                            <span v-if="text.janusMsg.config.groupReadNum == 0">
                            </span>
                            <span v-else>
                                已讀 {{ text.janusMsg.config.groupReadNum }}
                            </span>
                            <!-- 已讀({{
                                (text.janusMsg.config.groupReadNum)
                            }}) -->
                        </span>

                        <span>{{ currentTime(text.janusMsg.time / 1000000) }}</span>
                    </div>
                </div>
                <n-icon
                    size="30"
                    class="scrollToBottom"
                    :style="diffHeight"
                    v-show="
                        chatroomScrolltopAndWindowHeight < chatroomScrollHeight - 30 &&
                        !text.janusMsg.format.isReply &&
                        !isReplyBox &&
                        !inputFunctionBoolean &&
                        !newMsgHint
                    "
                    @[events].stop="scrollToBottom"
                >
                    <arrow-down-circle />
                </n-icon>
            </div>
        </div>
    </div>
    <!-- 公司頭像彈窗 -->
    <UserInfoModel />
    <!-- 檔案預覽彈窗 -->
    <FilePreviewModal :previewFileFormat="previewFileFormat" />
    <!-- 刪除訊息滿版 poopup 出現
    <teleport to="body" v-if="deletePopUp">
        <div class="mask">
            <div class="popUp">
                <div class="recallMsgConfirm">對方仍能看到你刪除的訊息</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @[events].stop="deletePopUp = !deletePopUp">
                        取消
                    </div>
                    <div
                        type="button"
                        class="confirm"
                        @[events].stop="confirmDelete($route.params.eventKey)"
                    >
                        確定
                    </div>
                </div>
            </div>
        </div>
    </teleport> -->
</template>

<script setup lang="ts">
// @ts-nocheck
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import {
    ref,
    computed,
    onMounted,
    onUpdated,
    watch,
    nextTick,
    watchEffect,
    onBeforeUpdate,
} from "vue";
import useClipboard from "vue-clipboard3";
import { api as viewerApi } from "v-viewer";
import { storeToRefs } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import Compressor from "compressorjs";
import { PlayCircleSharp, PauseCircleSharp, ArrowDownCircle } from "@vicons/ionicons5";
import { NSpin, NEllipsis, NAvatar, NIcon } from "naive-ui";
import { useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useSearchStore } from "@/store/search";
import { txt } from "@/util/interfaceUtil";
import { sendPrivateMsg } from "@/util/chatUtil";
import { sendGroupMsg } from "@/util/groupChatUtil";
import {
    scrollPageTo,
    localStorageMsg,
    chatroomID,
    convertTime,
    isProduction,
    isStaging,
    eventID,
    isMobile,
} from "@/util/commonUtil";
import { currentTime, currentDate, unixTime, chDateFormat } from "@/util/dateUtil";
import UserInfoModel from "@/components/UserInfoModel.vue";
import FilePreviewModal from "@/components/FilePreviewModal.vue";
import config from "@/config/config";
import moreIcon from "@/assets/Images/chatroom/more.svg";
import googleMap from "@/assets/Images/chatroom/map.jpg";
import audioIcon from "@/assets/Images/chatroom/audio.svg";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";
import phoneIcon from "@/assets/Images/chatroom/phone-fill-round-y.svg";
import resendIcon from "@/assets/Images/chatroom/refresh-outline.svg";
import innerPeopleDefaultIcon from "@/assets/Images/chatroom/User default-B.svg";
import outterPeopleDefaultIcon from "@/assets/Images/chatroom/User default-C.svg";
import { signature } from "@/util/deviceUtil";

const events = ref(isMobile ? "touchend" : "click");

const apiStore = useApiStore();
const { getBackendApi, recallAPI, previewLink, getGroupChatMemberVisitTimeApi } = apiStore;
const {
    eventInfo,
    bugout,
    internalPeopleList,
    externalPeopleList,
    chatroomType,
    groupChatEvent,
    groupMemberVisitTimeInfoList,
} = storeToRefs(apiStore);
const timeOutEvent = ref(0);

// 彈窗 store
const modelStore = useModelStore();
const { showCompanyInfo, gotoPhone, closeAll } = modelStore;
const { showUserInfoModal, phoneCallModal, filePreviewModal } = storeToRefs(modelStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall } = phoneCallStore;
const { sender } = storeToRefs(phoneCallStore);

//router
const route = useRoute();

//chat store
const chatStore = useChatStore();
const {
    replyMsgEvent,
    confirmDelete,
    deleteQuestion,
    closeRecorder,
    scrollToBottom,
    saveGroupReadNum,
} = chatStore;
const {
    findScrollHeight,
    messages,
    msg,
    deleteBoolean,
    showRecorderModal,
    deletePopUp,
    replyMsg,
    pictures,
    textPlugin,
    isReplyBox,
    inputFunctionBoolean,
    participantList,
    showStickerModal,
    isOnline,
    newMsgHint,
    groupReadNum,
    groupReadNumType,
    isCallJoin,
    groupReadList,
} = storeToRefs(chatStore);

const onPhoneCallModal = () => {
    // console.log("對方已離線");
    sender.value = 1;
    if (isOnline.value === true) {
        showUserInfoModal.value = false;
        phoneCallModal.value = true;
        const getCutomer = participantList.value[0];
        doCall(getCutomer);
    } else {
        alert("對方已離線,電話無法撥通!!!");
    }
};
const callAgain = () => {
    sender.value = 1;
    if (isOnline.value === true) {
        showUserInfoModal.value = false;
        phoneCallModal.value = true;
        const getCutomer = participantList.value[0];
        doCall(getCutomer);
    } else {
        alert("對方已離線,電話無法撥通!!!");
    }
};
const resendMsg = (msg) => {
    // console.log(msg);
    const sendMsgObj = {
        msg: msg,
        textPlugin: textPlugin.value,
        eventKey: route.params.eventKey,
        msgParticipantList: participantList.value,
        eventID: Number(eventID(route.params.eventKey)),
    };
    sendPrivateMsg(sendMsgObj);
    messages.value.forEach((item) => {
        if (item.janusMsg.config.id === msg.janusMsg.config.id) {
            item.janusMsg.config.deliveryStatusSuccess = true;
        }
    });
    localStorage.setItem(`${route.params.eventKey}`, JSON.stringify(messages.value));
};
//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;

//聊天室功能
const preDate: any = ref([]);
const viewImgs: any = ref([]);

// 未讀訊息顯示條消失
onMounted(() => {
    messages.value.forEach((msg) => {
        msg.janusMsg.config.isUnread = false;
    });
    localStorage.setItem(`${route.params.eventKey}`, JSON.stringify(messages.value));
});

//開始按(需觸發長按功能才傳參數)
const fingerTouch = (msg: txt) => {
    // console.log("手機觸碰開始");
    timeOutEvent.value = setTimeout(function () {
        longPress(msg);
        console.log("長按");
    }, 500);
    return false;
};
//真正長按後應該執行的内容
const longPress = (msg: any) => {
    timeOutEvent.value = 0;
    openFunctionBox(msg);
};
//如果手指有移動，則取消所有事件，此时說名用户只是要移動而不是長按
const fingerMove = () => {
    clearTimeout(timeOutEvent.value); //清除定时器
    timeOutEvent.value = 0;
};
//手釋放，如果在500毫秒内就釋放，則取消長按事件，此时可以執行onclick執行事件
const fingerLeave = (type?, fileid?, text?) => {
    // type
    //     1:圖片預覽
    //     2:電話撥打
    //     3:跳至回覆訊息
    //     4:打開公司頭像
    //     5:檔案預覽
    clearTimeout(timeOutEvent.value);
    if (timeOutEvent.value != 0) {
        // console.log("點擊");
        // 開啟圖片預覽
        if (type === 1 && typeof fileid === "number") {
            previewURL(fileid, text);
            console.log("圖片預覽");
            return;
        }
        //判斷電話訊息重撥
        if (type === 2) {
            // console.log("判斷電話撥打點擊!!");
            callAgain();
            console.log("電話撥打");
            return;
        }
        // 點擊跳至被回覆訊息
        if (type === 3) {
            scrollPageTo(text.janusMsg.config.replyObj.janusMsg.config.id);
            console.log("跳至回覆訊息");
            return;
        }
        //打開公司頭像
        if (type === 4) {
            showCompanyInfo({
                ...eventInfo.value,
                eventKey: route.params.eventKey,
            });
            console.log("打開公司頭像!!");
            return;
        }
        // 檔案預覽
        if (type === 5) {
            if (
                text.janusMsg.format.FileSize > 10000000 &&
                text.janusMsg.format.ExtensionName !== ".pdf"
            ) {
                alert("檔案太大,無法預覽");
                return;
            }
            filePreviewModal.value = true;
            previewFileFormat.value = text.janusMsg.format;
            console.log("檔案預覽", text.janusMsg.format);
        }
    }
    return false;
};
//丟給檔案預覽的props
const previewFileFormat = ref(null);
const viewPictureComputer = (fileid?, text?, text2?) => {
    //第二個參數轉給回覆訊息用
    if (typeof fileid === "number") {
        previewURL(fileid, text2);
    }
    // 點擊跳至被回覆訊息
    if (text) {
        scrollPageTo(text.janusMsg?.config.replyObj.janusMsg.config.id);
    }
};

//拖拽上傳
const dropActive = ref(false);
const files = ref();
const dropEvent = (e: any) => {
    dropActive.value = false;
    e.stopPropagation();
    e.preventDefault();
    onUploadFile(e.dataTransfer.files);
};
//上傳檔案
const dropFiles = ref();
const image = ref();
const imageReload = ref(0);
const onUploadFile = async (file: any) => {
    const fileArr = file[0];
    const fileArrType = file[0].type;
    const fileName = fileArr.name;
    if (!fileArr) {
        return;
    }
    //辨識上傳檔案
    if (fileArrType.includes("image")) {
        if (fileName.split(".").pop() === "gif") {
            console.log("gif 圖檔!!!");
            // console.log("file.name:", fileArr);
            fd.append("file", new File([fileArr], fileArr.name, { type: "image/*" }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/file/${route.params.eventKey}`,
                data: fd,
                headers: { Authorization: `Bearer ${signature}` },
            })
                .then((res) => {
                    console.log("img res:", res);
                    const reader = new FileReader();
                    reader.readAsDataURL(fileArr);
                    reader.onload = async (e: any) => {
                        let image = new Image();
                        image.src = e.target.result;
                        image.onload = function () {
                            const imageObj: any = {
                                janusMsg: {
                                    chatroomID: chatroomID(route.params.eventKey),
                                    eventID: Number(eventID(route.params.eventKey)),
                                    msgType: 6,
                                    sender: 1, // 0:客服, 1:使用者
                                    msgContent: "",
                                    time: unixTime(),
                                    type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                    userName: "",
                                    format: {
                                        Fileid: res.data.fileid,
                                        ShowName: fileName,
                                        ExtensionName: res.data.ext,
                                        FileSize: fileArr.size,
                                        width: image.width,
                                        height: image.height,
                                        expirationDate: dayjs
                                            .unix(res.data.exp)
                                            .format("YYYY-MM-DD"),
                                    },
                                    config: {
                                        id: nanoid(),
                                        isReply: replyMsg.value ? true : false,
                                        replyObj: replyMsg.value || {},
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                    },
                                },
                            };
                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                eventKey: route.params.eventKey,
                                msgParticipantList: participantList.value,
                                eventID: Number(eventID(route.params.eventKey)),
                            };
                            if (chatroomType.value === 0) {
                                sendPrivateMsg(sendMsgObj);
                            } else {
                                sendGroupMsg(sendMsgObj);
                            }
                        };
                    };
                })
                .catch((err) => {
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                    bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                    bugout.value.error(
                        `error-log${route.params.eventKey}`,
                        err.response.request.responseURL
                    );
                    console.error(err);
                });
        } else {
            console.log("圖檔 非gif!!!");
            new Compressor(fileArr, {
                quality: 0.6,
                async success(result) {
                    //呼叫api
                    const fd = new FormData();
                    console.log("file.name:", fileArr);
                    fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                    await axios({
                        method: "post",
                        url: `${config.serverUrl}/file/${route.params.eventKey}`,
                        data: fd,
                        headers: { Authorization: `Bearer ${signature}` },
                    })
                        .then((res) => {
                            console.log("img res:", res);
                            const reader = new FileReader();
                            reader.readAsDataURL(fileArr);
                            reader.onload = async (e: any) => {
                                let image = new Image();
                                image.src = e.target.result;
                                image.onload = function () {
                                    const imageObj: any = {
                                        janusMsg: {
                                            chatroomID: chatroomID(route.params.eventKey),
                                            eventID: Number(eventID(route.params.eventKey)),
                                            msgType: 6,
                                            sender: 1, // 0:客服, 1:使用者
                                            msgContent: "",
                                            time: unixTime(),
                                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                                            userName: "",
                                            format: {
                                                Fileid: res.data.fileid,
                                                ShowName: fileName,
                                                ExtensionName: res.data.ext,
                                                FileSize: fileArr.size,
                                                width: image.width,
                                                height: image.height,
                                                expirationDate: dayjs
                                                    .unix(res.data.exp)
                                                    .format("YYYY-MM-DD"),
                                            },
                                            config: {
                                                id: nanoid(),
                                                isReply: replyMsg.value ? true : false,
                                                replyObj: replyMsg.value || {},
                                                currentDate: currentDate(),
                                                isExpire: false,
                                                isPlay: false,
                                                isRead: false,
                                                msgFunctionStatus: false,
                                                msgMoreStatus: false,
                                                recallPopUp: false,
                                                recallStatus: false,
                                            },
                                        },
                                    };
                                    const sendMsgObj = {
                                        msg: imageObj,
                                        textPlugin: textPlugin.value,
                                        eventKey: route.params.eventKey,
                                        msgParticipantList: participantList.value,
                                        eventID: Number(eventID(route.params.eventKey)),
                                    };
                                    if (chatroomType.value === 0) {
                                        sendPrivateMsg(sendMsgObj);
                                    } else {
                                        sendGroupMsg(sendMsgObj);
                                    }
                                };
                            };
                        })
                        .catch((err) => {
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.status
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.data
                            );
                            bugout.value.error(
                                `error-log${route.params.eventKey}`,
                                err.response.request.responseURL
                            );
                            console.error(err);
                        });
                },
                error(err) {
                    console.error(err);
                },
            });
        }
    } else {
        const fd = new FormData();
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

        axios({
            method: "post",
            url: `${config.serverUrl}/file/${route.params.eventKey}`,
            data: fd,
            headers: { Authorization: `Bearer ${signature}` },
        })
            .then((res) => {
                console.log("上傳 res:", res);
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    dropFiles.value = e.target.result;
                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            chatroomID: chatroomID(route.params.eventKey),
                            eventID: Number(eventID(route.params.eventKey)),
                            msgType: 7,
                            sender: 1, // 0:客服, 1:使用者
                            msgContent: "",
                            time: unixTime(),
                            type: chatroomType.value === 0 ? 2 : 3, //1:簡訊 2: 文字 3:群聊
                            userName: "",
                            format: {
                                Fileid: res.data.fileid,
                                ShowName: fileArr.name,
                                ExtensionName: res.data.ext,
                                FileSize: fileArr.size,
                                expirationDate: dayjs.unix(res.data.exp).format("YYYY-MM-DD"),
                            },
                            config: {
                                id: nanoid(),
                                isReply: false,
                                replyObj: {},
                                currentDate: currentDate(),
                                isExpire: false,
                                isPlay: false,
                                isRead: false,
                                msgFunctionStatus: false,
                                msgMoreStatus: false,
                                recallPopUp: false,
                                recallStatus: false,
                            },
                        },
                    };

                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        eventKey: route.params.eventKey,
                        msgParticipantList: participantList.value,
                        eventID: Number(eventID(route.params.eventKey)),
                    };
                    if (chatroomType.value === 0) {
                        sendPrivateMsg(sendMsgObj);
                    } else {
                        sendGroupMsg(sendMsgObj);
                    }
                };
            })
            .catch((err) => {
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.status);
                bugout.value.error(`error-log${route.params.eventKey}`, err.response.data);
                bugout.value.error(
                    `error-log${route.params.eventKey}`,
                    err.response.request.responseURL
                );
                console.error(err);
            });
    }
};
onMounted(() => {
    //拖拽上傳
    let dropArea = document.getElementById("drop-area");
    dropArea?.addEventListener("drop", dropEvent, false);
    dropArea?.addEventListener("dragleave", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = false;
    });
    dropArea?.addEventListener("dragenter", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = true;
    });
    dropArea?.addEventListener("dragover", (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dropActive.value = true;
    });
});

const track: any = ref(null);
const trackID: any = ref("");
const oldMsg: any = ref({});
const newTime: any = ref("0:00");
const toggleAudio = (msg: any) => {
    //第一次播放錄音 或 暫停錄音
    if (track.value === null || trackID.value === msg.janusMsg.config.id) {
        trackID.value = msg.janusMsg.config.id;
        track.value = document.getElementById(`audio-player-${msg.janusMsg.config.id}`);
        oldMsg.value = msg;
        if (track.value.paused) {
            track.value.play();
            // console.log(track.value);
            // console.log("currentTime.value:", track.value.currentTime);
            // console.log("play.paused:", track.value.paused);
            msg.janusMsg.config.isPlay = true;
            track.value.addEventListener(
                "timeupdate",
                () => {
                    if (track.value !== null) {
                        newTime.value = convertTime(track.value.currentTime);
                    }
                },
                false
            );
            track.value.addEventListener(
                "ended",
                () => {
                    if (track.value !== null) {
                        track.value.pause();
                        track.value.currentTime = 0;
                        newTime.value = "0:00";
                        oldMsg.value.janusMsg.config.isPlay = false;
                    }
                    track.value = null;
                },
                false
            );
        } else {
            track.value.pause();
            track.value.currentTime = 0;
            newTime.value = "0:00";
            // console.log("pause.paused:", track.value.paused);
            oldMsg.value.janusMsg.config.isPlay = false;
            track.value = null;
        }
    } else if (trackID.value !== msg.janusMsg.config.id) {
        //點擊其他錄音檔 原先暫停 播新的錄音檔
        track.value.pause();
        track.value.currentTime = 0;
        newTime.value = "0:00";
        oldMsg.value.janusMsg.config.isPlay = false;
        oldMsg.value = msg;
        trackID.value = msg.janusMsg.config.id;
        track.value = document.getElementById(`audio-player-${msg.janusMsg.config.id}`);
        track.value.play();
        // console.log(track.value);
        // console.log("currentTime.value:", track.value.currentTime);
        // console.log("play.paused:", track.value.paused);
        msg.janusMsg.config.isPlay = true;
        track.value.addEventListener(
            "timeupdate",
            () => {
                if (track.value !== null) {
                    newTime.value = convertTime(track.value.currentTime);
                }
            },
            false
        );
        track.value.addEventListener(
            "ended",
            () => {
                if (track.value !== null) {
                    track.value.pause();
                    track.value.currentTime = 0;
                    newTime.value = "0:00";
                    msg.janusMsg.config.isPlay = false;
                }
                track.value = null;
            },
            false
        );
    }
};

const chatroomScrolltop = ref(0);
const chatroomWindowHeight = ref(0);
const chatroomScrolltopAndWindowHeight = ref(0);
const chatroomScrollHeight = ref(0);

const chatroomToBottom = (e: any) => {
    chatroomScrolltop.value = e.target.scrollTop;
    chatroomWindowHeight.value = e.target.clientHeight;
    chatroomScrollHeight.value = e.target.scrollHeight;
    chatroomScrolltopAndWindowHeight.value = chatroomScrolltop.value + chatroomWindowHeight.value;
    chatStore.saveChatroomParams(
        chatroomScrolltop.value,
        chatroomWindowHeight.value,
        chatroomScrolltopAndWindowHeight.value,
        chatroomScrollHeight.value
    );
};
// 研究判斷每則訊息是否接近窗口底部
// onUpdated(() => {
//     const dialogBoxDom = document.querySelectorAll(".dialog-box");
//     dialogBoxDom.forEach((dialog) => {
//         console.log("每個 dialog 距離頂部的問題", dialog.offsetTop);
//     });
// });

//聊天室置底功能
const scrollTop = ref(0);
const offsetHeight = ref(0);
const scrollHeight: any = ref(0);

onUpdated(() => {
    scrollHeight.value = findScrollHeight.value.scrollHeight;
    scrollTop.value = findScrollHeight.value.scrollTop;
    offsetHeight.value = findScrollHeight.value.offsetHeight;
});
watch([scrollHeight, scrollTop, offsetHeight], (newVal) => {
    if (newVal[0] - newVal[1] < newVal[2] + 10) {
        newMsgHint.value = false;
    }
});

//重新編輯
const reEdit = (id: string): void => {
    messages.value.forEach((text: txt) => {
        if (text.janusMsg.config.id === id) {
            msg.value = text.janusMsg.msgContent;
        }
    });
};
//複製訊息
const { toClipboard } = useClipboard();
const copyMsg = async (text: any) => {
    try {
        await toClipboard(text.janusMsg.msgContent);
    } catch (e) {
        console.error(e);
    }
    text.janusMsg.config.msgFunctionStatus = false;
};

//開啟訊息功能泡泡
const openFunctionBox = (text: txt): void => {
    //先全部清空class
    const ele = document.querySelectorAll(".timestamp");
    ele.forEach((item, i, arr) => {
        item.offsetParent.offsetParent.children[0].children[i].classList.remove("lastMsg");
    });
    //判斷訊息功能框的方向
    const timeDOM = document.getElementById(text.janusMsg.config.id + "time");
    const addClassDOM = document.getElementById(text.janusMsg.config.id);
    if (timeDOM.getBoundingClientRect().top > document.body.clientHeight * 0.7) {
        addClassDOM.classList.add("lastMsg");
    }
    //訊息功能框開關
    messages.value.forEach((item: txt) => {
        if (item === text) {
            text.janusMsg.config.msgFunctionStatus = !text.janusMsg.config.msgFunctionStatus;
        } else {
            item.janusMsg.config.msgFunctionStatus = false;
        }
    });
};
// const fileDownPage = ref(null);

//下載圖片
onMounted(() => {
    // fileDownPage.value.addEventListener("load", function (e) {
    //     try {
    //         throw e;
    //     } catch (error) {
    //         console.log("iframe loading error", JSON.stringify(error));
    //         alert(`檔案無法下載,錯誤訊息為${JSON.stringify(error)}`);
    //     }
    // });
});
const downloadImage = async (text: txt) => {
    await axios({
        method: "get",
        url: `${config.serverUrl}/file/${route.params.eventKey}/${text.janusMsg.format.Fileid}`,
        responseType: "blob",
    })
        .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", text.janusMsg.format.ShowName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            console.log("下載圖片成功!!");
        })
        .catch((err) => {
            alert("下載失敗,請稍後再試!!");
        });
    text.janusMsg.config.msgFunctionStatus = false;
};

//收回訊息
const recallMsg = (msg): void => {
    messages.value.forEach((text: txt) => {
        if (text.janusMsg.config.id === msg.janusMsg.config.id) {
            text.janusMsg.config.recallStatus = true;
        }
        if (
            text.janusMsg.config.isReply &&
            text.janusMsg.config.replyObj.janusMsg.config.id === msg.janusMsg.config.id
        ) {
            text.janusMsg.config.replyObj.janusMsg.config.recallStatus = true;
        }
    });
    //更改local 狀態
    localStorageMsg(messages.value, route.params.eventKey);
    //如果收回訊息為圖片,影片,檔案 更新圖庫狀態
    if ([6, 7, 11].includes(msg.janusMsg.msgType)) {
        pictures.value.forEach((pic) => {
            if (pic.janusMsg.config.id === msg.janusMsg.config.id) {
                pic.janusMsg.config.recallStatus = true;
            }
        });
        localStorage.setItem(`${route.params.eventKey}-pictures`, JSON.stringify(pictures.value));
    }
    //更改最後一筆訊息
    let lastMessage = messages.value
        .filter((msg) => {
            return msg.janusMsg.config.recallStatus === false;
        })
        .pop();
    // console.log("收回後存的最後一筆訊息", lastMessage);
    localStorage.setItem(`${route.params.eventKey}-lastMessage`, JSON.stringify(lastMessage));
    recallAPI(msg, route.params.eventKey);
};

//收回彈窗
const confirmRecallPopup = (text: txt): void => {
    messages.value.forEach((item: txt) => {
        if (item.janusMsg.config.id === text.janusMsg.config.id) {
            text.janusMsg.config.msgFunctionStatus = false;
            item.janusMsg.config.recallPopUp = !item.janusMsg.config.recallPopUp;
        }
        if (
            item.janusMsg.config.isReply &&
            item.janusMsg.config.replyObj.janusMsg.config.id === text.janusMsg.config.id
        ) {
            item.janusMsg.config.replyObj.janusMsg.config.recallPopUp =
                !item.janusMsg.config.replyObj.janusMsg.config.recallPopUp;
        }
    });
};

// 圖片展示
const previewURL = (fileid: string, text: any): void => {
    console.log("fileid", fileid);
    pictures.value.forEach((img: any) => {
        if (
            !viewImgs.value.includes(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            ) &&
            img.janusMsg.msgType === 6
        ) {
            viewImgs.value.push(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            );
        }
    });
    const getSplit = isProduction || isStaging ? 3 : 4;
    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[getSplit].split(".")[0]))
        .indexOf(Number(fileid));
    viewerApi({
        options: {
            initialViewIndex: viewIndex,
            movable: false,
            scalable: false,
            className: "v-wrap",
            viewed(e) {
                const fileName = e.detail.originalImage.currentSrc.split("/").pop();
                const wrap = document.getElementsByClassName("v-wrap");
                const div = document.createElement("div");
                const a = document.createElement("a");
                // a.href = `${config.serverUrl}/file/${route.params.eventKey}/${fileid}`;
                // a.target = "_blank";
                // a.download = fileName;
                a.className = "download";
                a.innerHTML = `<span class="downloadImg"></span>`;
                console.log("viewapi", text);
                if (!text.janusMsg.config.isWelcomeMsg) {
                    console.log("不是預設訊息!!");
                    dayjs().isBefore(dayjs(text.janusMsg.format.expirationDate))
                        ? wrap[0].appendChild(div).appendChild(a)
                        : null;
                } else {
                    wrap[0].appendChild(div).appendChild(a);
                    console.log("預設訊息!!");
                }
                a.addEventListener("touchend", () => {
                    downloadImage(text);
                    // fileDownPage.value.src = `${config.serverUrl}/file/${route.params.eventKey}/${fileid}`;
                });
                a.addEventListener("click", () => {
                    downloadImage(text);
                    // fileDownPage.value.src = `${config.serverUrl}/file/${route.params.eventKey}/${fileid}`;
                });
            },
        },
        images: viewImgs.value,
    });
};

//default pic  for ios video
const iosVideoDefaultTag = ref("#t=0.1");
//更改naive-ui 套件主題
const themeOverrides = {
    common: {},
    Checkbox: {
        size: "25px",
        colorChecked: "#01bad4",
        borderRadius: "50%",
        border: "2px solid #01bad4",
        borderChecked: "2px solid #01bad4",
        borderFocus: "2px solid #01bad4",
        boxShadowFocus: "0 0 0 1px #01bad4",
    },
};
// 自定義置底按鈕位置/輸入框高度差的屬性
const diffHeight = computed(() => {
    console.log("是否打開了貼圖:", chatStore.showStickerModal);
    console.log("是否打開了麥克風:", chatStore.showRecorderModal);
    if (chatroomType.value === 0 && eventInfo.value?.dialogue === 1) {
        return {
            "--diffHeight": 10 + "px",
        };
    } else {
        let originalHeight = 70;
        if (chatStore.showStickerModal && !chatStore.showRecorderModal) {
            originalHeight = 286;
        } else if (!chatStore.showStickerModal && chatStore.showRecorderModal) {
            originalHeight = 212;
        }

        return {
            "--diffHeight": originalHeight + chatStore.diffHeight + "px",
        };
    }
});
// 自定義信息框高度差的屬性
const messageOffset = computed(() => {
    console.log("是否打開了貼圖:", chatStore.showStickerModal);
    console.log("是否打開了麥克風:", chatStore.showRecorderModal);
    if (chatroomType.value === 0 && eventInfo.value?.dialogue === 1) {
        return {
            "--messageOffset": 0 + "px",
        };
    } else {
        let originalHeight = 67;
        if (chatStore.showStickerModal && !chatStore.showRecorderModal) {
            originalHeight = 280;
            chatStore.backToTheOrigialDiffHeight();
        } else if (!chatStore.showStickerModal && chatStore.showRecorderModal) {
            originalHeight = 206;
            chatStore.backToTheOrigialDiffHeight();
        }

        console.log(originalHeight);
        return {
            "--messageOffset": originalHeight + chatStore.diffHeight + "px",
        };
    }
});
// 群聊後台人員資訊
const innerPeopleInfo = computed(() => internalPeopleList.value);
// 群聊其他user資訊
const outterPeopleInfo = computed(() => externalPeopleList.value);
// 群聊已讀數
// const groupChatReadNum = computed(() => {
//     // const finalMsg = messages.value[messages.value?.length - 1];
//     return finalMsg.janusMsg.config.groupReadNum;
// });
// 更新群組聊天成員的已讀數
const updateGroupMemberReadStatus = (groupList, participantList) => {
    nextTick(() => {
        let myGroupReadNum = 0;
        // 自定義participantList結構
        const tmpParticipantList = [];
        // 監聽watch傳進來的的now
        if (Array.isArray(participantList)) {
            for (const participant of participantList) {
                const data = {};
                data["id"] = participant;
                data["onlineTime"] = parseInt((Date.now() / 1000).toFixed(0));
                data["isRead"] = false;
                data["isMySelf"] = false;
                tmpParticipantList.push(data);
            }
        } else if (typeof participantList === "object") {
            for (const participant of participantList.value) {
                const data = {};
                data["id"] = participant;
                data["onlineTime"] = parseInt((Date.now() / 1000).toFixed(0));
                data["isRead"] = false;
                data["isMySelf"] = false;
                tmpParticipantList.push(data);
            }
        }
        // 標記
        for (let i = 0; i < groupList.value.length; i++) {
            for (let j = 0; j < tmpParticipantList.length; j++) {
                if (
                    groupList.value[i].id === tmpParticipantList[j].id &&
                    groupList.value[i]["onlineTime"] < tmpParticipantList[j].onlineTime
                ) {
                    tmpParticipantList[j].isRead = true;
                }
                if (tmpParticipantList[j].id === chatroomID(route.params.eventKey)) {
                    tmpParticipantList[j].isMySelf = true;
                }
            }
        }
        // deepCopy
        const myParticipantList = [];
        for (const item of tmpParticipantList) {
            myParticipantList.push(JSON.parse(JSON.stringify(item)));
        }
        // final check
        for (const item of myParticipantList) {
            groupReadList.value = myParticipantList;
            if (item.isRead && !item.isMySelf) {
                // 群聊已讀數
                myGroupReadNum += 1;
            }
        }

        console.log("cc端群聊參與者: ", myParticipantList);
        console.log("cc端群聊已讀數(扣掉自己):" + myGroupReadNum);
        groupReadNum.value = myGroupReadNum;
    });
};
// 當前在線清單
const currParticipantList = ref([]);
// 即時更新已讀數
const updateRealGroupReadNum = (currParticipantList) => {
    // console.log('messages: ', messages.value);
    // 若沒有groupReadNum，則return
    const tmpMsgKeyList = [];
    for (const msg of messages.value) {
        // console.log('msg', msg.janusMsg.config);
        for (const key in msg.janusMsg.config) {
            tmpMsgKeyList.push(key);
        }
    }
    if (!tmpMsgKeyList.includes("groupReadNum") && !tmpMsgKeyList.includes("groupReadList")) {
        return;
    }
    // 取出最後1個元素
    const finalMsg = messages.value[messages.value.length - 1];
    const tmpGroupReadList = [];
    for (const curr of currParticipantList.value) {
        if (curr !== chatroomID(route.params.eventKey)) tmpGroupReadList.push(curr);
    }
    console.log("currParticipantList ", tmpGroupReadList);
    finalMsg.janusMsg.config.groupReadNum = tmpGroupReadList.length;
};
// 監聽participantList
watch(
    participantList,
    (now, old) => {
        // 合併now和old，再去重
        let nowList = now.concat(old);
        const nowTmpList = [];
        for (const nowItem of nowList) {
            if (!nowTmpList.includes(nowItem)) {
                nowTmpList.push(nowItem);
            }
        }
        currParticipantList.value = nowTmpList;
        // 即時更新已讀數
        updateRealGroupReadNum(currParticipantList);
    },
    {
        deep: true,
        immediate: true,
    }
);
//
// 每秒刷新已读数
// onMounted(() => {
//     // glGroupReadNum = 0;
//     setInterval(() => {
//         setTimeout(() => {
//             updateGroupMemberReadStatus(groupMemberVisitTimeInfoList, participantList);
//         }, 0);
//     }, 10000);
// });
// // 鏈接預覽
// const urlTitle = ref("");
// const desc = ref("");
// const imageUrl = ref("");
// const url = ref("");
// const alter = (textContent) => {
//     const reg =
//         /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
//     if (textContent !== "") {
//         if (reg.test(textContent)) {
//             console.log("判定此文字為連結!!");
//             url.value = textContent;
//             console.log("url連結", url.value);
//             if (url.value.substring(0, 4) !== "http") {
//                 url.value = "https://" + url.value;
//             }
//             // todo 調用接口，傳入url
//             // console.log("打預覽連接api!!");
//             // previewLink(url.value, route.params.eventKey);
//             // urlTitle.value = "YouTube(測試用)";
//             // desc.value =
//             //     "在YouTube上盡情享受自己喜愛的影片和音樂、上傳原創內容，並與親朋好友和全世界觀眾分享你的影片。";
//             // imageUrl.value = "https://www.youtube.com/img/desktop/yt_1200.png";
//             // console.log("正確的url: ", textContent, urlTitle);
//             if (urlTitle.value && desc.value && imageUrl.value) {
//                 return `<span>${urlTitle.value}</span><div><span>${desc.value}</span><span><img src="${imageUrl.value}" width="50" height="50"></span></div>`;
//             }
//             return `${textContent}`;
//         }
//         // console.log("不是url: ", textContent, urlTitle);
//     }
// };
</script>
<style lang="scss">
@import "~@/assets/scss/var";
// 圖片預覽套件下載按鈕
.download {
    position: fixed;
    left: 350px;
    top: 0;
    width: 40px;
    height: 40px;
    outline: none;
    a {
        display: block;
        width: 40px;
        height: 40px;
        outline: none;
    }
    .downloadImg {
        display: block;
        background: url("~@/assets/Images/common/download.svg");
        background-color: rgba(0, 0, 0, 0.8);
        background-size: 95% auto;
        width: 40px;
        height: 40px;
        border: 0;
        outline: none;
    }
}
@media (max-width: 768px) {
    .download {
        left: 0;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
@keyframes shakeX {
    from,
    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        -webkit-transform: translate3d(-3px, 0, 0);
        transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        -webkit-transform: translate3d(3px, 0, 0);
        transform: translate3d(5px, 0, 0);
    }
}
@-webkit-keyframes shakeX {
    from,
    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        -webkit-transform: translate3d(-3px, 0, 0);
        transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        -webkit-transform: translate3d(3px, 0, 0);
        transform: translate3d(5px, 0, 0);
    }
}
* {
    // -webkit-touch-callout: none;
    // -webkit-user-select: none;
    // -khtml-user-select: none;
    // -moz-user-select: none;
    // -ms-user-select: none;
    // user-select: none;
}

//收回訊息確認的彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 330px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 20px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .recallMsgConfirm {
            font-size: $font-size-18;
            color: $gray-1;
            letter-spacing: -0.1px;
            min-width: 342px;
            text-align: left;
            line-height: 22px;
        }
        .buttonContainer {
            margin-top: 20px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            & .cancel {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-18;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $white;
                color: $gray-5;
                margin-right: 16px;
                &:hover,
                &:active {
                    background: $gray-4;
                    color: $white;
                }
            }
            & .confirm {
                border-radius: 100px;
                padding: 6px 16px;
                cursor: pointer;
                font-size: $font-size-18;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $primary-2;
                color: $white;
                &:hover,
                &:active {
                    background-color: $primary-1;
                }
            }
        }
    }
}
@media (max-width: 768px) {
    .mask {
        left: 0;
    }
}

.animate__shakeX {
    animation: shakeX;
    -webkit-animation: shakeX;
    animation-duration: 900ms;
    -webkit-animation-duration: shakeX;
}
.card {
    width: 300px;
    .n-card > .n-card__content,
    .n-card > .n-card__footer {
        --padding-left: 0;
        padding: 0 var(--padding-left);
    }
    .userPhoto {
        margin-bottom: 1em;
        text-align: center;
    }
    .userName {
        text-align: center;
        font-size: $font-size-20;
    }
    .description {
        width: 80%;
        text-align: center;
        margin: 1em auto;
        color: $gray-3;
        font-size: $font-size-15;
        line-height: 1.6;
    }
}
.chatroom-inner {
    width: 100%;
    position: absolute;
    top: 120px;
    // bottom: 67px;
    bottom: var(--messageOffset);
    overflow-y: scroll;
    height: auto;
    background-color: $gray-8;
    padding-top: 0;
}
.dialog-box {
    // display: flex;
    // justify-content: flex-end;
    padding: 10px 15px;
    &.mobileMsg {
        &:hover {
            .dialog {
                .dialog-inner {
                    .msg_more {
                        display: none;
                    }
                }
            }
        }
    }
    &:hover {
        .dialog {
            .dialog-inner {
                .msg_more {
                    display: inline-block;
                }
            }
        }
        @media (max-width: 768px) {
            .dialog {
                .dialog-inner {
                    .msg_more {
                        display: none;
                    }
                }
            }
        }
    }
    &.delChoice {
        justify-content: space-between;
        .deleteCheckBox {
            margin-right: 12px;
            .n-checkbox .n-checkbox-box {
                --size: 20px;
                height: var(--size);
                width: var(--size);
            }
        }
    }
    &.recallChoice,
    &.recallChoice.otherMsg {
        justify-content: center;
    }
    &.myMsg {
        text-align: right;
        &.dateMsg {
            display: block;
        }
    }
    &.otherMsg {
        justify-content: flex-start;

        &.dateMsg {
            display: block;
        }
        .dialog {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .dialog-inner {
                .msgFunction {
                    left: initial;
                    right: 0px;
                    top: 30px;
                }
                .avatar {
                    margin-right: 10px;
                    .n-avatar {
                        cursor: pointer;
                    }
                }
                .content {
                    border-radius: 5px 20px 20px 20px;
                    margin-left: 0px;
                    margin-right: 10px;
                    background-color: $gray-7;
                }

                .msg_more {
                    left: initial;
                    right: -80px;
                }
            }
        }
    }
    &.lastMsg {
        .dialog {
            .dialog-inner {
                .msgFunction {
                    top: -60px;
                    bottom: auto;
                }
            }
        }
    }
    &.smsMsg {
        .dialog {
            .dialog-inner {
                .content {
                    background-color: #ffdfcf;
                }
            }
        }
    }
    @media (max-width: 768px) {
        &.otherMsg {
            .dialog {
                .dialog-inner {
                    .msgFunction {
                        right: 0;
                        top: inherit;
                        bottom: -50px;
                    }
                }
            }
        }
        &.lastMsg {
            .dialog {
                .dialog-inner {
                    .msgFunction {
                        right: 0;
                        top: -25px;
                        bottom: auto;
                    }
                }
            }
        }
    }

    &.dateMsg {
        .date {
            display: block;
            margin-bottom: 20px;
            div {
                max-width: 110px;
                height: 27px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px 10px;
                background-color: $gray-1;
                opacity: 0.3;
                color: $white;
                font-size: $font-size-12;
                border-radius: 14px;
                span {
                    cursor: pointer;
                }
            }
        }
    }

    .recall {
        padding: 10px 14px;
        div {
            width: 210px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            padding: 3px 10px;
            background-color: rgba(65, 73, 78, 0.2);
            color: $gray-3;
            border-radius: 100px;
            p {
                font-size: $font-size-14;
                line-height: 16px;
            }
            span {
                cursor: pointer;
            }
        }
    }
    .dialog {
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
        position: relative;
        // align-items: center;
        .resendMsg {
            width: 20px;
            height: 20px;
            margin-left: 5px;
        }
        .dialog-inner {
            display: inline-flex;
            justify-content: flex-end;
            position: relative;
            .msgFunction {
                &.mobile {
                    display: none;
                }
                cursor: pointer;
                position: absolute;
                box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                border-radius: 4px;
                top: 30px;
                left: 5px;
                z-index: 1;
                .ulList {
                    border-radius: 4px;
                    background-color: $primary-4;
                    li {
                        width: 63px;
                        height: 40px;
                        padding: 10px 15px 9px 15px;
                        text-align: center;
                        display: block;
                        color: $gray-1;
                        border-bottom: 1px solid $white;
                        span {
                            font-size: $font-size-16;
                            font-weight: 500;
                        }
                        a {
                            font-size: $font-size-16;
                            font-weight: 500;
                            color: $gray-1;
                            text-decoration: none;
                        }
                    }
                    li:last-child {
                        border-bottom: 0px;
                    }
                }
            }

            .msg_more {
                display: none;
                cursor: pointer;
                transition: 0.2s;
                position: absolute;
                left: -80px;
                bottom: 0;

                img {
                    display: inline-block;
                    width: 20px;
                }
                &.show {
                    display: inline-block;
                }
            }

            @media (max-width: 768px) {
                .msg_more {
                    display: none;
                    &.show {
                        display: none;
                    }
                }
                .msgFunction {
                    &.mobile {
                        display: inline-table;
                    }
                    position: absolute;
                    box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                    border-radius: 4px;
                    top: inherit;
                    bottom: -50px;
                    left: inherit;
                    right: 0;
                    z-index: 1;
                    .ulList {
                        display: flex;
                        border-radius: 4px;
                        background-color: $primary-4;
                        li {
                            width: 58px;
                            height: 40px;
                            padding: 10px 9px 10px 10px;
                            text-align: center;
                            display: block;
                            color: $gray-1;
                            border-right: 1px solid $white;
                            border-bottom: 0;
                            span {
                                font-size: $font-size-16;
                                font-weight: 500;
                            }
                            a {
                                display: block;
                                font-size: $font-size-16;
                                font-weight: 500;
                                color: $gray-1;
                                text-decoration: none;
                            }
                        }
                        li:last-child {
                            border-right: 0px;
                        }
                    }
                }
            }
            .content {
                max-width: 800px;
                word-wrap: break-word;
                word-break: break-all;
                white-space: pre-wrap;
                background-color: $primary-2;
                border-radius: 20px 5px 20px 20px;
                padding: 10px;
                text-align: left;
                align-items: center;
                flex-direction: column;
                line-height: 1.5;
                margin-left: 5px;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;

                &.reply {
                    min-width: 70px;
                }
                &.textMsgSelect {
                    -webkit-touch-callout: text;
                    -webkit-user-select: text;
                    -khtml-user-select: text;
                    -moz-user-select: text;
                    -ms-user-select: text;
                    user-select: text;
                }
                &.samePeople {
                    margin-left: 40px;
                }
                &.audio {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: row;
                    width: 165px;
                    &.play {
                        justify-content: flex-start;
                        span {
                            margin-left: 10%;
                        }
                    }
                    .n-icon {
                        margin-right: 10px;
                    }
                    .totalTime {
                        font-size: $font-size-16;
                        font-weight: 500;
                        margin-right: 10px;
                    }
                    .audioWave {
                        width: 55px;
                        height: 20px;
                        margin-right: 5px;
                    }
                }
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
                &.phoneMsg {
                    height: 57px;
                    > a.phone {
                        display: none;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        text-decoration: none;
                        .phonePic {
                            margin-right: 10px;
                        }
                        .phoneStatus {
                            h4 {
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
                    @media (max-width: 768px) {
                        > a.phone {
                            display: flex;
                        }
                    }
                    > a.phone-web {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        text-decoration: none;
                        cursor: pointer;
                        .phonePic {
                            margin-right: 10px;
                        }
                        .phoneStatus {
                            h4 {
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
            }
            .originalMsg {
                font-size: $font-size-16;
                font-weight: normal;
                color: $gray-1;
                display: flex;
                flex-direction: column;
                // justify-content: flex-start;
                line-height: 1.3;
                user-select: auto;
            }

            .replyMsg {
                font-size: $font-size-16;
                color: #a37f29;
                margin-left: -10px;
                margin-right: -10px;
                margin-bottom: 8px;
                padding-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                line-height: 1.5;
                border-bottom: 1px solid $primary-4;
                &:hover {
                    cursor: pointer;
                }
                &.noMsgClick {
                    cursor: text;
                }
                .info {
                    max-width: 168px;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                    font-size: $font-size-12;
                    padding-left: 10px;
                    margin-right: 5px;
                    &.noMsg {
                        color: $gray-2;
                    }
                    &.isImg {
                        min-width: 60px;
                    }
                }
                .userName {
                    font-weight: 900;
                    font-size: $font-size-16;
                }
                .replyImg {
                    width: 50%;
                    height: 30%;
                    padding-right: 10px;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    max-width: 150px;
                    object-fit: cover;
                }
            }
            .sticker {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 150px;
                height: 150px;
                margin-left: 10px;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                line-height: 148px;
                white-space: nowrap;
                text-align: center;
                img {
                    width: 100%;
                }
                &.samePeople {
                    margin-left: 40px;
                }
            }
            .picture {
                margin-left: 10px;
                margin-right: 10px;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                max-width: 250px;
                max-height: 300px;
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
                // background-color: $white;
                &:hover {
                    cursor: pointer;
                }
                &:after {
                    content: ".";
                    font-size: 0;
                    -webkit-text-size-adjust: none;
                }
                &.samePeople {
                    margin-left: 40px;
                }
                img {
                    vertical-align: middle;
                    max-width: 200px;
                    max-height: 250px;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            }
            video {
                &.samePeople {
                    margin-left: 40px;
                }
            }
            .googleMapsMsg {
                border-radius: 8px;
                a {
                    color: $gray-1;
                    font-size: $font-size-16;
                    text-decoration: none;
                }
                .img {
                    width: 100%;
                    height: 160px;
                    overflow: hidden;
                    display: inline-block;
                    border-radius: 6px;
                }
                img {
                    width: 100%;
                    object-fit: contain;
                }
                &.samePeople {
                    margin-left: 40px;
                }
            }
        }
        @media (max-width: 1300px) {
            .content {
                max-width: 700px !important;
            }
        }
        @media (max-width: 1150px) {
            .content {
                max-width: 550px !important;
            }
        }
        @media (max-width: 1300px) {
            // .msg_more {
            //     left: -80px !important;
            // }
        }

        @media (max-width: 768px) {
            .content {
                max-width: 310px !important;
            }
        }
        .timestamp {
            display: flex;
            flex-direction: column;
            .textMsg {
                color: red;
            }
            span {
                display: block;
                color: $gray-3;
                font-size: $font-size-12;
                font-weight: 400;
                line-height: 17px;
            }
        }
    }
}
.scrollToBottom {
    position: fixed;
    right: 20px;
    // bottom: 70px;
    bottom: var(--diffHeight);
    border-radius: 50%;
    z-index: 1;
    cursor: pointer;
}

@media screen and (max-width: 768px) {
    .chatroom-inner {
        position: fixed;
        top: 80px;
        // bottom: 67px;
        bottom: var(--messageOffset);
        overflow-y: scroll;
        height: auto;
        padding: 0;
        // background-color: purple;
        .background {
            padding-top: 0;
            padding-bottom: 0px;
        }
    }
}
.dropActive {
    background-color: rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 450px) {
    .card {
        width: 90%;
    }
}
</style>
<!-- 鏈接預覽專用 -->
<style>
.urlpreview {
    /* padding-top: 10px; */
    display: flex;
    flex-direction: column;
}
/* .urlpreview > span {
    padding-top: 10px;
    display: inline-block;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.urlpreview div {
    display: flex;
    font-weight: normal;
    align-items: center; */
/* color: blue;
}
.urlpreview div > span:nth-child(1) {
    padding-right: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 45px;
}
.urlpreview img {
    border-radius: 10px;
} */
</style>

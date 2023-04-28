<template>
    <!-- <div
        id="groupChatDropArea"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner notMsg"
        ref="groupChatFindScrollHeight"
        v-if="messageArray.length === 0"
    >
        尚無聊天訊息!!
    </div> -->
    <!-- <n-scrollbar style="max-height: auto"> -->
    <div
        id="groupChatDropArea"
        :class="{ dropActive: dropActive }"
        class="chatroom-inner"
        ref="groupChatFindScrollHeight"
        @click="closeAll"
        @scroll="chatroomToBottom($event)"
        :style="messageOffset"
    >
        <div class="background" v-if="messageArray.length > 0">
            <!-- 對話區塊 -->
            <div
                class="dialog-box"
                :class="{
                    clientMsg: text.janusMsg.userName !== userName,
                    staffMsg: text.janusMsg.userName === userName,
                    noFunctionMsg: [9, 11].includes(text.janusMsg.msgType),
                    delChoice: deleteBoolean,
                    recallMsg:
                        text.janusMsg.config.recallStatus &&
                        text.janusMsg.msgType !== 10 &&
                        text.janusMsg.sender === 0,
                    dateMsg:
                        index === 0 ||
                        (index > 0 &&
                            chDateFormat(text.janusMsg.time) !==
                                chDateFormat(messageArray[index - 1].janusMsg.time)) ||
                        text.janusMsg.config.isUnread,
                    SMSMsg: text.janusMsg.config.isSMS || text.janusMsg.type === 1,
                }"
                v-for="(text, index) in messageArray"
                :key="text.janusMsg.config.id"
                :id="text.janusMsg.config.id"
            >
                <!-- 日期樣板 -->
                <div
                    v-if="
                        (index > 0 &&
                            chDateFormat(text.janusMsg.time) !==
                                chDateFormat(messageArray[index - 1].janusMsg.time)) ||
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
                        text.janusMsg.userName !== '' &&
                        text.janusMsg.userName !== userName &&
                        text.janusMsg.userName !== messageArray[index - 1]?.janusMsg.userName
                    "
                    style="color: #8d8d8d; margin-left: 54px"
                >
                    {{ text.janusMsg.userName || "" }}
                </p>
                <!-- 群聊對方的姓名顯示 C端-->
                <template v-for="people in outterPeopleInfo" :key="people.accountID">
                    <p
                        v-if="
                            text.janusMsg.chatroomID !== '' &&
                            text.janusMsg.chatroomID !==
                                messageArray[index - 1]?.janusMsg.chatroomID &&
                            text.janusMsg.chatroomID === people.accountID
                        "
                        style="color: #8d8d8d; margin-left: 54px"
                    >
                        {{ people.name ? people.name : people.mobile
                        }}<span style="margin-left: 10px; color: #ffb400">(外部人員)</span>
                    </p>
                </template>
                <!-- 對方收回訊息樣板 -->
                <div
                    class="recall"
                    v-if="
                        text.janusMsg.config.recallStatus &&
                        text.janusMsg.msgType !== 10 &&
                        text.janusMsg.sender === 1
                    "
                >
                    <div>
                        <!-- <p v-if="text.janusMsg.sender === 0">
                            您已收回訊息&emsp;
                            <span
                                v-if="text.janusMsg.msgContent"
                                @click="reEdit(text.janusMsg.config.id)"
                            >
                                <u>重新編輯</u>
                            </span>
                        </p> -->
                        <p>對方已收回訊息</p>
                    </div>
                </div>
                <!-- 聊天對話框樣板-->
                <div class="dialog" v-else>
                    <div class="dialog-inner">
                        <!-- 收回訊息滿版 popup 出現 -->
                        <teleport to="body">
                            <div class="mask" v-if="text.janusMsg.config.recallPopUp">
                                <div class="RecallPopUp">
                                    <div class="recallMsgConfirm">您確定要收回訊息嗎 ?</div>
                                    <div class="buttonContainer">
                                        <div
                                            type="button"
                                            class="cancel"
                                            @click.stop="
                                                text.janusMsg.config.recallPopUp =
                                                    !text.janusMsg.config.recallPopUp
                                            "
                                        >
                                            取消
                                        </div>
                                        <div
                                            type="button"
                                            class="confirm"
                                            @click.stop="recallMsg(text)"
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
                            @click.stop="onBubble(text)"
                            v-if="
                                text.janusMsg.msgType !== 10 && !text.janusMsg.config.recallStatus
                            "
                        >
                            <img :src="moreIcon" alt="more" draggable="false" />
                            <!-- 訊息功能框 -->
                            <div
                                class="msgFunction"
                                v-show="text.janusMsg.config.msgFunctionStatus"
                            >
                                <ul class="ulList">
                                    <li
                                        v-if="text.janusMsg.msgType === 1"
                                        @click.stop="copyMsg(text)"
                                    >
                                        <span>複製</span>
                                    </li>
                                    <li
                                        v-if="
                                            (text.janusMsg.type === 3 &&
                                                [6, 7, 11].includes(text.janusMsg.msgType) &&
                                                dayjs().isBefore(
                                                    dayjs(text.janusMsg.format.expirationDate)
                                                )) ||
                                            (text.janusMsg.type === 3 &&
                                                text.janusMsg.config.isWelcomeMsg &&
                                                [6, 7, 11].includes(text.janusMsg.msgType)) ||
                                            (text.janusMsg.type === 3 &&
                                                [6, 7, 11].includes(text.janusMsg.msgType))
                                        "
                                        @click.stop="downloadFile(text)"
                                    >
                                        <span>下載</span>
                                    </li>
                                    <!-- <li @click.stop="deleteQuestion(text)"><span>刪除</span></li> -->
                                    <li
                                        v-if="
                                            text.janusMsg.userName === userName &&
                                            text.janusMsg.type !== 1 &&
                                            parseInt(
                                                (text.janusMsg.time + 120000000000) / 1000000
                                            ) > Date.now() &&
                                            !text.janusMsg.config.isSMS &&
                                            !text.janusMsg.config.isWelcomeMsg
                                        "
                                        @click.stop="confirmRecallPopup(text)"
                                    >
                                        <span>收回</span>
                                    </li>
                                    <li
                                        v-if="
                                            [1, 3, 6].includes(text.janusMsg.msgType) &&
                                            text.janusMsg.type === 3 &&
                                            !text.janusMsg.config.isSMS
                                        "
                                        @click.stop="replyMsgEvent(text)"
                                    >
                                        <span>回覆</span>
                                    </li>
                                    <!-- <li
                                        v-if="
                                            text.janusMsg.sender === 0 &&
                                            text.janusMsg.msgType === 1
                                        "
                                        @click.stop="transferSmsMsg(text)"
                                    >
                                        <span>發送傳統簡訊</span>
                                    </li> -->
                                </ul>
                            </div>
                        </div>
                        <!-- 對方頭像 -->
                        <!-- 內部人員 -->
                        <template v-for="people in innerPeopleInfo" :key="people.accountID">
                            <div
                                class="avatar"
                                v-if="
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.userName === people.account &&
                                        text.janusMsg.userName !==
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        !deleteBoolean) ||
                                    (index > 0 &&
                                        chDateFormat(text.janusMsg.time) !==
                                            chDateFormat(messageArray[index - 1].janusMsg.time) &&
                                        text.janusMsg.userName !== userName &&
                                        text.janusMsg.userName === people.account)
                                "
                            >
                                <n-avatar
                                    v-if="people.icon"
                                    class="userImg"
                                    :size="42"
                                    round
                                    object-fit="cover"
                                    :src="`${config.fileUrl}${people.icon}`"
                                    @click="showInternalPeopleInfo(people)"
                                />
                                <n-avatar
                                    v-else
                                    class="userImg"
                                    :size="42"
                                    round
                                    object-fit="cover"
                                    :src="innerPeopleDefault"
                                    @click="showInternalPeopleInfo(people)"
                                />
                            </div>
                        </template>
                        <!-- 外部人員 -->
                        <template v-for="people in outterPeopleInfo" :key="people.accountID">
                            <div
                                class="avatar"
                                v-if="
                                    (text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID &&
                                        text.janusMsg.chatroomID !==
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        !deleteBoolean) ||
                                    (index > 0 &&
                                        chDateFormat(text.janusMsg.time) !==
                                            chDateFormat(messageArray[index - 1].janusMsg.time) &&
                                        text.janusMsg.userName === '' &&
                                        text.janusMsg.chatroomID === people.accountID)
                                "
                            >
                                <n-avatar
                                    v-if="people.icon === '0'"
                                    class="userImg"
                                    :size="42"
                                    object-fit="cover"
                                    :src="outterPeopleDefault"
                                    @click="showExternalPeopleInfo(people)"
                                />
                                <n-avatar
                                    v-else
                                    class="userImg"
                                    :size="42"
                                    object-fit="cover"
                                    :src="`${config.fileUrl}icon/${people.icon}.png`"
                                    @click="showExternalPeopleInfo(people)"
                                />
                            </div>
                        </template>
                        <!-- 訊息 -->
                        <div
                            class="content"
                            :class="{
                                reply: text.janusMsg.config.isReply,
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '' &&
                                        index > 0 &&
                                        chDateFormat(text.janusMsg.time) ===
                                            chDateFormat(messageArray[index - 1].janusMsg.time)) ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === '' &&
                                        index > 0 &&
                                        chDateFormat(text.janusMsg.time) ===
                                            chDateFormat(messageArray[index - 1].janusMsg.time)),
                            }"
                            v-if="text.janusMsg.msgType === 1"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <!-- 回覆 -->
                            <div
                                class="replyMsg"
                                :class="{
                                    noMsgClick: !text.janusMsg.config.isReply,
                                }"
                                v-if="text.janusMsg.config.isReply"
                                @click.prevent="
                                    text.janusMsg.config.isReply
                                        ? scrollPageTo(
                                              text.janusMsg.config.replyObj.janusMsg.config.id
                                          )
                                        : null
                                "
                            >
                                <!-- <div
                                    class="info noMsg"
                                    v-if="text.format.replyObj.msgContent === ''"
                                >
                                    無法讀取原始訊息。
                                </div> -->
                                <div
                                    class="info"
                                    :class="{
                                        isImg:
                                            text.janusMsg.config.replyObj.janusMsg?.msgType === 6,
                                    }"
                                >
                                    <!-- 群聊回覆前台人員顯示對方名字 -->
                                    <template
                                        v-for="people in outterPeopleInfo"
                                        :key="people.accountID"
                                    >
                                        <div
                                            class="userName"
                                            v-if="
                                                text.janusMsg.config.replyObj.janusMsg
                                                    .chatroomID === people.accountID
                                            "
                                        >
                                            {{ people.name }}
                                        </div>
                                    </template>
                                    <!-- 群聊回覆後台人員顯示對方名字 -->
                                    <div
                                        class="userName"
                                        v-if="
                                            text.janusMsg.config.replyObj.janusMsg?.userName !== ''
                                        "
                                    >
                                        {{ text.janusMsg.config.replyObj.janusMsg.userName }}
                                    </div>
                                    <!-- 回覆照片顯示照片 -->
                                    <div
                                        v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 6"
                                    >
                                        [照片]
                                    </div>

                                    <!-- 回覆訊息 -->
                                    <n-ellipsis
                                        v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 1"
                                        style="width: 100%"
                                        :line-clamp="2"
                                        :tooltip="false"
                                    >
                                        {{ text.janusMsg.config.replyObj.janusMsg.msgContent }}
                                    </n-ellipsis>
                                </div>
                                <!-- 回覆貼圖格式 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 3"
                                >
                                    <img
                                        :src="`${text.janusMsg.config.replyObj.janusMsg.format.stickerUrl}${text.janusMsg.config.replyObj.janusMsg.format.stickerPackID}/${text.janusMsg.config.replyObj.janusMsg.format.stickerFileID}.${text.janusMsg.config.replyObj.janusMsg.format.ext}`"
                                        draggable="false"
                                    />
                                </div>

                                <!-- 回覆圖片格式 -->
                                <div
                                    class="replyImg"
                                    v-if="text.janusMsg.config.replyObj.janusMsg?.msgType === 6"
                                >
                                    <!-- {{ text.janusMsg.config.replyObj.janusMsg.format }} -->
                                    <img
                                        :src="`${config.fileUrl}${text.janusMsg.config.replyObj.janusMsg.format.Fileid}${text.janusMsg.config.replyObj.janusMsg.format.ExtensionName}`"
                                        draggable="false"
                                    />
                                </div>
                            </div>
                            <!-- 文字訊息 -->
                            <div class="originalMsg">
                                <a
                                    v-if="
                                        /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/.test(
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
                                        draggable="false"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- google maps -->
                        <div
                            class="googleMapsMsg content"
                            :class="{
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 8"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <a
                                :href="`https://maps.google.com/maps?q=${text.janusMsg.format.Latitude},${text.janusMsg.format.Longitude}`"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span class="img"
                                    ><img :src="googleMapIcon" draggable="false" alt="google maps"
                                /></span>
                                查看地圖
                            </a>
                        </div>
                        <!-- audio -->
                        <div
                            class="audio content"
                            :class="{
                                play: text.janusMsg.config.isPlay,
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
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
                            <n-icon @click="toggleAudio(text)" size="24">
                                <pause-circle-sharp v-show="text.janusMsg.config.isPlay" />
                                <play-circle-sharp v-show="!text.janusMsg.config.isPlay" />
                            </n-icon>
                            <span v-show="text.janusMsg.config.isPlay">{{ newTime }}</span>
                            <span v-show="!text.janusMsg.config.isPlay" class="totalTime">
                                {{ convertTime(text.janusMsg.format.SoundLength) }}
                            </span>
                            <img
                                class="audioWave"
                                draggable="false"
                                v-show="!text.janusMsg.config.isPlay"
                                :src="audioIcon"
                            />
                        </div>
                        <!-- 圖片訊息 -->
                        <div
                            :class="{
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            class="picture"
                            v-if="text.janusMsg.msgType === 6"
                            @click="previewURL(text)"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img
                                draggable="false"
                                :src="`${config.fileUrl}${text.janusMsg.format.Fileid}${text.janusMsg.format.ExtensionName}`"
                                :style="`max-width:${
                                    text.janusMsg.format.width > 250
                                        ? 250 + 'px'
                                        : text.janusMsg.format.width + 'px'
                                };height:${
                                    (text.janusMsg.format.height * 250) /
                                        text.janusMsg.format.width +
                                    'px'
                                }`"
                            />
                        </div>
                        <!-- 影片訊息 -->
                        <video
                            style="margin: 0 5px; background-color: black"
                            controls
                            controlsList="nodownload"
                            playsinline
                            width="200"
                            :class="{
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 11"
                        >
                            <source
                                :src="`${config.fileUrl}${text.janusMsg.format.Fileid}${text.janusMsg.format.ExtensionName}${iosVideoDefaultTag}`"
                            />
                        </video>
                        <!-- 文件訊息 -->
                        <div
                            class="content icon"
                            :class="{
                                samePeople:
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 7"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img :src="fileIcon" alt="檔案" draggable="false" />
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
                            @touchend="doCall(chatRoomID)"
                        >
                            <a class="phone-web" @click="onPhoneCallModal(chatRoomID)">
                                <div class="phonePic">
                                    <img :src="phoneIcon" alt="撥打電話" draggable="false" />
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
                                    (text.janusMsg.userName !== userName &&
                                        text.janusMsg.sender ===
                                            messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.userName ===
                                            messageArray[index - 1]?.janusMsg.userName &&
                                        text.janusMsg.chatroomID === '') ||
                                    (text.janusMsg.sender ===
                                        messageArray[index - 1]?.janusMsg.sender &&
                                        text.janusMsg.chatroomID ===
                                            messageArray[index - 1]?.janusMsg.chatroomID &&
                                        text.janusMsg.userName === ''),
                            }"
                            v-if="text.janusMsg.msgType === 3"
                            @touchstart="gtouchstart(text)"
                            @touchmove="gtouchmove()"
                            @touchend="gtouchend()"
                        >
                            <img
                                draggable="false"
                                :src="`${text.janusMsg.format.stickerUrl}${text.janusMsg.format.stickerPackID}/${text.janusMsg.format.stickerFileID}.${text.janusMsg.format.ext}`"
                            />
                        </div>
                    </div>
                    <!-- 時間戳記 -->
                    <div
                        class="timestamp"
                        :class="{ yourTimeStamp: text.janusMsg.sender === 0 }"
                        v-if="text.janusMsg.msgType !== 10"
                        :id="text.janusMsg.config.id + 'time'"
                    >
                        <div class="mms">
                            <span v-if="text.janusMsg.userName === userName">
                                <!-- 已讀 {{ groupChatReadNum }} -->
                                <span v-if="text.janusMsg.config.groupReadNum === 0">
                                </span>
                                <span v-else>
                                    已讀 {{ text.janusMsg.config.groupReadNum }}
                                </span>
                                <!-- 已讀 {{ text.janusMsg.config.groupReadNum }} -->
                            </span>
                        </div>
                        <span>{{ currentTime(text.janusMsg.time / 1000000) }}</span>
                    </div>
                </div>
                <n-icon
                    size="30"
                    class="scrollToBottom"
                    :style="diffHeight"
                    @click="groupChatScrollToBottom()"
                    v-show="
                        chatroomScrolltopAndWindowHeight < chatroomScrollHeight - 30 &&
                        Object.keys(text.janusMsg.config.replyObj).length === 0 &&
                        !isReplyBox &&
                        !inputFunctionBoolean &&
                        !isResult &&
                        !newMsgHint
                    "
                >
                    <arrow-down-circle />
                </n-icon>
                <!-- 顯示被收回 -->
                <div
                    class="recallHint"
                    :class="{
                        samePeople:
                            (text.janusMsg.userName !== userName &&
                                text.janusMsg.sender === messageArray[index - 1]?.janusMsg.sender &&
                                text.janusMsg.userName ===
                                    messageArray[index - 1]?.janusMsg.userName &&
                                text.janusMsg.chatroomID === '') ||
                            (text.janusMsg.sender === messageArray[index - 1]?.janusMsg.sender &&
                                text.janusMsg.chatroomID ===
                                    messageArray[index - 1]?.janusMsg.chatroomID &&
                                text.janusMsg.userName === ''),
                    }"
                    v-if="text.janusMsg.config.recallStatus && text.janusMsg.sender === 0"
                >
                    <span>訊息已收回</span>
                </div>
            </div>
        </div>
    </div>
    <InnerPeopleUserInfo />
    <OutterPeopleUserInfo />
    <!-- </n-scrollbar> -->
    <!-- 刪除訊息滿版 poopup 出現
    <teleport to="body" v-if="deletePopUp">
        <div class="mask">
            <div class="popUp">
                <div class="recallMsgConfirm">對方仍能看到你刪除的訊息</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click.stop="deletePopUp = !deletePopUp">
                        取消
                    </div>
                    <div
                        type="button"
                        class="confirm"
                        @click.stop="confirmDelete($route.params.id)"
                    >
                        確定
                    </div>
                </div>
            </div>
        </div>
    </teleport> -->
</template>
<script lang="ts">
export default {
    name: "MessageBox",
    inheritAttrs: false,
};
</script>
<script setup lang="ts">
// @ts-nocheck
import {
    ref,
    computed,
    onBeforeMount,
    onMounted,
    onUpdated,
    watch,
    watchEffect,
    nextTick,
    reactive,
    onUnmounted,
} from "vue";
import useClipboard from "vue-clipboard3";
import { api as viewerApi } from "v-viewer";
import { storeToRefs } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import Compressor from "compressorjs";
import { PlayCircleSharp, PauseCircleSharp, ArrowDownCircle } from "@vicons/ionicons5";
import { NEllipsis, NCheckboxGroup, NCheckbox, NAvatar, NIcon, NScrollbar } from "naive-ui";
import { useRoute } from "vue-router";

import { useApiStore } from "@/store/api";
import { useChatStore } from "@/store/chat";
import { useModelStore } from "@/store/model";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useSearchStore } from "@/store/search";
import { useGroupChatStore } from "@/store/groupChat";
import InnerPeopleUserInfo from "@/components/GroupChatRoom/InnerPeopleUserInfo.vue";
import OutterPeopleUserInfo from "@/components/GroupChatRoom/OutterPeopleUserInfo.vue";

import { txt } from "@/util/interfaceUtil";
import { sendGroupMsg } from "@/util/groupChatUtil";
import innerPeopleDefault from "@/assets/Images/groupChat/User default-B.svg";
import outterPeopleDefault from "@/assets/Images/groupChat/User default-C.svg";
import {
    scrollPageTo,
    convertTime,
    imgList,
    resetSetItem,
    isProduction,
    isStaging,
} from "@/util/commonUtil";
import { unixTime, currentDate, dateFormat, currentTime, chDateFormat } from "@/util/dateUtil";
import config from "@/config/config";
import moreIcon from "@/assets/Images/chatroom/more.svg";
import googleMapIcon from "@/assets/Images/chatroom/map.jpg";
import audioIcon from "@/assets/Images/chatroom/audio.svg";
import fileIcon from "@/assets/Images/chatroom/file-fill.svg";
import phoneIcon from "@/assets/Images/chatroom/phone-fill-round-y.svg";

const props = defineProps({
    eventID: String,
});

//api store
const apiStore = useApiStore();
const { getGroupChatHistoryApi, groupChatRecallAPI, download, getGroupChatMemberVisitTimeApi } =
    apiStore;
const {
    msgStart,
    totalCount,
    chatroomList,
    bugout,
    groupChatMessageList,
    chatRoomInnerPeopleInfo,
    chatRoomOutterPeopleInfo,
    groupMemberVisitTimeInfoList,
} = storeToRefs(apiStore);

const timeOutEvent = ref(0);
// watch([chatRoomInnerPeopleInfo, chatRoomOutterPeopleInfo], (val) => {
//     console.log("聊天室內部人員資訊:", val[0]);
//     console.log("聊天室外部人員資訊:", val[1]);
// });
// 彈窗 store
const modelStore = useModelStore();
const { showInternalPeopleInfo, showExternalPeopleInfo } = modelStore;
const { phoneCallModal } = storeToRefs(modelStore);

//phone store
const phoneCallStore = usePhoneCallStore();
const { doCall, phoneTime } = phoneCallStore;
const { sender } = storeToRefs(phoneCallStore);

//router
const route = useRoute();

const userName = localStorage.getItem("userName");
//chat store
const chatStore = useChatStore();
const {
    replyMsgEvent,
    deleteQuestion,
    groupChatScrollToBottom,
    smsMessageComputed,
    saveGroupReadNum,
} = chatStore;
const {
    msg,
    deleteBoolean,
    deleteGroup,
    deletePopUp,
    replyMsg,
    textPlugin,
    isReplyBox,
    inputFunctionBoolean,
    showStickerModal,
    isOnline,
    newMsgHint,
    isMmsSend,
    groupReadNum,
    participantList,
    groupChatFindScrollHeight,
    groupReadList,
} = storeToRefs(chatStore);

//search store
const searchStore = useSearchStore();
const { closeSearchBar } = searchStore;
const { isResult } = storeToRefs(searchStore);

const eventID: any = computed(() => route.query.eventID);
const innerPeopleInfo: any = computed(() => chatRoomInnerPeopleInfo.value);
const outterPeopleInfo: any = computed(() => chatRoomOutterPeopleInfo.value);
const messageArray: any = computed({
    get() {
        return groupChatMessageList.value;
    },
    set(val) {
        groupChatMessageList.value = val;
    },
});
const pictures: any = computed(() => {
    return groupChatMessageList.value.filter((item) => {
        return item.janusMsg.msgType == 6;
    });
});

// 未讀訊息顯示條消失
onMounted(() => {
    messageArray.value.forEach((msg) => {
        msg.janusMsg.config.isUnread = false;
    });
});

//聊天室功能
const preDate: any = ref([]);
const viewImgs: any = ref([]);

// let getCurChatRoomId: any = reactive({});
// // 環境設定
// const getSplit = isProduction || isStaging ? 4 : 5;
// const img = computed(() => {
//     getCurChatRoomId = chatroomList.value.find((obj) => {
//         return obj.chatroomID === chatRoomID.value;
//     });
//     return imgList.find((item) => {
//         // console.log('save item.split("/"):', getCurChatRoomId.icon);
//         const icon =
//             item.split("/")[getSplit] === "default.svg"
//                 ? 0
//                 : item.split("/")[getSplit].split(".")[0];
//         return getCurChatRoomId?.icon ? icon == getCurChatRoomId.icon : "default.svg";
//     });
// });

//判斷a連結
const validURL = (str) => {
    try {
        new URL(str);
    } catch (_) {
        return false;
    }
    return true;
};
//開始按
const gtouchstart = (msg: txt) => {
    timeOutEvent.value = setTimeout(function () {
        longPress(msg);
        console.log("長按");
    }, 500);
    return false;
};
//手釋放，如果在500毫秒内就釋放，則取消長按事件，此时可以執行onclick執行事件
const gtouchend = () => {
    clearInterval(timeOutEvent.value);
    if (timeOutEvent.value != 0) {
        console.log("點擊");
    }
    return false;
};
//如果手指有移動，則取消所有事件，此时說名用户只是要移動而不是長按
const gtouchmove = () => {
    clearTimeout(timeOutEvent.value); //清除定时器
    timeOutEvent.value = 0;
};

//真正長按後應該執行的内容
const longPress = (msg: any) => {
    timeOutEvent.value = 0;
    onBubble(msg);
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
onMounted(() => {
    watch(messageArray, () => {
        if (messageArray.value.length > 0) {
            const dropArea = document.getElementById("groupChatDropArea");
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
        }
    });
});

const imageReload = ref(0);
const onUploadFile = async (file: any) => {
    const fileArr = file[0];
    const fileArrType = file[0].type;
    const fileName = fileArr.name;
    const getToken = localStorage.getItem("access_token");
    if (!fileArr) {
        return;
    }
    //辨識上傳檔案
    //圖片檔案
    if (fileArrType.includes("image")) {
        if (fileName.split(".").pop() === "gif") {
            // console.log("gif檔!!!");
            const fd = new FormData();
            fd.append("file", new File([fileArr], fileArr.name, { type: "image/*" }));
            await axios({
                method: "post",
                url: `${config.serverUrl}/v1/file`,
                data: fd,
                headers: { Authorization: `Bearer ${getToken}` },
            })
                .then((res) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(fileArr);
                    reader.onload = async (e: any) => {
                        let image = new Image();
                        image.src = e.target.result;
                        image.onload = function () {
                            const imageObj: any = {
                                janusMsg: {
                                    eventID: eventID.value,
                                    chatroomID: "",
                                    msgType: 6,
                                    sender: 0,
                                    msgContent: "",
                                    time: unixTime(),
                                    type: 3,
                                    userName: userName,
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
                                        replyObj: replyMsg.value ? { ...replyMsg.value } : {},
                                        currentDate: currentDate(),
                                        isExpire: false,
                                        isPlay: false,
                                        isRead: false,
                                        msgFunctionStatus: false,
                                        msgMoreStatus: false,
                                        recallPopUp: false,
                                        recallStatus: false,
                                        userName: userName,
                                    },
                                },
                            };

                            const sendMsgObj = {
                                msg: imageObj,
                                textPlugin: textPlugin.value,
                                chatRoomID: "",
                                eventID: eventID.value,
                            };

                            sendGroupMsg(sendMsgObj);
                        };
                    };
                })
                .catch((err) => {
                    // console.error(err);
                    bugout.value.error(`error-log${userName.value}`, err.response.status);
                    bugout.value.error(`error-log${userName.value}`, err.response.data);
                    bugout.value.error(
                        `error-log${userName.value}`,
                        err.response.request.responseURL
                    );
                });
        } else {
            // console.log("圖片非gif 檔!!!");
            new Compressor(fileArr, {
                quality: 0.6,
                async success(result) {
                    //呼叫api
                    const fd = new FormData();
                    fd.append("file", new File([result], fileArr.name, { type: "image/*" }));
                    await axios({
                        method: "post",
                        url: `${config.serverUrl}/v1/file`,
                        data: fd,
                        headers: { Authorization: `Bearer ${getToken}` },
                    })
                        .then((res) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(fileArr);
                            reader.onload = async (e: any) => {
                                let image = new Image();
                                image.src = e.target.result;
                                image.onload = function () {
                                    const imageObj: any = {
                                        janusMsg: {
                                            eventID: eventID.value,
                                            chatroomID: "",
                                            msgType: 6,
                                            sender: 0,
                                            msgContent: "",
                                            time: unixTime(),
                                            type: 3,
                                            userName: userName,
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
                                                replyObj: replyMsg.value
                                                    ? { ...replyMsg.value }
                                                    : {},
                                                currentDate: currentDate(),
                                                isExpire: false,
                                                isPlay: false,
                                                isRead: false,
                                                msgFunctionStatus: false,
                                                msgMoreStatus: false,
                                                recallPopUp: false,
                                                recallStatus: false,
                                                userName: userName,
                                            },
                                        },
                                    };
                                    // 確認圖片是否放至伺服器;
                                    // await axios({
                                    //     method: "get",
                                    //     url: `${config.fileUrl}${imageObj.janusMsg.format.Fileid}${imageObj.janusMsg.format.ExtensionName}`,
                                    // })
                                    //     .then((res) => {
                                    //         imageReload.value = 0;
                                    const sendMsgObj = {
                                        msg: imageObj,
                                        textPlugin: textPlugin.value,
                                        chatRoomID: "",
                                        eventID: eventID.value,
                                    };
                                    sendGroupMsg(sendMsgObj);
                                    // })
                                    // .catch((err) => {
                                    //     console.error("圖片尚未放至伺服器 ", err);
                                    //     if (imageReload.value === 4) {
                                    //         imageReload.value = 0;
                                    //         return;
                                    //     }
                                    //     if (imageReload.value < 4) {
                                    //         imageReload.value++;
                                    //         setTimeout(() => {
                                    //             onUploadFile(file);
                                    //         }, 300);
                                    //     }
                                    // });
                                };
                            };
                        })
                        .catch((err) => {
                            // console.error(err);
                            bugout.value.error(`error-log${userName.value}`, err.response.status);
                            bugout.value.error(`error-log${userName.value}`, err.response.data);
                            bugout.value.error(
                                `error-log${userName.value}`,
                                err.response.request.responseURL
                            );
                        });
                },
                error(err) {
                    console.error(err);
                },
            });
        }
    } else if (fileArrType.includes("video")) {
        //影片檔案
        const fd = new FormData();
        console.log("fileArr:", fileArr);
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

        axios({
            method: "post",
            url: `${config.serverUrl}/v1/file`,
            data: fd,
            headers: { Authorization: `Bearer ${getToken}` },
        })
            .then((res) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;
                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            eventID: eventID.value,
                            chatroomID: "",
                            msgType: 11,
                            sender: 0,
                            msgContent: "",
                            time: unixTime(),
                            type: 3,
                            userName: userName,
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
                                userName: userName,
                            },
                        },
                    };
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatRoomID: "",
                        eventID: eventID.value,
                    };
                    sendGroupMsg(sendMsgObj);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
    } else {
        //一般檔案
        const fd = new FormData();
        console.log("fileArr:", fileArr);
        fd.append("file", new File([fileArr], fileArr.name, { type: fileArr.type }));

        axios({
            method: "post",
            url: `${config.serverUrl}/v1/file`,
            data: fd,
            headers: { Authorization: `Bearer ${getToken}` },
        })
            .then((res) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileArr);
                reader.onload = (e: any) => {
                    files.value = e.target.result;
                    let fileObj: any = {};
                    fileObj = {
                        janusMsg: {
                            eventID: eventID.value,
                            chatroomID: "",
                            msgType: 7,
                            sender: 0,
                            msgContent: "",
                            time: unixTime(),
                            type: 3,
                            userName: userName,
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
                                userName: userName,
                            },
                        },
                    };
                    const sendMsgObj = {
                        msg: fileObj,
                        textPlugin: textPlugin.value,
                        chatRoomID: "",
                        eventID: eventID.value,
                    };
                    sendGroupMsg(sendMsgObj);
                };
            })
            .catch((err) => {
                // console.error(err);
                bugout.value.error(`error-log${userName.value}`, err.response.status);
                bugout.value.error(`error-log${userName.value}`, err.response.data);
                bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            });
    }
};

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
    // console.log("視窗滾動高", chatroomScrollHeight.value);
    // console.log("視窗離頂部距離+視窗高", chatroomScrolltopAndWindowHeight.value);
};

//聊天室置底新訊息提示消失
const scrollHeight = ref(0);
const scrollTop = ref(0);
const offsetHeight = ref(0);
const loadData = ref(false);
onUpdated(() => {
    scrollHeight.value = groupChatFindScrollHeight.value.scrollHeight;
    scrollTop.value = groupChatFindScrollHeight.value.scrollTop;
    offsetHeight.value = groupChatFindScrollHeight.value.offsetHeight;
});
watch([scrollHeight, scrollTop, offsetHeight], (newVal, oldVal) => {
    if (newVal[0] - newVal[1] < newVal[2] + 10) {
        newMsgHint.value = false;
    }
    if (newVal[1] === 0 && newVal[0] > oldVal[0] && loadData.value === true) {
        groupChatFindScrollHeight.value.scrollTop = newVal[0] - oldVal[0];
        loadData.value = false;
    }
});

// 往上觸頂刷新歷史訊息api
const handleScroll = (e) => {
    if (e.target.scrollTop == 0) {
        loadData.value = true;
        loadMore();
    }
};

const loadMore = () => {
    if (totalCount.value >= 30) {
        msgStart.value = msgStart.value + 30;
        getGroupChatHistoryApi(route.query.eventID, true);
    }
};
onMounted(() => {
    document.getElementById("groupChatDropArea").addEventListener("scroll", handleScroll, true);
});

//重新編輯
const reEdit = (id: string): void => {
    groupChatMessageList.value.forEach((text: txt) => {
        if (text.janusMsg.config.id !== id) return;
        msg.value = text.janusMsg.msgContent;
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
//發送傳統簡訊
const transferSmsMsg = (text) => {
    isMmsSend.value = true;
    text.janusMsg.config.msgFunctionStatus = false;
    msg.value = text.janusMsg.msgContent;
    smsMessageComputed();
};

//訊息功能泡泡
const onBubble = (text: txt): void => {
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

    // const ele = document.querySelectorAll(".timestamp");
    // ele.forEach((item, i, arr) => {
    //     if (item.getBoundingClientRect().top > document.body.clientHeight * 0.7) {
    //         item.offsetParent.offsetParent.children[0].children[i].classList.add("lastMsg");
    //     } else if (
    //         !item.offsetParent.offsetParent.children[0].children[arr.length - 1].classList.contains(
    //             "lastMsg"
    //         )
    //     ) {
    //         item.offsetParent.offsetParent.children[0].children[arr.length - 1].classList.add(
    //             "lastMsg"
    //         );
    //     } else {
    //         item.offsetParent.offsetParent.children[0].children[i].classList.remove("lastMsg");
    //     }
    // });
    //訊息功能框開關
    let arr = groupChatMessageList.value.map((item: txt) => {
        if (item.janusMsg.config.id === text.janusMsg.config.id) {
            text.janusMsg.config.msgFunctionStatus = !text.janusMsg.config.msgFunctionStatus;
        } else {
            item.janusMsg.config.msgFunctionStatus = false;
        }
        return item;
    });
    groupChatMessageList.value = arr;
};

//下載
const downloadFile = (text: txt): void => {
    // console.log("download props", text);
    text.janusMsg.config.msgFunctionStatus = false;
    download(text);
};

//收回訊息
const recallMsg = (msg): void => {
    groupChatMessageList.value.forEach((text: txt) => {
        if (text.janusMsg.config.id !== msg.janusMsg.config.id) return;
        text.janusMsg.config.recallStatus = true;
        text.janusMsg.config.recallPopUp = false;
    });
    groupChatRecallAPI(msg, route.query.eventID);
    const lastChatMessageArr = JSON.parse(
        sessionStorage.getItem(`${route.query.eventID}-lastChatMessage`)
    );
    lastChatMessageArr.forEach((item, index) => {
        if (msg.janusMsg.config.id === item.janusMsg.config.id) {
            lastChatMessageArr.splice(index, 1);
        }
    });
    resetSetItem(
        `${route.query.eventID}-lastChatMessage`,
        JSON.stringify(lastChatMessageArr.slice(-10))
    );
};

//收回彈窗
const confirmRecallPopup = (text: txt): void => {
    groupChatMessageList.value.forEach((item: txt) => {
        if (item.janusMsg.config.id !== text.janusMsg.config.id) return;
        text.janusMsg.config.msgFunctionStatus = false;
        item.janusMsg.config.recallPopUp = !item.janusMsg.config.recallPopUp;
    });
};

//打電話
const onPhoneCallModal = (chatRoomID) => {
    sender.value = 0;
    phoneCallModal.value = true;
    doCall(chatRoomID);
};
// 圖片展示
const previewURL = (text): void => {
    // fileid
    // time
    viewImgs.value = [];
    pictures.value.forEach((img: any) => {
        if (
            viewImgs.value.includes(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            )
        )
            return;
        if (img.janusMsg.msgType === 6) {
            viewImgs.value.push(
                `${config.fileUrl}${img.janusMsg.format.Fileid}${img.janusMsg.format.ExtensionName}`
            );
        }
    });
    // 環境設定
    const getSplit = isProduction || isStaging ? 3 : 4;
    const viewIndex = viewImgs.value
        .map((img: any) => Math.floor(img.split("/")[getSplit].split(".")[0]))
        .indexOf(Number(text.janusMsg.format.Fileid));
    viewerApi({
        options: {
            initialViewIndex: viewIndex,
            movable: false,
            scalable: false,
            className: "v-wrap",
            viewed(e) {
                const fileName = e.detail.originalImage.currentSrc.split("/").pop();
                const fileId = fileName.substring(0, fileName.lastIndexOf("."));
                const wrap = document.getElementsByClassName("v-wrap");
                const div = document.createElement("div");
                const a = document.createElement("a");
                a.href = `${config.serverUrl}/v1/file/${fileId}`;
                a.target = "_blank";
                a.download = fileName;
                a.className = "download";
                a.innerHTML = `<span class="downloadImg"></span>`;
                (text.janusMsg.type === 3 &&
                    dayjs().isBefore(dayjs(text.janusMsg.format.expirationDate))) ||
                (text.janusMsg.type === 3 && text.janusMsg.config.isWelcomeMsg) ||
                text.janusMsg.type === 3
                    ? wrap[0].appendChild(div).appendChild(a)
                    : null;
            },
        },
        images: viewImgs.value,
    });
};
//default pic  for ios video
const iosVideoDefaultTag = ref("#t=0.1");
// 自定義置底按鈕/輸入框高度差屬性
const diffHeight = computed(() => {
    // console.log("是否打開了貼圖:", chatStore.showStickerModal);
    let origialHeight = 70;
    let typeHeight = chatStore.isMmsSend ? 44 : 0;
    switch (chatStore.showStickerModal) {
        case true:
            typeHeight = 0;
            origialHeight = 286;
            break;
        default:
            origialHeight = chatRoomOutterPeopleInfo.value.length > 0 ? 85 : 70;
    }
    return {
        "--diffHeight": origialHeight + typeHeight + chatStore.diffHeight + "px",
    };
});

// 自定義信息框高度差的屬性
let originalHeight = 62;
let typeHeight = chatStore.isMmsSend ? 44 : 0;
const messageOffset = computed(() => {
    // console.log("是否打開了貼圖:", chatStore.showStickerModal);
    switch (chatStore.showStickerModal) {
        case true:
            typeHeight = 0;
            originalHeight = chatRoomOutterPeopleInfo.value.length > 0 ? 284 : 265;
            break;
        default:
            originalHeight = chatRoomOutterPeopleInfo.value.length > 0 ? 81 : 62;
    }
    return {
        "--messageOffset": originalHeight + typeHeight + chatStore.diffHeight + "px",
    };
});
// 取得群聊人員上線時間
onMounted(() => {
    getGroupChatMemberVisitTimeApi(route.query.eventID);
});
// 群聊已讀數
// const groupChatReadNum = computed(() => {
//     return groupReadNum.value;
// });
// 當前在線清單
const currParticipantList = ref([]);
// 監聽participantList
watch(
    participantList,
    (now, old) => {
        // console.log('now: ', now);
        if (Array.isArray(messageArray.value) && messageArray.value.length !== 0) {
            let lastMsg = messageArray.value[messageArray.value.length - 1];
            let lastGroupReadList = lastMsg.janusMsg.config.groupReadList;

            // 合併now和old，再去重
            let nowList = now.concat(old);
            const nowTmpList = [];
            for (const nowItem of nowList) {
                for (const itemKey in nowItem) {
                    if (!nowTmpList.includes(itemKey)) {
                        nowTmpList.push(itemKey);
                    }
                }
            }
            currParticipantList.value = nowTmpList;
            // console.log('currParticipantList ', currParticipantList.value);

            const tmpGroupReadList = [];
            for (const curr of currParticipantList.value) {
                if (curr !== localStorage.getItem("account")) tmpGroupReadList.push(curr);
            }
            console.log("currParticipantList ", tmpGroupReadList);
            // 新用戶+1
            localStorage.setItem("myGroupReadNum", tmpGroupReadList.length);
            lastMsg.janusMsg.config.groupReadNum = Number(localStorage.getItem("myGroupReadNum"));

            // 做標記
            const tmpLastGroupReadList = [];
            for (const nowReader of now) {
                for (const readerKey in nowReader) {
                    const data = {};
                    data["id"] = readerKey;
                    data["onlineTime"] = parseInt((Date.now() / 1000).toFixed(0));
                    data["isRead"] = true;
                    data["isSelf"] = readerKey === localStorage.getItem("account");
                    tmpLastGroupReadList.push(data);
                }
            }
            // 最終已讀清單
            lastGroupReadList = tmpLastGroupReadList;
            localStorage.setItem("myGroupReadList", JSON.stringify(tmpLastGroupReadList));
            lastGroupReadList = JSON.parse(localStorage.getItem("myGroupReadList"));
            console.log("ccc participantList ", lastGroupReadList);
            // lastMsg.janusMsg.config.groupReadNum += 1;
        }
    },
    {
        deep: true,
        immediate: true,
    }
);
</script>
<style lang="scss">
@import "~@/assets/scss/var";

.closeView {
    position: fixed;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    .closeImg {
        width: 80%;
        height: 80%;
    }
}

// 圖片預覽套件下載按鈕
.download {
    position: fixed;
    left: 0;
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
.room-wrap {
    .n-layout-scroll-container {
        background-color: #f4f4f4;
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
// *:not(input.field) {
//     -webkit-touch-callout: text !important;
//     -webkit-user-select: text !important;
//     -khtml-user-select: text !important;
//     -moz-user-select: text !important;
//     -ms-user-select: text !important;
//     user-select: text !important;
// }

//收回訊息確認的彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 330px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .RecallPopUp {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .recallMsgConfirm {
            font-size: $font-size-16;
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
                font-size: $font-size-16;
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
                font-size: $font-size-16;
                transition: background-color 0.2s linear;
                line-height: 20px;
                background-color: $primary-3;
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
// .scrollbar {
// max-height: 676px;
// #groupChatDropArea::-webkit-scrollbar {
//     width: 5px;
//     height: 5px;
//     border-radius: 5px;
// // }
#groupChatDropArea::-webkit-scrollbar-track {
    border-radius: 5px;
    cursor: pointer;
}

#groupChatDropArea::-webkit-scrollbar {
    width: 5px;
}

#groupChatDropArea::-webkit-scrollbar-thumb {
    border-radius: 5px;
    cursor: pointer;
    -webkit-box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.25);
}
.chatroom-inner {
    width: 100%;
    position: absolute;
    top: 46px;
    // bottom: 62px;
    bottom: var(--messageOffset);
    overflow-y: auto;
    height: auto;
    box-sizing: border-box;
    background-color: #fff;
    &.notMsg {
        padding-top: 20%;
        text-align: center;
        @extend %h2;
    }
    .background {
        padding-top: 0;
    }
    .dialog-box {
        // display: flex;
        // flex-direction: column;
        // justify-content: flex-end;
        padding: 10px 15px;
        &.noFunctionMsg {
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
        &.recallMsg {
            > * {
                opacity: 0.5;
            }
            > .recallHint {
                opacity: 1;
            }
        }
        &.staffMsg {
            text-align: right;

            &.dateMsg {
                display: block;
            }
        }
        &.clientMsg {
            justify-content: flex-start;
            &.dateMsg {
                display: block;
            }
            &.lastMsg {
                .dialog {
                    .dialog-inner {
                        .msgFunction {
                            right: -50px;
                        }
                    }
                }
            }
            .dialog {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                .dialog-inner {
                    .replyMsg {
                        border-bottom: 1px solid $gray-5;
                        .info {
                            color: $gray-4;
                        }
                        .userName {
                            color: $gray-4;
                        }
                    }
                    .msgFunction {
                        left: initial;
                        right: -60px;
                        top: 30px;
                    }
                    .avatar {
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    .content {
                        max-width: 900px;
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
        @media (max-width: 768px) {
            &.clientMsg {
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
        }

        &.dateMsg {
            .date {
                display: block;
                margin-bottom: 20px;
                div {
                    max-width: 120px;
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
        &.lastMsg {
            .dialog {
                .dialog-inner {
                    .msgFunction {
                        left: initial;
                        right: 30px;
                        bottom: 20px;
                        top: auto;
                    }
                }
            }
        }
        &.SMSMsg {
            .dialog {
                .dialog-inner {
                    .content {
                        background-color: #ffe198;
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

            .dialog-inner {
                max-width: 60%;
                display: inline-flex;
                align-items: center;
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
                    left: -60px;
                    z-index: 1;
                    .ulList {
                        background-color: $primary-3;
                        li {
                            width: 115px;
                            height: 50px;
                            padding: 10px 15px 10px 15px;
                            // text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: $gray-1;
                            border-bottom: 1px solid $white;
                            span {
                                font-size: $font-size-14;
                                font-weight: 500;
                                // display: table-cell;
                                // vertical-align: middle;
                            }
                            a {
                                font-size: $font-size-14;
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
                    bottom: -4px;

                    img {
                        display: block;
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
                                    font-size: $font-size-14;
                                    font-weight: 500;
                                }
                                a {
                                    font-size: $font-size-14;
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
                    max-width: 100%;
                    word-wrap: break-word;
                    word-break: break-all;
                    white-space: pre-wrap;
                    background-color: $primary-3;
                    border-radius: 20px 5px 20px 20px;
                    padding: 10px;
                    text-align: left;
                    align-items: center;
                    flex-direction: column;
                    line-height: 1.5;
                    margin-left: 10px;
                    &.reply {
                        min-width: 70px;
                    }
                    &.samePeople {
                        margin-left: 54px;
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
                        &.samePeople {
                            margin-left: 54px;
                        }
                        .n-icon {
                            margin-right: 10px;
                        }
                        .totalTime {
                            font-size: $font-size-14;
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
                        @media (max-width: 768px) {
                            > a.phone-web {
                                display: none;
                            }
                        }
                    }
                }
                .originalMsg {
                    font-size: $font-size-14;
                    font-weight: 500;
                    color: $gray-1;
                    display: flex;
                    flex-direction: column;
                    // justify-content: flex-start;
                    a {
                        display: contents;
                    }
                }

                .replyMsg {
                    font-size: $font-size-14;
                    color: #a37f29;
                    margin-left: -10px;
                    margin-right: -10px;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    line-height: 1.5;
                    border-bottom: 1px solid $primary-2;
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
                        padding-right: 10px;
                        margin-right: 5px;
                        &.noMsg {
                            color: $gray-2;
                        }
                        &.isImg {
                            min-width: 60px;
                        }
                    }
                    .userName {
                        font-weight: 600;
                        font-size: $font-size-12;
                    }
                    .replyImg {
                        width: 40%;
                        height: 30%;
                        padding-right: 10px;
                        overflow: hidden;
                    }
                    img {
                        width: 100%;
                        max-width: 150px;
                        max-height: 150px;
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
                        margin-left: 54px;
                    }
                }
                .picture {
                    margin-left: 10px;
                    margin-right: 10px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
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
                    // background-color: $gray-7;
                    &:hover {
                        cursor: pointer;
                    }
                    &:after {
                        content: "";
                        font-size: 0;
                        -webkit-text-size-adjust: none;
                    }
                    img {
                        vertical-align: middle;
                        max-width: 250px;
                        max-height: 300px;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                    &.samePeople {
                        margin-left: 54px;
                    }
                }
                video {
                    &.samePeople {
                        margin-left: 54px;
                    }
                }
                .googleMapsMsg {
                    border-radius: 8px;
                    a {
                        color: $gray-1;
                        font-size: $font-size-14;
                        text-decoration: none;
                        -webkit-user-drag: none;
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
                        max-width: 150px;
                        max-height: 150px;
                        object-fit: contain;
                    }
                    &.samePeople {
                        margin-left: 54px;
                    }
                }
            }
            .timestamp {
                display: flex;
                flex-direction: column;
                .mms {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    p {
                        font-size: $font-size-12;
                        color: $danger;
                    }
                    span {
                        display: block;
                        color: $gray-3;
                        font-size: $font-size-12;
                        font-weight: 400;
                        line-height: 17px;
                    }
                }
                span {
                    display: block;
                    color: $gray-3;
                    font-size: $font-size-12;
                    font-weight: 400;
                }
            }
        }
        .userName {
            color: $gray-4;
            font-size: $font-size-10;
            margin-top: 5px;
        }
        .recallHint {
            color: red;
            font-size: $font-size-10;
            font-weight: bold;
            margin-top: 5px;
            &.samePeople {
                margin-left: 54px;
            }
        }
    }
    .scrollToBottom {
        position: fixed;
        right: 285px;
        // bottom: 70px;
        bottom: var(--diffHeight);
        border-radius: 50%;
        z-index: 100;
        cursor: pointer;
    }
}

@media screen and (max-width: 768px) {
    .chatroom-inner {
        position: absolute;
        top: 140px;
        bottom: 67px;
        overflow-y: scroll;
        height: auto;
        padding: 0;
        .background {
            padding-top: 0;
            padding-bottom: 0px;
        }
    }
}
// }
.dropActive {
    background-color: rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 450px) {
    .card {
        width: 90%;
    }
}
</style>

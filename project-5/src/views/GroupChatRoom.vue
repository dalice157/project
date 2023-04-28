<template>
    <n-layout class="chatroom" @click="closeChatBubble">
        <n-layout-header style="height: 60px">
            <IntegrateHeader />
        </n-layout-header>
        <n-layout position="absolute" style="top: 60px" has-sider>
            <n-layout-sider width="330px" bordered :native-scrollbar="false">
                <GroupChatSidebar />
            </n-layout-sider>
            <n-layout class="content">
                <Headers />
                <n-layout-content
                    content-style="padding: 24px;"
                    :native-scrollbar="false"
                    v-if="route.name === 'GroupChatRoom'"
                    class="notFound"
                    >點擊左側開始交談</n-layout-content
                >
                <n-layout class="room-wrap" v-else has-sider sider-placement="right">
                    <router-view name="groupChat" v-slot="{ Component }">
                        <component :is="Component" />
                    </router-view>
                </n-layout>
            </n-layout>
        </n-layout>
    </n-layout>
    <!-- 邀請外部人員彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="selectOutterPeoplePopUp === 1">
            <div class="outterPeoplePopUp">
                <div class="SMS_content">
                    <h1>輸入邀請簡訊內容</h1>
                    <n-divider />
                    <div class="subject">
                        <h3>簡訊主旨</h3>
                        <n-popover trigger="hover" placement="right">
                            <template #trigger>
                                <n-icon :depth="3" size="22">
                                    <help-circle-outline />
                                </n-icon>
                            </template>
                            <span class="pop"
                                >簡訊主旨用於查詢報表時，可清楚辨識每一次的發送紀錄，便於彙整與管理：主旨不會出現在簡訊發送內容，亦不列入簡訊字數計算。</span
                            >
                        </n-popover>
                    </div>
                    <n-input placeholder="請輸入簡訊主旨 (可不填)" v-model:value="groupChatSubject">
                    </n-input>
                    <div class="contentTitle">
                        <h3><span>*</span>發送內容</h3>
                        <div class="commonMessage" @click="openCommonMsg">+常用簡訊</div>
                    </div>
                    <div class="inputWrap">
                        <n-input
                            v-model:value.trim="groupChatContent"
                            type="textarea"
                            placeholder="請輸入簡訊內容..."
                            :autosize="{ minRows: 8, maxRows: 8 }"
                            @focus="focusType"
                            @blur="blurJudge"
                            @input="wordCount"
                        />
                    </div>
                    <div class="messageCount">
                        <div class="messageInfo">
                            <div class="wordCount">{{ groupChatWord }} 字</div>
                            <div class="numOfMessage">{{ groupChatCount }} 則</div>
                            <div class="point">{{ groupChatPoint }} 點</div>
                        </div>
                    </div>
                </div>
                <div class="SMS_setting">
                    <img class="closeIcon" :src="closeIcon" @click="closeOutterPopUp" />
                    <h1>邀請人員(收訊人)選取設定</h1>
                    <n-divider />
                    <h3>
                        (群組人數:內部{{ innerPeople.length }}/外部<span
                            v-show="tab === 'manual'"
                            >{{ phoneArray.length }}</span
                        ><span v-show="tab === 'automatic'">{{
                            uploadRef?.valid ? uploadRef.valid.length : 0
                        }}</span
                        ><span v-show="tab === 'label'">{{
                            sendTagsPhone ? sendTagsPhone.length : 0
                        }}</span
                        >)
                    </h3>
                    <n-tabs class="tabs" type="card" @update-value="tabChange">
                        <n-tab-pane name="manual" tab="手動輸入">
                            <div class="manual">
                                <div class="manual__type-area">
                                    <n-config-provider :theme-overrides="themeOverrides">
                                        <n-input
                                            v-model:value.trim="phoneNumberList"
                                            type="textarea"
                                            placeholder="請輸入手機號碼"
                                            :autosize="{
                                                minRows: 4,
                                                maxRows: 8,
                                            }"
                                            :maxlength="15000"
                                        />
                                    </n-config-provider>
                                    <div class="manual__msg-groupChatCount">
                                        <p>共{{ phoneArray.length }}筆</p>
                                    </div>
                                </div>
                                <div
                                    class="manual__instructions"
                                    v-show="innerPeople.length + phoneArray.length <= 50"
                                >
                                    <h4>【手動輸入說明】</h4>
                                    <ul class="instructions__list">
                                        <li>請直接於將收訊人手機號碼輸入於上方輸入欄位中。</li>
                                        <li>
                                            亦可將Excel中同一欄位資料複製貼入於網頁手機號碼輸入欄位中。
                                        </li>
                                        <li>
                                            台灣地區號碼輸入範例:0912345678<br />國際地區(含大陸地區):+8612345678。
                                        </li>
                                        <li>
                                            多筆請以半形逗點","分隔:0912345678,0912345679,.........
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    class="exceedAlert"
                                    v-show="innerPeople.length + phoneArray.length > 50"
                                >
                                    (超過群組上限50人，請重新選擇)
                                </div>
                            </div>
                            <div
                                class="next-page"
                                v-show="
                                    phoneNumberList !== '' &&
                                    innerPeople.length + phoneArray.length <= 50
                                "
                                @click="manualNextstep"
                            >
                                <p>下一步</p>
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="automatic" tab="載入大量名單">
                            <n-scrollbar style="max-height: 400px">
                                <div class="automatic">
                                    <div class="upload">
                                        <img
                                            :src="delIcon"
                                            alt=""
                                            v-if="uploadRef !== null"
                                            @click="uploadRef = null"
                                        />
                                        <div class="upload__file">
                                            <n-upload
                                                ref="upload"
                                                @change="handleChange"
                                                accept=".xlsx,xls"
                                            >
                                                <div class="upload__img">
                                                    <img :src="fileIcon" alt="檔案" />
                                                </div>
                                            </n-upload>
                                            <div class="upload__text">
                                                <a
                                                    v-if="uploadRef === null"
                                                    target="_blank"
                                                    :href="`${config.fileUrl}一般大量發送範例檔.xlsx`"
                                                >
                                                    <h2>下載一般大量發送範例檔</h2>
                                                </a>
                                                <h2 v-else>已上傳成功</h2>
                                                <h3 v-if="uploadRef === null">
                                                    範例檔編輯完成直接上傳
                                                </h3>
                                                <p v-else>{{ fileName }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="automatic__instructions" v-if="uploadRef === null">
                                        <h4>【範例檔編輯說明】</h4>
                                        <ul class="instructions__list">
                                            <li>
                                                請先下載一般大量發送範例檔，將欲發送之相關資料填具於一般大量發送範例檔之各相對欄位中。
                                            </li>
                                            <li>
                                                Excel檔製作完成，欲儲存檔案時，請選擇Excel2003版本以上之（".xlsx"或".xls"）檔案類型儲存之。
                                            </li>
                                            <li>
                                                範例檔第一列的四個資料欄位（姓名/手機門號/電子郵件/傳送日期）為固定欄位，請勿任意更動其順序或刪除。
                                            </li>
                                            <li>
                                                匯入一般大量發送範例檔時本系統只讀取第一分頁(發送清單)中之發送資料，不會選取分頁(發送範例檔)之資料。
                                            </li>
                                        </ul>
                                        <h4>【注意】</h4>
                                        <p>
                                            大量簡訊發送前請詳讀服務條款
                                            <span @click="termsPopUp = !termsPopUp">檢視</span>
                                            及操作說明
                                            <a
                                                href="https://tw.e8d.tw/every8d30/Document/%E4%BA%92%E5%8B%95%E8%B3%87%E9%80%9A%E4%BC%81%E6%A5%AD%E5%95%86%E5%8B%99%E9%9B%99%E5%90%91%E7%B0%A1%E8%A8%8A%E5%B9%B3%E5%8F%B0%E6%93%8D%E4%BD%9C%E8%AA%AA%E6%98%8E.pdf"
                                                target="_blank"
                                            >
                                                <span>下載</span> 。
                                            </a>
                                        </p>
                                    </div>
                                    <div class="automatic__name-list" v-else>
                                        <div>
                                            <p>
                                                有效名單&ensp;:&ensp;<span>{{
                                                    uploadRef.valid ? uploadRef.valid.length : 0
                                                }}</span
                                                >&ensp;筆
                                            </p>
                                            <p>
                                                無效名單&ensp;:&ensp;<span>{{
                                                    uploadRef.invalid ? uploadRef.invalid.length : 0
                                                }}</span
                                                >&ensp;筆
                                            </p>
                                        </div>
                                        <img
                                            :src="editIcon"
                                            @click="invalidPopUp = !invalidPopUp"
                                            alt="編輯"
                                        />
                                    </div>
                                    <div
                                        class="exceedAlert"
                                        v-show="
                                            innerPeople.length +
                                                (uploadRef?.valid ? uploadRef.valid.length : 0) >
                                            50
                                        "
                                    >
                                        (超過群組上限50人，請重新選擇)
                                    </div>
                                    <div
                                        class="next-page"
                                        v-show="
                                            uploadRef !== null &&
                                            innerPeople.length +
                                                (uploadRef?.valid ? uploadRef.valid.length : 0) <=
                                                50
                                        "
                                        @click="automaticNextstep"
                                    >
                                        <p>下一步</p>
                                    </div>
                                </div>
                            </n-scrollbar>
                        </n-tab-pane>
                        <n-tab-pane name="label" tab="選取標籤">
                            <n-scrollbar style="max-height: 400px">
                                <div class="selectLabel">
                                    <div class="selectChannel">
                                        <div class="title">
                                            <h1>選擇活動頻道</h1>
                                        </div>
                                        <n-input placeholder="搜尋" v-model:value="searchChannel">
                                            <template #prefix> <img :src="searchIcon" /></template>
                                        </n-input>
                                        <n-radio-group
                                            name="radioGroup"
                                            v-model:value="selectChannel"
                                            @change="clearTag"
                                        >
                                            <n-scrollbar style="max-height: 300px">
                                                <div class="allChannel">
                                                    <div
                                                        class="channelList"
                                                        v-for="people in filterLabelChannelList"
                                                        :key="people.accountID"
                                                    >
                                                        <div class="eachChannel">
                                                            <n-radio :value="people.eventID" />
                                                            <img
                                                                v-if="people.icon"
                                                                :src="`${config.fileUrl}${people.icon}`"
                                                            />
                                                            <img v-else :src="profileIcon" />
                                                            <div class="eachChannel__profile">
                                                                <h1>{{ people.name }}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </n-scrollbar>
                                        </n-radio-group>
                                    </div>
                                    <div class="label">
                                        <div class="title">
                                            <h1>選取標籤({{ choosedTags }})</h1>
                                        </div>
                                        <div class="tags">
                                            <div
                                                class="tag"
                                                :class="{ active: tag.highlight }"
                                                v-for="tag in transformTags"
                                                :key="tag.tagName"
                                                @click="tagHighlight(tag.tagName)"
                                            >
                                                #{{ tag.tagName }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="labelCount">
                                    <h1>發送筆數</h1>
                                    <h1 v-show="innerPeople.length + sendTagsPhone.length <= 50">
                                        {{ sendTagsPhone.length }}筆
                                    </h1>
                                    <h1
                                        class="alert"
                                        v-show="innerPeople.length + sendTagsPhone.length > 50"
                                    >
                                        {{ sendTagsPhone.length }}筆
                                    </h1>
                                    <p v-show="innerPeople.length + sendTagsPhone.length > 50">
                                        (超過群組上限50人，請重新選擇)
                                    </p>
                                    <div
                                        @click="labelNextStep"
                                        class="confirm"
                                        v-show="
                                            innerPeople.length + sendTagsPhone.length <= 50 &&
                                            sendTagsPhone.length !== 0
                                        "
                                    >
                                        <p>確定</p>
                                    </div>
                                </div>
                            </n-scrollbar>
                        </n-tab-pane>
                    </n-tabs>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 確認外部名單 -->
    <teleport to="body">
        <div class="mask" v-show="selectOutterPeoplePopUp === 2">
            <div class="outterPeopleConfirm">
                <div class="SMS_content">
                    <div class="contentTitle">
                        <h1>簡訊內容</h1>
                        <div class="messageCount">
                            <div class="messageInfo">
                                <div class="wordCount">{{ groupChatWord }} 字</div>
                                <div class="numOfMessage">{{ groupChatCount }} 則</div>
                                <div class="point">{{ groupChatPoint }} 點</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentWrap">
                        <h1 class="subject">簡訊主旨</h1>
                        <h2 style="margin-bottom: 50px">{{ groupChatSubject }}</h2>
                        <h2 class="content">簡訊內容</h2>
                        <n-scrollbar style="max-height: 120px" trigger="none">
                            <div style="line-height: 1.6; padding: 10px">
                                {{ groupChatContent }}
                            </div>
                        </n-scrollbar>
                    </div>
                </div>
                <div class="SMS_recipientInformation">
                    <div class="informationTitle">
                        <h1>收訊人資訊</h1>
                        <img :src="closeIcon" @click="closeOutterPopUp" />
                    </div>
                    <div class="contentWrap">
                        <h2 class="time">發送時間</h2>
                        <h2 style="margin-bottom: 50px">立即發送</h2>
                        <h2 class="list">發送名單</h2>
                        <h2 style="margin-bottom: 50px">
                            有效&ensp;:&ensp;{{
                                validPhoneCount
                            }}筆&ensp;&ensp;&ensp;無效&ensp;:&ensp;{{ invalidPhoneCount }}筆
                        </h2>
                        <h2>
                            <span
                                >將扣除{{
                                    groupChatPoint * localPhoneCount +
                                    groupChatPoint * 3 * globalPhoneCount
                                }}點/</span
                            >
                            <span class="alertPoint">
                                剩餘{{
                                    point -
                                    (groupChatPoint * localPhoneCount +
                                        groupChatPoint * 3 * globalPhoneCount)
                                }}點</span
                            >
                        </h2>
                    </div>
                    <div class="outterPopUpButton">
                        <div class="previousPage" @click="selectOutterPeoplePopUp = 1">上一步</div>
                        <div class="confirmFail" v-if="disable" :class="{ disable: disable }">
                            確認傳送
                        </div>
                        <div class="confirm" v-else @click="onSend">確認傳送</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 簡訊服務條款 -->
    <teleport to="body">
        <div class="mask" v-show="termsPopUp">
            <div class="popUp">
                <div class="popUp__title">
                    <h2>簡訊服務條款</h2>
                    <img :src="closeIcon" alt="關閉" @click="termsPopUp = !termsPopUp" />
                </div>
                <ul class="instructions__list">
                    <li>
                        您登記於本企業多功能訊息平台之手機門號，使用本訊息平台傳送文字訊息，單純只付費給本公司，您的電信業者是不會再次跟您收取任何文字訊息費用，請安心使用。
                    </li>
                    <li>
                        傳送文字訊息至台灣地區之行動電話門號，單則文字訊息:純英文半形文字 160
                        字、中文或中英文混合 70 字以內，即需扣除文字訊息額度一點。文字訊息內容超過
                        70 字時亦可傳送，本系統將自動以長文字文字訊息方式發送，單則文字訊息最大可達
                        333
                        中文字(或中英混合)，單則文字訊息實際所需扣除點數請以操作面版上實際計算之扣點資訊為主。
                    </li>
                    <li>
                        傳送文字訊息至非台灣地區(+886)之行動電話門號，純英文半形文字 160
                        字；中文或中英文混合 70 字以內，則需扣除文字訊息額度三點。
                    </li>
                    <li>
                        傳送文字訊息內容若為純英文半形文字時，請勿填入特殊字元如下：~ ` ^ { } [] |
                        \以免造成訊息顯示異常。
                    </li>
                    <li>
                        傳送文字訊息至非台灣地區(+886)之行動電話門號，系統將自動拆則以單則文字訊息發送。
                    </li>
                    <li>
                        若您於文字訊息平台功能列點選參數文字訊息發送時，操作面版上之點數計算規則為不含參數值之文案總字數，單則文字訊息實際計費字數需再加上參數值之字數總合為實際計費字數。
                    </li>
                    <li>
                        文字訊息送出後，除了號碼格式錯誤之外，其餘狀態，無論手機是否收到文字訊息，均會立即扣點，請務必小心操作傳送文字訊息。
                    </li>
                    <li>文字訊息的發送時間若設定為預約時，傳送設定完成即同步扣除所需點數。</li>
                    <li>文字訊息的發送時間若設定為預約時，將無法提供E-mail同步發送之服務。</li>
                    <li>因操作設定不當或手機號碼輸入錯誤者，已扣款點數恕不負責。</li>
                    <li>
                        使用預約發送訊息功能時，若欲取消發送，最晚請於「預約發送時間前 10
                        分鐘」於系統中”SMS預約訊息維護”功能項中刪除預約發送批次，若超過上述時間限制平台無法提供刪除預約訊息之服務。
                    </li>
                    <li>
                        乙方應盡力維持訊息平台服務穩定性；基於雙方網路系統皆為向電信公司租用之線路，乙方不對網際網路傳輸之系統穩定性負任何擔保責任。
                    </li>
                    <li>
                        基於訊息傳送係經由各訊息中心傳送，乙方不對訊息送達與否負擔保責任；惟乙方應盡善良管理人之義務，確保訊息傳遞過程之順暢及訊息中心回報更新之正確。
                    </li>
                </ul>
                <div class="popUp__confirm" @click="termsPopUp = !termsPopUp">確定</div>
            </div>
        </div>
    </teleport>
    <!-- 無效名單 -->
    <teleport to="body">
        <div class="mask" v-show="invalidPopUp">
            <div class="invalidList">
                <div class="popUpTitle">
                    <h2>無效名單</h2>
                    <img :src="closeIcon" alt="關閉" @click="invalidPopUp = !invalidPopUp" />
                </div>
                <div class="invalidFunctionBar">
                    <n-input
                        class="invalidSearch"
                        v-model:value="search"
                        type="text"
                        placeholder="搜尋"
                    >
                        <template #prefix>
                            <img :src="searchIcon" alt="搜尋" />
                        </template>
                    </n-input>
                    <!-- <div class="invalidCancel">匯出</div> -->
                    <!-- <div class="invalidConfirm">確定</div> -->
                </div>
                <div class="invalidTable">
                    <n-data-table
                        class="sms_table"
                        :bordered="false"
                        :scroll-x="840"
                        :columns="createColumns"
                        :data="data"
                        :pagination="pagination"
                        :bottom-bordered="false"
                    />
                </div>
            </div>
        </div>
    </teleport>
    <!-- 常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="commonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>常用簡訊</h2>
                    <img :src="closeIcon" alt="close" @click="closeCommonMsg" />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgDel" @click="removeHint">刪除</div>
                    <div class="commonMsgAdd" @click="addCommonMsg">新增</div>
                    <div
                        class="commonMsgConfirm"
                        @click="exportCommonMsg"
                        v-show="checkedVal !== null"
                    >
                        確定
                    </div>
                </div>
                <div class="Table">
                    <n-data-table
                        class="commonMsgTable"
                        :bordered="false"
                        :columns="commonMsgColumns"
                        :data="commonMsgData"
                        :pagination="commonMsgPagination"
                        :scroll-x="840"
                        :bottom-bordered="false"
                        :style="{ height: `50px` }"
                    >
                        <template #empty>
                            <n-empty description="尚無常用簡訊"> </n-empty>
                        </template>
                    </n-data-table>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 新增常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="addCommonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>新增常用簡訊</h2>
                    <img :src="closeIcon" alt="close" @click="closeAddCommonMsg" />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgConfirm" @click="submitAddCommonMsg">確定</div>
                </div>
                <div class="smsSubject">
                    <div class="subject">
                        <h3>簡訊主旨</h3>
                    </div>
                    <n-input
                        id="input"
                        v-model:value.trim="subject"
                        type="text"
                        placeholder="請輸入簡訊主旨(可不填)"
                    />
                </div>
                <div class="smsSendContent2">
                    <div class="contentTitle">
                        <h3>發送內容</h3>
                    </div>
                    <n-input
                        v-model:value.trim="content"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="commonFocusType"
                        @blur="commonBlurJudge"
                        @input="commonWordCount"
                    />
                </div>
                <div class="messageCount">
                    <div class="messageInfo">
                        <div class="wordCount">{{ commonMsgWord }} 字</div>
                        <div class="numOfMessage">{{ commonMsgCount }} 則</div>
                        <div class="point">{{ commonMsgPoint }} 點</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 編輯常用簡訊彈窗 -->
    <teleport to="body">
        <div class="mask" v-show="editCommonMsgPopUp">
            <div class="commonMsg">
                <div class="popUpTitle">
                    <h2>編輯常用簡訊</h2>
                    <img :src="closeIcon" alt="close" @click="closeEditCommonMsg" />
                </div>
                <div class="commonMsgFunctionBar">
                    <div class="commonMsgConfirm" @click="submitEditCommonMsg">確定</div>
                </div>
                <div class="smsSubject">
                    <div class="subject">
                        <h3>簡訊主旨</h3>
                    </div>
                    <n-input
                        id="input"
                        v-model:value.trim="subject"
                        type="text"
                        placeholder="請輸入簡訊主旨(可不填)"
                    />
                </div>
                <div class="smsSendContent2">
                    <div class="contentTitle">
                        <h3>發送內容</h3>
                    </div>
                    <n-input
                        ref="editInputInstRef"
                        v-model:value.trim="content"
                        type="textarea"
                        placeholder="請輸入簡訊內容..."
                        :autosize="{
                            minRows: 7,
                            maxRows: 7,
                        }"
                        @focus="commonFocusType"
                        @blur="commonBlurJudge"
                        @input="commonWordCount"
                    />
                </div>
                <div class="messageCount">
                    <div class="messageInfo">
                        <div class="wordCount">{{ commonMsgWord }} 字</div>
                        <div class="numOfMessage">{{ commonMsgCount }} 則</div>
                        <div class="point">{{ commonMsgPoint }} 點</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <!-- 刪除常用簡訊提示 -->
    <teleport to="body">
        <div class="mask" v-show="deleteCommonMsgPopUp">
            <div class="deleteCommonMsgPopUp">
                <div class="deleteCommonMsgConfirm">您確定要刪除此常用簡訊!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="deleteCommonMsgPopUp = false">
                        取消
                    </div>
                    <div type="button" class="confirm" @click="removeCommonMsg">確定</div>
                </div>
            </div>
        </div>
    </teleport>

    <UploadAnimation />
    <n-modal
        class="chatRecordCard"
        v-model:show="isIncomingCall"
        :mask-closable="false"
        preset="card"
    >
        <n-card :bordered="false" size="huge" class="container">
            <UserInfo :info="userInfo" />
            <div class="description">語音來電</div>
            <ul class="call_container">
                <li @click="doHangup(2, yourUserChatroomID, route.params.id, 1)">
                    <span class="icon"><img :src="hangUpIcon" alt="掛斷" /></span>
                    <h4 class="text">掛斷</h4>
                </li>
                <li>
                    <button
                        class="icon"
                        @click="onIncomingCall(yourUserChatroomID, jsepMsg)"
                    ></button>
                    <h4 class="text">接聽</h4>
                </li>
            </ul>
        </n-card>
    </n-modal>
    <AlertPopUp
        :alertMessage="alertMessage"
        :alertEvent="alertEvent"
        @clearAlertMessage="clearAlertMessage"
    />
</template>
<script lang="ts">
export default {
    name: "ChatRoom",
    inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch, ref, onMounted, onUnmounted, computed, reactive, h } from "vue";
import {
    NModal,
    NCard,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NLayoutHeader,
    NScrollbar,
    NUpload,
    NInput,
    NTabs,
    NTabPane,
    NCheckboxGroup,
    NCheckbox,
    NDivider,
    NPopover,
    NIcon,
    NDataTable,
    NConfigProvider,
    NEmpty,
    NRadio,
    NRadioGroup,
} from "naive-ui";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import config from "@/config/config";
import { useApiStore } from "@/store/api";
import { usePhoneCallStore } from "@/store/phoneCall";
import { useChatStore } from "@/store/chat";
import { useGroupChatRecordStore } from "@/store/groupChatRecord";
import { useGroupChatStore } from "@/store/groupChat";
import { useModelStore } from "@/store/model";
import { pointCalculation, callJoin } from "@/util/commonUtil";
import { randomString } from "@/util/chatUtil";

import UploadAnimation from "@/components/uploadAnimation.vue";
import AlertPopUp from "@/components/AlertPopUp.vue";
import IntegrateHeader from "@/components/IntegrateHeader.vue";
import GroupChatSidebar from "@/components/GroupChatRoom/GroupChatSidebar";
import Headers from "@/components/Headers.vue";
import UserInfo from "@/components/UserInfo.vue";
import hangUpIcon from "@/assets/Images/common/close-round-red.svg";
import { HelpCircleOutline } from "@vicons/ionicons5";
import photoIcon from "@/assets/Images/manage/Photo.svg";
import innerInviteIcon from "@/assets/Images/groupChat/plus_o.svg";
import outterInviteIcon from "@/assets/Images/groupChat/plus_y.svg";
import searchIcon from "@/assets/Images/groupChat/search.svg";
import profileIcon from "@/assets/Images/groupChat/User default-B.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import deleteIcon from "@/assets/Images/groupChat/round-fill_close.svg";
import deleteIcon2 from "@/assets/Images/groupChat/round-fill_close_g.svg";
import closeIcon from "@/assets/Images/groupChat/close-round.svg";

//router
const route = useRoute();
const router = useRouter();

// api store
const apiStore = useApiStore();
const {
    excelVerification,
    getCommonMsgList,
    addCommonMsgObj,
    removeCommonMsgObj,
    editCommonMsgObj,
    addGroup,
    getTagList,
    getGroupChatRoomInfo,
    getGroupChatHistoryApi,
} = apiStore;
const {
    isInput,
    addhttps,
    point,
    userInfo,
    uploadRef,
    labelChannelList,
    tagList,
    invalidList,
    commonMsgList,
    eventID,
    innerPeople,
    outterPeople,
    groupChatMessageList,
} = storeToRefs(apiStore);

//Chat store
const chatStore = useChatStore();
const { textPlugin, meJoinAlready } = storeToRefs(chatStore);
//phoneCall store
const phoneCallStore = usePhoneCallStore();
const { onIncomingCall, doHangup } = phoneCallStore;
const { callPlugin, yourUserChatroomID, jsepMsg, isIncomingCall, isAccepted, phoneTime } =
    storeToRefs(phoneCallStore);

//groupChatRecord store
const groupChatRecordStore = useGroupChatRecordStore();
const { groupChatRecordMessages } = storeToRefs(groupChatRecordStore);
//groupChat store
const groupChatStore = useGroupChatStore();
const {
    groupChatSubject,
    groupChatContent,
    groupChatPoint,
    groupChatCount,
    groupChatWord,
    groupChatUserinfo,
    phoneArray,
    phoneNumberList,
    selectInnerPeoplePopUp,
    selectOutterPeoplePopUp,
} = storeToRefs(groupChatStore);
//modal store
const modelStore = useModelStore();
const { uploadAnimationBoolean } = storeToRefs(modelStore);
//alert popup
const alertMessage = ref("");
const alertEvent = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};

// local 沒 token 導至登入頁
onMounted(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alertMessage.value = "您帳號已登出，請重新登入!!";
        alertEvent.value = "toHome";
    }
});
//監聽路由變更使用者資訊
watch([() => route.query.eventID, groupChatRecordMessages], (val) => {
    if (val[0] !== undefined) {
        let eventId = Number(val[0]);
        let arr = val[1].filter((item) => Number(item.eventID) === eventId);
        groupChatUserinfo.value.name = arr[0].name;
        groupChatUserinfo.value.icon = arr[0].icon;
        groupChatUserinfo.value.inner = arr[0].number_in;
        groupChatUserinfo.value.outter = arr[0].number_ex;
    }
});
//監聽路由刷新歷史訊息
watch(
    () => route.query.eventID,
    (val) => {
        if (val !== undefined) {
            isInput.value = true;
            groupChatMessageList.value = [];
            getGroupChatHistoryApi(val);
        }
    },
    { immediate: true }
);
//監聽路由 call join
watch([() => route.query.eventID, meJoinAlready], (val) => {
    // console.log("觀察路由query參數及janus是否註冊成功", val);
    if (val[0] !== undefined && val[1] === true) {
        getGroupChatRoomInfo(val[0]);
        const transaction = randomString(12);
        callJoin(transaction, textPlugin.value, Number(val[0]));
        // const myID = localStorage.getItem("accountID");
        // const myName = localStorage.getItem("account");
        // const join = {
        //     textroom: "join",
        //     transaction: transaction,
        //     room: Number(val[0]),
        //     username: myName,
        //     accountID: myID,
        //     display: "admin",
        // };
        // // console.log("join 資訊", join);
        // textPlugin.value.data({
        //     text: JSON.stringify(join),
        //     error: function (reason: any) {
        //         console.log("掛載頁面時 join error:", reason);
        //     },
        //     success: function (reason) {
        //         console.log("掛載頁面時 join 成功:", reason);
        //     },
        // });
    }
});

//取消訊息功能泡泡
const closeChatBubble = (): void => {
    groupChatMessageList.value = groupChatMessageList.value.map((text: any) => {
        text.janusMsg.config.msgFunctionStatus = false;
        return text;
    });
    // recordMessages.value.forEach((msg) => {
    //     msg.isfunctionPopUp = false;
    // });
};
//外部人員
const searchChannel = ref("");
const selectChannel = ref("");

//關閉外部彈窗
const closeOutterPopUp = () => {
    selectOutterPeoplePopUp.value = 0;
    uploadRef.value = null;
    groupChatStore.$reset();
};
const demoContent =
    "輸入簡訊內容\n\n說明：\n１.支援『長簡訊』之發送,每則簡訊字數最多可達333（中文）字。\n２.超過333字仍可發送,系統將自動進行拆則。\n３.為使簡訊內容正常呈現於手機中,請勿在簡訊內容中填入~．^)|1>等特殊符號。";
//外部彈窗 textarea 功能
const focusType = (e) => {
    groupChatContent.value =
        groupChatContent.value === demoContent ||
        groupChatContent.value.includes("~ ` ^ { } [ ] | < >")
            ? ""
            : e.target.value;
};
const blurJudge = (e) => {
    groupChatContent.value = groupChatContent.value === "" ? demoContent : e.target.value;
};
const wordCount = () => {
    if (groupChatContent.value === demoContent || !groupChatContent.value) {
        groupChatContent.value = "";
        groupChatWord.value = 0;
        groupChatPoint.value = 0;
        groupChatCount.value = 0;
        return;
    }
    groupChatCount.value = pointCalculation(groupChatContent.value).smsCount;
    groupChatPoint.value = pointCalculation(groupChatContent.value).point;
    groupChatWord.value = groupChatContent.value.length;
    //判斷出去短網址是否要添加https://
    if (
        pointCalculation(groupChatContent.value + config.extraString).point ===
        pointCalculation(groupChatContent.value + config.extraString + "https://").point
    ) {
        addhttps.value = true;
    } else {
        addhttps.value = false;
    }
};
//常用簡訊
const commonMsgPopUp = ref(false);
//新增常用簡訊彈窗
const addCommonMsgPopUp = ref(false);
//編輯常用簡訊彈窗
const editCommonMsgPopUp = ref(false);
//刪除常用訊息彈窗
const deleteCommonMsgPopUp = ref(false);
//常用簡訊v-model
const dataID = ref("");
const subject = ref("");
const content = ref("");
const commonMsgWord = ref(0);
const commonMsgCount = ref(0);
const commonMsgPoint = ref(0);

//開啟常用簡訊
const openCommonMsg = () => {
    commonMsgPopUp.value = true;
    selectOutterPeoplePopUp.value = 0;
    const accountID = localStorage.getItem("accountID");
    getCommonMsgList(accountID);
};
//關閉常用簡訊
const closeCommonMsg = () => {
    commonMsgPopUp.value = false;
    selectOutterPeoplePopUp.value = 1;
    checkedVal.value = null;
};
const checkedVal = ref(null);
const exportData = reactive({
    subject: "",
    content: "",
});
//單選選中資料
const chooseOne = (row) => {
    checkedVal.value = row.smsID;
    exportData.subject = row.subject;
    exportData.content = row.content;
};
//常用訊息確定
const exportCommonMsg = () => {
    commonMsgPopUp.value = false;
    selectOutterPeoplePopUp.value = 1;
    if (checkedVal.value !== null) {
        groupChatSubject.value = exportData.subject;
        groupChatContent.value = exportData.content;
    }
    exportData.subject = "";
    exportData.content = "";
    checkedVal.value = null;
    wordCount();
};
//刪除提示
const removeHint = () => {
    if (checkedVal.value === null) {
        alertMessage.value = "您尚未選擇要刪除之訊息!!!";
    } else {
        deleteCommonMsgPopUp.value = !deleteCommonMsgPopUp.value;
    }
};
//刪除常用訊息
const removeCommonMsg = () => {
    deleteCommonMsgPopUp.value = !deleteCommonMsgPopUp.value;
    removeCommonMsgObj(checkedVal.value);
    checkedVal.value = null;
};
//新增常用簡訊切換
const addCommonMsg = () => {
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//關閉新增常用簡訊
const closeAddCommonMsg = () => {
    subject.value = "";
    content.value = demoContent;
    commonMsgWord.value = 0;
    commonMsgCount.value = 0;
    commonMsgPoint.value = 0;
    checkedVal.value = null;
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//新增訊息
const submitAddCommonMsg = () => {
    if (content.value !== "" && content.value !== demoContent) {
        const addNewCommonMsg = {
            subject: subject.value,
            content: content.value,
        };
        const accountID = localStorage.getItem("accountID");
        addCommonMsgObj(accountID, addNewCommonMsg);
    }
    subject.value = "";
    content.value = demoContent;
    commonMsgWord.value = 0;
    commonMsgCount.value = 0;
    commonMsgPoint.value = 0;
    checkedVal.value = null;
    addCommonMsgPopUp.value = !addCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
};
//編輯常用簡訊帶入資料
const editCommonMsg = (data) => {
    editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
    subject.value = data.subject;
    content.value = "";
    content.value = data.content;
    dataID.value = data.smsID;
    checkedVal.value = null;
    commonWordCount();
};
//關閉編輯訊息
const closeEditCommonMsg = () => {
    editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
    commonMsgPopUp.value = !commonMsgPopUp.value;
    subject.value = "";
    content.value = demoContent;
    dataID.value = "";
    checkedVal.value = null;
    commonMsgWord.value = 0;
    commonMsgPoint.value = 0;
    commonMsgCount.value = 0;
};
//送出編輯訊息
const submitEditCommonMsg = () => {
    if (content.value === demoContent) {
        alertMessage.value = "請填寫編輯內容!!!!";
    } else {
        editCommonMsgObj(dataID.value, subject.value, content.value);
        subject.value = "";
        content.value = demoContent;
        dataID.value = "";
        checkedVal.value = null;
        commonMsgWord.value = 0;
        commonMsgPoint.value = 0;
        commonMsgCount.value = 0;
        editCommonMsgPopUp.value = !editCommonMsgPopUp.value;
        commonMsgPopUp.value = !commonMsgPopUp.value;
    }
};
//常用簡訊textarea 功能
const commonFocusType = (e) => {
    content.value =
        content.value === demoContent || content.value.includes("~ ` ^ { } [ ] | < >")
            ? ""
            : e.target.value;
};
const commonBlurJudge = (e) => {
    content.value = content.value === "" ? demoContent : e.target.value;
};
const commonWordCount = () => {
    if (content.value === demoContent || !content.value) {
        content.value = "";
        commonMsgWord.value = 0;
        commonMsgPoint.value = 0;
        commonMsgCount.value = 0;
        return;
    }
    commonMsgCount.value = pointCalculation(content.value).smsCount;
    commonMsgPoint.value = pointCalculation(content.value).point;
    commonMsgWord.value = content.value.length;
};
//常用簡訊 dataTable
const commonMsgColumns = [
    {
        key: "choose",
        align: "center",
        render(row, index) {
            return h(NRadio, {
                name: "radioChoose",
                value: row.smsID,
                onChange: () => chooseOne(row),
                checked: row.smsID === checkedVal.value,
            });
        },
    },
    {
        title: "標題",
        key: "subject",
        align: "left",
        render(row, index) {
            return h(
                "div",
                {
                    class: "subject",
                },
                row.subject
            );
        },
    },
    {
        title: "簡訊內容",
        key: "content",
        align: "left",
        render(row, index) {
            return h(
                "div",
                {
                    class: "content",
                },
                row.content
            );
        },
    },
    {
        key: "edit",
        align: "right",
        render(row, index) {
            return h(
                "img",
                {
                    class: "edit",
                    src: editIcon,
                    onClick: () => {
                        editCommonMsg(row);
                    },
                },
                row.edit
            );
        },
    },
];
//常用簡訊資料
const commonMsgData = computed({
    get() {
        return commonMsgList.value;
    },
    set(val) {
        commonMsgList.value = val;
    },
});
//常用簡訊分頁
const commonMsgPagination = {
    pageSize: 9,
};
//觀察手動輸入筆數
watch(phoneNumberList, () => {
    if (phoneNumberList.value === "") {
        phoneArray.value = [];
    } else {
        if (phoneNumberList.value.trim().charAt(phoneNumberList.value.length - 1) === ",") {
            phoneArray.value = phoneNumberList.value
                .trim()
                .substr(0, phoneNumberList.value.length - 1)
                .split(",");
        } else {
            // 去空格
            phoneNumberList.value = phoneNumberList.value.replace(/[ ]/g, "");
            //去換行符
            phoneNumberList.value = phoneNumberList.value.replace(/[\r\n]/g, "");
            phoneArray.value = phoneNumberList.value.split(",");
        }
    }
});
//外部人員excel上傳
const fileName = ref("");
const handleChange = (e) => {
    uploadAnimationBoolean.value = true;
    fileName.value = e.file.file.name;
    excelVerification(e.file.file);
};
//標籤裡 選擇活動頻道
const filterLabelChannelList = computed(() => {
    return labelChannelList.value.filter((item) => {
        return item.name
            .trim()
            .toLowerCase()
            .includes(`${searchChannel.value.trim().toLowerCase()}`);
    });
});
//標籤總數
const phoneCount = ref([]);
const tags = computed(() => tagList.value);
const transformTags = computed({
    get() {
        const tagArr = ref([]);
        console.log("tags", tags.value);
        tagArr.value = tags.value.reduce((arr, item) => {
            if (item.eventID === selectChannel.value) {
                let tag = Object.keys(item.tags);
                phoneCount.value = Object.values(item.tags);
                arr = arr.concat(tag);
            }
            return arr;
        }, []);
        tagArr.value = tagArr.value.map((item, idx) => {
            for (let i = 0; i < phoneCount.value.length; i++) {
                if (idx === i) {
                    return {
                        tagName: item,
                        highlight: false,
                        phone: phoneCount.value[i],
                    };
                }
            }
        });
        console.log("tagArr", tagArr.value);
        return tagArr.value;
    },
    set(val) {
        tags.value = val;
    },
});
//選取標籤總數
const choosedTags = ref(0);
//發送標籤的電話
const sendTagsPhone = ref([]);
//選取標籤
const tagHighlight = (name) => {
    transformTags.value.forEach((item) => {
        if (item.tagName === name) {
            item.highlight = !item.highlight;
        }
    });
    //選取的標籤數量
    choosedTags.value = transformTags.value.reduce((count, item) => {
        if (item.highlight) {
            count++;
        }
        return count;
    }, 0);
    //發送標籤的電話
    sendTagsPhone.value = transformTags.value.reduce((arr, item) => {
        if (item.highlight) {
            arr = arr.concat(item.phone);
        }
        return arr;
    }, []);
    //去重
    sendTagsPhone.value = sendTagsPhone.value.filter((item, idx, arr) => {
        return arr.indexOf(item) === idx;
    });
};
//換radio清標籤
const clearTag = () => {
    choosedTags.value = 0;
    sendTagsPhone.value = [];
};
//有效電話相關資訊
const validPhones = ref(null);
const validPhoneArray = ref([]);
const invalidPhoneArray = ref([]);
const validPhoneCount = ref(0);
const localPhoneCount = ref(0);
const globalPhoneCount = ref(0);
//無效電話相關資訊
const invalidPhoneCount = ref(0);
//手動名單下一步
const manualNextstep = () => {
    if (!groupChatContent.value || groupChatContent.value === demoContent) {
        alertMessage.value = "仍有必填欄位尚未填寫!!";
        return;
    }
    validPhoneArray.value = [];
    invalidPhoneArray.value = [];
    localPhoneCount.value = 0;
    globalPhoneCount.value = 0;

    //分類手動輸入有無效名單
    phoneArray.value.reduce((arr, item) => {
        if (
            (item.match(/^(0|\+?886)?9\d{8}$/) || item.match(/^\+[1-9]\d{6,14}$/)) &&
            !validPhoneArray.value.includes(`${item}`)
        ) {
            //sms手動輸入有效名單
            validPhoneArray.value.push(item);
        } else {
            //sms手動輸入無效名單
            invalidPhoneArray.value.push(item);
        }
    }, []);
    //計算國內,國際電話
    validPhones.value = validPhoneArray.value.map((item) => {
        if (item.match(/^(0|\+?886)?9\d{8}$/)) {
            localPhoneCount.value++;
            return "09" + item.slice(-8);
        } else {
            globalPhoneCount.value++;
            return item;
        }
    });
    validPhoneCount.value = validPhones.value?.length;
    //無效筆數
    invalidPhoneCount.value = invalidPhoneArray.value?.length;

    selectOutterPeoplePopUp.value = 2;
};
//大量名單下一步
const automaticNextstep = () => {
    localPhoneCount.value = 0;
    globalPhoneCount.value = 0;
    if (!groupChatContent.value || groupChatContent.value === demoContent) {
        alertMessage.value = "仍有必填欄位尚未填寫!!";
        return;
    }
    if (uploadRef.value.valid.length === 0) {
        alertMessage.value = "上傳檔案無有效名單,請重新上傳!!";
        return;
    } else {
        //excel 匯入
        //有效筆數
        validPhones.value = uploadRef.value?.valid.map((file) => {
            if (file.mobile.match(/^(0|\+?886)?9\d{8}$/)) {
                localPhoneCount.value++;
                return "09" + file.mobile.slice(-8);
            } else {
                globalPhoneCount.value++;
                return file.mobile;
            }
        });
        validPhoneCount.value = validPhones.value?.length;
        //無效筆數
        invalidPhoneCount.value = uploadRef.value?.invalid.length;
    }
    selectOutterPeoplePopUp.value = 2;
};
//標籤確定
const labelNextStep = () => {
    localPhoneCount.value = 0;
    globalPhoneCount.value = 0;
    if (!groupChatContent.value || groupChatContent.value === demoContent) {
        alertMessage.value = "仍有必填欄位尚未填寫!!";
        return;
    }
    //計算國內國際電話
    validPhones.value = sendTagsPhone.value.map((item) => {
        if (item.toString().match(/^(0|\+?886)?9\d{8}$/)) {
            localPhoneCount.value++;
            return "09" + item.toString().slice(-8);
        } else {
            globalPhoneCount.value++;
            return item;
        }
    });
    validPhoneCount.value = sendTagsPhone.value.length;
    selectOutterPeoplePopUp.value = 2;
};
//確認傳送
const disable = ref(false);
const onSend = async () => {
    disable.value = true;
    if (
        groupChatPoint.value * localPhoneCount.value +
            groupChatPoint.value * 3 * globalPhoneCount.value >
        point.value
    ) {
        alertMessage.value = "剩餘點數不足,請洽官網進行儲值!!!";
        return;
    }
    if (validPhoneCount.value === 0) {
        alertMessage.value = "您所輸入的有效名單數量為零，請修改名單！";
        return;
    }
    const sendObj = {
        text: groupChatContent.value,
        type: "0",
        subject: groupChatSubject.value,
        list: validPhones.value.toString(),
        sendTime: null,
        eventId: eventID.value == 0 ? route.query.eventID : eventID.value,
        phrases: "",
        monthDay: "0",
        hourTime: "0",
        minuteTime: "0",
        addhttps: addhttps.value,
    };
    console.log("群聊邀請外部人員 post 表單", sendObj);
    const fd = new FormData();
    fd.append("text", sendObj.text);
    fd.append("type", sendObj.type);
    fd.append("subject", sendObj.subject);
    fd.append("list", sendObj.list);
    fd.append("sendTime", sendObj.sendTime);
    fd.append("phrases", sendObj.phrases);
    fd.append("monthDay", sendObj.monthDay);
    fd.append("hourTime", sendObj.hourTime);
    fd.append("minuteTime", sendObj.minuteTime);
    fd.append("addhttps", sendObj.addhttps);
    const getToken = localStorage.getItem("access_token");
    await axios({
        method: "post",
        url: `${config.serverUrl}/v1/msgs/${sendObj.eventId}`,
        data: fd,
        headers: { Authorization: `Bearer ${getToken}` },
        timeout: 0,
    })
        .then((res) => {
            console.log("群聊邀請外部人員確認傳送 res", res);
            point.value = res.data.point;
        })
        .catch((err) => {
            // console.error(err);
            bugout.value.error(`error-log${userName.value}`, err.response.status);
            bugout.value.error(`error-log${userName.value}`, err.response.data);
            bugout.value.error(`error-log${userName.value}`, err.response.request.responseURL);
            tokenExpireToLogin(err);
        });
    selectOutterPeoplePopUp.value = 0;
    groupChatStore.$reset();
    disable.value = false;
};
//簡訊服務條款popup
const termsPopUp = ref(false);
//無效名單popup
const invalidPopUp = ref(false);
//無效名單搜尋v-model
const search = ref("");
//dataTable
const createColumns = [
    {
        title: "資料編號",
        key: "sn",
        align: "center",
    },
    {
        title: "姓名",
        key: "name",
        align: "center",
    },
    {
        title: "收訊門號",
        key: "mobile",
        align: "center",
    },
    {
        title: "狀態",
        key: "msg",
        align: "center",
    },
];
//無效資料
const data = computed(() => {
    if (search.value.match(/^\+?\d+$/) && invalidList.value !== null) {
        return invalidList.value.filter((item) =>
            item.mobile.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
        );
    } else if (invalidList.value !== null) {
        return invalidList.value.filter((item) =>
            item.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
        );
    } else {
        return [];
    }
});

const pagination = {
    pageSize: 9,
};
//監聽tab
const tab = ref("manual");
const tabChange = (value) => {
    tab.value = value;
};
//更改naive-ui主題
const themeOverrides = {
    common: {},
    Input: {
        border: "1px solid #8b8b8b",
        borderRadius: "4px 4px 4px 4px",
        caretColor: "black",
        borderHover: "transparent",
        borderFocus: "transparent",
        boxShadowFocus: "none",
    },
    Button: {
        textColorHover: "none",
        textColorFocus: "none",
        textColorPressed: "none",
        border: "none",
        borderHover: "none",
        borderFocus: "none",
        borderPressed: "none",
        rippleColor: "none",
    },
};
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.chatRecordCard.n-card.n-modal {
    width: 300px;
    border-radius: 4px;
    background: $white url("~@/assets/Images/chatRecord/lightboxHeader.svg") no-repeat center top;
    background-size: 100% auto;
    .description {
        width: 100%;
        text-align: center;
        margin: 1em auto;
        color: $gray-1;
        font-size: $font-size-16;
        font-weight: 500;
        line-height: 1.6;
    }
    .call_container {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
        li {
            text-align: center;
            .icon {
                display: block;
                width: 60px;
                height: 60px;
                cursor: pointer;
                img {
                    width: 100%;
                }
            }
            button.icon {
                cursor: pointer;
                border: none;
                background: url("~@/assets/Images/common/connect-round.svg") no-repeat center;
            }
        }
        h4.text {
            @extend %h4;
            margin-top: 10px;
            color: $gray-1;
        }
    }
}
.room-wrap {
    height: calc(100% - 80px);
    background-color: $gray-8;
    .msg-wrap {
        position: relative;
        width: 100%;
        margin-top: 15px;
        margin-left: 15px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    .user-info {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-top: 15px;
        margin-left: 15px;
        margin-right: 15px;
    }
}
.chatroom {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    background-color: $gray-8;
    .content {
        border-right: 1px solid rgb(239, 239, 245);
    }
    .notFound {
        height: calc(100% - 80px);
        font-size: $font-size-30;
        padding-top: 15%;
        color: $gray-3;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.selectLabel {
    display: flex;
    .n-input {
        width: 90%;
        border-radius: 20px;
        margin: 0 auto;
    }
}
.SMS_content {
    .n-divider:not(.n-divider--vertical) {
        margin-top: 14.5px;
        margin-bottom: 14.5px;
    }
}
.SMS_setting {
    .n-divider:not(.n-divider--vertical) {
        margin-top: 14.5px;
        margin-bottom: 14.5px;
    }
}
.SMS_setting {
    .tabs {
        &.n-tabs {
            margin-bottom: 40px;
            .n-tabs-tab__label {
                font-size: $font-size-14;
            }
            .n-tabs-nav {
                .n-tabs-tab {
                    color: $gray-3;
                    background-color: $primary-3;
                    border: none;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    padding: 8px 20px;
                }
                .n-tabs-tab--active {
                    background-color: $primary-1;
                    color: #fff;
                }
                .n-tabs-pad {
                    border-bottom: transparent;
                }
            }

            .n-tab-pane {
                width: 100%;
                background-color: $gray-8;
                border-radius: 0px 4px 4px 4px;
                padding-bottom: 20px;
            }
        }
    }
}
.manual__type-area {
    .n-input.n-input--textarea {
        --n-border: 1px solid #8b8b8b !important;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
//外部人員彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .outterPeoplePopUp {
        width: 90%;
        height: 80vh;
        display: flex;
        .SMS_content {
            width: 50%;
            background-color: $white;
            border-radius: 4px;
            padding: 20px;
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 500;
                font-family: $font-family;
            }
            .subject {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                h3 {
                    margin-right: 5px;
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }
            }
            .contentTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                h3 {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    span {
                        color: red;
                        margin-right: 5px;
                    }
                }
                .commonMessage {
                    width: 72px;
                    height: 25px;
                    line-height: 25px;
                    background-color: $primary-1;
                    border-radius: 12.5px;
                    color: $white;
                    font-size: $font-size-12;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
            }
            .inputWrap {
                border: 1px solid $gray-3;
                border-radius: 5px;
                margin-top: 10px;
                margin-bottom: 15px;
            }
            .messageCount {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                .messageInfo {
                    margin-top: 15px;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: flex-start;
                    .wordCount {
                        width: 100px;
                        padding: 10px 0;
                        margin-right: 5px;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .numOfMessage {
                        width: 100px;
                        padding: 10px 0;
                        margin-right: 5px;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .point {
                        width: 100px;
                        padding: 10px 0;
                        border-radius: 20px;
                        background-color: $primary-3;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
        .SMS_setting {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .closeIcon {
                width: 28px;
                position: absolute;
                right: 20px;
                top: 20px;
                cursor: pointer;
            }
            h1 {
                color: $gray-1;
                font-size: $font-size-16;
                font-weight: 500;
                font-family: $font-family;
            }
            h3 {
                color: $gray-3;
                font-size: $font-size-14;
                font-weight: 400;
                font-family: $font-family;
                margin-bottom: 5px;
                text-align: right;
            }
            .manual {
                &__type-area {
                    .n-input {
                        width: 100%;
                        margin-bottom: 10px;
                    }
                }
                &__msg-groupChatCount {
                    color: $danger;
                }
                &__instructions {
                    h4 {
                        color: $gray-1;
                        font-size: $font-size-14;
                        font-weight: 400;
                        margin-top: 5px;
                        margin-bottom: 15px;
                    }
                    p {
                        line-height: 1.4;
                        margin-bottom: 10px;
                    }
                    .instructions__list {
                        list-style-type: decimal;
                        margin-left: 22px;
                        li {
                            color: $gray-1;
                            font-size: $font-size-14;
                            font-weight: 400;
                            font-family: $font-family;
                            line-height: 1.5;
                            margin-bottom: 10px;
                        }
                    }
                }
                .exceedAlert {
                    color: $danger;
                    margin-top: 5px;
                }
            }
            .automatic {
                padding: 0 15px 15px;
                // height:;
                .upload {
                    width: 100%;
                    padding: 10px 0;
                    border-radius: 4px;
                    background-color: $white;
                    border: 1px solid $border-line;
                    display: flex;
                    align-items: center;
                    position: relative;
                    > img {
                        position: absolute;
                        right: 10px;
                        top: 10px;
                        cursor: pointer;
                    }
                    &__file {
                        max-width: 286px;
                        display: flex;
                        align-items: center;
                        margin: 0 auto;
                        .n-upload {
                            max-width: 90px;
                        }
                    }
                    &__img {
                        cursor: pointer;
                        width: 80px;
                        height: 80px;
                        border: 1px dashed $gray-3;
                        border-radius: 50%;
                        background-color: #f9f9f9;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-right: 30px;
                        img {
                            width: 25px;
                            height: 25px;
                        }
                    }
                    &__text {
                        a {
                            text-decoration: none;
                            h2 {
                                font-size: $font-size-16;
                                font-weight: 400;
                                font-family: $font-family;
                                color: $danger;
                                margin-bottom: 5px;
                                &:hover {
                                    text-decoration: underline;
                                }
                            }
                        }
                        h2 {
                            font-size: $font-size-16;
                            font-weight: 400;
                            font-family: $font-family;
                            color: $danger;
                            margin-bottom: 5px;
                        }
                        h3 {
                            @extend %h3;
                            font-family: $font-family;
                            color: black;
                        }
                        p {
                            font-size: $font-size-14;
                            font-weight: 400;
                            font-family: $font-family;
                            color: $gray-3;
                        }
                    }
                }
                &__instructions {
                    padding: 10px;
                    h4 {
                        color: $gray-1;
                        font-size: $font-size-14;
                        font-weight: 600;
                        font-family: $font-family;
                        margin-bottom: 10px;
                        margin-top: 20px;
                    }

                    span {
                        color: $danger;
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    a {
                        text-decoration: none;
                    }
                    .instructions__list {
                        list-style-type: decimal;
                        margin-left: 22px;
                        li {
                            color: $gray-1;
                            font-size: $font-size-14;
                            font-weight: 400;
                            font-family: $font-family;
                            line-height: 1.5;
                            margin-bottom: 10px;
                        }
                    }
                }
                &__name-list {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    > div {
                        display: flex;
                        align-items: center;

                        p + p {
                            margin-left: 30px;
                        }
                    }
                    img {
                        cursor: pointer;
                    }
                }
                .exceedAlert {
                    color: $danger;
                }
            }
            .selectLabel {
                padding: 15px;
                // height: 425px;
                display: flex;
                .selectChannel {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 15px;
                        h1 {
                            color: $gray-1;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                            margin-right: 5px;
                        }
                        p {
                            color: $gray-3;
                            font-size: $font-size-14;
                            font-family: $font-family;
                            font-weight: 400;
                        }
                    }
                    img {
                        width: 14px;
                        height: 14px;
                    }
                    .allChannel {
                        // overflow-y: auto;
                        // height: 300px;
                        margin-top: 20px;
                        .channelList {
                            display: flex;
                            margin-top: 20px;
                            margin-bottom: 10px;
                            .eachChannel {
                                display: flex;
                                align-items: center;
                                height: 40px;
                                margin-left: 15px;
                                img {
                                    width: 42px;
                                    height: 42px;
                                    margin-right: 10px;
                                    margin-left: 15px;
                                    border-radius: 50%;
                                }
                                &__profile {
                                    h1 {
                                        color: $gray-1;
                                        font-size: $font-size-14;
                                        font-weight: 400;
                                        font-family: $font-family;
                                    }
                                }
                            }
                        }
                    }
                }
                .label {
                    width: 50%;
                    overflow-y: auto;
                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        h1 {
                            color: $gray-1;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                        }
                    }
                    .tags {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        border-radius: 4px;
                        padding: 0 5px;
                        // overflow-y: auto;
                        > p {
                            margin-left: 5px;
                            color: $gray-4;
                        }
                        .tag {
                            width: fit-content;
                            background-color: $white;
                            height: 25px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-radius: 20px;
                            border: 1px solid $primary-3;
                            padding: 5px 10px;
                            margin: 5px 5px;
                            cursor: pointer;
                            &.active {
                                background-color: $primary-3;
                            }
                        }
                    }
                }
            }
            .labelCount {
                h1 {
                    text-align: center;
                    margin-top: 5px;
                }
                .alert {
                    color: red;
                }
                p {
                    margin-top: 5px;
                    color: red;
                    text-align: center;
                }
                .confirm {
                    width: 100px;
                    height: 36px;
                    line-height: 36px;
                    margin: auto;
                    text-align: center;
                    background-color: $gray-1;
                    border-radius: 18px;
                    cursor: pointer;
                    margin-top: 20px;
                    p {
                        display: inline;
                        font-size: $font-size-14;
                        font-weight: 400;
                        font-family: $font-family;
                        color: #fff;
                    }
                }
            }
            .next-page {
                width: 170px;
                height: 36px;
                line-height: 36px;
                margin: auto;
                text-align: center;
                background-color: $gray-1;
                border-radius: 18px;
                cursor: pointer;
                margin-top: 50px;
                p {
                    display: inline;
                    font-size: $font-size-14;
                    font-weight: 400;
                    font-family: $font-family;
                    color: #fff;
                }
            }
        }
    }
}
//外部人員確認談窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .outterPeopleConfirm {
        width: 90%;
        height: 80vh;
        display: flex;
        .SMS_content {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .contentTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                }
                .messageCount {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    .messageInfo {
                        margin-top: 15px;
                        margin-bottom: 15px;
                        display: flex;
                        justify-content: flex-start;
                        .wordCount {
                            width: 100px;
                            padding: 10px 0;
                            margin-right: 5px;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .numOfMessage {
                            width: 100px;
                            padding: 10px 0;
                            margin-right: 5px;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .point {
                            width: 100px;
                            padding: 10px 0;
                            border-radius: 20px;
                            background-color: $primary-3;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            }
            .contentWrap {
                background-color: #f9f9f9;
                padding: 15px;
                .subject {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .content {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
            }
        }
        .SMS_recipientInformation {
            width: 50%;
            background-color: $white;
            margin-left: 20px;
            border-radius: 4px;
            padding: 20px;
            position: relative;
            .informationTitle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                h1 {
                    color: $gray-1;
                    font-size: $font-size-16;
                    font-weight: 500;
                    font-family: $font-family;
                }
                img {
                    cursor: pointer;
                }
            }
            .contentWrap {
                background-color: #f9f9f9;
                padding: 15px;
                margin-bottom: 60px;
                .time {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .list {
                    color: $gray-3;
                    margin-bottom: 15px;
                }
                .alertPoint {
                    color: red;
                }
            }
            .outterPopUpButton {
                display: flex;
                justify-content: center;
                align-items: center;
                .previousPage {
                    width: 170px;
                    height: 36px;
                    border: 1px solid $gray-1;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 18px;
                    cursor: pointer;
                }
                .confirm {
                    width: 200px;
                    height: 36px;
                    border-radius: 18px;
                    line-height: 36px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin-left: 15px;
                    cursor: pointer;
                }
                .confirmFail {
                    width: 200px;
                    height: 36px;
                    border-radius: 18px;
                    line-height: 36px;
                    text-align: center;
                    color: $white;
                    background-color: $gray-1;
                    margin-left: 15px;
                    &.disable {
                        background-color: $gray-4;
                    }
                }
            }
        }
    }
}
//簡訊服務條款彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .popUp {
        border-radius: 5px;
        width: 900px;
        min-height: 658px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        &__title {
            position: relative;
            h2 {
                text-align: center;
                margin-bottom: 30px;
                @extend %h2;
            }
            img {
                position: absolute;
                right: -20px;
                top: -20px;
                cursor: pointer;
            }
        }
        .instructions__list {
            list-style-type: decimal;
            margin-left: 22px;
            li {
                color: $gray-1;
                font-size: $font-size-14;
                font-weight: 400;
                font-family: $font-family;
                line-height: 1.5;
                margin-bottom: 10px;
            }
        }
        &__confirm {
            width: 100px;
            height: 36px;
            margin: 0 auto;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
        }
    }
}
//無效名單彈窗
.mask {
    .invalidList {
        width: 900px;
        height: 700px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .popUpTitle {
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 60px;
            font-size: $font-size-16;
            font-weight: 500;
            color: $gray-1;
        }
        img {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
    .invalidFunctionBar {
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
        .invalidSearch {
            width: 700px;
            border-radius: 20px;
            box-shadow: 1px 2px 4px 0 $gray-6;
            &.n-input .n-input__border,
            &.n-input .n-input__state-border {
                border: 1px solid $border-line;
            }
            &.n-input:not(.n-input--disabled):hover .n-input__state-border {
                border: none;
            }
            &.n-input:not(.n-input--disabled).n-input--focus {
                background-color: none;
            }
            &.n-input:not(.n-input--disabled).n-input--focus .n-input__state-border {
                border: none;
                box-shadow: none;
            }
            &.n-input .n-input__input-el,
            &.n-input .n-input__textarea-el {
                caret-color: $gray-2;
            }
        }
        .invalidCancel {
            width: 100px;
            height: 36px;
            background-color: $white;
            line-height: 36px;
            color: $gray-1;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
        .invalidConfirm {
            width: 100px;
            height: 36px;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
    }
}
// 常用簡訊
.mask {
    .commonMsg {
        border-radius: 5px;
        width: 900px;
        height: 700px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .popUpTitle {
        position: relative;
        h2 {
            text-align: center;
            margin-bottom: 60px;
            font-size: $font-size-16;
            font-weight: 500;
            color: $gray-1;
        }
        img {
            position: absolute;
            right: 0;
            top: 0;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
    .commonMsgFunctionBar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;
        .commonMsgDel {
            text-align: center;
            width: 100px;
            height: 36px;
            line-height: 36px;
            border-radius: 18px;
            border: 1px solid $danger;
            color: $danger;
            cursor: pointer;
        }
        .commonMsgAdd {
            width: 100px;
            height: 36px;
            background-color: $white;
            line-height: 36px;
            color: $gray-1;
            border: 1px solid $gray-1;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
        .commonMsgConfirm {
            width: 100px;
            height: 36px;
            background-color: $gray-1;
            line-height: 36px;
            color: $white;
            border-radius: 18px;
            text-align: center;
            cursor: pointer;
            margin-left: 30px;
        }
    }
}
//新增常用簡訊
.storeCommonMessage {
    width: 100px;
    height: 25px;
    line-height: 25px;
    background-color: $primary-1;
    border-radius: 12.5px;
    text-align: center;
    cursor: pointer;
    p {
        color: $white;
        font-size: $font-size-12;
        font-weight: 400;
        font-family: $font-family;
    }
}
.mask {
    .commonMsg {
        border-radius: 5px;
        width: 900px;
        height: 700px;
        padding: 30px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .popUpTitle {
            position: relative;
            h2 {
                text-align: center;
                margin-bottom: 60px;
                font-size: $font-size-16;
                font-weight: 500;
                color: $gray-1;
            }
            img {
                position: absolute;
                right: 0;
                top: 0;
                width: 32px;
                height: 32px;
                cursor: pointer;
            }
        }
        .smsSubject {
            width: 60%;
            margin: 0 auto;
            margin-top: 30px;
            margin-bottom: 30px;
            .subject {
                display: flex;
                margin-bottom: 15px;
                h3 {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                    display: inline-block;
                    min-width: 56px;
                }
                p {
                    font-size: $font-size-12;
                    font-weight: 400;
                    color: $gray-3;
                    font-family: $font-family;
                    line-height: 1.6;
                }
            }
        }
        .smsSendContent2 {
            width: 60%;
            margin: 0 auto;
            .lazyWrap {
                display: flex;
                justify-content: flex-start;
                width: 200px;
            }

            .contentTitle {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                h3 {
                    font-size: $font-size-14;
                    font-weight: 400;
                    color: $gray-1;
                    font-family: $font-family;
                }

                .commonMessage {
                    width: 72px;
                    height: 25px;
                    line-height: 25px;
                    background-color: $primary-1;
                    border-radius: 12.5px;
                    color: $white;
                    font-size: $font-size-12;
                    font-weight: 400;
                    font-family: $font-family;
                    text-align: center;
                    cursor: pointer;
                }
                .n-input {
                    font-size: $font-size-12;
                }
            }
        }

        .messageCount {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-left: 170px;
            .messageInfo {
                margin-top: 15px;
                margin-bottom: 15px;
                display: flex;
                justify-content: flex-start;
                .wordCount {
                    width: 100px;
                    padding: 10px 0;
                    margin-right: 5px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .numOfMessage {
                    width: 100px;
                    padding: 10px 0;
                    margin-right: 5px;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .point {
                    width: 100px;
                    padding: 10px 0;
                    border-radius: 20px;
                    background-color: $primary-3;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
}
// 刪除常用簡訊彈窗
.mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteCommonMsgPopUp {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteCommonMsgConfirm {
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
                background-color: rgba(223, 54, 54, 0.7);
                color: $white;
                &:hover,
                &:active {
                    background-color: #df3636;
                }
            }
        }
    }
}
</style>

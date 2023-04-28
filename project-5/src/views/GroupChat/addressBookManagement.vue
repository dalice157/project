<template>
    <div class="addressBookManagement">
        <n-scrollbar style="max-height: calc(100vh - 180px)">
            <div class="addressBookSetting">
                <div class="addressBookSetting__title">
                    <h2>通訊錄設定</h2>
                    <n-divider />
                </div>
                <div class="addressBookSetting__content">
                    <n-tabs class="tabs" type="card" default-value="department">
                        <n-tab-pane name="department" tab="新增部門別">
                            <div class="department" v-show="departmentStatus === 'addDepartment'">
                                <h1>新增部門</h1>
                                <n-scrollbar style="max-height: 300px" trigger="none">
                                    <div class="addDepartment">
                                        <div
                                            class="addDepartment__input"
                                            v-for="department in departmentArr"
                                            :key="department.departmentID"
                                        >
                                            <n-input
                                                :class="{ isRepeat: department.isRepeat }"
                                                placeholder="請輸入部門名稱"
                                                v-model:value="department.name"
                                                >{{ department.name }}</n-input
                                            >
                                            <img
                                                :src="deleteIcon"
                                                @click="deleteQuestion(department.departmentID)"
                                            />
                                        </div>
                                        <h2 @click="addDepartment">+新增部門欄位</h2>
                                    </div>
                                </n-scrollbar>
                                <div class="button-group">
                                    <div class="button--cancel" @click="cancelSaveDepartment">
                                        取消
                                    </div>
                                    <div class="button--save" @click="saveDepartment">確認儲存</div>
                                </div>
                            </div>
                            <div
                                class="departmentList"
                                v-show="departmentStatus === 'departmentList'"
                            >
                                <h1>部門列表</h1>
                                <img
                                    class="editDepartment"
                                    :src="editIcon"
                                    @click="departmentStatus = 'addDepartment'"
                                />
                                <n-scrollbar style="max-height: 300px" trigger="none">
                                    <div
                                        class="eachDepartment"
                                        v-for="department in departmentArr"
                                        :key="department.departmentID"
                                    >
                                        <img :src="departmentIcon" />
                                        <p>{{ department.name }}</p>
                                    </div>
                                </n-scrollbar>
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="automatic" tab="載入大量名單">
                            <div class="automatic" :class="{ haveFile: uploadRef !== null }">
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
                                            <div
                                                class="example"
                                                v-if="uploadRef === null"
                                                @click="downloadAddressBookData"
                                            >
                                                <h2>下載名單範例檔</h2>
                                            </div>
                                            <h2 v-else>已上傳成功</h2>
                                            <h3 v-if="uploadRef === null">
                                                範例檔編輯完成直接上傳
                                            </h3>
                                            <p v-else>{{ fileName }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="automatic__instructions">
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
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="addressBook" tab="通訊錄列表">
                            <div class="addressBook">
                                <div class="addressBook__functionBar">
                                    <n-input
                                        class="addressBook__functionBar--search"
                                        v-model:value="search"
                                        type="text"
                                        placeholder="搜尋姓名、部門名稱"
                                    >
                                        <template #prefix>
                                            <img :src="searchIcon" alt="search" />
                                        </template>
                                    </n-input>
                                    <div
                                        class="downloadAddressBook"
                                        @click="downloadAddressBookData"
                                    >
                                        下載
                                    </div>
                                </div>
                                <div class="addressBook__dataTable">
                                    <n-data-table
                                        class="address_table"
                                        :bordered="false"
                                        :scroll-x="1200"
                                        :max-height="350"
                                        :row-key="(row) => row.account"
                                        :columns="createColumns({ modify, store })"
                                        :data="data"
                                        :pagination="pagination"
                                        :bottom-bordered="false"
                                        :loading="addressBookLoading"
                                        :on-update:page="updatePage"
                                    />
                                </div>
                            </div>
                        </n-tab-pane>
                    </n-tabs>
                </div>
            </div>
        </n-scrollbar>
    </div>
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
    <!-- 刪除頻道彈窗 -->
    <teleport to="body">
        <div class="mask1" v-show="showDelModal">
            <div class="deleteChannelPopUp">
                <div class="deleteChannelConfirm">您確定要刪除此活動頻道!!</div>
                <div class="buttonContainer">
                    <div type="button" class="cancel" @click="cancelDelete">取消</div>
                    <div type="button" class="confirm" @click="removeDepartment">確定</div>
                </div>
            </div>
        </div>
    </teleport>
    <AlertPopUp :alertMessage="alertMessage" @clearAlertMessage="clearAlertMessage" />
</template>

<script setup>
import { onMounted, ref, watch, computed, h, reactive, getCurrentInstance } from "vue";
import {
    NDivider,
    NTabs,
    NTabPane,
    NUpload,
    NInput,
    NDataTable,
    NIcon,
    NScrollbar,
    NSelect,
} from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useChatStore } from "@/store/chat";
import { useSmsStore } from "@/store/smsStore";
import { useMmsStore } from "@/store/mmsStore";
import { useApiStore } from "@/store/api";
import { useModelStore } from "@/store/model";

import config from "@/config/config";
import { nanoid } from "nanoid";
import { isphone } from "@/util/commonUtil";
import checkIcon from "@/assets/Images/groupChat/check_o.svg";
import delIcon from "@/assets/Images/manage/delete.svg";
import fileIcon from "@/assets/Images/common/file.svg";
import editIcon from "@/assets/Images/manage/edit-round.svg";
import editIcon2 from "@/assets/Images/manage/edit-round_w.svg";
import closeIcon from "@/assets/Images/chatroom/close-round.svg";
import deleteIcon from "@/assets/Images/groupChat/round-fill_close_g.svg";
import searchIcon from "@/assets/Images/manage/search.svg";
import departmentIcon from "@/assets/Images/groupChat/department.svg";
import AlertPopUp from "@/components/AlertPopUp.vue";

//api store
const apiStore = useApiStore();
const {
    excelVerification,
    addressBookGetData,
    modifyAddressBookData,
    downloadAddressBookData,
    excelUpload,
    getDepartment,
    editDepartment,
} = apiStore;
const { uploadRef, addressBookList, addressBookLoading, addressBookDepartment } =
    storeToRefs(apiStore);
//chat Store
const chatStore = useChatStore();
const { isIllegalCharacter } = chatStore;
//modal store
const modelStore = useModelStore();
const { uploadAnimationBoolean } = storeToRefs(modelStore);

//alert popup
const alertMessage = ref("");
const clearAlertMessage = () => {
    alertMessage.value = "";
};
//初始部門列表
onMounted(() => {
    getDepartment();
});
const departmentStatus = ref("departmentList");
const departmentArr = computed({
    get() {
        console.log("拿到部門列表", addressBookDepartment.value);
        return addressBookDepartment.value === null ? [] : addressBookDepartment.value;
    },
    set(val) {
        addressBookDepartment.value = val;
    },
});
//新增部門
const addDepartment = () => {
    departmentArr.value.push({ name: "", departmentID: nanoid(), isRepeat: false });
};
//部門刪除相關值
const showDelModal = ref(false);
const deleteID = ref("");
//刪除彈窗
const deleteQuestion = (id) => {
    showDelModal.value = true;
    deleteID.value = id;
};
//取消刪除
const cancelDelete = () => {
    showDelModal.value = false;
    deleteID.value = "";
};
//刪除部門
const removeDepartment = () => {
    departmentArr.value = departmentArr.value.filter((department) => {
        return department.departmentID !== deleteID.value;
    });
    deleteID.value = "";
    showDelModal.value = false;
};
//取消儲存
const cancelSaveDepartment = () => {
    getDepartment();
    departmentStatus.value = "departmentList";
};
//新增部門確認儲存
const saveDepartment = () => {
    //判斷有空白欄位填寫
    let departmentArrIsEmpty = departmentArr.value.some((department) => department.name === "");
    if (departmentArrIsEmpty === true) {
        alertMessage.value = "尚有部門填寫處為空白!!";
        return;
    }
    //判斷部門名稱重複
    let repeatArr = [];
    departmentArr.value = departmentArr.value.reduce((arr, item) => {
        let repeatBoolean = arr.some((each) => each.name.trim() === item.name.trim());
        if (!repeatBoolean) {
            item.isRepeat = false;
            arr.push(item);
        } else {
            item.isRepeat = true;
            arr.push(item);
            repeatArr.push(item);
        }
        return arr;
    }, []);
    if (repeatArr.length !== 0) {
        alertMessage.value = "有部門名稱重複!!";
        return;
    }
    //新增的部門刪除departmentID
    departmentArr.value.forEach((item) => {
        delete item.isRepeat;
        if (typeof item.departmentID === "string") {
            delete item.departmentID;
        }
    });
    // console.log("最後須提交的部門陣列", departmentArr.value);
    const dataArr = { data: departmentArr.value };
    editDepartment(dataArr);
    departmentStatus.value = "departmentList";
};
//簡訊服務條款popup
const termsPopUp = ref(false);
//excel 上傳功能
const fileName = ref("");
const handleChange = (e) => {
    uploadAnimationBoolean.value = true;
    fileName.value = e.file.file.name;
    excelUpload(e.file.file);
};
onMounted(() => {
    addressBookGetData();
});
//搜尋table功能
const search = ref("");
const departmentOptions = computed(() => {
    let arr = [];
    arr = addressBookDepartment.value.map((item) => {
        return {
            label: item.name,
            value: item.name,
            departmentID: item.departmentID,
        };
    });
    return arr;
});
//得知現在第幾頁
const pageRef = ref(1);
const updatePage = (page) => {
    pageRef.value = page;
};
//table column
const createColumns = ({ modify, store }) => [
    {
        title: "帳號 (必填)",
        key: "account",
        align: "center",
        width: 60,
        className: "account",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: row.account,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].account = v;
                      },
                  })
                : row.account;
        },
    },
    {
        title: "姓名/名稱 (必填)",
        key: "name",
        align: "center",
        width: 70,
        className: "name",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: row.name,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].name = v;
                      },
                  })
                : row.name;
        },
    },
    {
        title: "手機號碼 (必填)",
        key: "mobile",
        align: "center",
        width: 80,
        className: "mobile",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: String(row.mobile),
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].mobile = v;
                      },
                  })
                : row.mobile;
        },
    },
    {
        title: "Email",
        key: "email",
        align: "center",
        width: 100,
        className: "email",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: row.email,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].email = v;
                      },
                  })
                : row.email;
        },
    },
    {
        title: "部門",
        key: "departmentName",
        align: "center",
        width: 100,
        className: "departmentName",
        render(row, index) {
            return row.isEdit
                ? h(NSelect, {
                      value: row.departmentName ? row.departmentName : "請選擇",
                      options: departmentOptions.value,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].departmentName = v;
                      },
                  })
                : row.departmentName;
        },
    },
    {
        title: "職稱",
        key: "role",
        align: "center",
        width: 80,
        className: "role",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: row.role,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].role = v;
                      },
                  })
                : row.role;
        },
    },
    {
        title: "公司電話",
        key: "telephone",
        align: "center",
        width: 80,
        className: "telephone",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: row.telephone,
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].telephone = v;
                      },
                  })
                : row.telephone;
        },
    },
    {
        title: "分機",
        key: "extension",
        align: "center",
        width: 60,
        className: "extension",
        render(row, index) {
            return row.isEdit
                ? h(NInput, {
                      value: String(row.ext),
                      onUpdateValue(v) {
                          data.value[index + (pageRef.value - 1) * 20].ext = v;
                      },
                  })
                : row.ext;
        },
    },
    {
        title: "",
        key: "edit",
        align: "center",
        width: 30,
        render(row, index) {
            if (row.isEdit === false) {
                return h("img", {
                    src: index % 2 === 0 ? editIcon : editIcon2,
                    class: "hover",
                    onClick: () => modify(row),
                });
            } else {
                return h("img", {
                    src: checkIcon,
                    class: "hover",
                    style: "width:32px",
                    onClick: () => store(row),
                });
            }
        },
    },
];

//測試 修改整行
const modify = (row) => {
    addressBookList.value.forEach((item) => {
        if (item.account === row.account) {
            item.isEdit = true;
        } else {
            item.isEdit = false;
        }
    });
};
//測試 儲存整行
const store = (row) => {
    addressBookList.value.forEach((item) => {
        if (item.account === row.account) {
            //判斷必填
            if (item.account === "" || item.name === "" || item.mobile === "") {
                alertMessage.value = "尚有必填欄位空白";
                return;
            }
            item.isEdit = false;
            // 找出 patch 的departmentID
            let patchDepartmentID = 0;
            departmentOptions.value.forEach((option) => {
                if (item.departmentName === option.value) {
                    patchDepartmentID = option.departmentID;
                }
            });

            let modifyData = {
                accountID: item.accountID,
                account: item.account,
                name: item.name,
                mobile: item.mobile,
                email: item.email,
                departmentID: patchDepartmentID,
                role: item.role,
                telephone: item.telephone,
                ext: item.ext,
            };
            // console.log("modifyData", modifyData);
            modifyAddressBookData(modifyData);
        }
    });
};

//table 資料
const data = computed(() => {
    return addressBookList.value.filter((item) => {
        return (
            item.name.toLowerCase().includes(`${search.value.trim().toLowerCase()}`) ||
            item.department.toLowerCase().includes(`${search.value.trim().toLowerCase()}`)
        );
    });
});
//分頁
const pagination = reactive({
    pageSize: 20,
});
</script>

<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.addressBookManagement {
    background-color: $white;
    width: 100%;
    border-radius: 4px;
    .n-divider--no-title {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .tabs {
        height: 100%;
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
                // padding-bottom: 20px;
            }
        }
    }
}
.addDepartment__input {
    .n-input {
        &.isRepeat {
            border: 2px solid $danger;
            --n-border: transparent !important;
        }
    }
}
.addressBook__functionBar--search {
    width: 100%;
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
        caret-color: $primary-1;
    }
    &.n-input .n-input__input-el {
        height: 36px;
        line-height: 36px;
        font-size: $font-size-14;
    }
}
.address_table {
    &.n-data-table .n-data-table-thead {
        background-color: $primary-4;
    }
    &.n-data-table .n-data-table-th {
        background-color: $primary-4;
        font-weight: bold;
        color: $gray-1;
        border: none;
        &.deduction {
            color: $danger;
        }
    }
    &.n-data-table .n-data-table-tr:nth-child(even) {
        background: $primary-4;
    }
    &.n-data-table .n-data-table-td {
        background: none;
        border: none;
        padding: 15px;
        vertical-align: middle;
    }
    &.n-data-table .n-data-table-tr:hover {
        background: $primary-4;
    }
    &.n-data-table .n-data-table-tr:hover .n-data-table-td {
        background: none;
    }
    .deduction {
        color: $danger;
    }
    .link {
        color: $gray-1;
        &:hover {
            color: $primary-1;
        }
        &:visited {
            color: $primary-1;
        }
    }
    .clickable {
        color: blue;
        text-decoration: underline;
    }
    .scroll {
        overflow: auto;
        &::-webkit-scrollbar-track {
            border-radius: 5px;
            cursor: pointer;
        }
        &::-webkit-scrollbar {
            width: 5px;
        }
        &:hover::-webkit-scrollbar-thumb {
            border-radius: 5px;
            cursor: pointer;
            -webkit-box-shadow: inset 5px 5px 5px $gray-4;
        }
    }
    .hover {
        cursor: pointer;
    }
    .subject {
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    .content {
        width: 150px;
        max-height: 150px;
    }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";

.addressBookManagement {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 45px;
    margin-bottom: 30px;
    height: calc(100vh - 120px);
    .addressBookSetting {
        background-color: $white;
        padding: 25px 20px;
        border-radius: 4px;
        // height: calc(100vh - 180px);
        &__title {
            margin-bottom: 20px;
            padding: 0 20px;
            h2 {
                font-family: $font-family;
                @extend %h2;
                color: $gray-1;
            }
        }
        &__content {
            padding: 0 20px;
            .department {
                h1 {
                    text-align: center;
                    font-family: $font-family;
                    color: $gray-1;
                    font-weight: 400;
                    font-size: $font-size-16;
                    margin-bottom: 30px;
                }
                .addDepartment {
                    max-width: 530px;
                    margin: 0 auto;
                    &__input {
                        display: flex;
                        margin: 15px 0;
                        img {
                            width: 14px;
                            margin-left: 15px;
                            cursor: pointer;
                        }
                    }
                    h2 {
                        display: inline-block;
                        float: right;
                        clear: both;
                        margin-top: 15px;
                        margin-right: 30px;
                        color: $primary-1;
                        font-size: $font-size-14;
                        font-weight: 500;
                        font-family: $font-family;
                        cursor: pointer;
                    }
                }
                .button-group {
                    display: flex;
                    justify-content: center;
                    margin-top: 75px;
                    margin-bottom: 60px;
                    .button--cancel {
                        width: 100px;
                        height: 36px;
                        line-height: 36px;
                        border: 1px solid $gray-1;
                        border-radius: 18px;
                        text-align: center;
                        margin: 0 15px;
                        cursor: pointer;
                        text-decoration: none;
                        color: $gray-1;
                    }
                    .button--save {
                        width: 200px;
                        height: 36px;
                        line-height: 36px;
                        border: 1px solid $gray-1;
                        border-radius: 18px;
                        text-align: center;
                        color: $white;
                        background-color: $gray-1;
                        margin: 0 15px;
                        cursor: pointer;
                    }
                }
            }
            .departmentList {
                position: relative;
                .editDepartment {
                    position: absolute;
                    right: 0;
                    top: 0;
                    cursor: pointer;
                }
                h1 {
                    text-align: center;
                    font-family: $font-family;
                    color: $gray-1;
                    font-weight: 400;
                    font-size: $font-size-16;
                    margin-bottom: 20px;
                }
                .eachDepartment {
                    display: flex;
                    align-items: center;
                    border: 1px solid $primary-3;
                    padding: 10px;
                    max-width: 530px;
                    margin: 10px auto;
                    p {
                        margin-left: 10px;
                        font-family: $font-family;
                        color: $gray-1;
                        font-weight: 500;
                        font-size: $font-size-14;
                    }
                }
            }
            .automatic {
                display: flex;
                padding: 0 15px 15px;
                &.haveFile {
                    align-items: flex-start;
                }
                .upload {
                    width: 70%;
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
                        .example {
                            width: 140px;
                            margin: 0 auto;
                            background-color: $primary-3;
                            border-radius: 18px;
                            cursor: pointer;
                            padding: 8px 20px;
                            margin-bottom: 5px;
                            h2 {
                                font-size: $font-size-14;
                                font-weight: 500;
                                font-family: $font-family;
                                color: $gray-1;
                            }
                        }
                        h2 {
                            text-align: center;
                            font-size: $font-size-16;
                            font-weight: 500;
                            font-family: $font-family;
                            color: $danger;
                            margin-bottom: 2px;
                        }
                        h3 {
                            // @extend %h3;
                            font-size: $font-size-14;
                            font-family: $font-family;
                            font-weight: 400;
                            color: $gray-1;
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
                    }

                    span {
                        color: $danger;
                        cursor: pointer;
                        text-decoration: underline;
                    }
                    a {
                        text-decoration: none;
                    }
                }
            }
            .addressBook {
                padding: 0 15px 15px;
                &__functionBar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .n-input {
                        width: 60%;
                        border-radius: 20px;
                        img {
                            width: 15px;
                            height: 15px;
                        }
                    }
                    .downloadAddressBook {
                        width: 100px;
                        height: 36px;
                        line-height: 36px;
                        border: 1px solid $gray-1;
                        border-radius: 18px;
                        text-align: center;
                        background-color: $white;
                        color: $gray-1;
                        cursor: pointer;
                        box-shadow: 0px 2px 4px #d7d7d7;
                    }
                }
                &__dataTable {
                    .address_table {
                    }
                }
            }
        }
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
.mask1 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .deleteChannelPopUp {
        border-radius: 5px;
        width: 342px;
        padding: 15px;
        background-color: $white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .deleteChannelConfirm {
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
                border: 1px solid black;
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

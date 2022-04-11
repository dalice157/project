<template>
    <div class="wrap">
        <header class="header">
            <n-button type="primary" color="#ffb400" text-color="#fff" @click="gotoAutoReply"
                >建立</n-button
            >
            <n-button color="#e4e4e4" text-color="#3E3E3E" @click="gotoChannelList"
                >返回活動頻道管理</n-button
            >
        </header>
        <n-data-table
            class="autoReply_table"
            :bordered="false"
            :scroll-x="1200"
            :columns="createColumns"
            :data="data"
            :pagination="pagination"
            :bottom-bordered="false"
        />
    </div>
</template>
<script lang="ts" setup>
import { ref, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NButton, NDataTable, NSwitch } from "naive-ui";

//router 資訊
const router = useRouter();
const route = useRoute();

const pagination = {
    pageSize: 6,
};

const createColumns = [
    {
        title: "標題",
        key: "title",
        align: "center",
        width: 100,
    },
    {
        title: "關鍵字",
        key: "tags",
        align: "center",
        width: 100,
    },
    {
        title: "回應內容",
        key: "content",
    },
    {
        title: "指定日期時間",
        key: "time",
        align: "center",
    },
    {
        title: "狀態",
        key: "state",
        align: "center",
        render(row, index) {
            return h(NSwitch, {
                checkedValue: "1",
                uncheckedValue: "0",
                defaultValue: row.state,
                onUpdate: (value) => {
                    row.state = value;
                },
            });
        },
    },
] as any;

const data = ref([
    {
        key: 0,
        title: "週年慶優惠活動",
        tags: "+1、加一、加加",
        content: "最新優惠活動優惠活動快截止了，要買要快喔  http://e8d.tw/sample",
        time: "2021/12/11 15:14:20",
        state: "0",
    },
    {
        key: 1,
        title: "下班時間回應",
        tags: "+1、加一、加加、加一",
        content: "週年慶優惠活動週年慶優惠活動週年慶優惠活動",
        time: "2021/12/11 15:14:20",
        state: "1",
    },
    {
        key: 2,
        title: "禮盒活動",
        tags: "+1、加一、加加",
        content: "禮盒活動禮盒活動禮盒活動",
        time: "2021/12/11 15:14:20",
        state: "1",
    },
]);

const gotoAutoReply = () => {
    route.params.id
        ? router.push(
              `/manage/${route.params.id}/activitySetting/addAutoReply?eventID=${route.query.eventID}`
          )
        : router.push(`/manage/activitySetting/addAutoReply?eventID=${route.query.eventID}`);
};
const gotoChannelList = () => {
    route.params.id
        ? router.push(`/manage/${route.params.id}/activitySetting`)
        : router.push(`/manage/activitySetting`);
};
</script>
<style lang="scss">
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.autoReply_table {
    &.n-data-table .n-data-table-thead {
        background-color: $primary-5;
    }
    &.n-data-table .n-data-table-th {
        background-color: $primary-5;
        font-weight: bold;
        color: $gray-1;
        border: none;
        &.deduction {
            color: $danger;
        }
    }
    &.n-data-table .n-data-table-tr:nth-child(even) {
        background: $primary-5;
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
}
</style>
<style lang="scss" scoped>
@import "~@/assets/scss/extend";
@import "~@/assets/scss/var";
.wrap {
    background-color: $bg;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    min-height: calc(100% - 80px);
}
.header {
    text-align: right;
    margin-bottom: 10px;
    button + button {
        margin-left: 8px;
    }
}
</style>

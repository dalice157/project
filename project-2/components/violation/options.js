const byUserOptions = [
    {
        label: '會員編號',
        value: 'basicId'
    },
    {
        label: '身份證字號',
        value: 'identity'
    },
    {
        label: 'PID',
        value: 'pid'
    },
];
// 
const targetType = [
    {
        label: '全部',
        value: 0
    },
    {
        label: '高手',
        value: 1
    },
    {
        label: '案主',
        value: 2
    }
];

const causeType = [
    {
        label: '全部',
        value: 0
    },
    {
        label: '合作中聯絡不上',
        value: 1
    },
    {
        label: '刊登資訊不實',
        value: 2
    },
    {
        label: '案件有交易糾紛',
        value: 3
    },
    {
        label: '補教冒充個人刊登',
        value: 4
    },
    {
        label: '安全疑慮',
        value: 5
    },
    {
        label: '性騷擾',
        value: 6
    },
    {
        label: '其他',
        value: 7
    }
];

const handleStatus = [
    {
        label: '待處理',
        value: 0
    },
    {
        label: '處理中',
        value: 1
    },
    {
        label: '已處理',
        value: 2
    }
];
const staffHandleStatus = [
    // 1:聯絡不到檢舉人，尚無法確認 2:聯絡不到被檢舉人，尚無法確認 3:聯絡不到雙方，尚無法確認 4:已聯絡到雙方，取得資訊，待審核確認中
    // 5:為惡意檢舉，無事證，無需處理 6:檢舉資料不足，無需處理 7:檢舉事證明確，被檢舉人無否認
    {
        label: '聯絡不到檢舉人，尚無法確認',
        value: 1
    },
    {
        label: '聯絡不到被檢舉人，尚無法確認',
        value: 2
    },
    {
        label: '聯絡不到雙方，尚無法確認',
        value: 3
    },
    {
        label: '已聯絡到雙方，取得資訊，待審核確認中',
        value: 4
    },
    {
        label: '為惡意檢舉，無事證，無需處理',
        value: 5
    },
    {
        label: '檢舉資料不足，無需處理',
        value: 6
    },
    {
        label: '檢舉事證明確，被檢舉人無否認',
        value: 7
    }
];

const hostingHandleStatus = [
    {
        label: '不扣款，不下架',
        value: 1
    },
    {
        label: '不扣款，需下架',
        value: 2
    },
    {
        label: '扣款並下架',
        value: 3
    },
]

const carrierType = [
    {
        label: '捐贈(創世基金會)',
        value: 1
    },
    {
        label: '手機載具',
        value: 2
    },
    {
        label: '會員載具',
        value: 3
    },
    {
        label: '索取紙本',
        value: 4
    }
]

export {
    byUserOptions,
    targetType,
    causeType,
    handleStatus,
    staffHandleStatus,
    hostingHandleStatus,
    carrierType
};
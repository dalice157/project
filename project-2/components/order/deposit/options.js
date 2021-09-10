const byUserOptions = [
  {
    label: '會員編號',
    value: 'basicId'
  },
  {
    label: '案件編號',
    value: 'demandId'
  },
  {
    label: '付款序號',
    value: 'payNo'
  },
  {
    label: '代收單號',
    value: 'orderNo'
  },
  {
    label: 'MDM no',
    value: 'mdmNo'
  },
  {
    label: 'PID',
    value: 'pid'
  },
];

// 1:order 2:tx-save 3:apply-refound 4:tx-refund 5:tx-pay"
const statusTypes = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '未付款',
    value: 1
  },
  {
    label: '上線中',
    value: 2
  },
  {
    label: '申請/待辦',
    value: 3
  },
  {
    label: '結案/已退款',
    value: 4
  },
  {
    label: '押金轉收入',
    value: 5
  }
];

const applyType = {
  1: '(自行退款)',
  2: '(到期退款)',
  3: '(檢舉轉收入)'
};

const roleTypes = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '高手',
    value: 1
  },
  {
    label: '案件',
    value: 2
  }
];

// 1:付款成功 2:付款失敗 3:取號未付
const payOpts = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '付款成功',
    value: 1
  },
  {
    label: '付款失敗',
    value: 2
  },
  {
    label: '取號未付',
    value: 3
  }
];

export {
  byUserOptions,
  statusTypes,
  applyType,
  roleTypes,
  payOpts
};

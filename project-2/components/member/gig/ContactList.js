import React from 'react';
import { Table } from 'antd';
import PagerInfo from '../../ui/pagerInfo.js';
import { dateFormat } from '../../../util/formatUtil';

const ContactList = ({
  data, nextPage, nextKey, loading
}) => {
  const columns = [
    {
      title: '查閱日期',
      dataIndex: 'createDate',
      render: createData => dateFormat(createData, true)
    },
    {
      title: '案件編號',
      dataIndex: 'demandId',
    },
    {
      title: '案件標題',
      dataIndex: 'demandTitle',
      render: (demandTitle, demandData) => {
        const { demandId, demanderId } = demandData;
        return <a href={ `/admin/demand/edit/${demanderId}?demandId=${demandId.split('-')[1]}` } target="_blank" rel="noreferrer noopener">{demandTitle}</a>;
      }
    },
    {
      title: '案件聯絡人姓名',
      dataIndex: 'contactName',
    },
    {
      title: '案件聯絡人電話',
      dataIndex: 'contactCellphone',
      render: (contactCellphone, demandData) => {
        const { contactTelArea, contactTel } = demandData;
        return (
          <>
            {contactCellphone !== null ? contactCellphone : ''}
            <br />
            {contactTelArea !== null && contactTel !== null ? `${contactTelArea}-${contactTel}` : ''}
          </>
        );
      }
    },
  ];

  return (
    <div>
      <PagerInfo data={ data } nextPage={ nextPage } nextKey={ nextKey } />
      <Table rowKey="demandId" columns={ columns } dataSource={ data } pagination={ false } loading={ loading } />
      <PagerInfo data={ data } nextPage={ nextPage } nextKey={ nextKey } />
    </div>
  );
};

export default ContactList;

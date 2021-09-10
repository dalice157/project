import React from 'react';
import { dateFormat } from '../../../util/formatUtil.js';
import { mappingStaffName } from '../../../util/commonUtil.js';
import './memo.scss';
import CreateMarkup from '../../common/CreateMarkUp';

const tabGig = ({ data, visible }) => {
  return (
    <table className="table">
      <tbody>
        {
          data && data.slice(0, visible).map((item, key) => {
            return (
              <tr key={ key }>
                <td width="25%">
                  <div className="date">{dateFormat(item.createDate, true)}</div>
                  <div className="name">【{item.staff ? mappingStaffName(item.staff) : item.clerk}】</div>
                </td>
                <td><CreateMarkup text={ item.memo } memoSource={ item.memoSource } /></td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default tabGig;

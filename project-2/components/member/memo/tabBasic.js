import React from 'react';
import { dateFormat, replaceAreaNo } from '../../../util/formatUtil.js';
import { mappingStaffName } from '../../../util/commonUtil.js';
import './memo.scss';


const tabBasic = ({ data, visible, area }) => {
  return (
    <table className="table">
      <tbody>
        {
        data && data.slice(0, visible).map((item, index) => {
          return (
            <tr key={ index }>
              <td width="25%">
                <div className="date">{ dateFormat(item.createDate, true) }</div>
                <div className="name">【{item.staff ? mappingStaffName(item.staff) : item.clerk}】</div>
              </td>
              <td>{replaceAreaNo(item.memo, area)}</td>
            </tr>
          );
        })
      }
      </tbody>
    </table>
  );
};

export default tabBasic;

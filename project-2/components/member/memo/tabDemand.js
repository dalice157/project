import React from 'react';
import { dateFormat } from '../../../util/formatUtil.js';
import { mappingStaffName } from '../../../util/commonUtil.js';
import './memo.scss';


const tabDemand = ({ data, visible }) => {
  let preItem = null;
  return (
    <table className="table">
      <tbody>
        {
          visible && data && data.map((item, index) => {
            const showDemandTR = preItem == null || preItem.memoSource !== item.memoSource;
            preItem = item;
            return (
              <React.Fragment key={ index }>
                {
                showDemandTR && (
                <tr className="no">
                  <td width="25%">案件編號</td>
                  <td>
                    { item.memoSource.slice(7)}
                  </td>
                </tr>
                )
              }
                {
                  <tr>
                    <td>
                      <div className="date">
                        { dateFormat(item.createDate, true) }
                      </div>
                      <div className="name">【{item.staff ? mappingStaffName(item.staff) : item.clerk}】</div>
                    </td>
                    <td>
                      { item.memo }
                    </td>
                  </tr>
              }
              </React.Fragment>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default tabDemand;

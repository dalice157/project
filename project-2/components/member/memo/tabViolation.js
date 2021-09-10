import React from 'react';
import { dateFormat } from '../../../util/formatUtil.js';
import { mappingStaffName } from '../../../util/commonUtil.js';
import './memo.scss';

const tabViolation = ({ data, visible }) => {
  return (
    <table className="table">
      <tbody>
        {
          data && data.slice(0, visible).map((item) => {
            return (
              <>
                <tr className="no">
                  <td width="25%">檢舉編號</td>
                  <td>
                    { item.recordId.slice(10) }
                  </td>
                </tr>
                {
                  data && item.memo.map((obj, index) => {
                    return (
                      <tr key={ index }>
                        <td align="center">
                          <div className="date">
                            { dateFormat(obj.createDate, true) }
                          </div>
                          <div className="name">【{obj.staff ? mappingStaffName(obj.staff) : obj.clerk}】</div>
                        </td>
                        <td>
                          { obj.memo }
                        </td>
                      </tr>
                    );
                  })
                }
              </>
            );
          }) }
      </tbody>
    </table>
  );
};

export default tabViolation;

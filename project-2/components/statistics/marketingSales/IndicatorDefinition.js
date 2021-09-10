import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import './IndicatorDefinition.scss';

const { Panel } = Collapse;
class IndicatorDefinition extends PureComponent {
  onRenderDefineTable = () => {
    return (
      <table className="guide-table">
        <tbody>
          <tr>
            <td>預備會員數</td>
            <td>當月註冊高手並啟用topper身分的數量</td>
          </tr>
          <tr>
            <td>新單轉換率</td>
            <td>新購單數/預備會員數</td>
          </tr>
          <tr>
            <td>新購單數</td>
            <td>第1次進單的訂單數量</td>
          </tr>
          <tr>
            <td>續約水池</td>
            <td>刊期到期或計次型在期限內用完最後一次後，1~30天皆屬續約水池</td>
          </tr>
          <tr>
            <td>續約率</td>
            <td>續約單數/續約水池</td>
          </tr>
          <tr>
            <td>續約單數</td>
            <td>刊期到期或計次型在期限內用完最後一次後，1~30天再購訂單數量</td>
          </tr>
          <tr>
            <td>回流水池</td>
            <td>刊期到期或計次型在期限內用完最後一次後，31~730天皆屬回流水池</td>
          </tr>
          <tr>
            <td>回流率</td>
            <td>回流單數/回流水池</td>
          </tr>
          <tr>
            <td>回流單數</td>
            <td>刊期到期或計次型在期限內用完最後一次後，31天開始再購訂單數量</td>
          </tr>
          <tr>
            <td>再購水池</td>
            <td>續約水池+回流水池</td>
          </tr>
          <tr>
            <td>再購率</td>
            <td>(續約單數+回流單數)/(續約水池+回流水池)</td>
          </tr>
          <tr>
            <td>再購單數</td>
            <td>續約單數+回流單數</td>
          </tr>
          <tr>
            <td>新購ARPU</td>
            <td>新購業績/新購單數</td>
          </tr>
          <tr>
            <td>續約ARPU</td>
            <td>續約業績/續約單數</td>
          </tr>
          <tr>
            <td>回流ARPU</td>
            <td>回流業績/回流單數</td>
          </tr>
          <tr>
            <td>再購ARPU</td>
            <td>再購業績/再購單數</td>
          </tr>
          <tr>
            <td>新購業績</td>
            <td>新購單的總業績毛利</td>
          </tr>
          <tr>
            <td>續約業績</td>
            <td>續約單的總業績毛利</td>
          </tr>
          <tr>
            <td>回流業績</td>
            <td>回流單的總業績毛利</td>
          </tr>
          <tr>
            <td>再購業績</td>
            <td>續約業績+回流業績</td>
          </tr>
          <tr>
            <td>其他業績</td>
            <td>埋Google AD (滿一定的金額才會開發票，但每個月都會固定露出)或押金沒收費用</td>
          </tr>
          <tr>
            <td>合計業績</td>
            <td>新購業績+續約業績+回流業績</td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <Collapse className="collapse-table" bordered={ false }>
        <Panel header="指標定義" key="1">
          {this.onRenderDefineTable()}
        </Panel>
      </Collapse>
    );
  }
}

export default IndicatorDefinition;

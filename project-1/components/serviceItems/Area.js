import React, { Component } from 'react';
import { RowLayout } from './Row';
import { catSearch } from '../../util/categoryUtils.js';
import styles from './ServiceItems.scss';

/**
 * 服務地區
 */
class Area extends Component {
  state = {
    area: '台灣地區',
  }

  componentDidMount() {
    const { area, areaCats } = this.props;
    let search = {};
    let areas = [];

    area.forEach((areaNo) => {
      // console.log('areaNo:', typeof (areaNo));
      search = catSearch(areaCats, areaNo);
      areas = [...areas, search.des];
    });

    const areaDesc = areas.length ? areas.join('、') : '';
    this.setState({ area: areaDesc });
  }

  handleOnArea = (areas) => {
    const {
      id, onAreaChange, areaCats, handleAreaOpen
    } = this.props;
    if (categoryPicker) {
      handleAreaOpen();
      categoryPicker.open({
        dataSource: 'Area',
        theme: 'customer-theme',
        title: '服務地區',
        maxSelectedNumber: 15,
        backdropClose: true,
        selectedItems: areas,
        recommendation: false,
        searchLevel: 1,
        searchDetail: false,
        // unselectableList: '6[0-9]{6}000',
        onSubmit: ({ payload, selectedItems }) => {
          let search = {};

          payload.selectedItems.forEach((areaNo) => {
            search = catSearch(areaCats, areaNo.no);
            areaNo.des = search.des;
          });

          const validateItems = selectedItems.length ? selectedItems : payload.selectedItems;
          const validateItemDescs = validateItems.map(item => item.des);
          const areaDesc = validateItems.length ? validateItemDescs.join('、') : '';
          const areaNos = validateItems.map(item => item.no);

          onAreaChange({ id: id, area: areaNos });
          this.setState({ area: areaDesc });
        },
        onClose: () => {
          // this.setState({ editing: false });
        },
      });
    }
  }

  render() {
    const { title } = this.props;
    const { area } = this.props;
    let areas = [];
    area.forEach((areaNo) => {
      areas = [...areas, { no: `${areaNo}` }];
    });

    return (
      <RowLayout title={title}>
        <span onClick={() => this.handleOnArea(areas)} className={styles.data}>
          { this.state.area != '' ? this.state.area : <span className={styles.warning}>未設定</span> }
        </span>
      </RowLayout>
    );
  }
}
export default Area;

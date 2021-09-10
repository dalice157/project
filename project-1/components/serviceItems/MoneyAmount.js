import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import { RowLayout } from './Row';
import { defaultMoneyData, moneyData } from './popoverData.js';
import Button from '../ui/button';
import styles from './ServiceItems.scss';

const Option = Select.Option;

/**
 * 服務金額
 */
class MoneyAmount extends Component {
  state={
    validate: false,
    unit: moneyData[0].value,
    price: 100,
  }

  componentDidMount() {
    const { money, } = this.props;

    this.setState({
      unit: money.unit,
      price: money.price > 0 ? money.price : this.state.price,
    });
  }

  handleHide = () => {
    const { unit, price } = this.state;
    const { id, onMoneyChange, handleMoneyClose } = this.props;
    const isValidUnit = moneyData.some(unitObj => unitObj.value === unit);
    const isPriceValid = price > 0;

    if (isValidUnit && isPriceValid) {
      onMoneyChange({ id: id, unit: unit, price: price });
      handleMoneyClose();
      this.setState({
        validate: false,
      });
    } else {
      handleMoneyOpen();
      this.setState({
        validate: true,
      });
    }
  }

  onUnitChange = (value) => {
    this.setState({ unit: value });
  };

  onPriceChange = (value) => {
    console.log(`onPriceChange: ${value}`);
    this.setState({ price: value });
  };

  renderOptions = (
    moneyData.map(item => (
      <Option key={item.id} value={item.value}>{item.title}</Option>
    ))
  );

  renderContent = (unit, price) => {
    const {
      unit: selectedUnit,
      price: selectPrice,
      validate
    } = this.state;
    const min = unit.value == moneyData[0].value ? defaultMoneyData.minCase : defaultMoneyData.minHourRate;
    const isPriceEmpty = price == '' || price === undefined;
    let isValidate = validate || isPriceEmpty ? styles.open : '';
    let warning = validate || isPriceEmpty ? '請填寫服務金額' : '';

    if (selectedUnit == moneyData[0].value) {
      isValidate = price < defaultMoneyData.minCase ? styles.open : isValidate;
      warning = price < defaultMoneyData.minCase ? '請填寫服務金額' : warning;
    } else {
      isValidate = price < defaultMoneyData.minHourRate ? styles.open : isValidate;
      warning = price < defaultMoneyData.minHourRate ? `最低時薪為${defaultMoneyData.minHourRate}元` : warning;
    }

    return (
      <div className={styles.popover}>
        <Select
          style={{ width: '110px' }}
          defaultValue={moneyData[0].title}
          onChange={this.onUnitChange}
          value={unit.value}
        >
          {this.renderOptions}
        </Select> 台幣
        <InputNumber
          min={min}
          step="10"
          defaultValue={price}
          value={selectPrice}
          onChange={this.onPriceChange}
        /> 元起
        <div className={`${styles.btnWrap} ${styles.hasValidate}`}>
          <span className={`${styles.validate} ${isValidate}`}>{ warning }</span>
          <Button onClick={this.handleHide} type="primary">
            確認
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      isMoneyOpen,
      handleMoneyOpen,
    } = this.props;
    const unit = moneyData.find(money => money.value == this.state.unit);
    const price = this.state.price;
    const {
      title,
      money,
    } = this.props;
    const gigUnit = moneyData.find(moneyItem => moneyItem.value == money.unit);
    const gigPrice = money.price;

    return (
      <RowLayout
        title={title}
        content={this.renderContent(unit, price)}
        isOpen={isMoneyOpen}
      >
        <span onClick={handleMoneyOpen} className={styles.data}>
          { gigPrice > 0 ? `${gigUnit.title} ${gigPrice} 元起` : <span className={styles.warning}>未設定</span> }
        </span>
      </RowLayout>
    );
  }
}
export default MoneyAmount;

import React, { Component } from 'react';
import styles from './CheckboxGroup.scss';

class CheckboxGroup extends Component {
  checkboxGroup() {
    const {
      label, options, input,
    } = this.props;
    return options.map(option => (
      <label className={styles.label} key={option.id}>
        <input
          type="checkbox"
          name={`${input.name}${option.id}`}
          value={option.id}
          checked={input.value.indexOf(option.id) !== -1}
          onChange={(event) => {
            const newValue = [...input.value];
            if (event.target.checked) {
              newValue.push(option.id);
            } else {
              newValue.splice(newValue.indexOf(option.id), 1);
            }
            return input.onChange(newValue);
          }}
        />
        { option.title }
      </label>
    ));
  }

  render() {
    return (
      <div>
        { this.checkboxGroup() }
      </div>
    );
  }
}
export default CheckboxGroup;

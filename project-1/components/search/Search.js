import React from 'react';
import { Input } from 'antd';
import styles from './Search.scss';

const Search = Input.Search;

const SearchBar = ({
  typeLabel, onSearch, value, onChange
}) => {
  return (
    <Search
      className={styles.search}
      placeholder={`關鍵字搜尋${typeLabel}`}
      onSearch={onSearch}
      enterButton
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchBar;

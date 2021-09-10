import React, { Component } from 'react';
import { Input, Select } from 'antd';
import styles from './Search.scss';

const Search = Input.Search;
const Option = Select.Option;

class SearchBar extends Component {
    state = {
      searchValue: null,
      searchType: 'service'
    };

    componentDidMount() {
      document.getElementsByClassName('ant-input-search-button')[0].setAttribute('data-gtm-header', '搜尋');
      this.searchChange();
    }

    componentDidUpdate(prevProps) {
      const search = this.props.location.search;
      const preSearch = prevProps.location.search;
      const pathname = this.props.location.pathname;
      const prePathname = prevProps.location.pathname;
      if (pathname !== prePathname) {
        this.searchChange();
      }
      if (search !== preSearch && !this.props.location.query.q) {
        this.handleOnChange(); // clean
      }
    }

  searchChange = () => {
    const currentPage = this.props.location.pathname.split('/')[1];
    if (currentPage == 'caseList' || currentPage == 'shareSetting') {
      this.setState({
        searchType: 'case'
      });
    } else if (currentPage == 'search-tutor') {
      this.setState({
        searchType: 'teacher'
      });
    } else {
      this.setState({
        searchType: 'service'
      });
    }
  }

  handleSelectChange = (value) => {
    this.setState({
      searchType: value
    });
  }

  handelSearch = (value) => {
    if (this.state.searchType === 'case') {
      this.props.type === 'mobile' ? location.href = (value ? '/caseList?q=' + value : '/caseList') : this.props.history.push(value ? '/caseList?q=' + value : '/caseList');
    } else if (this.state.searchType === 'teacher') {
      this.props.type === 'mobile' ? location.href = (value ? '/search-tutor?q=' + value : '/search-tutor') : this.props.history.push(value ? '/search-tutor?q=' + value : '/search-tutor');
    } else {
      this.props.type === 'mobile' ? location.href = (value ? '/search?q=' + value : '/search') : this.props.history.push(value ? '/search?q=' + value : '/search');
    }
  }

  handleOnChange = (e) => {
    this.setState({ searchValue: e ? e.target.value : null });
  }

  render() {
    return (
      <div className={styles.searchBar}>
        <Select className={styles.searchType} value={this.state.searchType} onChange={this.handleSelectChange}>
          <Option value="teacher">找老師</Option>
          <Option value="service">找報價</Option>
          <Option value="case">找案件</Option>
        </Select>
        <Search
          className={styles.search}
          placeholder={this.state.searchType == 'teacher' ? '試試國中英文' : '試試LOGO設計'}
          onSearch={this.handelSearch}
          enterButton="搜尋"
          value={this.state.searchValue}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}

export default SearchBar;

import React, { Component } from 'react';
import './Tags.scss';
import { PlusOutlined } from '@ant-design/icons';
import { Tag, Input } from 'antd';

class GigTags extends Component {
  state = {
    inputVisible: false,
    inputValue: null,
  }

  showInput = () => {
    this.setState({
      inputVisible: true,
    });
  };

  onCatTagChange = (catTag = '') => {
    this.props.setTags(catTag);
  };

  handleClose = (removedTag) => {
    this.onCatTagChange(this.props.tags.filter(tag => tag !== removedTag));
  }

  handleInputChange = (element) => {
    this.setState({
      inputValue: element.target.value,
    });
  };

  handleInputConfirm = () => {
    const { tags } = this.props;
    const { inputValue } = this.state;
    if (inputValue && tags && tags.indexOf(inputValue) === -1) {
      this.onCatTagChange([...tags, inputValue]);
      this.setState({
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return <>
      {tags
        && tags.length > 0
        && tags.map((tag) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={ tag } closable onClose={ () => this.handleClose(tag) }>
              {isLongTag ? `${tag.slice(0, 5)}...` : `${tag}`}
            </Tag>
          );
          return tagElem;
        })}
      {inputVisible && (
        <Input
          type="text"
          size="small"
          style={ { width: 78 } }
          value={ inputValue }
          onChange={ this.handleInputChange }
          onBlur={ this.handleInputConfirm }
          onPressEnter={ this.handleInputConfirm }
        />
      )}
      {!inputVisible && tags && tags.length < 6 && (
        <Tag onClick={ this.showInput }>
          <PlusOutlined /> 新增服務標籤
        </Tag>
      )}
    </>;
  }
}

export default GigTags;

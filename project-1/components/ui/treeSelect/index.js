import React, { Component } from 'react';
import { TreeSelect as TreeSelectCom, Modal } from 'antd';
import { catsTreeData } from '../../../util/lablesUtils.js';
import { error } from '../../../util/messageUtil.js';

const SHOW_PARENT = TreeSelectCom.SHOW_PARENT;
const defaultTreeData = catsTreeData(0);

/**
 * 服務類型, 案件類別
 */
class TreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 服務: gig, 案件: demand, 家教案件: tutorDemand
      type: 'gig',
      value: undefined,
      selectedKeys: [],
      expandedKeys: [],
      hasInitialized: false,
      cacheValue: {
        value: null,
        label: null,
        extra: null,
      },
      alreadyCheck: false,
    };
  }


  componentDidMount() {
    const { cats, type } = this.props;
    this.setState({
      value: cats,
      type: type || 'gig',
    });
  }

  onCheckDesc = (targetValue, label, extra) => {
    const { alreadyCheck, value } = this.state;
    const { isDescNotEmpty, onDescChange } = this.props;
    // 直接修改描述
    if (value.length === 0 && !isDescNotEmpty) {
      onDescChange(targetValue);
      return false;
    }
    if (value.length >= 1 || alreadyCheck) {
      this.setState({ alreadyCheck: false });
      return false;
    } else if (isDescNotEmpty) {
      this.setState({
        cacheValue: {
          value: targetValue,
          label: label,
          extra: extra,
        },
        alreadyCheck: true
      });
      this.onAskDescChange();
      return true;
    }
  }

  onChange = (value, label, extra) => {
    const { expandedKeys, type } = this.state;
    const { id, onCatsChange } = this.props;
    const node = extra.triggerNode;
    if (node.isLeaf && node.isLeaf()) {
      // 服務, 家教不判斷
      if (type !== 'gig' && type !== 'tutorDemand' && this.onCheckDesc(value, label, extra)) {
        return;
      }
      if (value.length < 3) {
        onCatsChange({ id: id, cats: value });
        this.setState({ value: value });
      } else {
        type == 'gig' ? error('cat-limit') : error('demand-cat-limit');
      }
    } else if (typeof node.props.expanded !== 'undefined') {
      this.setState({
        expandedKeys: node.props.expanded
          ? expandedKeys.filter(k => k !== node.props.eventKey)
          : expandedKeys.concat(node.props.eventKey)
      });
    } else {
      onCatsChange({ id: id, cats: value });
      this.setState({ value });
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({ expandedKeys });
  };

  onInitialTreeselect = () => {
    const { cats, type } = this.props;
    // 初始化案件一定會有案件資料
    if (cats !== null && cats.length !== 0) {
      this.setState({
        value: cats,
        type: type || 'gig',
        hasInitialized: true,
      });
    }
  }

  onAskDescChange = () => {
    Modal.confirm({
      title: '是否確認載入類別範例',
      content: '由於您調整需求類別，需求範例不同，是否需要更新類別範例以方便您重新編輯？',
      okText: '更新',
      cancelText: '不更新',
      onOk: () => {
        const { value, label, extra } = this.state.cacheValue;
        this.onChange(value, label, extra);
        this.props.onDescChange(value[0]);
      },
      onCancel: () => {
        const { value, label, extra } = this.state.cacheValue;
        this.onChange(value, label, extra);
      }
    });
  }

  render() {
    const typeDesc = this.state.type == 'gig' ? '服務類型' : '案件類別';
    const { style, treeData } = this.props;
    const treeProps = {
      treeData: treeData || defaultTreeData,
      value: this.state.value,
      treeExpandedKeys: this.state.expandedKeys,
      onChange: this.onChange,
      onTreeExpand: this.onExpand,
      multiple: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: `請選擇${typeDesc}，最多二個`,
      style: this.state.value && this.state.value.length > 0 ? {
        width: '100%',
      } : {
        width: '100%',
        border: '1px solid #e66c6c'
      },
      dropdownStyle: {
        maxHeight: 170,
        overflow: 'auto'
      },
      className: `${style}`,
    };

    // formik update before data recieved
    if (this.props.isModified && !this.state.hasInitialized) {
      this.onInitialTreeselect();
    }

    return <TreeSelectCom {...treeProps} />;
  }
}

export default TreeSelect;

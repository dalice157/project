<script>
import $ from 'jquery';
export default {
  data() {
    const { query } = this.$route;
    const hasQuery = JSON.stringify(query) === '{}';
    return {
      assignPlace: {
        des: hasQuery || !query.areaDesc ? '地區' : query.areaDesc,
        no: hasQuery || !query.areaNo ? '' : query.areaNo.split(',')
      }
    };
  },
  methods: {
    onAreaClick() {
      const getAreaArr =
        this.assignPlace.no && typeof this.assignPlace.no === 'string'
          ? this.assignPlace.no.split(',')
          : this.assignPlace.no;
      const intAreas = getAreaArr ? getAreaArr.map(item => ({ no: item })) : [];
      if (categoryPicker) {
        categoryPicker.open({
          dataSource: 'Area',
          theme: 'customer-theme',
          title: '工作地區',
          maxSelectedNumber: 10,
          selectedItems: intAreas,
          recommendation: false,
          searchLevel: 1,
          searchDetail: false,
          whitelist: '6001000000,6001[0-9]{6}',
          onSubmit: ({ selectedItems }) => {
            const itemsLength = selectedItems.length > 0;
            const desc = itemsLength
              ? selectedItems.map(item => item.des).join(',')
              : '地區';
            const no = itemsLength
              ? selectedItems.map(item => item.no).join(',')
              : [];
            this.assignPlace.des = desc || '地區';
            this.assignPlace.no = no || [];
            this.$emit('areasVal', this.assignPlace);
          }
        });

        setTimeout(() => {
          $('.category-item.category-item--level-one').click();
          $('.selected-max').hide();
          $('.category-picker-checkbox').attr('href', 'javascript:;');
        }, 300);
      }
    }
  }
};
</script>
<template src="./areaBox.html" />
<style lang="scss" src="./areaBox.scss" scoped />

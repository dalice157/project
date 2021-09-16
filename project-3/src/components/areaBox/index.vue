<script>
import $ from "jquery";
export default {
  data() {
    return {
      assignPlace: { des: "地區", no: "" }
    };
  },
  mounted() {},
  methods: {
    onAreaClick() {
      const intAreas = this.assignPlace.no
        ? this.assignPlace.no.split(",").map(item => ({ no: item }))
        : [];
      if (categoryPicker) {
        categoryPicker.open({
          dataSource: "Area",
          theme: "customer-theme",
          title: "工作地區",
          maxSelectedNumber: 10,
          selectedItems: intAreas,
          recommendation: false,
          searchLevel: 1,
          searchDetail: false,
          whitelist: "6001000000,6001[0-9]{6}",
          onSubmit: ({ selectedItems }) => {
            const desc = selectedItems.map(item => item.des).join("、");
            const no = selectedItems.map(item => item.no).join();
            this.assignPlace.des = desc || "地區";
            this.assignPlace.no = no || null;
            this.$emit("areasVal", this.assignPlace.no);
          }
        });

        setTimeout(() => {
          $(".category-item.category-item--level-one").click();
          $(".selected-max").hide();
          $(".category-picker-checkbox").attr("href", "javascript:;");
        }, 300);
      }
    }
  }
};
</script>
<template src="./areaBox.html" />
<style lang="scss" src="./areaBox.scss" scoped />

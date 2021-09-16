<script>
export default {
  props: [
    "addressAreaDesc",
    "custName",
    "jobHashNo",
    "jobName",
    "minEduDesc",
    "salaryTypeDesc",
    "salaryLow",
    "salaryHigh",
    "workShiftTypeDesc",
    "workExpDesc",
    "workTime",
    "workNeedShift"
  ],
  data() {
    return {};
  },
  methods: {
    workshifts(data) {
      const arr = data.join("、");
      return arr;
    },
    moneyFormat(num) {
      var num = (num || 0).toString(),
        result = "";
      while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return result;
    }
  }
};
</script>
<template src="./resultList.html" />
<style lang="scss" src="./resultList.scss" />

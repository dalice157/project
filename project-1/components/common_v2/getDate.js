const parseDate = (num) => {
  const data = num.substr(0, 19);
  const dt = new Date(data.replace(/T/g, ' ').replace(/-/g, '/'));
  const year = dt.getFullYear();
  let month = '' + (dt.getMonth() + 1);
  month = month.length < 2 ? '0' + month : month;
  let date = '' + dt.getDate();
  date = date.length < 2 ? '0' + date : date;
  const formatDate = year + '-' + month + '-' + date;
  return {
    year,
    month,
    date,
    formatDate
  };
};

export default parseDate;

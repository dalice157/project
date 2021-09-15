export default $axios => ({
  postJobSearch(params) {
    return $axios.post(`/_api/findJob/postJobSearch`, params);
  }
});

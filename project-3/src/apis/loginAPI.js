export default $axios => ({
  verify: () => {
    return $axios.get("/_api/login/verify");
  }
});

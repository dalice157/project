// ref: https://stackoverflow.com/questions/51515143/how-to-log-nuxt-server-side-network-requests

export default ({ $axios }) => {
  if (process.env.NODE_ENV !== 'production') {
    $axios.onResponse((response) => {
      console.log(`[${response.status}] ${response.request.path}`);
    });

    $axios.onError((err) => {
      console.log(
        `[${err.response && err.response.status}] ${err.response &&
          err.response.request.path}`
      );
      console.log(err.response && err.response.data);
    });
  }

  // $axios.interceptors.response.use(function (response) {
  //   return response;
  // }, function (error) {
  //   if (error.response && error.response.status === 500) {
  //     redirect('/consultant/systemErrorPage')
  //   }
  //   return Promise.reject(error);
  // });

};

import loginAPI from './loginAPI';
import findJobAPI from './findJobAPI';

export default $axios => ({
  login: loginAPI($axios),
  findJob: findJobAPI($axios)
});

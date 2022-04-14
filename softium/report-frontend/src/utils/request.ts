import { request } from '@vulcan/utils';
import { getLocale } from 'umi';
import { APPID } from '@/constant';
import storage from '@/utils/storage';

request.defaults.baseURL = process.env.BASE_URL;
request.defaults.timeout = 30000;
request.defaults.headers['RS-Header-Locale'] = getLocale();
request.defaults.headers['RS-Header-AppId'] = APPID;

request.interceptors.request.use(
  config => {
    const userInfo = storage.get('userInfo');
    config.headers['RS-Header-UserId'] = userInfo?.userId;
    config.headers['RS-Header-TenantId'] = userInfo?.tenantId;
    config.headers['RS-Header-UserName'] = encodeURI(userInfo?.tenantUserName);
    config.headers['RS-Header-Token'] = userInfo?.bearerToken;
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

export default request;

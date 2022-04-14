import { request } from '@vulcan/utils';
import { getLocale } from 'umi';
import { APPID } from '@/../constant';
import storage from '@/utils/storage';

request.defaults.baseURL = process.env.BASE_URL;
request.defaults.timeout = 180000;
request.defaults.headers['RS-Header-Locale'] = getLocale();
request.defaults.headers['RS-Header-AppId'] = APPID;
request.interceptors.request.use(
  config => {
    const userInfo = storage.get('userInfo');
    config.headers['RS-Header-UserId'] = userInfo?.userId || null;
    config.headers['RS-Header-UserName'] = userInfo?.userName || null;
    config.headers['RS-Header-TenantId'] = userInfo?.tenantId || null;
    config.headers['RS-Header-AccountId'] = userInfo?.accountId || null;
    config.headers['RS-Header-Token'] = userInfo?.bearerToken || null;
    config.headers['RS-Header-UserName'] =
      encodeURI(userInfo?.tenantUserName) || null;
    config.headers['RS-Header-DataRoleType'] = userInfo?.dataRoleType || null;
    //  config.headers['RS-Header-TenantId'] = '11111'
    // config.headers['RS-Header-UserId'] = '1'
    // config.headers['RS-Header-UserName'] = 'york'
    // config.headers['RS-Header-AccountId'] = 'york-accountid'
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

export default request;

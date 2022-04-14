import { request } from '@vulcan/utils';
import storage from './storge';
import { getLocale } from 'umi';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { requestConfig } from '@/utils/interceptors/request';
import { responseConfig } from '@/utils/interceptors/response';

request.defaults.baseURL = process.env.BASE_URL;
request.defaults.timeout = 30 * 60 * 1000;
request.defaults.headers['RS-Header-Locale'] = getLocale();
request.defaults.headers['RS-Header-AppId'] = 'mdm-enterprise' || 'default';
request.interceptors.request.use((config: AxiosRequestConfig) =>
  requestConfig(config),
);
request.interceptors.response.use((config: AxiosResponse) =>
  responseConfig(config),
);

let pending: any[] = [];
let cancelToken = request.CancelToken;
let removePending = (e: any) => {
  for (let p in pending) {
    if (pending[p].u === e.url + '&' + e.method) {
      pending[p].f();
      pending.splice(p as any, 1);
    }
  }
};

request.interceptors.request.use(
  config => {
    const userInfo = storage.get('userInfo');
    config.headers['RS-Header-UserId'] =
      userInfo?.userId || '8ac274f67689469a0176941bad600308';
    config.headers['RS-Header-TenantId'] =
      userInfo?.tenantId || '261bb6d4797543a99a7a8ed42b88a4f6';
    config.headers['RS-Header-Token'] = userInfo?.bearerToken;
    config.headers['RS-Header-AppId'] = userInfo?.appId || 'mdm-enterprise';
    config.headers['RS-Header-UserName'] = encodeURI(
      userInfo?.tenantUserName || 'test',
    );
    // removePending(config);
    // config.cancelToken = new cancelToken(c => {
    //   pending.push({
    //     u: config.url + '&' + config.method,
    //     f: c,
    //   });
    // });
    return Promise.resolve(config);
  },
  error => {
    return Promise.reject(error);
  },
);

export default request;

import { defineConfig } from 'umi';
import { hostPrefix } from '../constant';

export default defineConfig({
  publicPath: '/static/data-center-static/',
  base: '/static/data-center-static/',
  define: {
    'process.env.BASE_URL': hostPrefix + '/data-center-web',
    'process.env.DATACENTER_DEV_URL': hostPrefix + '/data-center',
    'process.env.SAAS_URL': hostPrefix + '/saas-web',
    'process.env.PASS_URL': hostPrefix + '/paas-op',
    'process.env.CAS_URL': hostPrefix + '/cas-server',
    'process.env.BASE_FILE_URL': hostPrefix + '/paas-file',
  },
});

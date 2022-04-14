import { defineConfig } from 'umi';
import { hostPrefix } from '../constant';

export default defineConfig({
  define: {
    'process.env.BASE_URL': hostPrefix + '/data-center',
    'process.env.DATACENTER_DEV_URL': hostPrefix + '/data-center',
    'process.env.SAAS_URL': hostPrefix + '/saas-web',
    'process.env.PASS_URL': hostPrefix + '/paas-op',
    'process.env.CAS_URL': hostPrefix + '/cas-server',
    'process.env.BASE_FILE_URL': hostPrefix + '/paas-file',
  },
  proxy: {
    '/gw/api/saas-web': {
      // target: 'https://test.pharmaos.com/',
      // target: 'http://192.168.253.89:8087',
      target: 'http://192.168.246.8:8080',
      changeOrigin: true,
    },
    '/gw': {
      target: 'http://192.168.253.117:8087',
      // target: 'http://192.168.253.89:8087',
      // target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { '^/gw/api': '' },
    },
  },
});

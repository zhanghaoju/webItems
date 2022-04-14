import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.BASE_URL': '/api/mdm-enterprise',
    'process.env.PASS_URL': '/api/paas-op-web',
    'process.env.CAS_URL': '/api/cas-server',
    'process.env.BASE_FILE_URL': '/api/paas-file-web',
    'process.env.SAAS_URL': '/api/saas-web',
    'process.env.EXT_MODEL_URL': '/api/paas-extmodel-web',
  },
  proxy: {
    '/gw/api/cas-server': {
      target: 'http://std055-internal.softium.cn',
      changeOrigin: true,
      pathRewrite: { '/gw/api/': '' },
    },
    '/gw/api/paas-op-web': {
      target: 'http://std055-internal.softium.cn',
      changeOrigin: true,
      pathRewrite: { '': '' },
    },
    '/gw/api/vulcan-saas': {
      target: 'http://std055-internal.softium.cn',
      changeOrigin: true,
      pathRewrite: { '/gw/api/': '' },
    },
    '/gw/api/saas-web': {
      target: 'https://test.pharmaos.com/',
      secure: false,
      changeOrigin: true,
    },
    '/gw/api/paas-extmodel-web': {
      target: 'https://test.pharmaos.com/',
      secure: false,
      changeOrigin: true,
    },
    '/gw/api/paas-file-web': {
      target: 'http://std055-internal.softium.cn',
      changeOrigin: true,
    },
    '/gw/api/mdm-enterprise': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {
        '/gw/api/mdm-enterprise': '',
      },
    },
  },
});

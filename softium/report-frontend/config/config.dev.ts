import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.SAAS_URL': '/api/saas-web',
    'process.env.BASE_URL': '/api/report-web',
    'process.env.CAS_URL': '/api/pass-user-svc',
    'process.env.BASE_FILE_URL': '/api/paas-file-web',
    'process.env.TABLEAU_SERVER': '/api/tableau-web',
    'process.env.CONFIG_CENTER_URL': '/api/paas-configcenter-web',
  },
  proxy: {
    '/gw/api/report-web': {
      // target: 'https://test.pharmaos.com',
      // target: 'http://localhost:8081/',
      target: 'http://192.168.253.85:8081/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '/gw/api/report-web': '' },
    },
    '/gw/api/paas-configcenter-web': {
      target: 'https://test.pharmaos.com/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        // '/api/paas-configcenter-web': ''
      },
    },
    '/gw/api/tableau-web': {
      target: 'https://test.pharmaos.com',
      changeOrigin: true,
      pathRewrite: { '': '' },
      secure: false,
    },
    '/gw/api/saas-web': {
      target: 'https://test.pharmaos.com',
      changeOrigin: true,
      pathRewrite: { '': '' },
      secure: false,
    },
    '/api': {
      target: 'https://test.pharmaos.com',
      changeOrigin: true,
      secure: false,
    },
    '/gw/api/paas-extmodel-web/': {
      target: 'https://test.pharmaos.com',
      changeOrigin: true,
      secure: false,
    },
  },
});

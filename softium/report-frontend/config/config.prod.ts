import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.SAAS_URL': '/api/saas-web',
    'process.env.CAS_URL': '/api/cas-server',
    'process.env.BASE_URL': '/api/report-web',
    'process.env.BASE_FILE_URL': '/api/paas-file-web',
    'process.env.TABLEAU_SERVER': '/api/tableau-web',
    'process.env.CONFIG_CENTER_URL': '/api/paas-configcenter-web',
  },
});

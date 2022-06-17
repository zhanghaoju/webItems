import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.BASE_URL': '/api/mdm-enterprise',
    'process.env.PASS_URL': '/api/paas-op-web',
    'process.env.CAS_URL': '/api/paas-user-svc',
    'process.env.BASE_FILE_URL': '/api/paas-file-web',
    'process.env.SAAS_URL': '/api/saas-web',
    'process.env.EXT_MODEL_URL': '/api/paas-extmodel-web',
  },
});

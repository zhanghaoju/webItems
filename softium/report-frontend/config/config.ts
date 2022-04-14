import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  antd: {},
  routes,
  theme: {
    'primary-color': '#FF9300',
  },
  publicPath: '/static/report-static/',
  base: '/static/report-static/',
  favicon: '/assets/favicon.png',
  // metas: [
  //   {
  //     'http-equiv': 'Content-Security-Policy',
  //     content: 'upgrade-insecure-requests',
  //   },
  // ],
});

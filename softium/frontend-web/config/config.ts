import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  publicPath: '/static/mdm-enterprise/',
  base: '/static/mdm-enterprise/',
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'browser',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  theme: {
    'primary-color': '#ff9300',
  },
  hash: true,
  title: '企业主数据管理',
  antd: {},
  routes,
  favicon: '/assets/favicon.png',
});

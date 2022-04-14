import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  title: '流向管理',
  theme: {
    '@primary-color': '#ff9300',
    '@link-color': '#ff9300',
  },
  hash: true,
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  antd: {},
  routes,
  favicon: '/assets/favicon.png',
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  dynamicImport: {},
  chunks: ['umi', 'vendors', 'antdesigns'],
  chainWebpack: function(config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000, //文件最小打包体积，单位byte，默认30000，若单个文件不满足会合并其他文件组成一个
          minChunks: 1, //最小使用到次数，超过2次执行
          automaticNameDelimiter: '.', //连接符
          cacheGroups: {
            vendors: {
              // 基本框架
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
            antdesigns: {
              name: 'antdesigns',
              test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
              priority: 11,
            },
          },
        },
      },
    });
    config
      .plugin('replace')
      .use(require('webpack').ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });
  },
  // favicon: '/assets/old_logo@2x.png',
  // favicon: '/assets/logo@2x.png',
});

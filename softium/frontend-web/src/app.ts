import { loadResource } from '@/services/locale';
import { getApp, getResourceRoute } from '@/services/applicationInfo';
import { addLocale, getLocale } from 'umi';
import storage from '@/utils/storge';
import zhCN from 'antd/lib/locale/zh_CN';
import { getDictionaryAll } from '@/services/dictionary';
import { dictionaryTransform } from '@/utils/dataConversion';
import { ConfigProvider } from 'antd';
import React from 'react';
import request from '@/utils/request';
import { APPID } from '../constant';
import { Resource } from '@vulcan/utils/dist/utils/patchRoutes';
import {
  patchRoutesByResources,
  VulcanProvider,
  VulcanProviderContainer,
} from '@vulcan/utils';

interface route {
  code?: string;
  routes?: route[];
  [key: string]: any;
}
interface resource {
  code: string;
  [key: string]: any;
}

let pageElements: Resource[];
let menus: resource[];

export function patchRoutes({ routes }: { routes: route[] }) {
  patchRoutesByResources(routes, menus || []);
}

let buildDictionary = async function() {
  const dictionary = await getDictionaryAll({});
  const dictionaryObject = dictionaryTransform(dictionary.data);
  localStorage.setItem(
    'enterprise:dictionary',
    JSON.stringify(dictionaryObject),
  );
};

export async function render(oldRender: () => void) {
  // const locale = getLocale();

  try {
    const { data } = await getApp();
    storage.set('userInfo', data);
    const user: any = await getResourceRoute({
      appId: 'mdm-enterprise',
    });
    if (user) {
      menus = user.data.menus;
      pageElements = user.data.pageElements;
    }
    // const res = await loadResource();
    // if (res) {
    //   addLocale(locale, res.data, {
    //     momentLocale: locale.toLowerCase(),
    //     antd: locale,
    //   });
    // }
    await buildDictionary();
    oldRender();
  } catch (e) {
    console.log(e);
  }
}

export function rootContainer(container: any) {
  return React.createElement(
    VulcanProviderContainer,
    {
      elements: pageElements,
      request,
      tableConfig: {
        columnsGetUrl: '/api/saas-web/table/query/table/display-field',
        columnsSetUrl: '/api/saas-web/table/save/table-field/display-status',
        dynamicColumnsGetUrl: '/api/paas-extmodel-web/table/getTable',
      },
      appId: APPID,
    },
    React.createElement(ConfigProvider, { locale: zhCN }, container),
  );
}

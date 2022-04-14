import React from 'react';
import { loadResource } from '@/services/locale';
import { initPocketResource } from '@/services/initResource';
import {
  getUserInfo,
  getResourceRoute,
  getDefaultPeriod,
} from '@/services/applicationInfo';
import { addLocale, getLocale } from 'umi';
import storage from '@/utils/storage';
import { patchRoutesByResources, VulcanProviderContainer } from '@vulcan/utils';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import request from '@/utils/request';
import { APPID } from '@/../constant';

interface route {
  code?: string;
  routes?: route[];
  [key: string]: any;
}
interface resource {
  code: string;
  [key: string]: any;
}

let menus: resource[];
let pageElements: resource[];

export function patchRoutes({ routes }: { routes: route[] }) {
  patchRoutesByResources(routes, menus || []);
}

export async function render(oldRender: () => void) {
  const locale = getLocale();

  try {
    const { data } = await getUserInfo();
    storage.set('userInfo', data);
    const periodData = await getDefaultPeriod();
    storage.set('defaultPeriod', periodData.data.defaultSelect.value);
    storage.set('periods', periodData.data.periods);
    const pocketData: any = await initPocketResource();
    storage.set('pocketData', pocketData.data);
    storage.set('projectInfo', pocketData.data.projectInfo);
    const user: any = await getResourceRoute({
      appId: 'data-center',
    });
    menus = user.data.menus;
    pageElements = user.data.pageElements;
    storage.set('pageElements', user.data);
    // const res = await loadResource();
    // if (res) {
    //   addLocale(locale, res.data, {
    //     momentLocale: locale.toLowerCase(),
    //     antd: locale,
    //   });
    // }
    oldRender();
  } catch (e) {
    oldRender();
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
      },
      appId: APPID,
    },
    React.createElement(ConfigProvider, { locale: zhCN }, container),
  );
}

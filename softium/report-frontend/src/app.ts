import { getAccount, getResource } from '@/services/global';
import storage from '@/utils/storage';
import { VulcanProvider, patchRoutesByResources } from '@vulcan/utils';
import React from 'react';
import request from '@/utils/request';
import { APPID } from '@/constant';

interface Route {
  code?: string;
  routes?: Route[];
  [key: string]: any;
}
interface Resource {
  code: string;
  [key: string]: any;
}

let menus: Resource[];
let pageElements: Resource[];

export function patchRoutes({ routes }: { routes: Route[] }) {
  // patchRoutesByResources(routes, menus || []);
}

export async function render(oldRender: () => void) {
  // const locale = getLocale();

  try {
    const { data } = await getAccount();
    storage.set('userInfo', data);
    const resource: any = await getResource();
    menus = resource.data.menus;
    pageElements = resource.data.pageElements;
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
    VulcanProvider.Provider,
    {
      value: {
        elements: pageElements,
        request,
        tableConfig: {
          columnsGetUrl: '/api/saas-web/table/query/table/display-field',
          columnsSetUrl: '/api/saas-web/table/save/table-field/display-status',
          dynamicColumnsGetUrl: '/api/paas-extmodel-web/table/getTable',
        },
        appId: APPID,
      },
    },
    container,
  );
}

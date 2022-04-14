import _ from 'lodash';
import { AxiosResponse } from 'axios';

export function dictionaryTransform(sourceData: any) {
  const systemCodeList = _.filter(sourceData, item => item.systemCode);
  const noneSystemCodeList = _.filter(
    sourceData,
    item =>
      !item.systemCode ||
      item.categoryCode === '2' ||
      item.categoryCode === '3',
  );
  const dictionaryObject: any = {};
  systemCodeList.forEach(item => {
    dictionaryObject[item.systemCode] = getAllChildTransformToTree(
      item.entries,
      noneSystemCodeList,
    );
  });
  return dictionaryObject;
}

function getAllChildTransformToTree(sourceList: any, resourcesList: any) {
  return (sourceList || []).map((item: any) => {
    if (item.childDictionaryId) {
      const child = _.find(resourcesList, ['id', item.childDictionaryId]);
      return {
        ...item,
        children: getAllChildTransformToTree(
          (child && child.entries) || [],
          resourcesList,
        ),
      };
    }
    return item;
  });
}

export function getDictionaryBySystemCode(systemCode: string) {
  const dictionary =
    (localStorage.getItem('enterprise:dictionary') &&
      JSON.parse(localStorage.getItem('enterprise:dictionary') || '')) ||
    {};
  return dictionary[systemCode];
}

export function getNameByValue(sourceList: any, value: any) {
  let name = '';
  let list = _.cloneDeep(sourceList || []);

  while (list.length > 0) {
    const item = list.shift();
    if (item.value === value) {
      name = item.name;
      list = [];
    } else {
      if (item.children) {
        Array.prototype.push.apply(list, item.children);
      }
    }
  }

  return name;
}

export function findTreePathName(
  sourceList: any,
  value: string,
  indexPathArr: any,
) {
  let list = _.cloneDeep(indexPathArr);
  for (let i = 0; i < sourceList.length; i++) {
    list.push(sourceList[i].name);
    if (sourceList[i].value === value) {
      return list;
    }
    let children = sourceList[i].children;
    if (children && children.length) {
      let result: any = findTreePathName(children, value, list);
      if (result) return result;
    }
    list.pop();
  }
  return false;
}

export function findTreePath(
  sourceList: any,
  value: string,
  indexPathArr: any,
) {
  const list = _.cloneDeep(indexPathArr);
  for (let i = 0; i < sourceList.length; i++) {
    list.push(sourceList[i]);
    if (sourceList[i].value === value) {
      return list;
    }
    const children = sourceList[i].children;
    if (children && children.length > 0) {
      const result: any = findTreePath(children, value, list);
      if (result) return result;
    }
    list.pop();
  }
  return false;
}

interface TransformToTableParams {
  current: number;
  pageSize: number;
  pageNo?: number;
}

export async function transformToTableRequest<T extends TransformToTableParams>(
  params: T,
  request: (params: T) => Promise<AxiosResponse>,
) {
  const res = await request({ ...params, pageNo: params.current });

  const { rows, total, pageNo, pageSize, list, pageNum, ...others } = res?.data;

  return {
    data: rows || list,
    total,
    pageSize,
    current: pageNo || pageNum,
    ...others,
  };
}

export function thousands(num: number) {
  const str = num.toString();
  const reg =
    str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, '$1,');
}

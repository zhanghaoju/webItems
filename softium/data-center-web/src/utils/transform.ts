/*
进行数据转化，传进来转化的数据名称和所要转化为的数据名称即可
*/

import { storage } from '@vulcan/utils';

export default function transformText(
  name?: any,
  labelName?: any,
  valueName?: any,
  dataIndex?: any,
  value?: any,
) {
  let returnText = '';
  const pocketData = storage.get('pocketData')[name];
  pocketData.forEach((item: any) => {
    if (item[valueName ? valueName : 'value'] === value[dataIndex]) {
      returnText = item[labelName ? labelName : 'label'];
    }
  });
  return returnText;
}

/*
  转化pocket数组，传入要转化的pocket转化为表单下拉框和表格数据展示需要的对象格式
  */
export function transformArray(
  pocketName?: any,
  labelName?: any,
  valueName?: any,
) {
  let returnObject: any = {};
  const pocketData = storage.get('pocketData')[pocketName];
  pocketData.forEach((item: any) => {
    returnObject[item.value] = {
      text: item[labelName ? labelName : 'label'],
      value: item[valueName ? valueName : 'value'],
    };
  });
  return returnObject;
}

export function transformTextToArray(
  pocketData?: any,
  labelName?: any,
  valueName?: any,
  dataIndex?: any,
  value?: any,
) {
  let returnText = '';
  pocketData.forEach((item: any) => {
    if (item[valueName ? valueName : 'value'] === value[dataIndex]) {
      returnText = item[labelName ? labelName : 'label'];
    }
  });
  return returnText;
}

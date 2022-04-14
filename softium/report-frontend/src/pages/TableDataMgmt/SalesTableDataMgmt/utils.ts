import arrayMove from 'array-move';
import {
  fieldListType,
  tableDataType,
  TreeDataType,
  TemplateList,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
interface commonObj {
  [key: string]: string | undefined | any;
}
/**
 *
 * @param targetKeys 选中的keys值
 * @param editTempList 未编辑模板的内容
 */
export function getEditcustomFields(
  treeData: tableDataType[],
  targetKeys: string[],
) {
  let obj: commonObj = {};
  for (let item of treeData) {
    if (targetKeys.indexOf(item?.fieldCode || '') > -1) {
      obj['customFieldName' + item?.fieldCode] = item.customFieldName
        ? item.customFieldName
        : item.fieldName;
    }
    if (item.children) {
      let childrenObj = getEditcustomFields(item.children, targetKeys);
      obj = { ...obj, ...childrenObj };
    }
  }
  return obj;
}
/**
 * 将穿梭框中的list类型的keys 转换成树结构数据，展示在table中
 * @param treeData
 * @param targetKeys
 */
export function transformTree(
  treeData: TreeDataType[],
  targetKeys: string[],
  editTempList?: tableDataType[],
) {
  //如果是编辑模板 ，则需要将原来模板的 自定义名称（customFieldName），字段id和模板ID（templateId）取出来
  let obj: commonObj = {};
  if (editTempList && editTempList.length > 0) {
    for (let item of editTempList) {
      obj[item?.fieldCode as string] = item || {};
    }
  }

  let dragTreeData = [];
  for (let item of treeData) {
    let oldItem = obj[item?.key as string] || {};
    if (targetKeys.indexOf(item.key as string) > -1 && !item.children) {
      dragTreeData.push({
        fieldType: item?.fieldType,
        fieldCode: item?.key,
        fieldName: item?.title,
        customFieldName: oldItem?.customFieldName
          ? oldItem?.customFieldName
          : item?.title,
        id: oldItem?.id,
        templateId: oldItem?.templateId,
        orders: oldItem?.orders ? oldItem?.orders : 0,
      });
    } else {
      if (item.children) {
        let obj: tableDataType = {
          fieldType: item?.fieldType,
          fieldCode: item?.key,
          fieldName: item?.title,
          customFieldName: oldItem?.customFieldName
            ? oldItem?.customFieldName
            : item?.title,
          id: oldItem?.id,
          templateId: oldItem?.templateId,
          orders: oldItem?.orders ? oldItem?.orders : 0,
        };
        let arr = transformTree(item.children, targetKeys, editTempList);
        if (arr.length > 0) {
          obj.children = arr;
          dragTreeData.push(obj);
        }
      }
    }
  }
  dragTreeData = dragTreeData.sort((a, b) => a.orders - b.orders);
  return dragTreeData;
}

/**
 * 给需要拖动的table数据添加index 从0开始
 * @param treeData
 * @param index
 */
export function addIndex(treeData: tableDataType[], orders: number): any[] {
  let newTreeData = JSON.parse(JSON.stringify(treeData));
  let arr = [];
  for (let item of newTreeData) {
    item.orders = orders++;
    arr.push(item);
    if (item.children) {
      let childrenArr = addIndex(item.children, orders);
      orders = orders + childrenArr.length;
      arr = [...arr, ...childrenArr];
    }
  }
  return arr;
}

/**
 * 根据index找到被拖动的两个元素， 进行元素位置转换 只可以同一个维度转换，不可跨层级
 * @param treeData
 * @param newItem
 * @param oldItem
 */
export function myThroughKey(
  treeData: tableDataType[],
  newItem: tableDataType,
  oldItem: tableDataType,
): any[] {
  let newIndex = -1,
    oldIndex = -1;
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].fieldCode === newItem.fieldCode) {
      newIndex = i;
    }
    if (treeData[i].fieldCode === oldItem.fieldCode) {
      oldIndex = i;
    }
    if (newIndex > -1 && oldIndex > -1) {
      const newData = arrayMove([...treeData], oldIndex, newIndex).filter(
        el => !!el,
      );
      return newData;
    }
  }
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      treeData[i].children = myThroughKey(
        treeData[i].children || [],
        newItem,
        oldItem,
      );
    }
  }
  return treeData;
}

/**
 * 从后端接口获取所有可以选的字段的list  ，然后根据fieldType字段，转换成二级树结构。展示在穿梭框中
 * @param list
 */
export function listTransformTree(list: fieldListType[]) {
  let fieldTypeObj: commonObj = {};
  let fieldTypeTree = [];
  for (let item of list) {
    let obj = {
      key: item.fieldCode,
      title: item.fieldName,
      fieldType: item?.fieldType,
    };
    if (fieldTypeObj[item?.fieldType as string]) {
      fieldTypeObj[item?.fieldType as string].push(obj);
    } else {
      fieldTypeObj[item?.fieldType as string] = [obj];
    }
  }
  for (let item in fieldTypeObj) {
    if (item === '基本信息') {
      fieldTypeTree.unshift(...fieldTypeObj[item]);
    } else {
      let obj = {
        key: item,
        title: item,
        children: fieldTypeObj[item],
      };
      fieldTypeTree.push(obj);
    }
  }
  return fieldTypeTree;
}

/**
 *
 * @param treeList 被拖拽的table数据结构
 * @param fields  自定义字段的修改值
 * @param id  被编辑或新建的模板ID
 * return 将树结构数据，展开为list的发送给后端
 */
export function treeTransformList(
  treeList: tableDataType[],
  fields: any,
  id: string,
) {
  let list: tableDataType[] = addIndex(treeList, 0);
  let fieldList = [];
  for (let item of list) {
    // let oldItem = obj[item.fieldCode] || {};
    // if (item.children) {
    item.customFieldName = fields['customFieldName' + item.fieldCode]
      ? fields['customFieldName' + item.fieldCode]
      : item.customFieldName;
    // item.id = oldItem.id;
    item.templateId = id;
    fieldList.push(item);
    // }
  }
  return fieldList;
}

/**
 *
 * @param institutionCategoryOption  机构主数据字典
 * @param code 需要翻译的code
 */
export function instMainCategoryToEN(
  institutionCategoryOption: any[],
  code: string,
) {
  for (let item of institutionCategoryOption) {
    if (item.value === code) {
      return item.text;
    }
  }
  return '-';
}

/**
 *
 * @param data 所有主数据的二级数据
 * @param mainCode 主数据的code 通过主数据的code 获取二级的数据字典
 * @param code 二级数据的code
 */
export function instCategoryToEN(data: any, mainCode: string, code: string) {
  const { OtherType, HospitalType, PharmacyType, AgentType } = data || {};
  let optionsData = [];
  switch (mainCode) {
    case 'Other':
      optionsData = OtherType || [];
      break;
    case 'HealthCare':
      optionsData = HospitalType || [];
      break;
    case 'Pharmacy':
      optionsData = PharmacyType || [];
      break;
    case 'Agent':
      optionsData = AgentType || [];
      break;
    default:
    // 默认代码块
  }
  for (let item of optionsData) {
    if (item.value === code) {
      return item.name;
    }
  }
  return '-';
}

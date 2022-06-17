import { searchTag } from '@/services/tag';
import { getColumn } from '@/services/applicationInfo';

/**
 * string transfer object
 * @param value
 */
export const transferObj = (value: string) => JSON.parse(value);

/**
 * object transfer string
 * @param value
 */
export const transferStr = (value: any) => JSON.stringify(value);

/**
 * set store
 * @param key
 * @param data
 */
export const setStore = (key: string, data: any) => {
  try {
    window.localStorage.setItem(key, transferStr(data));
  } catch (e) {
    console.error(e);
  }
};

/**
 * get store
 * @param key
 */
export const getStore = (key: string) => {
  const result: any = window.localStorage.getItem(key);
  return transferObj(result);
};

/**
 * columns sort
 * @param columns 源数据
 * @param key     根据排序key
 */
export const sortColumns = (columns: any, key: string = 'order') => {
  return columns.sort((a: any, b: any) => a[key] - b[key]);
};

/**
 * deep by key find value
 * @param data 数据源
 * @param value 查找的值
 * @param key 根据哪个属性查找值
 * @param children 下一级属性
 */
export const getOptions = (
  data: any,
  value: string | number,
  key: string = 'value',
  children = 'children',
) => {
  for (const item of data) {
    if (item[key] === value) return item;
    if (item[children] && Array.isArray(item[children])) {
      const result: any[] = getOptions(item[children], value, key, children);
      if (result) return result;
    }
  }
};

/**
 * 获取缓存字典
 */
export const getStoreDictionary = () => getStore('enterprise:dictionary') || {};

export const setStoreDictionary = (data: any) =>
  setStore('enterprise:dictionary', data);

/**
 * get by key dictionary
 * @param key
 */
export const getDictionary = (key: string) => {
  const dictionary = getStoreDictionary() || {};
  return dictionary[key] || [];
};

/**
 * 动态字段字典
 * @param allFields
 */
export const handleDynamicDictionary = (allFields: any[] = []) => {
  const dynamicFields = allFields.filter(
    (item: any) => item?.dictionary?.id && item?.prop === 'ext',
  );
  const dictionary = getStoreDictionary();
  dynamicFields.forEach(item => {
    const oid: string = item.dictionary.oid;
    dictionary[`dynamic${oid}`] = item.dictionary.dictionaryEntries;
  });
  setStoreDictionary(dictionary);
};

/**
 * 标签
 * @param type
 */
export const handleTag = (type: string = '') => {
  searchTag({ type, needPaging: true }).then((res: any) => {
    const result: any = [];
    const dictionary = getStoreDictionary();
    res.data.list.forEach((item: any) => {
      result.push({
        name: item.name,
        label: item.name,
        value: item.id,
      });
    });
    dictionary[`${type ? type : 'All'}Tag`] = result;
    setStoreDictionary(dictionary);
  });
};

/**
 * 处理columns
 * @param table
 * @param columns
 */
export const handleColumns = (table: string, columns: any[] = []) => {
  return new Promise(resolve => {
    getColumn({ table }).then((res: any) => {
      if (res) {
        const { data } = res;
        handleDynamicDictionary(data); // 处理动态字段字典（详情使用）

        const extFields: any[] = data.filter((t: any) => t?.prop === 'ext');
        const formFields: any[] = [];
        const detailFields: any[] = [];
        const tableFields: any[] = [];
        const searchErpCode: boolean = !data.find(
          (t: any) => t.name === 'erpCode',
        ).isHidden;
        columns.forEach(item => {
          const column: any = data.find((t: any) => t.name === item.name) || {};
          if (Object.keys(column).length > 0) {
            item.label = column.dispName || item.label;
            if (!item.args) item.args = {};
            item.args.required =
              typeof item.args.required === 'boolean'
                ? item.args.required
                : !!column.required;
            item.args.hideShow =
              typeof item.args.hideShow === 'boolean'
                ? item.args.hideShow
                : !!column.isHidden;
          }
          if (/ID$/.test(item.label) && item.args?.replaceLabel)
            item.label = item.label.replace(/ID/, '');
          if (!item?.args?.hideInForm) formFields.push(item);
          if (!item?.args?.hideInDetail) {
            detailFields.push({
              label: item.label,
              value: item.name,
              order: item.order,
              dictionary: item.args.dictionary,
              multiple: item?.attr?.mode === 'multiple',
              group: item.group,
            });
          }
          if (!item.args.hideInTable && !column.isHidden) {
            if (item.args?.keyWord) {
              item.args.table.tooltip = `${item.args.table.tooltip}${
                searchErpCode ? '、ERP编码' : ''
              }`;
            }
            tableFields.push({
              title: column.dispName || item.label,
              dataIndex: item.name,
              order: item.order,
              ...item?.args?.table,
            });
          }
        });
        resolve({
          extFields,
          formFields,
          detailFields,
          tableFields,
          searchErpCode,
        });
      }
    });
  });
};

export const dictionaryToOptions = (
  sourceData: any[],
  label: string = 'name',
  value: string = 'id',
) => {
  const result: any[] = [];
  sourceData.forEach((item: any) => {
    result.push({
      label: item.name,
      value: item.value,
    });
  });
  return result;
};

export const layout1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

export const layout12 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

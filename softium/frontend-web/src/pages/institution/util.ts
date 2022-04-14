import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { VulcanFile } from '@vulcan/utils';
import { getColumn } from '@/services/applicationInfo';
import moment from 'moment';
import { deleteInstitution } from '@/services/institution';
import _ from 'lodash';
import { getOptions } from '@/utils/utils';

export const getDictionaryByCurrentSystemCode = (key: string) => {
  const data = getDictionaryBySystemCode(key) || [];
  const newData: any = [];
  data.forEach((item: any) => {
    newData.push({
      label: item.name,
      value: item.value,
    });
  });
  return newData;
};

export const findByValue = (data: any[], value: string | number) => {
  return (data || []).find(item => item.value === value) || {};
};

export const getValue = (data: any[] = [], value: string | number) => {
  const result = findByValue(data, value);
  return result.name || result.label || undefined;
};

export const getDictionary = (key: any, value: string) => {
  return findByValue(getDictionaryByCurrentSystemCode(key), value).label;
};

export const getDictionaryEnum = (key: string, type: string = '') => {
  const currentDictionary: any[] = getDictionaryByCurrentSystemCode(key);
  let result: any = {};
  currentDictionary.forEach((item: any) => {
    result[item.value] = {
      text: item.label,
    };
    switch (type) {
      case 'state':
        result[item.value].status =
          item.value === 'Active' ? 'Success' : 'Error';
        break;
    }
  });
  return result;
};

export const getData = (item: any, value: string, data: any = {}) => {
  if (_.isUndefined(value) || _.isNull(value)) return null;
  let values: string[] = [];
  const valuesList: string[] = item.multiple
    ? /^(\[)(.*)(\])$/.test(value)
      ? JSON.parse(value)
      : _.isArray(value)
      ? value
      : value.split(',')
    : [value];
  valuesList.forEach((str: string) => {
    const dictionary: any = getDictionaryBySystemCode(item.dictionary) || [];
    const result: any = getOptions(dictionary, str) || {};
    values.push(result.name);
  });
  return values.join(',');
};

export const exportObj = {
  manual: true,
  formatResult: (res: any) => res,
  onSuccess: (res: any) => VulcanFile.export(res),
};

export const getFields = (data: any) => {
  let detailFields: any[] = [];
  (data || []).forEach((item: any) => {
    detailFields.push({
      label: item.dispName,
      value: item.name,
      dictionary: item.dictionary,
      order: item.order,
    });
  });
  return detailFields;
};

export const getTableExtColumns = (table: string) => {
  return new Promise(resolve => {
    getColumn({ table }).then((res: any) => {
      if (res) {
        const ext = (res?.data || []).filter(
          (item: any) => item.prop === 'ext',
        );
        const semiFixed = res.data.filter(
          (item: any) => item.extProps === 'semiFixed' && !item.isHidden,
        );
        resolve({
          detailFields: getFields(ext),
          data: ext,
          allFields: res?.data,
          semiFixed: semiFixed || [],
        });
      }
    });
  });
};

export const handleDictionary = (data: any[]) => {
  data.forEach((item: any) => {
    delete item.dictionaryId;
    delete item.childDictionaryId;
    delete item.englishName;
    delete item.extProps;
    delete item.systemValue;
    delete item.treePath;
    delete item.dictionaryCode;
    item.label = item.name;
  });
};

/*
 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

 出生日期计算方法。
 15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
 2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
 下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
 公式(1)中：
 i----表示号码字符从由至左包括校验码在内的位置序号；
 ai----表示第i位置上的号码字符值；
 Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
 i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
 Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1

 */
//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
export const identityCodeValid = (code: any) => {
  const city: any = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  let tip = '';
  let pass = true;
  const str = code.substr(0, 2);

  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
      code,
    )
  ) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[+str]) {
    tip = '地址编码错误';
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
    }
  }
  return {
    isBool: pass,
    tip: tip,
  };
};

export const handleLikeFieldChange = (
  e: any,
  form: any,
  key: string = 'likeField',
) => {
  const value = e.target.value;
  const v = form.getFieldsValue();
  v[key] = value.replace(/[\^]/g, '');
  form.setFieldsValue(v);
};

export const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export const formItemLayout1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
export const formItemLayout3 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

let institutionTooltipTitle = '';
export const getShowErp = (data: any = []) => {
  if (data.length > 0) {
    const findCode: any = (data || []).find(
      (item: any) => item.name === 'erpCode' && !item.isHidden,
    );
    institutionTooltipTitle = !!findCode ? '、ERP编码' : '';
  }
  return institutionTooltipTitle;
};

export const getColumns = (table: string) => {
  return new Promise(resolve => {
    getTableExtColumns(table).then((res: any) => {
      resolve(handleOldColumns(res));
    });
  });
};

export const handleOldColumns = (res: any) => {
  const semiFixed: any[] = [];
  (res.semiFixed || []).forEach((item: any) => {
    semiFixed.push({
      dispName: item.dispName,
      name: item.name,
      title: item.dispName,
      dataIndex: item.name,
      ellipsis: true,
      width: 130,
      search: false,
      order: item.name === 'erpCode' ? 35 : item.dispOrder,
      dispType: item.dispType,
    });
  });
  return {
    searchErpCode: !!getShowErp(semiFixed),
    semiFixed,
    allFields: res.allFields,
    extMetadata: res.data,
  };
};

export const updateState = (
  record: any,
  category: string,
  request: any,
  reload: any,
) => {
  const data: any = JSON.parse(JSON.stringify(record));
  const state = data.state.toLowerCase() === 'active';
  data.state = state ? 'Inactive' : 'Active';
  data.institutionCategory = category;
  data.subCategory = data.subCategoryName;
  data.serviceAttribute = data.serviceAttributeName;
  const address = {
    address: data.address,
    id: data.addressId,
    longitude: data.longitude,
    latitude: data.latitude,
  };
  if (data.tag) {
    const tags: any = [];
    const tagArray: string[] = _.isString(data.tag)
      ? data.tag.split(',')
      : _.isArray(data.tag)
      ? data.tag
      : [];
    tagArray.forEach((item: any) => tags.push({ tagId: item }));
    data.tag = tags;
  } else {
    data.tag = [];
  }
  request({ ...data, address, type: category }).then((res: any) => {
    res && reload && reload(`${state ? '失效' : '生效'}成功`);
  });
};

export const institutionDel = (
  id: string,
  reload: any,
  childRef: any = null,
) => {
  childRef && childRef.current.toggleSpinning();
  deleteInstitution({ id })
    .then((res: any) => {
      res && reload('删除成功');
      childRef && childRef.current.toggleSpinning();
    })
    .catch(() => {
      childRef && childRef.current.toggleSpinning();
    });
};

export const getTransformDictionary = (data: any[], renderText: any = {}) => {
  const list = JSON.parse(JSON.stringify(data)) || [];
  list.forEach((item: any, index: number) => {
    item['typeName'] = data[index].type;
    item['categoryName'] = data[index].category;
    item['subCategoryName'] = data[index].subCategory;
    item['serviceAttributeName'] = data[index].serviceAttribute;
    if (item.createTime)
      item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
    if (item.updateTime)
      item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
    if (item.serviceAttribute) {
      const attributeList: string[] = item.serviceAttribute.split(',');
      let values: string[] = [];
      if (attributeList.length > 0) {
        attributeList.forEach((v: string) => {
          values.push(getDictionary('ServiceAttribute', v));
        });
      }
      item.serviceAttribute = values.join(',');
    }
    if (item.subCategory) {
      item.subCategory = getDictionary(
        `${item.category}Category`,
        item.subCategory,
      );
    }
    for (const t in item) {
      if (t === 'category') {
        let type = data[index].type;
        if (type) {
          if (type === 'HealthCare') type = 'Hospital';
          item[t] = getDictionary(`${type}Type`, item[t]);
        }
      } else if (renderText[t]) {
        if (item[t] === 'HealthCare' && t === 'type') item[t] = 'Hospital';
        item[t] = getDictionary(renderText[t], item[t]);
      }
    }
  });
  return list;
};

export const handleColumnsData = (fields: any[], allFields: any[]) => {
  const result: any[] = [];
  [...fields].forEach(item => {
    const res = (allFields || []).find(
      (t: any) =>
        t.name === item.dataIndex ||
        t.name === item.value ||
        t.name === item.name,
    );
    if (res && res.isHidden) return null;
    if (res) {
      result.push({
        ...item,
        title: res.dispName,
        label: res.dispName,
        // order: res.dispOrder,
        required:
          typeof item.required === 'boolean' ? item.required : !!res.required,
        hideInTable: !!res.isHidden ? true : item.hideInTable,
        hideInSearch: !!res.isHidden ? true : item.hideInSearch,
        hideShow: !!res.isHidden,
      });
    } else {
      result.push({ ...item });
    }
  });
  return result || [];
};

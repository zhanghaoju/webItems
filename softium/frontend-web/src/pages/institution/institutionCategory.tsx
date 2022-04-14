import { layout1 } from '@/utils/utils';
import {
  dcrInsertAgent,
  dcrInsertDistributor,
  dcrInsertHospital,
  dcrInsertOther,
  dcrInsertPharmacy,
  insertAgent,
  insertDistributor,
  insertHospital,
  insertOther,
  insertPharmacy,
  updateAgent,
  updateDistributor,
  updateHospital,
  updateOther,
  updatePharmacy,
} from '@/services/institution';
import {
  findByValue,
  getDictionaryByCurrentSystemCode,
  getDictionaryEnum,
  handleLikeFieldChange,
  identityCodeValid,
} from '@/pages/institution/util';
import { Input, Select, Tooltip } from 'antd';
import React from 'react';
import CitySelect from '@/pages/institution/citySelect';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import _ from 'lodash';

interface InstitutionCategory {
  [key: string]: {
    dcr: string;
    code: string;
    table: string;
    category: string;
    dictionaryCategory?: string;
    request?: any;
    dcrRequest?: any;
    updateRequest?: any;
    hideFormCard?: boolean;
    hideExtCard?: boolean;
    fields?: any[];
  };
}

const baseInstitutionColumns = [
  {
    name: 'name',
    label: '机构名称',
    order: 10,
    itemLayout: layout1,
    args: {
      span: 24,
      required: true,
      table: {
        fixed: 'left',
        width: 240,
        order: 10,
        hideInSearch: true,
      },
    },
    group: '基本信息',
  },
  {
    name: 'likeField',
    label: '关键词',
    args: {
      hideInDetail: true,
      hideInForm: true,
      keyWord: true,
      table: {
        hideInTable: true,
        tooltip: `可查询项：机构名称、机构编码、机构别名`,
        order: 2000,
        renderFormItem: (item: any, config: any, form: any) => {
          return (
            <Input
              placeholder="请输入"
              onKeyUp={e => handleLikeFieldChange(e, form)}
              autoComplete="off"
            />
          );
        },
      },
    },
  },
  {
    label: '机构编码',
    name: 'code',
    order: 20,
    args: {
      table: {
        ellipsis: true,
        fixed: 'left',
        width: 160,
        order: 30,
        hideInSearch: true,
      },
    },
    group: '基本信息',
  },
  {
    name: 'erpCode',
    label: 'ERP编码',
    order: 30,
    args: {
      table: {
        ellipsis: true,
        width: 130,
        order: 35,
        hideInSearch: true,
      },
    },
    group: '基本信息',
  },
  {
    name: 'provinceCode',
    label: '省份',
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        ellipsis: true,
        hideInTable: true,
        width: 100,
        order: 50,
        valueType: 'select',
        valueEnum: getDictionaryEnum('Region'),
        fieldProps: {
          showSearch: true,
          filterOption: (input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
      },
    },
    order: 50,
  },
  {
    name: 'provinceId',
    label: '省份',
    order: 40,
    args: {
      type: 'select',
      placeholder: '请选择省份',
      dictionary: 'Region',
      childKey: 'cityId,countyId',
      replaceLabel: 'ID',
      localSearch: true,
      hideShow: false,
      required: true,
      hideInDetail: true,
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'province',
    label: '省份',
    order: 40,
    args: {
      hideInDetail: false,
      hideInForm: true,
      table: {
        ellipsis: true,
        hideInSearch: true,
        width: 100,
        order: 40,
      },
    },
    group: '基本信息',
  },
  {
    name: 'cityId',
    label: '城市',
    order: 50,
    args: {
      type: 'select',
      placeholder: '请选择城市',
      dictionary: 'Region',
      childKey: 'countyId',
      parentKey: 'provinceId',
      replaceLabel: 'ID',
      localSearch: true,
      hideShow: false,
      required: true,
      hideInDetail: true,
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'city',
    label: '城市',
    order: 50,
    args: {
      hideInForm: true,
      table: {
        ellipsis: true,
        order: 60,
        hideInSearch: true,
        width: 100,
      },
    },
    group: '基本信息',
  },
  {
    name: 'cityCode',
    label: '城市',
    args: {
      hideInForm: true,
      hideInDetail: true,
      table: {
        ellipsis: true,
        hideInTable: true,
        width: 100,
        order: 30,
        renderFormItem: (item: any, config: any, form: any) => {
          const provinceCode = form.getFieldValue('provinceCode');
          return (
            <CitySelect
              {...config}
              state={{
                type: provinceCode,
              }}
              form={form}
              onChange={(value: string[]) => {
                form.validateFields().then((res: any) => {
                  res.cityCode = value;
                  form.setFieldsValue(res);
                });
              }}
            />
          );
        },
      },
    },
    order: 30,
  },
  {
    name: 'countyId',
    label: '区县',
    order: 70,
    args: {
      type: 'select',
      placeholder: '请选择区县',
      dictionary: 'Region',
      parentKey: 'cityId',
      replaceLabel: 'ID',
      localSearch: true,
      hideShow: false,
      hideInDetail: true,
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'county',
    label: '区县',
    order: 70,
    args: {
      hideInForm: true,
      table: {
        ellipsis: true,
        hideInSearch: true,
        width: 100,
        order: 80,
      },
    },
    group: '基本信息',
  },
  {
    name: 'address',
    label: '地址',
    order: 80,
    itemLayout: layout1,
    args: {
      type: 'textarea',
      span: 24,
      table: {
        ellipsis: true,
        hideInSearch: true,
        width: 300,
        order: 90,
        renderText: (value: any) => {
          // @ts-ignore
          return _.isObject(value) ? value.address : value;
        },
      },
    },
    group: '基本信息',
  },
  {
    name: 'longitude',
    label: '经度',
    rules: [
      () => ({
        validator(_: any, value: any) {
          if (value && !/^[0-9]+(.[0-9]{1,6})?$/.test(value))
            return Promise.reject(new Error('经度格式不正确'));
          return Promise.resolve();
        },
      }),
    ],
    order: 90,
    args: {
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'latitude',
    label: '纬度',
    rules: [
      () => ({
        validator(_: any, value: any) {
          if (value && !/^[0-9]+(.[0-9]{1,6})?$/.test(value))
            return Promise.reject(new Error('纬度格式不正确'));
          return Promise.resolve();
        },
      }),
    ],
    order: 100,
    args: {
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'serviceAttribute',
    label: '业务属性',
    order: 120,
    args: {
      type: 'select',
      dictionary: 'ServiceAttribute',
      table: {
        width: '10%',
        order: 100,
        hideInSearch: true,
      },
    },
    attr: {
      mode: 'multiple',
    },
    group: '基本信息',
  },
  {
    name: 'remark',
    label: '备注',
    order: 130,
    itemLayout: layout1,
    args: {
      type: 'textarea',
      span: 24,
      table: {
        width: 240,
        order: 120,
        hideInSearch: true,
        ellipsis: true,
      },
    },
    group: '基本信息',
  },
  {
    name: 'source',
    label: '创建源',
    order: 145,
    args: {
      dictionary: 'InstitutionSource',
      hideInForm: true,
      table: {
        width: '10%',
        order: 130,
        valueEnum: getDictionaryEnum('InstitutionSource'),
      },
    },
    group: '基本信息',
  },
  {
    name: 'socialCreditCode',
    label: '社会信用代码',
    order: 150,
    args: {
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'website',
    label: '官网',
    order: 160,
    args: {
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'tagIds',
    label: '标签',
    args: {
      type: 'select',
      dictionary: 'InstitutionTag',
      hideInForm: true,
      hideInDetail: true,
      table: {
        width: '20%',
        valueType: 'select',
        hideInTable: true,
        order: 140,
        valueEnum: getDictionaryEnum('InstitutionTag'),
        fieldProps: {
          showSearch: true,
          mode: 'multiple',
          filterOption: (input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
      },
    },
    attr: {
      mode: 'multiple',
      maxTagCount: 'responsive',
    },
    order: 210,
    group: '基本信息',
  },
  {
    name: 'tag',
    label: '标签',
    attr: {
      mode: 'multiple',
      maxTagCount: 'responsive',
    },
    args: {
      type: 'select',
      dictionary: 'InstitutionTag',
      table: {
        width: '20%',
        hideInSearch: true,
        order: 140,
        render: (text: any, record: any) => {
          if (!record.tag) return null;
          const allStr: string[] = [];
          if (_.isArray(record.tag)) {
            const tags: string[] = [];
            record.tag.forEach((item: any) => tags.push(item.tagId));
            record.tag = tags;
          }
          const res = record.tag.split(',');
          res.forEach((item: string) => {
            allStr.push(
              findByValue(
                getDictionaryBySystemCode('InstitutionTag') || [],
                item,
              ).label,
            );
          });
          return (
            <Tooltip title={allStr.join(',')}>
              {[...allStr].splice(0, 2).join(',')}
              {allStr.length > 2 ? '...' : ''}
            </Tooltip>
          );
        },
      },
    },
    group: '基本信息',
  },
  {
    name: 'state',
    label: '状态',
    order: 220,
    itemLayout: layout1,
    args: {
      type: 'radio',
      dictionary: 'State',
      span: 24,
      table: {
        width: '10%',
        order: 110,
        valueEnum: getDictionaryEnum('State', 'state'),
      },
    },
    group: '基本信息',
  },
  {
    label: '创建人',
    name: 'createByName',
    order: 230,
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        width: 100,
        hideInSearch: true,
        order: 350,
        ellipsis: true,
      },
    },
    group: '基本信息',
  },
  {
    label: '创建日期',
    name: 'createTime',
    order: 240,
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        width: '10%',
        hideInSearch: true,
        ellipsis: true,
        order: 360,
      },
    },
    group: '基本信息',
  },
  {
    label: '更新人',
    name: 'updateByName',
    order: 250,
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        width: 100,
        hideInSearch: true,
        order: 370,
        ellipsis: true,
      },
    },
    group: '基本信息',
  },
  {
    label: '更新日期',
    name: 'updateTime',
    order: 260,
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        width: '10%',
        hideInSearch: true,
        ellipsis: true,
        order: 380,
      },
    },
    group: '基本信息',
  },
];

const tel = {
  name: 'tel',
  label: '联系电话',
  order: 140,
  args: {
    hideInTable: true,
  },
  group: '基本信息',
};

export let institutionCategory: InstitutionCategory = {
  HealthCare: {
    dcr: 'isOpenHealthCareDcr',
    code: 'isUseIndustryHealthCareCode',
    table: 't_mdm_institution_healthcare',
    category: 'HealthCare',
    dictionaryCategory: 'HospitalType',
    request: insertHospital,
    dcrRequest: dcrInsertHospital,
    updateRequest: updateHospital,
    hideFormCard: true,
    hideExtCard: true,
    fields: [
      ...baseInstitutionColumns,
      {
        name: 'category',
        label: '机构子类',
        order: 110,
        args: {
          type: 'select',
          dictionary: 'HospitalType',
          childKey: 'subCategory',
          table: {
            ellipsis: true,
            hideInSearch: false,
            tooltip: false,
            width: '10%',
            order: 91,
            valueEnum: getDictionaryEnum('HospitalType'),
          },
        },
        group: '基本信息',
      },
      {
        name: 'subCategory',
        label: '机构子类',
        order: 111,
        args: {
          type: 'select',
          dictionary: 'HospitalType',
          parentKey: 'category',
          table: {
            ellipsis: true,
            hideInTable: true,
            valueType: 'select',
            width: '10%',
            order: 90,
            renderFormItem: (item: any, config: any, form: any) => {
              const category = form.getFieldValue('category');
              const subCategory = getDictionaryByCurrentSystemCode(
                `${category}Category`,
              );
              return (
                <Select>
                  {(subCategory || []).map((item: any) => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              );
            },
          },
        },
        group: '基本信息',
      },
      {
        label: '机构子类',
        name: 'subCategory',
        args: {
          hideInDetail: true,
          hideInForm: true,
          table: {
            ellipsis: true,
            hideInSearch: true,
            width: '10%',
            order: 92,
          },
        },
      },
      {
        name: 'level',
        label: '机构级别',
        order: 112,
        args: {
          type: 'select',
          dictionary: 'InstitutionGrade',
          table: {
            width: '10%',
            hideInSearch: false,
            order: 94,
            valueEnum: getDictionaryEnum('InstitutionGrade'),
          },
        },
        group: '基本信息',
      },
      {
        name: 'property',
        label: '机构属性',
        order: 113,
        args: {
          type: 'select',
          dictionary: 'InstitutionAttribute',
          table: {
            width: '10%',
            hideInSearch: false,
            order: 93,
            valueEnum: getDictionaryEnum('InstitutionAttribute'),
          },
        },
        group: '基本信息',
      },
      tel,
      {
        type: 'inputNumber',
        name: 'betNum',
        label: '床位数',
        order: 170,
        args: {
          hideInTable: true,
        },
        group: '基本信息',
      },
      {
        type: 'inputNumber',
        name: 'hospitalizedNum',
        label: '年住院量',
        order: 180,
        args: {
          hideInTable: true,
        },
        group: '基本信息',
      },
      {
        type: 'inputNumber',
        name: 'visits',
        label: '年门诊量',
        order: 190,
        args: {
          hideInTable: true,
        },
        group: '基本信息',
      },
      {
        type: 'inputNumber',
        name: 'staffNum',
        label: '职工人数',
        order: 200,
        args: {
          hideInTable: true,
        },
        group: '基本信息',
      },
      {
        name: 'standardCode',
        label: '行业库是否关联',
        args: {
          hideInForm: true,
          hideInDetail: true,
          table: {
            width: '10%',
            hideInTable: true,
            valueType: 'select',
            valueEnum: getDictionaryEnum('IsMedicalInsurance'),
          },
        },
      },
    ],
  },
  Pharmacy: {
    dcr: 'isOpenPharmacyDcr',
    code: 'isUseIndustryPharmacyCode',
    table: 't_mdm_institution_pharmacy',
    category: 'Pharmacy',
    request: insertPharmacy,
    dcrRequest: dcrInsertPharmacy,
    updateRequest: updatePharmacy,
    hideFormCard: true,
    hideExtCard: true,
    dictionaryCategory: 'PharmacyType',
    fields: [
      ...baseInstitutionColumns,
      {
        name: 'category',
        label: '机构子类',
        order: 110,
        args: {
          type: 'select',
          dictionary: 'PharmacyType',
          table: {
            ellipsis: true,
            width: '10%',
            order: 91,
            valueEnum: getDictionaryEnum('PharmacyType'),
          },
        },
        group: '基本信息',
      },
      tel,
      {
        name: 'standardCode',
        label: '行业库是否关联',
        args: {
          hideInForm: true,
          hideInDetail: true,
          table: {
            width: '10%',
            hideInTable: true,
            valueType: 'select',
            valueEnum: getDictionaryEnum('IsMedicalInsurance'),
          },
        },
      },
    ],
  },
  Distributor: {
    dcr: 'isOpenDistributorDcr',
    code: 'isUseIndustryDistributorCode',
    table: 't_mdm_institution_distributor',
    category: 'Distributor',
    request: insertDistributor,
    dcrRequest: dcrInsertDistributor,
    updateRequest: updateDistributor,
    hideFormCard: true,
    hideExtCard: true,
    dictionaryCategory: 'DistributorType',
    fields: [
      ...baseInstitutionColumns,
      tel,
      {
        name: 'standardCode',
        label: '行业库是否关联',
        args: {
          hideInForm: true,
          hideInDetail: true,
          table: {
            width: '10%',
            hideInTable: true,
            valueType: 'select',
            valueEnum: getDictionaryEnum('IsMedicalInsurance'),
          },
        },
      },
    ],
  },
  Agent: {
    dcr: 'isOpenAgentDcr',
    code: 'isUseIndustryAgentCode',
    table: 't_mdm_institution_Agent',
    category: 'Agent',
    request: insertAgent,
    dcrRequest: dcrInsertAgent,
    updateRequest: updateAgent,
    fields: [
      ...baseInstitutionColumns,
      {
        name: 'category',
        label: '机构子类',
        order: 110,
        args: {
          type: 'select',
          dictionary: 'AgentType',
          table: {
            ellipsis: true,
            width: '10%',
            order: 91,
            valueEnum: getDictionaryEnum('AgentType'),
          },
        },
        group: '基本信息',
      },
      {
        name: 'contacts',
        label: '业务联系人',
        order: 10,
        args: {
          table: {
            width: '10%',
            hideInSearch: true,
            order: 92,
          },
        },
        group: '联系人信息',
      },
      {
        name: 'tel',
        label: '联系人手机号',
        order: 20,
        rules: [
          () => ({
            validator(rule: any, value: any) {
              if (value && !/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
                return Promise.reject('手机号格式不正确');
              }
              return Promise.resolve();
            },
          }),
        ],
        args: {
          hideInTable: true,
        },
        group: '联系人信息',
      },
      {
        name: 'fixedTel',
        label: '联系人固定电话',
        order: 30,
        args: {
          hideInTable: true,
        },
        group: '联系人信息',
      },
      {
        name: 'identityCard',
        label: '联系人身份证号',
        order: 40,
        rules: [
          () => ({
            validator(rule: any, value: any) {
              if (value) {
                const res = identityCodeValid(value);
                if (!res.isBool) return Promise.reject(res.tip);
              }
              return Promise.resolve();
            },
          }),
        ],
        args: {
          hideInTable: true,
        },
        group: '联系人信息',
      },
      {
        name: 'age',
        label: '联系人年龄',
        order: 50,
        args: {
          hideInTable: true,
        },
        group: '联系人信息',
      },
      {
        name: 'sex',
        label: '联系人性别',
        order: 60,
        args: {
          type: 'select',
          dictionary: 'Gender',
          hideInTable: true,
        },
        group: '联系人信息',
      },
      {
        name: 'beneficiaryName',
        label: '收款方名称',
        order: 10,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryNo',
        label: '收款方账号',
        order: 20,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'bankOfDeposit',
        label: '收款方开户行',
        order: 30,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryBranch',
        label: '收款方支行',
        order: 40,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryProvinceId',
        label: '收款方省',
        order: 60,
        args: {
          type: 'select',
          dictionary: 'Region',
          childKey: 'beneficiaryCountyId,beneficiaryCountyId',
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryCityId',
        label: '收款方市',
        order: 60,
        args: {
          type: 'select',
          dictionary: 'Region',
          childKey: 'beneficiaryCountyId',
          parentKey: 'beneficiaryProvinceId',
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryCountyId',
        label: '收款方区',
        options: 'beneficiaryCounty',
        order: 70,
        args: {
          type: 'select',
          dictionary: 'Region',
          parentKey: 'beneficiaryCityId',
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryBankNo',
        label: '收款方行号',
        order: 80,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
      {
        name: 'beneficiaryTel',
        label: '收款方电话',
        order: 90,
        args: {
          hideInTable: true,
        },
        group: '收款方信息',
      },
    ],
  },
  Other: {
    dcr: 'isOpenOtherDcr',
    code: 'isUseIndustryOtherCode',
    table: 't_mdm_institution_other',
    category: 'Other',
    dictionaryCategory: 'OtherType',
    hideFormCard: true,
    hideExtCard: true,
    request: insertOther,
    dcrRequest: dcrInsertOther,
    updateRequest: updateOther,
    fields: [
      ...baseInstitutionColumns,
      tel,
      {
        name: 'category',
        label: '机构子类',
        order: 110,
        args: {
          type: 'select',
          dictionary: 'OtherType',
          table: {
            ellipsis: true,
            width: '10%',
            order: 91,
            valueEnum: getDictionaryEnum('OtherType'),
          },
        },
        group: '基本信息',
      },
    ],
  },
};

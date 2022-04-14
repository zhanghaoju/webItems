import { layout1 } from '@/utils/utils';
import { getParentNames } from '@/services/product/product';
import {
  getDictionary,
  getDictionaryEnum,
  handleLikeFieldChange,
} from '@/pages/institution/util';
import { Input, Tooltip } from 'antd';
import React from 'react';
import moment from 'moment';

export const ProductColumns = [
  {
    name: 'keyWords',
    label: '关键词',
    args: {
      hideInDetail: true,
      hideInForm: true,
      keyWord: true,
      table: {
        hideInTable: true,
        tooltip: `可查询项：产品名称、产品编码`,
        renderFormItem: (item: any, config: any, form: any) => {
          return (
            <Input
              placeholder="请输入"
              onKeyUp={e => handleLikeFieldChange(e, form, 'keyWords')}
              autoComplete="off"
            />
          );
        },
      },
    },
    order: 1000,
  },
  {
    name: 'name',
    label: '产品名称',
    order: 10,
    args: {
      required: true,
      table: {
        hideInSearch: true,
        width: 240,
        ellipsis: true,
        fixed: 'left',
        order: 20,
      },
    },
    group: '基本信息',
  },
  {
    name: 'code',
    label: '产品编码',
    order: 20,
    args: {
      required: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 30,
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
        hideInSearch: true,
        ellipsis: true,
        order: 35,
      },
    },
    group: '基本信息',
  },
  {
    name: 'level',
    label: '产品层级',
    order: 40,
    args: {
      type: 'select',
      dictionary: 'ProductLevel',
      required: true,
      table: {
        ellipsis: true,
        valueEnum: getDictionaryEnum('ProductLevel'),
        order: 40,
      },
    },
    group: '基本信息',
  },
  {
    name: 'parentName',
    label: '上级产品名称',
    order: 50,
    args: {
      type: 'select',
      disabled: true,
      hideInTable: true,
      remoteSearch: true,
      request: getParentNames,
      selectSearch: {
        nameKey: 'proName',
        paramsKey: ['level'],
      },
      fillFn: ({ val, form, initOptions }: any) => {
        const selected: any = initOptions.find(
          (option: any) => option.id == val,
        );
        form.setFieldsValue({
          parentCode: selected.code,
          parentLevel: selected.level,
        });
      },
    },
    group: '基本信息',
  },
  {
    name: 'parentCode',
    label: '上级产品编码',
    order: 60,
    args: {
      disabled: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 50,
      },
    },
    group: '基本信息',
  },
  {
    name: 'parentLevel',
    label: '上级产品层级',
    order: 70,
    args: {
      type: 'select',
      dictionary: 'ProductLevel',
      disabled: true,
      hideInTable: true,
    },
    group: '基本信息',
  },
  {
    name: 'unit',
    label: '产品单位',
    order: 10,
    args: {
      type: 'select',
      dictionary: 'ProductUnit',
      table: {
        hideInSearch: true,
        ellipsis: true,
        valueEnum: getDictionaryEnum('ProductUnit'),
        order: 90,
      },
    },
    group: '详细信息',
  },
  {
    name: 'tradeName',
    label: '商品名',
    order: 20,
    args: {
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 100,
      },
    },
    group: '详细信息',
  },
  {
    name: 'commonName',
    label: '通⽤名',
    order: 30,
    args: {
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 110,
      },
    },
    group: '详细信息',
  },
  {
    name: 'dosage',
    label: '剂型',
    order: 40,
    args: {
      type: 'select',
      dictionary: 'ProductDosage',
      table: {
        hideInSearch: true,
        ellipsis: true,
        valueEnum: getDictionaryEnum('ProductDosage'),
        order: 120,
      },
    },
    group: '详细信息',
  },
  {
    name: 'price',
    label: '考核价',
    order: 50,
    args: {
      table: {
        hideInSearch: true,
        valueType: 'money',
        ellipsis: true,
        order: 140,
      },
    },
    group: '详细信息',
  },
  {
    name: 'taxRate',
    label: '税率',
    order: 60,
    args: {
      unit: '%',
      type: 'inputNumber',
      table: {
        hideInSearch: true,
        ellipsis: true,
        renderText(text: string | number) {
          return text || text == 0 ? text + '%' : '';
        },
        order: 150,
      },
    },
    attr: {
      precision: 2,
    },
    group: '详细信息',
  },
  {
    name: 'specification',
    label: '规格',
    order: 70,
    args: {
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 130,
      },
    },
    group: '详细信息',
  },
  {
    name: 'validPeriod',
    label: '有效期限',
    order: 80,
    args: {
      type: 'inputNumber',
      unit: '月',
      table: {
        hideInSearch: true,
        order: 160,
        render: (text: number) => {
          return `${text}月`;
        },
      },
    },
    rules: [{ type: 'integer', message: '请输入正整数' }],
    attr: {
      min: 1,
    },
    group: '详细信息',
  },
  {
    name: 'manufacturer',
    label: '生产厂家',
    order: 90,
    itemLayout: layout1,
    args: {
      span: 24,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 60,
      },
    },
    group: '详细信息',
  },
  {
    name: 'remark',
    label: '备注',
    order: 100,
    itemLayout: layout1,
    args: {
      type: 'textarea',
      span: 24,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 70,
      },
    },
    group: '详细信息',
  },
  {
    name: 'approvalNumber',
    label: '批准文号',
    order: 110,
    args: {
      hideInTable: true,
    },
    group: '详细信息',
  },
  {
    name: 'tagIds',
    label: '标签',
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        order: 140,
        valueType: 'select',
        hideInTable: true,
        valueEnum: getDictionaryEnum('ProductTag'),
        fieldProps: {
          showSearch: true,
          mode: 'multiple',
          filterOption: (input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
      },
    },
  },
  {
    name: 'tag',
    label: '标签',
    order: 120,
    args: {
      type: 'select',
      dictionary: 'ProductTag',
      table: {
        width: 160,
        order: 170,
        valueType: 'select',
        hideInSearch: true,
        render: (text: string, record: any) => {
          if (!record.tag) return null;
          const allStr: string[] = [];
          const res = record.tag.split(',');
          res.forEach((item: string) => {
            allStr.push(getDictionary('ProductTag', item));
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
    attr: {
      mode: 'multiple',
      maxTagCount: 'responsive',
    },
    group: '详细信息',
  },
  {
    name: 'state',
    label: '状态',
    order: 130,
    itemLayout: layout1,
    args: {
      type: 'radio',
      span: 24,
      dictionary: 'State',
      table: {
        ellipsis: true,
        valueEnum: getDictionaryEnum('State'),
        order: 80,
      },
    },
    group: '详细信息',
  },
  {
    name: 'createByName',
    label: '创建人',
    args: {
      hideInForm: true,
      hideInDetail: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 160,
      },
    },
  },
  {
    name: 'createTime',
    label: '创建日期',
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        renderText: (text: any) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
        order: 170,
      },
    },
  },
  {
    name: 'updateByName',
    label: '更新人',
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        order: 180,
      },
    },
  },
  {
    name: 'updateTime',
    label: '更新日期',
    args: {
      hideInDetail: true,
      hideInForm: true,
      table: {
        hideInSearch: true,
        ellipsis: true,
        renderText: (text: any) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
        order: 190,
      },
    },
  },
];

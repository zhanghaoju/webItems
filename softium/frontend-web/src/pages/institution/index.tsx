import React, { useState } from 'react';
import { connect } from 'dva';
import ProTable from '@ant-design/pro-table';
import Cascader from '@/components/Cascader';
import { getList } from '@/services/institution';
import { history } from 'umi';
import { Button } from 'antd';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';

interface InstitutionProps {
  institution: any;
  dispatch: any;
}

interface ColumnItemProps {
  id: String;
  category: string;
}

interface CategoryItemProps {
  name: string;
  code: string;
  children?: CategoryItemProps[];
}

const Institution: React.FC<InstitutionProps> = props => {
  const [options, setOptions] = useState(
    getDictionaryBySystemCode('Region') || [],
  );
  const [categoryOptions, setCategoryOption] = useState(
    getDictionaryBySystemCode('InstitutionCategory') || [],
  );
  const [pageInfo, setPageInfo] = useState({
    pageSize: 20,
    current: 1,
    total: 0,
  });

  const filterOptions = (optionData: any[]): any[] => {
    return (optionData || []).map(item => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterOptions(item.children),
        };
      }
      const { children, ...otherOption } = item;
      return {
        ...otherOption,
      };
    });
  };

  const columns: any[] = [
    {
      title: '机构ID',
      dataIndex: 'id',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '机构名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '省份',
      dataIndex: 'province',
      ellipsis: true,
      search: false,
    },
    {
      title: '城市',
      dataIndex: 'city',
      ellipsis: true,
      search: false,
    },
    {
      title: '区县',
      dataIndex: 'county',
      ellipsis: true,
      search: false,
    },
    {
      title: '地址',
      dataIndex: 'address',
      ellipsis: true,
      search: false,
    },
    {
      title: '行政区域',
      dataIndex: 'region',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Cascader
            options={options}
            fieldNames={{ label: 'name', value: 'value' }}
          />
        );
      },
    },
    {
      title: '机构一级属性',
      dataIndex: 'category',
      ellipsis: true,
      search: false,
      renderText: (text: any) => {
        return getNameByValue(categoryOptions, text);
      },
    },
    {
      title: '机构二级属性',
      dataIndex: 'subCategory',
      ellipsis: true,
      search: false,
      renderText: (text: any) => {
        return getNameByValue(categoryOptions, text);
      },
    },
    {
      title: '机构属性',
      dataIndex: 'categorys',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Cascader
            options={categoryOptions}
            fieldNames={{ label: 'name', value: 'value' }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      render: (text: any, record: any) => {
        return (
          <Button
            key="detail"
            type="link"
            onClick={() =>
              history.push(`/institution/info/${record.id}-${record.category}`)
            }
          >
            查看
          </Button>
        );
      },
    },
  ];

  return (
    <ProTable<ColumnItemProps, String[]>
      form={{ autoComplete: 'off' }}
      columns={columns}
      sticky={true}
      scroll={{ x: 'auto' }}
      request={(params: any, sort, filter) => {
        if (params.region) {
          params['provinceId'] = params.region[0];
          params['cityId'] = params.region[1];
          params['countyId'] = params.region[2];
        }
        if (params.categorys) {
          params['category'] = params.categorys[0];
          params['subCategory'] = params.categorys[1];
        }
        return getList({
          ...{ ...params, pageNo: params.current },
          ...sort,
          ...filter,
        });
      }}
      postData={(data: any) => {
        setPageInfo({
          pageSize: data.pageSize,
          current: data.pageNum,
          total: data.total,
        });
        return data.list;
      }}
      pagination={{
        ...pageInfo,
        showQuickJumper: true,
      }}
      rowKey="id"
      toolBarRender={() => [
        <Button
          key="add"
          type="primary"
          onClick={() => history.push(`/institution/info`)}
        >
          添加
        </Button>,
      ]}
    />
  );
};

export default connect(({ dispatch, institution }: InstitutionProps) => ({
  institution,
  dispatch,
}))(Institution);

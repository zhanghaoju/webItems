import React, { ReactNode, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Appeal, AppealQuery } from '@/pages/SalesAppeal/AppealCenter/data';
import { fetch } from './api';
import { history } from 'umi';
import { Select, Spin, TreeSelect } from 'antd';
import expandTree from '@/utils/expandTree';
import { useModel } from 'umi';
import { Table } from '@vulcan/utils';

export const statusEnum = {
  0: {
    text: '等待反馈',
    status: 'default',
  },
  2: {
    text: '驳回',
    status: 'Error',
  },
  3: {
    text: '采纳',
    status: 'Success',
  },
  4: {
    text: '核实中',
    status: 'Processing',
  },
};

const AppealList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { pockets } = useModel('SalesAppeal.SalesAppealModel');

  const {
    windowTimeOption,
    regionTreeOption,
    institutionCategoryOption,
    productOption,
  } = pockets || {};

  const renderOptions = (_: ReactNode, entity: Appeal, index: number) => {
    return [
      <a
        key={'show'}
        onClick={e => {
          history.push(
            `/sales-appeal/appeal-center/approval-center/detail/${entity?.id}`,
          );
        }}
      >
        查看
      </a>,
    ];
  };

  const columns: ProColumns<Appeal>[] = [
    {
      title: '时间窗',
      key: 'windowTime',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            placeholder={'请选择'}
            style={{ width: '100%' }}
            onSelect={t => {
              form.resetFields(['jurisdiction']);
            }}
            options={windowTimeOption?.map((t: { text: any; value: any }) => ({
              label: t?.text,
              value: t?.value,
            }))}
          />
        );
      },
    },
    {
      title: '机构所在省市',
      key: 'region',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            filterTreeNode={(input, treeNode) => {
              return (
                (treeNode?.title + '').indexOf(input) > -1 ||
                (treeNode?.value + '').indexOf(input) > -1
              );
            }}
            treeData={
              regionTreeOption &&
              regionTreeOption.map(
                (t: {
                  text: any;
                  value: any;
                  children: {
                    map: (
                      arg0: (s: {
                        text: any;
                        value: any;
                      }) => { title: any; value: any },
                    ) => undefined;
                  };
                }) => {
                  const ret = {
                    title: t?.text,
                    value: t?.value,
                    children: undefined,
                  };
                  if (t?.children) {
                    ret.children = t?.children.map(
                      (s: { text: any; value: any }) => ({
                        title: s?.text,
                        value: s?.value,
                      }),
                    );
                  }
                  return ret;
                },
              )
            }
            treeDefaultExpandAll
          />
        );
      },
    },
    {
      title: '机构类型',
      dataIndex: 'institutionType',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            filterOption={(input, option) => {
              return (
                (option?.label + '').indexOf(input) > -1 ||
                (option?.value + '').indexOf(input) > -1
              );
            }}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={institutionCategoryOption?.map(
              (t: { text: any; value: any }) => ({
                label: t?.text,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    // {
    //   title: '辖区',
    //   key: 'jurisdiction',
    //   hideInTable: true,
    //   formItemProps: {
    //     dependencies: ['windowTime'],
    //   },
    //   renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
    //     const currentWindowTime = form.getFieldValue('windowTime');
    //     const jurisdictionOptions = windowTimeOption?.find(
    //       (t: { value: any }) => t?.value === currentWindowTime,
    //     )?.children;
    //     const treeData = expandTree(jurisdictionOptions);
    //     return (
    //       <TreeSelect
    //         filterTreeNode={(input, treeNode) => {
    //           return (
    //             (treeNode?.title + '').indexOf(input) > -1 ||
    //             (treeNode?.value + '').indexOf(input) > -1
    //           );
    //         }}
    //         allowClear
    //         treeCheckable={true}
    //         style={{ width: '100%' }}
    //         placeholder={'请选择'}
    //         maxTagCount={2}
    //         dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    //         showCheckedStrategy={TreeSelect.SHOW_ALL}
    //         treeData={treeData}
    //       />
    //     );
    //   },
    // },
    {
      title: '产品',
      key: 'productNames',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        const itemFormat = (item: {
          specification?: string | null | undefined;
          [key: string]: any;
        }) => {
          let detail = '';
          if (item?.specification) {
            detail = item?.specification;
          }
          if (item?.manufacturer) {
            if (detail) {
              detail = `${detail},${item?.manufacturer}`;
            } else {
              detail = item?.manufacturer;
            }
          }
          if (detail) return `${item?.name}(${detail})`;
          return item?.name;
        };
        const itemKeyFormat = (item: {
          code?: string | null | undefined;
          name?: string | null | undefined;
          [key: string]: any;
        }) => {
          return item?.name + '&&' + item?.code;
        };
        const treeData = expandTree(
          productOption,
          'children',
          'name',
          'code',
          itemFormat,
          itemKeyFormat,
        );

        return (
          <TreeSelect
            filterTreeNode={(input, treeNode) => {
              return (
                (treeNode?.title + '').indexOf(input) > -1 ||
                (treeNode?.value + '').indexOf(input) > -1
              );
            }}
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={treeData}
          />
        );
      },
    },
    {
      title: '时间窗',
      dataIndex: 'windowTimeName',
      fixed: 'left',
      search: false,
    },
    {
      title: '机构名称',
      dataIndex: 'institutionName',
      search: false,
    },
    {
      title: '机构状态',
      dataIndex: 'institutionStatusName',
      search: false,
    },
    {
      title: '省份',
      dataIndex: 'provinceName',
      search: false,
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      search: false,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      search: false,
    },
    {
      title: '品规',
      dataIndex: 'productSpecsName',
      search: false,
    },
    {
      title: '流向数量总计',
      dataIndex: 'salesNumTotal',
      search: false,
      valueType: 'digit',
    },
    {
      title: '流向申诉总计',
      dataIndex: 'salesComplaintsTotal',
      search: false,
      valueType: 'digit',
    },
    {
      title: '预期销量总计',
      dataIndex: 'salesEstimateTotal',
      search: false,
      valueType: 'digit',
    },
    {
      title: '申诉人',
      dataIndex: 'complaintsPersonName',
      search: false,
    },
    {
      title: '申诉时间',
      dataIndex: 'complaintsDate',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '申诉原因',
      dataIndex: 'complaintsReasonName',
      search: false,
    },
    {
      title: '申诉状态',
      dataIndex: 'status',
      search: false,
      valueEnum: statusEnum,
    },
    {
      title: '操作',
      valueType: 'option',
      render: renderOptions,
      fixed: 'right',
    },
  ];

  if (windowTimeOption) {
    return (
      <>
        <Table<Appeal, AppealQuery>
          code={'SalesAppeal.AppealCenter.Approval'}
          scroll={{ x: 2400 }}
          sticky={true}
          search={{
            labelWidth: 'auto',
          }}
          form={{
            initialValues: {
              windowTime:
                windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value,
            },
          }}
          request={async params => {
            const res = await fetch(params);
            const { rows, ...others } = res?.data;
            return {
              ...others,
              data: rows,
            };
          }}
          beforeSearchSubmit={params => {
            params.productNames = params?.productNames?.map((item: string) => {
              return item?.split('&&')[0];
            });
            return params;
          }}
          tableLayout={'fixed'}
          columns={columns}
          actionRef={actionRef}
          rowKey="id"
        />
      </>
    );
  }
  return <Spin spinning={true} />;
};

export default AppealList;

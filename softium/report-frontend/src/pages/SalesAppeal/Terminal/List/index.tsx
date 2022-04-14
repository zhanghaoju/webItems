import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { fetch, exp } from '../api';
import { Terminal, TerminalQuery } from '@/pages/SalesAppeal/Terminal/data';
import TerminalDetail, {
  TerminalRef,
} from '@/pages/SalesAppeal/Terminal/Detail';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Select, Space, Spin, TreeSelect } from 'antd';
import { history } from 'umi';
import expandTree from '@/utils/expandTree';
import { useRequest } from 'umi';
import moment from 'moment';
import { Table, VulcanFile } from '@vulcan/utils';

interface MyTreeNode {
  title: string;
  value: string;
  [key: string]: any;
}

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

const TerminalList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { pockets, terminalPeriod } = useModel('SalesAppeal.SalesAppealModel');

  const {
    windowTimeOption,
    regionTreeOption,
    institutionCategoryOption,
    productOption,
  } = pockets || {};

  const [currentWindowTime, setCurrentWindowTime] = useState<string>();

  const exportRequest = useRequest(exp, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      VulcanFile.export(data);
    },
  });

  const [query, setQuery] = useState<TerminalQuery>();

  const finalAddTime =
    terminalPeriod?.salesDataDate &&
    moment(terminalPeriod?.salesDataDate).add(
      terminalPeriod?.complaintsDataDayNumber || 0,
      'd',
    );

  const canAdd: boolean = moment().isBetween(
    terminalPeriod && moment(terminalPeriod?.salesDataDate),
    finalAddTime,
  );

  const renderOptions = (_: ReactNode, entity: Terminal, index: number) => {
    return [
      <a
        key={'detail'}
        onClick={() => {
          showDetail(entity);
        }}
      >
        详情
      </a>,
    ];
  };

  const showDetail = (currentItem: Terminal) => {
    terminalRef?.current?.showDetail(currentItem);
  };

  const terminalRef = useRef<TerminalRef>();

  const columns: ProColumns<Terminal>[] = [
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
      title: '是否目标',
      key: 'target',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '是',
        },
        0: {
          text: '否',
        },
      },
    },
    {
      title: '是否存在机构挂靠',
      key: 'affiliation',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '是',
        },
        0: {
          text: '否',
        },
      },
    },
    {
      title: '是否拆分',
      key: 'split',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '是',
        },
        0: {
          text: '否',
        },
      },
    },
    {
      title: '机构名称',
      key: 'instName',
      hideInTable: true,
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
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              return (
                (option?.label + '').indexOf(input) > -1 ||
                (option?.value + '').indexOf(input) > -1
              );
            }}
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
    {
      title: '辖区',
      key: 'jurisdiction',
      hideInTable: true,
      formItemProps: {
        dependencies: ['windowTime'],
      },
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        const currentWindowTime = form.getFieldValue('windowTime');
        const jurisdictionOptions = windowTimeOption?.find(
          (t: { value: any }) => t?.value === currentWindowTime,
        )?.children;
        const formatFn = (item: {
          name?: string;
          staffName?: string;
          [key: string]: any;
        }) => {
          return `${item?.name}(${item?.staffName || '空岗'})`;
        };
        const treeData = expandTree(
          jurisdictionOptions,
          'children',
          'name',
          'id',
          formatFn,
        );
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={treeData}
            // @ts-ignore
            filterTreeNode={(input, treeNode: MyTreeNode) => {
              return (
                treeNode?.title?.indexOf(input) > -1 ||
                treeNode?.value?.indexOf(input) > -1 ||
                treeNode?.code?.indexOf(input) > -1
              );
            }}
          />
        );
      },
    },
    {
      title: '产品',
      key: 'productCode',
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
        const treeData = expandTree<{
          specification?: string | null | undefined;
          [key: string]: any;
        }>(productOption, 'children', 'name', 'code', itemFormat);
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            // @ts-ignore
            filterTreeNode={(input, treeNode: MyTreeNode) => {
              return (
                treeNode?.title?.indexOf(input) > -1 ||
                treeNode?.value?.indexOf(input) > -1
              );
            }}
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
      dataIndex: 'periodName',
      fixed: 'left',
      search: false,
    },
    {
      title: '省',
      dataIndex: 'toInstProvinceName',
      search: false,
    },
    {
      title: '市',
      dataIndex: 'toInstCityName',
      search: false,
    },
    {
      title: '机构',
      dataIndex: 'toInstName',
      search: false,
    },
    {
      title: '产品',
      dataIndex: 'prodName',
      search: false,
    },
    {
      title: '产品编码',
      dataIndex: 'prodCode',
      search: false,
    },
    {
      title: '品规',
      dataIndex: 'prodSpec',
      search: false,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      search: false,
    },
    {
      title: '销售总量',
      dataIndex: 'prodQuantity',
      valueType: 'digit',
      search: false,
    },
    {
      title: '拆分后数量',
      dataIndex: 'terySplitQuantity',
      valueType: 'digit',
      search: false,
    },
    {
      title: '是否目标',
      dataIndex: 'terySysTargetType',
      render: text => <span> {text === 'Target' ? '是' : '否'}</span>,
      search: false,
    },
    {
      title: '是否存在挂靠',
      dataIndex: 'teryInstHashGuakao',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
      search: false,
    },
    {
      title: '是否存在拆分',
      dataIndex: 'teryHoleId',
      renderText: text => {
        return <span> {text ? '是' : '否'}</span>;
      },
      search: false,
    },
    {
      title: '辖区',
      dataIndex: 'teryNodeName',
      search: false,
    },
    {
      title: '辖区负责人',
      dataIndex: 'teryOwnerName',
      search: false,
    },
    {
      title: '辖区类型',
      dataIndex: 'teryTypeName',
      search: false,
    },
    {
      title: '辖区层级',
      dataIndex: 'teryLevelName',
      search: false,
    },
    {
      title: '代理商业务员',
      dataIndex: 'agtSaleMan',
      search: false,
    },
    {
      title: '金额(考核价)',
      dataIndex: 'prodAssessmentAmount',
      search: false,
      valueType: 'digit',
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
        <Table<Terminal, TerminalQuery>
          code={'SalesAppeal.Terminal'}
          form={{
            initialValues: {
              windowTime:
                windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value,
            },
          }}
          search={{
            labelWidth: 'auto',
          }}
          headerTitle={
            <Space>
              {canAdd && (
                <Button
                  type={'primary'}
                  onClick={() => {
                    history.push({
                      pathname: '/sales-appeal/terminal/add',
                      state: {
                        currentWindowTime,
                      },
                    });
                  }}
                  disabled={!currentWindowTime}
                >
                  添加申诉
                </Button>
              )}
              <Button
                key={'export'}
                onClick={() => exportRequest.run(query)}
                loading={exportRequest.loading}
              >
                导出
              </Button>
            </Space>
          }
          scroll={{ x: 2400 }}
          sticky={true}
          request={async params => {
            try {
              const res = await fetch(params);
              const { rows, ...others } = res?.data || {};
              return {
                ...others,
                data: rows || [],
              };
            } catch (err) {
              return {
                total: 0,
                success: true,
                data: [],
              };
            }
          }}
          beforeSearchSubmit={params => {
            params.split = params?.split ? params?.split * 1 : undefined;
            params.target = params?.target ? params?.target * 1 : undefined;
            params.affiliation = params?.affiliation
              ? params?.affiliation * 1
              : undefined;
            setQuery(params);
            setCurrentWindowTime(params?.windowTime);
            return params;
          }}
          tableLayout={'fixed'}
          columns={columns}
          actionRef={actionRef}
          rowKey="id"
          pagination={{
            showTotal: (total1, range) =>
              // `销量总计：${total?.productQuantityFormatSum ||
              //   0}/拆分后销量总计：${total?.splitRatioSumTotal || 0},
              `第${range[0]}-${range[1]}条/共${total1}条`,
          }}
        />
        <TerminalDetail actionRef={terminalRef} />
      </>
    );
  }
  return <Spin spinning={true} />;
};

export default TerminalList;

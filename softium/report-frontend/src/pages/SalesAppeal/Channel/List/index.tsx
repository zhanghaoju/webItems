import React, { ReactNode, useRef, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Channel, ChannelQuery } from '@/pages/SalesAppeal/Channel/data';
import { fetch, exp } from '../api';
import { useModel } from '@@/plugin-model/useModel';
import { Button, Select, Space, Spin, TreeSelect } from 'antd';
import expandTree from '@/utils/expandTree';
import { history } from '@@/core/history';
import { ChannelRef } from '@/pages/SalesAppeal/Channel/Detail';
import ChannelDetail from '@/pages/SalesAppeal/Channel/Detail';
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

const ChannelList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const channelRef = useRef<ChannelRef>();

  const exportRequest = useRequest(exp, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      VulcanFile.export(data);
    },
  });

  const [currentWindowTime, setCurrentWindowTime] = useState<string>();

  const { pockets, channelPeriod } = useModel('SalesAppeal.SalesAppealModel');

  const [query, setQuery] = useState<ChannelQuery>();

  const {
    windowTimeOption,
    regionTreeOption,
    institutionCategoryOption,
    productOption,
    instDistributorLevelOption,
  } = pockets || {};
  const instDistributorLevelObj: any = {};
  if (instDistributorLevelOption) {
    for (const item of instDistributorLevelOption) {
      instDistributorLevelObj[item.value] = item.text;
    }
  }
  const finalAddTime =
    channelPeriod?.salesDataDate &&
    moment(channelPeriod?.salesDataDate).add(
      channelPeriod?.complaintsDataDayNumber || 0,
      'd',
    );

  const canAdd: boolean = moment().isBetween(
    channelPeriod && moment(channelPeriod?.salesDataDate),
    finalAddTime,
  );

  const renderOptions = (_: ReactNode, entity: Channel, index: number) => {
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

  const showDetail = (currentItem: Channel) => {
    channelRef?.current?.showDetail(currentItem);
  };

  const columns: ProColumns<Channel>[] = [
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
      title: '经销商级别',
      dataIndex: 'instDistributorLevel',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={instDistributorLevelOption?.map(
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
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={treeData}
            // @ts-ignore
            filterTreeNode={(input, treeNode: MyTreeNode) => {
              return (
                treeNode?.title?.indexOf(input) > -1 ||
                treeNode?.value?.indexOf(input) > -1
              );
            }}
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
      dataIndex: 'fromInstProvinceName',
      search: false,
    },
    {
      title: '市',
      dataIndex: 'fromInstCityName',
      search: false,
    },
    {
      title: '经销商级别',
      dataIndex: 'fromInstDistributorLevelName',
      renderText: text => (
        <span>
          {instDistributorLevelObj[text] ? instDistributorLevelObj[text] : '-'}
        </span>
      ),
      search: false,
    },
    {
      title: '机构',
      dataIndex: 'fromInstName',
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
      title: '是否拆分',
      dataIndex: 'teryHoleId',
      renderText: text => <span> {text ? '是' : '否'}</span>,
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
        <Table<Channel, ChannelQuery>
          code={'SalesAppeal.Channel'}
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
                      pathname: '/sales-appeal/channel/add',
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
          pagination={{
            showTotal: (total1, range) =>
              // `销量总计：${total?.productQuantityFormatSum ||
              //   0}/拆分后销量总计：${total?.splitRatioSumTotal || 0}，第${
              //   range[0]
              // }-${range[1]}条/共${total1}条`,
              `第${range[0]}-${range[1]}条/共${total1}条`,
          }}
          beforeSearchSubmit={params => {
            params.split = params?.split ? params?.split * 1 : undefined;
            params.target = params?.target ? params?.target * 1 : undefined;
            params.affiliation = params?.affiliation
              ? params?.affiliation * 1
              : undefined;
            setCurrentWindowTime(params?.windowTime);
            setQuery(params);
            return params;
          }}
          tableLayout={'fixed'}
          columns={columns}
          actionRef={actionRef}
          rowKey="id"
        />
        <ChannelDetail actionRef={channelRef} />
      </>
    );
  }
  return <Spin spinning={true} />;
};

export default ChannelList;

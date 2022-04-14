import React, { useImperativeHandle, useRef, useState } from 'react';
import { Button, Descriptions, Drawer, Space, Table, TreeSelect } from 'antd';
import { getSalesDetail } from './api';
import { useRequest } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Channel,
  ChannelDwdSfInspectSaleDetail,
  ChannelDwsSfInspectSaleWithToInstTerryCountDetailVO,
  ChannelDwTerryTotalVO,
  ChannelDwTerryVO,
} from '@/pages/SalesAppeal/Channel/data';
import { SalesDetailQuery } from '@/pages/SalesAppeal/data';
import { useModel } from 'umi';

export interface ChannelRef {
  showDetail: (currentItem: Channel) => void;
}

export interface TerminalProps {
  actionRef:
    | React.MutableRefObject<ChannelRef | undefined>
    | ((actionRef: ChannelRef) => void);
}

const ChannelDetail: React.FC<TerminalProps> = ({ actionRef }) => {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');

  const { regionTreeOption, productUnti } = pockets || {};
  const untiToText: any = {};
  if (productUnti) {
    for (const item of productUnti) {
      untiToText[item.value] = item.text;
    }
  }

  const [currentItem, setCurrentItem] = useState<Channel>();

  const tableRef = useRef<ActionType>();

  const showDetail = async (currentItem: Channel) => {
    setCurrentItem(currentItem);
    setVisible(true);

    // await detailsRequest.run(currentItem?.id);
    tableRef?.current?.reload();
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<number>();
  // const [salesDetail, setSalesDetail] = useState<
  //   ChannelDwsSfInspectSaleWithToInstTerryCountDetailVO
  // >();
  const [splitDetails, setSplitDetails] = useState<ChannelDwTerryTotalVO>(); //关联辖区与拆分

  useImperativeHandle(actionRef, () => ({
    showDetail,
  }));

  const jurisdictionColumns: ProColumns<ChannelDwTerryVO>[] = [
    {
      title: '辖区名称',
      dataIndex: 'teryNodeName',
    },
    {
      title: '辖区负责人',
      dataIndex: 'teryOwnerName',
    },
    {
      title: '辖区类型',
      dataIndex: 'teryTypeName',
    },
    {
      title: '辖区层级',
      dataIndex: 'teryLevelName',
    },
    {
      title: '拆分比例',
      dataIndex: 'terySplitRatio',
      renderText: text => {
        return <span>{text * 100}%</span>;
      },
      // valueType: {
      //   type: 'percent',
      //   precision: 0,
      // },
    },
    {
      title: '拆分后销售总量',
      dataIndex: 'terySplitSumQuantity',
      valueType: 'digit',
    },
  ];

  const salesColumns: ProColumns<ChannelDwdSfInspectSaleDetail>[] = [
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
      title: '机构名称',
      dataIndex: 'institutionName',
      hideInTable: true,
    },
    {
      title: '下游机构名称',
      dataIndex: 'toInstName',
      search: false,
    },
    {
      title: '下游机构所在省市',
      dataIndex: 'region',
      search: false,
      render: (dom, entity, index, action) => {
        return `${entity?.attachedToInstProvinceName}/${entity?.attachedToInstCityName}`;
      },
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      render: text => {
        return (
          <span>{`${(text + '').substr(0, 4)}-${(text + '').substr(4, 2)}-${(
            text + ''
          ).substr(6, 2)}`}</span>
        );
      },
      search: false,
    },
    {
      title: '数量',
      dataIndex: 'prodQuantity',
      valueType: 'digit',
      search: false,
    },
  ];

  return (
    <>
      <Drawer
        visible={visible}
        title={'销量详情'}
        width={'60%'}
        onClose={() => {
          setVisible(false);
        }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                setVisible(false);
              }}
              type="primary"
            >
              确认
            </Button>
          </div>
        }
      >
        <Descriptions column={3}>
          <Descriptions.Item label={'机构名称'}>
            {currentItem?.fromInstName}
          </Descriptions.Item>
          <Descriptions.Item label={'省份'}>
            {currentItem?.fromInstProvinceName}
          </Descriptions.Item>
          <Descriptions.Item label={'城市'}>
            {currentItem?.fromInstCityName}
          </Descriptions.Item>
          <Descriptions.Item label={'产品名称'}>
            {currentItem?.prodName}
          </Descriptions.Item>
          <Descriptions.Item label={'产品规格'}>
            {currentItem?.prodSpec}
          </Descriptions.Item>
          <Descriptions.Item label={'标准单位'}>
            {untiToText[currentItem?.prodUnit || '']}
          </Descriptions.Item>
          <Descriptions.Item label={'是否存在挂靠'}>
            {currentItem?.fromInstHasGuakao ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label={'是否存在拆分'}>
            {currentItem?.teryHoleId ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label={'销量总计'}>
            {currentItem?.prodQuantity}
          </Descriptions.Item>
        </Descriptions>
        {splitDetails?.terrys && (
          <ProTable
            headerTitle={'关联辖区与拆分详情'}
            columns={jurisdictionColumns}
            dataSource={splitDetails?.terrys || []}
            search={false}
            options={false}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={1} colSpan={4}>
                  总计：
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {splitDetails?.terySplitRatioTotal}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {splitDetails?.terySplitRatioSumTotal}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        )}

        <ProTable<ChannelDwdSfInspectSaleDetail, SalesDetailQuery>
          search={{
            labelWidth: 'auto',
            span: 12,
          }}
          headerTitle={'流向明细'}
          columns={salesColumns}
          request={async (params: SalesDetailQuery) => {
            let query = {
              id: currentItem?.id,
              tenantId: currentItem?.tenantId,
              periodId: currentItem?.periodId,
              instId: currentItem?.fromInstId,
              teryHoleId: currentItem?.teryHoleId,
              prodSpec: currentItem?.prodSpec,
              prodCode: currentItem?.prodCode,
            };
            const res = await getSalesDetail({
              ...query,
              ...params,
            });
            const { list, ...others } = res?.data?.fullDimDTOS || {};
            setTotal(res?.data?.fullDimDTOSQuanityTotal);
            setSplitDetails(res?.data?.commonTeryTotalVO);
            // setSalesDetail(res?.data?.channelInspectSaleWithTeryPO);
            return {
              ...others,
              data: list,
              success: res?.data?.success,
            };
          }}
          actionRef={tableRef}
          options={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={3}>
                总计：
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{total}</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Drawer>
    </>
  );
};

export default ChannelDetail;

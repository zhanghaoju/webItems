import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Descriptions, Drawer, Space, Table } from 'antd';
import { getSalesDetail } from './api';
import { useRequest } from 'umi';
import {
  Terminal,
  TerminalDwdSfInspectSaleDetail,
  TerminalDwsSfInspectSaleWithToInstTerryCountDetailVO,
  TerminalDwTerryTotalVO,
  TerminalDwTerryVO,
} from '@/pages/SalesAppeal/Terminal/data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { useModel } from '@@/plugin-model/useModel';

export interface TerminalRef {
  showDetail: (currentItem: Terminal) => void;
}

export interface TerminalProps {
  actionRef:
    | React.MutableRefObject<TerminalRef | undefined>
    | ((actionRef: TerminalRef) => void);
}

const TerminalDetail: React.FC<TerminalProps> = ({ actionRef }) => {
  // const detailsRequest = useRequest(getSalesDetail, {
  //   manual: true,
  //   onSuccess: data => {
  //     setSalesDetail(data);
  //     setVisible(true);
  //   },
  // });
  const [currentItem, setCurrentItem] = useState<Terminal>();
  const tableRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>();

  const showDetail = async (currentItem: Terminal) => {
    setVisible(true);
    // await detailsRequest.run(currentItem?.id);
    setCurrentItem(currentItem);
    tableRef?.current?.reload();
  };
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { productUnti } = pockets || {};
  const untiToText: any = {};
  if (productUnti) {
    for (const item of productUnti) {
      untiToText[item.value] = item.text;
    }
  }
  const [visible, setVisible] = useState<boolean>(false);
  // const [salesDetail, setSalesDetail] = useState<
  //   TerminalDwsSfInspectSaleWithToInstTerryCountDetailVO
  // >();
  const [splitDetails, setSplitDetails] = useState<TerminalDwTerryTotalVO>(); //关联辖区与拆分

  useImperativeHandle(actionRef, () => ({
    showDetail,
  }));

  const jurisdictionColumns: ProColumns<TerminalDwTerryVO>[] = [
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

  const salesColumns: ProColumns<TerminalDwdSfInspectSaleDetail>[] = [
    {
      title: '经销商',
      dataIndex: 'fromInstName',
    },
    {
      title: '挂靠前机构名称',
      dataIndex: 'toInstName',
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
    },
    {
      title: '数量',
      dataIndex: 'prodQuantity',
      valueType: 'digit',
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
            {currentItem?.toInstName}
          </Descriptions.Item>
          <Descriptions.Item label={'省份'}>
            {currentItem?.toInstProvinceName}
          </Descriptions.Item>
          <Descriptions.Item label={'城市'}>
            {currentItem?.toInstCityName}
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
            {currentItem?.toInstHasGuakao ? '是' : '否'}
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
                <Table.Summary.Cell index={1} colSpan={5}>
                  总计：
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {splitDetails?.terySplitRatioSumTotal}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        )}
        <ProTable
          headerTitle={'流向明细'}
          columns={salesColumns}
          search={false}
          options={false}
          actionRef={tableRef}
          params={{
            tenantId: currentItem?.tenantId,
            periodId: currentItem?.periodId,
            instId: currentItem?.toInstId,
            teryHoleId: currentItem?.teryHoleId,
            prodSpec: currentItem?.prodSpec,
            prodCode: currentItem?.prodCode,
          }}
          request={async params => {
            const res = await getSalesDetail({
              ...{ id: currentItem?.id },
              ...params,
            });
            const { list, ...others } = res?.data?.fullDimDTOPagination || {};
            setTotal(res?.data?.fullDimDTOPaginationTotalQuanity);
            setSplitDetails(res?.data?.commonTeryTotalVO);
            // setSalesDetail(res?.data?.terminalInspectSaleWithTeryPO);
            return {
              ...others,
              data: list,
              success: res?.data?.success,
            };
          }}
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

export default TerminalDetail;

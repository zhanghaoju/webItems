import React, { useImperativeHandle, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  InventoryWarning,
  InventoryWarningDetailQuery,
} from '@/pages/ChannelAnalysis/Inventory/WarningCustom/data';
import { Button, Drawer, Table } from 'antd';
import { useSafeState } from 'ahooks';
import { useRequest } from 'umi';
import { getWarinDetail } from '@/pages/ChannelAnalysis/Inventory/WarningCustom/api';

export interface WarningRef {
  showDetail: (currentItem: InventoryWarning) => void;
}
export interface WarningProps {
  actionRef:
    | React.MutableRefObject<WarningRef | undefined>
    | ((actionRef: WarningRef) => void);
}
const WarningDetail: React.FC<WarningProps> = ({ actionRef }) => {
  const detailsRequest = useRequest(getWarinDetail, {
    manual: true,
    formatResult: res => res,
    // onSuccess: res => {
    // setInventoryDetails(res?.data?.list ? res?.data?.list : []);
    // setLoading(false);
    // },
  });
  const [visible, setVisible] = useSafeState(false);
  const [currentItem, setCurrentItem] = useSafeState<InventoryWarning>({});
  // const [inventoryDetails, setInventoryDetails] = useSafeState<
  //   InventoryWarning[]
  // >([]);
  // const [loading, setLoading] = useSafeState(true);

  const showDetail = async (currentItem: InventoryWarning) => {
    setVisible(true);
    setCurrentItem(currentItem);
    // setLoading(true);
    // let params: InventoryWarningDetailQuery = {
    //   tenantId: currentItem?.tenantId,
    //   periodId: currentItem?.periodId,
    //   productBatch: currentItem?.productBatch
    //     ? currentItem?.productBatch?.split(',')
    //     : [],
    //   paging: false,
    // };
    // await detailsRequest.run(params);
    // tableRef?.current?.reload();
  };
  useImperativeHandle(actionRef, () => ({
    showDetail,
  }));

  const columns: ProColumns<InventoryWarning>[] = [
    {
      title: '商业单位名称',
      dataIndex: 'fromInstName',
      search: false,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      search: false,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      search: false,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpecification',
      search: false,
    },
    {
      title: '生产厂家',
      dataIndex: 'producer',
      search: false,
    },
    {
      title: '产品单位',
      dataIndex: 'productUnitFormat',
      search: false,
    },
    {
      title: '批号',
      dataIndex: 'productBatch',
      search: false,
    },
    {
      title: '实际库存数量',
      dataIndex: 'productQuantity',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
  ];
  const tableRef = useRef<ActionType>();
  return (
    <Drawer
      key={currentItem.id}
      width={'50%'}
      title="批号明细"
      placement={'right'}
      //closable={false}
      visible={visible}
      onClose={() => {
        setVisible(false);
      }}
      destroyOnClose={true}
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
      <ProTable
        //dataSource={inventoryDetails}
        columns={columns}
        //loading={loading}
        search={false}
        options={false}
        rowKey={'id'}
        actionRef={tableRef}
        params={{
          tenantId: currentItem?.tenantId,
          periodId: currentItem?.periodId,
          productCode: currentItem?.productCode || undefined,
          institutionCode: currentItem?.institutionCode || undefined,
          productBatch: currentItem?.productBatch
            ? currentItem?.productBatch?.split(',')
            : [],
          paging: true,
        }}
        request={async (params: InventoryWarningDetailQuery, sort) => {
          params.pageNo = params.current;
          let res = await detailsRequest.run(params);
          const { list, ...others } = res?.data;
          return {
            ...others,
            data: list,
          };
        }}
      />
    </Drawer>
  );
};

export default WarningDetail;

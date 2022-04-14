import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import SaleOriginal from '@/pages/dataManagement/dailyDataManagement/originalDataManagement/saleOriginal';
import PurchaseOriginal from '@/pages/dataManagement/dailyDataManagement/originalDataManagement/purchaseOriginal';
import InventoryOriginal from '@/pages/dataManagement/dailyDataManagement/originalDataManagement/inventoryOriginal';
import ConsignmentOriginal from '@/pages/dataManagement/dailyDataManagement/originalDataManagement/consignmentOriginal';
import storage from '@/utils/storage';

const { TabPane } = Tabs;

export default (props: any) => {
  const [activeKey, setActiveKey] = useState('1');
  const onChangeTabKey = (key: any) => {
    setActiveKey(key);
  };

  useEffect(() => {
    setActiveKey(props.location.query.sourceTabIndex);
  }, []);

  const pageElements = storage.get('pageElements').pageElements;
  const saleOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayOriginSale';
  });
  const purchaseOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayOriginPurchase';
  });
  const inventoryOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayOriginInventory';
  });
  const consignmentOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayOriginConsignment';
  });

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      onChange={key => onChangeTabKey(key)}
      className="fixedHeader"
    >
      {saleOriginalTab.length > 0 && (
        <TabPane tab="销售原始数据" key="1">
          <SaleOriginal {...props} />
        </TabPane>
      )}
      {purchaseOriginalTab.length > 0 && (
        <TabPane tab="采购原始数据" key="2">
          <PurchaseOriginal {...props} />
        </TabPane>
      )}
      {inventoryOriginalTab.length > 0 && (
        <TabPane tab="库存原始数据" key="3">
          <InventoryOriginal {...props} />
        </TabPane>
      )}
      {consignmentOriginalTab.length > 0 && (
        <TabPane tab="发货原始数据" key="4">
          <ConsignmentOriginal {...props} />
        </TabPane>
      )}
    </Tabs>
  );
};

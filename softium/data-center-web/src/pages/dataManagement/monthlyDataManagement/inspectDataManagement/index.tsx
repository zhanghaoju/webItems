import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import SaleInspect from '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect';
import PurchaseInspect from '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect';
import InventoryInspect from '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect';
import ConsignmentInspect from '@/pages/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect';
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
  const saleInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthInspectSale';
  });
  const purchaseInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthInspectPurchase';
  });
  const inventoryInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthInspectInventory';
  });
  const consignmentInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthInspectConsignment';
  });

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      onChange={key => onChangeTabKey(key)}
      className="fixedHeader"
    >
      {saleInspectTab.length > 0 && (
        <TabPane tab="销售核查数据" key="1">
          <SaleInspect {...props} />
        </TabPane>
      )}
      {purchaseInspectTab.length > 0 && (
        <TabPane tab="采购核查数据" key="2">
          <PurchaseInspect {...props} />
        </TabPane>
      )}
      {inventoryInspectTab.length > 0 && (
        <TabPane tab="库存核查数据" key="3">
          <InventoryInspect {...props} />
        </TabPane>
      )}
      {consignmentInspectTab.length > 0 && (
        <TabPane tab="发货核查数据" key="4">
          <ConsignmentInspect {...props} />
        </TabPane>
      )}
    </Tabs>
  );
};

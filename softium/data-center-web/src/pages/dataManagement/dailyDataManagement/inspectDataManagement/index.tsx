import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import SaleInspect from '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/saleInspect';
import PurchaseInspect from '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/purchaseInspect';
import InventoryInspect from '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/inventoryInspect';
import ConsignmentInspect from '@/pages/dataManagement/dailyDataManagement/inspectDataManagement/consignmentInspect';
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
    return item.code == 'dayInspectSale';
  });
  const purchaseInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayInspectPurchase';
  });
  const inventoryInspectTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayInspectInventory';
  });
  const consignmentOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayInspectConsignment';
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
      {consignmentOriginalTab.length > 0 && (
        <TabPane tab="发货核查数据" key="4">
          <ConsignmentInspect {...props} />
        </TabPane>
      )}
    </Tabs>
  );
};

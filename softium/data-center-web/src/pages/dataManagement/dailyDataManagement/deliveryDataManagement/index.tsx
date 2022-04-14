import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import SaleDelivery from '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/saleDelivery';
import PurchaseDelivery from '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/purchaseDelivery';
import InventoryDelivery from '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/inventoryDelivery';
import ConsignmentDelivery from '@/pages/dataManagement/dailyDataManagement/deliveryDataManagement/consignmentDelivery';
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
  const saleDeliveryTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayDeliverySale';
  });
  const purchaseDeliveryTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayDeliveryPurchase';
  });
  const inventoryDeliveryTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayDeliveryInventory';
  });
  const consignmentOriginalTab = pageElements.filter((item: any, i: any) => {
    return item.code == 'dayDeliveryConsignment';
  });

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      onChange={key => onChangeTabKey(key)}
      className="fixedHeader"
    >
      {saleDeliveryTab.length > 0 && (
        <TabPane tab="销售交付数据" key="1">
          <SaleDelivery {...props} />
        </TabPane>
      )}
      {purchaseDeliveryTab.length > 0 && (
        <TabPane tab="采购交付数据" key="2">
          <PurchaseDelivery {...props} />
        </TabPane>
      )}
      {inventoryDeliveryTab.length > 0 && (
        <TabPane tab="库存交付数据" key="3">
          <InventoryDelivery {...props} />
        </TabPane>
      )}
      {consignmentOriginalTab.length > 0 && (
        <TabPane tab="发货交付数据" key="4">
          <ConsignmentDelivery {...props} />
        </TabPane>
      )}
    </Tabs>
  );
};

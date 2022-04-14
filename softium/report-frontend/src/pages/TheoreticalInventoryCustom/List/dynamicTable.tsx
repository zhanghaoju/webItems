import { Select } from 'antd';
import { PeriodBO } from '@/pages/TheoreticalInventoryCustom/models/TheoreticalInventoryModel';
import React from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { TheoreticalInventory } from '@/pages/TheoreticalInventoryCustom/data';
import { useModel } from '@@/plugin-model/useModel';

/**
 * [getDynamicColumns 拼接动态表格列]
 * @return {[type]} []
 */
export function getDynamicColumns(
  dynamicColumns: any[],
): ProColumns<TheoreticalInventory>[] {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { instDistributorLevelOption, productUnti } = pockets || {};
  const { periodList } = useModel(
    'TheoreticalInventoryCustom.TheoreticalInventoryModel',
  );
  const columnsObj: any = {
    periodId: {
      title: '时间窗',
      key: 'periodId',
      dataIndex: 'periodId',
      hideInTable: true,
      renderFormItem: (
        _: any,
        { type, defaultRender, fieldProps, ...rest }: any,
        form: any,
      ) => {
        return (
          <Select
            {...fieldProps}
            placeholder={'请选择'}
            style={{ width: '100%' }}
            options={periodList?.map((t: PeriodBO) => ({
              label: t?.name || '',
              value: t?.id || '',
            }))}
          />
        );
      },
    },
    distributorLevel: {
      dataIndex: 'distributorLevel',
      title: '经销商级别',
      hideInTable: true,
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return (
          <Select
            placeholder={'请选择'}
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
    institutionCode: {
      dataIndex: 'institutionCode',
      title: '经销商编码',
      fixed: 'left',
    },
    isAdjust: {
      dataIndex: 'isAdjust',
      title: '是否调整',
      hideInTable: true,
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' },
      },
    },
    isDiff: {
      dataIndex: 'isDiff',
      title: '是否存在差异',
      hideInTable: true,
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' },
      },
    },
    unit: {
      dataIndex: 'unit',
      title: '单位',
      search: false,
      valueEnum: Object.fromEntries(
        productUnti?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
    },
    theoryBeginInventory: {
      dataIndex: 'theoryBeginInventory',
      title: '理论期初库存(数量)',
      search: false,
      valueType: 'digit',
    },
    theoryBeginInventoryAmt: {
      dataIndex: 'theoryBeginInventoryAmt',
      title: '理论期初库存(金额)',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【考核价】*【数量】',
    },
    fromInstSales: {
      dataIndex: 'fromInstSales',
      title: '上游销量',
      search: false,
      valueType: 'digit',
    },
    selfSales: {
      dataIndex: 'selfSales',
      title: '自身销量',
      search: false,
      // valueType: 'digit',
    },
    beforeAdjustTheoryEndInventory: {
      dataIndex: 'beforeAdjustTheoryEndInventory',
      title: '理论期末库存（调整前数量）',
      search: false,
      valueType: 'digit',
    },
    beforeAdjustTheoryEndInventoryAmt: {
      dataIndex: 'beforeAdjustTheoryEndInventoryAmt',
      title: '理论期末库存（调整前金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【考核价】*【数量】',
    },
    afterAdjustTheoryEndInventory: {
      dataIndex: 'afterAdjustTheoryEndInventory',
      title: '理论期末库存（调整后数量）',
      search: false,
      valueType: 'digit',
    },
    afterAdjustTheoryEndInventoryAmt: {
      dataIndex: 'afterAdjustTheoryEndInventoryAmt',
      title: '理论期末库存（调整后金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【考核价】*【数量】',
    },
    actualEndInventory: {
      dataIndex: 'actualEndInventory',
      title: '期末实际库存（数量）',
      search: false,
      valueType: 'digit',
    },
    actualEndInventoryAmt: {
      dataIndex: 'actualEndInventoryAmt',
      title: '期末实际库存（金额）',
      search: false,
      valueType: 'digit',
    },
    differenceVal: {
      dataIndex: 'differenceVal',
      title: '差异值（数量）',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    differenceRatio: {
      dataIndex: 'differenceRatio',
      title: '差异比',
      search: false,
      render: (dom: any, entity: { differenceRatio: number }, index: any) =>
        (entity?.differenceRatio && `${entity?.differenceRatio * 100}%`) || '-',
      tooltip:
        '公式（均为数量）：【期末理论库存（调整后）- 实际库存】/【理论库存】',
    },
    differenceAmtVal: {
      dataIndex: 'differenceAmtVal',
      title: '差异值（金额）',
      search: false,
      sorter: true,
      valueType: 'digit',
      tooltip:
        '公式：【期末理论库存（调整后）- 期末实际库存】（均为数量）*【考核价】',
    },
    adjustVal: {
      dataIndex: 'adjustVal',
      title: '调整量',
      search: false,
      valueType: 'digit',
    },
    prodSfPrice: {
      dataIndex: 'prodSfPrice',
      title: '一级商业采购价',
      search: false,
      hideInTable: true,
      valueType: 'digit',
    },
    sfTheoryBeginInventoryAmt: {
      dataIndex: 'sfTheoryBeginInventoryAmt',
      title: '期初库存（金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【一级商业采购价】*【期初库存（数量）】',
    },
    supplierAmt: {
      dataIndex: 'supplierAmt',
      title: '本月采购(金额)',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【一级经销商采购价】*【本月采购(数量)】',
      hideInTable: true,
    },
    salesAmt: {
      dataIndex: 'salesAmt',
      title: '本月销售(金额)',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【一级经销商采购价】*【本月销售(数量)】',
      hideInTable: true,
    },
    sfBeforeAdjustTheoryEndInventoryAmt: {
      dataIndex: 'sfBeforeAdjustTheoryEndInventoryAmt',
      title: '调整前-理论期末库存（金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【一级商采购价】*【调整前-理论期末库存（数量）】',
      hideInTable: true,
    },
    sfActualEndInventoryAmt: {
      dataIndex: 'sfActualEndInventoryAmt',
      title: '实际库存（金额）',
      search: false,
      valueType: 'digit',
      hideInTable: true,
    },
    sfDifferenceAmtVal: {
      dataIndex: 'sfDifferenceAmtVal',
      title: '理论与实际差异（金额）',
      search: false,
      valueType: 'digit',
      tooltip: '公式：【一级商采购价】*【理论与实际差异（数量）】',
      hideInTable: true,
    },
    sfAfterAdjustTheoryEndInventoryAmt: {
      dataIndex: 'sfAfterAdjustTheoryEndInventoryAmt',
      title: '调整后-理论期末库存（金额）',
      search: false,
      hideInTable: true,
      valueType: 'digit',
      tooltip: '公式：【一级商采购价】*【调整后-理论期末库存（数量）】',
    },
    updateTime: {
      dataIndex: 'updateTime',
      title: '调整时间',
      valueType: 'dateTime',
    },
  };
  let dynamicJoinColumns: ProColumns<TheoreticalInventory>[] = [];
  if (!dynamicColumns) {
    return dynamicJoinColumns;
  }
  // 根据dispOrder进行排序
  dynamicColumns?.sort((a: any, b: any) => {
    return a.dispOrder - b.dispOrder;
  });
  for (let item of dynamicColumns) {
    let optional = item?.optional ? JSON.parse(item?.optional) : {};
    if (columnsObj.hasOwnProperty(item.name)) {
      let col: any = { ...columnsObj[item.name] };
      col.title = item.dispName;
      col.dataIndex = item.name;
      col.hideInTable = optional.hideInTable;
      col.search = !optional.hideInSearch;
      dynamicJoinColumns.push(col);
    } else {
      dynamicJoinColumns.push({
        title: item.dispName,
        dataIndex: item.name,
        hideInTable: optional.hideInTable,
        search: !optional.hideInSearch ? undefined : false,
      });
    }
  }
  return dynamicJoinColumns;
}

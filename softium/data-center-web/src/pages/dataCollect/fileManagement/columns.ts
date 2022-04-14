import transformText, { transformArray } from '@/utils/transform';

//日: 原始库存数据
export const columnsOriginalID: any = () => {
  return [
    {
      title: '库存日期', //表格
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//日: 交付库存数据
export const columnsDeliveryID: any = () => {
  return [
    {
      title: '库存日期',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
  ];
};

//日: 核查库存数据
export const columnsInspectID: any = () => {
  return [
    {
      title: '库存日期',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//日: 原始采购数据
export const columnsOriginalPD: any = () => {
  return [
    {
      title: '采购日期', //表格
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '供应商编码',
      dataIndex: 'vendorCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '供应商名称',
      dataIndex: 'vendorName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//日: 交付采购数据
export const columnsDeliveryPD: any = () => {
  return [
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准供应商编码',
      dataIndex: 'standardVendorCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准供应商名称',
      dataIndex: 'standardVendorName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始供应商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始供应商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      width: 300,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
  ];
};

//日: 核查采购数据
export const columnsInspectPD: any = () => {
  return [
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准供应商编码',
      dataIndex: 'standardVendorCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准供应商名称',
      dataIndex: 'standardVendorName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始供应商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始供应商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//日: 原始销售数据
export const columnsOriginalSD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//日: 交付销售数据
export const columnsDeliverySD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
  ];
};

//日: 核查销售数据
export const columnsInspectSD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//日: 原始发货数据
export const columnsOriginalDD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//日: 交付发货数据
export const columnsDeliveryDD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
  ];
};

//日: 核查发货数据
export const columnsInspectDD: any = () => {
  return [
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//月: 原始库存数据
export const columnsOriginalIM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
    },
    {
      title: '库存日期', //表格
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      ellipsis: true,
      valueType: 'text',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//月: 交付库存数据
export const columnsDeliveryIM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '库存日期',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'right',
    },
  ];
};

//月: 核查库存数据
export const columnsInspectIM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '库存日期',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode', //表格
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName', //表格
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码', //表格
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//月: 原始采购数据
export const columnsOriginalPM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      ellipsis: true,
      valueType: 'text',
    },
    {
      title: '供应商编码',
      dataIndex: 'vendorCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '供应商名称',
      dataIndex: 'vendorName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//月: 核查采购数据
export const columnsInspectPM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准供应商编码',
      dataIndex: 'standardVendorCode',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准供应商名称',
      dataIndex: 'standardVendorName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始供应商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始供应商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//月: 交付采购数据
export const columnsDeliveryPM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准供应商编码',
      dataIndex: 'standardVendorCode',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准供应商名称',
      dataIndex: 'standardVendorName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'toInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'toInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始供应商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始供应商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'right',
    },
  ];
};

//月: 交付销售数据
export const columnsDeliverySM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准客户编码', //表格
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准客户名称', //表格
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码', //表格
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      fixed: 'right',
    },
  ];
};

//月: 核查销售数据
export const columnsInspectSM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit', //表格
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//月: 原始销售数据
export const columnsOriginalSM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      ellipsis: true,
      valueType: 'text',
    },
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'right',
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//月: 原始发货数据
export const columnsOriginalDM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      width: '6%',
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户编码',
      dataIndex: 'customerCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'fileStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('fileStatusPocket', 'label', 'value'),
    },
  ];
};

//月: 核查发货数据
export const columnsInspectDM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      width: 150,
      fixed: 'left',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];
};

//月: 交付发货数据
export const columnsDeliveryDM: any = () => {
  return [
    {
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      width: 140,
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户编码',
      dataIndex: 'standardCustomerCode',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准客户名称',
      dataIndex: 'standardCustomerName',
      hideInSearch: true,
      valueType: 'text',
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '标准单位',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始客户名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原始产品单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
    },
  ];
};

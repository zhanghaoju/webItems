export interface PurchaseSaleAnalysis extends BaseModel {
  windowTime?: string;
  pageNo?: number;
  pageSize?: number;
  /**
   * 财年 **
   */
  financialYear?: string;

  /**
   * 财年ID **
   */
  financialYearId?: string;

  /**
   * 时间窗ID **
   */
  periodId?: string;

  /**
   * 时间窗名称 **
   */
  periodName?: string;

  /**
   * 上游辖区的父级辖区编码 **
   */
  fromTeryParentCode?: string;

  /**
   * +1级辖区 || 大区  search
   */
  fromTeryParentName?: string;

  /**
   * 上游辖区  || 办事处  search
   */
  fromTeryName?: string;

  /**
   * 上游辖区编码 **
   */
  fromTeryCode?: string;

  /**
   * 经销商编码 || 客户编码
   */
  distributorCode?: string;

  /**
   * 经销商名称  || 客户名称 search
   */
  distributorName?: string;

  /**
   * 经销商级别编码 **
   */
  distributorLevelCode?: string;

  /**
   * 经销商级别 || 客户级别 search
   */
  distributorLevelName?: string;

  /**
   * 产品编码
   */
  prodCode?: string;

  /**
   * 产品名称 search
   */
  prodName?: string;

  /**
   * 产品规格
   */
  prodSpecification?: string;

  /**
   * 产品单价
   */
  prodSfPrice?: number;

  /**
   * 批号 search
   */
  productBatch?: string;

  /**
   * 提货量
   */
  buyQuantity?: number;

  /**
   * 分销量
   */
  saleQuantity?: number;

  /**
   * 购销量差 search
   */
  saleBuyCutQuantity?: number;

  /**
   * 涉及金额
   */
  saleBuyCutAmount?: number;

  /**
   * 最后一次etl处理时间 **
   */
  etlTime?: number;

  /**
   * 累计销售量
   */
  buyQuantityAll?: number;
  /**
   * 累计购进量
   */
  salequantityAll?: number;
}

export interface PurchaseSaleAnalysisQuery {
  pageNo?: number;

  pageSize?: number;

  /**
   * 时间窗
   */
  periodIds?: string[];

  /**
   * 经销商->名称、编码模糊搜索
   */
  institution?: string;

  /**
   * 市s
   */
  citys?: string[];

  /**
   * 产品s
   */
  products?: string[];

  /**
   * 实际库存天期状态: normal-正常 abnormal-异常
   */
  actStatus?: 'normal' | 'abnormal';

  /**
   * 理论库存天期状态: normal-正常 abnormal-异常
   */
  theoryStatus?: 'normal' | 'abnormal';
}

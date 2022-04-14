export interface InventoryWarning extends BaseModel {
  /**
   * 周期Id
   */
  periodId?: string;

  /**
   * 周期名称
   */
  periodName?: string;

  /**
   * 经销商ID
   */
  institutionId?: string;

  /**
   * 经销商编码
   */
  institutionCode?: string;

  /**
   * 经销商名称
   */
  institutionName?: string;

  /**
   * 经销商省份
   */
  institutionProvince?: string;

  /**
   * 经销商城市
   */
  institutionCity?: string;

  /**
   * 产品Id
   */
  productId?: string;

  /**
   * 产品编码
   */
  productCode?: string;

  /**
   * 产品名称
   */
  productName?: string;

  /**
   * 产品规格
   */
  productSpecification?: string;

  /**
   * 理论期初库存->导入初始账期库存或上期期末理论库存
   */
  theoryBeginInventory?: number;

  /**
   * 理论期初库存金额->考核价*期初理论库存
   */
  theoryBeginInventoryAmt?: number;

  /**
   * 上游销量->月销售交付中数据，某账期inst+product的数量之和
   */
  fromInstSales?: number;

  /**
   * 自身销量->月销售交付中数据，某账期inst+product的数量之和
   */
  selfSales?: number;

  /**
   * 期末理论库存（调整前）
   */
  beforeAdjustTheoryEndInventory?: number;

  /**
   * 期末理论库存金额（调整前）->考核价*期末理论库存（调整前）
   */
  beforeAdjustTheoryEndInventoryAmt?: number;

  /**
   * 期末实际库存
   */
  actualEndInventory?: number;

  /**
   * 期末实际库存金额->库存交付数据中金额加总
   */
  actualEndInventoryAmt?: number;

  /**
   * 期末理论库存（调整后）
   */
  afterAdjustTheoryEndInventory?: number;

  /**
   * 期末理论库存金额（调整后）->考核价*期末理论库存（调整后）
   */
  afterAdjustTheoryEndInventoryAmt?: number;

  /**
   * 差异值 -> 期末理论库存（调整后）-  期末实际库存
   */
  differenceVal?: number;

  /**
   * 差异比 -> [均为数量]：(期末理论库存（调整后）- 实际库存) / 理论库存
   */
  differenceRatio?: number;

  /**
   * 差异值金额
   */
  differenceAmtVal?: number;

  /**
   * 调整量
   */
  adjustVal?: string;

  /**
   * 调整原因
   */
  adjustReason?: string;

  /**
   * 封版状态 Archive:已封板、UnArchive：未封板
   */
  isSeal?: 'Archive' | 'UnArchive';

  /**
   * 经销商级别
   */
  distributorLevel?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 生产厂家
   */
  manufacturer?: string;

  /**
   * 考核价->产品主数据单价
   */
  price?: number;

  /**
   * 实际销量X个月
   */
  months?: number;

  /**
   * 实际总销量
   */
  quantity?: number;

  /**
   * 天期最高值
   */
  maxDayExp?: number;

  /**
   * 天期最低值
   */
  minDayExp?: number;

  /**
   * 配置计算X个月均
   */
  saleAvg?: number;

  /**
   * 库存天数(实际) 库存数量（实际）/X月平均销量
   */
  actInventoryDays?: number;

  /**
   * 库存天数(理论) 库存数量(理论) /x月平均销量
   */
  theoryInventoryDays?: number;

  /**
   * 实际库存天期状态: normal-正常 abnormal-异常
   */
  actStatus?: 'normal' | 'abnormal';

  /**
   * 理论库存天期状态: normal-正常 abnormal-异常
   */
  theoryStatus?: 'normal' | 'abnormal';
}

export interface SortProperty {
  propertyName: string;
  sort?: 'ASC' | 'DESC';
}

export interface InventoryWarningQuery {
  pageNo?: number;

  pageSize?: number;

  /**
   * 时间窗
   */
  periodIds?: string[];

  /**
   * 排序
   */
  criteria?: {
    sortProperties: SortProperty[];
  };

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

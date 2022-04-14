export interface TheoreticalInventory extends BaseModel {
  /**
   * 周期Id
   */
  periodId?: string;

  /**
   * 周期名称
   */
  periodName?: string;

  /**
   * 经销商id
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
   * 经销商省份编码
   */
  institutionProvinceCode?: string;

  /**
   * 经销商城市
   */
  institutionCity?: string;

  /**
   * 经销商城市编码
   */
  institutionCityCode?: string;

  /**
   * 产品id
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
   * 期末实际库存（金额）
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
   *差异值金额
   */
  differenceAmtVal?: number;

  /**
   * 调整量
   */
  adjustVal?: number;

  /**
   * 调整原因
   */
  adjustReason?: string;

  /**
   * 封板状态
   */
  isSeal?: 'Archive' | 'UnArchive';

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

  [propName: string]: any;
}

export interface TheoreticalInventoryQuery {
  pageSize?: number;

  pageNo?: number;

  count?: number;

  /**
   * 时间窗Id
   */
  periodId?: string;

  /**
   * 时间窗名称
   */
  periodName?: string;

  /**
   * 经销商编码
   */
  institutionCode?: string;

  /**
   * 经销商名称
   */
  institutionName?: string;

  /**
   * 产品编码
   */
  productCode?: string;

  /**
   * 产品名称
   */
  productName?: string;

  /**
   * 是否调整 0为调整 1已调整
   */
  isAdjust?: 0 | 1;

  /**
   * 是否存在差异值 0不存在 1存在
   */
  isDiff?: 0 | 1;

  /**
   * 经销商级别
   */
  distributorLevel?: string;
}

export interface AdjustParams {
  /**
   * 主键
   */
  id?: string;

  /**
   * 调整量
   */
  adjustValNew?: number;

  /**
   * 调整原因
   */
  adjustReasonNew?: string;
}

export interface LogListQuery {
  institutionId?: string;

  periodId?: string;

  productId?: string;
}

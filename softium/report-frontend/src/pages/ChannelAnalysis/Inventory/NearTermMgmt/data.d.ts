export interface NearTermMgmt extends BaseModel {
  current?: number;

  pageSize?: number;
  /**
   * 时间窗
   */
  periodId?: string;
  /**
   * tenantId
   */
  tenantId?: string;
  /**
   * +1级辖区 || 大区
   */
  parentTeryName?: string;

  /**
   * 上游辖区  || 办事处
   */
  teryName?: string;

  /**
   * 上游客户 || 客户编码
   */
  distributorCode?: string;

  /**
   * 客户名称 search
   */
  distributorName?: string;

  /**
   * 客户级别 search
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
  prodSpec?: string;

  /**
   * 产品单价
   */
  prodSfPrice?: number;

  /**
   * 批号 search
   */
  productBatch?: string;
  /**
   * 生产年月
   */
  productionDateYm?: string;

  /**
   * 剩余到期月份
   */
  remainingMaturityMonth?: string;
  /**
   * 批号类型
   */
  batchType?: string;
  /**
   * 库存量
   */
  prodQuantity?: number;

  /**
   * 库存金额
   */
  productAmount?: number;

  /**
   * 库存同比
   */
  yearOverYear?: number;
  /**
   * 库存环比
   */
  linkRelativeRatio?: number;

  // /**
  //  * 最后一次etl处理时间
  //  */
  // etlTime ?: number;
}

export interface NearTermMgmtQuery {
  current?: number;

  pageSize?: number;

  /**
   * 时间窗
   */
  periodId?: string;

  /**
   * tenantId
   */
  tenantId?: string;
  /**
   * 大区
   */
  parentTeryName?: string[];
  /**
   * 办事处
   */
  teryName?: string[];

  /**
   * 客户级别
   */
  distributorLevel?: string[];

  /**
   * 客户名称
   */
  distributorName?: string;

  /**
   * 产品名称
   */
  prodCode?: string[]; //productCode

  /**
   * 批号类型
   */
  batchType?: string[];
}

export interface TheoreticalInventory {
  /**
   * 周期Id
   */
  periodId?: string;

  /**
   * 账期名称
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
   * 经销商省份
   */
  institutionProvince?: string;

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
  productSpec?: string;

  /**
   * 产品批号
   */
  productBatchNo?: string;

  /**
   * 产品单位
   */
  productUnit?: string;

  /**
   * 产品厂家
   */
  productManufacturer?: string;

  /**
   * 上游销量
   */
  fromInstitutionVolume?: string;

  /**
   * 自身销量
   */
  toInstitutionVolume?: string;

  /**
   * 理论期初库存(数量)
   */
  beginTheoryQuantity?: number;

  /**
   * 理论期初库存(价格)
   */
  beginTheoryPrice?: number;

  /**
   * 理论期末库存(数量)
   */
  endTheoryQuantity?: number;

  /**
   * 理论期末库存(价格)
   */
  endTheoryPrice?: number;

  /**
   * 期末实际库存(数量)
   */
  endActualQuantity?: number;

  /**
   * 期末实际库存(价格)
   */
  endActualPrice?: number;

  /**
   * 差异值(数量)
   */
  diffQuantity?: number;

  /**
   * 差异值(价格)
   */
  diffPrice?: number;

  pageSize?: number;

  pageNo?: number;

  count?: number;

  children?: [];
}

//详情--库存信息列表
export interface inventoryDetail {
  /**
   * 产品名称
   */
  productName?: string;

  /**
   * 产品批号
   */
  productBatchNo?: string;

  /**
   * 理论期末库存(数量)
   */
  endTheoryQuantity?: number;

  /**
   * 期末实际库存(数量)
   */
  endActualQuantity?: number;

  /**
   * 差异值(数量)
   */
  diffQuantity?: number;
}

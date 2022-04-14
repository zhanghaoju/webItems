// import { ComplaintsDetail, TimeWindowConfig } from '@/models/data';

export interface InventoryWarningConfig extends BaseModel {
  /**
   * 产品名称
   */
  productName?: string;

  /**
   * 产品编码
   */
  productCode?: string;

  /**
   * 产品规格
   */
  productSpec?: string;

  /**
   * 单位
   */
  productUnit?: string;

  /**
   * X月平均销售
   */
  saleAvg?: number;

  /**
   * 库存天期最高值
   */
  maxDayExp?: number;

  /**
   * 库存天期最低值
   */
  minDayExp?: number;
}

export interface InventoryWarningConfigQuery extends BaseQuery {
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
}

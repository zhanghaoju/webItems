import { ComplaintsDetail, TimeWindowConfig } from '@/models/data';

export interface OpeningInventory extends BaseModel {
  /**
   * @description 经销商编码
   */
  institutionCode?: string;

  /**
   * @description 经销商名称
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
   * 理论期初库存
   */
  theoryBeginInventory?: number;

  /**
   * 时间窗Id
   */
  periodId?: string;
}

export interface OpeningInventoryQuery {
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
   * 时间窗Id
   */
  periodId?: string;

  pageSize?: number;

  pageNo?: number;
}
export interface TimeWindow extends BaseModel {
  /**
   * id
   */
  id?: string;
  /**
   * 时间窗名称
   */
  name?: string;
  /**
   * 配置生效日
   */
  configEffectiveDate?: number;
  /**
   * 配置结束日
   */
  configEndDate?: number;
  /**
   * 归档日
   */
  filingDate?: string;
  /**
   * 时间窗状态
   */
  state?: string;

  /**
   * 财年Id
   */
  financialYearId?: string;

  /**
   * 时间窗配置
   */
  periodDTO?: TimeWindowConfig;

  /**
   * 复制配置
   */
  configs?: string[];

  channel?: ComplaintsDetail;

  terminal?: ComplaintsDetail;
}

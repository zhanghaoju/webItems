/**
 *销量基础字段
 */
export interface DwsSfInspectSaleWithToInstTerryCountVO extends BaseModel {
  /**
   * @description 时间窗名称
   */
  periodName?: string;

  /**
   * @description 产品
   */
  prodName?: string;

  /**
   * @description 产品编码
   */
  prodCode?: string;

  /**
   * @description 规格
   */
  prodSpec?: string;

  /**
   * @description 生产厂家
   */
  manufacturer?: string;

  /**
   * @description 销量总计
   */
  prodQuantity?: number;
  /**
   * @description 是否存在拆分[teryHoleId有值：是；没有值为否]
   */
  teryHoleId?: string;

  /**
   * @description 拆分后销量总计
   */
  terySplitQuantity?: number;

  /**
   * @description 是否目标[Target：是；NonTarget否]
   */
  terySysTargetType?: string;

  /**
   * @description 辖区
   */
  teryName?: string;

  /**
   * @description 辖区负责人
   */
  teryOwnerName?: string;

  /**
   * @description 辖区类型
   */
  teryTypeName?: string;

  /**
   * @description 辖区层级
   */
  teryLevelName?: string;

  /**
   * @description 金额(考核价)
   */
  assessmentAmount?: number;
}

/**
 * @description 销量详情
 */
export interface DwdSfInspectSaleDetailVO {
  saleDate?: number | string;

  prodQuantity?: number;
}

export interface DwTerryVO {
  /**
   * id
   */

  id?: string;

  /**
   * 辖区
   */
  teryNodeName?: string;

  /**
   * 辖区负责人
   */
  teryOwnerName?: string;

  /**
   * 辖区类型
   */
  teryTypeName?: string;

  /**
   * 辖区层级
   */
  teryLevelName?: string;

  /**
   * 拆分比例
   */
  terySplitRatio?: number;

  /**
   * 拆分后销售总数量
   */
  terySplitSumQuantity?: number;

  /**
   * 是否存在拆分
   */
  hasChaifen?: number;
}

export interface SalesQuery {
  pageSize?: number;
  current?: number;
  /**
   * @description 关键词
   */
  keyword?: string;

  /**
   * @description 时间窗
   */
  windowTime?: string;

  /**
   * @description 是否目标
   */
  target?: number;

  /**
   * @description 是否挂靠
   */
  affiliation?: number;

  /**
   * @description 省市
   */
  region?: string[];

  /**
   * @description 机构类型
   */
  institutionType?: string[];

  /**
   * @description 经销商等级
   */
  instDistributorLevel?: string[];

  /**
   * 辖区
   */
  jurisdiction?: string[];

  /**
   * 产品
   */
  productCode?: string[];
  /**
   * 是否拆分
   */
  split?: number;
}

export interface DwTerryTotalVO {
  terySplitRatioTotal?: number;

  terySplitRatioSumTotal?: number;
}

export interface SalesDetailQuery {
  id?: string;

  pageSize?: number;

  current?: number;

  /**
   * 机构名称
   */
  institutionName: string;
  /**
   * 是否目标
   */
  target?: number;

  /**
   * 是否挂靠
   */
  affiliation?: string;

  /**
   * 地区
   */
  region?: string[];

  /**
   * 机构类型
   */
  institutionType?: string[];

  /**
   * 辖区
   */
  jurisdiction?: string[];
  /**
   * tenantId
   */
  tenantId?: string;
  /**
   * 账期id
   */
  periodId?: string;

  /**
   * 辖区id
   */
  toInstId?: string;

  instId?: string | undefined;

  teryHoleId?: string | undefined;

  prodSpec?: string | undefined;

  prodCode?: string | undefined;
}

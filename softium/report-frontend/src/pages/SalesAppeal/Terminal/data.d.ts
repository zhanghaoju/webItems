import {
  DwdSfInspectSaleDetailVO,
  DwsSfInspectSaleWithToInstTerryCountVO,
  DwTerryTotalVO,
  DwTerryVO,
  SalesQuery,
} from '@/pages/SalesAppeal/data';

/**
 * @description 终端销量列表
 */
export interface Terminal extends DwsSfInspectSaleWithToInstTerryCountVO {
  /**
   * 省份
   */
  toInstProvinceName?: string;

  /**
   * 城市
   */
  toInstCityName?: string;

  /**
   * 机构名称
   */
  toInstName?: string;

  /**
   * 是否挂靠
   */
  toInstHasGuakao?: number;

  /**
   * @description 是否存在拆分[1：是；0否]
   */
  toIsSplit?: number;

  /**
   * 代理商业务员
   */
  teryAgtSalesMan?: string;
  /**
   * 标准单位
   */
  prodUnit?: string;

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
}

/**
 * 终端销量查询条件
 */
export interface TerminalQuery extends SalesQuery {}

/**
 * 关联辖区拆分详情
 */
export interface TerminalDwTerryTotalVO extends DwTerryTotalVO {
  terrys?: TerminalDwTerryVO[];
}

export interface TerminalDwTerryVO extends DwTerryVO {}

/**
 * @description 流向明细
 */
export interface TerminalDwdSfInspectSaleDetailTotal {
  total?: number;

  details?: TerminalDwdSfInspectSaleDetail[];
}

export interface TerminalDwdSfInspectSaleDetail
  extends DwdSfInspectSaleDetailVO {
  /**
   * 经销商名称
   */
  attachedFromInstName?: string;

  /**
   * 挂靠前机构名称
   */
  toInstName?: string;

  /**
   * 单位
   */
  prodUnit?: string;
}

/**
 * 销量详情
 */
export interface TerminalDwsSfInspectSaleWithToInstTerryCountDetailVO
  extends DwsSfInspectSaleWithToInstTerryCountVO {
  /**
   * 机构名称
   */
  toInstName?: string;
  /**
   * 省份
   */
  toInstProvinceName?: string;
  /**
   * 城市
   */
  toInstCityName?: string;
  /**
   * 是否挂靠
   */
  toInstHasGuakao?: number;
  /**
   * @description 是否存在拆分[1：是；0否]
   */
  toIsSplit?: number;

  /**
   * @description 是否存在拆分[teryHoleId有值：是；没有值为否]
   */
  teryHoleId?: string;

  /**
   * 标准单位
   */
  prodUnit?: string;

  //dwTerryTotal?: TerminalDwTerryTotalVO;

  //saleDetail?: TerminalDwdSfInspectSaleDetailTotal;
}

export interface TerminalSalesQuery {
  /**产品规格*/
  prodSpec?: string;
  /**账期ID*/
  periodId?: string;
  /**机构id*/
  instId?: string;
  /**产品编码*/
  prodCode?: string;

  institution?: string;

  product?: string;

  windowTime?: string;

  complaintsReason?: string;

  namePath?: string | number | (string | number)[];
}

export interface TerminalSalesDetailQuery {
  id?: string;

  pageSize?: number;

  current?: number;
}

import {
  DwdSfInspectSaleDetailVO,
  DwsSfInspectSaleWithToInstTerryCountVO,
  DwTerryTotalVO,
  DwTerryVO,
  SalesQuery,
} from '@/pages/SalesAppeal/data';

export interface Channel extends DwsSfInspectSaleWithToInstTerryCountVO {
  /**
   * 省份
   */
  fromInstProvinceName?: string;

  /**
   * 城市
   */
  fromInstCityName?: string;

  /**
   * 机构名称
   */
  fromInstName?: string;
  /**
   * 经销商级别
   */
  fromInstDistributorLevelName?: string;
  /**
   * 是否挂靠
   */
  fromInstHasGuakao?: number;

  /**
   * @description 是否存在拆分[1：是；0否]
   */
  fromIsSplit?: number;

  /**
   * 代理商业务员
   */
  agtSalesMan?: string;

  /**
   * 标准单位
   */
  prodUnit?: string;

  /**
   * tenantId
   */
  tenantId?: string | undefined;
  instId?: string | undefined;
  /**
   * 账期id
   */
  periodId?: string;

  /**
   * 辖区id
   */
  toInstId?: string;
  /**
   *  辖区id
   */
  fromInstId?: string;
}

export interface ChannelQuery extends SalesQuery {}

export interface ChannelDwsSfInspectSaleWithToInstTerryCountDetailVO
  extends DwsSfInspectSaleWithToInstTerryCountVO {
  /**
   * 省份
   */
  fromInstProvinceName?: string;

  /**
   * 城市
   */
  fromInstCityName?: string;

  /**
   * 机构名称
   */
  fromInstName?: string;

  /**
   * 是否挂靠
   */
  fromInstHasGuakao?: number;

  /**
   * @description 是否存在拆分[1：是；0否]
   */
  fromIsSplit?: number;

  /**
   * @description 是否存在拆分[teryHoleId有值：是；没有值为否]
   */
  teryHoleId?: string;

  /**
   * 代理商业务员
   */
  agtSalesMan?: string;
  // /**
  //  * 是否挂靠
  //  */
  // fromInstHasGuakao?: number;
  /**
   * 产品单位
   */
  prodUnit?: string;

  // dwTerryTotal: ChannelDwTerryTotalVO;
}

export interface ChannelDwTerryVO extends DwTerryVO {}

export interface ChannelDwTerryTotalVO extends DwTerryTotalVO {
  terrys?: ChannelDwTerryVO[];
}

export interface ChannelDwdSfInspectSaleDetail
  extends DwdSfInspectSaleDetailVO {
  /**
   * 挂靠前机构名称渠道详情
   */
  attachedToInstCityName?: string;

  /**
   * 挂靠前下游省份渠道详情
   */
  attachedToInstProvinceName?: string;

  /**
   * 挂靠前下游城市渠道详情
   */
  attachedFromInstCityName?: string;

  /**
   * 挂靠前机构名称
   */
  toInstName?: string;

  /**
   * 挂靠前下游省份
   */
  toInstProvinceName?: string;

  /**
   * 挂靠前下游城市
   */
  toInstCityName?: string;
}

export interface ChannelSalesQuery {
  /**产品规格*/
  prodSpec?: string;
  /**机构id*/
  instId?: string;
  /**产品编码*/
  prodCode?: string;

  current?: number;

  pageSize?: number;

  windowTime?: string;

  institution?: string;

  product?: string;

  complaintsReason?: string;
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

  namePath?: string | number | (string | number)[];
}

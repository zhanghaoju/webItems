export interface Appeal extends BaseModel {
  /**
   * @description 申诉ID
   */
  id?: string;

  /**
   * @description 时间窗
   */
  windowTimeName?: string;

  /**
   * @description 机构名称
   */
  institutionName?: string;

  /**
   * @description 机构Id
   */
  institutionId?: string;

  /**
   * @description 机构状态
   */
  institutionStatusName?: string;

  /**
   * @description 省份
   */
  provinceName?: string;

  /**
   * @description 城市
   */
  cityName?: string;

  /**
   * @description 产品
   */
  productId?: string;
  productName?: string;

  /**
   * @description 品规
   */
  productSpecsId?: string;
  productSpecsName?: string;

  /**
   * @description 流向数量总计
   */
  salesNumTotal?: number;

  /**
   * @description 流向申诉总计
   */
  salesComplaintsTotal?: number;

  /**
   * @description 预期销量总计
   */
  salesEstimateTotal?: number;

  /**
   * @description 下游机构
   */
  downstreamInstitutionName?: string;

  /**
   * @description 申诉人
   */
  complaintsPersonName?: string;

  /**
   * @description 申诉时间
   */
  complaintsDate?: number;

  /**
   * @description 申诉类型
   */
  complaintsTypeName?: string;

  /**
   * @description 申诉原因名称
   */
  complaintsReasonName?: string;

  /**
   * @description 申诉原因
   */
  complaintsReason?: string;

  /**
   * @description 申诉状态
   */
  statusName?: string;

  /**
   * @description 申诉状态（0： 等待反馈； 2：驳回；3：采纳；4：核实中）
   */
  status?: 0 | 1 | 2 | 3 | 4;
}

export interface AppealQuery {
  pageSize?: number;
  current?: number;

  /**
   * 时间窗名称
   */
  windowTime?: string[];

  /**
   * 是否目标
   */
  target?: number;

  /**
   * 是否挂靠
   */
  affiliation?: number;

  /**
   * 地区
   */
  region?: string[];

  /**
   * 机构类型
   */
  institutionType?: string;
}

export interface AppealDetail extends Appeal {
  /**
   * 单位
   */
  unitName?: string;

  /**
   * 反馈人
   */
  feedbackPersonName?: string;

  /**
   * 反馈时间
   */
  feedbackDate?: number;

  /**
   * 反馈原因
   */
  feedbackExplain?: string;

  /**
   * 流向数据
   */
  salesDetails?: SalesDetail[];
}

export interface SalesDetail {
  id?: string;

  /**
   * 申请Id
   */
  complaintsId?: string;

  /**
   * 机构名称
   */
  institutionName?: string;

  /**
   * 销售日期
   */
  salesDate?: number;

  /**
   * 申请数量
   */
  salesComplaintsNumb?: string;

  /**
   * 申诉证明
   */
  proveIds?: string;

  /**
   * 申诉说明
   */
  explain?: string;

  /**
   * 申请人所属机构
   */
  complaintsPersonJurisdictionNames?: string;

  /**
   *上游机构
   */
  complaintsPersonJurisdictionNamesP?: string;
}

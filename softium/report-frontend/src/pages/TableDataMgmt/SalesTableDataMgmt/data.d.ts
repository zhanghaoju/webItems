import React from 'react';
import { Descriptions } from 'antd';
interface DictionaryQuery {
  oid?: string;

  name?: string;

  systemCode?: string;
}
export interface ListBaseModel extends BaseModel {
  /**
   * 流向ID
   */
  sfId?: string;

  /**
   * 财年名称
   */
  financialYearName?: string;

  /**
   * 销售年月
   */
  periodName?: string;

  /**
   * 销售时间
   */
  saleDate?: string;

  /**
   * 标准产品编码
   */
  prodCode?: string;

  /**
   * 标准产品名称
   */
  prodName?: string;

  /**
   * 标准产品规格
   */
  specification?: string;

  /**
   * 生产厂家
   */
  manufacturer?: string;

  /**
   * 产品批号
   */
  productBatch?: string;
  /**
   * 供应商名称
   */
  vendorName?: string;

  /**
   * 开票时间
   */
  invoiceDate?: string;

  /**
   * 产品编码
   */
  attachedProdCode?: string;

  /**
   * 产品名称
   */
  attachedProdName?: string;

  /**
   * 产品品规
   */
  attachedProdSpecification?: string;

  /**
   * 单位
   */
  attachedProdUnit?: string;

  /**
   * 数量
   */
  attachedProdQuantity?: number;
  /**
   * 考核价金额
   */
  attachedProdAssessmentAmount?: string;

  /**
   * 流向金额
   */
  attachedProdAmount?: string;
  /*************************************/
  /**
   * 辖区层级
   */
  teryLevelName?: string;
  /**
   * 辖区编码
   */
  teryNodeCode?: string;
  /**
   * 辖区名称
   */
  teryNodeName?: string;
  /**
   * 辖区负责人
   */
  teryOwnerName?: string;
  /**
   * 辖区是否目标
   */
  terySysTargetType?: string;
  /**
   * 辖区类型
   */
  teryTypeName?: string;
  /**
   * 代理商业务员
   */
  salesMan?: string;
  /**
   * 1级辖区编码
   */
  teryNodeParentCode?: string;
  /**
   * 1级辖区名称
   */
  teryNodeParentName?: string;
  /**
   * 1级辖区负责人
   */
  teryNodeParentOwnerName?: string;

  /**
   * 辖区是否拆分
   */
  teryHasChaifen?: number;
  /**
   * 拆分比例
   */
  terySplitQuantity?: number;

  //标准客户名称
  toInstName?: string;

  //标准经销商名称
  fromInstName?: string;
  //金额（考核价）
  prodAssessmentAmount?: number;
  //标准单位
  prodUnit?: string;
  //标准数量
  prodQuantity?: number;
}

export interface TerminalList extends ListBaseModel {
  //产品是否挂靠 1 有 0无
  sfProdHasGuakao: any;
  //上有机构类行
  attachedFromInstCategory?: string;
  //上有机构主类行
  attachedFromInstMainCategory?: string;

  //teryHoleId不为空表示有拆分 为空表示没有拆分
  teryHoleId?: string;
  //辖区是否目标
  terySysTargetType?: string;
  //拆分比例
  terySplitRatio?: string;
  //下游编码
  toInstCode?: string;
  //挂靠类型
  attachedProdKind?: string;
  //下游经销商级别
  toInstDistributorLevelName?: string;
  //是否终端
  toInstIsTerminal?: number;
  //下游机构主类型
  toInstMainCategory?: string;
  //下游机构类型
  toInstCategory?: string;
  //省份
  toInstProvinceName?: string;
  //城市
  toInstCityName?: string;

  /**
   * 下游编码
   */
  attachedToInstCode?: string;
  /**
   * 下游名称
   */
  attachedToInstName?: string;
  /**
   * 下游经销商级别名称
   */
  attachedToInstDistributorLevelName?: string;
  /**
   *下游是否为终端
   */
  attachedToInstIsTerminal?: number;
  /**
   * 下游省份编码
   */
  attachedToInstProvinceCode?: string;
  /**
   * 下游省份名称
   */
  attachedToInstProvinceName?: string;
  /**
   * 下游城市编码
   */
  attachedToInstCityCode?: string;
  /**
   * 下游城市名称
   */
  attachedToInstCityName?: string;

  /**
   * 下游机构主类型
   */
  attachedToInstMainCategory?: string;
  /**
   * 下游机构类型
   */
  attachedToInstCategory?: string;
}
export interface ChannelList extends ListBaseModel {
  //下游机构类型
  attachedToInstCategory?: string;
  //下游机构主类型
  attachedToInstMainCategory?: string;
  //辖区是否目标
  terySysTargetType?: string;

  //辖区是否拆分 teryHoleId为空没有拆分  不为空是有拆分
  teryHoleId?: string;

  //拆分比例
  terySplitRatio?: string;

  //是否为渠道
  attachedFromInstIsChannel?: number;

  //下游机构主类型
  fromInstMainCategory?: string;

  //是否为渠道
  fromInstIsChannel?: number | undefined;

  //上游经销商级别
  fromInstDistributorLevelName?: string;

  //上游编码
  fromInstCode?: string;

  //挂靠后机构所在省份
  attachedToInstProvinceName?: string;

  //挂靠类型
  attachedProdKind?: string;

  //下游机构类型
  fromInstCategory?: string;

  //省份
  fromInstProvinceName?: string;

  //城市
  fromInstCityName?: string;
  /**
   * 上游编码
   */
  attachedFromInstCode?: string;
  /**
   * 上游名称
   */
  attachedFromInstName?: string;
  /**
   * 上游经销商级别名称
   */
  attachedFromInstDistributorLevelName?: string;
  /**
   *上游是否为终端
   */
  attachedFromInstIsTerminal?: number;
  /**
   * 上游省份编码
   */
  attachedFromInstProvinceCode?: string;
  /**
   * 上游省份名称
   */
  attachedFromInstProvinceName?: string;
  /**
   * 上游城市编码
   */
  attachedFromInstCityCode?: string;
  /**
   * 上游城市名称
   */
  attachedFromInstCityName?: string;

  /**
   * 上游机构主类型
   */
  attachedFromInstMainCategory?: string;
  /**
   * 上游机构类型
   */
  attachedFromInstCategory?: string;
}

export interface TerminalListQuery extends BaseModel {
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 页数
   */
  current?: number;
  /**
   * 租户id
   */
  tenantId?: string;
  /**
   * 账期ID
   */
  periodId?: string;
  /**
   * 产品是否挂靠 1有挂靠 0无挂靠
   */
  prodAffiliation?: number;

  /**
   *下游机构是否挂靠 1有挂靠 0无挂靠
   */
  toInstAffiliation?: number;
  /**
   *上游机构是否挂靠 1有挂靠 0无挂靠
   */
  fromInstAffiliation?: number;
  /**
   * 产品名称
   */
  attachedProdName?: string;

  /**
   * 产品编码
   */
  attachedProdCode?: string;

  /**
   * 下游机构名称
   */
  attachedToInstName?: string;
  /**
   * 下游机构编码
   */
  attachedToInstCode?: string;
  /**
   * 下游机构主类型
   */
  attachedToInstMainCategory?: string;
  /**
   * 下游机构类型
   */
  attachedToInstCategory?: string[];
  /**
   * 下游省份
   */
  attachedToInstProvinceName?: string;

  /**
   *下游城市
   */
  attachedToInstCityName?: string;
  /**
   * 下游经销商级别编码
   */
  attachedToInstDistributorLevelCode?: string;

  /**
   * 下游是否终端 1是 0否
   */
  attachedToInstIsTerminal?: number;

  /**
   * 上游机构名称
   */
  attachedFromInstName?: string;

  /**
   *上游机构编码
   */
  attachedFromInstCode?: string;
  /**
   * 上游机构主类型
   */
  attachedFromInstMainCategory?: string;

  /**
   * 上游机构类型
   */
  attachedFromInstCategory?: string[];

  /**
   * 上游省份
   */
  attachedFromInstProvinceName?: string;

  /**
   *上游城市
   */
  attachedFromInstCityName?: string;
  /**
   * 上游经销商级别编码
   */
  上游经销商级别编码?: string;

  /**
   * 上游机构类型
   */
  attachedFromInstDistributorLevelCode?: string;

  /**
   * 挂靠后上游是否为渠道
   */
  attachedFromInstIsChannel?: number;
  /**
   * 辖区名称
   */
  teryNodeName?: string;

  /**
   * 辖区编码
   */
  teryNodeCode?: string;
  /**
   * 辖区负责人
   */
  teryOwnerName?: string;

  /**
   * 辖区是否目标
   */
  terySysTargetType?: string;
  /**
   * 机构视角 from_inst上游 其他下游
   */
  instTeryVision?: string;
}

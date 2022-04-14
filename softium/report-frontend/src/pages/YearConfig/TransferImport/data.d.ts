export interface AllocationPO extends BaseModel {
  /**
   * @description 辖区编码
   */
  teryNodeCode?: string;

  /**
   * @description 辖区名称
   */
  teryNodeName?: string;

  /**
   * 产品品种编码
   */
  productCode?: string;

  /**
   * 产品品种名称
   */
  productName?: string;

  /**
   * 时间窗id
   */
  periodId?: string;

  /**
   * 时间窗名称
   */
  periodName?: string;
}
export interface AllocationQuery extends BaseModel {
  current?: number;
  pageSize?: number;

  pageNo?: number;
  /**
   * @description 时间窗ID
   */
  periodIds?: string[];
  /**
   * @description 经销商编码
   */
  teryNodeName?: string;

  /**
   * @description 客户名称
   */
  productName?: string;
}

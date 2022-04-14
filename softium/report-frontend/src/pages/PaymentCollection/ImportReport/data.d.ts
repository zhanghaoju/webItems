export interface ImportReport extends BaseModel {
  /**
   * @description 经销商编码
   */
  institutionCode?: string;

  /**
   * @description 客户名称
   */
  customerName?: string;

  /**
   * 年份
   */
  year?: string;

  /**
   * 片区
   */
  area?: string;

  /**
   * 省份
   */
  province?: string;

  /**
   * 方向
   */
  orientation?: string;

  /**
   * 医疗机构
   */
  medicalOrganization?: string;

  /**
   * 葫芦娃事业部
   */
  businessDivision?: number;

  /**
   * 商务部应收款
   */
  commerceReceivablesMinistry?: string;

  /**
   * 葫芦世家
   */
  gourdFamily?: string;

  /**
   * 其他部门应收款
   */
  receivableFromOtherDepartments?: string;

  /**
   * 合计
   */
  total?: string;

  /**
   * 备注1
   */
  remark1?: string;

  /**
   * 备注2
   */
  remark2?: string;

  /**
   * 备注3
   */
  remark3?: string;

  /**
   * 备注4
   */
  remark4?: string;

  /**
   * 备注5
   */
  remark5?: string;
}
export interface ImportReportQuery extends BaseModel {
  pageSize?: number;

  pageNo?: number;
  /**
   * @description 经销商编码
   */
  institutionCode?: string;

  /**
   * @description 客户名称
   */
  customerName?: string;

  /**
   * 年份
   */
  year?: string;

  /**
   * 片区
   */
  area?: string;

  /**
   * 省份
   */
  province?: string;

  /**
   * 方向
   */
  orientation?: string;
}

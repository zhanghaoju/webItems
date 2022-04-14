declare namespace DefectInsProd {
  /**
   * 是否排除 1排除 0不排除
   */
  type ISExclude = 0 | 1;

  type ListItem = {
    /**
     * 经销商id
     */
    institutionId?: string;

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
     * 经销商省份编码
     */
    institutionProvinceCode?: string;

    /**
     * 经销商城市
     */
    institutionCity?: string;

    /**
     * 经销商城市编码
     */
    institutionCityCode?: string;

    /**
     * 经销商区县
     */
    institutionCounty?: string;

    /**
     * 经销商区县编码
     */
    institutionCountyCode?: string;

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
    productSpecification?: string;

    /**
     * 是否排除，1-排除 0-不排除
     */
    isExclude?: ISExclude;
  } & BaseModel;

  type Query = {
    institutionCode?: string;

    institutionName?: string;

    productCode?: string;

    productName?: string;

    productSpecification?: string;
  } & BaseQuery;

  type DefectInstProdConfig = {
    /**
     * 波动观察天数
     */
    observeDays?: number;

    /**
     * 波动参考天数
     */
    consultDays?: number;

    /**
     * 波动阈值
     */
    thresholds?: number;
  } & BaseModel;
}

import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card, message } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getSaleDeliveryDetail } from '@/services/monthDataManagement/deliveryDataManagement';
import transformText, { transformTextToArray } from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime';
import { getDictionary } from '@/services/dayMatchProcess';

interface ParamsProps {
  id: string;
}

interface SaleDeliveryDetailProps {
  match: match<ParamsProps>;
  location: any;
}

interface DetailProps {
  id?: string;
  salesType?: string;
  productAmount?: string;
  behavior?: string;
  periodName?: string;
  companyName?: string;
  uploadTime?: string;
  uploadBy?: string;
  cost?: string;
  toInstitutionCode?: string;
  toInstitutionName?: string;
  department?: string;
  despatchOrder?: string;
  fileName?: string;
  generalName?: string;
  fromInstitutionCode?: string;
  fromInstitutionName?: string;
  invoiceDate?: string;
  orderDate?: string;
  originSaleId?: string;
  productPrice?: string;
  producer?: string;
  productBatch?: string;
  productCode?: string;
  productDate?: string;
  productLine?: string;
  productModel?: string;
  productName?: string;
  productSpec?: string;
  productUnit?: string;
  realm?: string;
  remark?: string;
  saleDate?: string;
  saleId?: string;
  saleOrder?: string;
  taxAmount?: string;
  validDate?: string;
  vendorName?: string;
  warehouse?: string;
  toInstitutionProvince?: string;
  toInstitutionCity?: string;
  updateTime?: string;
  standardInstitutionCode?: string;
  standardInstitutionName?: string;
  standardInstitutionProvince?: string;
  standardInstitutionCity?: string;
  standardCustomerCode?: string;
  standardCustomerName?: string;
  standardCustomerProvince?: string;
  standardCustomerCity?: string;
  standardProductCode?: string;
  standardProductName?: string;
  standardProductSpec?: string;
  productUnitFormat?: string;
  productQuantityFormat?: string;
  toInstitutionAddress?: string;
  productQuantity?: string;
  institutionAttachPharmacyCode?: string;
  institutionAttachPharmacyName?: string;
  institutionAttachVisualCode?: string;
  institutionAttachVisualName?: string;
  institutionAttachBranchCode?: string;
  institutionAttachBranchName?: string;
  attachProductCode?: string;
  attachProductName?: string;
  attachProductSpec?: string;
  attachProductQuantity?: string;
  institutionAttachCommerceTrustCode?: string;
  institutionAttachCommerceTrustName?: string;
  standardProductBatch?: string;
  standardProducer?: string;
  remarkOne?: string;
  remarkTwo?: string;
  remarkThree?: string;
  remarkFour?: string;
  remarkFive?: string;
  remarkSix?: string;
  remarkSeven?: string;
  remarkEight?: string;
  remarkNine?: string;
  remarkTen?: string;
  fromInstitutionLevel?: string;
  fromInstitutionType?: string;
  toInstitutionLevel?: string;
  toInstitutionType?: string;
  fromInstitutionCategoryName?: string;
  fromInstitutionSubCategoryName?: string;
  fromInstitutionPropertyName?: string;
  fromInstitutionLevelName?: string;
  toInstitutionCategoryName?: string;
  toInstitutionSubCategoryName?: string;
  toInstitutionPropertyName?: string;
  toInstitutionLevelName?: string;
}

const SaleDeliveryDetail = (props: SaleDeliveryDetailProps) => {
  const {
    match: { params },
  } = props;
  const [detail, setDetail] = useState<DetailProps>({});
  const [sourceTabIndex, setSourceTabIndex] = useState('');
  const [sourcePage, setSourcePage] = useState('');
  const [institutionCategoryOption, setInstitutionCategoryOption] = useState(
    [],
  );

  useEffect(() => {
    const id = params.id;
    setSourceTabIndex(props.location.query.sourceTabIndex);
    setSourcePage(props.location.query.sourcePage);
    getDictionaryFunc();
    getSaleDeliveryDetail({
      id: id,
    }).then(res => {
      setDetail(res.data);
    });
  }, []);

  //经销商类型下拉列表--调取主数据字典
  const getDictionaryFunc = async () => {
    try {
      const res = await getDictionary({
        systemCodes: ['InstitutionCategory'],
      });
      if (res.data && res.data.list) {
        setInstitutionCategoryOption(res.data.list[0].entries);
      }
    } catch (error) {
      message.error('获取经销商级别下拉列表失败');
    }
  };

  return (
    <div className="detailPage-content">
      <Card title="基础信息">
        <Descriptions column={3}>
          <Descriptions.Item label="数据id">
            {detail.originSaleId}
          </Descriptions.Item>
          <Descriptions.Item label="文件名">
            {detail.fileName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="销售年月">
            {detail.periodName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="采集方式">
            {transformText(
              'accessTypePocket',
              'label',
              'value',
              'accessType',
              detail,
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="调拨/纯销">
            {transformText(
              'saleComputeType',
              'label',
              'value',
              'salesType',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="是否补量">
            {transformText(
              'isUploadType',
              'label',
              'value',
              'conformPeriodStatus',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="上传时间">
            {formatChinaStandardTime(detail.uploadTime)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="上传人">
            {detail.uploadBy}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {transformText(
              'baseInspectStatus',
              'label',
              'value',
              'dataStatus',
              detail,
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="修改时间">
            {formatChinaStandardTime(detail.updateTime)}{' '}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="详细信息（原始）" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="销售表主键">
            {detail.saleId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="销售日期">
            {detail.saleDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="订单日期">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（明细）">
            {detail.fromInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（明细）">
            {detail.fromInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户编码">
            {' '}
            {detail.toInstitutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="客户名称">
            {detail.toInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户省份">
            {' '}
            {detail.toInstitutionProvince}
          </Descriptions.Item>
          <Descriptions.Item label="客户城市">
            {detail.toInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户地址">
            {detail.toInstitutionAddress}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="产品编码">
            {' '}
            {detail.productCode}
          </Descriptions.Item>
          <Descriptions.Item label="产品名称">
            {detail.productName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="通用名">
            {detail.generalName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="产品规格">
            {' '}
            {detail.productSpec}
          </Descriptions.Item>
          <Descriptions.Item label="产品批号">
            {' '}
            {detail.productBatch}
          </Descriptions.Item>
          <Descriptions.Item label="生产日期">
            {detail.productDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="有效期">
            {detail.validDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="产品型号">
            {detail.productModel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="产品线">
            {' '}
            {detail.productLine}
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            {detail.productQuantity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="单位">
            {detail.productUnit}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="单价">
            {' '}
            {detail.productPrice}
          </Descriptions.Item>
          <Descriptions.Item label="金额">
            {detail.productAmount}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="生产厂家">
            {detail.producer}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="销售行为">
            {' '}
            {detail.behavior}
          </Descriptions.Item>
          <Descriptions.Item label="销售单号">
            {' '}
            {detail.saleOrder}
          </Descriptions.Item>
          <Descriptions.Item label="发运单">
            {detail.despatchOrder}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="子公司名称">
            {' '}
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {detail.warehouse}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {detail.vendorName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="科室">
            {detail.department}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="开票日期">
            {detail.invoiceDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="税额">
            {' '}
            {detail.taxAmount}
          </Descriptions.Item>
          <Descriptions.Item label="物权">{detail.realm} </Descriptions.Item>
          <Descriptions.Item label="销售成本">{detail.cost} </Descriptions.Item>
          <Descriptions.Item label="销售备注">
            {detail.remark}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注1">
            {detail.remarkOne}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注2">
            {detail.remarkTwo}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注3">
            {detail.remarkThree}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注4">
            {detail.remarkFour}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注5">
            {detail.remarkFive}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注6">
            {detail.remarkSix}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注7">
            {detail.remarkSeven}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注8">
            {detail.remarkEight}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注9">
            {detail.remarkNine}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="备注10">
            {detail.remarkTen}{' '}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="详细信息（清洗后）" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="标准经销商编码">
            {detail.standardInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准经销商名称">
            {detail.standardInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商级别（品）">
            {detail.fromInstitutionLevel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商类型">
            {transformTextToArray(
              institutionCategoryOption,
              'name',
              'value',
              'fromInstitutionType',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="经销商子类">
            {detail.fromInstitutionCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商二级子类">
            {detail.fromInstitutionSubCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商属性">
            {detail.fromInstitutionPropertyName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商级别">
            {detail.fromInstitutionLevelName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准经销商省份">
            {detail.standardInstitutionProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准经销商城市">
            {detail.standardInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准客户编码">
            {' '}
            {detail.standardCustomerCode}
          </Descriptions.Item>
          <Descriptions.Item label="标准客户名称">
            {detail.standardCustomerName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户级别（品）">
            {detail.toInstitutionLevel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户类型">
            {transformTextToArray(
              institutionCategoryOption,
              'name',
              'value',
              'toInstitutionType',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="客户子类">
            {detail.toInstitutionCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户二级子类">
            {detail.toInstitutionSubCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户属性">
            {detail.toInstitutionPropertyName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户级别">
            {detail.toInstitutionLevelName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准客户省份">
            {' '}
            {detail.standardCustomerProvince}
          </Descriptions.Item>
          <Descriptions.Item label="标准客户城市">
            {detail.standardCustomerCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准产品编码">
            {' '}
            {detail.standardProductCode}
          </Descriptions.Item>
          <Descriptions.Item label="标准产品名称">
            {detail.standardProductName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准产品规格">
            {detail.standardProductSpec}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准生产厂家">
            {detail.standardProducer}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准产品批号">
            {detail.standardProductBatch}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准单位">
            {' '}
            {detail.productUnitFormat}
          </Descriptions.Item>
          <Descriptions.Item label="标准数量">
            {' '}
            {detail.productQuantityFormat}
          </Descriptions.Item>
          <Descriptions.Item label="药店挂靠机构编码">
            {' '}
            {detail.institutionAttachPharmacyCode}
          </Descriptions.Item>
          <Descriptions.Item label="药店挂靠机构名称">
            {' '}
            {detail.institutionAttachPharmacyName}
          </Descriptions.Item>
          <Descriptions.Item label="虚拟大仓挂靠机构编码">
            {' '}
            {detail.institutionAttachVisualCode}
          </Descriptions.Item>
          <Descriptions.Item label="虚拟大仓挂靠机构名称">
            {' '}
            {detail.institutionAttachVisualName}
          </Descriptions.Item>
          <Descriptions.Item label="总分院挂靠机构编码">
            {' '}
            {detail.institutionAttachBranchCode}
          </Descriptions.Item>
          <Descriptions.Item label="总分院挂靠机构名称">
            {' '}
            {detail.institutionAttachBranchName}
          </Descriptions.Item>
          <Descriptions.Item label="商业托管挂靠机构编码">
            {' '}
            {detail.institutionAttachCommerceTrustCode}
          </Descriptions.Item>
          <Descriptions.Item label="商业托管挂靠机构名称">
            {' '}
            {detail.institutionAttachCommerceTrustName}
          </Descriptions.Item>
          <Descriptions.Item label="挂靠后产品编码">
            {' '}
            {detail.attachProductCode}
          </Descriptions.Item>
          <Descriptions.Item label="挂靠后产品名称">
            {' '}
            {detail.attachProductName}
          </Descriptions.Item>
          <Descriptions.Item label="挂靠后产品品规">
            {' '}
            {detail.attachProductSpec}
          </Descriptions.Item>
          <Descriptions.Item label="挂靠后产品数量">
            {' '}
            {detail.attachProductQuantity}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <div className="detailPage-action-container">
        <Button
          type="default"
          onClick={() => {
            history.push(sourcePage + '?sourceTabIndex=' + sourceTabIndex);
          }}
        >
          返回
        </Button>
      </div>
    </div>
  );
};

export default SaleDeliveryDetail;

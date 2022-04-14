import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getDailySaleDeliveryDetail } from '@/services/dailyDataManagement/deliveryDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime';

interface ParamsProps {
  id: string;
}

interface SaleDeliveryDetailProps {
  match: match<ParamsProps>;
  location: any;
}

interface DetailProps {
  id?: string;
  productAmount?: string;
  behavior?: string;
  businessType?: string;
  periodName?: string;
  companyName?: string;
  uploadType?: string;
  uploadTime?: string;
  fileTime?: string;
  uploadBy?: string;
  fileStatus?: string;
  cost?: string;
  customerAddr?: string;
  toInstitutionCode?: string;
  toInstitutionName?: string;
  department?: string;
  despatchOrder?: string;
  failCause?: string;
  fileId?: string;
  fileName?: string;
  generalName?: string;
  fromInstitutionCode?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  fromInstitutionName?: string;
  invoiceDate?: string;
  isDeleted?: string;
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
  projectName?: string;
  qualityStatus?: string;
  quantity?: string;
  realm?: string;
  remark?: string;
  rowNum?: string;
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

  useEffect(() => {
    const id = params.id;
    setSourceTabIndex(props.location.query.sourceTabIndex);
    setSourcePage(props.location.query.sourcePage);
    getDailySaleDeliveryDetail({
      id: id,
    }).then(res => {
      setDetail(res.data);
    });
  }, []);

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
          <Descriptions.Item label="采集方式">
            {transformText(
              'accessTypePocket',
              'label',
              'value',
              'accessType',
              detail,
            )}{' '}
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
          <Descriptions.Item label="客户名称（品）">
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

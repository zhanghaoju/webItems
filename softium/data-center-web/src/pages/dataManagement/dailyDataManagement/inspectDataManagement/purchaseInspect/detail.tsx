import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getPurchaseInspectDetail } from '@/services/dailyDataManagement/inspectDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime';

interface ParamsProps {
  id: string;
}

interface PurchaseInspectDetailProps {
  match: match<ParamsProps>;
  location: any;
}

interface DetailProps {
  originPurchaseId?: string;
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
  deliveryList?: string;
  despatchOrder?: string;
  logisticsOrderNum?: string;
  failCause?: string;
  purchaseId?: string;
  fileName?: string;
  generalName?: string;
  fromInstitutionCode?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  fromInstitutionName?: string;
  fromInstitutionProvince?: string;
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
  purchaseDate?: string;
  saleId?: string;
  purchaseOrderNum?: string;
  taxAmount?: string;
  validDate?: string;
  vendorName?: string;
  warehouse?: string;
  productQuantityFormat?: string;
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
  standardVendorName?: string;
  standardVendorProvince?: string;
  standardVendorCity?: string;
  toInstitutionAddress?: string;
  productQuantity?: string;
  fromInstitutionCity?: string;
  standardVendorCode?: string;
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
}

const PurchaseInspectDetail = (props: PurchaseInspectDetailProps) => {
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
    getPurchaseInspectDetail({
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
            {detail.originPurchaseId}
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
          <Descriptions.Item label="采购表主键">
            {detail.purchaseId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="采购日期">
            {formatChinaStandardTime(detail.purchaseDate)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="订单日期">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（明细）">
            {detail.toInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（明细）">
            {detail.toInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（文件）">
            {detail.institutionFileCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（文件）">
            {detail.institutionFileName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="供应商编码">
            {' '}
            {detail.fromInstitutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {detail.fromInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="供应商省份">
            {' '}
            {detail.fromInstitutionProvince}
          </Descriptions.Item>
          <Descriptions.Item label="供应商城市">
            {detail.fromInstitutionCity}{' '}
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
          <Descriptions.Item label="采购行为">
            {' '}
            {detail.behavior}
          </Descriptions.Item>
          <Descriptions.Item label="采购单号">
            {' '}
            {detail.purchaseOrderNum}
          </Descriptions.Item>
          <Descriptions.Item label="进货单号">
            {detail.logisticsOrderNum}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="原厂发货清单">
            {detail.deliveryList}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="子公司名称">
            {' '}
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {detail.warehouse}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="物权">{detail.realm} </Descriptions.Item>
          <Descriptions.Item label="采购备注">
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
          <Descriptions.Item label="标准经销商省份">
            {detail.standardInstitutionProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准经销商城市">
            {detail.standardInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准供应商编码">
            {detail.standardVendorCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准供应商名称">
            {detail.standardVendorName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准供应商省份">
            {detail.standardVendorProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="标准供应商城市">
            {detail.standardVendorCity}{' '}
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

export default PurchaseInspectDetail;

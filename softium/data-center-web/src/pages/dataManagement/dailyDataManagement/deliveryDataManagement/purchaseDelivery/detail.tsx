import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getPurchaseDeliveryDetail } from '@/services/dailyDataManagement/deliveryDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime';

interface ParamsProps {
  id: string;
}

interface PurchaseDeliveryDetailProps {
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
  toInstitutionCategoryName?: string;
  toInstitutionSubCategoryName?: string;
  toInstitutionPropertyName?: string;
  toInstitutionLevelName?: string;
  fromInstitutionCategoryName?: string;
  fromInstitutionSubCategoryName?: string;
  fromInstitutionPropertyName?: string;
  fromInstitutionLevelName?: string;
}

const PurchaseDeliveryDetail = (props: PurchaseDeliveryDetailProps) => {
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
    getPurchaseDeliveryDetail({
      id: id,
    }).then(res => {
      setDetail(res.data);
    });
  }, []);

  return (
    <div className="detailPage-content">
      <Card title="????????????">
        <Descriptions column={3}>
          <Descriptions.Item label="??????id">
            {detail.originPurchaseId}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.fileName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {transformText(
              'accessTypePocket',
              'label',
              'value',
              'accessType',
              detail,
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {formatChinaStandardTime(detail.uploadTime)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.uploadBy}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {transformText(
              'baseInspectStatus',
              'label',
              'value',
              'dataStatus',
              detail,
            )}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {formatChinaStandardTime(detail.updateTime)}{' '}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="????????????????????????" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="???????????????">
            {detail.purchaseId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {formatChinaStandardTime(detail.purchaseDate)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.toInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.toInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionFileCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionFileName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {' '}
            {detail.fromInstitutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.fromInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {' '}
            {detail.fromInstitutionProvince}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.fromInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.productCode}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.generalName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.productSpec}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.productBatch}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.validDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productModel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {' '}
            {detail.productLine}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.productQuantity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.productUnit}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {' '}
            {detail.productPrice}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.productAmount}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.producer}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.behavior}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.purchaseOrderNum}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.logisticsOrderNum}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.deliveryList}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {' '}
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.warehouse}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">{detail.realm} </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.remark}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????1">
            {detail.remarkOne}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????2">
            {detail.remarkTwo}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????3">
            {detail.remarkThree}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????4">
            {detail.remarkFour}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????5">
            {detail.remarkFive}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????6">
            {detail.remarkSix}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????7">
            {detail.remarkSeven}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????8">
            {detail.remarkEight}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????9">
            {detail.remarkNine}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????10">
            {detail.remarkTen}{' '}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="???????????????????????????" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="?????????????????????">
            {detail.standardInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.toInstitutionCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.toInstitutionSubCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.toInstitutionPropertyName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.toInstitutionLevelName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardInstitutionProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardVendorCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardVendorName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.fromInstitutionCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.fromInstitutionSubCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.fromInstitutionPropertyName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.fromInstitutionLevelName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardVendorProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardVendorCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {' '}
            {detail.standardProductCode}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardProductName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardProductSpec}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardProducer}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardProductBatch}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.productUnitFormat}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
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
          ??????
        </Button>
      </div>
    </div>
  );
};

export default PurchaseDeliveryDetail;

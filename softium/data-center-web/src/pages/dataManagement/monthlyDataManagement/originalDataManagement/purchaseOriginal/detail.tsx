import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getPurchaseOriginalDetail } from '@/services/monthDataManagement/originalDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime.ts';
import SaleOriginal from '@/pages/dataManagement/monthlyDataManagement/originalDataManagement/saleOriginal';

interface ParamsProps {
  id: string;
}

interface PurchaseOriginalDetailProps {
  match: match<ParamsProps>;
  location: any;
}

interface DetailProps {
  id?: string;
  amount?: string;
  behavior?: string;
  businessType?: string;
  accessType?: string;
  periodName?: string;
  companyName?: string;
  uploadType?: string;
  uploadTime?: string;
  fileTime?: string;
  uploadBy?: string;
  fileStatus?: string;
  cost?: string;
  customerAddr?: string;
  customerCode?: string;
  vendorCode?: string;
  department?: string;
  logisticsOrderNum?: string;
  failCause?: string;
  fileId?: string;
  fileName?: string;
  generalName?: string;
  institutionCode?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  institutionName?: string;
  invoiceDate?: string;
  isDeleted?: string;
  orderDate?: string;
  originSaleId?: string;
  price?: string;
  producer?: string;
  productBatchCode?: string;
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
  purchaseRemark?: string;
  rowNum?: string;
  purchaseDate?: string;
  purchaseId?: string;
  purchaseOrderNum?: string;
  taxAmount?: string;
  validDate?: string;
  vendorName?: string;
  warehouse?: string;
  vendorProvince?: string;
  vendorCity?: string;
  deliveryList?: string;
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

const PurchaseOriginalDetail = (props: PurchaseOriginalDetailProps) => {
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
    getPurchaseOriginalDetail({
      id: id,
    }).then(res => {
      setDetail(res.data);
    });
  }, []);

  return (
    <div className="detailPage-content">
      <Card title="????????????">
        <Descriptions column={3}>
          <Descriptions.Item label="??????id">{detail.id}</Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.fileName}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.periodName}
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
            {formatChinaStandardTime(detail.uploadTime)}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.uploadBy}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {transformText(
              'fileStatusPocket',
              'label',
              'value',
              'fileStatus',
              detail,
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="????????????" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="???????????????">
            {detail.purchaseId}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.purchaseDate}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.orderDate}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionName}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionFileCode}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.institutionFileName}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.vendorCode}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.vendorName}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.vendorProvince}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.vendorCity}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productCode}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productName}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.generalName}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productSpec}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productBatchCode}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productDate}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.validDate}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.productModel}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.productLine}
          </Descriptions.Item>
          <Descriptions.Item label="??????">{detail.quantity}</Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.productUnit}
          </Descriptions.Item>
          <Descriptions.Item label="??????">{detail.price}</Descriptions.Item>
          <Descriptions.Item label="??????">{detail.amount}</Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.producer}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.behavior}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.purchaseOrderNum}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.logisticsOrderNum}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.deliveryList}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="??????">{detail.warehouse}</Descriptions.Item>
          <Descriptions.Item label="??????">{detail.realm}</Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.purchaseRemark}
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

export default PurchaseOriginalDetail;

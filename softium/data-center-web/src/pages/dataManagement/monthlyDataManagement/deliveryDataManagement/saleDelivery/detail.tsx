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

  //???????????????????????????--?????????????????????
  const getDictionaryFunc = async () => {
    try {
      const res = await getDictionary({
        systemCodes: ['InstitutionCategory'],
      });
      if (res.data && res.data.list) {
        setInstitutionCategoryOption(res.data.list[0].entries);
      }
    } catch (error) {
      message.error('???????????????????????????????????????');
    }
  };

  return (
    <div className="detailPage-content">
      <Card title="????????????">
        <Descriptions column={3}>
          <Descriptions.Item label="??????id">
            {detail.originSaleId}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.fileName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.periodName}{' '}
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
          <Descriptions.Item label="??????/??????">
            {transformText(
              'saleComputeType',
              'label',
              'value',
              'salesType',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {transformText(
              'isUploadType',
              'label',
              'value',
              'conformPeriodStatus',
              detail,
            )}
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
            {detail.saleId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.saleDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.fromInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {detail.fromInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.toInstitutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {' '}
            {detail.toInstitutionProvince}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionAddress}{' '}
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
            {detail.saleOrder}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">
            {detail.despatchOrder}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {' '}
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.warehouse}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {detail.vendorName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {detail.department}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.invoiceDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            {' '}
            {detail.taxAmount}
          </Descriptions.Item>
          <Descriptions.Item label="??????">{detail.realm} </Descriptions.Item>
          <Descriptions.Item label="????????????">{detail.cost} </Descriptions.Item>
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
          <Descriptions.Item label="????????????????????????">
            {detail.fromInstitutionLevel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????">
            {transformTextToArray(
              institutionCategoryOption,
              'name',
              'value',
              'fromInstitutionType',
              detail,
            )}
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
            {detail.standardInstitutionProvince}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.standardInstitutionCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {' '}
            {detail.standardCustomerCode}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardCustomerName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {detail.toInstitutionLevel}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {transformTextToArray(
              institutionCategoryOption,
              'name',
              'value',
              'toInstitutionType',
              detail,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.toInstitutionSubCategoryName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionPropertyName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {detail.toInstitutionLevelName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {' '}
            {detail.standardCustomerProvince}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????">
            {detail.standardCustomerCity}{' '}
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
          <Descriptions.Item label="????????????????????????">
            {' '}
            {detail.institutionAttachPharmacyCode}
          </Descriptions.Item>
          <Descriptions.Item label="????????????????????????">
            {' '}
            {detail.institutionAttachPharmacyName}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????????????????">
            {' '}
            {detail.institutionAttachVisualCode}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????????????????">
            {' '}
            {detail.institutionAttachVisualName}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {' '}
            {detail.institutionAttachBranchCode}
          </Descriptions.Item>
          <Descriptions.Item label="???????????????????????????">
            {' '}
            {detail.institutionAttachBranchName}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????????????????">
            {' '}
            {detail.institutionAttachCommerceTrustCode}
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????????????????">
            {' '}
            {detail.institutionAttachCommerceTrustName}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {' '}
            {detail.attachProductCode}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {' '}
            {detail.attachProductName}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
            {' '}
            {detail.attachProductSpec}
          </Descriptions.Item>
          <Descriptions.Item label="?????????????????????">
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
          ??????
        </Button>
      </div>
    </div>
  );
};

export default SaleDeliveryDetail;

import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getInventoryInspectDetail } from '@/services/monthDataManagement/inspectDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime';

interface ParamsProps {
  id: string;
}

interface InventoryInspectDetailProps {
  match: match<ParamsProps>;
  location: any;
}

interface DetailProps {
  originInventoryId?: string;
  inventoryId?: string;
  productAmount?: string;
  inventoryStatus?: string;
  periodName?: string;
  companyName?: string;
  uploadType?: string;
  uploadTime?: string;
  uploadBy?: string;
  fileName?: string;
  generalName?: string;
  fromInstitutionCode?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  fromInstitutionName?: string;
  inventoryDate?: string;
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
  warehouseDate?: string;
  orderDate?: string;
  validDate?: string;
  warehouse?: string;
  productQuantityFormat?: string;
  updateTime?: string;
  standardInstitutionCode?: string;
  standardInstitutionName?: string;
  standardInstitutionProvince?: string;
  standardInstitutionCity?: string;
  standardProductCode?: string;
  standardProductName?: string;
  standardProductSpec?: string;
  productUnitFormat?: string;
  productQuantity?: string;
  supplierName?: string;
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

const InventoryInspectDetail = (props: InventoryInspectDetailProps) => {
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
    getInventoryInspectDetail({
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
            {detail.originInventoryId}
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
          <Descriptions.Item label="是否补录">
            {detail.uploadType}
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
          <Descriptions.Item label="库存表主键">
            {detail.inventoryId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="日期">
            {formatChinaStandardTime(detail.inventoryDate)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（明细）">
            {detail.fromInstitutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（明细）">
            {detail.fromInstitutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（文件）">
            {detail.institutionFileCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（文件）">
            {detail.institutionFileName}{' '}
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
          <Descriptions.Item label="入库日期">
            {' '}
            {detail.warehouseDate}
          </Descriptions.Item>
          <Descriptions.Item label="订单日期">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="生产厂家">
            {detail.producer}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="库存状态">
            {' '}
            {detail.inventoryStatus}
          </Descriptions.Item>
          <Descriptions.Item label="子公司名称">
            {' '}
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {detail.warehouse}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {detail.supplierName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="物权">{detail.realm} </Descriptions.Item>
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

export default InventoryInspectDetail;

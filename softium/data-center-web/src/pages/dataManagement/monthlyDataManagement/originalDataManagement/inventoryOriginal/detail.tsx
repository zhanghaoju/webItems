import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getInventoryOriginalDetail } from '@/services/monthDataManagement/originalDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime.ts';

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
  inventoryStatus?: string;
  accessType?: string;
  periodName?: string;
  companyName?: string;
  uploadType?: string;
  uploadTime?: string;
  uploadBy?: string;
  fileStatus?: string;
  fileName?: string;
  generalName?: string;
  institutionCode?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  institutionName?: string;
  orderDate?: string;
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
  quantity?: string;
  realm?: string;
  inventoryDate?: string;
  inventoryId?: string;
  validDate?: string;
  supplierName?: string;
  warehouse?: string;
  warehouseDate?: string;
  saleableQuantity?: string;
  unsaleableQuantity?: string;
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
    getInventoryOriginalDetail({
      id: id,
    }).then(res => {
      setDetail(res.data);
    });
  }, []);

  return (
    <div className="detailPage-content">
      <Card title="基础信息">
        <Descriptions column={3}>
          <Descriptions.Item label="数据id">{detail.id}</Descriptions.Item>
          <Descriptions.Item label="文件名">
            {detail.fileName}
          </Descriptions.Item>
          <Descriptions.Item label="销售年月">
            {detail.periodName}
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
            {formatChinaStandardTime(detail.uploadTime)}
          </Descriptions.Item>
          <Descriptions.Item label="上传人">
            {detail.uploadBy}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
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
      <Card title="详细信息" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="库存表主键">
            {detail.inventoryId}
          </Descriptions.Item>
          <Descriptions.Item label="日期">
            {detail.inventoryDate}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（明细）">
            {detail.institutionCode}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（明细）">
            {detail.institutionName}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码（文件）">
            {detail.institutionFileCode}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称（文件）">
            {detail.institutionFileName}
          </Descriptions.Item>
          <Descriptions.Item label="产品编码">
            {detail.productCode}
          </Descriptions.Item>
          <Descriptions.Item label="产品名称">
            {detail.productName}
          </Descriptions.Item>
          <Descriptions.Item label="通用名">
            {detail.generalName}
          </Descriptions.Item>
          <Descriptions.Item label="产品规格">
            {detail.productSpec}
          </Descriptions.Item>
          <Descriptions.Item label="产品批号">
            {detail.productBatchCode}
          </Descriptions.Item>
          <Descriptions.Item label="生产日期">
            {detail.productDate}
          </Descriptions.Item>
          <Descriptions.Item label="有效期">
            {detail.validDate}
          </Descriptions.Item>
          <Descriptions.Item label="产品型号">
            {detail.productModel}
          </Descriptions.Item>
          <Descriptions.Item label="产品线">
            {detail.productLine}
          </Descriptions.Item>
          <Descriptions.Item label="数量">{detail.quantity}</Descriptions.Item>
          <Descriptions.Item label="可销数量">
            {detail.saleableQuantity}
          </Descriptions.Item>
          <Descriptions.Item label="不可销数量">
            {detail.unsaleableQuantity}
          </Descriptions.Item>
          <Descriptions.Item label="单位">
            {detail.productUnit}
          </Descriptions.Item>
          <Descriptions.Item label="单价">{detail.price}</Descriptions.Item>
          <Descriptions.Item label="金额">{detail.amount}</Descriptions.Item>
          <Descriptions.Item label="入库日期">
            {detail.warehouseDate}
          </Descriptions.Item>
          <Descriptions.Item label="订单日期">
            {detail.orderDate}
          </Descriptions.Item>
          <Descriptions.Item label="生产厂家">
            {detail.producer}
          </Descriptions.Item>
          <Descriptions.Item label="库存状态">
            {detail.inventoryStatus}
          </Descriptions.Item>
          <Descriptions.Item label="子公司名称">
            {detail.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">{detail.warehouse}</Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {detail.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="物权">{detail.realm}</Descriptions.Item>
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

export default PurchaseOriginalDetail;

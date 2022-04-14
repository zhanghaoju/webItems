import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Card } from 'antd';
import '../../index.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getSaleOriginalDetail } from '@/services/monthDataManagement/originalDataManagement';
import transformText from '@/utils/transform';
import { formatChinaStandardTime } from '@/utils/formatTime.ts';

interface ParamsProps {
  id: string;
}

interface ConsignmentOriginalDetailProps {
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
  customerName?: string;
  department?: string;
  despatchOrder?: string;
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
  customerProvince?: string;
  customerCity?: string;
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

const ConsignmentOriginalDetail = (props: ConsignmentOriginalDetailProps) => {
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
    getSaleOriginalDetail({
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
          <Descriptions.Item label="上传时间">
            {formatChinaStandardTime(detail.uploadTime)}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="上传人">
            {detail.uploadBy}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {transformText(
              'fileStatusPocket',
              'label',
              'value',
              'fileStatus',
              detail,
            )}{' '}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="详细信息" style={{ marginTop: 30 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="销售表主键">
            {detail.saleId}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="销售表日期">
            {detail.saleDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="订单日期">
            {detail.orderDate}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商编码">
            {detail.institutionCode}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="经销商名称">
            {detail.institutionName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户编码">
            {' '}
            {detail.customerCode}
          </Descriptions.Item>
          <Descriptions.Item label="客户名称">
            {detail.customerName}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户省份">
            {' '}
            {detail.customerProvince}
          </Descriptions.Item>
          <Descriptions.Item label="客户城市">
            {detail.customerCity}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="客户地址">
            {detail.customerAddr}{' '}
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
          <Descriptions.Item label="数量">{detail.quantity} </Descriptions.Item>
          <Descriptions.Item label="单位">
            {detail.productUnit}{' '}
          </Descriptions.Item>
          <Descriptions.Item label="单价"> {detail.price}</Descriptions.Item>
          <Descriptions.Item label="金额">{detail.amount} </Descriptions.Item>
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

export default ConsignmentOriginalDetail;

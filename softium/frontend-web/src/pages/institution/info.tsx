import React, { useEffect, useState } from 'react';
import { Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './styles/institutionInfo.less';
import { history } from 'umi';
import { match } from 'react-router';
import { getDetail } from '@/services/institution';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';

interface ParamsProps {
  id: string;
}

interface InstitutionInfoProps {
  match: match<ParamsProps>;
}

interface InfoProps {
  id?: string;
  name?: string;
  province?: string;
  city?: string;
  county?: string;
  address?: any;
  category?: string;
  subCategory?: string;
  aliasNames?: string;
  categoryName?: string;
  subCategoryName?: string;
  longitude?: string;
  latitude?: string;
  tel?: string;
  legalRepresentative?: string;
  registeredCapital?: string;
  establishDate?: string;
  socialCreditCode?: string;
  state?: string;
  stateName?: string;
  businessScope?: string;
  instruction?: string;
  property?: string;
  propertyName?: string;
  level?: string;
  levelName?: string;
  betNum?: number;
  visits?: number;
  hospitalizedNum?: number;
  staffNum?: number;
  isMedicalInsurance?: number;
  area?: number;
  stackType?: string;
}

const InstitutionInfo = (props: InstitutionInfoProps) => {
  const {
    match: { params },
  } = props;
  const [info, setInfo] = useState<InfoProps>({});
  const [category] = useState(
    getDictionaryBySystemCode('InstitutionCategory') || [],
  );

  useEffect(() => {
    if (params.id) {
      const data = params.id.split('-');
      getDetail({
        id: data[0],
        category: data[1],
      }).then(res => {
        setInfo(res.data);
      });
    }
  }, []);

  return (
    <div className="enterprise-institution-info">
      <div className="enterprise-institution-info-title">
        <h2 className="enterprise-institution-info-title-text">{info.name}</h2>
        <Button
          icon={<ArrowLeftOutlined />}
          className="enterprise-institution-info-title-return"
          onClick={() => {
            history.push('/institution');
          }}
        >
          返回
        </Button>
      </div>
      <Descriptions title="机构属性" column={2}>
        <Descriptions.Item label="机构ID">{info.id}</Descriptions.Item>
        <Descriptions.Item label="机构名称">{info.name}</Descriptions.Item>
        <Descriptions.Item label="机构别名">
          {info.aliasNames}
        </Descriptions.Item>
        <Descriptions.Item label="省份">{info.province}</Descriptions.Item>
        <Descriptions.Item label="城市">{info.city}</Descriptions.Item>
        <Descriptions.Item label="区县">{info.county}</Descriptions.Item>
        <Descriptions.Item label="地址" span={2}>
          {Object.values(info.address || {}).join(',')}
        </Descriptions.Item>
        <Descriptions.Item label="机构一级属性">
          {getNameByValue(category, info.category)}
        </Descriptions.Item>
        <Descriptions.Item label="机构二级属性">
          {getNameByValue(category, info.subCategory)}
        </Descriptions.Item>
        <Descriptions.Item label="经度">{info.longitude}</Descriptions.Item>
        <Descriptions.Item label="维度">{info.latitude}</Descriptions.Item>
        <Descriptions.Item label="机构电话">{info.tel}</Descriptions.Item>
        <Descriptions.Item label="法人代表">
          {info.legalRepresentative}
        </Descriptions.Item>
        <Descriptions.Item label="注册资金">
          {info.registeredCapital}
        </Descriptions.Item>
        <Descriptions.Item label="成立时间">
          {info.establishDate}
        </Descriptions.Item>
        <Descriptions.Item label="统一社会信用代码">
          {info.socialCreditCode}
        </Descriptions.Item>
        <Descriptions.Item label="状态">{info.stateName}</Descriptions.Item>
        <Descriptions.Item label="经营范围" span={2}>
          {info.businessScope}
        </Descriptions.Item>
        <Descriptions.Item label="机构简介" span={2}>
          {info.instruction}
        </Descriptions.Item>
      </Descriptions>
      {info.category === 'HealthCare' && (
        <Descriptions title="医院属性" column={2}>
          <Descriptions.Item label="机构性质">
            {info.propertyName}
          </Descriptions.Item>
          <Descriptions.Item label="机构等级">
            {info.levelName}
          </Descriptions.Item>
          <Descriptions.Item label="床位数">{info.betNum}</Descriptions.Item>
          <Descriptions.Item label="年门诊量">{info.visits}</Descriptions.Item>
          <Descriptions.Item label="年住院量">
            {info.hospitalizedNum}
          </Descriptions.Item>
          <Descriptions.Item label="职工人数">
            {info.staffNum}
          </Descriptions.Item>
        </Descriptions>
      )}
      {info.category === 'Pharmacy' && (
        <Descriptions title="药店属性" column={2}>
          <Descriptions.Item label="是否医保药店">
            {info.isMedicalInsurance !== null
              ? info.isMedicalInsurance
                ? '是'
                : '否'
              : ''}
          </Descriptions.Item>
          <Descriptions.Item label="药店面积">{info.area}</Descriptions.Item>
          <Descriptions.Item label="开架闭架">
            {info.stackType}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

export default InstitutionInfo;

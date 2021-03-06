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
          ??????
        </Button>
      </div>
      <Descriptions title="????????????" column={2}>
        <Descriptions.Item label="??????ID">{info.id}</Descriptions.Item>
        <Descriptions.Item label="????????????">{info.name}</Descriptions.Item>
        <Descriptions.Item label="????????????">
          {info.aliasNames}
        </Descriptions.Item>
        <Descriptions.Item label="??????">{info.province}</Descriptions.Item>
        <Descriptions.Item label="??????">{info.city}</Descriptions.Item>
        <Descriptions.Item label="??????">{info.county}</Descriptions.Item>
        <Descriptions.Item label="??????" span={2}>
          {Object.values(info.address || {}).join(',')}
        </Descriptions.Item>
        <Descriptions.Item label="??????????????????">
          {getNameByValue(category, info.category)}
        </Descriptions.Item>
        <Descriptions.Item label="??????????????????">
          {getNameByValue(category, info.subCategory)}
        </Descriptions.Item>
        <Descriptions.Item label="??????">{info.longitude}</Descriptions.Item>
        <Descriptions.Item label="??????">{info.latitude}</Descriptions.Item>
        <Descriptions.Item label="????????????">{info.tel}</Descriptions.Item>
        <Descriptions.Item label="????????????">
          {info.legalRepresentative}
        </Descriptions.Item>
        <Descriptions.Item label="????????????">
          {info.registeredCapital}
        </Descriptions.Item>
        <Descriptions.Item label="????????????">
          {info.establishDate}
        </Descriptions.Item>
        <Descriptions.Item label="????????????????????????">
          {info.socialCreditCode}
        </Descriptions.Item>
        <Descriptions.Item label="??????">{info.stateName}</Descriptions.Item>
        <Descriptions.Item label="????????????" span={2}>
          {info.businessScope}
        </Descriptions.Item>
        <Descriptions.Item label="????????????" span={2}>
          {info.instruction}
        </Descriptions.Item>
      </Descriptions>
      {info.category === 'HealthCare' && (
        <Descriptions title="????????????" column={2}>
          <Descriptions.Item label="????????????">
            {info.propertyName}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {info.levelName}
          </Descriptions.Item>
          <Descriptions.Item label="?????????">{info.betNum}</Descriptions.Item>
          <Descriptions.Item label="????????????">{info.visits}</Descriptions.Item>
          <Descriptions.Item label="????????????">
            {info.hospitalizedNum}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">
            {info.staffNum}
          </Descriptions.Item>
        </Descriptions>
      )}
      {info.category === 'Pharmacy' && (
        <Descriptions title="????????????" column={2}>
          <Descriptions.Item label="??????????????????">
            {info.isMedicalInsurance !== null
              ? info.isMedicalInsurance
                ? '???'
                : '???'
              : ''}
          </Descriptions.Item>
          <Descriptions.Item label="????????????">{info.area}</Descriptions.Item>
          <Descriptions.Item label="????????????">
            {info.stackType}
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

export default InstitutionInfo;

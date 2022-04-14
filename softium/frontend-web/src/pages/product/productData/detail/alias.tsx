import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import '../style/index.less';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';

interface DoctorData {
  code?: String;
  name?: String;
  department?: String;
  major?: String;
  gender?: String;
  departmentTel?: String;
  createByName?: String;
  createTime?: String;
  instruction?: String;
  wechat?: String;
  email?: String;
  expert?: String;
  identityCard?: String;
  graduateUniversity?: String;
  graduateDate?: String;
  type?: String;
  academicTitle?: String;
  tel?: String;
  education?: String;
  licenseNumber?: String;
  state?: String;
  stateReason?: String;
  clinicalTitle?: String;

  chnPrmryFmlyNm?: String;
  chnPrmryGivenNm?: String;
  engWstrnFmlyNm?: String;
  engWstrnGivenNm?: String;
  licenseRegPlace?: String;
  licenseTypeCode?: String;
  licenseType?: String;
  licenseCtgryCode?: String;
  licenseScope?: String;
}

const DetailAlias: React.FC = (props: any) => {
  const [data, setData] = useState<DoctorData>({});
  const doctorDepartment: any[] = getDictionaryBySystemCode('DoctorDepartment');
  const state: any[] = getDictionaryBySystemCode('State');
  const gender: any[] = getDictionaryBySystemCode('Gender');
  const licenseType: any[] = getDictionaryBySystemCode('LicenseType');
  const customerType: any[] = getDictionaryBySystemCode('CustomerType');

  useEffect(() => {
    // getDetail(params).then((res: any) => {
    //   if (res) {
    //     setData(res.data);
    //   }
    // });
  }, []);

  return (
    <div
      className="product-detail-container"
      style={{ height: 500, overflowY: 'scroll' }}
    >
      <Descriptions column={2}>
        <Descriptions.Item label="产品名称">{data.code}</Descriptions.Item>
        <Descriptions.Item label="产品编码">{data.name}</Descriptions.Item>
        <Descriptions.Item label="产品规格">KY7094852</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default DetailAlias;

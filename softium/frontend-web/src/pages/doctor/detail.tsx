import React, { useEffect, useState } from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { getDetail } from '@/services/doctor';
import { Descriptions } from 'antd';
import './styles/index.less';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';

interface DoctorProps {
  doctor: any;
  dispatch: any;
}

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

const DoctorDetail: React.FC<DoctorProps> = (props: any) => {
  const {
    match: { params },
  } = props;
  const [data, setData] = useState<DoctorData>({});
  const doctorDepartment: any[] = getDictionaryBySystemCode('DoctorDepartment');
  const state: any[] = getDictionaryBySystemCode('State');
  const gender: any[] = getDictionaryBySystemCode('Gender');
  const licenseType: any[] = getDictionaryBySystemCode('LicenseType');
  const customerType: any[] = getDictionaryBySystemCode('CustomerType');

  useEffect(() => {
    getDetail(params).then((res: any) => {
      if (res) {
        setData(res.data);
      }
    });
  }, []);

  return (
    <div className="doctor-detail-container">
      <Descriptions title="医生属性" column={3}>
        <Descriptions.Item label="医生编码">{data.code}</Descriptions.Item>
        <Descriptions.Item label="医生姓名">{data.name}</Descriptions.Item>
        <Descriptions.Item label="所属机构编码">KY7094852</Descriptions.Item>
        <Descriptions.Item label="所属机构名称">
          河北省职工医学院附属医院
        </Descriptions.Item>
        <Descriptions.Item label="标准科室">
          {getNameByValue(doctorDepartment, data.department)}
        </Descriptions.Item>
        <Descriptions.Item label="专业">{data.major}</Descriptions.Item>
        <Descriptions.Item label="性别">
          {getNameByValue(gender, data.gender)}
        </Descriptions.Item>
        <Descriptions.Item label="类型">
          {getNameByValue(customerType, data.type)}
        </Descriptions.Item>
        <Descriptions.Item label="临床职称">
          {getNameByValue(licenseType, data.clinicalTitle)}
        </Descriptions.Item>
        <Descriptions.Item label="学术头衔">
          {data.academicTitle}
        </Descriptions.Item>
        <Descriptions.Item label="电话号码">{data.tel}</Descriptions.Item>
        <Descriptions.Item label="微信号">{data.wechat}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
        <Descriptions.Item label="身份证号">
          {data.identityCard}
        </Descriptions.Item>
        <Descriptions.Item label="毕业院校">
          {data.graduateUniversity}
        </Descriptions.Item>
        <Descriptions.Item label="学历">{data.education}</Descriptions.Item>
        <Descriptions.Item label="毕业时间">
          {data.graduateDate}
        </Descriptions.Item>
        <Descriptions.Item label="执业医师号码">
          {data.licenseNumber}
        </Descriptions.Item>
        <Descriptions.Item label="科室电话">
          {data.departmentTel}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {getNameByValue(state, data.state)}
        </Descriptions.Item>
        <Descriptions.Item label="状态原因">
          {data.stateReason}
        </Descriptions.Item>
        <Descriptions.Item label="上一次更新时间">
          2020-10-11 20:00:23
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {data.createByName}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {data.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="简介" span={24}>
          {data.instruction}
        </Descriptions.Item>
        <Descriptions.Item label="擅长" span={24}>
          {data.expert}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="其他属性" column={3}>
        <Descriptions.Item label="姓（中文）">
          {data.chnPrmryFmlyNm}
        </Descriptions.Item>
        <Descriptions.Item label="名（中文）">
          {data.chnPrmryGivenNm}
        </Descriptions.Item>
        <Descriptions.Item label="姓（英文）">
          {data.engWstrnFmlyNm}
        </Descriptions.Item>
        <Descriptions.Item label="名（英文）">
          {data.engWstrnGivenNm}
        </Descriptions.Item>
        <Descriptions.Item label="执照注册地省份">
          {data.licenseRegPlace}
        </Descriptions.Item>
        <Descriptions.Item label="执照类型编码">
          {data.licenseTypeCode}
        </Descriptions.Item>
        <Descriptions.Item label="注册类型">
          {data.licenseType}
        </Descriptions.Item>
        <Descriptions.Item label="注册领域">
          {data.licenseCtgryCode}
        </Descriptions.Item>
        <Descriptions.Item label="注册范围">
          {data.licenseScope}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default DoctorDetail;

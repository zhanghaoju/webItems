import React, { useEffect, useState } from 'react';
import { getHospitalDetail } from '@/services/institution';
import { Descriptions } from 'antd';
import { getData } from '@/pages/institution/util';
import _ from 'lodash';

const HospitalDetail = (props: any) => {
  const {
    params,
    params: { detailFields, extMetadata, handleDetail },
  } = props;
  const [data, setData] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    const extFields: any[] = [];
    (extMetadata || []).forEach((item: any) => {
      let field: any = { label: item.dispName, value: item.name, order: 10000 };
      field.multiple = item?.dispType === 'multi_dropdown';
      if (item?.dictionary?.id && item?.prop === 'ext') {
        field.dictionary = `dynamic${item.dictionary.oid}`;
      }
      extFields.push(field);
    });
    const request = handleDetail ? handleDetail : getHospitalDetail;
    request({
      id: params?.record?.id,
      institutionCategory: params.category,
    }).then((res: any) => {
      if (res) {
        let result: any = res.data;
        handleFields(extFields);
        result.type = params.category;
        result = { ...result, ...result.extMap };
        if (_.isObject(result.address)) {
          result.latitude = result.address.latitude;
          result.longitude = result.address.longitude;
          result.address = result.address.address;
        }
        if (_.isArray(result.tag)) {
          const tags: string[] = [];
          result.tag.forEach((item: any) => tags.push(item.tagId));
          result.tag = tags;
        }
        setData(result);
      }
    });
  }, []);

  const handleFields = (extFields: any) => {
    const sortFieldsASC =
      [...detailFields, ...extFields].sort((a, b) => a.order - b.order) || [];
    setFields(sortFieldsASC);
  };

  if (Object.keys(data).length === 0) return null;

  return (
    <Descriptions>
      {(fields || []).map((item: any) => {
        const value: any = data[item.value];
        if (item.hideShow) return null;
        return (
          <Descriptions.Item key={item.value} label={item.label}>
            {item.dictionary ? getData(item, value, data) : value}
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
};

export default HospitalDetail;

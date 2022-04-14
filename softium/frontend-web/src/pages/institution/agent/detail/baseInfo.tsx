import React, { useEffect, useState } from 'react';
import { getHospitalDetail } from '@/services/institution';
import { Card, Descriptions } from 'antd';
import { getData } from '../../util';
import { handleColumns, handleTag } from '@/utils/utils';
import { institutionCategory } from '@/pages/institution/institutionCategory';
import _ from 'lodash';

const BaseInfo: React.FC = (props: any) => {
  const { match, setBaseInfo } = props;
  const [data, setData] = useState<any>({});
  const [detailFields, setDetailFields] = useState<any[]>([]);

  const getAgentData = async () => {
    const { table, fields } = institutionCategory.Agent;
    await handleTag('Institution');
    const result: any = await handleColumns(table, fields);
    const res: any = {};
    result.detailFields.forEach((item: any) => {
      if (res[item.group]) {
        res[item.group].children.push(item);
      } else if (item.group) {
        res[item.group] = {
          title: item.group,
          children: [],
        };
      }
    });

    if (result.extFields) {
      const extRes: any[] = [];
      (result.extFields || []).forEach((item: any) => {
        extRes.push({
          label: item.dispName,
          value: item.name,
          multiple: item?.dispType === 'multi_dropdown',
          dictionary: `dynamic${item.dictionary.oid}`,
        });
      });
      res['扩展信息'] = {
        title: '扩展信息',
        children: extRes,
      };
    }
    await setDetailFields(Object.values(res));
    const detail: any = await getHospitalDetail({
      id: match?.params?.id,
      institutionCategory: 'Agent',
    });
    const data = detail.data;
    if (_.isObject(data.address)) {
      data.latitude = data.address.latitude;
      data.longitude = data.address.longitude;
      data.address = data.address.address;
    }
    if (_.isArray(data.tag)) {
      const tags: string[] = [];
      data.tag.forEach((item: any) => tags.push(item.tagId));
      data.tag = tags;
    }
    setBaseInfo({ name: data.name, code: data.code });
    await setData(detail.data || {});
  };

  useEffect(() => {
    getAgentData().then();
  }, []);

  return (
    <>
      {(detailFields || []).map((item: any, index: number) => {
        return (
          <Card
            className="margin-bottom16"
            type="inner"
            key={index}
            title={item.title}
          >
            <Descriptions column={3}>
              {item.children.map((children: any, i: number) => {
                const value: any = data[children.value];
                if (children.hideShow) return null;
                return (
                  <Descriptions.Item
                    span={children.length}
                    key={i}
                    label={children.label}
                  >
                    {children.dictionary
                      ? getData(children, String(value))
                      : value}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Card>
        );
      })}
    </>
  );
};

export default BaseInfo;

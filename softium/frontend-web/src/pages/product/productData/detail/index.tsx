import React, { useState, useEffect } from 'react';
import { Card, Descriptions } from 'antd';
import '../style/index.less';
import { getDetail } from '@/services/product/product';
import { getData } from '@/pages/institution/util';
import _ from 'lodash';

const ProductDetail = (props: any) => {
  const [data, setData] = useState<any>({});
  const [initGroup, setGroup] = useState<any[]>([]);

  const {
    fields: { extFields, detailFields },
  } = props;

  const getExtMetadata = () => {
    const fieldsData: any[] = [];
    (extFields || []).forEach((item: any) => {
      let field: any = { label: item.dispName, value: item.name, order: 10000 };
      field.multiple = item?.dispType === 'multi_dropdown';
      if (item?.dictionary?.id && item?.prop === 'ext') {
        field.dictionary = `dynamic${item.dictionary.oid}`;
      }
      fieldsData.push(field);
    });
    return fieldsData;
  };

  useEffect(() => {
    const { params } = props;
    const group: any = [
      { title: '基本信息', children: [] },
      { title: '详细信息', children: [] },
      { title: '扩展信息', children: getExtMetadata() },
    ];
    detailFields.forEach((item: any) => {
      item.group === '基本信息' && group[0].children.push(item);
      item.group === '详细信息' && group[1].children.push(item);
    });
    setGroup(group);
    getDetail({ id: params.id }).then((res: any) => {
      if (_.isArray(res.data.tag)) {
        const tags: string[] = [];
        res.data.tag.forEach((item: any) => tags.push(item.tagId));
        res.data.tag = tags;
      }
      setData(res.data);
    });
  }, [props.params]);

  return initGroup.map((t: any, index) => {
    if (t.children.length === 0) return null;
    return (
      <Card
        className="margin-bottom16"
        type="inner"
        title={t.title}
        key={index}
      >
        <Descriptions>
          {(t.children || []).map((item: any) => {
            if (item.hideShow) return null;
            const value: any = data[item.value];
            return (
              <Descriptions.Item label={item.label} key={item.value}>
                {item.dictionary ? getData(item, value, data) : value}
                {item.args?.unit && typeof data[item.value] === 'number' && '%'}
                {item.validPeriod &&
                  typeof data[item.value] === 'number' &&
                  '月'}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </Card>
    );
  });
};

export default ProductDetail;

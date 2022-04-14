import React, { useState, useCallback } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons/lib';
import '../styles/institutionInfo.less';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { handleLikeFieldChange } from '@/pages/institution/util';

const SearchForm = React.memo((props: any) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const [city, setCity] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [len, setLen] = useState(3);

  const onFinish = (values: any) => {
    const { setSearchData } = props;
    if (values.likeField) {
      values.likeField = values.likeField.replace(/(^\s+)|(\s+$)/g, '');
    }
    const { type } = values;
    setSearchData &&
      setSearchData({
        ...values,
        type: type === 'Hospital' ? 'HealthCare' : type,
        current: 1,
        reloadType: 'search',
      });
  };

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  const getDictionary = (key: string) => getDictionaryBySystemCode(key) || [];

  const selectItem = (
    data: any,
    key: string = '',
    mode: any = undefined,
    callBack: Function = () => {},
    showSearch?: boolean,
  ) => {
    data = data ? data : getDictionary(key);
    return (
      <Select
        placeholder="请选择"
        allowClear
        mode={mode}
        showSearch={showSearch}
        filterOption={(input, option: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value: string) => callBack && callBack(value)}
      >
        {data.map((item: any) => {
          return (
            <Select.Option value={item.value} key={item.value}>
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
    );
  };

  const renderItems = useCallback(() => {
    const province = getDictionaryBySystemCode('Region') || [];
    const state = getDictionaryBySystemCode('State') || [];
    return [
      <Col span={6} key="1">
        <Form.Item
          tooltip={`可查询项：机构名称、机构编码、机构别名${
            props.searchErpCode ? '、ERP编码' : ''
          }`}
          {...formItemLayout}
          name="likeField"
          label="关键词"
        >
          <Input
            placeholder="请输入"
            allowClear
            onKeyUp={e => handleLikeFieldChange(e, form, 'likeField')}
          />
        </Form.Item>
      </Col>,
      <Col span={6} key="6">
        <Form.Item {...formItemLayout} name="tagIds" label="标签">
          {selectItem(null, 'InstitutionTag', 'multiple', () => {}, true)}
        </Form.Item>
      </Col>,
      <Col span={6} key="2">
        <Form.Item {...formItemLayout} name="provinceCode" label="省份">
          {selectItem(
            province,
            '',
            undefined,
            (value: string) => {
              const result: any = province.find(
                (item: any) => item.value === value,
              );
              setCity(result?.children || []);
              form.resetFields(['cityCode']);
            },
            true,
          )}
        </Form.Item>
      </Col>,
      <Col span={6} key="3">
        <Form.Item {...formItemLayout} name="cityCode" label="城市">
          {selectItem(city, '', 'multiple', () => {}, true)}
        </Form.Item>
      </Col>,
      <Col span={6} key="4">
        <Form.Item {...formItemLayout} name="state" label="状态">
          {selectItem(state)}
        </Form.Item>
      </Col>,
      <Col span={6} key="5">
        <Form.Item {...formItemLayout} name="source" label="创建源">
          {selectItem(null, 'InstitutionSource')}
        </Form.Item>
      </Col>,
      <Col span={6} key="7">
        <Form.Item {...formItemLayout} name="level" label="机构级别">
          {selectItem(null, 'InstitutionGrade')}
        </Form.Item>
      </Col>,
      <Col span={6} key="8">
        <Form.Item {...formItemLayout} name="property" label="机构属性">
          {selectItem(null, 'InstitutionAttribute')}
        </Form.Item>
      </Col>,
      <Col span={6} key="9">
        <Form.Item {...formItemLayout} name="type" label="机构类型">
          {selectItem(null, 'InstitutionCategory', '', (value: string) => {
            form.resetFields(['category', 'subCategory']);
            switch (value) {
              case 'HealthCare':
                setCategory(getDictionary('HospitalType') || []);
                break;
              case 'Pharmacy':
                setCategory(getDictionary('PharmacyType') || []);
                break;
              case 'Other':
                setCategory(getDictionary('OtherType') || []);
                break;
              default:
                setCategory([]);
                break;
            }
          })}
        </Form.Item>
      </Col>,
      <Col span={6} key="10">
        <Form.Item {...formItemLayout} name="category" label="机构子类">
          {selectItem(category, '', '', (value: string) => {
            form.resetFields(['subCategory']);
            setSubCategory(getDictionary(`${value}Category`));
          })}
        </Form.Item>
      </Col>,
      <Col span={6} key="11">
        <Form.Item {...formItemLayout} name="subCategory" label="机构二级子类">
          {selectItem(subCategory)}
        </Form.Item>
      </Col>,
    ];
  }, [city, category, subCategory]);

  return (
    <div className="search-form">
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Row gutter={24}>
          {renderItems().splice(0, len)}
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => form.resetFields()}
            >
              重置
            </Button>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <a
              onClick={() => {
                setExpand(!expand);
                setLen(!expand ? 20 : 3);
              }}
            >
              {expand ? ` 收起 ` : ` 展开 `}
              {expand ? <UpOutlined /> : <DownOutlined />}
            </a>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default SearchForm;

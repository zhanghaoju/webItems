import React, { useEffect, useState } from 'react';
import {
  Modal,
  Input,
  Button,
  Table,
  Tooltip,
  message,
  Form,
  Select,
} from 'antd';
const { Search } = Input;
import './style/index.less';
import { PlusOutlined } from '@ant-design/icons/lib';
import {
  getInstitutionDetail,
  getNewApplyDetail,
  institutionRecommend,
} from '@/services/institution';
import { getValue } from '@/pages/institution/util';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { institutionCategory } from '@/pages/institution/institutionCategory';
import GModal from '@/components/modal';
import _ from 'lodash';
import { getOptions } from '@/utils/utils';

const SelectItem = (props: any) => {
  const {
    form,
    onSearch,
    data,
    options,
    cityForm,
    setCity,
    countyForm,
    name,
    placeholder,
    setCounty,
  } = props;
  return (
    <Form form={form} className="institution-search-form">
      <Form.Item name={name}>
        <Select
          allowClear
          placeholder={placeholder}
          showSearch={true}
          filterOption={(input, option: any) =>
            (option.label || option.children)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value: string) => {
            const result: any = getOptions(options, value) || [];
            setCity && setCity(result.children || []);
            setCounty && setCounty(result.children || []);
            cityForm && cityForm.resetFields();
            countyForm && countyForm.resetFields();
            onSearch && onSearch(data.name);
          }}
        >
          {options.map((item: any) => (
            <Select.Option value={item.value} key={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

const InstitutionModal = (props: any) => {
  const {
    type,
    reloadList,
    institutionFields,
    addVisible,
    setAddVisible,
    institutionConfig,
    hideAdd,
    params,
  } = props;
  const [regionForm] = Form.useForm();
  const [cityForm] = Form.useForm();
  const [countyForm] = Form.useForm();
  const [initSearchLoading, setSearchLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [initOptions, setOptions] = useState<any>({});
  const region = getDictionaryBySystemCode('Region');
  const [city, setCity] = useState<any[]>([]);
  const [county, setCounty] = useState<any[]>([]);
  const [institutionType, setInstitutionType] = useState<any>({});
  const [data, setData] = useState<any>({
    recommend: [],
    name: '',
    extMetadata: [],
  });

  useEffect(() => {
    setInstitutionType(institutionCategory[params.institutionCategory || type]);
    const { hideFormCard, hideExtCard, dcr } = institutionCategory[
      params.institutionCategory || type
    ];
    const { formFields, extFields } = institutionFields;
    const fields: any[] = _.cloneDeep(formFields);
    if (params && params.id) {
      const codeField: any = fields.find((t: any) => t.name === 'code');
      codeField.args = { ...codeField.args, disabled: true, required: false };
      setVisible(true);
      setOptions({
        fields,
        extFields,
        hideFormCard,
        extFieldInfo: {
          hideExtCard: hideExtCard,
        },
        params,
        handleData,
        requestDetail: params.dcr ? getNewApplyDetail : getInstitutionDetail,
        attr: {
          okText: '提交',
        },
        optionsCallback: () => {
          setAddVisible && setAddVisible();
        },
      });
    }
  }, []);

  const columns: any[] = [
    {
      title: '机构名称',
      dataIndex: 'name',
      fixed: 'left',
      render(text: string) {
        return <Tooltip title={text}>{text}</Tooltip>;
      },
    },
    {
      title: () => {
        return (
          <SelectItem
            form={regionForm}
            name="province"
            placeholder="省份"
            onSearch={onSearch}
            data={data}
            options={region}
            cityForm={cityForm}
            setCity={setCity}
            countyForm={countyForm}
          />
        );
      },
      dataIndex: 'province',
      width: 150,
    },
    {
      title: () => {
        return (
          <SelectItem
            form={cityForm}
            name="city"
            placeholder="城市"
            onSearch={onSearch}
            data={data}
            options={city}
            setCounty={setCounty}
            countyForm={countyForm}
          />
        );
      },
      dataIndex: 'city',
      width: 150,
    },
    {
      title: () => {
        return (
          <SelectItem
            form={countyForm}
            name="county"
            placeholder="区县"
            onSearch={onSearch}
            data={data}
            options={county}
          />
        );
      },
      dataIndex: 'county',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      ellipsis: {
        showTitle: true,
      },
      width: 300,
      render(text: string) {
        return <Tooltip title={text}>{text}</Tooltip>;
      },
    },
    {
      title: '机构类型',
      dataIndex: 'typeName',
      ellipsis: {
        showTitle: true,
      },
      width: 200,
    },
    {
      title: '机构子类型',
      dataIndex: 'categoryName',
      ellipsis: {
        showTitle: true,
      },
      width: 200,
    },
    {
      title: '机构二级类型',
      dataIndex: 'subCategoryName',
      ellipsis: {
        showTitle: true,
      },
      width: 200,
    },
    {
      title: '操作',
      width: 80,
      dataIndex: 'ope',
      fixed: 'right',
      render(text: string, record: any) {
        return (
          <Button
            type="link"
            onClick={() => {
              showAddModal({
                data: record,
                addType: 'select',
              });
            }}
          >
            选择
          </Button>
        );
      },
    },
  ];

  const handleData = (data: any) => {
    if (_.isArray(data.tag)) {
      const tags: string[] = [];
      data.tag.forEach((item: any) => {
        tags.push(item.tagId);
      });
      data.tag = tags;
    }
    if (_.isObject(data.address)) {
      data.latitude = data.address.latitude;
      data.longitude = data.address.longitude;
      data.address = data.address.address;
    }
  };

  const onSearch = (value: any) => {
    setSearchLoading(true);
    const { province } = regionForm.getFieldsValue(['province']);
    const { city } = cityForm.getFieldsValue(['city']);
    const { county } = countyForm.getFieldsValue(['county']);
    const provinceName: any = getOptions(region, province) || {};
    const cityName: any = getOptions(region, city) || {};
    const countyName: any = getOptions(region, county) || {};
    const params = {
      name: value && value.replace(/\s*/g, ''),
      province: provinceName.name,
      city: cityName.name,
      county: countyName.name,
    };
    institutionRecommend({ ...params })
      .then((res: any) => {
        if (res) {
          const resData = JSON.parse(JSON.stringify(res.data));
          (resData || []).forEach((item: any) => {
            if (item.type) {
              const institutionCategory = getDictionaryBySystemCode(
                'InstitutionCategory',
              );
              const type =
                institutionCategory.find((t: any) => t.value === item.type) ||
                {};
              item.typeName = type.name;
            }
            if (item.category) {
              const category = getDictionaryBySystemCode(
                `${item.type === 'Pharmacy' ? item.type : item.category}Type`,
              );
              item.categoryName = getValue(category, item.category);
            }
            if (item.subCategory) {
              const subCategory = getDictionaryBySystemCode(
                `${item.category}Category`,
              );
              item.subCategoryName = getValue(subCategory, item.subCategory);
            }
          });
          setData({
            ...data,
            recommend: resData,
            name: value,
          });
        }
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const showAddModal = (options: any) => {
    options.data.id && delete options.data.id;
    if (options.data.name) {
      const { formFields, extFields } = institutionFields;
      const {
        dcr,
        code,
        hideFormCard,
        hideExtCard,
        dictionaryCategory,
      } = institutionType;
      const fields: any[] = _.cloneDeep(formFields);
      const nameField: any = fields.find((t: any) => t.name === 'name');
      const codeField: any = fields.find((t: any) => t.name === 'code');
      const provinceField: any = fields.find(
        (t: any) => t.name === 'provinceId',
      );
      const cityField: any = fields.find((t: any) => t.name === 'cityId');
      const stateField: any = fields.find((t: any) => t.name === 'state');
      const autoCode: boolean = institutionConfig?.isInstitutionAutomaticCode;

      nameField.args.disabled = institutionConfig[dcr];
      codeField.args.required = autoCode
        ? false
        : !(institutionConfig[dcr] && institutionConfig[code]);
      codeField.args.disabled = autoCode;

      provinceField.args.required = autoCode
        ? true
        : !(institutionConfig[dcr] && institutionConfig[code]);
      delete provinceField.args.disabled;

      cityField.args.required = autoCode
        ? true
        : !(institutionConfig[dcr] && institutionConfig[code]);
      delete cityField.args.disabled;

      stateField.args.disabled = true;

      if (!autoCode && institutionConfig[dcr] && institutionConfig[code]) {
        options.data.code = options.data.standardCode;
      }

      if (options.data.category) {
        const category: any =
          getDictionaryBySystemCode(dictionaryCategory) || [];
        const result: any = category.find(
          (t: any) => t.value === options.data.category,
        );
        if (!result) options.data.category = null;
      }

      setVisible(true);
      setOptions({
        fields: fields,
        extFields,
        hideFormCard,
        extFieldInfo: {
          hideExtCard: hideExtCard,
        },
        initialValues: { ...options.data, state: 'Active' },
        attr: {
          okText: institutionConfig[dcr] ? '新增申请' : '提交',
        },
      });
    } else {
      message.info('请输入机构名称');
    }
  };

  const handleInput = (e: any) => {
    setData({
      ...data,
      name: e.target.value.replace(/\s*/g, ''),
    });
  };

  const submit = (data: any, sourceData: any, setSpinning: any) => {
    const values: any = _.cloneDeep(data);
    const {
      category,
      request,
      dcrRequest,
      updateRequest,
      dcr,
    } = institutionType;
    const requestFn: any =
      institutionConfig[dcr] && !sourceData.id && !params.dcr
        ? dcrRequest
        : !hideAdd || sourceData.dcrId || params.dcr
        ? request
        : updateRequest;
    const province: any = getOptions(region, values.provinceId);
    const city: any = getOptions(region, values.cityId);
    const county: any = getOptions(region, values.countyId) || {};
    values.province = province.name;
    values.city = city.name;
    values.county = county.name;
    values.type = category;
    values.source = 'SingleInsert';
    const attr: any = values.serviceAttribute;
    values.serviceAttribute =
      _.isArray(attr) && attr.length > 0 ? attr.join(',') : '';
    values.address = {
      id: sourceData?.address?.id,
      address: values.address,
      longitude: values.longitude,
      latitude: values.latitude,
    };
    if (sourceData.dcrId) values.dcrId = sourceData.dcrId;
    params.dcr && delete values.id;
    if (_.isArray(values.tag)) {
      const tags: any = [];
      values.tag.forEach((item: any) => {
        tags.push({ tagId: item });
      });
      values.tag = tags;
    }
    if (sourceData.standardCode) values.standardCode = sourceData.standardCode;
    if (values.dcrId) values.alias = sourceData.alias;
    requestFn(values)
      .then((res: any) => {
        if (values.id) {
          res?.data?.data === 'completed'
            ? Modal.info({
                title: '提示',
                content: '该数据已完成清洗入库。',
              })
            : message.success('编辑成功');
          setVisible(false);
          setAddVisible && setAddVisible(false);
        } else {
          if (institutionConfig[dcr]) {
            Modal.success({
              title: '主数据新增申请提交成功',
              content: `【${values.name}】新增申请提交成功，请在机构申请页面查看结果。`,
              onOk: () => {
                setVisible(false);
                setAddVisible && setAddVisible(false);
              },
            });
          } else {
            message.success(`【${values.name}】添加成功`);
            setVisible(false);
            setAddVisible && setAddVisible(false);
          }
        }
        reloadList && reloadList();
      })
      .catch(() => setSpinning(false));
  };

  return (
    <>
      <Modal
        maskClosable={false}
        destroyOnClose
        centered
        title="机构查询"
        onCancel={() => setAddVisible(false)}
        className="modal-width"
        footer={null}
        visible={addVisible && !hideAdd}
      >
        <div className="institution-search margin">
          <Search
            placeholder="请输入机构名称"
            loading={initSearchLoading}
            onSearch={onSearch}
            onInput={e => handleInput(e)}
            enterButton
          />
          <Button
            type="primary"
            ghost
            onClick={() => {
              showAddModal({
                data: { name: data.name },
                addType: 'add',
              });
            }}
          >
            <PlusOutlined />
            自主添加
          </Button>
        </div>
        {data.recommend.length > 0 ? (
          <div className="institution-prompt">
            可选择以下其中一条行业库数据进行添加操作，若无所需数据，可自主添加
          </div>
        ) : null}
        <Table
          columns={columns}
          dataSource={data.recommend}
          size="small"
          sticky
          rowKey="id"
          pagination={false}
          scroll={{ x: 1700, y: 'calc(100vh - 350px)' }}
        />
      </Modal>
      {visible && (
        <GModal
          options={initOptions}
          visible={visible}
          callback={(values: any, sourceData: any, setSpinning: any) =>
            submit(values, sourceData, setSpinning)
          }
          setVisible={setVisible}
        />
      )}
    </>
  );
};

export default InstitutionModal;

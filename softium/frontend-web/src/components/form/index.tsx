import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Card, Col, Form, Row } from 'antd';
import component from '../index';
import { layout12, sortColumns } from '@/utils/utils';
import { FormLayout, useForm } from 'antd/es/form/Form';
import moment from 'moment';
import _ from 'lodash';

interface Props {
  cRef?: Ref<any> | undefined;
  formItem?: any;
  initialValues?: any;
  card: any;
  hideCard?: boolean;
  formLayout?: FormLayout | undefined;
}

const FormComponent = (props: Props) => {
  const [form] = useForm();
  const {
    formItem,
    initialValues = {},
    formLayout = 'horizontal',
    card,
    hideCard,
  } = props;
  const [initHasGroup, setHasGroup] = useState<boolean>(false);
  const [initFormItem, setFormItem] = useState<any[]>([]);
  const [UI, setUI] = useState<number>(new Date().getTime());

  const getFormData = () =>
    new Promise(resolve =>
      form.validateFields().then(values => resolve(values)),
    );

  useImperativeHandle(props.cRef, () => ({
    getData: getFormData,
  }));

  const handleGroup = (data: any[]) => {
    const result: any = {};
    data.forEach(item => {
      if (!result[item.group]) {
        result[item.group] = {
          title: item.group,
          children: [item],
        };
      } else {
        result[item.group].children.push(item);
      }
    });
    return Object.values(result);
  };

  const handleHideShow = useCallback(
    (initialValues = '') => {
      const values: any = initialValues ? initialValues : form.getFieldsValue();
      for (const item in formItem) {
        const node: any = formItem[item] || {};
        const { args } = node || {};
        const { conditions, disabledObj, requiredObj } = args || {};
        let flag: boolean = false;
        if (conditions) {
          for (const key in conditions) {
            if (values[key] !== conditions[key]) flag = true;
          }
        }

        if (disabledObj) {
          for (const key in disabledObj) {
            if (_.isArray(disabledObj[key])) {
              formItem[item].args.disabled = !disabledObj[key].find(
                (t: string) => t === values[key],
              );
            } else {
              formItem[item].args.disabled = !(
                values[key] === disabledObj[key]
              );
            }
          }
        }

        if (requiredObj) {
          for (const key in requiredObj) {
            if (_.isArray(requiredObj[key])) {
              formItem[item].args.required = requiredObj[key].find(
                (t: string) => t === values[key],
              );
            } else {
              formItem[item].args.required = values[key] === requiredObj[key];
            }
          }
        }
        formItem[item].args.hideShow = flag;
      }
      const groupResult: any[] = handleGroup(formItem);
      const len: number = groupResult.length;
      const hasGroup: boolean = !!hideCard ? hideCard : len === 1;
      setHasGroup(hasGroup);
      const result: any[] = hasGroup ? formItem : groupResult;
      setFormItem([...result]);
    },
    [form, formItem],
  );

  const updateUI = () => setUI(new Date().getTime());

  const onChange = () => {
    handleHideShow();
    updateUI();
  };

  useEffect(() => {
    for (const item in initialValues) {
      const field: any = formItem.find((t: any) => t.name === item);
      if (field?.args?.type === 'date')
        initialValues[item] = moment(initialValues[item]);
      if (field?.attr?.mode === 'multiple')
        initialValues[item] = !initialValues[item]
          ? []
          : _.isArray(initialValues[item])
          ? initialValues[item]
          : initialValues[item].split(',');
    }
    handleHideShow(initialValues);
    form.setFieldsValue(initialValues);
  }, [form, initialValues, formItem, handleHideShow]);

  if (initFormItem.length === 0) return null;

  const formItemEl = (data: any[] = []) => {
    return (
      <Row>
        {sortColumns(data).map((item: any, i: number) => {
          const type: string = item?.args?.type || 'text';
          const Component = (component as any)[type];
          return (
            <Col
              key={i}
              span={item?.args?.span || 12}
              style={{ display: item?.args?.hideShow ? 'none' : '' }}
            >
              <Component {...item} form={form} onChange={() => onChange()} />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Form
      {...layout12}
      form={form}
      layout={formLayout}
      key={UI}
      autoComplete="off"
    >
      {initHasGroup
        ? formItemEl(initFormItem)
        : initFormItem.map((item: any, index: number) => {
            return (
              <Card
                key={index}
                type="inner"
                {...card}
                title={item.title}
                className="margin-bottom16"
              >
                {formItemEl(item.children)}
              </Card>
            );
          })}
    </Form>
  );
};

export default FormComponent;

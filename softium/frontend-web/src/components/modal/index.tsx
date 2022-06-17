import { Card, Modal } from 'antd';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import FormComponent from '../form';
import { FormContainer } from '@vulcan/utils';
import { useForm } from 'form-render';

interface Fields {
  label: string;
  value: string;
  args?: any;
  attr?: any;
  rules?: any;
  [key: string]: string;
}

interface Props {
  visible?: boolean;
  setVisible?: Function | undefined;
  callback?: (values: any, data: any, setSpinning: Function) => void;
  reload?: () => void;
  modalType?: string;
  options: {
    title?: string | undefined;
    fields: Fields[];
    params?: any;
    initialValues?: any;
    optionsCallback?: () => void;
    submitUrl?: string;
    getUrl?: string;
    card?: any;
    msg?: string;
    requestDetail?: any;
    extFields?: any[];
    hideFormCard?: boolean;
    handleData?: any;
    extFieldInfo?: {
      hideExtCard?: boolean;
      title?: string;
    };
    attr?: {
      columnKey?: number;
      columnSpan?: number;
      width?: number | string;
      okText?: string;
      cancelText?: string;
      disabled?: boolean;
    };
  };
  cRef?: Ref<any> | undefined;
}

const ExtFrom = (props: any) => {
  const { extFields, data, cRef } = props;
  const [options, setOptions] = useState<any>({});
  const dynamicForm = useForm();

  useEffect(() => {
    const { extMap } = data;
    dynamicForm.setValues(extMap || {});
  }, []);

  const onFinish = (formValues: any, errors: any) => {
    const { getData, setSpinning, setData, callback, params } = options;
    if (errors.length === 0) {
      getData()
        .then((values: any) => {
          setSpinning(true);
          setData(values);
          callback &&
            callback(
              { ...values, extMap: formValues, ...params },
              data,
              setSpinning,
            );
        })
        .catch(() => setSpinning(false));
    }
    setSpinning(false);
  };
  const getDynamicForm = () => dynamicForm;
  const getOptions = (options: any) => setOptions(options);

  useImperativeHandle(cRef, () => ({
    getDynamicForm,
    getOptions,
  }));

  return (
    <FormContainer
      metadata={extFields || []}
      column={2}
      displayType="row"
      form={dynamicForm}
      onFinish={onFinish}
      onValuesChange={() => {}}
      schema={''}
    />
  );
};

const GModal = (props: Props) => {
  const cRef = useRef<any>();
  const extRef = useRef<any>();
  const { options, visible, setVisible, callback } = props;
  const {
    fields,
    initialValues = {},
    attr = {},
    card,
    requestDetail,
    params,
    extFields,
    extFieldInfo,
    hideFormCard,
    optionsCallback,
    handleData,
  } = options || {};
  const { hideExtCard, title } = extFieldInfo || {};
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [data, setData] = useState<any>(initialValues);

  const hideModal = useCallback(() => {
    setTimeout(() => {
      setVisible && setVisible(false);
      optionsCallback && optionsCallback();
    }, 500);
  }, [setVisible]);

  const toggleVisible = useCallback(
    (bool: boolean = false) => {
      setModalVisible(bool);
      !bool && hideModal();
    },
    [hideModal],
  );

  useImperativeHandle(props.cRef, () => ({
    open: () => toggleVisible(true),
  }));

  useEffect(() => {
    toggleVisible(visible);
    requestDetail &&
      requestDetail(params).then((res: any) => {
        handleData && handleData(res.data);
        setData(res.data);
      });
  }, [toggleVisible, visible]);

  const submit = async () => {
    const { getDynamicForm, getOptions } = extRef.current || {};
    const extMapForm: any = (await getDynamicForm()) || {};
    const { id } = initialValues;
    const options: any = {
      setSpinning,
      setData,
      callback,
      params: {
        id: id || params?.id,
      },
      getData: cRef.current.getData,
    };
    await getOptions(options);
    await extMapForm.submit();
  };

  if (requestDetail && Object.keys(data).length === 0) return null;

  return (
    <Modal
      centered
      visible={modalVisible}
      onCancel={() => toggleVisible()}
      onOk={submit}
      confirmLoading={spinning}
      width={'60%'}
      title={params?.id ? '编辑' : '添加'}
      {...attr}
    >
      <div className="modal-height">
        <FormComponent
          cRef={cRef}
          card={card}
          hideCard={hideFormCard}
          initialValues={{ ...data }}
          formItem={fields}
        />
        {hideExtCard ? (
          <ExtFrom cRef={extRef} extFields={extFields} data={data} />
        ) : (
          <Card type="inner" title={title || '扩展信息'}>
            <ExtFrom cRef={extRef} extFields={extFields} data={data} />
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default GModal;

import React, { useState, useEffect } from 'react';
import BasicLayout, { MenuDataItem, getMenuData } from '@ant-design/pro-layout';
import { Link, useModel } from 'umi';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import { Avatar, Breadcrumb, Dropdown, Menu, Space, Select, Form } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import storage from '@/utils/storage';
import logo from '@/assets/logo@2x.png';
import headerLogo from '@/assets/headerLogo.jpg';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const { Option } = Select;

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map(item => {
    if (item.children) {
      item.children = menuDataRender(item.children);
    }
    return item.unaccessible ? [] : item;
  });
};

const IBasicLayout = (props: any) => {
  const { loading, setLoading } = useModel('useLoading', model => ({
    loading: model.loading,
    setLoading: model.setLoading,
  }));

  const [currentPathConfig, setCurrentPathConfig] = useState<MenuDataItem>({});
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);

  const { breadcrumbMap } = getMenuData(props.routes);

  const returnPlatform = () => {
    window.location.href = window.location.origin;
  };

  const renderBreadcrumbMap = () => {
    const current = breadcrumbMap.get(props?.location?.pathname);
    const keyList = [
      ...(current?.pro_layout_parentKeys || []),
      props.location?.pathname,
    ];
    return (
      <Breadcrumb style={{ lineHeight: 'inherit' }}>
        {keyList.map(t => {
          const data = breadcrumbMap.get(t);
          if (data?.name) {
            return (
              <Breadcrumb.Item key={data?.path}>
                <Link to={data.path || '/'}>{data.name}</Link>
              </Breadcrumb.Item>
            );
          }
        })}
      </Breadcrumb>
    );
  };

  useEffect(() => {
    setLoading(true);
    const { menuData } = transformRoute(
      props?.route?.routes || [],
      undefined,
      undefined,
      true,
    );
    const currentPathConfig = getMatchMenu(
      props.location.pathname,
      menuData,
    ).pop();
    setSelectedKeys([
      (currentPathConfig &&
        (currentPathConfig.selectedParentKey
          ? currentPathConfig.selectedParentKey
          : currentPathConfig.path)) ||
        '',
    ]);
    setCurrentPathConfig(currentPathConfig || {});
    setLoading(false);
  }, [props.location.pathname]);

  return (
    <>
      <BasicLayout
        menuDataRender={menuDataRender}
        fixedHeader={true}
        logo={logo}
        style={{ height: '100vh' }}
        route={props.route}
        title={'流向管理'}
        loading={loading}
        menuProps={{
          selectedKeys,
        }}
        location={props.location?.pathname}
        breadcrumbRender={routers => {
          return routers;
        }}
        headerContentRender={() => {
          return renderBreadcrumbMap();
        }}
        rightContentRender={() => {
          return (
            /*<div>
              <Avatar icon={<UserOutlined />} />
            </div>*/
            <Space size="large">
              <Form {...formLayout} style={{ width: '150px' }}>
                <Select
                  showSearch
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  defaultValue={storage.get('defaultPeriod')}
                  onChange={value => {
                    storage.set('defaultPeriod', value);
                  }}
                >
                  {(storage.get('periods') || []).map((res: any) => (
                    <Option value={res.value}>{res.label}</Option>
                  ))}
                </Select>
              </Form>
              <p style={{ margin: 0 }}>
                {storage.get('userInfo') && storage.get('userInfo').tenantName}
              </p>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <div onClick={returnPlatform}>返回平台</div>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Space>
                  <Avatar
                    // src={
                    //   storage.get('userInfo') && storage.get('userInfo').icon
                    // }
                    src={headerLogo}
                  />
                  <span>
                    {(storage.get('userInfo') &&
                      storage.get('userInfo').name) ||
                      ''}
                  </span>
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Space>
          );
        }}
        headerTheme={'light'}
        // location={props?.location?.pathname}
        itemRender={route => {
          return (
            <Link to={route.path.replace(window?.routerBase || '', '')}>
              {route.breadcrumbName}
            </Link>
          );
        }}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }
          if (menuItemProps.path) {
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }
          return defaultDom;
        }}
      >
        <div style={{ height: 'calc(100vh - 96px)', overflow: 'auto' }}>
          {props.children}
        </div>
      </BasicLayout>
    </>
  );
};

export default IBasicLayout;

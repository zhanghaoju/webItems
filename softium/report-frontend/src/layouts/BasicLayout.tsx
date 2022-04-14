import React, { useState, useEffect } from 'react';
import BasicLayout, { getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import { Avatar, Breadcrumb, Dropdown, Menu, Space } from 'antd';
import { Link, useModel, useIntl } from 'umi';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import logo from '@/assets/logo@2x.png';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import storage from '@/utils/storage';

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map(item => {
    if (item.children) {
      item.children = menuDataRender(item.children);
    }
    return item.unaccessible ? [] : item;
  });
};

const IBasicLayout = (props: any) => {
  const intl = useIntl();
  const { loading, setLoading } = useModel('useLoading', model => ({
    loading: model.loading,
    setLoading: model.setLoading,
  }));

  const returnPlatform = () => {
    window.location.href = window.location.origin;
  };

  const [currentPathConfig, setCurrentPathConfig] = useState<MenuDataItem>({});
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);

  const { breadcrumbMap } = getMenuData(props.routes);

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
        route={props.route}
        fixedHeader={true}
        style={{ minHeight: '100vh' }}
        title={'销量地图'}
        menuDataRender={menuDataRender}
        loading={loading}
        menuProps={{
          selectedKeys,
        }}
        logo={logo}
        location={props.location?.pathname}
        breadcrumbRender={routers => {
          return routers;
        }}
        headerContentRender={() => {
          return renderBreadcrumbMap();
        }}
        rightContentRender={() => {
          return (
            <Space size="large">
              <p style={{ margin: 0 }}>
                {(storage.get('userInfo') &&
                  storage.get('userInfo').tenantName) ||
                  ''}
              </p>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <div onClick={returnPlatform}>返回平台</div>
                    </Menu.Item>
                    {/*<Menu.Item>*/}
                    {/*  <div onClick={exit}>退出</div>*/}
                    {/*</Menu.Item>*/}
                  </Menu>
                }
              >
                <Space>
                  <Avatar
                    src={
                      (storage.get('userInfo') &&
                        storage.get('userInfo').icon) ||
                      require('@/assets/avatar.jpg')
                    }
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
        // subMenuItemRender={renderMenuItem}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }
          if (menuItemProps.path) {
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }
          return defaultDom;
        }}
        pure={false}
      >
        <div style={{ height: 'calc(100vh - 96px)', overflow: 'auto' }}>
          {props.children}
        </div>
      </BasicLayout>
    </>
  );
};

export default IBasicLayout;

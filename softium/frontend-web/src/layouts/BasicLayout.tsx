import React, { useState, useEffect } from 'react';
// @ts-ignore
import BasicLayout, { MenuDataItem, getMenuData } from '@ant-design/pro-layout';
import { Avatar, Breadcrumb, Dropdown, Menu, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link, useModel, useIntl } from 'umi';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import storage from '@/utils/storge';
import logo from '@/assets/logo.png';
import userAvatar from '@/assets/userAvatar.png';

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

  const [currentPathConfig, setCurrentPathConfig] = useState<MenuDataItem>({});
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);

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
        (currentPathConfig.associatedHighLight || currentPathConfig.path)) ||
        '',
    ]);
    setCurrentPathConfig(currentPathConfig || {});
    setLoading(false);
  }, [props.location.pathname]);

  const returnPlatform = () => {
    window.location.href = window.location.origin;
  };

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
          if (data?.breadcrumb) {
            const idIndex = (data.path || '').indexOf(':id');
            let path = data.path;
            if (idIndex > -1) {
              const slicePath = data.path?.slice(0, idIndex);
              const locationPath = props.location?.pathname
                .replace(slicePath, '')
                .split('/');
              const prevId = locationPath[0] || '';
              path = path?.replace(':id', prevId);
            }
            return (
              <Breadcrumb.Item key={path}>
                <Link to={path || '/'}>{data.breadcrumb}</Link>
              </Breadcrumb.Item>
            );
          }
        })}
      </Breadcrumb>
    );
  };

  return (
    <>
      <BasicLayout
        logo={logo}
        route={props.route}
        style={{ minHeight: '100vh' }}
        title={'企业主数据'}
        fixedHeader={true}
        menuDataRender={menuDataRender}
        loading={loading}
        location={{ pathname: '/institution/agent' }}
        menuProps={{
          selectedKeys,
        }}
        formatMessage={intl && intl.formatMessage}
        headerContentRender={() => {
          return renderBreadcrumbMap();
        }}
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
        rightContentRender={() => (
          <Space size="large">
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
                <Avatar src={userAvatar} />
                <span>
                  {(storage.get('userInfo') && storage.get('userInfo').name) ||
                    ''}
                </span>
                <DownOutlined />
              </Space>
            </Dropdown>
          </Space>
        )}
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

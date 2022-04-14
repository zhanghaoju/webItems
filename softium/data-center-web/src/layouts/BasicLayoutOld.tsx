import React, { useState, useEffect } from 'react';
import BasicLayout, {
  DefaultFooter,
  MenuDataItem,
} from '@ant-design/pro-layout';
import { Avatar, Dropdown, Menu, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link, useModel, useIntl, history } from 'umi';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import moment from 'moment';
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

  const renderMenuItem = (menuItemProps: MenuDataItem): React.ReactNode => {
    const icon = menuItemProps.icon;
    const text =
      (menuItemProps &&
        menuItemProps.locale &&
        intl.formatMessage({ id: `${menuItemProps.locale}` })) ||
      menuItemProps.name;
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path)
      return (
        <>
          {icon}
          {text}
        </>
      );
    if (menuItemProps.path)
      return (
        <Link to={menuItemProps.path}>
          {icon}
          {text}
        </Link>
      );
  };

  const exit = () => {
    history.replace('/login');
  };

  const returnPlatform = () => {};

  return (
    <>
      <BasicLayout
        route={props.route}
        style={{ minHeight: '100vh' }}
        title={'数据中心'}
        menuDataRender={menuDataRender}
        loading={loading}
        menuProps={{
          selectedKeys,
        }}
        formatMessage={intl && intl.formatMessage}
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
        rightContentRender={() => (
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
              <Avatar src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />
              <span>
                {(storage.get('userInfo') && storage.get('userInfo').name) ||
                  ''}
              </span>
              <DownOutlined />
            </Space>
          </Dropdown>
        )}
        pure={false}
        footerRender={() => (
          <DefaultFooter
            copyright={`${moment().format('YYYY')} 软素科技有限公司`}
            links={[]}
          />
        )}
      >
        {props.children}
      </BasicLayout>
    </>
  );
};

export default IBasicLayout;

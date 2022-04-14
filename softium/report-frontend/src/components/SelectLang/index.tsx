import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { getLocale, setLocale } from 'umi';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { MenuInfo } from 'rc-menu/es/interface';
// import { getAllLocales } from '@/services/global';

interface SelectLangProps {
  className?: string;
}
export interface Locale {
  id?: string;
  appId?: string;
  locale?: string;
  name?: string;
}

const SelectLang: React.FC<SelectLangProps> = props => {
  const [locales, setLocales] = useState<Locale[]>([]);
  const { className } = props;
  const selectedLang = getLocale();
  const changeLang = ({ key }: MenuInfo): void => setLocale(key as string);

  // useEffect(() => {
  //   getAllLocales()
  //     .then(res => {
  //       setLocales(res.data);
  //     })
  //     .catch(err => {
  //       setLocales([]);
  //     });
  // }, []);
  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[selectedLang]}
      onClick={changeLang}
    >
      {(Array.isArray(locales) ? locales : []).map(locale => {
        return <Menu.Item key={locale.locale}>{locale.name}</Menu.Item>;
      })}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title="语言" />
      </span>
    </HeaderDropdown>
  );
};

// export default SelectLang;

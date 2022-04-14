import React from 'react';
import ReactDOM from 'react-dom';

import 'antd-mobile/dist/antd-mobile.css'
// 导入字体图标库样式文件
import './assets/fonts/iconfont.css'
import './index.css';
import 'react-virtualized/styles.css'
/*将组件的导入放在样式导入的后面，从而避免样式覆盖的问题*/
import App from './App';

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

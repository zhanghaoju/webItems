import React from "react";
// 导入要使用的组件
import {Button} from "antd-mobile";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";

// 导入首页和城市选择两个组件(页面)
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from './pages/map'

function App() {
	return (
		<Router>
			<div className="App">
				{/*配置导航菜单*/}
				{/*<ul>
				 <li>
				 <Link to="/home">首页</Link>
				 </li>
				 <li>
				 <Link to="/citylist">城市选择</Link>
				 </li>
				 </ul>*/}
				{/*配置路由*/}
				<Route path="/home" component={Home} />
				<Route path="/citylist" component={CityList} />
				{/*默认路由 匹配时跳转到/home实现路由重定向*/}
				<Route exact path="/" render={() =>
					<Redirect to="/home" />} />
				<Route path="/map" component={Map} />
			</div>
		</Router>
	);
}
export default App;

import React, {Component} from "react";

// 导入路由
import {Redirect, Route} from "react-router-dom";
// 导入TabBar
import {TabBar} from 'antd-mobile';
// 导入组件自己的样式文件
import './index.css'
// 导入News组件
import News from "../News";
import Index from "../Index";
import HouseList from '../HouseList'
import Profile from '../Profile'

// TabBar数据
const tabItems = [
	{
		title: "首页",
		icon: 'icon-ind',
		path: '/home'
	},
	{
		title: "找房",
		icon: 'icon-findHouse',
		path: '/home/list'
	},
	{
		title: "资讯",
		icon: 'icon-infom',
		path: '/home/news'
	},
	{
		title: "我的",
		icon: 'icon-my',
		path: '/home/profile'
	},
]
/*点击首页导航菜单，导航到找房列表页面时，菜单未高亮
 * 原因：原来我们实现该功能的时候，只考虑点击以及第一次加载home组件的情况，但是我们没有考虑不重新加载Home组件时的路由切换，因为这种情况没有覆盖
 * 解决方案：在路由切换的时候执行菜单高亮的逻辑代码
 * 	1. 添加compoentDidUpdate钩子函数
 * 	2. 在钩子函数中判断路由地址是否切换(路由的信息是通过props传递给组件的，通过比较更新前后的两个Props)
 * 	3. 在路由地址切换时，让菜单高亮
 * */
export default class Home extends Component {
	state = {
		// 默认选中的TabBar菜单项
		selectedTab: this.props.location.pathname,
	};
	componentDidUpdate(prevProps, prevState, snapshot) {
		/*console.log('componentDidUpdate')*/
		/*console.log('上一次路由信息：', prevProps)
		console.log('上一次路由信息：', this.props)*/
		if (prevProps.location.pathname !== this.props.location.pathname) {
			// 此时说明路由发生切换了
			this.setState({
				selectedTab: this.props.location.pathname
			})
		}
	}
	// 渲染TabBar.Item方法
	renderTabBarItem() {
		// 通过遍历的方式
		return tabItems.map((item) =>
			<TabBar.Item
				title={item.title}
				key={item.title}
				icon={
					<i className={`iconfont ${item.icon}`} />
				}
				selectedIcon={
					<i className={`iconfont ${item.icon}`} />
				}
				selected={this.state.selectedTab === item.path}
				// 徽章
				/*	badge={1}*/
				onPress={() => {
					this.setState({
						selectedTab: item.path,
					});
					// 路由切换
					this.props.history.push(item.path)
				}}
			/>)
	}
	render() {
		console.log(this.props.location.pathname)
		return (
			<div className="home">
				{/*首页 渲染子路由 component要展示的组件*/}
				<Route exact path="/home" component={Index} />
				<Route path="/home/list" component={HouseList} />
				<Route path="/home/news" component={News} />
				<Route path="/home/profile" component={Profile} />
				<TabBar
					unselectedTintColor="#949494"
					tintColor="#21b97a"
					barTintColor="white"
					// 设置不渲染内容
					noRenderContent={true}
				>
					{this.renderTabBarItem()}
				</TabBar>
			</div>)
	}
	// 渲染TabBar.Item内容
	renderContent(pageText) {
		return (
			<div style={{
				backgroundColor: 'white',
				height: '100%',
				textAlign: 'center'
			}}>
				<div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
				<a style={{
					display: 'block',
					marginTop: 40,
					marginBottom: 20,
					color: '#108ee9'
				}}
					 onClick={(e) => {
						 e.preventDefault();
						 this.setState({
							 hidden: !this.state.hidden,
						 });
					 }}
				>
					Click to show/hide tab-bar
				</a>
				<a style={{
					display: 'block',
					marginBottom: 600,
					color: '#108ee9'
				}}
					 onClick={(e) => {
						 e.preventDefault();
						 this.setState({
							 fullScreen: !this.state.fullScreen,
						 });
					 }}
				>
					Click to switch fullscreen
				</a>
			</div>
		);
	}
}

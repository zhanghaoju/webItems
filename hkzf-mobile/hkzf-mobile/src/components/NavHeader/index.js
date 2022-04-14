import React from "react";
import {NavBar} from "antd-mobile";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types'
import './index.scss'
import style from './index.module.css'
/*
 *  注意：默认情况下只有路由Route直接渲染的组件才能够获取到路由信息(比如：history.go()等)
 * 如果需要在其他组件中获取到路由信息可以通过withRouter高阶组件来获取
 *	1. 从react-router-dom 中导入withRouter高阶组件
 * 2. 使用withRouter高阶组件包装NavHeader组件：目的是包装后就可以在组件中获取到当前路由信息了
 * 3. 从props中解构出history对象
 * 4. 调用history.go()实现返回上一页功能
 * 5. 从props中解构出onlLeftClick函数，实现自定义<按钮点击事件
 * */

function NavHeader({
	children,
	history,
	onLeftClick
}) {
	// 默认点击行为
	const defaultHandler = () => history.go(-1)
	/*console.log(history)*/
	return (
		/*顶部导航栏*/
		<NavBar
			className={style.navBar}
			mode="light"
			icon={
				<i className="iconfont icon-back"></i>
			}
			onLeftClick={onLeftClick || defaultHandler}
		>
			{children}
		</NavBar>
	)
}

// 添加props校验
NavHeader.propTypes={
	children:PropTypes.string.isRequired,
	onLeftClick:PropTypes.func
}
// withRouter(NavHeader)函数的返回值也是一个组件
export default withRouter(NavHeader)

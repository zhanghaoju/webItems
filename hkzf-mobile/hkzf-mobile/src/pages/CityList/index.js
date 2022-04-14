import React, {Component} from "react";
import {Toast} from 'antd-mobile';
import './index.scss'
import axios from "axios";
// 导入utils中获取当前定位成功的访达
import {getCurrentCity} from "../../utils";
// 导入react-virtualized中list组件
import {List, AutoSizer} from "react-virtualized";
import NavHeader from "../../components/NavHeader";

import styles from './index.module.css'

/*console.log(styles)*/
/*// 列表数据源
 const list = Array(100).fill('react')*/
// 索引(A B等)的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
// 数据格式化的方法 list 数组
const formatCityData = (list) => {
	const cityList = {}
	/*const cityIndex = []*/
	// 1.遍历list数组
	list.forEach(item => {
		// 2.获取城市首字母
		const first = item.short.substr(0, 1);
		/*		console.log(first)*/
		// 3.判断citylist中是否有该分类
		if (cityList[first]) {
			// 4.如果有，直接往该分类中Push数据
			cityList[first].push(item)
		} else {
			// 5.如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
			cityList[first] = [item]
		}
	})
	// 获取索引数据
	const cityIndex = Object.keys(cityList).sort()
	/*console.log(cityIndex)*/
	return {
		cityList,
		cityIndex
	}
}
export default class CityList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cityList: {},
			cityIndex: [],
			// 指定右侧索引高亮的列表项
			activeIndex: 0
		}
		// 创建ref对象
		this.cityListComponent = React.createRef()
	}
	
	async componentDidMount() {
		await this.getCityList()
		// 调用measureAllRows，提前计算List中每一行的高度，实现scrollToRow的精确跳转
		// 调用方法的时候需要保证List组件中已经有数据了，如果为空就会调用错误
		// 解决：保证这个方法是在获取到数据之后调用
		this.cityListComponent.current.measureAllRows()
	}
	// 获取城市列表数据的方法
	async getCityList() {
		const res = await axios.get('http://localhost:8080/area/city?level=1')
		/*console.log('城市列表数据：', res)*/
		const {
			cityList,
			cityIndex
		} = formatCityData(res.data.body)
		/*console.log(cityList, cityIndex)*/
		// 1.获取热门城市数据
		// 2.将数据添加到cityList中
		// 3.将索引添加到cityIndex中
		const hotRes = await axios.get('http://localhost:8080/area/hot')
		/*console.log('热门城市列表数据：', hotRes)*/
		// 添加一个hot到列表中
		cityList['hot'] = hotRes.data.body
		// 将索引添加到cityIndex中
		cityIndex.unshift('hot')
		// 获取当前定位城市
		const curCity = await getCurrentCity()
		/*
		 *  1. 将当前定位城市数据添加到cityList中
		 *  2. 将当前定位城市的索引添加到cityIndex中
		 * */
		// 键 # 值 [curCity]
		cityList['#'] = [curCity]
		cityIndex.unshift('#')
	/*	console.log(cityList, cityIndex, curCity)*/
		this.setState({
			cityList,
			cityIndex
		})
	}
	// 切换城市 给当前城市添加点击事件
	changeCity({
		label,
		value
	}) {
		if (HOUSE_CITY.indexOf(label) > -1) {
			// 如果有 存储到本地存储中
			localStorage.setItem('hkzf_city', JSON.stringify({
				label,
				value
			}))
			this.props.history.go(-1)
		} else {
			// 如果没有房源信息
			Toast.info('该城市暂无房源信息', 2, null, false)
		}
	}
	
	// 渲染每一行数据的渲染函数 函数的返回值表示最终渲染到页面中的内容
	rowRenderer = ({
		key, // Unique key within array of rows
		index, // 索引号
		isScrolling, // 是否滚动中
		isVisible, // 这一行在list中是可见的
		style, // 样式 作用：指定每一行的位置
	}) => {
		// 获取每一行的字母索引
		/*console.log(this)*/
		const {
			cityIndex,
			cityList
		} = this.state
		/*console.log(cityIndex)*/
		const letter = cityIndex[index]
	/*	console.log(letter)*/
		// 封装处理字母索引方法
		const formatCityIndex = (letter) => {
			switch (letter) {
				case '#':
					return '当前定位'
				case 'hot':
					return '热门城市'
				default:
					return letter.toUpperCase()
					break;
			}
		}
		// 获取指定字母索引下的城市列表数据
	/*	console.log(cityList[letter])*/
		return (
			<div key={key} style={style} className="city">
				<div className="title">{formatCityIndex(letter)}</div>
				<div className="name">
					{
						cityList[letter].map(item =>
							<div className="name" key={item.value} onClick={() => this.changeCity(item)}>{item.label}</div>)
					}
				</div>
			</div>
		);
	}
	// 创建动态计算每一行高度的方法
	getRowHeight = ({ index }) => {
		// 索引标题高度+城市数量*城市名称的高度
		// TITLE_HEIGHT+cityList[cityIndex[index]].length*NAME_HEIGHT
		const {
			cityList,
			cityIndex
		} = this.state;
		return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
		/*	console.log(index)
		 return 100*/
	}
	// 渲染右侧索引列表的方法
	renderCityIndex() {
		const {
			activeIndex,
			cityIndex
		} = this.state;
		// 获取到cityIndex 遍历并渲染
		return cityIndex.map((item, index) =>
			<li className="city-index-item" key={item} onClick={() => {
				/*console.log('当前索引号：', index)*/
				this.cityListComponent.current.scrollToRow(index)
			}}>
				<span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
			</li>)
	}
	// 用于获取List组件中渲染行的信息
	onRowsRendered = ({ startIndex }) => {
		/*console.log('startIndex:', startIndex)*/
		if (this.state.activeIndex !== startIndex) {
			this.setState({
				activeIndex: startIndex
			})
		}
	}
	render() {
		return (
			<div className="citylist">
				{/*顶部导航栏*/}
				<NavHeader>城市选择</NavHeader>
				{/*城市列表*/}
				<AutoSizer>
					{
						(
							{
								width,
								height
							}
						) =>
							<List
								width={width}
								height={height}
								rowCount={this.state.cityIndex.length}
								rowHeight={this.getRowHeight} // 动态的计算每一行高度
								rowRenderer={this.rowRenderer}
								onRowsRendered={this.onRowsRendered}
								ref={this.cityListComponent}
								scrollToAlignment="start"
							/>
					}
				</AutoSizer>
				{/*右侧索引列表*/}
				<ul className="city-index">
					{this.renderCityIndex()}
				</ul>
			{/*<div className={styles.test}>测试样式覆盖问题</div>*/}
			</div>
		)
	}
}

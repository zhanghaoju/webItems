import React, {Component} from "react";
import {Carousel, Flex, Grid, WingBlank} from 'antd-mobile';
import axios from "axios";
import './index.scss'
import {getCurrentCity} from "../../utils";
// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导航菜单数据
const navs = [
	{
		id: 1,
		img: Nav1,
		title: '整租',
		path: '/home/list'
	},
	{
		id: 2,
		img: Nav2,
		title: '合租',
		path: '/home/list'
	},
	{
		id: 3,
		img: Nav3,
		title: '地图找房',
		path: '/home/map'
	},
	{
		id: 4,
		img: Nav4,
		title: '出租',
		path: '/home/map'
	},
]
/*轮播图存在的问题：1. 不会自动播放，2.从其他路由返回的时候，高度不够
 * 原因：轮播图数据是动态加载，加载完成前后轮播图数量不一致
 * 解决方案：在state中添加表示轮播图加载完成的数据，在轮播图数据加载完成时，修改该数据状态值为true,只有在轮播图数据加载完成的情况，才渲染轮播图组件
 * */
// 获取地理位置信息
navigator.geolocation.getCurrentPosition(position => {
	/*console.log('当前位置信息：', position)*/
})
export default class Index extends Component {
	state = {
		// 轮播图状态数据
		swipers: [],
		isSwiperLoaded: false,
		// 租房小组数据
		groups: [],
		// 资讯
		news: [],
		// 当前城市名称
		curCityName: '上海'
	}
	// 获取轮播图数据的方法
	async getSwipers() {
		const res = await axios.get('http://localhost:8080/home/swiper')
		/*console.log('轮播图数据为：', res)*/
		this.setState(() => {
			return {
				swipers: res.data.body,
				isSwiperLoaded: true
			}
		})
	}
	// 获取租房小组数据方法
	async getGroups() {
		const res = await axios.get('http://localhost:8080/home/groups', {
			params: {
				area: 'AREA%7C88cff55c-aaa4-e2e0'
			}
		})
		/*console.log(res)*/
		// 更新状态
		this.setState({
			groups: res.data.body
		})
	}
	// 获取资讯信息
	async getNews() {
		const news = await axios.get('http://localhost:8080/home/news', {
			params: {
				area: 'AREA%7C88cff55c-aaa4-e2e0'
			}
		})
		/*console.log(news)*/
		this.setState({
			news: news.data.body
		})
	}
	
	async componentDidMount() {
		this.getSwipers()
		this.getGroups()
		this.getNews()
		// 通过IP定位获取到当前城市名称
		/*const curCity = new window.BMap.LocalCity()
		 curCity.get(async res => {
		 /!*console.log('当前城市信息：', res)*!/
		 const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
		 /!*console.log(result)*!/
		 this.setState({
		 curCityName: result.data.body.label
		 })
		 })*/
		const curCity = await getCurrentCity()
		this.setState({
			curCityName: curCity.label
		})
		
		
	}
	// 渲染轮播图结构
	renderSwipers() {
		return this.state.swipers.map(item => (
			<a
				key={item.id}
				href="http://itcast.cn"
				style={{
					display: 'inline-block',
					width: '100%',
					height: 212
				}}
			>
				<img
					src={`http://localhost:8080${item.imgSrc}`}
					alt=""
					style={{
						width: '100%',
						verticalAlign: 'top'
					}}
				/>
			</a>
		))
	}
	// 渲染导航菜单
	renderNavs() {
		return navs.map(item =>
			<Flex.Item key={item.id}>
				<img src={item.img} alt="" onClick={() => this.props.history.push(item.path)} />
				<h2>{item.title}</h2>
			</Flex.Item>)
	}
	// 渲染新闻资讯
	renderNews() {
		return this.state.news.map(item => (
			<div className="news-item" key={item.id}>
				<div className="imgwrap">
					<img
						className="img"
						src={`http://localhost:8080${item.imgSrc}`}
						alt=""
					/>
				</div>
				<Flex className="content" direction="column" justify="between">
					<h3 className="title">{item.title}</h3>
					<Flex className="info" justify="between">
						<span>{item.from}</span>
						<span>{item.date}</span>
					</Flex>
				</Flex>
			</div>
		))
	}
	render() {
		return (
			<div className="index">
				{/*轮播图*/}
				<div className="swiper">
					{
						this.state.isSwiperLoaded ?
							<Carousel
								autoplay
								infinite
								autoplayInterval={2000}
							>
								{this.renderSwipers()}
							</Carousel> : ''
					}
					{/*搜索框*/}
					<Flex className="search-box">
						{/* 左侧白色区域 */}
						<Flex className="search">
							{/* 位置 */}
							<div
								className="location"
								onClick={() => this.props.history.push('/citylist')}
							>
								<span className="name">{this.state.curCityName}</span>
								<i className="iconfont icon-arrow" />
							</div>
							
							{/* 搜索表单 */}
							<div
								className="form"
								onClick={() => this.props.history.push('/search')}
							>
								<i className="iconfont icon-seach" />
								<span className="text">请输入小区或地址</span>
							</div>
						</Flex>
						{/* 右侧地图图标 */}
						<i
							className="iconfont icon-map"
							onClick={() => this.props.history.push('/map')}
						/>
					</Flex>
					{/*导航菜单*/}
					<Flex className="nav">
						<Flex.Item
							key="1"
							/*onClick={() => this.props.history.push(item.path)}*/
						>
							<img src="" alt="" />
							{/*<h2>测试</h2>*/}
						</Flex.Item>
					</Flex>
				</div>
				{/*租房小组*/}
				<div className="group">
					<h3 className="group-title">
						租房小组 <span className="more">更多</span>
						{/*宫格组件*/}
						<Grid data={this.state.groups} square={false} hasLine={false} activeStyle={true} columnNum={2} renderItem={(item) => (
							<Flex className="group-item" justify="around" key={item.id}>
								<div className="desc">
									<p className="title">
										{item.title}
									</p>
									<span className="info">
										{item.desc}
									</span>
									<img src={`http://localhost:8080${item.imgSrc}`} alt="" />
								</div>
							</Flex>
						)} />
					</h3>
				</div>
				<div className="news">
					<h3 className="group-title">最新资讯</h3>
					<WingBlank size="md">{this.renderNews()}</WingBlank>
				</div>
			</div>
		);
	}
}

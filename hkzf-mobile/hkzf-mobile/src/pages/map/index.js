import React, {Component} from "react";
/*import './index.scss'*/
import NavHeader from "../../components/NavHeader";
import styles from './index.module.css'
import axios from "axios";
import {Link} from "react-router-dom";
import {Toast} from 'antd-mobile'
// 解决脚手架中全局变量
const BMap = window.BMap
export default class Map extends Component {
	state = {
		// 小区下的房源列表
		housesList: [],
		isShowList: false
	}
	componentDidMount() {
		this.initMap()
	}
	initMap() {
		// 获取当前定位城市
		const {
			label,
			value
		} = JSON.parse(localStorage.getItem('hkzf_city'))
		console.log(label, value)
		// 初始化地图 在react脚手架中全局对象需要使用window来访问，否则会造成ESLint校验
		const map = new window.BMap.Map("container");
		// 作用：能够在其他方法中通过this来获取地图对象
		this.map = map
		// 设置中心点坐标
		/*const point = new window.BMap.Point(116.404, 39.915);*/
		//创建地址解析器实例
		const myGeo = new BMap.Geocoder();
		
		// 将地址解析结果显示在地图上，并调整地图视野
		myGeo.getPoint(label, async point => {
			const scaleCtrl = new BMap.ScaleControl();  // 添加比例尺控件
			const zoomCtrl = new BMap.NavigationControl();  // 添加缩放控件
			if (point) {
				map.centerAndZoom(point, 11);
				/*map.addOverlay(new BMap.Marker(point))*/
				// 添加控件
				map.addControl(scaleCtrl);
				map.addControl(zoomCtrl);
				// 调用renderOverlays方法
				this.renderOverlays(value)
				// 获取房源信息
				/*				const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
				 console.log('房源数据', res)
				 res.data.body.forEach(item => {
				 // 为每一条数据创建覆盖物
				 const {
				 coord: {
				 longitude,
				 latitude
				 },
				 label: areaName,
				 count,
				 value
				 } = item
				 const areaPoint = new BMap.Point(longitude, latitude)
				 // 创建文本覆盖物
				 const label = new BMap.Label('', {
				 position: areaPoint,
				 offset: new BMap.Size(-35, -35)
				 })
				 // 给label对象添加一个唯一标识
				 label.id = value
				 // 设置房源覆盖物内容
				 label.setContent(
				 `<div class="${styles.bubble}">
				 <p class="${styles.name}">${areaName}</p>
				 <p>${count}套</p>
				 </div>`
				 )
				 // 样式
				 label.setStyle({
				 cursor: 'pointer',
				 border: '0px solid rgb(255,0,0)',
				 padding: '0px',
				 whiteSpace: 'nowrap',
				 fontSize: '12px',
				 color: 'rgb(255,255,255)',
				 textAlign: 'center'
				 })
				 // 添加点击事件
				 label.addEventListener('click', () => {
				 console.log('房源覆盖物被点击了', label.id)
				 // 放大地图，以当前点击的覆盖物为中心放大地图
				 // 第一个参数：坐标对象，第二个参数：放大级别
				 map.centerAndZoom(areaPoint, 13);
				 setTimeout(() => {
				 // 清除当前覆盖物信息
				 map.clearOverlays()
				 }, 0)
				 })
				 // 添加覆盖物到地图中
				 map.addOverlay(label)
				 })*/
			} else {
				alert('您选择的地址没有解析到结果！');
			}
		}, label)
		// 给地图绑定移动事件
		map.addEventListener('movestart', () => {
			console.log('movestart')
			this.setState({
				isShowList: false
			})
		})
	}
	// 渲染覆盖物入口
	async renderOverlays(id) {
		try {
			// 开启Loading
			Toast.loading('加载中...', 0, null, false)
			const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
			// 关闭Loading
			Toast.hide()
			console.log('renderOverlays:', res)
			// 拿到数据
			const data = res.data.body
			// 调用getTypeAndZoom方法获取级别和类型
			const {
				nextZoom,
				type
			} = this.getTypeAndZoom()
			// 遍历数据，创建覆盖物
			data.forEach(item => {
				this.createOverlays(item, nextZoom, type)
			})
		} catch (e) {
			// 关闭Loading
			Toast.hide()
		}
	}
	// 计算要绘制的覆盖物类型和下一个缩放级别
	// 区 -> 11， 范围:>=10<12
	// 区 -> 13， 范围:>=13<14
	// 区 -> 15， 范围:>=14<16
	getTypeAndZoom() {
		// 调用地图的getZoom()获取当前缩放级别
		const zoom = this.map.getZoom()
		let nextZoom,
			type;
		console.log('当前地图缩放级别：', zoom)
		if (zoom >= 10 && zoom < 12) {
			// 区
			// 下一个缩放级别
			nextZoom = 13
			// circle 表示绘制圆形覆盖物
			type = 'circle'
		} else if (zoom >= 12 && zoom < 14) {
			// 镇
			nextZoom = 15
			type = 'circle'
		} else if (zoom >= 14 && zoom < 16) {
			// 小区
			type = 'rect'
		}
		return {
			nextZoom,
			type
		}
	}
	// 创建覆盖物 负责获取数据，数据作为参数具体绘制覆盖物的方法
	createOverlays(data, zoom, type) {
		const {
			coord: {
				longitude,
				latitude
			},
			label: areaName,
			count,
			value
		} = data
		// 创建地图坐标
		const areaPoint = new BMap.Point(longitude, latitude)
		if (type === 'circle') {
			// 区或者镇
			this.createCircle(areaPoint, areaName, count, value, zoom)
		} else {
			// 小区
			this.createRect(areaPoint, areaName, count, value)
		}
	}
	// 创建区、镇覆盖物
	createCircle(point, name, count, id, zoom) {
		// 创建文本覆盖物
		const label = new BMap.Label('', {
			position: point,
			offset: new BMap.Size(-35, -35)
		})
		// 给label对象添加一个唯一标识
		label.id = id
		// 设置房源覆盖物内容
		label.setContent(
			`<div class="${styles.bubble}">
				 <p class="${styles.name}">${name}</p>
				 <p>${count}套</p>
				 </div>`
		)
		// 样式
		label.setStyle({
			cursor: 'pointer',
			border: '0px solid rgb(255,0,0)',
			padding: '0px',
			whiteSpace: 'nowrap',
			fontSize: '12px',
			color: 'rgb(255,255,255)',
			textAlign: 'center'
		})
		// 添加点击事件
		label.addEventListener('click', () => {
			console.log('房源覆盖物被点击了', label.id)
			// 调用renderOverlays方法，获取该区域下的房源数据
			this.renderOverlays(id)
			// 放大地图，以当前点击的覆盖物为中心放大地图
			// 第一个参数：坐标对象，第二个参数：放大级别
			this.map.centerAndZoom(point, zoom);
			setTimeout(() => {
				// 清除当前覆盖物信息
				this.map.clearOverlays()
			}, 0)
		})
		// 添加覆盖物到地图中
		this.map.addOverlay(label)
	}
	createRect(point, name, count, id) {
		// 创建文本覆盖物
		const label = new BMap.Label('', {
			position: point,
			offset: new BMap.Size(-50, -28)
		})
		// 给label对象添加一个唯一标识
		label.id = id
		// 设置房源覆盖物内容
		label.setContent(
			`<div class="${styles.rect}">
				<span class="${styles.housename}">${name}</span>
				<span class="${styles.housenum}">${count}</span>
				<i class="${styles.arrow}"></i>
			 </div>`
		)
		// 样式
		label.setStyle({
			cursor: 'pointer',
			border: '0px solid rgb(255,0,0)',
			padding: '0px',
			whiteSpace: 'nowrap',
			fontSize: '12px',
			color: 'rgb(255,255,255)',
			textAlign: 'center'
		})
		// 添加点击事件
		label.addEventListener('click', (e) => {
			this.getHouseList(id)
			console.log('小区被点击了')
			// 获取当前被点击项
			const target = e.changedTouches[0]
			// 拿到地图对象的panBy
			this.map.panBy(
				window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY
			)
			console.log(target)
		})
		// 添加覆盖物到地图中
		this.map.addOverlay(label)
	}
	// 获取小区房源数据
	async getHouseList(id) {
		try {
			// 开启Loading
			Toast.loading('加载中...', 0, null, false)
			const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
			// 关闭Loading
			Toast.hide()
			console.log('小区房源数据：', res)
			this.setState({
				housesList: res.data.body.list,
				// 显示房源列表
				isShowList: true
			})
		} catch (e) {
			// 关闭Loading
			Toast.hide()
		}
		
	}
	// 封装渲染房屋列表的方法
	renderHousesList() {
		return (
			this.state.housesList.map(item => (
				<div className={styles.house} key={item.houseCode}>
					<div className={styles.imgWrap}>
						<img
							className={styles.img}
							src={`http://localhost:8080${item.houseImg}`}
							alt=""
						/>
					</div>
					<div className={styles.content}>
						<h3 className={styles.title}>{item.title}</h3>
						<div className={styles.desc}>{item.desc}</div>
						<div>
							{item.tags.map((tag, index) => {
								const tagClass = 'tag' + (index + 1)
								return (
									<span
										className={[styles.tag, styles[tagClass]].join(' ')}
										key={tag}
									>
							{tag}
								</span>
								)
							})}
						</div>
						<div className={styles.price}>
							<span className={styles.priceNum}>{item.price}</span> 元/月
						</div>
					</div>
				</div>
			))
		)
	}
	render() {
		return <div className={styles.map}>
			{/*顶部导航栏组件*/}
			{/* onLeftClick={() => {
			 console.log('点击了左侧按钮')
			 }
			 }*/}
			{/*<div className={styles.test}>测试样式覆盖map</div>*/}
			<NavHeader>
				地图找房
			</NavHeader>
			{/*地图容器元素*/}
			<div id="container" className={styles.container} />
			{/*房源列表*/}
			{/* 房源列表 */}
			{/* 添加 styles.show 展示房屋列表 */}
			<div
				className={[
					styles.houseList,
					this.state.isShowList ? styles.show : ''
				].join(' ')}
			>
				<div className={styles.titleWrap}>
					<h1 className={styles.listTitle}>房屋列表</h1>
					<Link className={styles.titleMore} to="/home/list">
						更多房源
					</Link>
				</div>
				<div className={styles.houseItems}>
					{/* 房屋结构 */}
					{
						this.renderHousesList()
					}
				</div>
			</div>
		</div>
	}
}

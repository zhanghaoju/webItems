import axios from "axios";

export const getCurrentCity = () => {
	const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
	if (!localCity) {
		// 通过IP定位获取到当前城市名称
		return new Promise((resolve, reject) => {
			const curCity = new window.BMap.LocalCity()
			curCity.get(async res => {
				try {
					/*console.log('当前城市信息：', res)*/
					const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
					// 存储到本地存储中
					localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
					// 返回该城市数据 暴露出去
					resolve(result.data.body)
				} catch (e) {
					// 获取定位城市失败
					reject(e)
				}
			})
		})
	} else {
		// 如果有 返回本地存储数据
		// 注意：因为上面为了处理异步操作，使用了Promise，因此，为了该函数返回值的统一，此处，也应该使用Promise
		// 此处promise不会失败，所以此处直接返回一个成功的Promise即可
		return Promise.resolve(localCity)
	}
}

//index.js
import api from '../../utils/api';
import Storage from '../../utils/storage';
//获取应用实例
const app = getApp()

Page({
	data: {
		banner: '../../assets/img/sofa.jpg',
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function (options) {
		console.log('1111', options.openid)
		console.log('22222', this.data)

		// options.openid = 'oG8Vs5ToBOWjZ6b0gkkrdh0rvtjE'
		if (options.openid) {
			const originalIdStore = Storage.getInstance('originalId', true);
			originalIdStore.set(options.openid)
			console.log('----')
			wx.showLoading({
				title: '页面加载中...',
			})
			api.post('/getUserInfo', {
				openid: options.openid
			}).then(res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}).catch(err => {
				this.showToast('点赞失败，请重试');
			}).finally(() => {
				wx.hideLoading();
			})

			// } else if (this.data.canIUse) {
			// 	// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 	// 所以此处加入 callback 以防止这种情况
			// 	app.userInfoReadyCallback = res => {
			// 		this.setData({
			// 			userInfo: res.userInfo,
			// 			hasUserInfo: true
			// 		})
			// 	}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '我发现一个超棒的沙发定制，定制沙发积赞免费领沙发遮尘布',
			path: '/page/index?openid=123'
		}
	},
	requestPraise: function (e) {
		console.log('dsafd');
		wx.showLoading({
			title: '请求中...',
		})

		const openIdStore = Storage.getInstance('openid', true);
		const originalIdStore = Storage.getInstance('originalId', true);
		const originalId = originalIdStore.get();

		api.post('/praise', {
			originalId: originalId ? originalId : openIdStore.get(),
			openid: openIdStore.get()
		}).then(res => {
			this.showToast('点赞成功');
		}).catch(err => {
			this.showToast('点赞失败，请重试');
		}).finally(() => {
			wx.hideLoading();
		})
	},
	showToast: function (msg) {
		wx.showToast({
			title: msg,
			icon: 'none',
			duration: 2000
		})
	}
})

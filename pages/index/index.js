//index.js
import api, { apiUrl } from '../../utils/api';
import { tokenStore, userIdStore } from '../../utils/store';
//获取应用实例
const app = getApp()

Page({
	data: {
		orderId: '',
		userId: '',
		banner: '../../assets/img/sofa.jpg',
		motto: 'Hello World',
		shareUserInfo: {},
		avatars: [],
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function (options) {
		console.log('1111', options.orderId)
		console.log('22222', this.data)
		const { orderId } = options;

		if (app.globalData.userInfo) {
			this.init(app.globalData.userInfo, orderId);
			console.log(app.globalData.userInfo)
			this.setData({
				shareUserInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					this.init(res.userInfo, orderId);
					this.setData({
						shareUserInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	// 初始化逻辑
	init: function (userInfo, orderId) {
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				api.get(apiUrl.login, {
					jsCode: res.code,
					...userInfo
				}).then(res => {
					tokenStore.set(res.token);
					this.loginCallBack(res.userId, orderId);
					// this.update();
				}).catch(err => {
					console.error(err);
				})
			}
		})
	},
	// 登陆回调
	loginCallBack: function (userId, orderId) {
		this.setData({
			userId
		})

		if (orderId) {
			this.getShareUserInfo();
			this.setData({ orderId });
			this.getLikesAvatar(orderId);
		} else {
			this.createOrder(userId);
		}
	},
	// 获取分享人信息
	getShareUserInfo() {
		wx.showLoading({
			title: '页面加载中...',
		})

		api.post(apiUrl.getShareUserInfo, {
			orderId
		}).then(res => {
			this.setData({
				shareUserInfo: res.shareUserInfo
			})
		}).catch(err => {
			this.showToast('页面加载失败...');
		}).finally(() => {
			wx.hideLoading();
		})
	},
	// 创建订单
	createOrder(userId) {
		api.post(apiUrl.createOrder, {
			userId
		}).then(res => {
			const { orderId } = res;

			this.setData({ orderId })
			this.getLikesAvatar(orderId);
		}).catch(err => {
			console.error(err);
		})
	},
	// 分享
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		api.post(apiUrl.getOrderId, {
			userId: userIdStore.get()
		}).then(res => {
			return {
				title: '我发现一个超棒的沙发定制，定制沙发积赞免费领沙发遮尘布',
				path: `/page/index?orderId=${res.orderId}`
			}
		}).catch(err => {
			console.error(err);
		})
	},
	// 点赞
	requestPraise: function (e) {
		wx.showLoading({
			title: '请求中...',
		})

		api.post(apiUrl.praise, {
			orderId: this.data.orderId,
			userId: this.data.userId
		}).then(res => {
			this.showToast(res.msg);
			// 点赞成功
			if (res.code === 0) {

			} else {

			}
		}).catch(err => {
			this.showToast('点赞失败，请重试');
		}).finally(() => {
			wx.hideLoading();
		})
	},
	// 根据orderid获取点赞人的头像
	getLikesAvatar: function (orderId) {
		api.post(apiUrl.getLikesAvatar, {
			orderId
		}).then(res => {
			this.setData({
				avatars: res.avatars
			})
		}).catch(err => {
			console.error(err);
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

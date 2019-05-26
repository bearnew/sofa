Component({
	data: {
		imgUrls: [
			'http://imgsrc.baidu.com/imgad/pic/item/838ba61ea8d3fd1f36d4a6003b4e251f95ca5f2e.jpg',
			'http://img2.imgtn.bdimg.com/it/u=1767273652,3452916512&fm=26&gp=0.jpg',
			'http://img0.imgtn.bdimg.com/it/u=1355282358,4238062234&fm=11&gp=0.jpg'
		],
		indicatorDots: false,
		current: 2,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		currentSwiper: 0,
	},
	methods: {
		swiperChange: function (e) {
			console.log(e.detail)
			this.setData({
				currentSwiper: e.detail.current
			})
		}
	}
})
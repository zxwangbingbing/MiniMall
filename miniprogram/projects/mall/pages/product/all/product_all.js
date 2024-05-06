const pageHelper = require('../../../../../helper/page_helper.js');
const cacheHelper = require('../../../../../helper/cache_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		query: '',
		isQuery: false,

		curMenu: 'floor',

		scrollLeftCur: 0, //当前项
		scrollRightCur: 0, // 用于实现左边联动右边
		scrollList: [],

		pList: [],
	},


	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (options && options.flag) {
			this.setData({
				curMenu: 'cate'
			});
		}

		this._loadList();
	},

	_loadList: async function (e) {

		let params = {
			floorOptions: projectSetting.FLOOR_OPTIONS
		}
		let opts = {
			title: 'bar'
		};
		await cloudHelper.callCloudSumbit('product/all', params, opts).then(res => {
			console.log(res.data)
			this.setData({
				isLoad: true,
				...res.data,
			}, () => {
				this.setData({
					scrollList: this.data.floorList
				});
			});
		});

	},

	bindSearchConfirm: function (e) {
		let query = this.data.query.trim();
		if (!query) return wx.showToast({
			icon: 'none',
			title: '请输入搜索关键字',
		});

		wx.showLoading({
			title: '搜索中',
		});

		setTimeout(() => {
			wx.hideLoading();
			let pList = [];
			let productList = this.data.productList;
			for (let j = 0; j < productList.length; j++) {
				if (productList[j].PRODUCT_TITLE.toUpperCase().includes(query.toUpperCase()))
					pList.push(productList[j]);
			}

			this.setData({
				pList,
				curMenu: '',
				scrollLeftCur: 0,
				scrollRightCur: 0,
				isQuery: true,
			});
		}, 1000);


	},

	bindClearSearchTap: function (e) {
		this.setData({
			isQuery: false,
			curMenu: 'floor',
			query: '',
			pList: []
		});
	},

	bindMenuTap: function (e) {
		let curMenu = pageHelper.dataset(e, 'menu');
		this.setData({
			isQuery: false,
			pList: [],
			query: '',
			curMenu,
			scrollLeftCur: 0,
			scrollRightCur: 0,
			scrollList: this.data[curMenu + 'List']
		});

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
	},

	onPullDownRefresh: async function () {
		await this._loadList();
		wx.stopPullDownRefresh();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
 * 用户点击右上角分享
 */
	onShareAppMessage: function () {

	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSelectTap(e) {
		this.setData({
			isQuery: false,
			scrollLeftCur: e.currentTarget.id,
			scrollRightCur: e.currentTarget.id,
		});

		cacheHelper.set('left', 'left', 2);
	},

	bindScroll(e) {

		if (cacheHelper.get('left')) return;

		let list = this.data.scrollList;
		let itemHeight = 0;
		for (let i = 0; i < list.length; i++) {
			//拿到每个元素
			let node = wx.createSelectorQuery().select("#scroll-" + i);
			node.fields({
				size: true
			}, function (res) {
				list[i].top = itemHeight;
				itemHeight += res.height;
				list[i].bottom = itemHeight;
			}).exec();
		}

		// 拿到滚动的高度
		let scrollTop = e.detail.scrollTop;
		for (let i = 0; i < list.length; i++) {
			if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
				this.setData({
					scrollLeftCur: i,
				})
				return false
			}
		}
	}
})

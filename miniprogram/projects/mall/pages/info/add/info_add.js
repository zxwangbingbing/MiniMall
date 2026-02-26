const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const InfoBiz = require('../../../biz/info_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (!await PassportBiz.loginMustBackWin(this)) return;

		await this._loadDetail();
	},

	_loadDetail: async function (e) {

		this.setData(InfoBiz.initFormData());

		this.setData({
			isLoad: true,

		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

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
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},


	bindSubmitTap: async function (e) {
		try {
			let data = this.data;

			// 数据校验   
			data = validate.check(data, InfoBiz.CHECK_FORM, this);
			if (!data) return;

			let forms = this.selectComponent("#cmpt-form").getForms(true);
			if (!forms) return;
			data.forms = forms;
			data.cateName = InfoBiz.getCateName(data.cateId);

			let opts = {
				title: '提交中'
			}
			await cloudHelper.callCloudSumbit('info/insert', data, opts).then(result => {
				let callback = () => {
					wx.navigateBack();
				}
				pageHelper.showModal('提交成功，请在 `个人中心-我的投诉与建议` 查看', '温馨提示', callback);
			});
		} catch (err) {
			console.error(err);
		}
	},

	url: function (e) {
		pageHelper.url(e, this);
	}
})
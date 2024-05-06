/**
 * Notes: 活动模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const InfoService = require('../service/info_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class InfoController extends BaseProjectController {

	/** 浏览详细 */
	async getMyInfoDetail() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new InfoService();
		let info = await service.getMyInfoDetail(this._userId, input.id);

		if (info) {

		}

		return info;
	}

	async insertInfo() {

		// 数据校验 
		let rules = {
			cateId: 'must|id|name=分类',
			cateName: 'must|string|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);


		let service = new InfoService();
		let result = await service.insertInfo(this._userId, input);


		return result;

	}

	async editInfo() {

		let rules = {
			id: 'must|id',
			cateId: 'must|id|name=分类',
			cateName: 'must|string|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new InfoService();
		let result = service.editInfo(this._userId, input);


		return result;
	}

	async getMyInfoList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new InfoService();
		let result = await service.getMyInfoList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {

			list[k].INFO_ADD_TIME = timeUtil.timestamp2Time(list[k].INFO_ADD_TIME, 'Y-M-D h:m');
		}

		result.list = list;

		return result;

	}

	/** 取消*/
	async dellMyInfo() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new InfoService();
		return await service.delMyInfo(this._userId, input.id);
	}

}

module.exports = InfoController;
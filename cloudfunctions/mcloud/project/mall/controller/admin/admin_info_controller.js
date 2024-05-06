/**
 * Notes: 活动模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js'); 
const AdminInfoService = require('../../service/admin/admin_info_service.js');  
const timeUtil = require('../../../../framework/utils/time_util.js'); 

class AdminInfoController extends BaseProjectAdminController {


	/** 置顶与排序设定 */
	async sortInfo() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();
		await service.sortInfo(input.id, input.sort);
	} 

	/** 状态修改 */
	async statusInfo() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();
		return await service.statusInfo(input.id, input.status);

	}

	/** 列表 */
	async getAdminInfoList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let adminService = new AdminInfoService();
		let result = await adminService.getAdminInfoList(input); 
	  
		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].INFO_ADD_TIME = timeUtil.timestamp2Time(list[k].INFO_ADD_TIME, 'Y-M-D h:m:s');  

			if (list[k].INFO_OBJ && list[k].INFO_OBJ.desc)
				delete list[k].INFO_OBJ.desc;
		}
		result.list = list;

		return result;

	}


	/** 获取信息用于编辑修改 */
	async getInfoDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();
		let info = await service.getInfoDetail(input.id);
		if (info) {
			 
		}

		return info;

	}
  

	/** 删除 */
	async delInfo() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules); 

		let service = new AdminInfoService();
		await service.delInfo(input.id);  
	} 
     

	/**************数据导出 BEGIN ********************* */
	/** 当前是否有导出文件生成 */
	async infoDataGet() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();

		if (input.isDel === 1)
			await service.deleteInfoDataExcel(); //先删除

		return await service.getInfoDataURL();
	}

	/** 导出数据 */
	async infoDataExport() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			condition: 'string|name=导出条件',
			fields: 'array',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();
		return await service.exportInfoDataExcel(input.condition, input.fields);
	}

	/** 删除导出的数据文件 */
	async infoDataDel() {
		await this.isAdmin();

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminInfoService();
		return await service.deleteInfoDataExcel();
	}
}

module.exports = AdminInfoController;
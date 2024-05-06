/**
 * Notes: 后台信息管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-03-10 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const InfoModel = require('../../model/info_model.js');
const UserModel = require('../../model/user_model.js');
const exportUtil = require('../../../../framework/utils/export_util.js');


// 导出数据KEY
const EXPORT_INFO_DATA_KEY = 'EXPORT_INFO_DATA';

class AdminInfoService extends BaseProjectAdminService {

	/**删除数据 */
	async delInfo(id) {
		this.AppError('[商场]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**修改状态 */
	async statusInfo(id, status) {
		this.AppError('[商场]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**获取信息 */
	async getInfoDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let info = await InfoModel.getOne(where, fields);
		if (!info) return null;

		return info;
	}

	/**取得分页列表 */
	async getAdminInfoList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'INFO_ORDER': 'asc',
			'INFO_ADD_TIME': 'desc'
		};
		let fields = 'INFO_USER_ID,INFO_CATE_ID,INFO_CATE_NAME,INFO_ADD_TIME,INFO_ORDER,INFO_STATUS,INFO_FORMS,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ 'INFO_OBJ.name': ['like', search] },
				{ 'INFO_OBJ.phone': ['like', search] },
				{ 'user.USER_NAME': ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.INFO_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.INFO_STATUS = Number(sortVal);
					break;
				}
				case 'top': {
					where.and.INFO_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'INFO_ADD_TIME');
					break;
				}
			}
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'INFO_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		let result = await InfoModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

		// 为导出增加一个参数condition
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
	}

	/**置顶与排序设定 */
	async sortInfo(id, sort) {
		this.AppError('[商场]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// #####################导出数据
	/**获取数据 */
	async getInfoDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_INFO_DATA_KEY);
	}

	/**删除数据 */
	async deleteInfoDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_INFO_DATA_KEY);
	}

	/**导出数据 */
	async exportInfoDataExcel(
		condition, fields
	) {
		this.AppError('[商场]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminInfoService;
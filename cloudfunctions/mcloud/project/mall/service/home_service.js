/**
 * Notes: 全局/首页模块业务逻辑
 * Date: 2021-03-15 04:00:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const setupUtil = require('../../../framework/utils/setup/setup_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const ProductModel = require('../model/product_model.js');
const Cate1Model = require('../model/cate1_model.js');

class HomeService extends BaseProjectService {

	async getSetup(key) {
		return await setupUtil.get(key);
	}

	/**首页列表 */
	async getHomeList() {


		let swiper = await this.getSetup('swiper');

		let where = {
			PRODUCT_STATUS: 1,
		};
		let orderBy = {
			'PRODUCT_VOUCH': 'desc',
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		}
		let fields = 'PRODUCT_TITLE,PRODUCT_CATE_NAME,PRODUCT_OBJ.logo,PRODUCT_OBJ.address,PRODUCT_OBJ.floor';
		let vouchList = await ProductModel.getAll(where, fields, orderBy, 10);
		for (let k = 0; k < vouchList.length; k++) { 
		}

		return { swiper, vouchList }

	}
}

module.exports = HomeService;
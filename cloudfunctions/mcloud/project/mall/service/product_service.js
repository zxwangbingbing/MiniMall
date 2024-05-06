/**
 * Notes: 店铺模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const ProductModel = require('../model/product_model.js');
const Cate1Model = require('../model/cate1_model.js');

class ProductService extends BaseProjectService {

	async getAllProduct(floorOptions) {
		// 所有记录
		let orderBy = {
			PRODUCT_ORDER: 'asc',
			PRODUCT_ADD_TIME: 'desc'
		}
		let fields = 'PRODUCT_TITLE,PRODUCT_CATE_NAME,PRODUCT_CATE_ID,PRODUCT_FIRST,PRODUCT_CATE_ID,PRODUCT_CATE_NAME,PRODUCT_OBJ.floor,PRODUCT_OBJ.logo,PRODUCT_OBJ.address';
		let where = { PRODUCT_STATUS: 1 };

		let productList = await ProductModel.getAll(where, fields, orderBy, 1000);

		for (let k = 0; k < productList.length; k++) {
			productList[k].PRODUCT_CATE_NAME = productList[k].PRODUCT_CATE_NAME.join(' - ');
		}

		//### 按楼层 
		let floorList = [];
		for (let k = 0; k < floorOptions.length; k++) {
			let name = floorOptions[k];

			let list = [];
			for (let j = 0; j < productList.length; j++) {
				if (productList[j].PRODUCT_OBJ.floor == name) {
					list.push({
						id: productList[j]._id,
						img: productList[j].PRODUCT_OBJ.logo[0],
						name: productList[j].PRODUCT_TITLE,
						cate: productList[j].PRODUCT_CATE_NAME ,
						detail: productList[j].PRODUCT_OBJ.address,
						floor: productList[j].PRODUCT_OBJ.floor,
					});
				}

			}

			let node = {
				name,
				list
			}
			floorList.push(node);
		}

		//### 按字母
		let charList = [];
		for (let k = 65; k <= 90; k++) {
			let name = String.fromCharCode(k);

			let list = [];
			for (let j = 0; j < productList.length; j++) {
				if (productList[j].PRODUCT_FIRST == name) {
					list.push({
						id: productList[j]._id,
						img: productList[j].PRODUCT_OBJ.logo[0],
						name: productList[j].PRODUCT_TITLE,
						cate: productList[j].PRODUCT_CATE_NAME ,
						detail: productList[j].PRODUCT_OBJ.address,
						floor: productList[j].PRODUCT_OBJ.floor,
					});
				}

			}

			let node = {
				name,
				list
			}
			charList.push(node);
		}

		// 其他字符
		let otherList = [];
		for (let j = 0; j < productList.length; j++) {
			let first = productList[j].PRODUCT_FIRST;
			first = first.charCodeAt(0);
			if (first < 65 || first > 90) {
				otherList.push({
					id: productList[j]._id,
					img: productList[j].PRODUCT_OBJ.logo[0],
					name: productList[j].PRODUCT_TITLE,
					cate: productList[j].PRODUCT_CATE_NAME ,
					detail: productList[j].PRODUCT_OBJ.address,
					floor: productList[j].PRODUCT_OBJ.floor,
				});
			}

		}
		charList.push({ name: '其他', list: otherList });


		//### 按分类
		let cateList = [];
		let cate1Options = await Cate1Model.getAll({ CATE1_STATUS: 1 }, 'CATE1_TITLE', { 'CATE1_ORDER': 'asc', 'CATE1_ADD_TIME': 'desc' });
		for (let k = 0; k < cate1Options.length; k++) {
			let name = cate1Options[k].CATE1_TITLE;

			let list = [];
			for (let j = 0; j < productList.length; j++) {
				if (productList[j].PRODUCT_CATE_ID.includes(cate1Options[k]._id)) {
					list.push({
						id: productList[j]._id,
						img: productList[j].PRODUCT_OBJ.logo[0],
						name: productList[j].PRODUCT_TITLE,
						cate: productList[j].PRODUCT_CATE_NAME ,
						detail: productList[j].PRODUCT_OBJ.address,
						floor: productList[j].PRODUCT_OBJ.floor,
					});
				}

			}

			let node = {
				name,
				list
			}
			cateList.push(node);
		}

		return { productList, floorList, charList, cateList }
	}

	async likeProduct(userId, id) {
		// 是否点赞
		let product = await ProductModel.getOne(id, 'PRODUCT_LIKE_LIST');
		if (!product) this.AppError('记录不存在');

		let arr = product.PRODUCT_LIKE_LIST;
		let flag = false;
		if (arr.includes(userId)) {
			arr = arr.filter(item => item != userId);
			flag = false;
		}
		else {
			arr.push(userId);
			flag = true;
		}
		await ProductModel.edit(id, {
			PRODUCT_LIKE_LIST: arr,
			PRODUCT_LIKE_CNT: arr.length
		});

		return flag;
	}

	/** 浏览资讯信息 */
	async viewProduct(userId, id) {

		let fields = '*';

		let where = {
			_id: id,
			PRODUCT_STATUS: 1
		}
		let product = await ProductModel.getOne(where, fields);
		if (!product) return null;

		product.like = product.PRODUCT_LIKE_LIST.includes(userId) ? true : false;

		delete product.PRODUCT_LIKE_LIST;

		ProductModel.inc(id, 'PRODUCT_VIEW_CNT', 1);

		return product;
	}


	/** 取得分页列表 */
	async getProductList({
		cateId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME,PRODUCT_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		where.and.PRODUCT_STATUS = 1; // 状态 

		if (cateId && cateId !== '0') where.and.PRODUCT_CATE_ID = cateId;

		if (util.isDefined(search) && search) {
			where.or = [
				{ PRODUCT_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PRODUCT_ADD_TIME');
					break;
				}
				case 'cateId': {
					if (sortVal) where.and.PRODUCT_CATE_ID = String(sortVal);
					break;
				}
			}
		}

		return await ProductModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async getMyLikeProductList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'PRODUCT_ORDER': 'asc',
			'PRODUCT_ADD_TIME': 'desc'
		};
		let fields = 'PRODUCT_LIKE_CNT,PRODUCT_FAV_CNT,PRODUCT_COMMENT_CNT,PRODUCT_VIEW_CNT,PRODUCT_TITLE,PRODUCT_CATE_ID,PRODUCT_ADD_TIME,PRODUCT_ORDER,PRODUCT_STATUS,PRODUCT_CATE_NAME,PRODUCT_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		where.and.PRODUCT_LIKE_LIST = userId;


		if (util.isDefined(search) && search) {
			where.or = [
				{ PRODUCT_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'PRODUCT_ADD_TIME');
					break;
				}
			}
		}

		return await ProductModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = ProductService;
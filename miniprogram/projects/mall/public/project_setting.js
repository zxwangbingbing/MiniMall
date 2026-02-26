const FLOOR_OPTIONS = ['L1', 'L2', 'L3', 'L4', 'L5', 'B1', 'B2'];

module.exports = { //MALL

	FLOOR_OPTIONS: FLOOR_OPTIONS,

	PROJECT_COLOR: '#CF9F79',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#CF9F79',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '商场介绍', key: 'SETUP_CONTENT_ABOUT' },
		{ title: '商场服务', key: 'SETUP_CONTENT_CONTACT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'birth', title: '生日', type: 'date', must: true },
	],
	USER_CHECK_FORM: {
		name: 'formName|must|string|min:1|max:30|name=昵称',
		mobile: 'formMobile|must|mobile|name=手机',
		forms: 'formForms|array'
	},

	NEWS_NAME: '资讯',
	NEWS_CATE: [
		{ id: 1, title: '公告通知' }, 
		{ id: 2, title: '打折促销' },
	],
	NEWS_FIELDS: [
	],

	ACTIVITY_NAME: '活动',
	ACTIVITY_CATE: [
		{ id: 1, title: '活动' },  
	],
	ACTIVITY_FIELDS: [  
		{ mark: 'time', title: '预计时长(小时)', type: 'digit', must: true },
		{ mark: 'fee', title: '活动费用', type: 'text', must: true },
		{ mark: 'desc', title: '活动内容', type: 'content', must: true }, 
		{ mark: 'cover', title: '活动封面', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'img', title: '活动图集', type: 'image', min: 1, max: 8, must: true }, 

	],
	ACTIVITY_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, max: 30, edit: false },
		{ mark: 'phone', type: 'mobile', title: '手机', must: true, edit: false }
	],

	PRODUCT_NAME: '店铺',
	PRODUCT_CATE: [
		{ id: 1, title: '店铺', style: 'leftbig1' },

	],
	PRODUCT_FIELDS: [
		{ mark: 'floor', title: '所在楼层', type: 'select', selectOptions: FLOOR_OPTIONS, must: true },
		{ mark: 'address', title: '店铺位置', type: 'text', must: true },
		{ mark: 'phone', title: '店铺电话', type: 'text', must: true },
		{ mark: 'logo', title: '店铺LOGO', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'cover', title: '封面大图', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'time', title: '营业时间', type: 'text', must: true },
		{ mark: 'content', title: '详细介绍', type: 'content', must: false }  
	],

	CATE_NAME: '分类',
	CATE1_FIELDS: [  // 一级分类 
		{ mark: 'haslevel', title: '是否有二级分类', type: 'switch', must: true }, 
	],

	CATE2_FIELDS: [ // 二级分类

	], 
 

	COMMENT_NAME: '评价',
	COMMENT_FIELDS: [
		{ mark: 'content', title: '评价内容', type: 'textarea', must: true },
		{ mark: 'img', title: '图片', type: 'image', min: 0, max: 8, must: false },

	],

	INFO_NAME: '投诉建议',
	INFO_CATE: [
		{ id: 1, title: '投诉', style: 'leftbig1' }, 
		{ id: 2, title: '建议', style: 'leftbig1' } 
	],
	INFO_FIELDS: [ 
		{ mark: 'name', title: '姓名', type: 'text', must: true },
		{ mark: 'phone', title: '电话', type: 'text', must: true },
		{ mark: 'desc', title: '内容', type: 'textarea', must: true },
	],


}
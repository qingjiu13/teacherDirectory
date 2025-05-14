/**
 * @description 统一路由管理
 * 集中管理所有页面的路由路径，提供导航方法
 */

/**
 * @description 首页相关路由
 */
export const IndexRoutes = {
	INDEX: '/pages/index/index'
};

/**
 * @description 匹配相关路由
 */
export const MatchRoutes = {
	MATCH: '/pages_AI_Login_Match/match/match',
	TEACHER: '/pagesMine/teacher/teacher'
};

/**
 * @description AI相关路由
 */
export const AIRoutes = {
	AI_SERVER: '/pages_AI_Login_Match/AI/AI'
};

/**
 * @description 消息相关路由
 */
export const MessageRoutes = {
	MESSAGE: '/pagesChat/message',
	CHAT: '/pagesChat/chat'
};

/**
 * @description 登录相关路由
 */
export const LoginRoutes = {
	LOGIN: '/pages_AI_Login_Match/login/login',
	LOGIN_DETAIL: '/pages_AI_Login_Match/login/login_detail',
	WECHAT_LOGIN: '/pages_AI_Login_Match/login/wechat_login'
};

/**
 * @description 我的相关路由
 */
export const MineRoutes = {
	// 我的页面
	MINE: '/pagesMine/mine/mine_common',
	
	// 个人信息修改
	MODIFY: '/pagesMine/modify/modify',
	
	// 课程相关
	COURSE: '/pagesMine/course/course',

	
	// 订单相关
	ORDER_COMMON: '/pagesMine/order/order_common',
	APPRAISE: '/pagesMine/order/appraise',
	
	// 其他设置
	QUALIFICATION: '/pagesMine/qualification/qualification',
	SERVICE: '/pagesMine/service/service',
	SERVICE_NEWBUILT:'/pagesMine/service/service_newbuilt',
	SETTINGS: '/pagesMine/settings/settings',
	BILL: '/pagesMine/bill/bill',
	CONTACT_US: '/pagesMine/contactUs/contectUs'
};

/**
 * @description 合并所有路由
 */
export const Routes = {
	...IndexRoutes,
	...MatchRoutes,
	...AIRoutes,
	...MessageRoutes,
	...LoginRoutes,
	...MineRoutes
};

/**
 * @description 导航工具类
 */
export const Navigator = {
	/**
	 * @description 普通页面跳转
	 * @param {string} url 页面路径
	 * @param {Object} params 页面参数
	 */
	navigateTo(url, params = null) {
		if (params) {
			const queryString = Object.keys(params)
				.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
				.join('&');
			
			url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
		}
		
		uni.navigateTo({
			url: url
		});
	},
	
	/**
	 * @description 重定向页面（关闭当前页面）
	 * @param {string} url 页面路径
	 * @param {Object} params 页面参数
	 */
	redirectTo(url, params = null) {
		if (params) {
			const queryString = Object.keys(params)
				.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
				.join('&');
			
			url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
		}
		
		uni.redirectTo({
			url: url
		});
	},
	
	/**
	 * @description 切换Tab页面
	 * @param {string} url Tab页面路径
	 */
	switchTab(url) {
		uni.switchTab({
			url: url
		});
	},
	
	/**
	 * @description 返回上一页
	 * @param {number} delta 返回的层级
	 */
	navigateBack(delta = 1) {
		uni.navigateBack({
			delta: delta
		});
	},
	
	/**
	 * @description 重启到首页
	 */
	reLaunch(url = IndexRoutes.INDEX) {
		uni.reLaunch({
			url: url
		});
	},
	
	/**
	 * @description 跳转到首页
	 */
	toIndex() {
		this.navigateTo(IndexRoutes.INDEX);
	},
	
	/**
	 * @description 跳转到匹配页面
	 */
	toMatch() {
		this.navigateTo(MatchRoutes.MATCH);
	},
	
	/**
	 * @description 跳转到教师详情页面
	 * @param {String} id - 教师ID
	 */
	toTeacher(id) {
		this.navigateTo(MatchRoutes.TEACHER, { id });
	},
	
	/**
	 * @description 跳转到AI服务页面
	 */
	toAIServer() {
		this.navigateTo(AIRoutes.AI_SERVER);
	},
	
	/**
	 * @description 跳转到消息列表页面
	 */
	toMessage() {
		this.navigateTo(MessageRoutes.MESSAGE);
	},
	
	/**
	 * @description 跳转到聊天页面
	 * @param {String} userId - 聊天对象ID
	 */
	toChat(id) {
		this.navigateTo(MessageRoutes.CHAT, { id });
	},
	
	/**
	 * @description 跳转到登录页面
	 */
	toLogin() {
		this.navigateTo(LoginRoutes.LOGIN);
	},
	
	/**
	 * @description 跳转到登录详情页面
	 * @param {String} type - 登录类型，可以是'student'或'teacher'
	 */
	toLoginDetail(type) {
		this.navigateTo(LoginRoutes.LOGIN_DETAIL, { type });
	},
	
	/**
	 * @description 跳转到微信登录页面
	 */
	toWechatLogin() {
		this.navigateTo(LoginRoutes.WECHAT_LOGIN);
	},
	
	/**
	 * @description 跳转到个人信息修改页面
	 */
	toModify() {
		this.navigateTo(MineRoutes.MODIFY);
	},
	
	/**
	 * @description 跳转到课程列表页面
	 */
	toCourse() {
		this.navigateTo(MineRoutes.COURSE);
	},
	
	
	/**
	 * @description 跳转到订单列表页面
	 */
	toOrderCommon() {
		this.navigateTo(MineRoutes.ORDER_COMMON);
	},
	
	/**
	 * @description 跳转到评价页面
	 * @param {String} orderId - 订单ID
	 */
	toAppraise(orderId) {
		this.navigateTo(MineRoutes.APPRAISE, { orderId });
	},
	
	/**
	 * @description 跳转到资质认证页面
	 */
	toQualification() {
		this.navigateTo(MineRoutes.QUALIFICATION);
	},
	
	/**
	 * @description 跳转到服务页面
	 */
	toService() {
		this.navigateTo(MineRoutes.SERVICE);
	},
	/**
	 * @description 跳转到新建服务页面
	 */
	toServiceNewBuilt() {
		this.navigateTo(MineRoutes.SERVICE_NEWBUILT);
	},
	
	/**
	 * @description 跳转到设置页面
	 */
	toSettings() {
		this.navigateTo(MineRoutes.SETTINGS);
	},
	
	/**
	 * @description 跳转到钱包页面
	 */
	toBill() {
		this.navigateTo(MineRoutes.BILL);
	},
	
	/**
	 * @description 跳转到"我的"页面
	 */
	toMine() {
		this.navigateTo(MineRoutes.MINE);
	},
	
	
	/**
	 * @description 跳转到联系我们页面
	 */
	toContactUs() {
		this.navigateTo(MineRoutes.CONTACT_US);
	}
};

/**
 * @description 默认导出路由导与航工具
 */
export default {
	// 路由分类
	index: IndexRoutes,
	match: MatchRoutes,
	ai: AIRoutes,
	message: MessageRoutes,
	login: LoginRoutes,
	mine: MineRoutes,
	
	// 导航工具
	navigator: Navigator
};

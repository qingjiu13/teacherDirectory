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
	MATCH: '/pages/match/match',
	TEACHER: '/pages/teacher/teacher'
};

/**
 * @description AI相关路由
 */
export const AIRoutes = {
	AI_SERVER: '/pages/AI/AI'
};

/**
 * @description 消息相关路由
 */
export const MessageRoutes = {
	MESSAGE: '/pages/message/message',
	CHAT: '/pages/message/chat'
};

/**
 * @description 登录相关路由
 */
export const LoginRoutes = {
	LOGIN: '/pages/login/login',
	STUDENT_LOGIN: '/pages/login/student/student',
	TEACHER_LOGIN: '/pages/login/teacher/teacher',
	WECHAT_LOGIN: '/pages/login/wechat_login'
};

/**
 * @description 我的相关路由
 */
export const MineRoutes = {
	// 我的 - 学生
	STUDENT_MINE: '/pages/mine/mine/student_mine',
	
	// 我的 - 老师
	TEACHER_MINE: '/pages/mine/mine/teacher_mine',
	
	//我的 - 共用
	MINE_COMMON:'/pages/mine/mine/mine_common',

	// 个人信息修改
	MODIFY: '/pages/mine/modify',
	
	// 课程相关
	COURSE: '/pages/mine/course/course',
	COURSE_DETAIL: '/pages/mine/course/course_detail',
	
	// 订单相关
	ORDER: '/pages/mine/order',
	STUDENT_ORDER: '/pages/mine/order/student_order',
	TEACHER_ORDER: '/pages/mine/order/teacher_order',
	APPRAISE: '/pages/mine/order/appraise/appraise',
	ORDER_COMMON:'/pages/mine/order/order_common',
	
	// 其他设置
	QUALIFICATION: '/pages/mine/qualification',
	SERVICE: '/pages/mine/service',
	SETTINGS: '/pages/mine/settings',
	WALLET: '/pages/mine/wallet'
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
	toChat(userId) {
		this.navigateTo(MessageRoutes.CHAT, { userId });
	},
	
	/**
	 * @description 跳转到登录页面
	 */
	toLogin() {
		this.navigateTo(LoginRoutes.LOGIN);
	},
	
	/**
	 * @description 跳转到学生登录页面
	 */
	toStudentLogin() {
		this.navigateTo(LoginRoutes.STUDENT_LOGIN);
	},
	
	/**
	 * @description 跳转到教师登录页面
	 */
	toTeacherLogin() {
		this.navigateTo(LoginRoutes.TEACHER_LOGIN);
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
	 * @description 跳转到课程详情页面
	 * @param {String} id - 课程ID
	 */
	toCourseDetail(id) {
		this.navigateTo(MineRoutes.COURSE_DETAIL, { id });
	},
	
	/**
	 * @description 跳转到订单页面
	 * 根据存储的用户角色自动显示对应内容
	 */
	toOrder() {
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
	 * @description 跳转到设置页面
	 */
	toSettings() {
		this.navigateTo(MineRoutes.SETTINGS);
	},
	
	/**
	 * @description 跳转到钱包页面
	 */
	toWallet() {
		this.navigateTo(MineRoutes.WALLET);
	},
	
	/**
	 * @description 跳转到"我的"页面
	 * 根据存储的用户角色自动显示对应内容
	 */
	toMine() {
		this.navigateTo(MineRoutes.MINE_COMMON);
	}
};

/**
 * @description 默认导出路由与导航工具
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

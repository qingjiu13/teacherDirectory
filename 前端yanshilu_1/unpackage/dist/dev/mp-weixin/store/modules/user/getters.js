"use strict";
const getters = {
  /**
   * @description 判断用户是否已登录
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否已登录
   */
  isLoggedIn: (state) => state.isLoggedIn,
  /**
   * @description 获取用户角色
   * @param {Object} state - 状态对象
   * @returns {string|null} 用户角色
   */
  role: (state) => state.role,
  /**
   * @description 判断是否是老师
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否是老师
   */
  isTeacher: (state) => state.role === "teacher",
  /**
   * @description 判断是否是学生
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否是学生
   */
  isStudent: (state) => state.role === "student",
  /**
   * @description 获取用户认证信息
   * @param {Object} state - 状态对象
   * @returns {Object} 认证信息
   */
  auth: (state) => state.auth,
  /**
   * @description 获取用户令牌
   * @param {Object} state - 状态对象
   * @returns {string|null} 用户令牌
   */
  token: (state) => state.auth.token,
  /**
   * @description 获取用户信息
   * @param {Object} state - 状态对象
   * @returns {Object} 用户信息
   */
  userInfo: (state) => state.userInfo,
  /**
   * @description 获取用户名
   * @param {Object} state - 状态对象
   * @returns {string} 用户名
   */
  userName: (state) => state.userInfo.name,
  /**
   * @description 获取用户头像
   * @param {Object} state - 状态对象
   * @returns {string} 用户头像
   */
  userAvatar: (state) => state.userInfo.avatar,
  /**
   * @description 获取用户标签
   * @param {Object} state - 状态对象
   * @returns {Array} 用户标签
   */
  userTags: (state) => state.userInfo.tags || [],
  /**
   * @description 获取用户余额（仅教师）
   * @param {Object} state - 状态对象
   * @returns {number|null} 用户余额
   */
  balance: (state) => state.userInfo.balance,
  /**
   * @description 获取用户联系方式
   * @param {Object} state - 状态对象
   * @returns {Object} 联系方式
   */
  contact: (state) => state.userInfo.contact,
  /**
   * @description 获取未读消息数
   * @param {Object} state - 状态对象
   * @returns {number} 未读消息数
   */
  unreadMessageCount: (state) => state.userInfo.notifications ? state.userInfo.notifications.unread : 0,
  /**
   * @description 获取用户权限
   * @param {Object} state - 状态对象
   * @returns {Array} 用户权限
   */
  permissions: (state) => state.permissions,
  /**
   * @description 判断用户是否有特定权限
   * @param {Object} state - 状态对象
   * @returns {Function} 权限检查函数
   */
  hasPermission: (state) => (permission) => state.permissions.includes(permission),
  /**
   * @description 获取注册状态
   * @param {Object} state - 状态对象
   * @returns {Object} 注册状态
   */
  registration: (state) => state.registration
};
exports.getters = getters;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/user/getters.js.map

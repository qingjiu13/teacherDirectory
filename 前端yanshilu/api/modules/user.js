/**
 * @description 用户相关API接口
 */
import { get, post, put, del } from '../request.js';

/**
 * @description 用户登录
 * @param {Object} data - 登录参数，包含用户名和密码
 * @param {String} data.username - 用户名
 * @param {String} data.password - 密码
 * @returns {Promise} Promise对象
 */
export function login(data) {
  return post('/user/login', data);
}

/**
 * @description 用户注册
 * @param {Object} data - 注册参数
 * @param {String} data.username - 用户名
 * @param {String} data.password - 密码
 * @param {String} data.phone - 手机号
 * @param {String} data.code - 验证码
 * @returns {Promise} Promise对象
 */
export function register(data) {
  return post('/user/register', data);
}

/**
 * @description 发送短信验证码
 * @param {Object} data - 参数
 * @param {String} data.phone - 手机号
 * @param {String} data.type - 验证码类型，register-注册，login-登录，resetPassword-重置密码
 * @returns {Promise} Promise对象
 */
export function sendSmsCode(data) {
  return post('/user/sendSmsCode', data);
}

/**
 * @description 获取用户信息
 * @returns {Promise} Promise对象
 */
export function getUserInfo() {
  return get('/user/info');
}

/**
 * @description 更新用户信息
 * @param {Object} data - 用户信息
 * @param {String} data.nickname - 昵称
 * @param {String} data.avatar - 头像
 * @param {Number} data.gender - 性别，0-未知，1-男，2-女
 * @returns {Promise} Promise对象
 */
export function updateUserInfo(data) {
  return put('/user/info', data);
}

/**
 * @description 修改密码
 * @param {Object} data - 参数
 * @param {String} data.oldPassword - 旧密码
 * @param {String} data.newPassword - 新密码
 * @returns {Promise} Promise对象
 */
export function changePassword(data) {
  return put('/user/password', data);
}

/**
 * @description 重置密码
 * @param {Object} data - 参数
 * @param {String} data.phone - 手机号
 * @param {String} data.code - 验证码
 * @param {String} data.password - 新密码
 * @returns {Promise} Promise对象
 */
export function resetPassword(data) {
  return post('/user/resetPassword', data);
}

/**
 * @description 关注/取消关注用户
 * @param {String} userId - 目标用户ID
 * @param {Boolean} isFollow - 是否关注，true-关注，false-取消关注
 * @returns {Promise} Promise对象
 */
export function followUser(userId, isFollow) {
  const action = isFollow ? 'follow' : 'unfollow';
  return post(`/user/${action}`, { userId });
}

/**
 * @description 获取用户关注列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getFollowingList(params) {
  return get('/user/following', params);
}

/**
 * @description 获取用户粉丝列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getFollowersList(params) {
  return get('/user/followers', params);
} 
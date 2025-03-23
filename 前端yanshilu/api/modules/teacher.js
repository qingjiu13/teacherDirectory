/**
 * @description 教师相关API接口
 */
import { get, post, put, del } from '../request.js';

/**
 * @description 获取教师列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @param {String} params.school - 学校名称
 * @param {String} params.major - 专业名称
 * @param {String} params.keyword - 搜索关键词
 * @returns {Promise} Promise对象
 */
export function getTeachers(params) {
  return get('/teachers', params);
}

/**
 * @description 获取教师详情
 * @param {String} teacherId - 教师ID
 * @returns {Promise} Promise对象
 */
export function getTeacherDetail(teacherId) {
  return get(`/teacher/${teacherId}`);
}

/**
 * @description 获取相关教师
 * @param {Object} params - 查询参数
 * @param {String} params.teacherId - 教师ID
 * @param {String} params.school - 学校名称
 * @param {String} params.major - 专业名称
 * @param {Number} params.limit - 获取数量，默认5
 * @returns {Promise} Promise对象
 */
export function getRelatedTeachers(params) {
  return get('/teacher/related', params);
}

/**
 * @description 关注/取消关注教师
 * @param {String} teacherId - 教师ID
 * @param {Boolean} isFollow - 是否关注，true-关注，false-取消关注
 * @returns {Promise} Promise对象
 */
export function followTeacher(teacherId, isFollow) {
  const action = isFollow ? 'follow' : 'unfollow';
  return post(`/teacher/${action}`, { teacherId });
}

/**
 * @description 获取教师评价列表
 * @param {String} teacherId - 教师ID
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getTeacherReviews(teacherId, params) {
  return get(`/teacher/reviews/${teacherId}`, params);
}

/**
 * @description 发表教师评价
 * @param {Object} data - 评价数据
 * @param {String} data.teacherId - 教师ID
 * @param {String} data.content - 评价内容
 * @param {Number} data.rating - 评分，1-5星
 * @param {String} data.anonymity - 是否匿名，true-匿名，false-实名
 * @returns {Promise} Promise对象
 */
export function publishTeacherReview(data) {
  return post('/teacher/review', data);
}

/**
 * @description 删除教师评价
 * @param {String} reviewId - 评价ID
 * @returns {Promise} Promise对象
 */
export function deleteTeacherReview(reviewId) {
  return del(`/teacher/review/${reviewId}`);
}

/**
 * @description 点赞/取消点赞教师评价
 * @param {String} reviewId - 评价ID
 * @param {Boolean} isLike - 是否点赞，true-点赞，false-取消点赞
 * @returns {Promise} Promise对象
 */
export function likeTeacherReview(reviewId, isLike) {
  const action = isLike ? 'like' : 'unlike';
  return post(`/teacher/review/${action}`, { reviewId });
}

/**
 * @description 获取教师课程列表
 * @param {String} teacherId - 教师ID
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getTeacherCourses(teacherId, params) {
  return get(`/teacher/courses/${teacherId}`, params);
}

/**
 * @description 教师匹配申请
 * @param {Object} data - 申请数据
 * @param {String} data.school - 学校名称
 * @param {String} data.major - 专业名称
 * @param {String} data.requirement - 需求描述
 * @returns {Promise} Promise对象
 */
export function applyTeacherMatching(data) {
  return post('/teacher/match/apply', data);
}

/**
 * @description 获取匹配结果
 * @param {String} matchId - 匹配ID
 * @returns {Promise} Promise对象
 */
export function getMatchResult(matchId) {
  return get(`/teacher/match/result/${matchId}`);
}

/**
 * @description 长期匹配申请
 * @param {Object} data - 申请数据
 * @param {String} data.school - 学校名称
 * @param {String} data.major - 专业名称
 * @param {String} data.requirement - 需求描述
 * @param {String} data.contact - 联系方式
 * @returns {Promise} Promise对象
 */
export function applyLongTermMatching(data) {
  return post('/teacher/match/long-term', data);
} 
/**
 * @description 帖子相关API接口
 */
import { get, post, put, del } from '../request.js';

/**
 * @description 获取帖子列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @param {String} params.category - 分类ID
 * @param {String} params.keyword - 搜索关键词
 * @returns {Promise} Promise对象
 */
export function getPosts(params) {
  return get('/posts', params);
}

/**
 * @description 获取帖子详情
 * @param {String} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
export function getPostDetail(postId) {
  return get(`/post/detail/${postId}`);
}

/**
 * @description 发布帖子
 * @param {Object} data - 帖子数据
 * @param {String} data.title - 标题
 * @param {String} data.content - 内容
 * @param {String} data.category - 分类ID
 * @param {Array} data.images - 图片地址数组
 * @param {Array} data.tags - 标签数组
 * @returns {Promise} Promise对象
 */
export function publishPost(data) {
  return post('/post/publish', data);
}

/**
 * @description 更新帖子
 * @param {String} postId - 帖子ID
 * @param {Object} data - 帖子数据
 * @param {String} data.title - 标题
 * @param {String} data.content - 内容
 * @param {String} data.category - 分类ID
 * @param {Array} data.images - 图片地址数组
 * @param {Array} data.tags - 标签数组
 * @returns {Promise} Promise对象
 */
export function updatePost(postId, data) {
  return put(`/post/${postId}`, data);
}

/**
 * @description 删除帖子
 * @param {String} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
export function deletePost(postId) {
  return del(`/post/${postId}`);
}

/**
 * @description 点赞/取消点赞帖子
 * @param {String} postId - 帖子ID
 * @param {Boolean} isLike - 是否点赞，true-点赞，false-取消点赞
 * @returns {Promise} Promise对象
 */
export function likePost(postId, isLike) {
  const action = isLike ? 'like' : 'unlike';
  return post(`/post/${action}`, { postId });
}

/**
 * @description 收藏/取消收藏帖子
 * @param {String} postId - 帖子ID
 * @param {Boolean} isCollect - 是否收藏，true-收藏，false-取消收藏
 * @returns {Promise} Promise对象
 */
export function collectPost(postId, isCollect) {
  const action = isCollect ? 'collect' : 'uncollect';
  return post(`/post/${action}`, { postId });
}

/**
 * @description 获取帖子评论列表
 * @param {String} postId - 帖子ID
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getPostComments(postId, params) {
  return get(`/post/comments/${postId}`, params);
}

/**
 * @description 发表评论
 * @param {Object} data - 评论数据
 * @param {String} data.postId - 帖子ID
 * @param {String} data.content - 评论内容
 * @param {String} data.parentId - 父评论ID，回复评论时需要
 * @returns {Promise} Promise对象
 */
export function publishComment(data) {
  return post('/post/comment', data);
}

/**
 * @description 删除评论
 * @param {String} commentId - 评论ID
 * @returns {Promise} Promise对象
 */
export function deleteComment(commentId) {
  return del(`/post/comment/${commentId}`);
}

/**
 * @description 点赞/取消点赞评论
 * @param {String} commentId - 评论ID
 * @param {Boolean} isLike - 是否点赞，true-点赞，false-取消点赞
 * @returns {Promise} Promise对象
 */
export function likeComment(commentId, isLike) {
  const action = isLike ? 'like' : 'unlike';
  return post(`/comment/${action}`, { commentId });
}

/**
 * @description 保存草稿
 * @param {Object} data - 草稿数据
 * @param {String} data.title - 标题
 * @param {String} data.content - 内容
 * @param {String} data.category - 分类ID
 * @param {Array} data.images - 图片地址数组
 * @param {Array} data.tags - 标签数组
 * @returns {Promise} Promise对象
 */
export function saveDraft(data) {
  return post('/post/draft', data);
}

/**
 * @description 获取草稿列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getDrafts(params) {
  return get('/post/drafts', params);
}

/**
 * @description 获取草稿详情
 * @param {String} draftId - 草稿ID
 * @returns {Promise} Promise对象
 */
export function getDraftDetail(draftId) {
  return get(`/post/draft/${draftId}`);
}

/**
 * @description 删除草稿
 * @param {String} draftId - 草稿ID
 * @returns {Promise} Promise对象
 */
export function deleteDraft(draftId) {
  return del(`/post/draft/${draftId}`);
}

/**
 * @description 获取相关帖子
 * @param {Object} params - 查询参数
 * @param {String} params.postId - 帖子ID
 * @param {Number} params.limit - 获取数量，默认5
 * @returns {Promise} Promise对象
 */
export function getRelatedPosts(params) {
  return get('/post/related', params);
}

/**
 * @description 获取用户帖子列表
 * @param {Object} params - 查询参数
 * @param {String} params.userId - 用户ID
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getUserPosts(params) {
  return get('/user/posts', params);
}

/**
 * @description 获取用户收藏的帖子列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getUserCollections(params) {
  return get('/user/collections', params);
}

/**
 * @description 举报帖子
 * @param {Object} data - 举报数据
 * @param {String} data.postId - 帖子ID
 * @param {String} data.reason - 举报原因
 * @param {String} data.description - 举报详细描述
 * @returns {Promise} Promise对象
 */
export function reportPost(data) {
  return post('/post/report', data);
} 
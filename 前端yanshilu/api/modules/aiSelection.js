/**
 * @description AI择校相关API接口
 */
import { get, post } from '../request.js';
import { aiSelectionApis } from '../../config.js';

/**
 * @description 获取学校列表
 * @param {Object} params - 查询参数
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.type - 学校类型
 * @returns {Promise} Promise对象
 */
export function getSchools(params) {
  return get(`/${aiSelectionApis.getSchools}`, params);
}

/**
 * @description 获取本科专业列表
 * @returns {Promise<String[]>} 专业名称数组
 */
export function getUndergraduateMajors() {
  return get(`/${aiSelectionApis.getUndergraduateMajors}`);
}

/**
 * @description 获取研究生专业列表
 * @returns {Promise<Object[]>} 专业对象数组，包含编号和类别
 */
export function getGraduateMajors() {
  return get(`/${aiSelectionApis.getGraduateMajors}`);
}

/**
 * @description 获取专业列表（旧接口，为保持兼容）
 * @param {Object} params - 查询参数
 * @param {String} params.level - 学历级别，undergraduate-本科，graduate-研究生
 * @returns {Promise} Promise对象
 */
export function getMajors(params) {
  return get(`/${aiSelectionApis.getMajors}`, params);
}

/**
 * @description 保存分析请求
 * @param {Object} data - 分析请求数据
 * @param {String} data.educationLevel - 教育级别，undergraduate-本科，graduate-研究生
 * @param {String} data.currentSchool - 当前学校
 * @param {String} data.currentMajor - 当前专业
 * @param {String} data.targetMajor - 目标专业
 * @param {Number} data.gpa - 绩点
 * @param {String} data.achievements - 成就
 * @param {Array} data.targetSchools - 目标学校列表
 * @returns {Promise} Promise对象，返回请求ID
 */
export function saveAnalysisRequest(data) {
  return post(`/${aiSelectionApis.saveAnalysisRequest}`, data);
}

/**
 * @description 开始分析
 * @param {Object} data - 分析参数
 * @param {String} data.requestId - 请求ID，从saveAnalysisRequest获取
 * @returns {Promise} Promise对象
 */
export function startAnalysis(data) {
  return post(`/${aiSelectionApis.startAnalysis}`, data);
}

/**
 * @description 获取分析结果
 * @param {String} requestId - 请求ID
 * @returns {Promise} Promise对象
 */
export function getSchoolAnalysis(requestId) {
  return get(`/${aiSelectionApis.getSchoolAnalysis}`, { requestId });
}

/**
 * @description 保存分析结果
 * @param {Object} data - 保存参数
 * @param {String} data.requestId - 请求ID
 * @param {Boolean} data.isFavorite - 是否收藏
 * @returns {Promise} Promise对象
 */
export function saveAnalysisResult(data) {
  return post('/saveAnalysisResult', data);
}

/**
 * @description 获取历史分析记录
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码，从1开始
 * @param {Number} params.pageSize - 每页数量，默认10
 * @returns {Promise} Promise对象
 */
export function getAnalysisHistory(params) {
  return get('/analysisHistory', params);
}

/**
 * @description 删除分析记录
 * @param {String} requestId - 请求ID
 * @returns {Promise} Promise对象
 */
export function deleteAnalysisRecord(requestId) {
  return post('/deleteAnalysisRecord', { requestId });
} 
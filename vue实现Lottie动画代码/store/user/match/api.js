/**
 * 匹配相关API
 * @module store/user/match/api
 */

import { MATCH_API_BASE_URL, USER_TEACHER_DETAIL_URL } from '../API.js';

/**
 * 获取匹配的教师列表
 * @param {Object} params - 筛选参数
 * @param {string} [params.school] - 学校筛选
 * @param {string} [params.major] - 专业筛选
 * @param {string} [params.sort] - 排序方式（综合排序/分数排序）
 * @returns {Promise<Object>} 返回匹配的教师列表
 * @property {Array} data.matchList - 匹配教师列表
 * @property {string} data.matchList[].id - 教师ID
 * @property {string} data.matchList[].name - 教师姓名
 * @property {string} data.matchList[].avatar - 教师头像
 * @property {string} data.matchList[].school - 教师所在学校
 * @property {string} data.matchList[].major - 教师专业
 * @property {number} data.matchList[].teacherScore - 老师考研成绩
 * @property {Array} data.matchList[].service - 教师提供的服务列表
 * @property {string} data.matchList[].service[].id - 服务ID
 * @property {string} data.matchList[].service[].type - 服务类型
 * @property {number} data.matchList[].service[].price - 服务价格
 */
export const getMatchTeachers = async (params = {}) => {
  try {
    // 构建URL查询参数
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const url = `${MATCH_API_BASE_URL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取匹配教师列表失败:', error);
    throw error;
  }
};

/**
 * 通过教师ID获取教师详细信息
 * @param {string} teacherId - 教师ID
 * @returns {Promise<Object>} 返回教师详细信息
 * @property {string} data.id - 教师ID
 * @property {string} data.selfIntroduction - 教师自我介绍
 * @property {Array} data.service - 教师提供的服务列表
 * @property {string} data.service[].id - 服务ID
 * @property {string} data.service[].name - 服务名称
 * @property {string} data.service[].type - 服务类型
 * @property {number} data.service[].price - 服务价格
 * @property {string} data.service[].description - 服务描述
 * @property {string} data.service[].image - 服务图片
 */
export const getTeacherDetail = async (teacherId) => {
  try {
    if (!teacherId) {
      throw new Error('教师ID不能为空');
    }
    
    const url = `${USER_TEACHER_DETAIL_URL}?id=${teacherId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取教师详情失败:', error);
    throw error;
  }
}; 
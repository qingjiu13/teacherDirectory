/**
 * API调用函数集合
 * @module api/API
 */

import { MATCH_API_BASE_URL } from './index';

/**
 * 获取匹配的教师列表
 * @param {Object} params - 筛选参数
 * @param {string} [params.gender] - 性别筛选
 * @param {string} [params.school] - 学校筛选
 * @param {string} [params.major] - 专业筛选
 * @param {number} [params.certificate] - 资格证书筛选
 * @returns {Promise<Object>} 返回匹配的教师列表
 * @property {Array} data.matchList - 匹配教师列表
 * @property {string} data.matchList[].id - 教师ID
 * @property {string} data.matchList[].name - 教师姓名
 * @property {string} data.matchList[].avatar - 教师头像
 * @property {string} data.matchList[].gender - 教师性别
 * @property {string} data.matchList[].selfIntroduction - 教师自我介绍
 * @property {number} data.matchList[].certificate - 教师是否认证
 * @property {string} data.matchList[].school - 教师所在学校
 * @property {string} data.matchList[].major - 教师专业
 * @property {Array} data.matchList[].service - 教师提供的服务列表
 * @property {string} data.matchList[].service[].id - 服务ID
 * @property {string} data.matchList[].service[].name - 服务名称
 * @property {number} data.matchList[].service[].price - 服务价格
 * @property {string} data.matchList[].service[].description - 服务描述
 * @property {string} data.matchList[].service[].image - 服务图片
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


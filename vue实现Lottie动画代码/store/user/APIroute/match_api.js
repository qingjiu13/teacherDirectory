/**
 * 匹配模块的API接口
 * @module store/user/APIroute/match_api
 */

import { MATCH_API_BASE_URL } from '../API.js';

/**
 * 根据筛选条件获取匹配的教师列表
 * @async
 * @function getMatchList
 * @param {Object} params - 筛选参数
 * @param {string} params.id - 用户ID
 * @param {string} [params.searchText] - 用户输入的搜索文本
 * @param {string|Array} params.schoolList - 学校列表
 * @param {string|Array} params.professionalList - 专业课列表
 * @param {Object} params.nonProfessionalList - 非专业课列表
 * @param {string} params.nonProfessionalList.math - 数学
 * @param {string} params.nonProfessionalList.english - 英语
 * @param {string} params.nonProfessionalList.politics - 政治
 * @param {string} params.nonProfessionalList.other - 其他
 * @param {string} params.sortMode - 排序方式
 * @returns {Promise<Object>} 返回匹配的教师列表及相关信息
 * @throws {Error} 请求出错时抛出异常
 */
export const getMatchList = async (params) => {
  try {
    const response = await uni.request({
      url: MATCH_API_BASE_URL,
      method: 'POST',
      data: {
        id: params.id,
        searchText: params.searchText || '',
        schoolList: params.schoolList || '',
        professionalList: params.professionalList || '',
        nonProfessionalList: params.nonProfessionalList.math || params.nonProfessionalList.english || params.nonProfessionalList.politics || params.nonProfessionalList.other || '',
        sortMode: params.sortMode || ''
      },
      header: {
        'content-type': 'application/json'
      }
    });
    
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(`请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('获取匹配列表失败:', error);
    throw error;
  }
};

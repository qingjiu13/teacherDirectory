/**
 * 我的服务模块的API接口
 * @module store/user/APIroute/myService_api
 */

import { USER_MY_SERVICE_URL, USER_MY_SERVICE_NEWBUILT_URL, USER_MY_SERVICE_DELETE_URL } from '../../API.js';

/**
 * 获取用户的所有服务列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @returns {Promise<Object>} 返回用户的所有服务信息
 */
export const getMyServiceList = async (params) => {
    try {
        const response = await uni.request({
            url: USER_MY_SERVICE_URL,
            method: 'POST',
            data: params
        });
        return response.data;
    } catch (error) {
        console.error('获取服务列表失败:', error);
        throw error;
    }
};

/**
 * 向后端添加用户新建的服务
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.serviceId - 要创建的服务ID
 * @param {Object} params.service - 用户新建的服务信息
 * @param {string} params.service.name - 服务名称
 * @param {Object} params.service.type - 服务类型
 * @param {string} params.service.price - 服务价格
 * @param {string} params.service.description - 服务描述
 * @param {string} params.service.image - 服务图片路径
 * @returns {Promise<Object>} 返回添加服务的结果
 */
export const addNewService = async (params) => {
    try {
        const response = await uni.request({
            url: USER_MY_SERVICE_NEWBUILT_URL,
            method: 'POST',
            data: params
        });
        return response.data;
    } catch (error) {
        console.error('添加新服务失败:', error);
        throw error;
    }
};

/**
 * 删除用户的某个服务
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.serviceId - 要删除的服务ID
 * @returns {Promise<Object>} 返回删除服务的结果
 */
export const deleteService = async (params) => {
    try {
        const response = await uni.request({
            url: USER_MY_SERVICE_DELETE_URL,
            method: 'POST',
            data: params
        });
        return response.data;
    } catch (error) {
        console.error('删除服务失败:', error);
        throw error;
    }
};

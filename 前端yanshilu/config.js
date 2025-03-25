/**
 * @description 页面名称常量
 */
export const PAGE_INDEX = 'index';
export const PAGE_MESSAGE = 'message';
export const PAGE_PUBLISH = 'publish';
export const PAGE_MINE = 'mine';

/**
 * @description API基础配置
 */
export const BASE_URL = 'https://api.example.com'; // 实际部署时请修改为正确的API地址

/**
 * @description 自定义云函数API配置
 */
export const CUSTOM_API_URL = 'http://localhost:3000/api'; // 自定义云函数API地址

/**
 * @description 云函数调用模式
 * 支持的模式：
 * - 'unicloud': 使用uniCloud.callFunction调用云函数
 * - 'custom': 使用自定义API调用云函数
 */
export const CLOUD_FUNCTION_MODE = 'custom';

/**
 * @description 页面路径映射
 */
export const pageMap = {
    [PAGE_INDEX]: '/pages/index/index',
    [PAGE_MESSAGE]: '/pages/message/message',
    [PAGE_PUBLISH]: '/pages/publish/publish',
    [PAGE_MINE]: '/pages/mine/mine'
}; 
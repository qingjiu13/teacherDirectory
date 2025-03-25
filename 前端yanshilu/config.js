/**
 * @description 页面名称常量
 */
export const PAGE_INDEX = 'index';
export const PAGE_MESSAGE = 'message';
export const PAGE_PUBLISH = 'publish';
export const PAGE_MINE = 'mine';
export const PAGE_AI_SELECTION = 'ai_selection';

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
    [PAGE_MINE]: '/pages/mine/mine',
    [PAGE_AI_SELECTION]: '/pages/ai/selection/selection'
}; 

/**
 * @description AI择校页面路径
 */
export const aiSelectionRoutes = {
    selection: '/pages/ai/selection/selection',
    step2: '/pages/ai/selection/step2',
    step3: '/pages/ai/selection/step3',
    step4: '/pages/ai/selection/step4',
    step5: '/pages/ai/selection/step5',
    step6: '/pages/ai/selection/step6',
    analyzing: '/pages/ai/selection/analyzing',
    result: '/pages/ai/selection/result'
};

/**
 * @description AI择校相关接口
 */
export const aiSelectionApis = {
    // 获取学校列表
    getSchools: 'getSchools',
    // 获取本科专业列表（简单字符串数组）
    getUndergraduateMajors: 'getUndergraduateMajors',
    // 获取研究生专业列表（包含编号和类别）
    getGraduateMajors: 'getGraduateMajors',
    // 获取专业列表（旧接口，为保持兼容）
    getMajors: 'getMajors',
    // 保存分析请求
    saveAnalysisRequest: 'saveAnalysisRequest',
    // 开始分析
    startAnalysis: 'startAnalysis',
    // 获取分析结果
    getSchoolAnalysis: 'getSchoolAnalysis'
}; 
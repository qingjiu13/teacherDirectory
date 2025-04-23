/**
 * AI聊天模块的常量定义
 * @module store/user/ai-chat/constants
 */

/**
 * API URL常量
 * 这些常量可以在实际开发中替换为从环境变量或配置文件中读取的值
 */

// AI问答接口URL
// question API配置：AI问答
export const AIQA_QUESTION_URL = 'http://localhost:8080/AIQA/question';

// getHistory API配置：获取问答历史
export const AIQA_GET_HISTORY_URL = 'http://localhost:8080/AIQA/getHistory';

// deleteHistory API配置：删除问答历史
export const AIQA_DELETE_HISTORY_URL = 'http://localhost:8080/AIQA/deleteHistory';

// getHistoryDetail API配置：获取问答历史详情
export const AIQA_GET_HISTORY_DETAIL_URL = 'http://localhost:8080/AIQA/getHistoryDetail';

/**
 * 聊天模式常量
 */
export const CHAT_MODES = {
  GENERAL: 'general',    // 通用模式
  SCHOOL: 'school',      // 择校咨询
  CAREER: 'career',      // 职业规划
  LEARNING: 'learning'   // 学习指导
}; 
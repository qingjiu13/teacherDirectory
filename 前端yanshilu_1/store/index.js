/**
 * @description 状态管理入口文件
 * 使用Vuex架构管理状态，按角色和功能区分模块
 */

// 导入Vuex
import { createStore } from 'vuex'

// 导入API服务
import * as apiServices from './services';

// 导入共享模块
import auth from './modules/common/auth';
import app from './modules/common/app';
import message from './modules/common/message';
import aiChat from './modules/common/ai-chat';
import match from './modules/common/match';
import teacher from './modules/common/teacher';

// 导入角色相关模块
import user from './modules/common/user';
import student from './modules/student';

// 导入功能模块
import courses from './modules/common/courses';
import orders from './modules/common/orders';

/**
 * @description 创建Vuex Store实例
 */
const store = createStore({
  modules: {
    // 共享模块
    auth,            // 认证相关
    app,             // 应用全局状态
    message,         // 消息通知
    
    // 用户信息模块
    user,            // 用户基本信息
    
    // 角色模块
    teacher,         // 教师特有功能
    student,         // 学生特有功能
    
    // 功能模块
    aiChat,          // AI聊天功能
    courses,         // 课程相关
    orders,          // 订单相关
    match            // 匹配功能
  }
});

/**
 * @description 导出API服务，便于在组件中使用
 */
export const services = apiServices;

/**
 * @description 应用初始化函数 - 轻量级版本
 * 基础初始化，不涉及认证状态检查
 * @returns {Promise<Object>} 初始化结果
 */
export const initializeApp = async () => {
  try {
    // 基础初始化逻辑，无需检查认证状态
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('应用初始化失败:', error);
    return { success: false, error };
  }
};

/**
 * @description 加载教师模块数据
 * 在教师页面点击或进入教师相关页面时调用
 * @returns {Promise<Object>} 加载结果
 */
export const loadTeacherData = async () => {
  try {
    await store.dispatch('teacher/loadInitialData');
    return { success: true };
  } catch (error) {
    console.error('加载教师数据失败:', error);
    return { success: false, error };
  }
};

/**
 * @description 加载学生模块数据
 * 在学生页面点击或进入学生相关页面时调用
 * @returns {Promise<Object>} 加载结果
 */
export const loadStudentData = async () => {
  try {
    await store.dispatch('student/loadInitialData');
    return { success: true };
  } catch (error) {
    console.error('加载学生数据失败:', error);
    return { success: false, error };
  }
};

/**
 * @description 加载匹配推荐数据
 * 在匹配页面点击或进入匹配页面时调用
 * @returns {Promise<Object>} 匹配结果
 */
export const loadMatchRecommendations = async () => {
  try {
    // 获取保存的导航类型
    await store.dispatch('match/getSavedNavigationType');
    
    // 调用match模块的getRecommendedTeachers action
    const teachers = await store.dispatch('match/getRecommendedTeachers');
    return { 
      success: true, 
      data: teachers 
    };
  } catch (error) {
    console.error('加载匹配推荐失败:', error);
    return { success: false, error };
  }
};

export default store;
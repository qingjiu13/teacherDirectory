/**
 * @description 状态管理入口文件
 * 使用Vuex架构管理状态，按角色和功能区分模块
 */

// 导入Vuex
import { createSSRApp } from 'vue'
import { createStore } from 'vuex'

// 导入API服务
import * as apiServices from './services';

// 导入共享模块
import auth from './modules/common/auth';
import app from './modules/common/app';
import message from './modules/common/message';
import settings from './modules/common/settings';
import aiChat from './modules/common/ai-chat';
import match from './modules/common/match';

// 导入角色相关模块
import user from './modules/common/user';
import teacher from './modules/teacher';
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
    settings,        // 用户设置
    
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
 * @description 应用初始化函数
 * @returns {Promise<Object>} 初始化结果
 */
export const initializeApp = async () => {
  try {
    // 检查用户登录状态并获取用户信息
    const userInfo = await store.dispatch('auth/checkAuthStatus');
    if (userInfo) {
      // 如果用户已登录，根据角色加载相应模块数据
      const { role } = userInfo;
      if (role === 'teacher') {
        // 加载教师特有数据
        await store.dispatch('teacher/loadInitialData');
      } else if (role === 'student') {
        // 加载学生特有数据
        await store.dispatch('student/loadInitialData');
      }
      
      // 加载通用模块数据
      await store.dispatch('match/resetAndGetRecommended');
    }
    return { success: true };
  } catch (error) {
    console.error('应用初始化失败:', error);
    return { success: false, error };
  }
};

export default store;
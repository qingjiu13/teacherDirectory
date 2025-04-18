/**
 * @description API服务统一导出文件
 */

// 导入所有API服务
import * as auth from './auth.api';
import * as aiChat from './ai-chat.api';
import * as teacher from './teacher.api';
import * as student from './student.api';
import * as course from './course.api';
import * as order from './order.api';
import * as common from './common.api';
import * as match from './match.api';
import * as user from './user.api';
import mockData from './mock-data';

// 导出模拟数据，方便在其他地方使用
export const mock = mockData;

// 统一导出为services对象
export const services = {
  auth,     // 认证相关API
  aiChat,   // AI聊天相关API
  teacher,  // 教师特有API
  student,  // 学生特有API
  course,   // 课程相关API
  order,    // 订单相关API
  common,   // 通用API
  match,    // 匹配功能API
  user,     // 用户通用API
  mock      // 模拟数据
};

// 保持单独导出以兼容已有代码
export {
  auth,
  aiChat,
  teacher,
  student,
  course,
  order,
  common,
  match,
  user
}; 
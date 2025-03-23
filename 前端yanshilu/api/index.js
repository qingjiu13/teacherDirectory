/**
 * @description API接口统一入口文件
 */

// 导入请求方法
import request, { get, post as postRequest, put, del } from './request.js';

// 导入各模块API
import * as user from './modules/user.js';
import * as post from './modules/post.js';
import * as teacher from './modules/teacher.js';
import * as aiSelection from './modules/aiSelection.js';

// 导出请求方法
export {
  request,
  get,
  postRequest,
  put,
  del
};

// 统一导出所有API模块
export default {
  // 用户相关API
  user,
  
  // 帖子相关API
  post,
  
  // 教师相关API
  teacher,
  
  // AI择校相关API
  aiSelection
}; 
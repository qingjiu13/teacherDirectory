/**
 * 用户基本信息模块测试工具
 * @module store/user/baseInfo/test
 */

import { login, getUserInfo, updateUserInfo } from './api';
import { USE_MOCK_DATA } from './config';

/**
 * 测试登录功能
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 测试结果
 */
export const testLogin = (credentials = { username: 'zhangsan', password: '123456' }) => {
  console.log(`正在测试登录功能，使用${USE_MOCK_DATA ? '模拟数据' : '真实API'}`);
  console.log(`登录凭证:`, credentials);
  
  return login(credentials)
    .then(response => {
      console.log('登录成功：', response);
      return response;
    })
    .catch(error => {
      console.error('登录失败：', error);
      throw error;
    });
};

/**
 * 测试获取用户信息
 * @returns {Promise<Object>} 测试结果
 */
export const testGetUserInfo = () => {
  console.log(`正在测试获取用户信息，使用${USE_MOCK_DATA ? '模拟数据' : '真实API'}`);
  
  return getUserInfo()
    .then(response => {
      console.log('获取用户信息成功：', response);
      return response;
    })
    .catch(error => {
      console.error('获取用户信息失败：', error);
      throw error;
    });
};

/**
 * 测试更新用户信息
 * @param {Object} userInfo - 用户信息对象
 * @returns {Promise<Object>} 测试结果
 */
export const testUpdateUserInfo = (userInfo = { 
  name: '测试用户', 
  gender: '女', 
  selfIntroduction: '这是一条测试用的自我介绍信息' 
}) => {
  console.log(`正在测试更新用户信息，使用${USE_MOCK_DATA ? '模拟数据' : '真实API'}`);
  console.log(`更新的信息:`, userInfo);
  
  return updateUserInfo(userInfo)
    .then(response => {
      console.log('更新用户信息成功：', response);
      return response;
    })
    .catch(error => {
      console.error('更新用户信息失败：', error);
      throw error;
    });
};

/**
 * 运行完整测试流程
 * @returns {Promise<void>}
 */
export const runFullTest = async () => {
  console.log('===== 开始完整测试流程 =====');
  
  try {
    // 1. 测试登录
    await testLogin();
    
    // 2. 测试获取用户信息
    const userInfo = await testGetUserInfo();
    
    // 3. 测试更新用户信息
    await testUpdateUserInfo({
      name: `测试用户_${Date.now()}`,
      gender: userInfo.data.gender === '男' ? '女' : '男',
      selfIntroduction: `测试自我介绍_${Date.now()}`
    });
    
    // 4. 再次获取用户信息，验证更新是否成功
    await testGetUserInfo();
    
    console.log('===== 完整测试流程成功完成 =====');
  } catch (error) {
    console.error('===== 测试流程失败 =====', error);
  }
}; 
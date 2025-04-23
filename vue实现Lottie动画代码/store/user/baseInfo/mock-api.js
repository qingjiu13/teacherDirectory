/**
 * 用户基本信息模块的模拟API实现
 * @module store/user/baseInfo/mock-api
 */

import { 
  mockUsers, 
  mockApiResponse, 
  delay, 
  DEFAULT_USER_INFO 
} from './mock-data';

/**
 * 模拟登录API
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (data) => {
  try {
    // 模拟网络延迟
    await delay(500);
    
    const user = mockUsers.find(
      user => user.username === data.username && user.password === data.password
    );
    
    if (user) {
      return mockApiResponse(true, {
        userId: user.id,
        role: user.role,
        message: '登录成功'
      });
    } else {
      return mockApiResponse(false, null, {
        message: '用户名或密码错误'
      });
    }
  } catch (error) {
    console.error('模拟登录失败:', error);
    return mockApiResponse(false, null, {
      message: '登录请求失败'
    });
  }
};

/**
 * 模拟获取用户信息API
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async () => {
  try {
    // 模拟网络延迟
    await delay(300);
    
    // 从本地存储获取用户ID
    const userId = uni.getStorageSync('userId');
    
    if (!userId) {
      // 用户未登录，返回默认用户信息
      return mockApiResponse(true, DEFAULT_USER_INFO);
    }
    
    const user = mockUsers.find(user => user.id === userId);
    
    if (user) {
      return mockApiResponse(true, { ...user });
    } else {
      // 未找到用户，返回默认用户信息
      uni.removeStorageSync('userId');
      uni.removeStorageSync('user-token');
      return mockApiResponse(true, DEFAULT_USER_INFO);
    }
  } catch (error) {
    console.error('模拟获取用户信息失败:', error);
    return mockApiResponse(false, null, {
      message: '获取用户信息失败'
    });
  }
};

/**
 * 模拟更新用户信息API
 * @param {Object} userInfo - 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = async (userInfo) => {
  try {
    // 模拟网络延迟
    await delay(400);
    
    const userId = uni.getStorageSync('userId');
    
    if (!userId) {
      return mockApiResponse(false, null, {
        message: '用户未登录'
      });
    }
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      // 更新用户信息
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userInfo,
        // 处理不同字段名的映射
        nickname: userInfo.name || userInfo.nickname || mockUsers[userIndex].nickname,
        name: userInfo.nickname || userInfo.name || mockUsers[userIndex].name,
        introduction: userInfo.selfIntroduction || userInfo.introduction || mockUsers[userIndex].introduction,
        selfIntroduction: userInfo.introduction || userInfo.selfIntroduction || mockUsers[userIndex].selfIntroduction,
        wechat: userInfo.wechatNumber || userInfo.wechat || mockUsers[userIndex].wechat,
        wechatNumber: userInfo.wechat || userInfo.wechatNumber || mockUsers[userIndex].wechatNumber,
        phone: userInfo.phoneNumber || userInfo.phone || mockUsers[userIndex].phone,
        phoneNumber: userInfo.phone || userInfo.phoneNumber || mockUsers[userIndex].phoneNumber
      };
      
      // 如果更新了用户角色
      if (userInfo.role) {
        mockUsers[userIndex].userInfo.role = userInfo.role === 'teacher' ? '老师' : '学生';
      }
      
      return mockApiResponse(true, {
        message: '用户信息更新成功',
        userInfo: mockUsers[userIndex]
      });
    } else {
      return mockApiResponse(false, null, {
        message: '用户不存在'
      });
    }
  } catch (error) {
    console.error('模拟更新用户信息失败:', error);
    return mockApiResponse(false, null, {
      message: '更新用户信息失败'
    });
  }
};

/**
 * 模拟更新用户角色
 * @param {string} role - 用户角色
 * @returns {Promise<Object>} 更新结果
 */
export const updateRole = async (role) => {
  try {
    // 模拟网络延迟
    await delay(200);
    
    const userId = uni.getStorageSync('userId');
    
    if (!userId) {
      return mockApiResponse(false, null, {
        message: '用户未登录'
      });
    }
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      // 更新用户角色
      mockUsers[userIndex].role = role;
      mockUsers[userIndex].userInfo.role = role === 'teacher' ? '老师' : '学生';
      
      return mockApiResponse(true, {
        message: '角色更新成功',
        role: role
      });
    } else {
      return mockApiResponse(false, null, {
        message: '用户不存在'
      });
    }
  } catch (error) {
    console.error('模拟更新用户角色失败:', error);
    return mockApiResponse(false, null, {
      message: '更新用户角色失败'
    });
  }
}; 
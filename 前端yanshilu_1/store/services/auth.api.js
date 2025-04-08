/**
 * @description 用户认证相关API服务
 */

import { Base64 } from 'js-base64';

/**
 * @description 模拟登录请求
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @param {string} credentials.role - 角色（student/teacher）
 * @returns {Promise<Object>} 登录结果
 */
export const login = (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { username, role } = credentials;
      
      // 创建JWT payload
      const payload = {
        sub: `user_${Date.now()}`,
        name: username,
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7200 // 2小时后过期
      };
      
      // 模拟JWT结构 (header.payload.signature)
      const header = Base64.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payloadBase64 = Base64.encode(JSON.stringify(payload));
      const signature = Base64.encode('mock_signature'); // 模拟签名
      
      const token = `${header}.${payloadBase64}.${signature}`;
      const refreshToken = `refresh_${header}.${Base64.encode(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 86400 // 24小时后过期
      }))}.${signature}`;
      
      resolve({
        success: true,
        data: {
          token,
          refreshToken,
          expiresIn: 7200,
          userInfo: {
            name: username,
            avatar: 'https://example.com/avatar.png',
            tags: ['标签1', '标签2'],
            balance: role === 'teacher' ? 1000 : null,
            bio: role === 'teacher' ? '资深导师，专注于学术指导' : '热爱学习的学生',
            contact: {
              phone: '138****1234',
              email: `${username}@example.com`,
              wechat: username
            }
          },
          role
        }
      });
    }, 500);
  });
};

/**
 * @description 模拟获取用户信息
 * @param {string} token - 用户token
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const role = token.startsWith('teacher') ? 'teacher' : 'student';
      resolve({
        success: true,
        data: {
          name: `${role}用户`,
          avatar: 'https://example.com/avatar.png',
          tags: ['标签1', '标签2', '标签3'],
          balance: role === 'teacher' ? 1500 : null,
          bio: role === 'teacher' ? '资深导师，专注于学术指导' : '热爱学习的学生',
          contact: {
            phone: '138****1234',
            email: `${role}@example.com`,
            wechat: `${role}_user`
          },
          notifications: {
            unread: 3,
            messages: [
              {id: 'm1', type: 'system', content: '系统通知', read: false, time: Date.now() - 3600000},
              {id: 'm2', type: 'chat', content: '新聊天消息', read: false, time: Date.now() - 7200000},
              {id: 'm3', type: 'order', content: '订单状态更新', read: false, time: Date.now() - 10800000}
            ]
          }
        }
      });
    }, 600);
  });
};

/**
 * @description 模拟刷新token
 * @param {string} refreshToken - 刷新token
 * @returns {Promise<Object>} 新的token信息
 */
export const refreshToken = (refreshToken) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: `new_token_${Date.now()}`,
          refreshToken: `new_refresh_token_${Date.now()}`,
          expiresIn: 7200 // 2小时有效期
        }
      });
    }, 300);
  });
};

/**
 * @description JWT辅助函数
 */
export const jwt = {
  /**
   * @description 解码JWT令牌
   * @param {string} token - JWT令牌
   * @returns {Object|null} 解码后的载荷
   */
  decode(token) {
    try {
      if (!token) return null;
      return jwtDecode(token);
    } catch (error) {
      console.error('Token解析失败:', error);
      return null;
    }
  },
  
  /**
   * @description 校验JWT令牌是否有效
   * @param {string} token - JWT令牌
   * @returns {boolean} 是否有效
   */
  isValid(token) {
    try {
      const decoded = this.decode(token);
      if (!decoded) return false;
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}; 
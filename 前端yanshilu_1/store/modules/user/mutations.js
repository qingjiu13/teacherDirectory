/**
 * @description 用户模块的mutations
 */

export default {
  /**
   * @description 设置登录状态
   * @param {Object} state - 状态对象
   * @param {boolean} isLoggedIn - 是否已登录
   */
  SET_LOGGED_IN(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
    // 将登录状态保存到本地存储
    uni.setStorageSync('isLoggedIn', isLoggedIn);
  },
  
  /**
   * @description 设置用户角色
   * @param {Object} state - 状态对象
   * @param {string} role - 用户角色
   */
  SET_ROLE(state, role) {
    state.role = role;
    // 将角色保存到本地存储
    uni.setStorageSync('role', role);
  },
  
  /**
   * @description 设置认证信息
   * @param {Object} state - 状态对象
   * @param {Object} authData - 认证数据
   * @param {string} authData.token - 访问令牌
   * @param {string} authData.refreshToken - 刷新令牌
   * @param {number} authData.expiresIn - 过期时间（秒）
   */
  SET_AUTH(state, authData) {
    const { token, refreshToken, expiresIn } = authData;
    const tokenExpireTime = Date.now() + (expiresIn * 1000);
    
    state.auth = {
      token,
      refreshToken,
      tokenExpireTime
    };
    
    // 将认证信息保存到本地存储
    uni.setStorageSync('token', token);
    uni.setStorageSync('refreshToken', refreshToken);
    uni.setStorageSync('tokenExpireTime', tokenExpireTime);
  },
  
  /**
   * @description 设置用户信息
   * @param {Object} state - 状态对象
   * @param {Object} userInfo - 用户信息
   */
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
    
    // 将基本用户信息保存到本地存储
    uni.setStorageSync('userBaseInfo', {
      name: userInfo.name,
      avatar: userInfo.avatar,
      tags: userInfo.tags || []
    });
    
    // 将详细用户信息保存到本地存储
    uni.setStorageSync('userDetailInfo', JSON.stringify(userInfo));
  },
  
  /**
   * @description 更新用户信息（部分更新）
   * @param {Object} state - 状态对象
   * @param {Object} partialInfo - 部分用户信息
   */
  UPDATE_USER_INFO(state, partialInfo) {
    state.userInfo = {
      ...state.userInfo,
      ...partialInfo
    };
    
    // 更新本地存储
    if (partialInfo.name || partialInfo.avatar || partialInfo.tags) {
      uni.setStorageSync('userBaseInfo', {
        name: state.userInfo.name,
        avatar: state.userInfo.avatar,
        tags: state.userInfo.tags || []
      });
    }
    
    uni.setStorageSync('userDetailInfo', JSON.stringify(state.userInfo));
  },
  
  /**
   * @description 设置用户权限
   * @param {Object} state - 状态对象
   * @param {Array} permissions - 权限列表
   */
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions;
  },
  
  /**
   * @description 清除认证信息
   * @param {Object} state - 状态对象
   */
  CLEAR_AUTH(state) {
    state.isLoggedIn = false;
    state.role = null;
    state.auth = {
      token: null,
      refreshToken: null,
      tokenExpireTime: null
    };
    state.userInfo = {
      name: '',
      avatar: '',
      tags: [],
      balance: null,
      bio: '',
      contact: {
        phone: '',
        email: '',
        wechat: ''
      },
      notifications: {
        unread: 0,
        messages: []
      }
    };
    state.permissions = [];
    
    // 清除本地存储
    uni.removeStorageSync('token');
    uni.removeStorageSync('refreshToken');
    uni.removeStorageSync('tokenExpireTime');
    uni.removeStorageSync('isLoggedIn');
    uni.removeStorageSync('role');
    uni.removeStorageSync('userBaseInfo');
    uni.removeStorageSync('userDetailInfo');
  },
  
  /**
   * @description 设置注册状态
   * @param {Object} state - 状态对象
   * @param {Object} registrationData - 注册数据
   * @param {number} registrationData.step - 当前步骤
   * @param {boolean} registrationData.completed - 是否完成
   * @param {Object} registrationData.data - 注册数据
   */
  SET_REGISTRATION(state, registrationData) {
    state.registration = {
      ...state.registration,
      ...registrationData
    };
  }
}; 
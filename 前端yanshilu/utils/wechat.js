/**
 * 微信小程序工具类
 * @module utils/wechat
 */

/**
 * 获取微信登录凭证
 * @returns {Promise<object>} 登录结果对象，包含 code
 */
export function wxLogin() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve({ code: res.code });
        } else {
          reject(new Error('微信登录失败'));
        }
      },
      fail: (err) => {
        reject(new Error('微信登录失败: ' + JSON.stringify(err)));
      }
    });
    // #endif
    
    // #ifndef MP-WEIXIN
    reject(new Error('当前不是微信小程序环境'));
    // #endif
  });
}

/**
 * 获取用户信息
 * @returns {Promise<object>} 用户信息
 */
export function getUserProfile() {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve(res.userInfo);
      },
      fail: (err) => {
        reject(new Error('获取用户信息失败: ' + JSON.stringify(err)));
      }
    });
    // #endif
    
    // #ifndef MP-WEIXIN
    reject(new Error('当前不是微信小程序环境'));
    // #endif
  });
}

/**
 * 检查用户是否授权获取用户信息
 * @returns {Promise<boolean>} 是否已授权
 */
export function checkUserInfoAuth() {
  return new Promise((resolve) => {
    // #ifdef MP-WEIXIN
    uni.getSetting({
      success: (res) => {
        resolve(!!res.authSetting['scope.userInfo']);
      },
      fail: () => {
        resolve(false);
      }
    });
    // #endif
    
    // #ifndef MP-WEIXIN
    resolve(false);
    // #endif
  });
}

/**
 * 获取微信用户手机号
 * @returns {Promise<object>} 包含加密数据的对象
 */
export function getPhoneNumber() {
  // 注意：微信小程序获取手机号需要通过button组件的getPhoneNumber事件获取
  // 此方法仅作为占位符，实际业务需在组件中处理
  return Promise.reject(new Error('请通过button组件的getPhoneNumber事件获取手机号'));
}

/**
 * 微信一键登录并获取用户信息
 * @returns {Promise<object>} 登录结果和用户信息
 */
export async function wxQuickLogin() {
  try {
    // 登录获取code
    const loginResult = await wxLogin();
    
    // 尝试获取用户信息
    try {
      const userInfo = await getUserProfile();
      return {
        ...loginResult,
        userInfo
      };
    } catch (userInfoErr) {
      // 获取用户信息失败，仅返回登录凭证
      return loginResult;
    }
  } catch (error) {
    throw error;
  }
}

export default {
  wxLogin,
  getUserProfile,
  checkUserInfoAuth,
  getPhoneNumber,
  wxQuickLogin
}; 
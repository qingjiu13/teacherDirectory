/**
 * 微信手机号获取API
 * 处理微信手机号授权、解密等相关接口
 */

/**
 * 获取微信登录code
 * @returns {Promise} 返回包含code的Promise对象
 */
export function getWechatLoginCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error('获取微信登录code失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 通过code获取openid和session_key
 * @param {string} code - 微信登录code
 * @returns {Promise} 返回包含openid和sessionkey的Promise对象
 */
export function getOpenidAndSessionKey(code) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '登录接口', // 需替换为实际接口
      method: 'POST',
      data: {
        account: '1514382701',
        jscode: code
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.r === "T") {
          // 存储到本地缓存
          uni.setStorage({
            key: "openid",
            data: res.data.openid
          });
          uni.setStorage({
            key: "sessionkey",
            data: res.data.sessionkey
          });
          
          resolve({
            openid: res.data.openid,
            sessionkey: res.data.sessionkey
          });
        } else {
          reject(new Error('获取openid失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 解密微信手机号
 * @param {string} encryptedData - 加密数据
 * @param {string} iv - 初始向量
 * @param {string} sessionkey - 会话密钥
 * @returns {Promise} 返回解密后的手机号
 */
export function decryptPhoneNumber(encryptedData, iv, sessionkey) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '自己的解密接口', // 需替换为实际接口
      method: 'POST',
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: sessionkey
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve(res.data.d.phoneNumber);
        } else {
          reject(new Error('解密手机号失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}



/**
 * 检查微信会话是否有效
 * @returns {Promise} 返回会话状态
 */
export function checkWechatSession() {
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

/**
 * 获取存储的openid
 * @returns {Promise} 返回openid
 */
export function getStoredOpenid() {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: 'openid',
      success: (res) => {
        resolve(res.data);
      },
      fail: () => {
        reject(new Error('未找到存储的openid'));
      }
    });
  });
}

/**
 * 获取微信绑定的遮罩手机号（用于弹窗显示）
 * @returns {Promise} 返回遮罩手机号信息
 */
export function getMaskedPhone() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '获取遮罩手机号接口', // 需替换为实际接口
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve({
            maskedPhone: res.data.maskedPhone,
            isWechatBound: res.data.isWechatBound
          });
        } else {
          reject(new Error('获取遮罩手机号失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

export default {
  getWechatLoginCode,
  getOpenidAndSessionKey,
  decryptPhoneNumber,
  checkWechatSession,
  getStoredOpenid,
  getMaskedPhone
};

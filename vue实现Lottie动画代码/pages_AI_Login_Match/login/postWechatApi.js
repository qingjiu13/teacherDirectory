/**
 * 微信登录相关API接口
 */

/**
 * 发送用户信息到后端
 * @param {Object} userInfo - 用户信息
 * @param {string} userInfo.nickname - 用户昵称
 * @param {string} userInfo.avatar - 用户头像
 * @param {string} userInfo.openid - 用户openid
 * @returns {Promise} 返回请求结果
 */
export function postUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: '用户信息接口', // 需替换为实际接口
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        openid: userInfo.openid,
        timestamp: Date.now()
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve(res.data);
        } else {
          reject(new Error(res.data.msg || '提交用户信息失败'));
        }
      },
      fail: (error) => {
        reject(new Error('网络请求失败'));
      }
    });
  });
}


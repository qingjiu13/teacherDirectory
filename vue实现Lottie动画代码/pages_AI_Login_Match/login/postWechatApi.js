/**
 * 微信登录相关API接口
 */



/**
 * 获取默认头像列表
 * @returns {Promise<Array>} 返回默认头像URL列表
 */
export function getDefaultAvatarList() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/common/defaultAvatarList',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve(res.data.avatarList || []);
        } else {
          reject(new Error(res.data.msg || '获取默认头像列表失败'));
        }
      },
      fail: (error) => {
        reject(new Error('获取默认头像列表网络请求失败'));
      }
    });
  });
}

/**
 * 上传用户自定义头像文件
 * @param {string} filePath - 本地文件路径
 * @returns {Promise<Object>} 返回上传结果，包含头像URL
 */
export function uploadAvatarFile(filePath) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'https://your-api-domain.com/api/common/uploadAvatarFile',
      filePath: filePath,
      name: 'avatar',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        type: 'avatar',
        timestamp: Date.now()
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.r === "T") {
            resolve({
              url: data.url,
              message: data.msg || '上传成功'
            });
          } else {
            reject(new Error(data.msg || '上传头像失败'));
          }
        } catch (error) {
          reject(new Error('服务器响应格式错误'));
        }
      },
      fail: (error) => {
        reject(new Error('上传头像网络请求失败'));
      }
    });
  });
}


/**
 * JWT相关工具函数
 * @module store/user/JWT
 */

// 导入 store
import store from '@/store/index.js';
import { jwtDecode } from "jwt-decode";



/**
 * 获取当前登录用户ID（从JWT token解析）
 * @returns {number|null}
 */
export const getCurrentUserId = () => {
  const token = getCurrentToken();
  console.log("[调试] JWT Token:", token);
  if (!token) {
    console.log("[调试] Token为空，返回null");
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    console.log("[调试] JWT解码结果:", decoded);
    console.log("[调试] decoded.userid:", decoded.userid);
    console.log("[调试] decoded.sub:", decoded.sub);

    // 后端使用的是 'userid' 字段，不是 'sub'
    const userId = decoded.userid;
    console.log("[调试] 最终用户ID:", userId);
    console.log("[调试] 最终用户ID类型:", typeof userId);

    return Number(userId) || null;
  } catch (e) {
    console.error("[调试] JWT解析失败:", e);
    return null;
  }
};
/**
 * 获取当前存储的JWT令牌
 * @returns {string} JWT令牌
 */
export const getCurrentToken = () => {
    return store.state.user.baseInfo.jwtToken;
};

/**
 * 统一API请求工具（自动携带JWT令牌）
 * @param {string} url - 请求URL
 * @param {string} [method='GET'] - 请求方法
 * @param {Object} [data={}] - 请求数据
 * @param {Object} [options={}] - 额外选项
 * @param {boolean} [options.requireAuth=true] - 是否要求认证
 * @param {boolean} [options.showError=true] - 是否显示错误提示
 * @param {Object} [options.customHeader={}] - 自定义请求头
 * @returns {Promise<Object>} 请求结果Promise
 */
export const apiRequest = (url, method = 'GET', data = {}, options = {}) => {
    const defaultOptions = {
        requireAuth: true,
        showError: true,
        customHeader: {}
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
        // 获取JWT令牌
        const token = getCurrentToken();
        console.log('token',token);
        
        // 如果需要认证但没有令牌
        if (finalOptions.requireAuth && !token) {
            const error = {
                success: false,
                error: {
                    code: 401,
                    message: '未登录，请先登录'
                }
            };
            
            if (finalOptions.showError) {
                uni.showToast({
                    title: error.error.message,
                    icon: 'none',
                    duration: 2000
                });
            }
            
            reject(error);
            return;
        }
        
        // 准备请求头
        const headers = {
            'Content-Type': 'application/json',
            ...finalOptions.customHeader
        };
        
        // 如果有令牌则添加到请求头
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 发送请求
        uni.request({
            url,
            method: method.toUpperCase(),
            data: data,
            header: headers,
            success: (res) => {
                // 请求成功 - 优化响应处理逻辑
                if (res.statusCode === 200) {
                    // 如果响应数据存在且格式正确
                    if (res.data) {
                        // 处理标准格式 {code: 200, data: {...}}
                        if (res.data.code === 200) {
                            resolve({
                                success: true,
                                data: res.data
                            });
                        } else {
                            // 处理业务错误 {code: 非200, msg: "错误信息"}
                            resolve({
                                success: false,
                                message: res.data.msg || res.data.message || '请求失败',
                                data: res.data
                            });
                        }
                    } else {
                        // 处理空响应
                        resolve({
                            success: true,
                            data: null
                        });
                    }
                } else if (res.statusCode === 401 || res.statusCode === 403) {
                    // 认证失败，清除令牌
                    store.commit('user/baseInfo/CLEAR_JWT_TOKEN');
                    
                    const error = {
                        success: false,
                        error: {
                            statusCode: res.statusCode,
                            message: res.data?.msg || (res.statusCode === 401 ? '认证已过期，请重新登录' : '无权访问')
                        }
                    };
                    
                    if (finalOptions.showError) {
                        uni.showToast({
                            title: error.error.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    
                    reject(error);
                } else {
                    // HTTP状态码错误
                    const error = {
                        success: false,
                        error: {
                            statusCode: res.statusCode,
                            message: res.data?.msg || `HTTP错误: ${res.statusCode}`
                        }
                    };
                    
                    if (finalOptions.showError) {
                        uni.showToast({
                            title: error.error.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    
                    reject(error);
                }
            },
            fail: (err) => {
                // 网络请求失败
                const error = {
                    success: false,
                    error: {
                        message: err.errMsg || '网络请求失败'
                    }
                };
                
                if (finalOptions.showError) {
                    uni.showToast({
                        title: error.error.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
                
                reject(error);
            }
        });
    });
};

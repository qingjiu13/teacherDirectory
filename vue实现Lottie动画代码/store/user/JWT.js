/**
 * JWT相关工具函数
 * @module store/user/JWT
 */

// 导入 store
import store from '@/store/index.js';

/**
 * 获取当前存储的JWT令牌
 * @returns {string} JWT令牌
 */
export const getCurrentToken = () => {
    return store.state.user.baseInfo.jwtToken || '';
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
                // 请求成功
                if (res.statusCode === 200 && res.data && res.data.code === 200) {
                    resolve({
                        success: true,
                        data: res.data.data
                    });
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
                    // 其他业务逻辑错误
                    const error = {
                        success: false,
                        error: {
                            statusCode: res.statusCode,
                            message: res.data?.msg || '请求失败'
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

/**
 * @description API接口封装模块
 */

// API基础配置
const API_CONFIG = {
    BASE_URL: 'https://api.yourserviceurl.com', // 修改为您的实际API地址
    TIMEOUT: 30000, // 默认超时时间（30秒）
    RETRY_COUNT: 2, // 失败重试次数
    VERSION: 'v1' // API版本
};

// API路径常量
const API_PATHS = {
    CHAT: '/chat',
    USER: '/user'
};

// 错误码和消息映射
const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接失败，请检查您的网络设置',
    TIMEOUT_ERROR: '请求超时，请稍后再试',
    SERVER_ERROR: '服务器错误，请稍后再试',
    AUTH_ERROR: '身份验证失败，请重新登录',
    INVALID_PARAM: '参数错误',
    RATE_LIMIT: '请求过于频繁，请稍后再试',
    UNKNOWN_ERROR: '未知错误，请稍后再试',
    ABORT_ERROR: '请求已被取消'
};

/**
 * @description 创建请求头
 * @param {Object} customHeaders - 自定义请求头
 * @returns {Object} 完整的请求头对象
 */
const createHeaders = (customHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'X-Client-Version': API_CONFIG.VERSION,
        ...customHeaders
    };

    // 从存储中获取token（如果有）
    try {
        const token = uni.getStorageSync('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        console.error('获取token失败:', e);
    }

    return headers;
};

/**
 * @description 创建完整的API URL
 * @param {String} path - API路径
 * @returns {String} 完整的API URL
 */
const createApiUrl = (path) => {
    return `${API_CONFIG.BASE_URL}${path}`;
};

/**
 * @description 处理响应错误
 * @param {Object} error - 错误对象
 * @returns {Error} 格式化的错误对象
 */
const handleResponseError = (error) => {
    let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    
    if (error.name === 'AbortError') {
        return new Error(ERROR_MESSAGES.ABORT_ERROR);
    }
    
    if (typeof error === 'string') {
        return new Error(error);
    }
    
    if (error.statusCode) {
        // 处理HTTP状态码错误
        if (error.statusCode === 401 || error.statusCode === 403) {
            errorMessage = ERROR_MESSAGES.AUTH_ERROR;
        } else if (error.statusCode === 404) {
            errorMessage = '请求的资源不存在';
        } else if (error.statusCode === 429) {
            errorMessage = ERROR_MESSAGES.RATE_LIMIT;
        } else if (error.statusCode >= 500) {
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
        }
    } else if (error.errMsg) {
        // 处理uni请求错误
        if (error.errMsg.includes('timeout')) {
            errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
        } else if (error.errMsg.includes('fail')) {
            errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
        }
    }
    
    // 包含原始错误信息以便调试
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    
    return enhancedError;
};

/**
 * @description 中断请求
 * @param {AbortController} controller - 请求控制器
 */
export const abortRequest = (controller) => {
    if (controller) {
        try {
            controller.abort();
        } catch (e) {
            console.error('中断请求失败:', e);
        }
    }
};

/**
 * @description 发送聊天消息到AI并处理流式响应
 * @param {Object} params - 请求参数，包含用户消息和上下文
 * @param {Function} onChunk - 处理流式数据块的回调
 * @param {AbortSignal} signal - 用于取消请求的信号
 * @returns {Promise<void>} Promise对象
 */
export const sendChatMessage = async (params, onChunk, signal) => {
    const url = createApiUrl(API_PATHS.CHAT);
    const headers = createHeaders({
        'Accept': 'text/event-stream',
        'X-Stream-Mode': 'true'
    });
    
    try {
        // 准备请求数据
        const requestData = {
            message: params.message,
            mode: params.context?.mode || 'general',
            userInfo: {
                school: params.context?.userSchool,
                major: params.context?.userMajor
            },
            history: params.history || []
        };
        
        // 检查环境 - 微信小程序不支持 fetch 和 ReadableStream API
        // #ifdef MP-WEIXIN
        // 微信小程序环境 - 使用模拟流式响应方式
        return await handleWeixinChatRequest(url, headers, requestData, onChunk);
        // #endif
        
        // #ifndef MP-WEIXIN
        // 非微信小程序环境 - 使用标准 fetch API
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData)
        };
        
        // 仅在支持 AbortController 的环境中添加信号
        if (signal) {
            requestOptions.signal = signal;
        }
        
        // 创建Fetch请求
        const response = await fetch(url, requestOptions);
        
        // 检查响应状态
        if (!response.ok) {
            let errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw { 
                    statusCode: response.status, 
                    message: errorJson.message || `HTTP错误 ${response.status}` 
                };
            } catch (e) {
                throw { 
                    statusCode: response.status, 
                    message: `HTTP错误 ${response.status}` 
                };
            }
        }
        
        // 获取响应流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // 处理流式响应
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }
            
            // 解码数据
            const chunk = decoder.decode(value, { stream: true });
            
            // 处理解码后的块数据
            processStreamChunk(chunk, onChunk);
        }
        // #endif
        
        return true;
    } catch (error) {
        throw handleResponseError(error);
    }
};

/**
 * @description 微信小程序环境下的聊天请求处理（模拟流式响应）
 * @param {String} url - 请求URL
 * @param {Object} headers - 请求头
 * @param {Object} requestData - 请求数据
 * @param {Function} onChunk - 数据块处理回调
 * @returns {Promise<Boolean>} 请求结果
 * @private
 */
const handleWeixinChatRequest = async (url, headers, requestData, onChunk) => {
    return new Promise((resolve, reject) => {
        // 微信小程序环境使用uni.request
        uni.request({
            url: url,
            method: 'POST',
            header: headers,
            data: requestData,
            timeout: API_CONFIG.TIMEOUT,
            success: (res) => {
                if (res.statusCode !== 200) {
                    return reject({
                        statusCode: res.statusCode,
                        message: `HTTP错误 ${res.statusCode}`
                    });
                }
                
                // 模拟流式响应，将返回的数据按字符分割
                const simulateStreamResponse = (text) => {
                    if (!text) return resolve(true);
                    
                    // 每次发送的字符数
                    const chunkSize = 5;
                    // 间隔时间(毫秒)
                    const interval = 50;
                    
                    let index = 0;
                    
                    const sendChunk = () => {
                        if (index >= text.length) {
                            return resolve(true);
                        }
                        
                        const end = Math.min(index + chunkSize, text.length);
                        const chunk = text.substring(index, end);
                        
                        onChunk(chunk);
                        index = end;
                        
                        setTimeout(sendChunk, interval);
                    };
                    
                    sendChunk();
                };
                
                // 处理响应数据
                if (typeof res.data === 'string') {
                    simulateStreamResponse(res.data);
                } else if (res.data && res.data.content) {
                    simulateStreamResponse(res.data.content);
                } else {
                    // 如果没有有效数据，直接返回成功
                    resolve(true);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

/**
 * @description 处理流式响应的数据块
 * @param {String} chunk - 数据块
 * @param {Function} onChunk - 处理回调
 */
const processStreamChunk = (chunk, onChunk) => {
    if (!chunk) return;
    
    // 根据服务器的流格式进行处理
    // 示例：假设服务器以 "data: " 前缀发送数据
    const lines = chunk.split('\n');
    
    for (const line of lines) {
        if (line.startsWith('data: ')) {
            const data = line.substring(6); // 移除 "data: " 前缀
            
            if (data === '[DONE]') {
                // 流结束标记
                return;
            }
            
            try {
                // 尝试解析JSON数据
                const parsedData = JSON.parse(data);
                if (parsedData.content) {
                    onChunk(parsedData.content);
                }
            } catch (e) {
                // 如果不是JSON，则直接传递数据
                onChunk(data);
            }
        } else if (line.trim() !== '') {
            // 处理其他非空行，可能是纯文本内容
            onChunk(line);
        }
    }
};

/**
 * @description 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async () => {
    const url = createApiUrl(API_PATHS.USER);
    const headers = createHeaders();
    
    try {
        const response = await uni.request({
            url: url,
            method: 'GET',
            header: headers,
            timeout: API_CONFIG.TIMEOUT
        });
        
        if (response.statusCode !== 200) {
            throw { statusCode: response.statusCode };
        }
        
        return response.data;
    } catch (error) {
        throw handleResponseError(error);
    }
};

// 导出API配置，便于其他模块使用
export const apiConfig = API_CONFIG;

/**
 * 安全的JSON解析工具函数
 * @module utils/safeJsonParse
 */

/**
 * 安全地解析JSON字符串
 * @param {string|any} data - 要解析的数据
 * @param {any} defaultValue - 解析失败时的默认值
 * @returns {any} 解析后的数据或默认值
 */
export function safeJsonParse(data, defaultValue = null) {
  if (!data) {
    return defaultValue;
  }

  // 如果已经是对象，直接返回
  if (typeof data === "object" && data !== null) {
    return data;
  }

  // 如果不是字符串，返回默认值
  if (typeof data !== "string") {
    return defaultValue;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("JSON解析失败:", error, "原始数据:", data);
    return defaultValue;
  }
}

/**
 * 安全地从uni.getStorageSync获取并解析JSON数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 解析失败时的默认值
 * @returns {any} 解析后的数据或默认值
 */
export function safeGetStorageJson(key, defaultValue = null) {
  try {
    const data = uni.getStorageSync(key);
    return safeJsonParse(data, defaultValue);
  } catch (error) {
    console.error(`获取存储数据失败 (key: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * 安全地设置JSON数据到uni存储
 * @param {string} key - 存储键名
 * @param {any} data - 要存储的数据
 * @returns {boolean} 是否成功
 */
export function safeSetStorageJson(key, data) {
  try {
    const jsonString = JSON.stringify(data);
    uni.setStorageSync(key, jsonString);
    return true;
  } catch (error) {
    console.error(`设置存储数据失败 (key: ${key}):`, error);
    return false;
  }
}

/**
 * 随机昵称生成器
 * 生成格式：师门 + 5位随机数字
 */

/**
 * 生成随机昵称
 * @returns {string} 返回格式为"师门xxxxx"的随机昵称
 */
export function generateRandomNickName() {
  // 生成5位随机数字（10000-99999）
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return `师门${randomNumber}`;
}

/**
 * 生成指定长度的随机数字
 * @param {number} length - 数字长度
 * @returns {string} 返回指定长度的随机数字字符串
 */
export function generateRandomNumber(length = 5) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

/**
 * 生成带前缀的随机昵称
 * @param {string} prefix - 前缀，默认为"师门"
 * @param {number} numberLength - 数字长度，默认为5位
 * @returns {string} 返回完整的随机昵称
 */
export function generateNickNameWithPrefix(prefix = '师门', numberLength = 5) {
  const randomNumber = generateRandomNumber(numberLength);
  return `${prefix}${randomNumber}`;
}

export default {
  generateRandomNickName,
  generateRandomNumber,
  generateNickNameWithPrefix
};

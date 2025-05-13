/**
 * 将时间戳转换为格式化的日期字符串（精确到分钟）
 * @param {number|string} timestamp - 需要转换的时间戳（秒或毫秒）
 * @param {string} [format='YYYY-MM-DD HH:mm'] - 日期格式，默认 'YYYY-MM-DD HH:mm'
 * @returns {string} 格式化后的日期字符串
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm') {
  // 处理时间戳为毫秒
  let ts = Number(timestamp);
  if (ts.toString().length === 10) {
    ts *= 1000;
  }
  const date = new Date(ts);

  /**
   * 补零函数
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  // 替换格式（只到分钟）
  return format
    .replace('YYYY', date.getFullYear())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()));
}

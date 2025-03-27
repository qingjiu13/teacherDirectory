/**
 * @description 应用配置文件
 * @module config
 */

'use strict';

/**
 * @description 数据库配置
 */
const DATABASE = {
  // 数据库连接URI，生产环境应从环境变量获取
  URI: process.env.DB_URI || 'mongodb://localhost:27017/yanshilu',
  
  // 数据库连接选项
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // 根据实际情况配置连接池等参数
    poolSize: 10,
    // 认证信息（根据需要配置）
    // auth: {
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD
    // }
  }
};

/**
 * @description 运行环境配置
 */
const ENVIRONMENT = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
};

/**
 * @description API响应状态码
 */
const RESPONSE_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  AUTH_ERROR: 401,
  NOT_FOUND: 404
};

/**
 * @description 导出配置
 */
module.exports = {
  DATABASE,
  ENVIRONMENT,
  RESPONSE_CODE
}; 
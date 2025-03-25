/**
 * @description uniCloud适配器模块
 * @module unicloud-adapter
 */

'use strict';
const db = require('./db')();

/**
 * @description 模拟uniCloud对象
 */
const uniCloud = {
  /**
   * @description 数据库实例
   */
  database: () => {
    return db;
  },
  
  /**
   * @description 云存储
   */
  uploadFile: async (options) => {
    // 云存储上传文件适配
    console.log('云存储上传被调用，需要实现自定义逻辑');
    throw new Error('云存储功能需要自定义实现');
  },
  
  /**
   * @description 云函数调用
   */
  callFunction: async (options) => {
    // 云函数调用适配
    console.log('云函数调用被调用，需要重构为本地函数调用');
    throw new Error('云函数调用需要自定义实现');
  }
};

/**
 * @description OPENID上下文模拟
 */
const context = {
  OPENID: null,
  APPID: null,
  UNIONID: null,
  PLATFORM: 'custom',
  OS: process.platform,
  
  /**
   * @description 设置上下文信息
   * @param {object} info - 上下文信息
   */
  set: function(info) {
    Object.assign(this, info);
  }
};

module.exports = {
  uniCloud,
  context
}; 
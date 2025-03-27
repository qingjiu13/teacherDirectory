/**
 * @description 数据库连接模块
 * @module db
 */

'use strict';
const mongoose = require('mongoose');
const config = require('./config');

let isConnected = false;
let db = null;

/**
 * @description 初始化数据库连接
 * @returns {Promise<object>} 数据库连接对象
 */
async function connect() {
  if (isConnected) {
    return db;
  }
  
  try {
    // 使用配置文件中的数据库连接信息
    const connection = await mongoose.connect(config.DATABASE.URI, config.DATABASE.OPTIONS);
    
    console.log('数据库连接成功');
    isConnected = true;
    db = connection;
    return db;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

/**
 * @description 创建一个类似uniCloud的数据库API
 * @returns {object} 数据库对象
 */
function database() {
  return {
    /**
     * @description 获取集合对象
     * @param {string} name - 集合名称
     * @returns {object} 集合对象
     */
    collection: function(name) {
      return collection(name);
    },
    
    /**
     * @description 命令对象，用于特殊操作
     */
    command: {
      /**
       * @description 递增操作
       * @param {number} val - 递增值
       * @returns {object} 更新操作
       */
      inc: function(val) {
        return { $inc: val };
      }
    }
  };
}

/**
 * @description 获取集合对象
 * @param {string} name - 集合名称
 * @returns {object} 集合对象
 */
function collection(name) {
  // 确保连接已初始化
  connect();
  
  // 获取模型
  const model = getModel(name);
  
  return {
    /**
     * @description 查询文档
     * @param {object} query - 查询条件
     * @returns {object} 查询对象
     */
    where: function(query) {
      const queryObj = model.find(query);
      return {
        /**
         * @description 获取查询结果
         * @returns {Promise<object>} 查询结果
         */
        get: async function() {
          const result = await queryObj.exec();
          return { data: result };
        },
        
        /**
         * @description 获取结果数量
         * @returns {Promise<object>} 包含total字段的对象
         */
        count: async function() {
          const count = await model.countDocuments(query);
          return { total: count };
        },
        
        /**
         * @description 按字段排序
         * @param {string} field - 排序字段
         * @param {string} direction - 排序方向
         * @returns {object} 查询对象
         */
        orderBy: function(field, direction) {
          const sort = {};
          sort[field] = direction === 'desc' ? -1 : 1;
          queryObj.sort(sort);
          return this;
        },
        
        /**
         * @description 跳过指定数量的文档
         * @param {number} n - 跳过数量
         * @returns {object} 查询对象
         */
        skip: function(n) {
          queryObj.skip(n);
          return this;
        },
        
        /**
         * @description 限制返回的文档数量
         * @param {number} n - 限制数量
         * @returns {object} 查询对象
         */
        limit: function(n) {
          queryObj.limit(n);
          return this;
        },
        
        /**
         * @description 更新文档
         * @param {object} data - 更新数据
         * @returns {Promise<object>} 更新结果
         */
        update: async function(data) {
          return await model.updateMany(query, { $set: data });
        }
      };
    },
    
    /**
     * @description 通过ID查询文档
     * @param {string} id - 文档ID
     * @returns {object} 查询对象
     */
    doc: function(id) {
      return {
        /**
         * @description 获取单个文档
         * @returns {Promise<object>} 查询结果
         */
        get: async function() {
          const result = await model.findById(id);
          return { data: result ? [result] : [] };
        },
        
        /**
         * @description 更新文档
         * @param {object} data - 更新数据
         * @returns {Promise<object>} 更新结果
         */
        update: async function(data) {
          return await model.findByIdAndUpdate(id, data);
        }
      };
    },
    
    /**
     * @description 添加新文档
     * @param {object} data - 文档数据
     * @returns {Promise<object>} 添加结果
     */
    add: async function(data) {
      const newDoc = new model(data);
      const result = await newDoc.save();
      return { id: result._id };
    },
    
    /**
     * @description 限制返回的文档数量
     * @param {number} n - 限制数量
     * @returns {object} 查询对象
     */
    limit: function(n) {
      const queryObj = model.find().limit(n);
      return {
        get: async function() {
          const result = await queryObj.exec();
          return { data: result };
        }
      };
    }
  };
}

/**
 * @description 获取集合模型
 * @param {string} name - 集合名称
 * @returns {object} Mongoose模型
 */
function getModel(name) {
  // 如果模型已存在，直接返回
  if (mongoose.models[name]) {
    return mongoose.models[name];
  }
  
  // 为每个集合创建一个动态Schema
  // 实际应用中，应该为每个集合定义明确的Schema
  const schema = new mongoose.Schema({}, { strict: false });
  return mongoose.model(name, schema);
}

module.exports = database; 
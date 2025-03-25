/**
 * @description 云函数HTTP服务器
 */

'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 动态加载云函数
const functionsPath = path.join(__dirname);
const functionModules = {};

// 递归读取目录结构，查找index.js文件作为云函数入口
function loadCloudFunctions(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 如果是common目录，跳过
      if (item === 'common') continue;
      
      // 构建路径
      const relativePath = path.join(basePath, item);
      
      // 查找是否有index.js
      const indexPath = path.join(fullPath, 'index.js');
      if (fs.existsSync(indexPath)) {
        // 将目录名作为函数名
        const functionName = item;
        console.log(`加载云函数: ${functionName}`);
        
        try {
          // 加载模块
          const moduleExports = require(indexPath);
          functionModules[functionName] = moduleExports;
        } catch (error) {
          console.error(`加载云函数 ${functionName} 失败:`, error);
        }
      }
      
      // 继续递归查找子目录
      loadCloudFunctions(fullPath, relativePath);
    }
  }
}

// 加载所有云函数
loadCloudFunctions(functionsPath);

// 云函数调用接口
app.post('/api/call/:functionName', async (req, res) => {
  const { functionName } = req.params;
  const { data } = req.body;
  
  // 检查函数是否存在
  if (!functionModules[functionName]) {
    return res.status(404).json({
      code: -1,
      message: `云函数 ${functionName} 不存在`
    });
  }
  
  try {
    // 创建上下文
    const context = {
      OPENID: req.headers['x-openid'] || null,
      APPID: req.headers['x-appid'] || null,
      UNIONID: req.headers['x-unionid'] || null,
      PLATFORM: req.headers['x-platform'] || 'custom',
      userAgent: req.headers['user-agent']
    };
    
    // 调用云函数
    const result = await functionModules[functionName].main(data, context);
    res.json(result);
  } catch (error) {
    console.error(`执行云函数 ${functionName} 出错:`, error);
    res.status(500).json({
      code: -1,
      message: `执行云函数出错: ${error.message}`
    });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`云函数服务器已启动，监听端口: ${PORT}`);
}); 
# AI聊天模块使用说明

## 概述

AI聊天模块实现了与AI进行对话的功能，支持多种对话模式，包括通用咨询、择校咨询、职业规划和学习指导。本模块采用了模块化设计，便于在开发/测试阶段使用模拟数据，以及后期与真实后端API无缝对接。

## 文件结构

- `actions.js` - Vuex actions，处理用户交互逻辑
- `api.js` - 真实API调用实现
- `mock-api.js` - 模拟API调用实现
- `mock-data.js` - 模拟数据
- `config.js` - 配置文件，控制API实现的切换
- `getters.js` - Vuex getters
- `mutations.js` - Vuex mutations
- `state.js` - 模块状态定义
- `index.js` - 模块入口文件
- `test.js` - 测试文件

## 小程序环境兼容

本模块设计考虑了小程序环境的特殊性，避免了使用动态导入（如`require`）等在小程序中可能不兼容的方式。所有模块使用ES6的静态导入方式，确保在小程序环境中能够正常工作。

```javascript
// 推荐使用的导入方式
import * as api from './api';

// 避免在小程序中使用的方式
// const api = require('./api');  // 可能在小程序中不兼容
```

## 开发与测试

### 使用模拟数据

在开发和测试阶段，建议使用模拟数据。模拟数据提供了预设的对话历史和AI回答，不需要连接后端服务器即可进行开发和测试。

1. 确保 `config.js` 文件中的 `USE_MOCK_API` 设置为 `true`：

```javascript
export const USE_MOCK_API = true;
```

2. 运行测试脚本，验证模拟API功能：

```javascript
import { runAllTests } from './store/user/ai-chat/test';
runAllTests();
```

### 自定义模拟数据

如果需要添加或修改模拟数据，可以编辑 `mock-data.js` 文件：

1. 添加新的对话历史：

```javascript
// 在 MOCK_CONVERSATIONS 数组中添加
{
  id: 'conv-new-id',
  abstract: '新对话标题',
  chatMode: 'general',
  createdAt: '2023-11-01T12:00:00Z',
  updatedAt: '2023-11-01T12:30:00Z'
}
```

2. 添加对话详情：

```javascript
// 在 MOCK_CONVERSATION_DETAILS 对象中添加
'conv-new-id': {
  id: 'conv-new-id',
  abstract: '新对话标题',
  chatMode: 'general',
  createdAt: '2023-11-01T12:00:00Z',
  updatedAt: '2023-11-01T12:30:00Z',
  messages: [
    // 消息列表
  ]
}
```

3. 修改AI回答生成逻辑，可以编辑 `generateMockAIResponse` 函数。

## 与后端对接

当需要与真实后端API对接时，按照以下步骤操作：

1. 确保 `api.js` 文件中的API调用函数与后端API保持一致。

2. 将 `config.js` 文件中的 `USE_MOCK_API` 设置为 `false`：

```javascript
export const USE_MOCK_API = false;
```

3. 如果后端API的格式或参数与当前不一致，需要修改 `api.js` 文件中的相关函数。

## 主要功能

1. 发送问题到AI并获取回答 (`questionAI`)
2. 获取用户的对话历史记录列表 (`getConversationHistory`)
3. 获取特定对话的详细内容 (`getConversationDetail`)
4. 删除特定对话历史记录 (`deleteConversationHistory`)

## 使用示例

### 发送问题到AI

```javascript
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('user/ai-chat', ['sendQuestion']),
    
    async askQuestion() {
      const result = await this.sendQuestion({
        question: '我想了解清华大学的计算机专业',
        contextInfo: {
          mode: 'school',
          userSchool: '高中',
          userMajor: '理科'
        }
      });
      
      if (result.success) {
        console.log('AI回答:', result.data);
      } else {
        console.error('获取回答失败:', result.message);
      }
    }
  }
}
```

### 获取历史对话

```javascript
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('user/ai-chat', ['getHistoryChats']),
    
    async loadHistory() {
      const result = await this.getHistoryChats();
      
      if (result.success) {
        this.conversations = result.data;
      } else {
        console.error('获取历史记录失败:', result.message);
      }
    }
  }
}
```

## 注意事项

1. 在开发环境中使用模拟API时，所有操作只会在内存中进行，刷新页面后数据会重置。

2. 切换到真实API前，确保所有必要的API端点已经实现并可用。

3. 如果模拟API与真实API之间存在功能差异，请相应地更新模拟实现。

4. 小程序环境中有特殊限制，避免使用动态导入、eval等特性，确保代码兼容性。 
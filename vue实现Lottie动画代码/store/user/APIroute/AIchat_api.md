<think>
我需要为这个AIchat_api.js文件创建一个中文README，包含使用案例介绍。让我分析一下这个API文件的内容：

1. 这是一个AI聊天相关的API模块
2. 包含四个主要功能：
   - sendMessageToAI: 发送消息给AI并获取回复
   - getConversationHistory: 获取用户的所有对话历史摘要
   - getConversationDetail: 获取特定对话的详细内容
   - deleteConversation: 删除特定对话

我需要为每个功能创建使用案例，并用中文编写，按照请求使用JSDoc风格的注释。

我将创建一个README文件，包含：
1. 模块介绍
2. 安装/导入方法
3. 每个API函数的使用案例
4. 示例代码

我会使用中文编写这份README，并确保代码部分包含JSDoc风格的注释。
</think>

# AI聊天API使用指南

## 简介

`AIchat_api.js` 提供了与AI聊天系统交互的API接口，支持发送消息、获取历史记录、查看详细对话内容以及删除对话等功能。

## 导入API

```javascript
import { 
  sendMessageToAI, 
  getConversationHistory, 
  getConversationDetail, 
  deleteConversation 
} from '@/store/user/APIroute/AIchat_api.js';
```

## 使用案例

### 1. 发送消息给AI

```javascript
/**
 * 发送消息给AI并获取回复示例
 * @async
 * @example
 */
async function chatWithAI() {
  try {
    // 构建消息数据
    const messageData = {
      content: '我对金融专业有兴趣，请推荐几所好大学',  // 用户输入的消息
      chatMode: 'school',  // 聊天模式：'general'(通用)、'school'(择校)、'career'(职业规划)
      conversationId: null  // 新对话传null，继续已有对话则传对话ID
    };
    
    // 发送消息并获取AI回复
    const result = await sendMessageToAI(messageData);
    
    if (result.success) {
      console.log('AI回复:', result.aiResponse);
      console.log('对话ID:', result.conversationId);
      console.log('消息ID:', result.messageId);
      
      // 使用回复更新UI
      // ...
    } else {
      console.error('发送失败:', result.message);
    }
  } catch (error) {
    console.error('操作出错:', error);
  }
}
```

### 2. 获取对话历史列表

```javascript
/**
 * 获取用户的所有对话历史示例
 * @async
 * @example
 */
async function fetchConversationHistory() {
  try {
    const result = await getConversationHistory();
    
    if (result.success) {
      const conversations = result.conversations;
      console.log('对话历史列表:', conversations);
      
      // 渲染对话历史列表
      conversations.forEach(conversation => {
        console.log(`标题: ${conversation.title}`);
        console.log(`时间: ${conversation.createTime}`);
        console.log(`ID: ${conversation.conversationId}`);
      });
    } else {
      console.error('获取历史失败:', result.message);
    }
  } catch (error) {
    console.error('操作出错:', error);
  }
}
```

### 3. 查看特定对话的详细内容

```javascript
/**
 * 获取对话详情示例
 * @async
 * @param {string} conversationId - 对话ID
 * @example
 */
async function viewConversationDetail(conversationId) {
  try {
    const result = await getConversationDetail(conversationId);
    
    if (result.success) {
      const messages = result.messages;
      console.log('对话详细内容:', messages);
      
      // 渲染对话消息列表
      messages.forEach(message => {
        console.log(`发送者: ${message.role === 'user' ? '用户' : 'AI'}`);
        console.log(`内容: ${message.content}`);
        console.log(`时间: ${message.timestamp}`);
      });
    } else {
      console.error('获取对话详情失败:', result.message);
    }
  } catch (error) {
    console.error('操作出错:', error);
  }
}
```

### 4. 删除对话

```javascript
/**
 * 删除特定对话示例
 * @async
 * @param {string} conversationId - 要删除的对话ID
 * @example
 */
async function removeConversation(conversationId) {
  try {
    const result = await deleteConversation(conversationId);
    
    if (result.success) {
      console.log('删除成功:', result.message);
      // 从界面移除该对话
      // 例如: this.conversationList = this.conversationList.filter(item => item.id !== conversationId);
    } else {
      console.error('删除失败:', result.message);
    }
  } catch (error) {
    console.error('操作出错:', error);
  }
}
```

## 完整应用场景示例

```javascript
/**
 * AI聊天页面使用示例
 * @example
 */
export default {
  data() {
    return {
      inputMessage: '',
      chatMode: 'general',
      currentConversationId: null,
      messageList: [],
      isLoading: false
    }
  },
  methods: {
    /**
     * 发送消息
     * @async
     */
    async sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      this.isLoading = true;
      
      // 先在界面显示用户消息
      this.messageList.push({
        role: 'user',
        content: this.inputMessage,
        timestamp: new Date().toISOString()
      });
      
      try {
        const result = await sendMessageToAI({
          content: this.inputMessage,
          chatMode: this.chatMode,
          conversationId: this.currentConversationId
        });
        
        if (result.success) {
          // 保存对话ID用于下次发送
          this.currentConversationId = result.conversationId;
          
          // 显示AI回复
          this.messageList.push({
            role: 'assistant',
            content: result.aiResponse,
            timestamp: new Date().toISOString()
          });
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('发送消息失败:', error);
      } finally {
        this.inputMessage = '';
        this.isLoading = false;
      }
    }
  }
}
```

以上示例展示了如何在实际应用中使用AI聊天API进行消息发送、历史查询及管理操作。您可以根据自己的项目需求调整相应代码。

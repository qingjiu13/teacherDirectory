/**
 * @description AI聊天相关API服务
 */

/**
 * @description 获取历史会话列表
 * @returns {Promise<Object>} 会话列表
 */
export const getConversations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { 
            id: 'c1', 
            title: '英语学习会话', 
            lastMessage: '如何学好英语写作?', 
            timestamp: Date.now() - 3600000,
            unread: false
          },
          { 
            id: 'c2', 
            title: '数学问题求解', 
            lastMessage: '请解释一下微积分基本定理', 
            timestamp: Date.now() - 86400000,
            unread: false
          },
          { 
            id: 'c3', 
            title: '编程辅导', 
            lastMessage: '如何优化这段代码?', 
            timestamp: Date.now() - 172800000,
            unread: false
          }
        ]
      });
    }, 300);
  });
};

/**
 * @description 获取特定会话的消息历史
 * @param {string} conversationId - 会话ID
 * @returns {Promise<Object>} 消息历史
 */
export const getMessages = (conversationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          conversationId,
          title: conversationId === 'c1' ? '英语学习会话' : 
                 conversationId === 'c2' ? '数学问题求解' : '编程辅导',
          messages: [
            {
              id: `m${Date.now()}-1`,
              role: 'user',
              content: '你好，我想学习一些新知识',
              timestamp: Date.now() - 3600000
            },
            {
              id: `m${Date.now()}-2`,
              role: 'assistant',
              content: '你好！我很乐意帮助你学习新知识。请告诉我你对哪个领域或主题感兴趣，我们可以从那里开始。',
              timestamp: Date.now() - 3580000
            },
            {
              id: `m${Date.now()}-3`,
              role: 'user',
              content: conversationId === 'c1' ? '如何学好英语写作?' : 
                       conversationId === 'c2' ? '请解释一下微积分基本定理' : '如何优化这段代码?',
              timestamp: Date.now() - 3500000
            }
          ]
        }
      });
    }, 500);
  });
};

/**
 * @description 发送消息到AI
 * @param {Object} message - 消息对象
 * @param {string} message.conversationId - 会话ID
 * @param {string} message.content - 消息内容
 * @returns {Promise<Object>} AI回复
 */
export const sendMessage = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `m${Date.now()}-response`,
          role: 'assistant',
          content: message.conversationId === 'c1' ? 
            '要提高英语写作能力，可以从以下几个方面入手：1. 多阅读英语原版材料；2. 每天坚持写作练习；3. 学习句型和词汇；4. 寻求反馈和修改；5. 使用写作工具辅助学习。' : 
            message.conversationId === 'c2' ? 
            '微积分基本定理是连接微分学和积分学的桥梁，它表明定积分可以通过原函数的差值计算。具体来说，如果函数f在闭区间[a,b]上连续，F是f的一个原函数，那么∫(a,b)f(x)dx = F(b) - F(a)。' : 
            '代码优化可以从算法效率、内存使用、代码结构等多方面考虑。建议使用更高效的算法、避免重复计算、减少不必要的内存分配、使用适当的数据结构等。没有看到具体代码，无法提供更详细的优化建议。',
          timestamp: Date.now()
        }
      });
    }, 1000);
  });
};

/**
 * @description 创建新会话
 * @returns {Promise<Object>} 新会话信息
 */
export const createConversation = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `c${Date.now()}`,
          title: '新会话',
          lastMessage: '',
          timestamp: Date.now(),
          unread: false
        }
      });
    }, 300);
  });
};

/**
 * @description 删除会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise<Object>} 操作结果
 */
export const deleteConversation = (conversationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '会话已删除'
      });
    }, 300);
  });
}; 
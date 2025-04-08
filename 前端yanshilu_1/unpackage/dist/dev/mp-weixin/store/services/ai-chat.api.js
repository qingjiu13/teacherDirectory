"use strict";
const getConversations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: "c1",
            title: "英语学习会话",
            lastMessage: "如何学好英语写作?",
            timestamp: Date.now() - 36e5,
            unread: false
          },
          {
            id: "c2",
            title: "数学问题求解",
            lastMessage: "请解释一下微积分基本定理",
            timestamp: Date.now() - 864e5,
            unread: false
          },
          {
            id: "c3",
            title: "编程辅导",
            lastMessage: "如何优化这段代码?",
            timestamp: Date.now() - 1728e5,
            unread: false
          }
        ]
      });
    }, 300);
  });
};
const getMessages = (conversationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          conversationId,
          title: conversationId === "c1" ? "英语学习会话" : conversationId === "c2" ? "数学问题求解" : "编程辅导",
          messages: [
            {
              id: `m${Date.now()}-1`,
              role: "user",
              content: "你好，我想学习一些新知识",
              timestamp: Date.now() - 36e5
            },
            {
              id: `m${Date.now()}-2`,
              role: "assistant",
              content: "你好！我很乐意帮助你学习新知识。请告诉我你对哪个领域或主题感兴趣，我们可以从那里开始。",
              timestamp: Date.now() - 358e4
            },
            {
              id: `m${Date.now()}-3`,
              role: "user",
              content: conversationId === "c1" ? "如何学好英语写作?" : conversationId === "c2" ? "请解释一下微积分基本定理" : "如何优化这段代码?",
              timestamp: Date.now() - 35e5
            }
          ]
        }
      });
    }, 500);
  });
};
const sendMessage = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `m${Date.now()}-response`,
          role: "assistant",
          content: message.conversationId === "c1" ? "要提高英语写作能力，可以从以下几个方面入手：1. 多阅读英语原版材料；2. 每天坚持写作练习；3. 学习句型和词汇；4. 寻求反馈和修改；5. 使用写作工具辅助学习。" : message.conversationId === "c2" ? "微积分基本定理是连接微分学和积分学的桥梁，它表明定积分可以通过原函数的差值计算。具体来说，如果函数f在闭区间[a,b]上连续，F是f的一个原函数，那么∫(a,b)f(x)dx = F(b) - F(a)。" : "代码优化可以从算法效率、内存使用、代码结构等多方面考虑。建议使用更高效的算法、避免重复计算、减少不必要的内存分配、使用适当的数据结构等。没有看到具体代码，无法提供更详细的优化建议。",
          timestamp: Date.now()
        }
      });
    }, 1e3);
  });
};
const createConversation = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          id: `c${Date.now()}`,
          title: "新会话",
          lastMessage: "",
          timestamp: Date.now(),
          unread: false
        }
      });
    }, 300);
  });
};
const deleteConversation = (conversationId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "会话已删除"
      });
    }, 300);
  });
};
exports.createConversation = createConversation;
exports.deleteConversation = deleteConversation;
exports.getConversations = getConversations;
exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/ai-chat.api.js.map

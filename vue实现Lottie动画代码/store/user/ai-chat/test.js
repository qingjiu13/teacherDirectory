/**
 * AI聊天模块的测试文件
 * @module store/user/ai-chat/test
 */

import { getApiImplementation, USE_MOCK_API } from './config';
import * as mockData from './mock-data';

// 获取API实现（如果USE_MOCK_API为true，则使用模拟API）
const api = getApiImplementation();

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('开始测试AI聊天模块...');
  console.log(`使用模拟API: ${USE_MOCK_API ? '是' : '否'}`);
  
  try {
    // 测试获取对话历史
    await testGetConversationHistory();
    
    // 测试获取对话详情
    await testGetConversationDetail();
    
    // 测试发送问题到AI
    await testQuestionAI();
    
    // 测试删除对话
    await testDeleteConversationHistory();
    
    console.log('所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

/**
 * 测试获取对话历史
 */
export async function testGetConversationHistory() {
  console.log('\n测试: 获取对话历史');
  try {
    const result = await api.getConversationHistory({});
    console.log('获取对话历史结果:', result.success ? '成功' : '失败');
    console.log(`获取到 ${result.data?.length || 0} 条对话记录`);
    
    if (result.success && result.data?.length > 0) {
      console.log('第一条对话摘要:', {
        id: result.data[0].id,
        abstract: result.data[0].abstract,
        chatMode: result.data[0].chatMode
      });
    }
  } catch (error) {
    console.error('获取对话历史测试失败:', error);
    throw error;
  }
}

/**
 * 测试获取对话详情
 */
export async function testGetConversationDetail() {
  console.log('\n测试: 获取对话详情');
  try {
    // 测试获取存在的对话
    const validConversationId = 'conv-001';
    console.log(`尝试获取对话详情 ID: ${validConversationId}`);
    
    const validResult = await api.getConversationDetail({
      conversationId: validConversationId
    });
    
    console.log('获取有效对话详情结果:', validResult.success ? '成功' : '失败');
    if (validResult.success) {
      console.log(`对话包含 ${validResult.data.messages?.length || 0} 条消息`);
    }
    
    // 测试获取不存在的对话
    const invalidConversationId = 'non-existent-id';
    console.log(`尝试获取不存在的对话详情 ID: ${invalidConversationId}`);
    
    const invalidResult = await api.getConversationDetail({
      conversationId: invalidConversationId
    });
    
    console.log('获取无效对话详情结果:', invalidResult.success ? '成功' : '失败');
    console.log('错误信息:', invalidResult.error?.message);
  } catch (error) {
    console.error('获取对话详情测试失败:', error);
    throw error;
  }
}

/**
 * 测试发送问题到AI
 */
export async function testQuestionAI() {
  console.log('\n测试: 发送问题到AI');
  try {
    // 测试不同类型的问题
    const questions = [
      { text: '你好，请问你是谁？', contextInfo: { mode: 'general' } },
      { text: '我想了解一下清华大学的情况', contextInfo: { mode: 'school' } },
      { text: '如何提高学习效率？', contextInfo: { mode: 'learning' } }
    ];
    
    for (const q of questions) {
      console.log(`问题: "${q.text}"`);
      console.log(`上下文: ${JSON.stringify(q.contextInfo)}`);
      
      const result = await api.questionAI({
        question: q.text,
        contextInfo: q.contextInfo
      });
      
      console.log('获取AI回答结果:', result.success ? '成功' : '失败');
      console.log(`生成的chatId: ${result.chatId}`);
      
      if (result.success) {
        // 显示前100个字符的回答
        const previewAnswer = result.data.length > 100 ? 
          result.data.substring(0, 100) + '...' : 
          result.data;
        console.log('AI回答预览:', previewAnswer);
      } else {
        console.log('错误信息:', result.error?.message);
      }
      
      console.log('---');
    }
  } catch (error) {
    console.error('发送问题到AI测试失败:', error);
    throw error;
  }
}

/**
 * 测试删除对话
 */
export async function testDeleteConversationHistory() {
  console.log('\n测试: 删除对话');
  try {
    // 测试删除存在的对话
    const validConversationId = 'conv-001';
    console.log(`尝试删除对话 ID: ${validConversationId}`);
    
    const validResult = await api.deleteConversationHistory({
      conversationId: validConversationId
    });
    
    console.log('删除有效对话结果:', validResult.success ? '成功' : '失败');
    
    // 测试删除不存在的对话
    const invalidConversationId = 'non-existent-id';
    console.log(`尝试删除不存在的对话 ID: ${invalidConversationId}`);
    
    const invalidResult = await api.deleteConversationHistory({
      conversationId: invalidConversationId
    });
    
    console.log('删除无效对话结果:', invalidResult.success ? '成功' : '失败');
    console.log('错误信息:', invalidResult.error?.message);
  } catch (error) {
    console.error('删除对话测试失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，则执行测试
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests();
}

// 导出测试函数，以便其他模块可以使用
export default {
  runAllTests,
  testGetConversationHistory,
  testGetConversationDetail,
  testQuestionAI,
  testDeleteConversationHistory
}; 
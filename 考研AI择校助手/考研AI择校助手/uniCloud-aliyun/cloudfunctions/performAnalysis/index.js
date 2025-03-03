'use strict';

exports.main = async (event, context) => {
    const db = uniCloud.database();
    const collection = db.collection('feedback');
    
    try {
        console.log('收到分析请求, ID:', event.id);
        
        // 检查请求是否有效
        if (!event.id || !event.formData) {
            return {
                code: 1,
                msg: '缺少必要的分析参数'
            };
        }
        
        // 更新状态为正在分析
        await collection.doc(event.id).update({
            analysis_status: 'analyzing',
            update_time: Date.now()
        });
        
        // 调用DeepSeek API进行分析
        const aiAnalysis = await callAIModel(event.formData);
        console.log('AI分析完成, ID:', event.id);
        
        // 更新分析结果
        await collection.doc(event.id).update({
            analysis_status: 'completed',
            analysis_result: aiAnalysis,
            complete_time: Date.now()
        });
        
        return {
            code: 0,
            msg: '分析完成',
            data: {
                id: event.id
            }
        };
    } catch (error) {
        console.error('处理分析请求失败:', error);
        
        // 更新失败状态
        await collection.doc(event.id).update({
            analysis_status: 'failed',
            error_message: error.message,
            complete_time: Date.now()
        });
        
        return {
            code: 1,
            msg: '分析失败: ' + error.message,
            data: {
                id: event.id,
                error: error.message
            }
        };
    }
};

/**
 * 调用DeepSeek AI模型进行分析
 * @param {Object} data - 用户表单数据
 * @returns {Promise<Object>} 分析结果
 */
async function callAIModel(data) {
    console.log('准备调用DeepSeek AI模型，数据:', data);
    
    // 构建提示词，强调返回JSON格式
    const prompt = `
作为考研择校专家，请根据以下学生信息给出详细的择校建议：

学生背景：
- 本科院校: ${data.school || '未提供'}
- 本科专业: ${data.major || '未提供'}
- 本科成绩排名: ${data.ranking || '未提供'}
- 目标专业: ${data.targetMajor || '未提供'}
- 目标地区: ${data.targetRegion || '未提供'}
- 英语水平: ${data.englishLevel || '未提供'}
- 专业技能和特长: ${data.skills || '未提供'}
- 特殊需求或偏好: ${data.preferences || '未提供'}

请根据上述信息，推荐3-5所最适合该学生的院校，并给出详细的分析建议。

你的回答必须是如下JSON格式：
{
  "recommendSchools": [
    {
      "name": "院校名称",
      "features": "院校特点简述",
      "reason": "推荐理由",
      "difficulty": "录取难度评估",
      "suggestion": "针对性备考建议",
      "rating": 分数（1-5之间的数字，可以有小数），
      "recommendMajor": "推荐专业方向"
    }
  ],
  "advice": {
    "advantages": "学生优势分析",
    "disadvantages": "学生不足分析",
    "strategy": "整体备考策略",
    "timeline": "备考时间规划",
    "keyPoints": "重点关注事项"
  }
}

请确保你的回答严格按照这个JSON格式，不要包含其他内容。`;

    try {
        // 使用uniCloud.httpclient替代fetch
        const API_KEY = 'sk-cc7ce37a146245bc9757fc22fc39896d'; // 您的API密钥
        const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
        
        console.log('开始调用DeepSeek API...');
        
        // 使用uniCloud.httpclient
        const response = await uniCloud.httpclient.request(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            data: {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的考研择校顾问，擅长分析学生背景并提供针对性的择校建议。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            },
            dataType: 'json',
            contentType: 'json',
            timeout: 90000 // 90秒超时
        });
        
        console.log('API响应状态码:', response.status);
        console.log('API响应头:', response.headers);
        
        if (response.status === 200) {
            const responseData = response.data;
            console.log('API响应数据类型:', typeof responseData);
            
            if (responseData && responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
                const responseText = responseData.choices[0].message.content.trim();
                console.log('AI回复原文前50个字符:', responseText.substring(0, 50) + '...');
                
                try {
                    return parseAIResponse(responseText);
                } catch (parseError) {
                    console.error('解析AI响应失败:', parseError);
                    throw new Error('解析AI响应失败: ' + parseError.message);
                }
            } else {
                console.error('API响应结构不符合预期:', JSON.stringify(responseData).substring(0, 200));
                throw new Error('API返回数据格式异常，缺少必要字段');
            }
        } else {
            const errorMsg = response.data ? JSON.stringify(response.data).substring(0, 300) : '未知错误';
            console.error(`API调用失败，状态码: ${response.status}, 响应数据: ${errorMsg}`);
            throw new Error(`API调用失败，状态码: ${response.status}, 原因: ${errorMsg}`);
        }
    } catch (error) {
        console.error('调用AI模型失败:', error);
        throw error;
    }
}

/**
 * 解析AI响应文本
 * @param {string} responseText - AI响应的文本
 * @returns {Object} 解析后的结构化数据
 */
function parseAIResponse(responseText) {
    // 先尝试直接解析JSON
    try {
        return JSON.parse(responseText);
    } catch (e) {
        console.log('直接解析JSON失败，尝试提取JSON部分');
    }
    
    // 尝试从文本中提取JSON部分
    try {
        // 移除可能的markdown标记
        let cleanText = responseText.replace(/```json|```/g, '').trim();
        
        // 寻找第一个左大括号和最后一个右大括号
        const startIndex = cleanText.indexOf('{');
        const endIndex = cleanText.lastIndexOf('}');
        
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const jsonString = cleanText.substring(startIndex, endIndex + 1);
            return JSON.parse(jsonString);
        }
        
        throw new Error('无法在响应中找到有效的JSON结构');
    } catch (error) {
        console.error('解析AI响应失败:', error);
        throw error;
    }
} 
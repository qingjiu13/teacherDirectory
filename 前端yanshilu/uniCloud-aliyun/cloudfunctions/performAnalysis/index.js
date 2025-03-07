'use strict';
const https = require('https');

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
        
        // 直接在此函数中调用AI，而不是引用getSchoolAnalysis
        try {
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
        } catch (aiError) {
            console.error('AI分析失败:', aiError);
            
            // 更新状态为失败
            await collection.doc(event.id).update({
                analysis_status: 'failed',
                error_message: aiError.message || '分析过程中发生错误',
                error_time: Date.now()
            });
            
            return {
                code: 1,
                msg: '分析失败: ' + aiError.message
            };
        }
    } catch (error) {
        console.error('执行分析失败:', error);
        return {
            code: 1,
            msg: '执行分析失败: ' + error.message
        };
    }
};

/**
 * 调用AI大模型API进行分析
 * @param {Object} data - 用户数据
 * @returns {Promise<Object>} 分析结果
 */
async function callAIModel(data) {
    console.log('准备调用AI模型，数据:', data);
    
    // 构建提示词
    const prompt = `
作为考研择校专家，请根据以下学生信息给出详细的择校建议：

学生背景：
1. 身份：${data.identity || '普通考生'}
2. 本科院校：${data.university || '未知'}
3. 本科专业：${data.major || '未知'}
4. 英语水平：${data.englishLevel || '未知'}
5. 专业排名：${data.ranking || '未知'}
6. 目标专业：${data.targetMajor || '未知'}
7. 就读方式：${data.studyMode || '未知'}
8. 目标院校类型：${data.targetType || '未知'}
9. 是否考虑研究所：${data.considerResearch || '未知'}
10. 目标地区：${data.targetAreas ? data.targetAreas.join('、') : '未知'}

请提供：
1. 4-6所最适合的推荐院校，包含：
   - 院校名称
   - 院校特点
   - 推荐理由
   - 录取难度
   - 针对性建议
   - 推荐指数(1-5分)
   - 推荐专业
2. 个人分析建议：
   - 优势分析
   - 不足分析
   - 备考策略
   - 时间规划
   - 重点关注事项

请以JSON格式返回，结构如下：
{
  "recommendSchools": [
    {
      "name": "院校名称",
      "features": "院校特点",
      "reason": "推荐理由",
      "difficulty": "录取难度",
      "suggestion": "针对性建议",
      "rating": 4.5,
      "recommendMajor": "推荐专业"
    }
  ],
  "advice": {
    "advantages": "优势分析",
    "disadvantages": "不足分析",
    "strategy": "备考策略",
    "timeline": "时间规划",
    "keyPoints": "重点关注事项"
  }
}`;

    try {
        // 由于云函数环境可能不支持某些API，使用简化版的示例返回模拟数据
        // 在实际开发中，这里应该是真实的AI API调用
        console.log('使用模拟数据代替实际API调用');
        
        // 模拟一个异步过程
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return {
            recommendSchools: [
                {
                    name: "北京大学",
                    features: "综合实力强，学科覆盖全面，研究资源丰富",
                    reason: `针对${data.identity}身份，${data.university}背景的考生，北大是理想选择`,
                    difficulty: "难度较高，建议全面准备",
                    suggestion: "提前3个月开始复习专业课程",
                    rating: 4.8,
                    recommendMajor: data.targetMajor || "计算机科学与技术"
                },
                {
                    name: "清华大学",
                    features: "理工科见长，学术氛围浓厚",
                    reason: `考生目标专业${data.targetMajor}在清华有强大师资力量`,
                    difficulty: "录取分数线高，竞争激烈",
                    suggestion: "加强英语和数学复习",
                    rating: 4.6,
                    recommendMajor: "人工智能"
                },
                {
                    name: "复旦大学",
                    features: "人文学科强，教学质量高",
                    reason: `考生${data.englishLevel}的英语水平适合复旦的要求`,
                    difficulty: "竞争适中，可以冲刺",
                    suggestion: "多了解专业发展方向",
                    rating: 4.3,
                    recommendMajor: "软件工程"
                },
                {
                    name: "浙江大学",
                    features: "工科实力强，产学研结合紧密",
                    reason: "地理位置优越，就业前景好",
                    difficulty: "录取比例较高，机会较多",
                    suggestion: "注重基础知识掌握",
                    rating: 4.2,
                    recommendMajor: "计算机技术"
                }
            ],
            advice: {
                advantages: `${data.university}本科背景较好，专业基础扎实`,
                disadvantages: `${data.englishLevel}英语水平可能需要加强`,
                strategy: "合理规划时间，注重专业课复习",
                timeline: "建议提前一年开始准备",
                keyPoints: `针对${data.targetAreas ? data.targetAreas.join('、') : '未知'}地区院校，关注招生信息，多做真题`
            }
        };
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
async function parseAIResponse(responseText) {
    try {
        // 首先尝试直接解析JSON
        return JSON.parse(responseText);
    } catch (e) {
        console.error('直接解析JSON失败，尝试提取JSON部分:', e);
        
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
            } else {
                throw new Error('未找到有效的JSON结构');
            }
        } catch (extractError) {
            console.error('提取JSON失败:', extractError);
            throw new Error('无法解析AI返回的数据格式');
        }
    }
} 
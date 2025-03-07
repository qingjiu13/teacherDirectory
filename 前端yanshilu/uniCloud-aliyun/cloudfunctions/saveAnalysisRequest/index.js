'use strict';

exports.main = async (event, context) => {
    const db = uniCloud.database();
    const collection = db.collection('feedback');
    
    try {
        // 验证数据完整性
        const formData = event.formData;
        if (!formData) {
            throw new Error('缺少必要的表单数据');
        }

        // 添加时间戳和用户标识
        const data = {
            ...formData,
            create_time: Date.now(),
            user_id: event.user_id || context.USERID || 'anonymous',
            analysis_status: 'pending'  // 初始状态为等待分析
        }
        
        console.log('准备保存的数据:', data);
        
        // 保存到数据库
        const result = await collection.add(data);
        console.log('数据库保存结果:', result);
        
        return {
            code: 0,
            msg: '分析请求已保存',
            data: {
                id: result.id
            }
        }
    } catch (e) {
        console.error('保存分析请求失败:', e);
        return {
            code: 1,
            msg: e.message || '保存分析请求失败',
            error: e.message
        }
    }
} 
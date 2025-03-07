'use strict';

exports.main = async (event, context) => {
    if (!event.id) {
        return {
            code: 1,
            msg: '缺少分析ID'
        };
    }
    
    try {
        // 获取分析数据
        const db = uniCloud.database();
        const result = await db.collection('feedback').doc(event.id).get();
        
        if (!result.data || result.data.length === 0) {
            return {
                code: 1,
                msg: '未找到分析数据'
            };
        }
        
        const formData = result.data[0];
        
        // 调用performAnalysis云函数执行实际分析
        return await uniCloud.callFunction({
            name: 'performAnalysis',
            data: {
                id: event.id,
                formData: formData
            }
        });
    } catch (e) {
        console.error('启动分析失败:', e);
        return {
            code: 1,
            msg: '启动分析失败: ' + e.message
        };
    }
} 
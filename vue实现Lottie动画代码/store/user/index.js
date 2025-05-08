/**
 * user模块的根入口文件
 * @module store/user
 */

// 导入子模块
import myService from './myService'
import money from './money'
import baseInfo from './baseInfo'
import chat from './chat'
import match from './match'
import aiChat from './ai-chat'
import uploadFile from './uploadFile/upload'

/**
 * 用户模块配置
 * @type {Object}
 */
export default {
    namespaced: true,
    modules: {
        myService,
        money,
        baseInfo,
        chat,
        match,
        aiChat,
        uploadFile
    }
}


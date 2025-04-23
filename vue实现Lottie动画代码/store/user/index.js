/**
 * user模块的根入口文件
 * @module store/user
 */

import myService from './myService'
import money from './money'
import baseInfo from './baseInfo'
import chat from './chat'
import match from './match'
import aiChat from './ai-chat'

export default {
    namespaced: true,
    modules: {
        myService,
        money,
        baseInfo,
        chat,
        match,
        aiChat,
    }
};

// 重新导出子模块的常量
export { constants as aiChatConstants } from './ai-chat';

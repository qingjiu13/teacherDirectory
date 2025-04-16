/**
 * user模块的根入口文件
 * @module store/user
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import myService from './myService'
import money from './money'
import baseInfo from './baseInfo'
import chat from './chat'
import match from './match'
import aiChat from './ai-chat'
import commonOrder from './order/commonOrder'

export default new Vuex.Store({
    modules: {
        myService,
        money,
        baseInfo,
        chat,
        match,
        aiChat,
        commonOrder
    }
});

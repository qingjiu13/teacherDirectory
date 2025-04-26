/**
 * ai-chat模块的入口文件
 * @module store/user/ai-chat
 */

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

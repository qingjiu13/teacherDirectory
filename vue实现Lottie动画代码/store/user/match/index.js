/**
 * match模块的入口文件
 * @module store/user/match/index
 */

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}; 
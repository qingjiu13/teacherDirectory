/**
 * baseInfo模块的入口文件
 * @module store/user/baseInfo
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
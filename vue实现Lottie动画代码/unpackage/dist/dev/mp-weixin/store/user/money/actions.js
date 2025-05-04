"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_APIroute_money_api = require("../APIroute/money_api.js");
const actions = {
  /**
   * 获取用户余额
   * @param {Object} context - Vuex的上下文对象
   * @param {Function} context.commit - commit函数
   * @param {Object} context.rootState - 根state对象
   */
  async fetchBalance({ commit, rootState }) {
    try {
      const userId = rootState.user.baseInfo.id;
      const res = await store_user_APIroute_money_api.getBalanceAPI(userId);
      if (res.code === 200) {
        commit("SET_BALANCE", res.data.balance);
      } else {
        throw new Error(res.message || "获取余额失败");
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at store/user/money/actions.js:25", "fetchBalance error:", err);
      throw err;
    }
  },
  /**
   * 提交提现请求
   * @param {Object} context - Vuex的上下文对象
   * @param {Function} context.commit - commit函数
   * @param {Object} context.state - 当前模块的state
   * @param {Object} context.rootState - 根state对象
   */
  async submitWithdraw({ commit, state, rootState }) {
    try {
      const userId = rootState.user.baseInfo.id;
      const payload = {
        userId,
        // 添加用户ID
        amount: state.withdrawAmount,
        method: state.withdrawMethod
      };
      const res = await store_user_APIroute_money_api.withdrawAPI(payload);
      if (res.code === 200) {
        commit("SET_BALANCE", res.data.newBalance);
        return res;
      } else {
        throw new Error(res.message || "提现失败");
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at store/user/money/actions.js:54", "submitWithdraw error:", err);
      throw err;
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/money/actions.js.map

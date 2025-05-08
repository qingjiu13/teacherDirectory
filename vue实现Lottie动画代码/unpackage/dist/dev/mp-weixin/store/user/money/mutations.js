"use strict";
const mutations = {
  SET_BALANCE(state, amount) {
    state.balance = amount;
  },
  SET_WITHDRAW_AMOUNT(state, amount) {
    state.withdrawAmount = amount;
  },
  SET_WITHDRAW_METHOD(state, method) {
    state.withdrawMethod = method;
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/money/mutations.js.map

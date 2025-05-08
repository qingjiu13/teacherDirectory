/**
 * money模块的mutations
 * @module store/user/money/mutations
 */

export default {
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
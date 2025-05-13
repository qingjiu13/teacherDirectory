
---
### 1. 页面进入时加载数据：

```js
onLoad() {
    this.$store.dispatch('money/fetchTransactionList', this.userId);
}
```

### 2. 下拉加载更多：

```js
onReachBottom() {
    this.$store.dispatch('money/loadMoreTransactions', this.userId);
}
```

---

##关于如何访问 state 中的数据（可以选择...state.money.transactionList等的方式，也可以选择...this.$store.state.money.transactionList的方式）

```js
computed: {
    transactionList() {
        return this.$store.state.money.transactionList;
    },
    hasMore() {
        return this.$store.state.money.hasMore;
    },
    isLoading() {
        return this.$store.state.money.isLoading;
    }
}
```
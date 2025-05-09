"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      walletInfo: new UTSJSONObject({
        balance: "100.00"
      }),
      recentTransactions: [],
      // 收入明细弹出层相关数据
      showDetailPopup: false,
      filterOptions: ["全部", "本月", "上月", "今年"],
      currentFilter: 0,
      incomeList: [],
      loading: false,
      noMore: false,
      page: 1,
      pageSize: 10,
      // 提现弹出层相关数据
      showWithdrawPopup: false,
      withdrawAmount: "",
      amountError: "",
      currentMethod: 0,
      withdrawMethods: [
        new UTSJSONObject({
          type: "wechat",
          name: "微信",
          shortName: "微",
          description: "2小时内到账",
          fee: "0%"
        }),
        new UTSJSONObject({
          type: "alipay",
          name: "支付宝",
          shortName: "支",
          description: "2小时内到账",
          fee: "0%"
        }),
        new UTSJSONObject({
          type: "bank",
          name: "银行卡",
          shortName: "银",
          description: "1-3个工作日到账",
          fee: "0%"
        })
      ]
    };
  },
  computed: {
    // 根据月份分组收入数据
    groupedIncomeList() {
      const grouped = new UTSJSONObject({});
      this.incomeList.forEach((item) => {
        const month = item.month;
        if (!grouped[month]) {
          grouped[month] = [];
        }
        grouped[month].push(item);
      });
      return grouped;
    },
    // 是否可以提现
    canWithdraw() {
      if (!this.withdrawAmount || this.amountError) {
        return false;
      }
      const amount = parseFloat(this.withdrawAmount);
      return amount >= 10 && amount <= parseFloat(this.walletInfo.balance);
    }
  },
  onLoad() {
    this.getWalletInfo();
    this.getRecentTransactions();
  },
  methods: {
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 显示收入明细弹出层
    showIncomeDetail() {
      this.showDetailPopup = true;
      this.loadIncomeData();
    },
    // 隐藏收入明细弹出层
    hideIncomeDetail() {
      this.showDetailPopup = false;
    },
    // 提现操作
    withdraw() {
      if (parseFloat(this.walletInfo.balance) <= 0) {
        common_vendor.index.showToast({
          title: "余额不足",
          icon: "none"
        });
        return null;
      }
      this.withdrawAmount = "";
      this.amountError = "";
      this.showWithdrawPopup = true;
    },
    // 隐藏提现弹出层
    hideWithdraw() {
      this.showWithdrawPopup = false;
    },
    // 验证提现金额
    validateAmount() {
      const amount = parseFloat(this.withdrawAmount);
      const balance = parseFloat(this.walletInfo.balance);
      if (isNaN(amount)) {
        this.amountError = "请输入有效金额";
      } else if (amount <= 0) {
        this.amountError = "提现金额必须大于0";
      } else if (amount < 10) {
        this.amountError = "提现金额不能低于10元";
      } else if (amount > balance) {
        this.amountError = "提现金额不能超过可用余额";
      } else {
        this.amountError = "";
      }
    },
    // 设置最大提现金额
    setMaxAmount() {
      this.withdrawAmount = this.walletInfo.balance;
      this.validateAmount();
    },
    // 选择提现方式
    selectMethod(index = null) {
      this.currentMethod = index;
    },
    // 确认提现
    confirmWithdraw() {
      if (!this.canWithdraw)
        return null;
      common_vendor.index.showLoading({
        title: "提现申请中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const oldBalance = parseFloat(this.walletInfo.balance);
        const withdrawAmount = parseFloat(this.withdrawAmount);
        this.walletInfo.balance = (oldBalance - withdrawAmount).toFixed(2);
        this.recentTransactions.unshift({
          id: "tx" + Date.now(),
          type: "expense",
          title: "提现到" + this.withdrawMethods[this.currentMethod].name,
          time: this.formatDate(/* @__PURE__ */ new Date()),
          amount: withdrawAmount.toFixed(2)
        });
        this.hideWithdraw();
        common_vendor.index.showToast({
          title: "提现申请成功",
          icon: "success"
        });
      }, 1500);
    },
    // 格式化日期
    formatDate(date = null) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 获取钱包信息
    getWalletInfo() {
      this.walletInfo = {
        balance: "100.00"
      };
    },
    // 获取最近交易记录
    getRecentTransactions() {
      this.recentTransactions = [
        {
          id: "tx001",
          type: "income",
          title: "学员购买《数学基础》课程",
          time: "2024-03-15",
          amount: "199.00"
        },
        {
          id: "tx002",
          type: "income",
          title: "学员打赏",
          time: "2024-03-10",
          amount: "50.00"
        },
        {
          id: "tx003",
          type: "expense",
          title: "提现",
          time: "2024-03-05",
          amount: "149.00"
        }
      ];
    },
    // 设置筛选条件
    setFilter(index = null) {
      if (this.currentFilter === index)
        return null;
      this.currentFilter = index;
      this.page = 1;
      this.incomeList = [];
      this.noMore = false;
      this.loadIncomeData();
    },
    // 加载更多收入数据
    loadMoreIncome() {
      if (this.loading || this.noMore)
        return null;
      this.page++;
      this.loadIncomeData();
    },
    // 加载收入明细数据
    loadIncomeData() {
      this.loading = true;
      setTimeout(() => {
        const newData = this.generateMockData();
        this.incomeList = this.page === 1 ? newData : [...this.incomeList, ...newData];
        this.loading = false;
        this.noMore = newData.length < this.pageSize;
      }, 500);
    },
    // 生成模拟数据
    generateMockData() {
      const result = [];
      const count = this.page === 1 ? this.pageSize : Math.floor(Math.random() * this.pageSize);
      if (this.page > 2) {
        return [];
      }
      const sourceTypes = ["课程", "打赏", "退款", "其他"];
      const months = ["2023年12月", "2024年01月", "2024年02月", "2024年03月"];
      for (let i = 0; i < count; i++) {
        const source = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
        let title = "";
        switch (source) {
          case "课程":
            title = `学员购买《${["数学基础", "语文进阶", "英语口语", "物理实验"][Math.floor(Math.random() * 4)]}》课程`;
            break;
          case "打赏":
            title = "学员打赏";
            break;
          case "退款":
            title = "平台退款";
            break;
          default:
            title = "其他收入";
        }
        let month = "";
        switch (this.currentFilter) {
          case 1:
            month = "2024年03月";
            break;
          case 2:
            month = "2024年02月";
            break;
          case 3:
            month = months[Math.floor(Math.random() * 2) + 2];
            break;
          default:
            month = months[Math.floor(Math.random() * months.length)];
        }
        const day = Math.floor(Math.random() * 28) + 1;
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const time = `${day < 10 ? "0" + day : day}日 ${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
        const amount = (Math.random() * 500 + 50).toFixed(2);
        result.push({
          id: `income_${this.page}_${i}`,
          title,
          source,
          amount,
          month,
          time,
          status: "已到账"
        });
      }
      return result;
    },
    // 计算月度总收入
    calculateMonthTotal(items = null) {
      return items.reduce((sum = null, item = null) => {
        return sum + parseFloat(item.amount);
      }, 0).toFixed(2);
    },
    // 获取图标样式类
    getIconClass(source = null) {
      switch (source) {
        case "课程":
          return "course";
        case "打赏":
          return "reward";
        case "退款":
          return "refund";
        default:
          return "other";
      }
    },
    // 获取图标文字
    getIconText(source = null) {
      switch (source) {
        case "课程":
          return "课";
        case "打赏":
          return "赏";
        case "退款":
          return "退";
        default:
          return "其";
      }
    }
  }
});
if (!Array) {
  const _component_path = common_vendor.resolveComponent("path");
  const _component_svg = common_vendor.resolveComponent("svg");
  (_component_path + _component_svg)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.walletInfo.balance || "0.00"),
    b: common_vendor.o((...args) => $options.showIncomeDetail && $options.showIncomeDetail(...args)),
    c: common_vendor.o((...args) => $options.withdraw && $options.withdraw(...args)),
    d: $data.showDetailPopup
  }, $data.showDetailPopup ? common_vendor.e({
    e: common_vendor.o((...args) => $options.hideIncomeDetail && $options.hideIncomeDetail(...args)),
    f: common_vendor.f($data.filterOptions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: $data.currentFilter === index ? 1 : "",
        d: common_vendor.o(($event) => $options.setFilter(index), index)
      };
    }),
    g: $data.incomeList.length > 0
  }, $data.incomeList.length > 0 ? common_vendor.e({
    h: common_vendor.f($options.groupedIncomeList, (group, month, i0) => {
      return {
        a: common_vendor.t(month),
        b: common_vendor.t($options.calculateMonthTotal(group)),
        c: common_vendor.f(group, (item, index, i1) => {
          return {
            a: common_vendor.t($options.getIconText(item.source)),
            b: common_vendor.n($options.getIconClass(item.source)),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.time),
            e: common_vendor.t(item.amount),
            f: index
          };
        }),
        d: month
      };
    }),
    i: $data.loading
  }, $data.loading ? {} : $data.noMore ? {} : {}, {
    j: $data.noMore
  }) : {
    k: common_vendor.p({
      d: "M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z",
      stroke: "#E0E6F1",
      ["stroke-width"]: "2"
    }),
    l: common_vendor.p({
      d: "M30 40H50M40 30V50",
      stroke: "#E0E6F1",
      ["stroke-width"]: "2",
      ["stroke-linecap"]: "round"
    }),
    m: common_vendor.p({
      xmlns: "http://www.w3.org/2000/svg",
      width: "80",
      height: "80",
      viewBox: "0 0 80 80",
      fill: "none"
    })
  }, {
    n: common_vendor.o((...args) => $options.loadMoreIncome && $options.loadMoreIncome(...args)),
    o: common_vendor.o((...args) => $options.hideIncomeDetail && $options.hideIncomeDetail(...args))
  }) : {}, {
    p: $data.showWithdrawPopup
  }, $data.showWithdrawPopup ? common_vendor.e({
    q: common_vendor.o((...args) => $options.hideWithdraw && $options.hideWithdraw(...args)),
    r: common_vendor.o([($event) => $data.withdrawAmount = $event.detail.value, (...args) => $options.validateAmount && $options.validateAmount(...args)]),
    s: $data.withdrawAmount,
    t: common_vendor.t($data.walletInfo.balance),
    v: common_vendor.o((...args) => $options.setMaxAmount && $options.setMaxAmount(...args)),
    w: $data.amountError
  }, $data.amountError ? {
    x: common_vendor.t($data.amountError)
  } : {}, {
    y: common_vendor.f($data.withdrawMethods, (method, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(method.shortName),
        b: common_vendor.n(method.type),
        c: common_vendor.t(method.name),
        d: common_vendor.t(method.description),
        e: $data.currentMethod === index
      }, $data.currentMethod === index ? {} : {}, {
        f: index,
        g: $data.currentMethod === index ? 1 : "",
        h: common_vendor.o(($event) => $options.selectMethod(index), index)
      });
    }),
    z: !$options.canWithdraw ? 1 : "",
    A: common_vendor.o((...args) => $options.confirmWithdraw && $options.confirmWithdraw(...args)),
    B: common_vendor.o((...args) => $options.hideWithdraw && $options.hideWithdraw(...args))
  }) : {}, {
    C: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/wallet.js.map

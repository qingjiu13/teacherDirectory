"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      currentTab: 0,
      tabs: ["待支付", "已完成", "已取消"],
      orders: [
        new UTSJSONObject({
          time: "2024-03-20 14:30",
          status: "待支付",
          title: "课程A - 一对一辅导",
          price: "299.00"
        }),
        new UTSJSONObject({
          time: "2024-03-19 10:15",
          status: "已完成",
          title: "课程B - 小组课程",
          price: "199.00"
        }),
        new UTSJSONObject({
          time: "2024-03-18 16:45",
          status: "已取消",
          title: "课程C - 专项训练",
          price: "399.00"
        })
      ],
      showCancelModal: false,
      showPayModal: false,
      currentOrder: null,
      isPaymentDropdownOpen: false,
      selectedPayment: 0,
      paymentMethods: [
        new UTSJSONObject({
          name: "支付宝支付",
          icon: "支",
          type: "alipay"
        }),
        new UTSJSONObject({
          name: "微信支付",
          icon: "微",
          type: "wechat"
        }),
        new UTSJSONObject({
          name: "银行卡支付",
          icon: "卡",
          type: "bank"
        })
      ],
      showDetailModal: false,
      showDeleteModal: false
    };
  },
  methods: {
    switchTab(index = null) {
      this.currentTab = index;
    },
    cancelOrder(order = null) {
      this.currentOrder = order;
      this.showCancelModal = true;
    },
    confirmCancel() {
      common_vendor.index.showToast({
        title: "订单已取消",
        icon: "success"
      });
      this.showCancelModal = false;
    },
    payOrder(order = null) {
      this.currentOrder = order;
      this.showPayModal = true;
    },
    togglePaymentDropdown() {
      this.isPaymentDropdownOpen = !this.isPaymentDropdownOpen;
    },
    selectPayment(index = null) {
      this.selectedPayment = index;
      setTimeout(() => {
        this.isPaymentDropdownOpen = false;
      }, 200);
    },
    confirmPay() {
      const payMethod = this.paymentMethods[this.selectedPayment].name;
      common_vendor.index.showToast({
        title: `${payMethod}支付成功`,
        icon: "success"
      });
      this.showPayModal = false;
      this.isPaymentDropdownOpen = false;
    },
    viewDetail(order = null) {
      this.currentOrder = order;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.currentOrder = null;
    },
    deleteOrder(order = null) {
      this.currentOrder = order;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      common_vendor.index.showToast({
        title: "删除成功",
        icon: "success"
      });
      this.showDeleteModal = false;
    },
    goToAppraise(order = null) {
      common_vendor.index.navigateTo({
        url: `/pages/mine/order/appraise/appraise?orderId=${order.id}`
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e;
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: common_vendor.f($data.orders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.status),
        c: common_vendor.t(order.title),
        d: common_vendor.t(order.price)
      }, $data.currentTab === 0 ? {
        e: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, $data.currentTab === 0 ? {
        f: common_vendor.o(($event) => $options.payOrder(order), index)
      } : {}, $data.currentTab === 1 ? {
        g: common_vendor.o(($event) => $options.goToAppraise(order), index)
      } : {}, $data.currentTab === 1 ? {
        h: common_vendor.o(($event) => $options.viewDetail(order), index)
      } : {}, $data.currentTab === 2 ? {
        i: common_vendor.o(($event) => $options.deleteOrder(order), index)
      } : {}, {
        j: index
      });
    }),
    c: $data.currentTab === 0,
    d: $data.currentTab === 0,
    e: $data.currentTab === 1,
    f: $data.currentTab === 1,
    g: $data.currentTab === 2,
    h: $data.showCancelModal
  }, $data.showCancelModal ? {
    i: common_vendor.o(($event) => $data.showCancelModal = false),
    j: common_vendor.o((...args) => $options.confirmCancel && $options.confirmCancel(...args))
  } : {}, {
    k: $data.showPayModal
  }, $data.showPayModal ? {
    l: common_vendor.t((_a = $data.currentOrder) == null ? void 0 : _a.price),
    m: common_vendor.t($data.paymentMethods[$data.selectedPayment].icon),
    n: common_vendor.n($data.paymentMethods[$data.selectedPayment].type),
    o: common_vendor.t($data.paymentMethods[$data.selectedPayment].name),
    p: $data.isPaymentDropdownOpen ? 1 : "",
    q: $data.isPaymentDropdownOpen ? 1 : "",
    r: common_vendor.o((...args) => $options.togglePaymentDropdown && $options.togglePaymentDropdown(...args)),
    s: common_vendor.f($data.paymentMethods, (method, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(method.icon),
        b: common_vendor.n(method.type),
        c: common_vendor.t(method.name),
        d: $data.selectedPayment === index
      }, $data.selectedPayment === index ? {} : {}, {
        e: index,
        f: $data.selectedPayment === index ? 1 : "",
        g: common_vendor.o(($event) => $options.selectPayment(index), index)
      });
    }),
    t: $data.isPaymentDropdownOpen ? 1 : "",
    v: common_vendor.o(($event) => $data.showPayModal = false),
    w: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args))
  } : {}, {
    x: $data.showDetailModal
  }, $data.showDetailModal ? {
    y: common_vendor.t((_b = $data.currentOrder) == null ? void 0 : _b.time),
    z: common_vendor.t((_c = $data.currentOrder) == null ? void 0 : _c.title),
    A: common_vendor.t((_d = $data.currentOrder) == null ? void 0 : _d.price),
    B: common_vendor.t((_e = $data.currentOrder) == null ? void 0 : _e.status),
    C: common_vendor.o((...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
  } : {}, {
    D: $data.showDeleteModal
  }, $data.showDeleteModal ? {
    E: common_vendor.o(($event) => $data.showDeleteModal = false),
    F: common_vendor.o((...args) => $options.confirmDelete && $options.confirmDelete(...args))
  } : {}, {
    G: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/order/student_order.js.map

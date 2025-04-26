"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      tabs: [
        new UTSJSONObject({ name: "待支付", status: "pending" }),
        new UTSJSONObject({ name: "已完成", status: "completed" }),
        new UTSJSONObject({ name: "已取消", status: "cancelled" })
      ],
      currentTab: 0,
      orderList: [],
      page: 1,
      pageSize: 10
    };
  },
  onLoad() {
    this.loadOrders();
  },
  methods: {
    // 切换Tab
    switchTab(index = null) {
      this.currentTab = index;
      this.page = 1;
      this.orderList = [];
      this.loadOrders();
    },
    // 加载订单列表
    loadOrders() {
      const mockOrders = this.generateMockOrders();
      this.orderList = [...this.orderList, ...mockOrders];
    },
    // 加载更多
    loadMore() {
      this.page++;
      this.loadOrders();
    },
    // 生成模拟订单数据
    generateMockOrders() {
      const statusMap = new UTSJSONObject({
        0: "待支付",
        1: "已完成",
        2: "已取消"
      });
      const orders = [];
      for (let i = 0; i < this.pageSize; i++) {
        orders.push({
          orderId: `ORDER${Date.now()}${i}`,
          title: `课程${i + 1}`,
          price: (Math.random() * 1e3).toFixed(2),
          image: "/static/image/default_course.png",
          createTime: (/* @__PURE__ */ new Date()).toLocaleString(),
          status: statusMap[this.currentTab]
        });
      }
      return orders;
    },
    // 处理支付
    handlePay(order = null) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认支付",
        content: `是否确认支付订单 ${order.orderId}？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "支付中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              this.loadOrders();
            }, 1500);
          }
        }
      }));
    },
    // 处理评价
    handleReview(order = null) {
      common_vendor.index.navigateTo({
        url: `/pages/order/review?orderId=${order.orderId}`
      });
    },
    // 处理取消
    handleCancel(order = null) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认取消",
        content: `是否确认取消订单 ${order.orderId}？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "已取消",
                icon: "success"
              });
              this.loadOrders();
            }, 1e3);
          }
        }
      }));
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: common_vendor.sei("tab-" + index, "view"),
        c: index,
        d: $data.currentTab === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: "tab-" + $data.currentTab,
    c: common_vendor.f($data.orderList, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderId),
        b: common_vendor.t(order.status),
        c: order.image,
        d: common_vendor.t(order.title),
        e: common_vendor.t(order.price),
        f: common_vendor.t(order.createTime),
        g: order.status === "待支付"
      }, order.status === "待支付" ? {
        h: common_vendor.o(($event) => $options.handlePay(order), index)
      } : {}, {
        i: order.status === "已完成"
      }, order.status === "已完成" ? {
        j: common_vendor.o(($event) => $options.handleReview(order), index)
      } : {}, {
        k: order.status === "待支付"
      }, order.status === "待支付" ? {
        l: common_vendor.o(($event) => $options.handleCancel(order), index)
      } : {}, {
        m: index
      });
    }),
    d: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/order.js.map

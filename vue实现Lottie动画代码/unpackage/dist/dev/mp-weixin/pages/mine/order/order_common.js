"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      // Tab栏配置
      currentTab: 0,
      tabs: ["待支付", "已支付", "已完成", "已取消"],
      // 老师tab配置
      teacherCurrentTab: 0,
      teacherTabs: ["待服务", "已完成", "已取消"],
      // 学生订单列表
      orders: [
        new UTSJSONObject({
          id: "1001",
          time: "2024-03-20 14:30",
          status: "待支付",
          title: "课程A - 一对一辅导",
          price: "299.00",
          teacherName: "张老师"
        }),
        new UTSJSONObject({
          id: "1002",
          time: "2024-03-19 10:15",
          status: "已完成",
          title: "课程B - 小组课程",
          price: "199.00",
          teacherName: "李老师"
        }),
        new UTSJSONObject({
          id: "1003",
          time: "2024-03-18 16:45",
          status: "已取消",
          title: "课程C - 专项训练",
          price: "399.00",
          teacherName: "王老师"
        })
      ],
      // 教师订单列表
      teacherOrders: [
        new UTSJSONObject({
          id: "2001",
          time: "2024-03-21 15:30",
          status: "待确认",
          title: "高数辅导 - 一对一",
          price: "350.00",
          studentName: "张三"
        }),
        new UTSJSONObject({
          id: "2002",
          time: "2024-03-20 09:00",
          status: "进行中",
          title: "英语口语 - 一对一",
          price: "280.00",
          studentName: "李四"
        }),
        new UTSJSONObject({
          id: "2003",
          time: "2024-03-15 16:30",
          status: "已完成",
          title: "物理辅导 - 一对一",
          price: "320.00",
          studentName: "王五"
        })
      ],
      // 弹窗控制
      showCancelModal: false,
      showPayModal: false,
      showDetailModal: false,
      showDeleteModal: false,
      showConfirmOrderModal: false,
      // 当前操作的订单
      currentOrder: null,
      // 支付方式
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
      ]
    };
  },
  computed: {
    /**
     * @description 根据用户角色返回不同的Tab标签
     */
    currentTabs() {
      return this.userRole === "teacher" ? this.teacherTabs : this.tabs;
    }
  },
  onLoad() {
  },
  onShow() {
    this.$nextTick(() => {
      this.loadUserData();
      const storedUserRole = common_vendor.index.getStorageSync("userRole");
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.userRole = storedUserRole;
        this.loadOrderData();
      }
    });
  },
  methods: {
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          try {
            this.userData = typeof userInfo === "string" ? UTS.JSON.parse(userInfo) : userInfo;
            this.userName = this.userData.nickname || "用户";
            if (this.userData.role) {
              this.userRole = this.userData.role;
              common_vendor.index.setStorageSync("userRole", this.userData.role);
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/order/order_common.vue:387", "解析用户信息失败:", e);
          }
        }
      } else {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        this.userRole = "student";
      }
    },
    /**
     * @description 加载订单数据
     */
    loadOrderData() {
      common_vendor.index.__f__("log", "at pages/mine/order/order_common.vue:404", `加载${this.userRole}角色的订单数据`);
    },
    /**
     * @description 切换标签页
     * @param {Number} index 标签索引
     */
    switchTab(index = null) {
      if (this.userRole === "teacher") {
        this.teacherCurrentTab = index;
      } else {
        this.currentTab = index;
      }
    },
    /**
     * @description 取消订单
     * @param {Object} order 订单对象
     */
    cancelOrder(order = null) {
      this.currentOrder = order;
      this.showCancelModal = true;
    },
    /**
     * @description 确认取消订单
     */
    confirmCancel() {
      common_vendor.index.showToast({
        title: "订单已取消",
        icon: "success"
      });
      this.showCancelModal = false;
    },
    /**
     * @description 支付订单
     * @param {Object} order 订单对象
     */
    payOrder(order = null) {
      this.currentOrder = order;
      this.showPayModal = true;
    },
    /**
     * @description 切换支付方式下拉菜单
     */
    togglePaymentDropdown() {
      this.isPaymentDropdownOpen = !this.isPaymentDropdownOpen;
    },
    /**
     * @description 选择支付方式
     * @param {Number} index 支付方式索引
     */
    selectPayment(index = null) {
      this.selectedPayment = index;
      setTimeout(() => {
        this.isPaymentDropdownOpen = false;
      }, 200);
    },
    /**
     * @description 确认支付
     */
    confirmPay() {
      const payMethod = this.paymentMethods[this.selectedPayment].name;
      common_vendor.index.showToast({
        title: `${payMethod}支付成功`,
        icon: "success"
      });
      this.showPayModal = false;
      this.isPaymentDropdownOpen = false;
    },
    /**
     * @description 查看订单详情
     * @param {Object} order 订单对象
     */
    viewDetail(order = null) {
      this.currentOrder = order;
      this.showDetailModal = true;
    },
    /**
     * @description 关闭详情弹窗
     */
    closeDetailModal() {
      this.showDetailModal = false;
      this.currentOrder = null;
    },
    /**
     * @description 删除订单
     * @param {Object} order 订单对象
     */
    deleteOrder(order = null) {
      this.currentOrder = order;
      this.showDeleteModal = true;
    },
    /**
     * @description 确认删除订单
     */
    confirmDelete() {
      common_vendor.index.showToast({
        title: "删除成功",
        icon: "success"
      });
      this.showDeleteModal = false;
    },
    /**
     * @description 跳转到评价页面
     * @param {Object} order 订单对象
     */
    goToAppraise(order = null) {
      router_Router.Navigator.toAppraise(order.id);
    },
    /**
     * @description 教师确认订单
     * @param {Object} order 订单对象
     */
    confirmOrder(order = null) {
      this.currentOrder = order;
      this.showConfirmOrderModal = true;
    },
    /**
     * @description 教师确认接受订单操作
     */
    confirmOrderAction() {
      common_vendor.index.showToast({
        title: "已接受订单",
        icon: "success"
      });
      this.showConfirmOrderModal = false;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g;
  return common_vendor.e({
    a: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    b: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    })
  } : {}, {
    c: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    d: common_vendor.f($data.teacherTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.teacherCurrentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    })
  } : {}, {
    e: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    f: common_vendor.f($data.orders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.title),
        b: common_vendor.t(order.teacherName || "暂无"),
        c: common_vendor.t(order.price)
      }, $data.currentTab === 0 ? {
        d: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, $data.currentTab === 0 ? {
        e: common_vendor.o(($event) => $options.payOrder(order), index)
      } : {}, $data.currentTab === 1 ? {
        f: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, $data.currentTab === 2 ? {
        g: common_vendor.o(($event) => _ctx.abnormalAppeal(order), index)
      } : {}, $data.currentTab === 3 ? {
        h: common_vendor.o(($event) => $options.payOrder(order), index)
      } : {}, {
        i: index
      });
    }),
    g: $data.currentTab === 0,
    h: $data.currentTab === 0,
    i: $data.currentTab === 1,
    j: $data.currentTab === 2,
    k: $data.currentTab === 3
  } : {
    l: common_vendor.f($data.teacherOrders, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.title),
        b: common_vendor.t(order.studentName),
        c: common_vendor.t(order.price)
      }, $data.teacherCurrentTab === 0 ? {
        d: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, {
        e: index
      });
    }),
    m: $data.teacherCurrentTab === 0
  }, {
    n: $data.showCancelModal
  }, $data.showCancelModal ? {
    o: common_vendor.o(($event) => $data.showCancelModal = false),
    p: common_vendor.o((...args) => $options.confirmCancel && $options.confirmCancel(...args))
  } : {}, {
    q: $data.showPayModal
  }, $data.showPayModal ? {
    r: common_vendor.t((_a = $data.currentOrder) == null ? void 0 : _a.price),
    s: common_vendor.t($data.paymentMethods[$data.selectedPayment].icon),
    t: common_vendor.n($data.paymentMethods[$data.selectedPayment].type),
    v: common_vendor.t($data.paymentMethods[$data.selectedPayment].name),
    w: $data.isPaymentDropdownOpen ? 1 : "",
    x: $data.isPaymentDropdownOpen ? 1 : "",
    y: common_vendor.o((...args) => $options.togglePaymentDropdown && $options.togglePaymentDropdown(...args)),
    z: common_vendor.f($data.paymentMethods, (method, index, i0) => {
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
    A: $data.isPaymentDropdownOpen ? 1 : "",
    B: common_vendor.o(($event) => $data.showPayModal = false),
    C: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args))
  } : {}, {
    D: $data.showDetailModal
  }, $data.showDetailModal ? common_vendor.e({
    E: common_vendor.t((_b = $data.currentOrder) == null ? void 0 : _b.time),
    F: common_vendor.t((_c = $data.currentOrder) == null ? void 0 : _c.title),
    G: common_vendor.t((_d = $data.currentOrder) == null ? void 0 : _d.price),
    H: common_vendor.t((_e = $data.currentOrder) == null ? void 0 : _e.status),
    I: $data.userRole === "teacher" && ((_f = $data.currentOrder) == null ? void 0 : _f.studentName)
  }, $data.userRole === "teacher" && ((_g = $data.currentOrder) == null ? void 0 : _g.studentName) ? {
    J: common_vendor.t($data.currentOrder.studentName)
  } : {}, {
    K: common_vendor.o((...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
  }) : {}, {
    L: $data.showDeleteModal
  }, $data.showDeleteModal ? {
    M: common_vendor.o(($event) => $data.showDeleteModal = false),
    N: common_vendor.o((...args) => $options.confirmDelete && $options.confirmDelete(...args))
  } : {}, {
    O: $data.showConfirmOrderModal
  }, $data.showConfirmOrderModal ? {
    P: common_vendor.o(($event) => $data.showConfirmOrderModal = false),
    Q: common_vendor.o((...args) => $options.confirmOrderAction && $options.confirmOrderAction(...args))
  } : {}, {
    R: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/order/order_common.js.map

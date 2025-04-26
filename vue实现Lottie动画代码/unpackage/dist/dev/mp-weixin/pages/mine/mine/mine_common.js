"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const store_index = require("../../../store/index.js");
const store_user_baseInfo_config = require("../../../store/user/baseInfo/config.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      MineRoutes: router_Router.MineRoutes,
      isLoading: false,
      useMockData: store_user_baseInfo_config.USE_MOCK_DATA
    };
  },
  computed: {
    // 直接从store获取状态
    profile() {
      var _a;
      try {
        return ((_a = store_index.store === null || store_index.store === void 0 ? void 0 : store_index.store.getters) === null || _a === void 0 ? void 0 : _a["user/baseInfo/profile"]) || new UTSJSONObject({});
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:112", "获取profile失败", e);
        return new UTSJSONObject({});
      }
    },
    userRole() {
      var _a;
      try {
        return ((_a = store_index.store === null || store_index.store === void 0 ? void 0 : store_index.store.getters) === null || _a === void 0 ? void 0 : _a["user/baseInfo/userRole"]) || "student";
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:120", "获取userRole失败", e);
        return "student";
      }
    },
    isTeacher() {
      var _a;
      try {
        return ((_a = store_index.store === null || store_index.store === void 0 ? void 0 : store_index.store.getters) === null || _a === void 0 ? void 0 : _a["user/baseInfo/isTeacher"]) || false;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:128", "获取isTeacher失败", e);
        return false;
      }
    }
  },
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      try {
        this.ensureUserLogin();
        yield this.loadUserData();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:140", "onLoad错误:", error);
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      try {
        const storedUserRole = common_vendor.index.getStorageSync("userRole");
        if (storedUserRole) {
          yield this.updateUserRole(storedUserRole);
          yield this.loadUserData();
        } else {
          if (!this.profile || !this.profile.nickname) {
            yield this.loadUserData();
          } else {
            this.userData = new UTSJSONObject(Object.assign({}, this.profile));
            this.userName = this.profile.nickname || "用户";
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:159", "onShow错误:", error);
      }
    });
  },
  methods: {
    /**
     * @description 确保用户已登录
     */
    ensureUserLogin() {
      if (this.useMockData && !common_vendor.index.getStorageSync("userId")) {
        common_vendor.index.setStorageSync("userId", "123456");
        common_vendor.index.setStorageSync("user-token", "mock_token_for_testing");
      }
    },
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    updateUserRole(role = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          if (store_index.store && typeof store_index.store.dispatch === "function") {
            yield store_index.store.dispatch("user/baseInfo/updateRole", role);
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:184", "store.dispatch不可用，使用本地存储");
            common_vendor.index.setStorageSync("userRole", role);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:188", "更新用户角色失败", error);
          try {
            if (store_index.store && typeof store_index.store.commit === "function") {
              store_index.store.commit("user/baseInfo/updateRole", role);
            }
            common_vendor.index.setStorageSync("userRole", role);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:195", "更新用户角色本地存储失败", e);
          }
        }
      });
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.isLoading = true;
        try {
          this.ensureUserLogin();
          yield this.syncUserDataFromVuex();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:212", "加载用户数据失败", error);
        } finally {
          this.isLoading = false;
        }
      });
    },
    /**
     * @description 从Vuex同步用户数据
     */
    syncUserDataFromVuex() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          if (store_index.store && typeof store_index.store.dispatch === "function") {
            const result = yield store_index.store.dispatch("user/baseInfo/getUserInfo");
            if (result && result.nickname) {
              this.userData = new UTSJSONObject(Object.assign({}, result));
              this.userName = result.nickname || "用户";
              this.isLoggedIn = true;
            } else if (this.profile && this.profile.nickname) {
              this.userData = new UTSJSONObject(Object.assign({}, this.profile));
              this.userName = this.profile.nickname || "用户";
              this.isLoggedIn = true;
            }
          } else {
            this.loadMockDataFallback();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:240", "同步用户数据失败", error);
          this.loadMockDataFallback();
        }
      });
    },
    /**
     * @description 加载模拟数据作为回退
     */
    loadMockDataFallback() {
      if (this.useMockData) {
        this.userData = new UTSJSONObject({
          avatar: "/static/image/tab-bar/default_avatar.png",
          nickname: "模拟用户",
          role: "teacher"
        });
        this.userName = "模拟用户";
        this.isLoggedIn = true;
      }
    },
    /**
     * @description 处理头像点击
     */
    handleAvatarClick() {
      this.handleEditProfile();
    },
    /**
     * @description 处理登录文本点击
     */
    handleLoginClick() {
      if (this.isLoggedIn) {
        this.handleEditProfile();
      } else {
        router_Router.Navigator.toLogin();
      }
    },
    /**
     * @description 跳转到修改个人信息页面
     */
    handleEditProfile() {
      router_Router.Navigator.toModify();
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      router_Router.Navigator.navigateTo(url);
    }
  }
});
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userData.avatar || $options.profile.avatar || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    c: common_vendor.t($data.userData.nickname || $options.profile.nickname || "登录"),
    d: common_vendor.o((...args) => $options.handleLoginClick && $options.handleLoginClick(...args)),
    e: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    f: $options.isTeacher
  }, $options.isTeacher ? {
    g: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SERVICE))
  } : {}, {
    h: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    i: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    j: $options.isTeacher
  }, $options.isTeacher ? {
    k: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.QUALIFICATION))
  } : {}, {
    l: $options.isTeacher
  }, $options.isTeacher ? {
    m: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.WALLET))
  } : {}, {
    n: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    o: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS)),
    p: common_vendor.p({
      pageName: "mine"
    }),
    q: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const store_index = require("../../../store/index.js");
const store_services_index = require("../../../store/services/index.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: true,
      MineRoutes: router_Router.MineRoutes,
      isLoading: false
      // 加载状态
    };
  },
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      this.isLoading = true;
      try {
        const storedUserRole = common_vendor.index.getStorageSync("userRole") || "student";
        this.userRole = storedUserRole;
        if (this.userRole === "teacher") {
          yield store_index.loadTeacherData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:124", "教师数据已加载");
        } else {
          yield store_index.loadStudentData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:128", "学生数据已加载");
        }
        this.loadMockData();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:133", "当前用户角色:", this.userRole);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:135", "加载用户数据失败:", error);
      } finally {
        this.isLoading = false;
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      const token = common_vendor.index.getStorageSync("token");
      const isCurrentlyLoggedIn = !!token;
      this.isLoggedIn = isCurrentlyLoggedIn;
      if (!this.isLoggedIn) {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:151", "onShow: 用户未登录，清除用户数据显示");
        return Promise.resolve(null);
      }
      const storedUserRole = common_vendor.index.getStorageSync("userRole");
      const useMockData = common_vendor.index.getStorageSync("use_mock_api") === "true";
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:159", "onShow: 模拟数据状态:", useMockData ? "启用" : "禁用");
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.isLoading = true;
        try {
          this.userRole = storedUserRole;
          if (this.userRole === "teacher") {
            yield store_index.loadTeacherData();
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:170", "教师数据已重新加载");
          } else {
            yield store_index.loadStudentData();
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:173", "学生数据已重新加载");
          }
          this.loadMockData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:178", "onShow 更新用户角色:", this.userRole);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:180", "角色切换时加载数据失败:", error);
        } finally {
          this.isLoading = false;
        }
      } else {
        if (useMockData) {
          this.loadMockData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:189", "onShow: 重新加载模拟数据");
        }
      }
    });
  },
  methods: {
    /**
     * @description 加载模拟数据
     */
    loadMockData() {
      const storageSetting = common_vendor.index.getStorageSync("use_mock_api");
      const useMockData = storageSetting === "true" || true;
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:202", "加载用户数据，模拟数据状态:", useMockData ? "启用" : "禁用", "Storage值:", storageSetting);
      if (useMockData && storageSetting !== "true") {
        common_vendor.index.setStorageSync("use_mock_api", "true");
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:207", "已更新storage中的模拟数据设置为: true");
      }
      const token = common_vendor.index.getStorageSync("token");
      this.isLoggedIn = !!token;
      if (!this.isLoggedIn) {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:218", "用户未登录，不加载用户资料");
        return null;
      }
      this.isLoading = true;
      store_services_index.services.user.getUserProfile(this.userRole).then((response = null) => {
        if (response && response.data) {
          this.userData = response.data;
          this.userName = this.userData.nickname || "用户";
          common_vendor.index.setStorageSync("userRole", this.userRole);
          common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userData));
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:237", "加载用户资料成功:", this.userData);
        } else {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:239", "获取用户资料失败: 响应数据无效");
        }
      }).catch((error = null) => {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:243", "获取用户资料失败:", error);
      }).finally(() => {
        this.isLoading = false;
      });
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
      this.handleEditProfile();
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
    a: $data.userData.avatarUrl || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    c: common_vendor.t($data.userData.nickname || $data.userName || "登录"),
    d: common_vendor.o((...args) => $options.handleLoginClick && $options.handleLoginClick(...args)),
    e: $data.userData.tag
  }, $data.userData.tag ? {
    f: common_vendor.t($data.userData.tag)
  } : {}, {
    g: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    h: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    i: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SERVICE))
  } : {}, {
    j: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    k: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    l: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    m: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.QUALIFICATION))
  } : {}, {
    n: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    o: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.WALLET))
  } : {}, {
    p: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    q: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS)),
    r: common_vendor.p({
      pageName: "mine"
    }),
    s: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

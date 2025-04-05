"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
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
      isLoggedIn: false,
      MineRoutes: router_Router.MineRoutes
      // 引入路由对象方便模板使用
    };
  },
  onLoad() {
    const storedUserRole = common_vendor.index.getStorageSync("userRole");
    if (storedUserRole) {
      this.userRole = storedUserRole;
    }
    this.loadUserData();
    common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:148", "当前用户角色:", this.userRole);
  },
  onShow() {
    this.loadUserData();
    const storedUserRole = common_vendor.index.getStorageSync("userRole");
    if (storedUserRole) {
      this.userRole = storedUserRole;
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:158", "onShow 更新用户角色:", this.userRole);
    }
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
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:185", "解析用户信息失败:", e);
          }
        }
      } else {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        this.userRole = "student";
      }
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:195", "加载用户数据后的角色:", this.userRole);
    },
    /**
     * @description 处理头像点击
     */
    handleAvatarClick() {
      if (!this.isLoggedIn) {
        router_Router.Navigator.toLogin();
      } else {
        this.handleEditProfile();
      }
    },
    /**
     * @description 处理登录文本点击
     */
    handleLoginClick() {
      if (!this.isLoggedIn) {
        router_Router.Navigator.toLogin();
      } else {
        this.handleEditProfile();
      }
    },
    /**
     * @description 跳转到修改个人信息页面
     */
    handleEditProfile() {
      if (!this.isLoggedIn) {
        router_Router.Navigator.toLogin();
        return null;
      }
      router_Router.Navigator.toModify();
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      if (!this.isLoggedIn) {
        router_Router.Navigator.toLogin();
        return null;
      }
      router_Router.Navigator.navigateTo(url);
    },
    /**
     * @description 处理退出登录
     */
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("userRole");
            this.isLoggedIn = false;
            this.userData = new UTSJSONObject({});
            this.userName = "";
            this.userRole = "student";
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
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
    i: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SERVICE)),
    j: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    k: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    l: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.QUALIFICATION)),
    m: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.WALLET)),
    n: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    o: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS))
  } : {
    p: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    q: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    r: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    s: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS))
  }, {
    t: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    v: common_vendor.o(($event) => $options.handleLogout())
  } : {}, {
    w: common_vendor.p({
      pageName: "mine"
    }),
    x: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

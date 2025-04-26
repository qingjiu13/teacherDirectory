"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const store_user_baseInfo_config = require("../../store/user/baseInfo/config.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      isLoggedIn: true,
      switching: false,
      useMockData: false,
      mockUserInfo: ""
      // 当前模拟用户信息
    };
  },
  computed: {
    // 直接从store获取数据，替代mapGetters
    isTeacher() {
      return store_index.store.getters["user/baseInfo/isTeacher"];
    },
    userRole() {
      return store_index.store.getters["user/baseInfo/userRole"];
    },
    profile() {
      return store_index.store.getters["user/baseInfo/profile"];
    },
    isStudent() {
      return !this.isTeacher;
    }
  },
  onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    this.isLoggedIn = !!token;
    this.checkMockDataStatus();
    this.getMockUserInfo();
  },
  methods: {
    // 直接调用store的dispatch方法，替代mapActions
    /**
     * @description 检查模拟数据状态
     */
    checkMockDataStatus() {
      this.useMockData = store_user_baseInfo_config.USE_MOCK_DATA;
      const localMockSetting = common_vendor.index.getStorageSync("use_mock_api");
      if (localMockSetting !== "") {
        this.useMockData = localMockSetting === "true";
      }
      common_vendor.index.__f__("log", "at pages/mine/settings.vue:118", "当前模拟数据状态:", this.useMockData ? "使用模拟数据" : "使用真实API");
    },
    /**
     * @description 获取模拟用户信息
     */
    getMockUserInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.useMockData) {
          try {
            yield store_index.store.dispatch("user/baseInfo/getUserInfo");
            this.mockUserInfo = `${this.profile.nickname || "未登录"} (${this.isTeacher ? "老师" : "学生"})`;
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/mine/settings.vue:130", "获取模拟用户信息失败:", error);
            this.mockUserInfo = "未知用户";
          }
        } else {
          this.mockUserInfo = "";
        }
      });
    },
    /**
     * @description 处理切换身份
     */
    handleSwitchRole() {
      if (this.switching)
        return null;
      const newRole = this.isTeacher ? "student" : "teacher";
      common_vendor.index.showModal({
        title: "切换身份",
        content: `确定要切换到${newRole === "teacher" ? "老师" : "学生"}模式吗？`,
        success: (res) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            if (res.confirm) {
              try {
                this.switching = true;
                yield store_index.store.dispatch("user/baseInfo/updateRole", newRole);
                common_vendor.index.showToast({
                  title: newRole === "teacher" ? "已切换为老师模式" : "已切换为学生模式",
                  icon: "none"
                });
                setTimeout(() => {
                  router_Router.Navigator.reLaunch("/pages/mine/mine/mine_common");
                }, 1500);
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/mine/settings.vue:168", "切换角色失败:", error);
                common_vendor.index.showToast({
                  title: "切换角色失败",
                  icon: "none"
                });
              } finally {
                this.switching = false;
              }
            }
          });
        }
      });
    },
    /**
     * @description 处理联系我们
     */
    handleContactUs() {
      common_vendor.index.showModal({
        title: "联系我们",
        content: "客服电话：400-123-4567\n客服邮箱：support@example.com\n工作时间：周一至周五 9:00-18:00",
        showCancel: false
      });
    },
    /**
     * @description 处理退出登录
     */
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            if (res.confirm) {
              try {
                yield store_index.store.dispatch("user/baseInfo/logout");
                common_vendor.index.showToast({
                  title: "已退出登录",
                  icon: "success"
                });
                setTimeout(() => {
                  router_Router.Navigator.reLaunch("/pages/mine/mine/mine_common");
                }, 1500);
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/mine/settings.vue:216", "退出登录时出错:", error);
                common_vendor.index.showToast({
                  title: "退出登录时出错",
                  icon: "none"
                });
              }
            }
          });
        }
      });
    },
    /**
     * @description 切换模拟数据开关
     */
    toggleMockData() {
      this.useMockData = !this.useMockData;
      common_vendor.index.setStorageSync("use_mock_api", this.useMockData ? "true" : "false");
      this.getMockUserInfo();
      common_vendor.index.showToast({
        title: this.useMockData ? "已开启模拟数据" : "已关闭模拟数据",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.showModal({
          title: "提示",
          content: "设置已更改，推荐刷新或重启应用以使更改完全生效",
          showCancel: true,
          confirmText: "刷新",
          success: (res) => {
            if (res.confirm) {
              router_Router.Navigator.reLaunch("/pages/mine/settings");
            }
          }
        });
      }, 1e3);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.isTeacher ? "老师" : "学生"),
    b: $data.useMockData
  }, $data.useMockData ? {} : {}, {
    c: common_vendor.o((...args) => $options.handleSwitchRole && $options.handleSwitchRole(...args)),
    d: common_vendor.o((...args) => $options.handleContactUs && $options.handleContactUs(...args)),
    e: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    f: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}, {
    g: common_vendor.t($data.useMockData ? "✓" : "🔄"),
    h: $data.useMockData ? 1 : "",
    i: !$data.useMockData ? 1 : "",
    j: common_vendor.t($data.useMockData ? "关闭" : "开启"),
    k: common_vendor.o((...args) => $options.toggleMockData && $options.toggleMockData(...args)),
    l: $data.useMockData
  }, $data.useMockData ? {
    m: common_vendor.t($data.mockUserInfo)
  } : {}, {
    n: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/settings.js.map

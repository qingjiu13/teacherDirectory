"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      isLoggedIn: true,
      switching: false,
      useMockData: true
      // 模拟数据开关
    };
  },
  computed: Object.assign({}, common_vendor.mapGetters("user", [
    "isTeacher",
    "isStudent",
    "userRole"
  ])),
  onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    this.isLoggedIn = !!token;
    this.useMockData = common_vendor.index.getStorageSync("use_mock_api") === "true";
  },
  methods: Object.assign(Object.assign({}, common_vendor.mapActions("user", [
    "switchRole",
    "clearProfile"
  ])), {
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
                yield this.switchRole(newRole);
                common_vendor.index.showToast({
                  title: newRole === "teacher" ? "已切换为老师模式" : "已切换为学生模式",
                  icon: "none"
                });
                setTimeout(() => {
                  router_Router.Navigator.reLaunch("/pages/mine/mine/mine_common");
                }, 1500);
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/mine/settings.uvue:106", "切换角色失败:", error);
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
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            try {
              this.clearProfile();
              common_vendor.index.showToast({
                title: "已退出登录",
                icon: "success"
              });
              setTimeout(() => {
                router_Router.Navigator.reLaunch("/pages/mine/mine/mine_common");
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/mine/settings.uvue:160", "退出登录时出错:", error);
              common_vendor.index.showToast({
                title: "退出登录时出错",
                icon: "none"
              });
            }
          }
        }
      });
    },
    /**
     * @description 切换模拟数据开关
     */
    toggleMockData() {
      const currentSetting = common_vendor.index.getStorageSync("use_mock_api") === "true";
      this.useMockData = !currentSetting;
      common_vendor.index.setStorageSync("use_mock_api", this.useMockData ? "true" : "false");
      common_vendor.index.showToast({
        title: this.useMockData ? "已开启模拟数据" : "已关闭模拟数据",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.showModal({
          title: "提示",
          content: "设置已更改，建议重启应用以使更改生效",
          showCancel: true,
          confirmText: "确定"
        });
      }, 1e3);
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.isTeacher ? "老师" : "学生"),
    b: common_vendor.o((...args) => $options.handleSwitchRole && $options.handleSwitchRole(...args)),
    c: common_vendor.o((...args) => $options.handleContactUs && $options.handleContactUs(...args)),
    d: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    e: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}, {
    f: common_vendor.t($data.useMockData ? "关闭" : "开启"),
    g: common_vendor.o((...args) => $options.toggleMockData && $options.toggleMockData(...args)),
    h: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/settings.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      isLoggedIn: false,
      switching: false
      // 角色切换中状态
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapGetters(new UTSJSONObject({
    isTeacher: "user/baseInfo/isTeacher",
    userRole: "user/baseInfo/userRole",
    profile: "user/baseInfo/profile"
  }))), { isStudent() {
    return !this.isTeacher;
  } })),
  onLoad() {
    this.isLoggedIn = store_index.store.getters["user/baseInfo/id"] !== "";
  },
  methods: new UTSJSONObject({
    // 直接调用store的dispatch方法，替代mapActions
    /**
     * @description 处理修改个人信息
     */
    handleModifyInfo() {
      router_Router.Navigator.toModify();
    },
    /**
     * @description 处理切换身份
     */
    handleSwitchRole() {
      if (this.switching)
        return null;
      const newRole = this.isTeacher ? "student" : "teacher";
      common_vendor.index.showModal(new UTSJSONObject({
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
                common_vendor.index.__f__("error", "at pages/mine/settings.vue:104", "切换角色失败:", error);
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
      }));
    },
    /**
     * @description 处理联系我们
     */
    handleContactUs() {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "联系我们",
        content: "客服电话：400-123-4567\n客服邮箱：support@example.com\n工作时间：周一至周五 9:00-18:00",
        showCancel: false
      }));
    },
    /**
     * @description 处理退出登录
     */
    handleLogout() {
      common_vendor.index.showModal(new UTSJSONObject({
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
                common_vendor.index.__f__("error", "at pages/mine/settings.vue:152", "退出登录时出错:", error);
                common_vendor.index.showToast({
                  title: "退出登录时出错",
                  icon: "none"
                });
              }
            }
          });
        }
      }));
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.isTeacher ? "老师" : "学生"),
    b: common_vendor.o((...args) => $options.handleSwitchRole && $options.handleSwitchRole(...args)),
    c: common_vendor.o((...args) => $options.handleModifyInfo && $options.handleModifyInfo(...args)),
    d: common_vendor.o((...args) => $options.handleContactUs && $options.handleContactUs(...args)),
    e: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    f: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}, {
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/settings.js.map

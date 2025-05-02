"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      hasLogin: false,
      userInfo: new UTSJSONObject({
        nickName: "",
        avatarUrl: ""
      }),
      showAgreementModal: false,
      showPrivacyModal: false
    };
  },
  computed: new UTSJSONObject(Object.assign({}, common_vendor.mapState("user/baseInfo", ["isRegistered", "id", "avatar", "name", "phoneNumber"]))),
  onLoad() {
    this.checkLoginStatus();
  },
  methods: new UTSJSONObject(Object.assign(Object.assign(Object.assign({}, common_vendor.mapMutations("user/baseInfo", ["SET_USER_INFO"])), common_vendor.mapActions("user/baseInfo", ["updateUserInfo"])), {
    // 检查登录状态
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (token && this.isRegistered) {
        this.hasLogin = true;
        this.userInfo = {
          nickName: this.name,
          avatarUrl: this.avatar
        };
      }
    },
    /**
     * 微信登录方法
     * @returns {void}
     */
    onWxLogin() {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (res) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            try {
              const result = yield common_vendor.index.request({
                method: "POST",
                url: "http://localhost:8080/users/auth/wechat",
                data: new UTSJSONObject({
                  code: res.code
                })
              });
              common_vendor.index.__f__("log", "at pages/login/wechat_login.vue:149", result);
              if (result.statusCode === 200 && result.data) {
                common_vendor.index.setStorageSync("token", result.data.token);
                if (result.data.userId) {
                  common_vendor.index.setStorageSync("userId", result.data.userId);
                  this.SET_USER_INFO(new UTSJSONObject({
                    id: result.data.userId,
                    isRegistered: 1
                    // 标记为已注册
                  }));
                }
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "登录成功",
                  icon: "success",
                  duration: 1500
                });
                this.hasLogin = true;
                setTimeout(() => {
                  router_Router.Navigator.redirectTo("/pages/login/login_detail");
                }, 1500);
              } else {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "登录失败，请重试",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:191", "登录请求失败", error);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "登录失败，请重试",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:200", "微信登录失败", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      }));
    },
    /**
     * 根据注册状态跳转到相应页面
     * @returns {void}
     */
    toHome() {
      router_Router.Navigator.redirectTo(router_Router.IndexRoutes.INDEX);
    },
    /**
     * 显示用户协议弹窗
     * @returns {void}
     */
    showAgreement() {
      this.showAgreementModal = true;
    },
    /**
     * 显示隐私政策弹窗
     * @returns {void}
     */
    showPrivacy() {
      this.showPrivacyModal = true;
    },
    /**
     * 关闭弹窗
     * @param {string} type - 要关闭的弹窗类型（'agreement'或'privacy'）
     * @returns {void}
     */
    closeModal(type = null) {
      if (type === "agreement") {
        this.showAgreementModal = false;
      } else if (type === "privacy") {
        this.showPrivacyModal = false;
      }
    }
  }))
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: $data.userInfo.avatarUrl || "/static/image/tab-bar/default_avatar.png",
    c: $data.userInfo.nickName
  }, $data.userInfo.nickName ? {
    d: common_vendor.t($data.userInfo.nickName)
  } : {}, {
    e: !$data.hasLogin
  }, !$data.hasLogin ? {
    f: common_assets._imports_1,
    g: common_vendor.o((...args) => $options.onWxLogin && $options.onWxLogin(...args))
  } : {
    h: common_vendor.o((...args) => $options.toHome && $options.toHome(...args))
  }, {
    i: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    j: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    k: $data.showAgreementModal
  }, $data.showAgreementModal ? {
    l: common_vendor.o(($event) => $options.closeModal("agreement")),
    m: common_vendor.o(() => {
    }),
    n: common_vendor.o(($event) => $options.closeModal("agreement"))
  } : {}, {
    o: $data.showPrivacyModal
  }, $data.showPrivacyModal ? {
    p: common_vendor.o(($event) => $options.closeModal("privacy")),
    q: common_vendor.o(() => {
    }),
    r: common_vendor.o(($event) => $options.closeModal("privacy"))
  } : {}, {
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ff132c6c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/wechat_login.js.map

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
  computed: new UTSJSONObject(Object.assign({}, common_vendor.mapState("user/baseInfo", ["isRegistered"]))),
  onLoad() {
    this.checkLoginStatus();
  },
  methods: new UTSJSONObject({
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const token = common_vendor.index.getStorageSync("token");
      if (userInfo && token) {
        this.userInfo = userInfo;
        this.hasLogin = true;
      }
    },
    // 获取用户信息
    onGetUserInfo(e = null) {
      if (e.detail.errMsg === "getUserInfo:ok") {
        this.userInfo = e.detail.userInfo;
        this.loginWithWechat();
      } else {
        common_vendor.index.showToast({
          title: "您已拒绝授权",
          icon: "none"
        });
      }
    },
    // 微信登录
    loginWithWechat() {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (loginRes) => {
          setTimeout(() => {
            common_vendor.index.hideLoading();
            const token = "mock_token_" + Date.now();
            common_vendor.index.setStorageSync("token", token);
            common_vendor.index.setStorageSync("userInfo", this.userInfo);
            this.hasLogin = true;
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            this.toHome();
          }, 1500);
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:172", "微信登录失败:", err);
        }
      }));
    },
    /**
     * 根据注册状态跳转到相应页面
     * @returns {void}
     */
    toHome() {
      if (this.isRegistered) {
        router_Router.Navigator.toIndex();
      } else {
        router_Router.Navigator.toLogin();
      }
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
  })
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
    g: common_vendor.o((...args) => $options.onGetUserInfo && $options.onGetUserInfo(...args))
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

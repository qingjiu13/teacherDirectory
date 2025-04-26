"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      hasLogin: false,
      userInfo: new UTSJSONObject({
        nickName: "",
        avatarUrl: ""
      })
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
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
      common_vendor.index.login({
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
          common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:131", "微信登录失败:", err);
        }
      });
    },
    // 跳转首页
    toHome() {
      router_Router.Navigator.toLogin();
    },
    // 显示用户协议
    showAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/index?type=user"
      });
    },
    // 显示隐私政策
    showPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/index?type=privacy"
      });
    }
  }
});
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
    k: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ff132c6c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/wechat_login.js.map

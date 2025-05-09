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
      }),
      showAgreementModal: false,
      showPrivacyModal: false,
      // 新增授权相关数据
      showAuthPopup: false,
      authStep: "avatar",
      tempUserInfo: new UTSJSONObject({
        nickName: "",
        avatarUrl: "",
        phoneNumber: ""
      }),
      wxLoginCode: ""
      // 存储微信登录的code
    };
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState("user/baseInfo", ["isRegistered", "id", "avatar", "name", "phoneNumber"])), {
    /**
     * 根据当前授权步骤返回弹窗标题
     * @returns {string} 弹窗标题
     */
    authPopupTitle() {
      const titles = new UTSJSONObject({
        "avatar": "选择头像",
        "nickname": "设置昵称",
        "phone": "绑定手机号"
      });
      return titles[this.authStep] || "微信授权";
    }
  }),
  onLoad() {
    this.checkLoginStatus();
  },
  methods: Object.assign(Object.assign(Object.assign({}, common_vendor.mapMutations("user/baseInfo", ["SET_USER_INFO"])), common_vendor.mapActions("user/baseInfo", ["updateUserInfo"])), {
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
     * 微信登录方法 - 更新为新流程
     * @returns {void}
     */
    onWxLogin() {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.code) {
            this.wxLoginCode = res.code;
            this.showAuthPopup = true;
            this.authStep = "avatar";
          } else {
            common_vendor.index.showToast({
              title: "微信登录失败，请重试",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:222", "微信登录失败", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      }));
    },
    /**
     * 处理用户选择头像事件
     * @param {Object} e - 微信返回的头像信息
     */
    onChooseAvatar(e = null) {
      if (e.detail && e.detail.avatarUrl) {
        this.tempUserInfo.avatarUrl = e.detail.avatarUrl;
        this.userInfo.avatarUrl = e.detail.avatarUrl;
        this.goToNicknameStep();
      }
    },
    /**
     * 处理用户输入昵称事件
     * @param {Object} e - 输入事件对象
     */
    onInputNickname(e = null) {
      this.tempUserInfo.nickName = e.detail.value;
      this.userInfo.nickName = e.detail.value;
    },
    /**
     * 进入昵称设置步骤
     */
    goToNicknameStep() {
      this.authStep = "nickname";
    },
    /**
     * 进入手机号授权步骤
     */
    goToPhoneStep() {
      this.authStep = "phone";
    },
    /**
     * 获取微信绑定手机号
     * @param {Object} e - 微信返回的加密数据
     */
    getPhoneNumber(e = null) {
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        this.submitUserInfo(new UTSJSONObject({
          code: this.wxLoginCode,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          avatarUrl: this.tempUserInfo.avatarUrl,
          nickName: this.tempUserInfo.nickName
        }));
      } else {
        common_vendor.index.showToast({
          title: "未授权手机号，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 跳过手机号授权
     */
    skipPhoneAuth() {
      this.submitUserInfo(new UTSJSONObject({
        code: this.wxLoginCode,
        avatarUrl: this.tempUserInfo.avatarUrl,
        nickName: this.tempUserInfo.nickName
      }));
    },
    /**
     * 提交用户信息到后端
     * @param {Object} data - 要提交的用户数据
     */
    submitUserInfo(data = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading({
          title: "提交中..."
        });
        try {
          const result = yield common_vendor.index.request({
            method: "POST",
            url: "http://localhost:8080/users/auth/wechat/profile",
            data
          });
          if (result.statusCode === 200 && result.data) {
            common_vendor.index.setStorageSync("token", result.data.token);
            if (result.data.userId) {
              common_vendor.index.setStorageSync("userId", result.data.userId);
              this.SET_USER_INFO(new UTSJSONObject({
                id: result.data.userId,
                isRegistered: 1,
                name: this.tempUserInfo.nickName,
                avatar: this.tempUserInfo.avatarUrl,
                phoneNumber: result.data.phoneNumber || ""
              }));
              this.userInfo = {
                nickName: this.tempUserInfo.nickName,
                avatarUrl: this.tempUserInfo.avatarUrl
              };
            }
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500
            });
            this.hasLogin = true;
            this.showAuthPopup = false;
            setTimeout(() => {
              router_Router.Navigator.redirectTo(router_Router.IndexRoutes.INDEX);
            }, 1500);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录失败，请重试",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/wechat_login.vue:370", "提交用户信息失败", error);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      });
    },
    /**
     * 取消授权，关闭弹窗
     */
    cancelAuth() {
      this.showAuthPopup = false;
      this.wxLoginCode = "";
      this.tempUserInfo = {
        nickName: "",
        avatarUrl: "",
        phoneNumber: ""
      };
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
  })
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
    s: common_vendor.o((...args) => $options.cancelAuth && $options.cancelAuth(...args)),
    t: common_vendor.t($options.authPopupTitle),
    v: common_vendor.o((...args) => $options.cancelAuth && $options.cancelAuth(...args)),
    w: $data.authStep === "avatar"
  }, $data.authStep === "avatar" ? {
    x: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    y: common_vendor.o((...args) => $options.goToNicknameStep && $options.goToNicknameStep(...args))
  } : {}, {
    z: $data.authStep === "nickname"
  }, $data.authStep === "nickname" ? {
    A: $data.tempUserInfo.nickName,
    B: common_vendor.o((...args) => $options.onInputNickname && $options.onInputNickname(...args)),
    C: common_vendor.o((...args) => $options.goToPhoneStep && $options.goToPhoneStep(...args)),
    D: !$data.tempUserInfo.nickName
  } : {}, {
    E: $data.authStep === "phone"
  }, $data.authStep === "phone" ? {
    F: common_vendor.o((...args) => $options.getPhoneNumber && $options.getPhoneNumber(...args)),
    G: common_vendor.o((...args) => $options.skipPhoneAuth && $options.skipPhoneAuth(...args))
  } : {}, {
    H: $data.showAuthPopup ? 1 : "",
    I: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ff132c6c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/wechat_login.js.map

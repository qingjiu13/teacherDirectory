"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      userInfo: new UTSJSONObject({
        avatar: "",
        nickname: "",
        introduction: "",
        gender: "",
        phone: "",
        wechat: "",
        password: "未设置"
      }),
      updating: false
    };
  },
  computed: new UTSJSONObject(Object.assign({}, common_vendor.mapGetters("user/baseInfo", [
    "profile",
    "userRole",
    "isTeacher"
  ]))),
  watch: {
    updateLoading(val = null) {
      this.updating = val;
    }
  },
  onLoad() {
    this.initUserInfo();
  },
  methods: Object.assign(Object.assign({}, common_vendor.mapActions("user/baseInfo", [
    "getUserInfo",
    "updateUserInfo"
  ])), {
    /**
     * @description 初始化用户信息
     */
    initUserInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const currentRole = common_vendor.index.getStorageSync("userRole") || "student";
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:151", "当前角色:", currentRole);
          yield this.getUserInfo();
          this.userInfo = {
            avatar: this.profile.avatar || "",
            nickname: this.profile.nickname || "",
            introduction: this.profile.introduction || "",
            gender: this.profile.gender || "",
            phone: this.profile.phone || "",
            wechat: this.profile.wechat || "",
            password: this.profile.password || "未设置"
          };
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:167", "获取的用户信息:", this.userInfo);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.vue:169", "获取用户信息失败", error);
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
        }
      });
    },
    /**
     * @description 选择头像
     */
    chooseAvatar() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.userInfo.avatar = tempFilePath;
        }
      }));
    },
    /**
     * @description 跳转到密码设置页面
     */
    navigateToPasswordPage() {
      common_vendor.index.showToast({
        title: "密码设置功能开发中",
        icon: "none"
      });
    },
    /**
     * @description 保存用户资料
     */
    saveProfile() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.userInfo.nickname) {
          common_vendor.index.showToast({
            title: "昵称不能为空",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (this.userInfo.phone && !/^1\d{10}$/.test(this.userInfo.phone)) {
          common_vendor.index.showToast({
            title: "手机号格式不正确",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          this.updating = true;
          const profileData = new UTSJSONObject({
            avatar: this.userInfo.avatar,
            nickname: this.userInfo.nickname,
            introduction: this.userInfo.introduction,
            gender: this.userInfo.gender,
            phone: this.userInfo.phone,
            wechat: this.userInfo.wechat
          });
          yield this.updateUserInfo(profileData);
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.vue:253", "保存失败", error);
          common_vendor.index.showToast({
            title: error.message || "保存失败",
            icon: "none"
          });
        } finally {
          this.updating = false;
        }
      });
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatar || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    c: $data.userInfo.nickname,
    d: common_vendor.o(($event) => $data.userInfo.nickname = $event.detail.value),
    e: $data.userInfo.introduction,
    f: common_vendor.o(($event) => $data.userInfo.introduction = $event.detail.value),
    g: common_vendor.t($data.userInfo.introduction.length),
    h: $data.userInfo.gender === "male" ? 1 : "",
    i: common_vendor.o(($event) => $data.userInfo.gender = "male"),
    j: $data.userInfo.gender === "female" ? 1 : "",
    k: common_vendor.o(($event) => $data.userInfo.gender = "female"),
    l: $data.userInfo.phone,
    m: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    n: $data.userInfo.wechat,
    o: common_vendor.o(($event) => $data.userInfo.wechat = $event.detail.value),
    p: common_vendor.t($data.userInfo.password),
    q: common_vendor.o((...args) => $options.navigateToPasswordPage && $options.navigateToPasswordPage(...args)),
    r: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    s: $data.updating,
    t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/modify.js.map

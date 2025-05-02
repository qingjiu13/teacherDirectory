"use strict";
const common_vendor = require("../../common/vendor.js");
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
      updating: false,
      originalData: null
      // 用于存储原始数据以便对比变更
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign(Object.assign({}, common_vendor.mapState("user/baseInfo", new UTSJSONObject({
    storeId: (state = null) => {
      return state.id;
    },
    storeAvatar: (state = null) => {
      return state.avatar;
    },
    storeName: (state = null) => {
      return state.name;
    },
    storeGender: (state = null) => {
      return state.gender;
    },
    storeSelfIntroduction: (state = null) => {
      return state.selfIntroduction;
    },
    storeWechatNumber: (state = null) => {
      return state.wechatNumber;
    },
    storePhoneNumber: (state = null) => {
      return state.phoneNumber;
    },
    storePassword: (state = null) => {
      return state.password;
    }
  }))), common_vendor.mapGetters("user/baseInfo", [
    "profile",
    "userRole",
    "isTeacher"
  ])), {
    // 计算属性：数据是否已修改
    isDataChanged() {
      if (!this.originalData)
        return false;
      return UTS.JSON.stringify(this.userInfo) !== UTS.JSON.stringify(this.originalData);
    }
  })),
  onLoad() {
    this.initUserInfo();
  },
  onShow() {
    this.initUserInfo();
  },
  methods: Object.assign(Object.assign(Object.assign({}, common_vendor.mapActions("user/baseInfo", [
    "getUserInfo"
  ])), common_vendor.mapMutations("user/baseInfo", [
    "UPDATE_USER_PROFILE"
  ])), {
    /**
     * @description 初始化用户信息
     */
    initUserInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:169", "初始化用户信息...");
          this.userInfo = {
            avatar: this.storeAvatar || "",
            nickname: this.storeName || "",
            introduction: this.storeSelfIntroduction || "",
            gender: this.storeGender || "",
            phone: this.storePhoneNumber || "",
            wechat: this.storeWechatNumber || "",
            password: this.storePassword || "未设置"
          };
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:182", "从store获取的用户信息:", this.userInfo);
          this.originalData = UTS.JSON.parse(UTS.JSON.stringify(this.userInfo));
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.vue:187", "获取用户信息失败", error);
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
        if (!this.isDataChanged) {
          common_vendor.index.showToast({
            title: "未检测到数据变更",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
          return Promise.resolve(null);
        }
        try {
          this.updating = true;
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:249", "开始保存用户资料...");
          const profileData = new UTSJSONObject({
            avatar: this.userInfo.avatar,
            nickname: this.userInfo.nickname,
            name: this.userInfo.nickname,
            selfIntroduction: this.userInfo.introduction,
            introduction: this.userInfo.introduction,
            gender: this.userInfo.gender,
            phoneNumber: this.userInfo.phone,
            phone: this.userInfo.phone,
            wechatNumber: this.userInfo.wechat,
            password: this.userInfo.password
            // 添加password字段到更新数据中
          });
          common_vendor.index.__f__("log", "at pages/mine/modify.vue:266", "要更新的用户资料:", profileData);
          this.UPDATE_USER_PROFILE(profileData);
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          this.originalData = UTS.JSON.parse(UTS.JSON.stringify(this.userInfo));
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.vue:285", "保存失败", error);
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
    h: $data.userInfo.gender === "男" ? 1 : "",
    i: common_vendor.o(($event) => $data.userInfo.gender = "男"),
    j: $data.userInfo.gender === "女" ? 1 : "",
    k: common_vendor.o(($event) => $data.userInfo.gender = "女"),
    l: $data.userInfo.phone,
    m: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    n: $data.userInfo.wechat,
    o: common_vendor.o(($event) => $data.userInfo.wechat = $event.detail.value),
    p: $data.userInfo.password,
    q: common_vendor.o(($event) => $data.userInfo.password = $event.detail.value),
    r: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    s: $data.updating,
    t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/modify.js.map

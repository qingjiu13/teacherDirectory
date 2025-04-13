"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      userInfo: new UTSJSONObject({
        avatar: "",
        nickname: "",
        tags: [],
        introduction: "",
        gender: "",
        phone: "",
        wechat: "",
        password: "未设置"
      }),
      showingTagInput: false,
      newTag: "",
      updating: false
    };
  },
  computed: Object.assign({}, common_vendor.mapGetters("user", [
    "profile",
    "isTeacher",
    "userRole",
    "updateLoading",
    "updateError"
  ])),
  watch: {
    updateLoading(val = null) {
      this.updating = val;
    }
  },
  onLoad() {
    this.initUserInfo();
  },
  methods: Object.assign(Object.assign({}, common_vendor.mapActions("user", [
    "fetchProfile",
    "updateProfile"
  ])), {
    /**
     * @description 初始化用户信息
     */
    initUserInfo() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const currentRole = common_vendor.index.getStorageSync("userRole") || "student";
          common_vendor.index.__f__("log", "at pages/mine/modify.uvue:183", "当前角色:", currentRole);
          yield this.fetchProfile();
          this.userInfo = {
            avatar: this.profile.avatar || "",
            nickname: this.profile.nickname || "",
            tags: [...this.profile.tags || []],
            introduction: this.profile.introduction || "",
            gender: this.profile.gender || "",
            phone: this.profile.phone || "",
            wechat: this.profile.wechat || "",
            password: this.profile.password || "未设置"
          };
          common_vendor.index.__f__("log", "at pages/mine/modify.uvue:200", "获取的用户信息:", this.userInfo);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.uvue:202", "获取用户信息失败", error);
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
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.userInfo.avatar = tempFilePath;
        }
      });
    },
    /**
     * @description 显示标签输入框
     */
    showTagInput() {
      this.showingTagInput = true;
    },
    /**
     * @description 添加标签
     */
    addTag() {
      if (!this.newTag.trim())
        return null;
      if (this.userInfo.tags.length >= 5) {
        common_vendor.index.showToast({
          title: "最多添加5个标签",
          icon: "none"
        });
        return null;
      }
      if (this.userInfo.tags.includes(this.newTag.trim())) {
        common_vendor.index.showToast({
          title: "标签已存在",
          icon: "none"
        });
        return null;
      }
      this.userInfo.tags.push(this.newTag.trim());
      this.newTag = "";
      this.showingTagInput = false;
    },
    /**
     * @description 删除标签
     * @param {Number} index - 标签索引
     */
    removeTag(index = null) {
      this.userInfo.tags.splice(index, 1);
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
          yield this.updateProfile(new UTSJSONObject({
            avatar: this.userInfo.avatar,
            nickname: this.userInfo.nickname,
            tags: this.userInfo.tags,
            introduction: this.userInfo.introduction,
            gender: this.userInfo.gender,
            phone: this.userInfo.phone,
            wechat: this.userInfo.wechat
          }));
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.uvue:326", "保存失败", error);
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
  return common_vendor.e({
    a: $data.userInfo.avatar || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    c: $data.userInfo.nickname,
    d: common_vendor.o(($event) => $data.userInfo.nickname = $event.detail.value),
    e: common_vendor.f($data.userInfo.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    }),
    f: $data.userInfo.tags.length < 5
  }, $data.userInfo.tags.length < 5 ? {
    g: common_vendor.o((...args) => $options.showTagInput && $options.showTagInput(...args))
  } : {}, {
    h: $data.showingTagInput
  }, $data.showingTagInput ? {
    i: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    j: $data.newTag,
    k: common_vendor.o(($event) => $data.newTag = $event.detail.value)
  } : {}, {
    l: $data.userInfo.introduction,
    m: common_vendor.o(($event) => $data.userInfo.introduction = $event.detail.value),
    n: common_vendor.t($data.userInfo.introduction.length),
    o: $data.userInfo.gender === "male" ? 1 : "",
    p: common_vendor.o(($event) => $data.userInfo.gender = "male"),
    q: $data.userInfo.gender === "female" ? 1 : "",
    r: common_vendor.o(($event) => $data.userInfo.gender = "female"),
    s: $data.userInfo.phone,
    t: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    v: $data.userInfo.wechat,
    w: common_vendor.o(($event) => $data.userInfo.wechat = $event.detail.value),
    x: common_vendor.t($data.userInfo.password),
    y: common_vendor.o((...args) => $options.navigateToPasswordPage && $options.navigateToPasswordPage(...args)),
    z: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    A: $data.updating,
    B: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/modify.js.map

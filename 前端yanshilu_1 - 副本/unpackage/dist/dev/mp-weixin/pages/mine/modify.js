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
        certTag: "",
        otherTags: [],
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
  computed: Object.assign(Object.assign({}, common_vendor.mapGetters("user", [
    "profile",
    "isTeacher",
    "userRole",
    "updateLoading",
    "updateError",
    "teacherCertTag",
    "teacherOtherTags",
    "studentTags"
  ])), {
    /**
     * @description 获取要显示的标签，老师显示otherTags，学生显示全部tags
     * @returns {Array} 要显示的标签数组
     */
    displayTags() {
      if (this.isTeacher) {
        return this.userInfo.otherTags || [];
      } else {
        return this.userInfo.tags || [];
      }
    },
    /**
     * @description 获取认证标签
     * @returns {String} 认证标签
     */
    certTag() {
      return this.userInfo.certTag || "";
    },
    /**
     * @description 获取最大标签数量
     * @returns {Number} 最大标签数量
     */
    maxTagsCount() {
      return this.isTeacher ? 4 : 5;
    }
  }),
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
          common_vendor.index.__f__("log", "at pages/mine/modify.uvue:227", "当前角色:", currentRole);
          yield this.fetchProfile();
          if (this.isTeacher) {
            this.userInfo = {
              avatar: this.profile.avatar || "",
              nickname: this.profile.nickname || "",
              tags: [...this.profile.tags || []],
              certTag: this.teacherCertTag || "",
              otherTags: [...this.teacherOtherTags || []],
              introduction: this.profile.introduction || "",
              gender: this.profile.gender || "",
              phone: this.profile.phone || "",
              wechat: this.profile.wechat || "",
              password: this.profile.password || "未设置"
            };
          } else {
            this.userInfo = {
              avatar: this.profile.avatar || "",
              nickname: this.profile.nickname || "",
              tags: [...this.studentTags || []],
              introduction: this.profile.introduction || "",
              gender: this.profile.gender || "",
              phone: this.profile.phone || "",
              wechat: this.profile.wechat || "",
              password: this.profile.password || "未设置"
            };
          }
          common_vendor.index.__f__("log", "at pages/mine/modify.uvue:261", "获取的用户信息:", this.userInfo);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.uvue:263", "获取用户信息失败", error);
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
      const maxCount = this.maxTagsCount;
      const currentTags = this.displayTags;
      if (currentTags.length >= maxCount) {
        common_vendor.index.showToast({
          title: `最多添加${maxCount}个标签`,
          icon: "none"
        });
        return null;
      }
      if (currentTags.includes(this.newTag.trim())) {
        common_vendor.index.showToast({
          title: "标签已存在",
          icon: "none"
        });
        return null;
      }
      if (this.isTeacher) {
        this.userInfo.otherTags.push(this.newTag.trim());
      } else {
        this.userInfo.tags.push(this.newTag.trim());
      }
      this.newTag = "";
      this.showingTagInput = false;
    },
    /**
     * @description 删除标签
     * @param {Number} index - 标签索引
     */
    removeTag(index = null) {
      if (this.isTeacher) {
        this.userInfo.otherTags.splice(index, 1);
      } else {
        this.userInfo.tags.splice(index, 1);
      }
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
          if (this.isTeacher) {
            profileData.certTag = this.userInfo.certTag;
            profileData.otherTags = this.userInfo.otherTags;
          } else {
            profileData.tags = this.userInfo.tags;
          }
          yield this.updateProfile(profileData);
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/modify.uvue:415", "保存失败", error);
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
    e: _ctx.isTeacher && $options.certTag
  }, _ctx.isTeacher && $options.certTag ? {
    f: common_vendor.t($options.certTag)
  } : {}, {
    g: _ctx.isTeacher
  }, _ctx.isTeacher ? {} : {}, {
    h: common_vendor.f($options.displayTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    }),
    i: $options.displayTags.length < $options.maxTagsCount
  }, $options.displayTags.length < $options.maxTagsCount ? {
    j: common_vendor.o((...args) => $options.showTagInput && $options.showTagInput(...args))
  } : {}, {
    k: $data.showingTagInput
  }, $data.showingTagInput ? {
    l: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    m: $data.newTag,
    n: common_vendor.o(($event) => $data.newTag = $event.detail.value)
  } : {}, {
    o: $data.userInfo.introduction,
    p: common_vendor.o(($event) => $data.userInfo.introduction = $event.detail.value),
    q: common_vendor.t($data.userInfo.introduction.length),
    r: $data.userInfo.gender === "male" ? 1 : "",
    s: common_vendor.o(($event) => $data.userInfo.gender = "male"),
    t: $data.userInfo.gender === "female" ? 1 : "",
    v: common_vendor.o(($event) => $data.userInfo.gender = "female"),
    w: $data.userInfo.phone,
    x: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    y: $data.userInfo.wechat,
    z: common_vendor.o(($event) => $data.userInfo.wechat = $event.detail.value),
    A: common_vendor.t($data.userInfo.password),
    B: common_vendor.o((...args) => $options.navigateToPasswordPage && $options.navigateToPasswordPage(...args)),
    C: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    D: $data.updating,
    E: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/modify.js.map

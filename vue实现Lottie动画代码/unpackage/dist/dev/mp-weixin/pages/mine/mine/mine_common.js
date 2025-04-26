"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
require("../../../store/index.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    TabBar
  },
  data() {
    return {
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      MineRoutes: router_Router.MineRoutes,
      isLoading: false,
      isDebug: true
      // 显示调试信息
    };
  },
  computed: new UTSJSONObject(Object.assign({}, common_vendor.mapState("user/baseInfo", new UTSJSONObject({
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
    storeUserInfo: (state = null) => {
      return state.userInfo;
    }
  })))),
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:119", "mine_common.vue onLoad开始执行");
      try {
        yield this.$nextTick();
        this.initFromStore();
        yield this.loadUserData();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:130", "mine_common.vue onLoad执行完成，userData:", UTS.JSON.stringify(this.userData));
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:131", "store中的name值:", this.storeName);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:133", "onLoad错误:", error);
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:138", "mine_common.vue onShow开始执行");
      try {
        yield this.$nextTick();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:144", "onShow检查store数据:", new UTSJSONObject({
          storeName: this.storeName,
          storeAvatar: this.storeAvatar
        }));
        this.initFromStore();
        const storedUserRole = common_vendor.index.getStorageSync("userRole");
        if (storedUserRole) {
          yield this.updateUserRole(storedUserRole);
        }
        if (!this.userData.name && !this.storeName) {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:160", "用户数据为空，尝试重新加载");
          yield this.loadUserData();
        }
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:164", "mine_common.vue onShow执行完成，userData:", UTS.JSON.stringify(this.userData));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:166", "onShow错误:", error);
      }
    });
  },
  methods: new UTSJSONObject({
    /**
     * @description 从store初始化数据
     */
    initFromStore() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:175", "initFromStore - 从store直接获取数据");
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:176", "store中的数据:", new UTSJSONObject({
        id: this.storeId,
        name: this.storeName,
        avatar: this.storeAvatar,
        role: this.storeUserInfo.role
      }));
      if (this.storeName) {
        this.userData = new UTSJSONObject({
          id: this.storeId,
          avatar: this.storeAvatar,
          name: this.storeName,
          gender: this.storeGender,
          selfIntroduction: this.storeSelfIntroduction,
          wechatNumber: this.storeWechatNumber,
          phoneNumber: this.storePhoneNumber
        });
        this.isLoggedIn = true;
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:195", "从store初始化userData成功:", this.userData);
      } else {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:197", "store中没有用户数据");
      }
    },
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    updateUserRole(role = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:207", "更新用户角色:", role);
          if (this.$store) {
            yield this.$store.dispatch("user/baseInfo/updateRole", role);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:211", "角色更新成功, 新角色:", this.storeUserInfo.role);
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:213", "$store不可用，直接使用本地存储");
            common_vendor.index.setStorageSync("userRole", role);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:217", "更新用户角色失败", error);
          common_vendor.index.setStorageSync("userRole", role);
        }
      });
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:227", "loadUserData 开始执行");
        this.isLoading = true;
        try {
          if (this.$store) {
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:232", "使用Vuex获取用户数据");
            const result = yield this.$store.dispatch("user/baseInfo/getUserInfo");
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:236", "getUserInfo返回结果:", result);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:239", "store中的数据是否更新:", new UTSJSONObject({
              storeName: this.storeName
            }));
            this.initFromStore();
            if (!this.userData.name && result) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:248", "使用API返回的结果更新userData");
              this.userData = new UTSJSONObject({
                id: result.id || "",
                avatar: result.avatar || "",
                name: result.name || result.nickname || "",
                gender: result.gender || "",
                selfIntroduction: result.selfIntroduction || result.introduction || "",
                wechatNumber: result.wechatNumber || result.wechat || "",
                phoneNumber: result.phoneNumber || result.phone || ""
              });
              this.isLoggedIn = !!this.userData.name;
              common_vendor.index.setStorageSync("userData", UTS.JSON.stringify(this.userData));
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:262", "更新userData成功:", this.userData);
            } else if (!this.userData.name) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:264", "尝试从本地存储恢复数据");
              this.recoverFromLocalStorage();
            }
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:268", "$store不可用，从本地存储加载");
            this.recoverFromLocalStorage();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:272", "加载用户数据失败", error);
          this.recoverFromLocalStorage();
        } finally {
          this.isLoading = false;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:276", "loadUserData 执行完成, userData:", this.userData);
        }
      });
    },
    /**
     * @description 从本地存储恢复数据
     */
    recoverFromLocalStorage() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:284", "从本地存储恢复数据");
      const localUserData = common_vendor.index.getStorageSync("userData");
      if (localUserData) {
        try {
          this.userData = UTS.JSON.parse(localUserData);
          this.isLoggedIn = !!this.userData.name;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:290", "从userData恢复成功:", this.userData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:292", "解析本地用户数据失败", e);
        }
      }
      if (!this.userData.name) {
        const baseInfo = common_vendor.index.getStorageSync("userBaseInfo");
        if (baseInfo) {
          try {
            const parsedInfo = UTS.JSON.parse(baseInfo);
            this.userData = new UTSJSONObject(Object.assign({}, parsedInfo));
            this.isLoggedIn = !!this.userData.name;
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:304", "从userBaseInfo恢复成功:", this.userData);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:306", "解析userBaseInfo失败", e);
          }
        } else {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:309", "本地存储中没有用户数据");
        }
      }
    },
    /**
     * @description 处理头像点击
     */
    handleAvatarClick() {
      this.handleEditProfile();
    },
    /**
     * @description 处理登录文本点击
     */
    handleLoginClick() {
      if (this.isLoggedIn) {
        this.handleEditProfile();
      } else {
        router_Router.Navigator.toLogin();
      }
    },
    /**
     * @description 跳转到修改个人信息页面
     */
    handleEditProfile() {
      router_Router.Navigator.toModify();
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      router_Router.Navigator.navigateTo(url);
    }
  })
}));
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userData.avatar || _ctx.storeAvatar || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    c: common_vendor.t($data.userData.name || _ctx.storeName || "登录"),
    d: common_vendor.o((...args) => $options.handleLoginClick && $options.handleLoginClick(...args)),
    e: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    f: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    g: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SERVICE))
  } : {}, {
    h: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    i: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    j: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    k: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.QUALIFICATION))
  } : {}, {
    l: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    m: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.WALLET))
  } : {}, {
    n: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    o: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS)),
    p: common_vendor.p({
      pageName: "mine"
    }),
    q: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

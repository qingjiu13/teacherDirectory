"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const store_index = require("../../../store/index.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    TabBar
  },
  data() {
    return {
      userData: new UTSJSONObject({}),
      isLoggedIn: store_index.store.getters["user/baseInfo/id"] !== "",
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
    },
    storeCertificate: (state = null) => {
      return state.certificate;
    },
    storeSchool: (state = null) => {
      return state.userInfo.school;
    },
    storeMajor: (state = null) => {
      return state.userInfo.major;
    }
  })))),
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:132", "mine_common.vue onLoad开始执行");
      try {
        yield this.$nextTick();
        this.initFromStore();
        yield this.loadUserData();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:143", "mine_common.vue onLoad执行完成，userData:", UTS.JSON.stringify(this.userData));
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:144", "store中的name值:", this.storeName);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:146", "onLoad错误:", error);
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:151", "mine_common.vue onShow开始执行");
      try {
        yield this.$nextTick();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:157", "onShow检查store数据:", new UTSJSONObject({
          storeName: this.storeName,
          storeAvatar: this.storeAvatar
        }));
        this.initFromStore();
        const storedUserRole = common_vendor.index.getStorageSync("userRole");
        if (storedUserRole) {
          yield this.updateUserRole(storedUserRole);
        }
        if (!this.userData.name && !this.storeName) {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:173", "用户数据为空，尝试重新加载");
          yield this.loadUserData();
        }
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:177", "mine_common.vue onShow执行完成，userData:", UTS.JSON.stringify(this.userData));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:179", "onShow错误:", error);
      }
    });
  },
  methods: new UTSJSONObject({
    /**
     * @description 从store初始化数据
     */
    initFromStore() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:188", "initFromStore - 从store直接获取数据");
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:189", "store中的数据:", new UTSJSONObject({
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
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:208", "从store初始化userData成功:", this.userData);
      } else {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:210", "store中没有用户数据");
      }
    },
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    updateUserRole(role = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:220", "更新用户角色:", role);
          if (this.$store) {
            yield this.$store.dispatch("user/baseInfo/updateRole", role);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:224", "角色更新成功, 新角色:", this.storeUserInfo.role);
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:226", "$store不可用，直接使用本地存储");
            common_vendor.index.setStorageSync("userRole", role);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:230", "更新用户角色失败", error);
          common_vendor.index.setStorageSync("userRole", role);
        }
      });
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:240", "loadUserData 开始执行");
        this.isLoading = true;
        try {
          if (this.$store) {
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:245", "使用Vuex获取用户数据");
            const result = yield this.$store.dispatch("user/baseInfo/getUserInfo");
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:249", "getUserInfo返回结果:", result);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:252", "store中的数据是否更新:", new UTSJSONObject({
              storeName: this.storeName
            }));
            this.initFromStore();
            if (!this.userData.name && result) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:261", "使用API返回的结果更新userData");
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
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:275", "更新userData成功:", this.userData);
            } else if (!this.userData.name) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:277", "尝试从本地存储恢复数据");
              this.recoverFromLocalStorage();
            }
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:281", "$store不可用，从本地存储加载");
            this.recoverFromLocalStorage();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:285", "加载用户数据失败", error);
          this.recoverFromLocalStorage();
        } finally {
          this.isLoading = false;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:289", "loadUserData 执行完成, userData:", this.userData);
        }
      });
    },
    /**
     * @description 从本地存储恢复数据
     */
    recoverFromLocalStorage() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:297", "从本地存储恢复数据");
      const localUserData = common_vendor.index.getStorageSync("userData");
      if (localUserData) {
        try {
          this.userData = UTS.JSON.parse(localUserData);
          this.isLoggedIn = !!this.userData.name;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:303", "从userData恢复成功:", this.userData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:305", "解析本地用户数据失败", e);
        }
      }
      if (!this.userData.name) {
        const baseInfo = common_vendor.index.getStorageSync("userBaseInfo");
        if (baseInfo) {
          try {
            const parsedInfo = UTS.JSON.parse(baseInfo);
            this.userData = new UTSJSONObject(Object.assign({}, parsedInfo));
            this.isLoggedIn = !!this.userData.name;
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:317", "从userBaseInfo恢复成功:", this.userData);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:319", "解析userBaseInfo失败", e);
          }
        } else {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:322", "本地存储中没有用户数据");
        }
      }
    },
    /**
     * @description 处理头像点击
     */
    handleClick() {
      if (this.isLoggedIn) {
        router_Router.Navigator.toModify();
      } else {
        router_Router.Navigator.toWechatLogin();
      }
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      router_Router.Navigator.navigateTo(url);
    },
    /**
     * @description 跳转到订单列表页面
     */
    toOrderCommon() {
      router_Router.Navigator.toOrderCommon();
    },
    /**
     * @description 跳转到课程列表页面
     */
    toCourse() {
      router_Router.Navigator.toCourse();
    },
    /**
     * @description 跳转到资质认证页面
     */
    toQualification() {
      router_Router.Navigator.toQualification();
    },
    /**
     * @description 跳转到钱包页面
     */
    toWallet() {
      router_Router.Navigator.toWallet();
    },
    /**
     * @description 跳转到设置页面
     */
    toSettings() {
      router_Router.Navigator.toSettings();
    },
    /**
     * @description 跳转到关注公众号页面
     */
    toSubscribe() {
      router_Router.Navigator.toSubscribe();
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
    b: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    c: common_vendor.t($data.userData.name || _ctx.storeName || "登录"),
    d: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    e: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    f: common_vendor.t(_ctx.storeCertificate === 1 ? "已认证" : "未认证")
  } : {}, {
    g: _ctx.storeSchool || _ctx.storeMajor
  }, _ctx.storeSchool || _ctx.storeMajor ? common_vendor.e({
    h: _ctx.storeSchool
  }, _ctx.storeSchool ? {
    i: common_vendor.t(_ctx.storeSchool)
  } : {}, {
    j: _ctx.storeMajor
  }, _ctx.storeMajor ? {
    k: common_vendor.t(_ctx.storeMajor)
  } : {}) : {}, {
    l: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    m: common_vendor.o(($event) => $options.navigateTo(_ctx.MineRoutes.SERVICE))
  } : {}, {
    n: common_vendor.o((...args) => $options.toOrderCommon && $options.toOrderCommon(...args)),
    o: common_vendor.o((...args) => $options.toCourse && $options.toCourse(...args)),
    p: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    q: common_vendor.o((...args) => $options.toQualification && $options.toQualification(...args))
  } : {}, {
    r: _ctx.storeUserInfo.role === "老师"
  }, _ctx.storeUserInfo.role === "老师" ? {
    s: common_vendor.o((...args) => $options.toWallet && $options.toWallet(...args))
  } : {}, {
    t: common_vendor.o((...args) => $options.toSubscribe && $options.toSubscribe(...args)),
    v: common_vendor.o((...args) => $options.toSettings && $options.toSettings(...args)),
    w: common_vendor.p({
      pageName: "mine"
    }),
    x: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const store_index = require("../../../store/index.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
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
  computed: Object.assign({}, common_vendor.mapState("user/baseInfo", {
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
    storeRole: (state = null) => {
      var _a;
      return ((_a = state.userInfo) === null || _a === void 0 ? null : _a.role) || "学生";
    },
    storeCertificate: (state = null) => {
      return state.certificate;
    },
    storeCampusAmbassador: (state = null) => {
      return state.campusAmbassador;
    }
  })),
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:120", "mine_common.vue onLoad开始执行");
      try {
        yield this.$nextTick();
        this.initFromStore();
        yield this.loadUserData();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:131", "mine_common.vue onLoad执行完成，userData:", UTS.JSON.stringify(this.userData));
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:132", "store中的name值:", this.storeName);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:134", "onLoad错误:", error);
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:139", "mine_common.vue onShow开始执行");
      try {
        yield this.$nextTick();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:145", "onShow检查store数据:", new UTSJSONObject({
          storeName: this.storeName,
          storeAvatar: this.storeAvatar
        }));
        this.initFromStore();
        const storedUserRole = common_vendor.index.getStorageSync("userRole");
        if (storedUserRole) {
          yield this.updateUserRole(storedUserRole);
        }
        if (!this.userData.name && !this.storeName) {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:161", "用户数据为空，尝试重新加载");
          yield this.loadUserData();
        }
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:165", "mine_common.vue onShow执行完成，userData:", UTS.JSON.stringify(this.userData));
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:167", "onShow错误:", error);
      }
    });
  },
  methods: {
    /**
     * @description 从store初始化数据
     */
    initFromStore() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:176", "initFromStore - 从store直接获取数据");
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:177", "store中的数据:", new UTSJSONObject({
        id: this.storeId,
        name: this.storeName,
        avatar: this.storeAvatar,
        role: this.storeRole
      }));
      if (this.storeName) {
        this.userData = new UTSJSONObject({
          id: this.storeId,
          avatar: this.storeAvatar,
          name: this.storeName,
          gender: this.storeGender
        });
        this.isLoggedIn = true;
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:193", "从store初始化userData成功:", this.userData);
      } else {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:195", "store中没有用户数据");
      }
    },
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    updateUserRole(role = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:205", "更新用户角色:", role);
          if (this.$store) {
            yield this.$store.dispatch("user/baseInfo/updateRole", role);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:209", "角色更新成功, 新角色:", this.storeRole);
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:211", "$store不可用，直接使用本地存储");
            common_vendor.index.setStorageSync("userRole", role);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:215", "更新用户角色失败", error);
          common_vendor.index.setStorageSync("userRole", role);
        }
      });
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:225", "loadUserData 开始执行");
        this.isLoading = true;
        try {
          if (this.$store) {
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:230", "使用Vuex获取用户数据");
            const result = yield this.$store.dispatch("user/baseInfo/getUserInfo");
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:234", "getUserInfo返回结果:", result);
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:237", "store中的数据是否更新:", new UTSJSONObject({
              storeName: this.storeName
            }));
            this.initFromStore();
            if (!this.userData.name && result) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:246", "使用API返回的结果更新userData");
              this.userData = new UTSJSONObject({
                id: result.id || "",
                avatar: result.avatar || "",
                name: result.name || result.nickname || "",
                gender: result.gender || ""
              });
              this.isLoggedIn = !!this.userData.name;
              common_vendor.index.setStorageSync("userData", UTS.JSON.stringify(this.userData));
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:257", "更新userData成功:", this.userData);
            } else if (!this.userData.name) {
              common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:259", "尝试从本地存储恢复数据");
              this.recoverFromLocalStorage();
            }
          } else {
            common_vendor.index.__f__("warn", "at pages/mine/mine/mine_common.vue:263", "$store不可用，从本地存储加载");
            this.recoverFromLocalStorage();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:267", "加载用户数据失败", error);
          this.recoverFromLocalStorage();
        } finally {
          this.isLoading = false;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:271", "loadUserData 执行完成, userData:", this.userData);
        }
      });
    },
    /**
     * @description 从本地存储恢复数据
     */
    recoverFromLocalStorage() {
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:279", "从本地存储恢复数据");
      const localUserData = common_vendor.index.getStorageSync("userData");
      if (localUserData) {
        try {
          const parsedData = UTS.JSON.parse(localUserData);
          this.userData = new UTSJSONObject({
            id: parsedData.id || "",
            avatar: parsedData.avatar || "",
            name: parsedData.name || "",
            gender: parsedData.gender || ""
          });
          this.isLoggedIn = !!this.userData.name;
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:291", "从userData恢复成功:", this.userData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:293", "解析本地用户数据失败", e);
        }
      }
      if (!this.userData.name) {
        const baseInfo = common_vendor.index.getStorageSync("userBaseInfo");
        if (baseInfo) {
          try {
            const parsedInfo = UTS.JSON.parse(baseInfo);
            this.userData = new UTSJSONObject({
              id: parsedInfo.id || "",
              avatar: parsedInfo.avatar || "",
              name: parsedInfo.name || "",
              gender: parsedInfo.gender || ""
            });
            this.isLoggedIn = !!this.userData.name;
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:310", "从userBaseInfo恢复成功:", this.userData);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.vue:312", "解析userBaseInfo失败", e);
          }
        } else {
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.vue:315", "本地存储中没有用户数据");
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
    },
    toService() {
      router_Router.Navigator.toService();
    }
  }
});
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
    e: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? common_vendor.e({
    f: common_vendor.t(_ctx.storeCertificate === 1 ? "已认证" : "未认证"),
    g: _ctx.storeCampusAmbassador
  }, _ctx.storeCampusAmbassador ? {
    h: common_vendor.t("校园大使")
  } : {}) : {}, {
    i: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? {
    j: common_vendor.o((...args) => $options.toService && $options.toService(...args))
  } : {}, {
    k: common_vendor.o((...args) => $options.toOrderCommon && $options.toOrderCommon(...args)),
    l: common_vendor.o((...args) => $options.toCourse && $options.toCourse(...args)),
    m: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? {
    n: common_vendor.o((...args) => $options.toQualification && $options.toQualification(...args))
  } : {}, {
    o: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? {
    p: common_vendor.o((...args) => $options.toWallet && $options.toWallet(...args))
  } : {}, {
    q: common_vendor.o((...args) => $options.toSubscribe && $options.toSubscribe(...args)),
    r: common_vendor.o((...args) => $options.toSettings && $options.toSettings(...args)),
    s: common_vendor.p({
      pageName: "mine"
    }),
    t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

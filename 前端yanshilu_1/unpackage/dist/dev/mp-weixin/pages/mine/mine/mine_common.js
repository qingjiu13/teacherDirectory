"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const store_index = require("../../../store/index.js");
const store_services_index = require("../../../store/services/index.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      MineRoutes: router_Router.MineRoutes,
      isLoading: false
    };
  },
  computed: Object.assign({}, common_vendor.mapGetters("user", [
    "teacherCertTag",
    "teacherOtherTags",
    "studentTags"
  ])),
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      yield this.loadUserData();
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      const storedUserRole = common_vendor.index.getStorageSync("userRole");
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.userRole = storedUserRole;
        yield this.loadUserData();
      } else {
        const userProfile = this.$store.getters["user/profile"];
        if (!userProfile || !userProfile.nickname) {
          yield this.loadUserData();
        }
      }
    });
  },
  methods: {
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.isLoading = true;
        try {
          const useMockData = common_vendor.index.getStorageSync("use_mock_api") === "true" || true;
          if (useMockData && !common_vendor.index.getStorageSync("token")) {
            common_vendor.index.setStorageSync("token", "mock_token_for_testing");
          }
          const storedUserRole = common_vendor.index.getStorageSync("userRole") || "student";
          this.userRole = storedUserRole;
          if (this.userRole === "teacher") {
            yield store_index.loadTeacherData();
          } else {
            yield store_index.loadStudentData();
          }
          yield this.syncUserDataFromVuex();
        } catch (error) {
          this.loadUserDataFromApi();
        } finally {
          this.isLoading = false;
        }
      });
    },
    /**
     * @description 从Vuex同步用户数据
     */
    syncUserDataFromVuex() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield this.$store.dispatch("user/fetchProfile");
          const userProfile = this.$store.getters["user/profile"];
          if (userProfile && userProfile.nickname) {
            this.userData = new UTSJSONObject(Object.assign({}, userProfile));
            this.userName = userProfile.nickname || "用户";
            common_vendor.index.setStorageSync("userRole", this.userRole);
            common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userData));
          } else {
            this.loadUserDataFromApi();
          }
        } catch (error) {
          this.loadUserDataFromApi();
        }
      });
    },
    /**
     * @description 从API直接获取用户资料
     */
    loadUserDataFromApi() {
      store_services_index.services.user.getUserProfile(this.userRole).then((response = null) => {
        if (response && response.data) {
          this.userData = response.data;
          this.userName = this.userData.nickname || "用户";
          common_vendor.index.setStorageSync("userRole", this.userRole);
          common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userData));
        }
      }).catch((error = null) => {
      }).finally(() => {
        this.isLoading = false;
      });
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
      this.handleEditProfile();
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
  }
});
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userData.avatarUrl || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    c: common_vendor.t($data.userData.nickname || $data.userName || "登录"),
    d: common_vendor.o((...args) => $options.handleLoginClick && $options.handleLoginClick(...args)),
    e: $data.userRole === "teacher" && _ctx.teacherCertTag
  }, $data.userRole === "teacher" && _ctx.teacherCertTag ? {
    f: common_vendor.t(_ctx.teacherCertTag)
  } : {}, {
    g: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    h: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    i: common_vendor.f(_ctx.teacherOtherTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: "teacher-tag-" + index
      };
    })
  } : {}, {
    j: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    k: common_vendor.f(_ctx.studentTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: "student-tag-" + index
      };
    })
  } : {}, {
    l: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    m: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SERVICE))
  } : {}, {
    n: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER)),
    o: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    p: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    q: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.QUALIFICATION))
  } : {}, {
    r: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    s: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.WALLET))
  } : {}, {
    t: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    v: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS)),
    w: common_vendor.p({
      pageName: "mine"
    }),
    x: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

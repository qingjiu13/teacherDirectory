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
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: true,
      MineRoutes: router_Router.MineRoutes,
      isLoading: false,
      // 模拟数据
      mockTeacherData: new UTSJSONObject({
        id: "teacher123",
        nickname: "王教授",
        avatarUrl: "/static/image/tab-bar/default_avatar.png",
        tag: "已认证",
        role: "teacher",
        school: "北京大学",
        major: "计算机科学",
        score: 4.9,
        wallet: new UTSJSONObject({
          balance: 2580.5,
          income: 5e3
        }),
        qualifications: new UTSJSONObject({
          isVerified: true,
          certificates: ["教师资格证", "心理咨询师证"]
        }),
        services: [
          new UTSJSONObject({ id: 1, title: "高数一对一", price: 300 }),
          new UTSJSONObject({ id: 2, title: "编程辅导", price: 250 })
        ]
      }),
      mockStudentData: new UTSJSONObject({
        id: "student456",
        nickname: "小明同学",
        avatarUrl: "/static/image/tab-bar/default_avatar.png",
        tag: "学生",
        role: "student",
        school: "清华大学",
        major: "机械工程",
        grade: "大二",
        courses: [
          new UTSJSONObject({ id: 101, title: "高等数学", progress: 60 }),
          new UTSJSONObject({ id: 102, title: "C++编程基础", progress: 85 })
        ]
      })
    };
  },
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      this.isLoading = true;
      try {
        const storedUserRole = common_vendor.index.getStorageSync("userRole") || "student";
        this.userRole = storedUserRole;
        if (this.userRole === "teacher") {
          yield store_index.loadTeacherData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:180", "教师数据已加载");
        } else {
          yield store_index.loadStudentData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:184", "学生数据已加载");
        }
        this.loadMockData();
        common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:189", "当前用户角色:", this.userRole);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:191", "加载用户数据失败:", error);
      } finally {
        this.isLoading = false;
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      const storedUserRole = common_vendor.index.getStorageSync("userRole");
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.isLoading = true;
        try {
          this.userRole = storedUserRole;
          if (this.userRole === "teacher") {
            yield store_index.loadTeacherData();
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:209", "教师数据已重新加载");
          } else {
            yield store_index.loadStudentData();
            common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:212", "学生数据已重新加载");
          }
          this.loadMockData();
          common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:217", "onShow 更新用户角色:", this.userRole);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:219", "角色切换时加载数据失败:", error);
        } finally {
          this.isLoading = false;
        }
      }
    });
  },
  methods: {
    /**
     * @description 加载模拟数据
     */
    loadMockData() {
      if (this.userRole === "teacher") {
        this.userData = this.mockTeacherData;
      } else {
        this.userData = this.mockStudentData;
      }
      this.userName = this.userData.nickname;
      common_vendor.index.setStorageSync("userRole", this.userRole);
      common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userData));
      common_vendor.index.setStorageSync("token", "mock_token_for_testing");
      this.isLoggedIn = true;
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:245", "加载模拟数据:", this.userData);
    },
    /**
     * @description 切换用户角色（用于调试）
     * @param {String} role - 目标角色
     */
    switchRole(role = null) {
      if (this.userRole !== role) {
        this.userRole = role;
        this.loadMockData();
        common_vendor.index.showToast({
          title: role === "teacher" ? "已切换为老师模式" : "已切换为学生模式",
          icon: "none"
        });
      }
    },
    /**
     * @description 加载用户数据（保留原方法，但在调试模式不使用）
     */
    loadUserData() {
      if (common_vendor.index.getStorageSync("debug_mode") === "true") {
        this.loadMockData();
        return null;
      }
      const token = common_vendor.index.getStorageSync("token");
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          try {
            this.userData = typeof userInfo === "string" ? UTS.JSON.parse(userInfo) : userInfo;
            this.userName = this.userData.nickname || "用户";
            if (this.userData.role) {
              this.userRole = this.userData.role;
              common_vendor.index.setStorageSync("userRole", this.userData.role);
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/mine/mine_common.uvue:292", "解析用户信息失败:", e);
          }
        }
      } else {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        this.userRole = "student";
      }
      common_vendor.index.__f__("log", "at pages/mine/mine/mine_common.uvue:302", "加载用户数据后的角色:", this.userRole);
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
    },
    /**
     * @description 处理退出登录
     */
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("userRole");
            this.isLoggedIn = false;
            this.userData = new UTSJSONObject({});
            this.userName = "";
            this.userRole = "student";
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
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
    e: $data.userData.tag
  }, $data.userData.tag ? {
    f: common_vendor.t($data.userData.tag)
  } : {}, {
    g: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    h: $data.userRole === "student" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchRole("student")),
    j: $data.userRole === "teacher" ? 1 : "",
    k: common_vendor.o(($event) => $options.switchRole("teacher")),
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
    w: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    x: common_vendor.o(($event) => $options.handleLogout())
  } : {}, {
    y: common_vendor.p({
      pageName: "mine"
    }),
    z: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map

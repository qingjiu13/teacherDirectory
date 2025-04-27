"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const router_Router = require("../../router/Router.js");
const _2886___ = require("../../2886所大学.js");
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    ChoiceSelected
  },
  onLoad() {
    this.loadUniversityData();
  },
  data() {
    return {
      formData: new UTSJSONObject({
        nickname: "",
        gender: "男",
        phone: "",
        schoolIndex: -1,
        majorIndex: -1,
        targetSchoolIndex: -1,
        targetMajorIndex: -1,
        gradeIndex: -1
      }),
      schoolList: [],
      majorList: [
        "计算机科学",
        "电子工程",
        "机械工程",
        "经济学",
        "法学"
      ],
      // 存储原始完整的学校和专业列表，用于搜索恢复
      originalSchoolList: [],
      originalMajorList: [
        "计算机科学",
        "电子工程",
        "机械工程",
        "经济学",
        "法学"
      ],
      allGradeList: ["大一", "大二", "大三", "大四", "研一", "研二", "研三"],
      userRole: ""
      // 默认空值
    };
  },
<<<<<<< HEAD
  computed: Object.assign({}, common_vendor.mapState(new UTSJSONObject({
    userRole: (state = null) => {
      return state.user.baseInfo.userInfo.role;
    }
  }))),
=======
  computed: new UTSJSONObject({
    /**
     * 根据用户角色筛选年级列表
     * @returns {Array} 筛选后的年级列表
     */
    gradeList() {
      if (this.userRole === "老师") {
        return this.allGradeList.filter((grade) => {
          return grade.includes("研");
        });
      } else {
        return this.allGradeList.filter((grade) => {
          return grade.includes("大");
        });
      }
    }
  }),
>>>>>>> a2bf9657a39810a133593f8de99b785a81f8875d
  methods: {
    handleSchoolSelect(index = null) {
      this.formData.schoolIndex = index;
    },
    handleMajorSelect(index = null) {
      this.formData.majorIndex = index;
    },
    handleTargetSchoolSelect(index = null) {
      this.formData.targetSchoolIndex = index;
    },
    handleTargetMajorSelect(index = null) {
      this.formData.targetMajorIndex = index;
    },
    handleGradeSelect(index = null) {
      this.formData.gradeIndex = index;
    },
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword = null) {
      if (keyword === "") {
        this.schoolList = [...this.originalSchoolList];
        return null;
      }
      this.schoolList = this.originalSchoolList.filter((school) => {
        return school.toLowerCase().includes(keyword.toLowerCase());
      });
    },
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword = null) {
      if (keyword === "") {
        this.majorList = [...this.originalMajorList];
        return null;
      }
      this.majorList = this.originalMajorList.filter((major) => {
        return major.toLowerCase().includes(keyword.toLowerCase());
      });
    },
    /**
     * @description 处理目标学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword = null) {
      if (keyword === "") {
        this.schoolList = [...this.originalSchoolList];
        return null;
      }
      this.schoolList = this.originalSchoolList.filter((school) => {
        return school.toLowerCase().includes(keyword.toLowerCase());
      });
    },
    /**
     * @description 处理目标专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword = null) {
      if (keyword === "") {
        this.majorList = [...this.originalMajorList];
        return null;
      }
      this.majorList = this.originalMajorList.filter((major) => {
        return major.toLowerCase().includes(keyword.toLowerCase());
      });
    },
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      const dropdowns = ["schoolDropdown", "majorDropdown", "targetSchoolDropdown", "targetMajorDropdown"];
      dropdowns.forEach((dropdown) => {
        if (this.$refs && this.$refs[dropdown]) {
          this.$refs[dropdown].closeDropdown && this.$refs[dropdown].closeDropdown();
        }
      });
    },
    /**
     * 获取当前用户角色
     * @returns {string} 用户角色
     */
    getUserRole() {
      try {
        if (store_index.store.state && store_index.store.state.user && store_index.store.state.user.baseInfo) {
          return store_index.store.state.user.baseInfo.userInfo.role;
        }
        const localRole = common_vendor.index.getStorageSync("userRole");
        if (localRole === "teacher") {
          return "老师";
        } else if (localRole === "student") {
          return "学生";
        } else {
          return "学生";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:304", "获取用户角色出错:", error);
        return "学生";
      }
    },
    /**
     * 加载大学数据
     */
    loadUniversityData() {
      try {
        this.schoolList = _2886___.universityData;
        this.originalSchoolList = [..._2886___.universityData];
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:318", "成功加载", this.schoolList.length, "所大学数据");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:320", "加载大学数据失败:", error);
        this.schoolList = ["北京大学", "清华大学", "复旦大学"];
        this.originalSchoolList = ["北京大学", "清华大学", "复旦大学"];
        this.showToast("加载大学数据失败，使用默认列表");
      }
    },
    /**
     * 提交表单信息
     */
    submitForm() {
      if (!this.validateForm()) {
        return null;
      }
      try {
        const currentRole = this.getUserRole();
        const roleCode = currentRole === "老师" ? "teacher" : "student";
        const userInfo = new UTSJSONObject({
          name: this.formData.nickname,
          gender: this.formData.gender,
          phoneNumber: this.formData.phone,
          role: roleCode,
          userInfo: new UTSJSONObject({
            school: this.schoolList[this.formData.schoolIndex] || "",
            major: this.majorList[this.formData.majorIndex] || "",
            studentGrade: currentRole === "学生" ? this.gradeList[this.formData.gradeIndex] || "" : "",
            teacherGrade: currentRole === "老师" ? this.gradeList[this.formData.gradeIndex] || "" : ""
          })
        });
        if (currentRole === "学生") {
          userInfo.userInfo.targetSchool = this.schoolList[this.formData.targetSchoolIndex] || "";
          userInfo.userInfo.targetMajor = this.majorList[this.formData.targetMajorIndex] || "";
        }
        store_index.store.commit("user/baseInfo/UPDATE_USER_INFO", userInfo);
        common_vendor.index.showToast({
          title: "信息保存成功",
          icon: "success"
        });
        setTimeout(() => {
          router_Router.Navigator.toMine();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:376", "提交表单时出错:", error);
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 验证表单内容
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      if (!this.formData.nickname) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return false;
      }
      if (this.formData.schoolIndex === -1) {
        common_vendor.index.showToast({
          title: "请选择学校",
          icon: "none"
        });
        return false;
      }
      if (this.formData.majorIndex === -1) {
        common_vendor.index.showToast({
          title: "请选择专业",
          icon: "none"
        });
        return false;
      }
      if (this.userRole === "学生") {
        if (this.formData.targetSchoolIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择目标学校",
            icon: "none"
          });
          return false;
        }
        if (this.formData.targetMajorIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择目标专业",
            icon: "none"
          });
          return false;
        }
      }
      if (this.formData.gradeIndex === -1) {
        common_vendor.index.showToast({
          title: "请选择年级",
          icon: "none"
        });
        return false;
      }
      return true;
    }
  },
  created() {
    this.userRole = this.getUserRole();
    common_vendor.index.__f__("log", "at pages/login/login_detail.vue:448", "当前用户角色:", this.userRole);
  },
  // 监听页面显示时更新角色
  onShow() {
    const newRole = this.getUserRole();
    if (this.userRole !== newRole) {
      this.userRole = newRole;
      this.formData.gradeIndex = -1;
    }
  }
});
if (!Array) {
  const _component_ChoiceSelected = common_vendor.resolveComponent("ChoiceSelected");
  _component_ChoiceSelected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.formData.nickname,
    b: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    c: $data.formData.gender === "男",
    d: common_vendor.o(($event) => $data.formData.gender = "男"),
    e: $data.formData.gender === "女",
    f: common_vendor.o(($event) => $data.formData.gender = "女"),
    g: $data.formData.phone,
    h: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    i: common_vendor.sr("schoolDropdown", "5ca72b3d-0"),
    j: common_vendor.o($options.handleSchoolSelect),
    k: common_vendor.o($options.handleSchoolSearch),
    l: common_vendor.p({
      choiceIndex: $data.formData.schoolIndex,
      choiceList: $data.schoolList,
      defaultText: "请选择学校",
      mode: "search",
      searchPlaceholder: "输入学校名称"
    }),
    m: common_vendor.sr("majorDropdown", "5ca72b3d-1"),
    n: common_vendor.o($options.handleMajorSelect),
    o: common_vendor.o($options.handleMajorSearch),
    p: common_vendor.p({
      choiceIndex: $data.formData.majorIndex,
      choiceList: $data.majorList,
      defaultText: "请选择专业",
      mode: "search",
      searchPlaceholder: "输入专业名称"
    }),
    q: common_vendor.o($options.handleGradeSelect),
    r: common_vendor.p({
      choiceIndex: $data.formData.gradeIndex,
      choiceList: $options.gradeList,
      defaultText: "请选择年级",
      mode: "select"
    }),
    s: $data.userRole === "学生"
  }, $data.userRole === "学生" ? {
    t: common_vendor.sr("targetSchoolDropdown", "5ca72b3d-3"),
    v: common_vendor.o($options.handleTargetSchoolSelect),
    w: common_vendor.o($options.handleTargetSchoolSearch),
    x: common_vendor.p({
      choiceIndex: $data.formData.targetSchoolIndex,
      choiceList: $data.schoolList,
      defaultText: "请选择目标学校",
      mode: "search",
      searchPlaceholder: "输入目标学校名称"
    }),
    y: common_vendor.sr("targetMajorDropdown", "5ca72b3d-4"),
    z: common_vendor.o($options.handleTargetMajorSelect),
    A: common_vendor.o($options.handleTargetMajorSearch),
    B: common_vendor.p({
      choiceIndex: $data.formData.targetMajorIndex,
      choiceList: $data.majorList,
      defaultText: "请选择目标专业",
      mode: "search",
      searchPlaceholder: "输入目标专业名称"
    })
  } : {}, {
<<<<<<< HEAD
    r: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    s: common_vendor.sei(_ctx.virtualHostId, "view")
=======
    C: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    D: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
>>>>>>> a2bf9657a39810a133593f8de99b785a81f8875d
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ca72b3d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login_detail.js.map

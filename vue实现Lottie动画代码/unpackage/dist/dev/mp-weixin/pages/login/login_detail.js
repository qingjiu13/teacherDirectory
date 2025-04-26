"use strict";
const common_vendor = require("../../common/vendor.js");
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    ChoiceSelected
  },
  data() {
    return {
      formData: new UTSJSONObject({
        nickname: "",
        gender: "男",
        phone: "",
        schoolIndex: -1,
        majorIndex: -1,
        gradeIndex: -1,
        teacherScore: ""
      }),
      schoolList: [
        "北京大学",
        "清华大学",
        "复旦大学",
        "上海交通大学",
        "浙江大学"
      ],
      majorList: [
        "计算机科学",
        "电子工程",
        "机械工程",
        "经济学",
        "法学"
      ],
      gradeList: ["大一", "大二", "大三", "大四", "研究生"]
    };
  },
  computed: new UTSJSONObject(Object.assign({}, common_vendor.mapState(new UTSJSONObject({
    userRole: (state = null) => {
      return state.user.baseInfo.userInfo.role;
    }
  })))),
  methods: {
    handleSchoolSelect(index = null) {
      this.formData.schoolIndex = index;
    },
    handleMajorSelect(index = null) {
      this.formData.majorIndex = index;
    },
    handleGradeSelect(index = null) {
      this.formData.gradeIndex = index;
    },
    /**
     * 提交表单信息
     */
    submitForm() {
      if (!this.validateForm()) {
        return null;
      }
      const userInfo = new UTSJSONObject({
        name: this.formData.nickname,
        gender: this.formData.gender,
        phoneNumber: this.formData.phone,
        userInfo: new UTSJSONObject({
          school: this.schoolList[this.formData.schoolIndex] || "",
          major: this.majorList[this.formData.majorIndex] || "",
          studentGrade: this.userRole === "学生" ? this.gradeList[this.formData.gradeIndex] || "" : "",
          teacherGrade: this.userRole === "老师" ? this.gradeList[this.formData.gradeIndex] || "" : ""
        })
      });
      if (this.userRole === "老师" && this.formData.teacherScore) {
        userInfo.userInfo.teacherScore = parseInt(this.formData.teacherScore);
      }
      this.$store.commit("user/baseInfo/UPDATE_USER_INFO", userInfo);
      common_vendor.index.showToast({
        title: "信息保存成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }, 1500);
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
      if (this.formData.gradeIndex === -1) {
        common_vendor.index.showToast({
          title: "请选择年级",
          icon: "none"
        });
        return false;
      }
      if (this.userRole === "老师" && !this.formData.teacherScore) {
        common_vendor.index.showToast({
          title: "请输入考研分数",
          icon: "none"
        });
        return false;
      }
      return true;
    }
  },
  created() {
    common_vendor.index.__f__("log", "at pages/login/login_detail.vue:232", "当前用户角色:", this.userRole);
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
    i: common_vendor.o($options.handleSchoolSelect),
    j: common_vendor.p({
      choiceIndex: $data.formData.schoolIndex,
      choiceList: $data.schoolList,
      defaultText: "请选择学校",
      mode: "search",
      searchPlaceholder: "输入学校名称"
    }),
    k: common_vendor.o($options.handleMajorSelect),
    l: common_vendor.p({
      choiceIndex: $data.formData.majorIndex,
      choiceList: $data.majorList,
      defaultText: "请选择专业",
      mode: "search",
      searchPlaceholder: "输入专业名称"
    }),
    m: common_vendor.o($options.handleGradeSelect),
    n: common_vendor.p({
      choiceIndex: $data.formData.gradeIndex,
      choiceList: $data.gradeList,
      defaultText: "请选择年级",
      mode: "select"
    }),
    o: _ctx.userRole === "老师"
  }, _ctx.userRole === "老师" ? {
    p: $data.formData.teacherScore,
    q: common_vendor.o(($event) => $data.formData.teacherScore = $event.detail.value)
  } : {}, {
    r: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ca72b3d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login_detail.js.map

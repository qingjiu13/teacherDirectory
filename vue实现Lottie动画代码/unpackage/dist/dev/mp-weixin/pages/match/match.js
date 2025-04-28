"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const router_Router = require("../../router/Router.js");
const components_combobox_graduate_school_major = require("../../components/combobox/graduate_school_major.js");
if (!Math) {
  common_vendor.unref(ChoiceSelected)();
}
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "match",
  setup(__props) {
    const searchText = common_vendor.ref("");
    const options = [
      new UTSJSONObject({ key: "school", label: "学校" }),
      new UTSJSONObject({ key: "professional", label: "专业课" }),
      new UTSJSONObject({ key: "nonProfessional", label: "非专业课" }),
      new UTSJSONObject({ key: "sort", label: "排序方式" })
    ];
    const currentOption = common_vendor.ref("");
    const showPopup = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const matchTeachers = common_vendor.ref([]);
    const formData = common_vendor.reactive(new UTSJSONObject({
      targetSchoolIndex: -1,
      targetMajorIndex: -1,
      targetSchool: "",
      targetMajor: "",
      // 非专业课筛选数据
      mathIndex: -1,
      englishIndex: -1,
      politicsIndex: -1,
      otherIndex: -1,
      // 排序方式
      sortIndex: -1
      // 排序方式索引
    }));
    const targetSchoolList = common_vendor.ref([]);
    const targetMajorList = common_vendor.ref([]);
    const graduateStore = common_vendor.ref(null);
    const mathOptions = common_vendor.ref(["数学一", "数学二", "数学三"]);
    const englishOptions = common_vendor.ref(["英语一", "英语二"]);
    const politicsOptions = common_vendor.ref(["政治必修", "政治选修"]);
    const otherOptions = common_vendor.ref(["经济学", "管理学", "教育学", "历史学"]);
    const sortOptions = common_vendor.ref(["综合评分从高到低", "价格从低到高", "价格从高到低", "最新发布"]);
    const filterState = common_vendor.reactive(new UTSJSONObject({
      school: "",
      professional: "",
      nonProfessional: new UTSJSONObject({
        math: "",
        english: "",
        politics: "",
        other: ""
      }),
      sort: ""
    }));
    const isActive = (key = null) => {
      if (key === "school")
        return !!filterState.school;
      if (key === "professional")
        return !!filterState.professional;
      if (key === "nonProfessional") {
        const nonProf = filterState.nonProfessional;
        return !!(nonProf.math || nonProf.english || nonProf.politics || nonProf.other);
      }
      if (key === "sort")
        return !!filterState.sort;
      return currentOption.value === key;
    };
    const onOptionClick = (key = null) => {
      if (currentOption.value === key && showPopup.value) {
        showPopup.value = false;
        currentOption.value = "";
        return null;
      }
      currentOption.value = key;
      showPopup.value = true;
    };
    const onPopupClose = () => {
      common_vendor.index.__f__("log", "at pages/match/match.vue:337", "onPopupClose called");
      showPopup.value = false;
      currentOption.value = "";
    };
    const initGraduateData = () => {
      try {
        graduateStore.value = UTS.JSON.parse(UTS.JSON.stringify(components_combobox_graduate_school_major.GraduateStore.state));
        components_combobox_graduate_school_major.GraduateStore.mutations.initSchoolFuse(graduateStore.value);
        const schools = Object.keys(graduateStore.value.schools).slice(0, 50);
        targetSchoolList.value = schools;
        common_vendor.index.__f__("log", "at pages/match/match.vue:357", "初始化研究生学校专业数据成功");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/match/match.vue:359", "初始化研究生学校专业数据失败:", error);
        targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"];
      }
    };
    const handleTargetSchoolSelect = (index = null, school = null) => {
      formData.targetSchoolIndex = index;
      formData.targetSchool = school;
      filterState.school = school;
      handleSchoolChange(school);
    };
    const handleSchoolChange = (school = null) => {
      if (!school) {
        resetMajorSelection();
        return null;
      }
      components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](graduateStore.value, payload);
        }
      }), school);
      if (graduateStore.value.schools[school]) {
        targetMajorList.value = graduateStore.value.schools[school].slice(0, 20);
      } else {
        resetMajorSelection();
      }
    };
    const resetMajorSelection = () => {
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
    };
    const handleTargetMajorSelect = (index = null, major = null) => {
      formData.targetMajorIndex = index;
      formData.targetMajor = major;
      filterState.professional = major;
      if (major) {
        formData.mathIndex = -1;
        formData.englishIndex = -1;
        formData.politicsIndex = -1;
        formData.otherIndex = -1;
        filterState.nonProfessional = {
          math: "",
          english: "",
          politics: "",
          other: ""
        };
      }
      applyFilters();
    };
    const handleTargetSchoolSearch = (keyword = null) => {
      if (!keyword || keyword.trim() === "") {
        const allSchools = Object.keys(graduateStore.value.schools).slice(0, 50);
        targetSchoolList.value = allSchools;
        return null;
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setSchoolKeyword(graduateStore.value, keyword);
      const filteredSchools = components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(graduateStore.value);
      targetSchoolList.value = filteredSchools;
    };
    const handleTargetMajorSearch = (keyword = null) => {
      if (!graduateStore.value.selectedSchool) {
        return null;
      }
      if (!keyword || keyword.trim() === "") {
        const allMajors = graduateStore.value.schools[graduateStore.value.selectedSchool] || [];
        targetMajorList.value = allMajors.slice(0, 20);
        return null;
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword);
      const filteredMajors = components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(graduateStore.value);
      targetMajorList.value = filteredMajors;
    };
    const handleMathSelect = (index = null) => {
      formData.mathIndex = index;
      filterState.nonProfessional.math = index >= 0 ? mathOptions.value[index] : "";
      handleNonProfessionalSelect();
      applyFilters();
    };
    const handleEnglishSelect = (index = null) => {
      formData.englishIndex = index;
      filterState.nonProfessional.english = index >= 0 ? englishOptions.value[index] : "";
      handleNonProfessionalSelect();
      applyFilters();
    };
    const handlePoliticsSelect = (index = null) => {
      formData.politicsIndex = index;
      filterState.nonProfessional.politics = index >= 0 ? politicsOptions.value[index] : "";
      handleNonProfessionalSelect();
      applyFilters();
    };
    const handleOtherSelect = (index = null) => {
      formData.otherIndex = index;
      filterState.nonProfessional.other = index >= 0 ? otherOptions.value[index] : "";
      handleNonProfessionalSelect();
      applyFilters();
    };
    const handleNonProfessionalSelect = () => {
      if (formData.mathIndex >= 0 || formData.englishIndex >= 0 || formData.politicsIndex >= 0 || formData.otherIndex >= 0) {
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
        filterState.professional = "";
      }
    };
    const handleSortSelect = (index = null) => {
      formData.sortIndex = index;
      filterState.sort = index >= 0 ? sortOptions.value[index] : "";
      applyFilters();
    };
    const resetSchoolFilter = () => {
      formData.targetSchoolIndex = -1;
      formData.targetSchool = "";
      filterState.school = "";
      applyFilters();
    };
    const resetProfessionalFilter = () => {
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
      filterState.professional = "";
      applyFilters();
    };
    const resetNonProfessionalFilter = () => {
      formData.mathIndex = -1;
      formData.englishIndex = -1;
      formData.politicsIndex = -1;
      formData.otherIndex = -1;
      filterState.nonProfessional = {
        math: "",
        english: "",
        politics: "",
        other: ""
      };
      applyFilters();
    };
    const resetSortFilter = () => {
      formData.sortIndex = -1;
      filterState.sort = "";
      applyFilters();
    };
    const confirmSchoolFilter = () => {
      showPopup.value = false;
    };
    const confirmProfessionalFilter = () => {
      showPopup.value = false;
    };
    const confirmNonProfessionalFilter = () => {
      showPopup.value = false;
    };
    const confirmSortFilter = () => {
      showPopup.value = false;
    };
    const applyFilters = () => {
      isLoading.value = true;
      setTimeout(() => {
        let filteredTeachers = [];
        if (store_index.store.state.user && store_index.store.state.user.match) {
          filteredTeachers = store_index.store.state.user.match.matchList || [];
        }
        matchTeachers.value = filteredTeachers;
        isLoading.value = false;
      }, 500);
    };
    const viewTeacherDetail = (teacherId = null) => {
      router_Router.Navigator.toTeacher(teacherId);
    };
    const handleCommunicate = (teacherId = null) => {
      router_Router.Navigator.toChat(teacherId);
    };
    const loadMoreTeachers = () => {
      if (isLoading.value)
        return null;
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 1e3);
    };
    common_vendor.onMounted(() => {
      initGraduateData();
      if (store_index.store.state.user && store_index.store.state.user.match) {
        matchTeachers.value = store_index.store.state.user.match.matchList || [];
      }
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: searchText.value,
        b: common_vendor.o(($event = null) => {
          return searchText.value = $event.detail.value;
        }),
        c: common_vendor.f(options, (item = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(item.label),
            b: currentOption.value === item.key ? 1 : "",
            c: item.key,
            d: isActive(item.key) ? 1 : "",
            e: common_vendor.o(($event = null) => {
              return onOptionClick(item.key);
            }, item.key)
          });
        }),
        d: showPopup.value
      }), showPopup.value ? new UTSJSONObject({
        e: common_vendor.o(onPopupClose)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        f: currentOption.value === "school"
      }), currentOption.value === "school" ? new UTSJSONObject({
        g: common_vendor.sr("targetSchoolDropdown", "d5601611-0"),
        h: common_vendor.o(handleTargetSchoolSelect),
        i: common_vendor.o(handleTargetSchoolSearch),
        j: common_vendor.o(handleSchoolChange),
        k: common_vendor.p(new UTSJSONObject({
          componentType: "graduateSchool",
          choiceIndex: common_vendor.unref(formData).targetSchoolIndex,
          choiceList: targetSchoolList.value,
          defaultText: "请选择学校",
          mode: "search",
          searchPlaceholder: "输入学校名称",
          enablePagination: true,
          pageSize: 10
        })),
        l: common_vendor.o(resetSchoolFilter),
        m: common_vendor.o(confirmSchoolFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        n: currentOption.value === "professional"
      }), currentOption.value === "professional" ? new UTSJSONObject({
        o: common_vendor.sr("targetMajorDropdown", "d5601611-1"),
        p: common_vendor.o(handleTargetMajorSelect),
        q: common_vendor.o(handleTargetMajorSearch),
        r: common_vendor.o(resetMajorSelection),
        s: common_vendor.p(new UTSJSONObject({
          componentType: "graduateMajor",
          choiceIndex: common_vendor.unref(formData).targetMajorIndex,
          choiceList: targetMajorList.value,
          parentValue: common_vendor.unref(formData).targetSchool,
          isLinkage: true,
          defaultText: common_vendor.unref(formData).targetSchool ? "请选择专业" : "请先选择学校",
          mode: "search",
          searchPlaceholder: "输入专业名称",
          enablePagination: true,
          pageSize: 10
        })),
        t: common_vendor.o(resetProfessionalFilter),
        v: common_vendor.o(confirmProfessionalFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        w: currentOption.value === "nonProfessional"
      }), currentOption.value === "nonProfessional" ? new UTSJSONObject({
        x: common_vendor.o(handleMathSelect),
        y: common_vendor.p(new UTSJSONObject({
          choiceIndex: common_vendor.unref(formData).mathIndex,
          choiceList: mathOptions.value,
          defaultText: "请选择考研数学",
          mode: "select"
        })),
        z: common_vendor.o(handleEnglishSelect),
        A: common_vendor.p(new UTSJSONObject({
          choiceIndex: common_vendor.unref(formData).englishIndex,
          choiceList: englishOptions.value,
          defaultText: "请选择考研英语",
          mode: "select"
        })),
        B: common_vendor.o(handlePoliticsSelect),
        C: common_vendor.p(new UTSJSONObject({
          choiceIndex: common_vendor.unref(formData).politicsIndex,
          choiceList: politicsOptions.value,
          defaultText: "请选择考研政治",
          mode: "select"
        })),
        D: common_vendor.o(handleOtherSelect),
        E: common_vendor.p(new UTSJSONObject({
          choiceIndex: common_vendor.unref(formData).otherIndex,
          choiceList: otherOptions.value,
          defaultText: "请选择其他考试",
          mode: "select"
        })),
        F: common_vendor.o(resetNonProfessionalFilter),
        G: common_vendor.o(confirmNonProfessionalFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        H: currentOption.value === "sort"
      }), currentOption.value === "sort" ? new UTSJSONObject({
        I: common_vendor.o(handleSortSelect),
        J: common_vendor.p(new UTSJSONObject({
          choiceIndex: common_vendor.unref(formData).sortIndex,
          choiceList: sortOptions.value,
          defaultText: "请选择排序方式",
          mode: "select"
        })),
        K: common_vendor.o(resetSortFilter),
        L: common_vendor.o(confirmSortFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        M: common_vendor.f(matchTeachers.value, (teacher = null, index = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: teacher.avatar || "/static/image/tab-bar/default_avatar.png",
            b: common_vendor.o(($event = null) => {
              return viewTeacherDetail(teacher.id);
            }, teacher.id || index),
            c: common_vendor.t(teacher.name),
            d: common_vendor.t(teacher.school),
            e: common_vendor.t(teacher.major),
            f: common_vendor.t(teacher.teacherScore),
            g: teacher.certificate
          }), teacher.certificate ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
            h: common_vendor.o(($event = null) => {
              return handleCommunicate(teacher.id);
            }, teacher.id || index),
            i: teacher.id || index
          }));
        }),
        N: matchTeachers.value.length === 0 && !isLoading.value
      }), matchTeachers.value.length === 0 && !isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        O: isLoading.value
      }), isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        P: common_vendor.sei("step2", "scroll-view"),
        Q: common_vendor.o(loadMoreTeachers),
        R: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d5601611"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

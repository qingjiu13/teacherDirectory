"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const components_combobox_graduate_school_major = require("../../components/combobox/graduate_school_major.js");
if (!Math) {
  common_vendor.unref(ChoiceSelected)();
}
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "match",
  setup(__props) {
    const store = common_vendor.useStore();
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
    const activeNonProTab = common_vendor.ref("");
    const nonProTabs = [
      new UTSJSONObject({ key: "math", label: "数学" }),
      new UTSJSONObject({ key: "english", label: "英语" }),
      new UTSJSONObject({ key: "politics", label: "政治" }),
      new UTSJSONObject({ key: "other", label: "其他" })
    ];
    const tabLabelMap = new UTSJSONObject(
      {
        math: "考研数学",
        english: "考研英语",
        politics: "考研政治",
        other: "其他科目"
      }
      /**
       * 从Vuex获取匹配的老师列表
       */
    );
    const matchTeachers = common_vendor.computed(() => {
      return store.state.user.match.matchList || [];
    });
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
    const isActive = (key = null) => {
      if (key === "school") {
        return !!store.state.user.match.schoolList;
      }
      if (key === "professional") {
        return !!store.state.user.match.professionalList;
      }
      if (key === "nonProfessional") {
        const nonProfList = store.state.user.match.nonProfessionalList;
        return !!(nonProfList.math || nonProfList.english || nonProfList.politics || nonProfList.other);
      }
      if (key === "sort") {
        return !!store.state.user.match.sortMode;
      }
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
      syncStateToForm(key);
    };
    const syncStateToForm = (key = null) => {
      switch (key) {
        case "school":
          if (store.state.user.match.schoolList) {
            formData.targetSchool = store.state.user.match.schoolList;
            const schoolIndex = targetSchoolList.value.findIndex((school) => {
              return school === formData.targetSchool;
            });
            formData.targetSchoolIndex = schoolIndex >= 0 ? schoolIndex : -1;
          }
          break;
        case "professional":
          if (store.state.user.match.professionalList) {
            formData.targetMajor = store.state.user.match.professionalList;
            const majorIndex = targetMajorList.value.findIndex((major) => {
              return major === formData.targetMajor;
            });
            formData.targetMajorIndex = majorIndex >= 0 ? majorIndex : -1;
          }
          break;
        case "nonProfessional":
          const nonProfList = store.state.user.match.nonProfessionalList;
          formData.mathIndex = -1;
          formData.englishIndex = -1;
          formData.politicsIndex = -1;
          formData.otherIndex = -1;
          activeNonProTab.value = "";
          if (nonProfList.math) {
            const mathIndex = mathOptions.value.findIndex((item) => {
              return item === nonProfList.math;
            });
            formData.mathIndex = mathIndex >= 0 ? mathIndex : -1;
            activeNonProTab.value = "math";
          } else if (nonProfList.english) {
            const englishIndex = englishOptions.value.findIndex((item) => {
              return item === nonProfList.english;
            });
            formData.englishIndex = englishIndex >= 0 ? englishIndex : -1;
            activeNonProTab.value = "english";
          } else if (nonProfList.politics) {
            const politicsIndex = politicsOptions.value.findIndex((item) => {
              return item === nonProfList.politics;
            });
            formData.politicsIndex = politicsIndex >= 0 ? politicsIndex : -1;
            activeNonProTab.value = "politics";
          } else if (nonProfList.other) {
            const otherIndex = otherOptions.value.findIndex((item) => {
              return item === nonProfList.other;
            });
            formData.otherIndex = otherIndex >= 0 ? otherIndex : -1;
            activeNonProTab.value = "other";
          }
          break;
        case "sort":
          if (store.state.user.match.sortMode) {
            const sortIndex = sortOptions.value.findIndex((item) => {
              return item === store.state.user.match.sortMode;
            });
            formData.sortIndex = sortIndex >= 0 ? sortIndex : -1;
          } else {
            formData.sortIndex = -1;
          }
          break;
      }
    };
    const onPopupClose = () => {
      showPopup.value = false;
      currentOption.value = "";
    };
    const handleSchoolChange = (school = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!school) {
          resetMajorSelection();
          return Promise.resolve(null);
        }
        components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
          commit: (mutation = null, payload = null) => {
            components_combobox_graduate_school_major.GraduateStore.mutations[mutation](graduateStore.value, payload);
          }
        }), school);
        if (graduateStore.value.schools[school]) {
          targetMajorList.value = graduateStore.value.schools[school].slice(0, 20);
          if (store.state.user.match.professionalList) {
            const savedMajor = store.state.user.match.professionalList;
            const majorIndex = targetMajorList.value.findIndex((major) => {
              return major === savedMajor;
            });
            if (majorIndex >= 0) {
              formData.targetMajorIndex = majorIndex;
              formData.targetMajor = savedMajor;
            } else {
              resetMajorSelection();
              store.dispatch("user/match/updateProfessionalList", "");
            }
          }
        } else {
          resetMajorSelection();
        }
      });
    };
    const initGraduateData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          graduateStore.value = UTS.JSON.parse(UTS.JSON.stringify(components_combobox_graduate_school_major.GraduateStore.state));
          components_combobox_graduate_school_major.GraduateStore.mutations.initSchoolFuse(graduateStore.value);
          const schools = Object.keys(graduateStore.value.schools).slice(0, 50);
          targetSchoolList.value = schools;
          common_vendor.index.__f__("log", "at pages/match/match.vue:474", "初始化研究生学校专业数据成功");
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/match/match.vue:476", "初始化研究生学校专业数据失败:", error);
          targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"];
        }
      });
    };
    const handleTargetSchoolSelect = (index = null, school = null) => {
      formData.targetSchoolIndex = index;
      formData.targetSchool = school;
      store.dispatch("user/match/updateSchoolList", school);
      handleSchoolChange(school);
    };
    const handleTargetMajorSelect = (index = null, major = null) => {
      formData.targetMajorIndex = index;
      formData.targetMajor = major;
      store.dispatch("user/match/updateProfessionalList", major);
      if (major) {
        formData.mathIndex = -1;
        formData.englishIndex = -1;
        formData.politicsIndex = -1;
        formData.otherIndex = -1;
        store.dispatch("user/match/updateFilterMode", new UTSJSONObject({
          math: "",
          english: "",
          politics: "",
          other: ""
        }));
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
    const handleSortSelect = (index = null) => {
      formData.sortIndex = index;
      const sortValue = index >= 0 ? sortOptions.value[index] : "";
      store.dispatch("user/match/updateSortMode", sortValue);
      applyFilters();
    };
    const resetSchoolFilter = () => {
      formData.targetSchoolIndex = -1;
      formData.targetSchool = "";
      store.dispatch("user/match/updateSchoolList", "");
      applyFilters();
    };
    const resetProfessionalFilter = () => {
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
      store.dispatch("user/match/updateProfessionalList", "");
      applyFilters();
    };
    const resetNonProfessionalFilter = () => {
      formData.mathIndex = -1;
      formData.englishIndex = -1;
      formData.politicsIndex = -1;
      formData.otherIndex = -1;
      store.dispatch("user/match/updateNonProfessionalList", new UTSJSONObject({
        math: "",
        english: "",
        politics: "",
        other: ""
      }));
      activeNonProTab.value = "";
      applyFilters();
    };
    const resetSortFilter = () => {
      formData.sortIndex = -1;
      store.dispatch("user/match/updateSortMode", "");
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
      currentOption.value = "";
    };
    const confirmSortFilter = () => {
      showPopup.value = false;
    };
    const applyFilters = () => {
      isLoading.value = true;
      store.dispatch("user/match/fetchMatchTeachers").finally(() => {
        isLoading.value = false;
      });
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
      store.dispatch("user/match/loadMoreTeachers").finally(() => {
        isLoading.value = false;
      });
    };
    const initFormDataFromState = () => {
      if (store.state.user.match.schoolList) {
        formData.targetSchool = store.state.user.match.schoolList;
        if (targetSchoolList.value.length > 0) {
          const schoolIndex = targetSchoolList.value.findIndex((school) => {
            return school === formData.targetSchool;
          });
          formData.targetSchoolIndex = schoolIndex >= 0 ? schoolIndex : -1;
        }
        if (formData.targetSchool) {
          handleSchoolChange(formData.targetSchool);
        }
      }
      if (store.state.user.match.professionalList) {
        formData.targetMajor = store.state.user.match.professionalList;
        if (targetMajorList.value.length > 0) {
          const majorIndex = targetMajorList.value.findIndex((major) => {
            return major === formData.targetMajor;
          });
          formData.targetMajorIndex = majorIndex >= 0 ? majorIndex : -1;
        }
      }
      const nonProfList = store.state.user.match.nonProfessionalList;
      if (nonProfList.math) {
        const mathIndex = mathOptions.value.findIndex((item) => {
          return item === nonProfList.math;
        });
        formData.mathIndex = mathIndex >= 0 ? mathIndex : -1;
      }
      if (nonProfList.english) {
        const englishIndex = englishOptions.value.findIndex((item) => {
          return item === nonProfList.english;
        });
        formData.englishIndex = englishIndex >= 0 ? englishIndex : -1;
      }
      if (nonProfList.politics) {
        const politicsIndex = politicsOptions.value.findIndex((item) => {
          return item === nonProfList.politics;
        });
        formData.politicsIndex = politicsIndex >= 0 ? politicsIndex : -1;
      }
      if (nonProfList.other) {
        const otherIndex = otherOptions.value.findIndex((item) => {
          return item === nonProfList.other;
        });
        formData.otherIndex = otherIndex >= 0 ? otherIndex : -1;
      }
      if (store.state.user.match.sortMode) {
        const sortIndex = sortOptions.value.findIndex((item) => {
          return item === store.state.user.match.sortMode;
        });
        formData.sortIndex = sortIndex >= 0 ? sortIndex : -1;
      }
    };
    const resetMajorSelection = () => {
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
    };
    const selectNonProTab = (key = null) => {
      activeNonProTab.value = key;
    };
    const getChoiceList = (key = null) => {
      switch (key) {
        case "math":
          return mathOptions.value;
        case "english":
          return englishOptions.value;
        case "politics":
          return politicsOptions.value;
        case "other":
          return otherOptions.value;
        default:
          return [];
      }
    };
    const getChoiceIndex = (key = null) => {
      switch (key) {
        case "math":
          return formData.mathIndex;
        case "english":
          return formData.englishIndex;
        case "politics":
          return formData.politicsIndex;
        case "other":
          return formData.otherIndex;
        default:
          return -1;
      }
    };
    const handleChoiceSelect = (key = null, index = null) => {
      formData.mathIndex = -1;
      formData.englishIndex = -1;
      formData.politicsIndex = -1;
      formData.otherIndex = -1;
      switch (key) {
        case "math":
          formData.mathIndex = index;
          store.dispatch("user/match/updateNonProfessionalList", new UTSJSONObject({
            math: index >= 0 ? mathOptions.value[index] : "",
            english: "",
            politics: "",
            other: ""
          }));
          break;
        case "english":
          formData.englishIndex = index;
          store.dispatch("user/match/updateNonProfessionalList", new UTSJSONObject({
            math: "",
            english: index >= 0 ? englishOptions.value[index] : "",
            politics: "",
            other: ""
          }));
          break;
        case "politics":
          formData.politicsIndex = index;
          store.dispatch("user/match/updateNonProfessionalList", new UTSJSONObject({
            math: "",
            english: "",
            politics: index >= 0 ? politicsOptions.value[index] : "",
            other: ""
          }));
          break;
        case "other":
          formData.otherIndex = index;
          store.dispatch("user/match/updateNonProfessionalList", new UTSJSONObject({
            math: "",
            english: "",
            politics: "",
            other: index >= 0 ? otherOptions.value[index] : ""
          }));
          break;
      }
      if (index >= 0) {
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
        store.dispatch("user/match/updateProfessionalList", "");
      }
      applyFilters();
    };
    common_vendor.onMounted(() => {
      initGraduateData();
      store.dispatch("user/match/fetchMatchTeachers").finally(() => {
        initFormDataFromState();
      });
    });
    const filterSummary = common_vendor.computed(() => {
      const summary = new UTSJSONObject(
        {}
        // 学校筛选摘要
      );
      summary.school = store.state.user.match.schoolList || "";
      summary.professional = store.state.user.match.professionalList || "";
      const nonProfList = store.state.user.match.nonProfessionalList;
      const nonProfItems = [];
      if (nonProfList.math)
        nonProfItems.push(nonProfList.math);
      if (nonProfList.english)
        nonProfItems.push(nonProfList.english);
      if (nonProfList.politics)
        nonProfItems.push(nonProfList.politics);
      if (nonProfList.other)
        nonProfItems.push(nonProfList.other);
      summary.nonProfessional = nonProfItems.join(", ");
      summary.sort = store.state.user.match.sortMode || "";
      return summary;
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: searchText.value,
        b: common_vendor.o(($event = null) => {
          return searchText.value = $event.detail.value;
        }),
        c: common_vendor.f(options, (item = null, k0 = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: common_vendor.t(item.label),
            b: filterSummary.value[item.key]
          }), filterSummary.value[item.key] ? new UTSJSONObject({
            c: common_vendor.t(filterSummary.value[item.key])
          }) : new UTSJSONObject({}), new UTSJSONObject({
            d: currentOption.value === item.key ? 1 : "",
            e: item.key,
            f: isActive(item.key) ? 1 : "",
            g: common_vendor.o(($event = null) => {
              return onOptionClick(item.key);
            }, item.key)
          }));
        }),
        d: showPopup.value
      }), showPopup.value ? common_vendor.e(new UTSJSONObject({
        e: currentOption.value === "school"
      }), currentOption.value === "school" ? new UTSJSONObject({
        f: common_vendor.sr("targetSchoolDropdown", "d5601611-0"),
        g: common_vendor.o(handleTargetSchoolSelect),
        h: common_vendor.o(handleTargetSchoolSearch),
        i: common_vendor.o(handleSchoolChange),
        j: common_vendor.p(new UTSJSONObject({
          componentType: "graduateSchool",
          choiceIndex: formData.targetSchoolIndex,
          choiceList: targetSchoolList.value,
          defaultText: "请选择学校",
          mode: "search",
          defaultSearchValue: filterSummary.value.school,
          searchPlaceholder: "输入学校名称",
          enablePagination: true,
          pageSize: 10
        })),
        k: common_vendor.o(resetSchoolFilter),
        l: common_vendor.o(confirmSchoolFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        m: currentOption.value === "professional"
      }), currentOption.value === "professional" ? new UTSJSONObject({
        n: common_vendor.sr("targetMajorDropdown", "d5601611-1"),
        o: common_vendor.o(handleTargetMajorSelect),
        p: common_vendor.o(handleTargetMajorSearch),
        q: common_vendor.o(resetMajorSelection),
        r: common_vendor.p(new UTSJSONObject({
          componentType: "graduateMajor",
          choiceIndex: formData.targetMajorIndex,
          choiceList: targetMajorList.value,
          parentValue: formData.targetSchool,
          isLinkage: true,
          defaultText: formData.targetSchool ? "请选择专业" : "请先选择学校",
          mode: "search",
          defaultSearchValue: filterSummary.value.professional,
          searchPlaceholder: "输入专业名称",
          enablePagination: true,
          pageSize: 10
        })),
        s: common_vendor.o(resetProfessionalFilter),
        t: common_vendor.o(confirmProfessionalFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        v: currentOption.value === "nonProfessional"
      }), currentOption.value === "nonProfessional" ? common_vendor.e(new UTSJSONObject({
        w: common_vendor.f(nonProTabs, (tab = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(tab.label),
            b: tab.key,
            c: common_vendor.n(activeNonProTab.value === tab.key ? "active" : ""),
            d: common_vendor.o(($event = null) => {
              return selectNonProTab(tab.key);
            }, tab.key)
          });
        }),
        x: activeNonProTab.value
      }), activeNonProTab.value ? new UTSJSONObject({
        y: common_vendor.t(tabLabelMap[activeNonProTab.value]),
        z: common_vendor.o((index = null) => {
          return handleChoiceSelect(activeNonProTab.value, index);
        }),
        A: common_vendor.p(new UTSJSONObject({
          choiceIndex: getChoiceIndex(activeNonProTab.value),
          choiceList: getChoiceList(activeNonProTab.value),
          defaultText: `请选择${tabLabelMap[activeNonProTab.value]}`,
          mode: "select"
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        B: common_vendor.o(resetNonProfessionalFilter),
        C: common_vendor.o(confirmNonProfessionalFilter)
      })) : new UTSJSONObject({}), new UTSJSONObject({
        D: currentOption.value === "sort"
      }), currentOption.value === "sort" ? new UTSJSONObject({
        E: common_vendor.o(handleSortSelect),
        F: common_vendor.p(new UTSJSONObject({
          choiceIndex: formData.sortIndex,
          choiceList: sortOptions.value,
          defaultText: "请选择排序方式",
          mode: "select"
        })),
        G: common_vendor.o(resetSortFilter),
        H: common_vendor.o(confirmSortFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        I: common_vendor.o(onPopupClose)
      })) : new UTSJSONObject({}), new UTSJSONObject({
        J: common_vendor.f(matchTeachers.value, (teacher = null, index = null, i0 = null) => {
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
        K: matchTeachers.value.length === 0 && !isLoading.value
      }), matchTeachers.value.length === 0 && !isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        L: isLoading.value
      }), isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        M: common_vendor.sei("step2", "scroll-view"),
        N: common_vendor.o(loadMoreTeachers),
        O: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d5601611"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

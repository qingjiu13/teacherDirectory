"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const CascadeContainer = () => "../../components/cascade-container/cascade-container.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected,
    CascadeContainer
  },
  data() {
    return {
      // 筛选相关数据
      sortList: [
        new UTSJSONObject({
          choiceItemContent: "综合排序",
          choiceItemValue: "comprehensive"
        }),
        new UTSJSONObject({
          choiceItemContent: "评分最高",
          choiceItemValue: "score_desc"
        }),
        new UTSJSONObject({
          choiceItemContent: "价格最低",
          choiceItemValue: "price_asc"
        }),
        new UTSJSONObject({
          choiceItemContent: "价格最高",
          choiceItemValue: "price_desc"
        })
      ],
      // 排序筛选
      tempSelectedSort: "综合排序",
      // 下拉框索引
      sortIndex: -1,
      // 页面状态
      isLoading: false
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapGetters("match", ["filteredMatchList", "teacherInfo"])), {
    /**
     * @description 获取页面展示的老师列表
     * @returns {Array} 要展示的老师列表
     */
    matchTeachers() {
      return this.filteredMatchList || [];
    }
  })),
  onLoad() {
    common_vendor.index.__f__("log", "at pages/match/match.vue:114", "匹配页面已加载");
    this.initPage();
  },
  methods: {
    /**
     * @description 初始化页面
     */
    initPage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/match/match.vue:124", "初始化页面 - 开始加载数据");
        yield this.loadData(true);
      });
    },
    /**
     * @description 获取老师的一对一辅导服务价格
     * @param {Object} teacher - 老师对象
     * @returns {String} 格式化后的价格，如果没有一对一辅导服务则返回"暂无价格"
     */
    getOneOnOnePrice(teacher = null) {
      if (!teacher || !teacher.service || teacher.service.length === 0) {
        return "暂无一对一辅导价格";
      }
      const oneOnOneService = teacher.service.find((s = null) => {
        return s.type === "一对一辅导";
      });
      if (oneOnOneService && oneOnOneService.price) {
        return `¥${oneOnOneService.price}/小时`;
      } else {
        return "暂无价格";
      }
    },
    /**
     * @description 处理筛选器应用事件
     * @param {Object} filters - 筛选条件对象
     */
    onFilterApply(filters = null) {
      common_vendor.index.__f__("log", "at pages/match/match.vue:153", "应用筛选条件:", filters);
      this.tempSelectedSchool = filters.school;
      this.tempSelectedMajor = filters.major;
      this.tempSelectedSubject = filters.subject;
      this.applyFilter();
    },
    /**
     * @description 加载数据
     * @param {Boolean} forceRefresh - 是否强制刷新数据
     */
    loadData(forceRefresh = false) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          this.isLoading = true;
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const cascadeValues = this.$refs.cascadeFilter ? this.$refs.cascadeFilter.getSelectedValues() : new UTSJSONObject({ school: "", major: "", subject: "" });
          const filters = new UTSJSONObject({
            school: cascadeValues.school,
            major: cascadeValues.major,
            subject: cascadeValues.subject,
            sort: this.tempSelectedSort
          });
          if (forceRefresh || filters.school || filters.major || filters.subject || filters.sort !== "综合排序") {
            yield store_index.store.dispatch("match/getFilteredMatchList", filters);
          } else if (this.matchTeachers && this.matchTeachers.length > 0) {
            common_vendor.index.__f__("log", "at pages/match/match.vue:194", "使用已缓存的数据");
          } else {
            yield store_index.store.dispatch("match/getFilteredMatchList", filters);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/match/match.vue:200", "加载数据失败:", error);
          common_vendor.index.showToast({
            title: error.message || "加载失败，请重试",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
          common_vendor.index.hideLoading();
        }
      });
    },
    /**
     * @description 加载更多数据
     */
    loadMore() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/match/match.vue:217", "加载更多数据");
      });
    },
    // 页面点击事件
    onPageClick() {
      let comboboxComponents = this.$children.filter((child) => {
        return child.$options.name === "ChoiceSelected";
      });
      comboboxComponents.forEach((component) => {
        if (component.closeDropdown) {
          component.closeDropdown();
        }
      });
      if (this.$refs.cascadeFilter) {
        const cascadeSelectors = this.$refs.cascadeFilter.$children.filter((child = null) => {
          return child.$options.name === "CascadeSelector";
        });
        cascadeSelectors.forEach((selector = null) => {
          if (selector.closeDropdown) {
            selector.closeDropdown();
          }
        });
      }
    },
    // 应用筛选
    applyFilter() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield this.loadData(true);
      });
    },
    // 排序下拉框选择处理
    onSortClick(position = null) {
      this.sortIndex = position;
      this.tempSelectedSort = this.sortList[position].choiceItemContent;
    },
    /**
     * @description 查看老师详情
     * @param {String} teacherId - 老师ID
     */
    viewTeacherDetail(teacherId = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const teacherExists = this.teacherInfo(teacherId);
          if (teacherExists) {
            router_Router.Navigator.toTeacher(teacherId);
          } else {
            yield store_index.store.dispatch("match/getTeacherById", teacherId);
            router_Router.Navigator.toTeacher(teacherId);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/match/match.vue:281", "获取老师详情失败:", error);
          common_vendor.index.showToast({
            title: error.message || "加载失败，请重试",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    },
    /**
     * @description 处理沟通按钮点击
     * @param {String} teacherId - 老师ID
     */
    handleCommunicate(teacherId = null) {
      router_Router.Navigator.toChat(teacherId);
    }
  }
});
if (!Array) {
  const _easycom_cascade_container2 = common_vendor.resolveComponent("cascade-container");
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  (_easycom_cascade_container2 + _component_choice_selected)();
}
const _easycom_cascade_container = () => "../../components/cascade-container/cascade-container.js";
if (!Math) {
  _easycom_cascade_container();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("cascadeFilter", "43141b5a-0"),
    b: common_vendor.o($options.onFilterApply),
    c: common_vendor.o($options.onSortClick),
    d: common_vendor.p({
      defaultText: "排序筛选",
      choiceIndex: $data.sortIndex,
      choiceList: $data.sortList
    }),
    e: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args)),
    f: common_vendor.o(() => {
    }),
    g: common_vendor.f($options.matchTeachers, (teacher, index, i0) => {
      return {
        a: teacher.avatar || "/static/image/tab-bar/default_avatar.png",
        b: common_vendor.o(($event) => $options.viewTeacherDetail(teacher.id), index),
        c: common_vendor.t(teacher.name),
        d: common_vendor.t(teacher.school),
        e: common_vendor.t(teacher.major),
        f: common_vendor.t(teacher.teacherScore),
        g: common_vendor.t($options.getOneOnOnePrice(teacher)),
        h: common_vendor.o(($event) => $options.handleCommunicate(teacher.id), index),
        i: index
      };
    }),
    h: $options.matchTeachers.length === 0 && !$data.isLoading
  }, $options.matchTeachers.length === 0 && !$data.isLoading ? {} : {}, {
    i: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    j: common_vendor.sei("step2", "scroll-view"),
    k: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    m: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

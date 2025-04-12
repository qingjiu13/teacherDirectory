"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
require("../../store/index.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected
  },
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:101", "匹配页面已加载");
      yield this.getTeachersList();
    });
  },
  data() {
    return {
      // 筛选相关数据
      schoolList: [
        new UTSJSONObject({ choiceItemId: "bjdx", choiceItemContent: "北京大学" }),
        new UTSJSONObject({ choiceItemId: "qhdx", choiceItemContent: "清华大学" }),
        new UTSJSONObject({ choiceItemId: "fddx", choiceItemContent: "复旦大学" }),
        new UTSJSONObject({ choiceItemId: "zjdx", choiceItemContent: "浙江大学" }),
        new UTSJSONObject({ choiceItemId: "njdx", choiceItemContent: "南京大学" }),
        new UTSJSONObject({ choiceItemId: "scdx", choiceItemContent: "四川大学" }),
        new UTSJSONObject({ choiceItemId: "whdx", choiceItemContent: "武汉大学" }),
        new UTSJSONObject({ choiceItemId: "zsdx", choiceItemContent: "中山大学" }),
        new UTSJSONObject({ choiceItemId: "xjtu", choiceItemContent: "西安交通大学" }),
        new UTSJSONObject({ choiceItemId: "sysu", choiceItemContent: "中山大学" }),
        new UTSJSONObject({ choiceItemId: "hust", choiceItemContent: "华中科技大学" }),
        new UTSJSONObject({ choiceItemId: "hit", choiceItemContent: "哈尔滨工业大学" }),
        new UTSJSONObject({ choiceItemId: "sjtu", choiceItemContent: "上海交通大学" })
      ],
      majorList: [
        new UTSJSONObject({ choiceItemId: "jsjkx", choiceItemContent: "计算机科学" }),
        new UTSJSONObject({ choiceItemId: "rjgc", choiceItemContent: "软件工程" }),
        new UTSJSONObject({ choiceItemId: "sx", choiceItemContent: "数学" }),
        new UTSJSONObject({ choiceItemId: "wl", choiceItemContent: "物理" }),
        new UTSJSONObject({ choiceItemId: "hx", choiceItemContent: "化学" }),
        new UTSJSONObject({ choiceItemId: "sw", choiceItemContent: "生物" }),
        new UTSJSONObject({ choiceItemId: "jdxy", choiceItemContent: "机电工程" }),
        new UTSJSONObject({ choiceItemId: "dqxy", choiceItemContent: "电气工程" }),
        new UTSJSONObject({ choiceItemId: "jzxy", choiceItemContent: "建筑学" }),
        new UTSJSONObject({ choiceItemId: "lyxy", choiceItemContent: "临床医学" }),
        new UTSJSONObject({ choiceItemId: "yyxy", choiceItemContent: "药学" }),
        new UTSJSONObject({ choiceItemId: "glxy", choiceItemContent: "管理学" }),
        new UTSJSONObject({ choiceItemId: "jjxy", choiceItemContent: "经济学" }),
        new UTSJSONObject({ choiceItemId: "flxy", choiceItemContent: "法学" })
      ],
      sortList: [
        new UTSJSONObject({ choiceItemId: "zh", choiceItemContent: "综合排序" })
      ],
      // 临时选择变量（用户选择但尚未应用）
      tempSelectedSchool: "",
      tempSelectedMajor: "",
      tempSelectedSort: "综合排序",
      // 下拉框索引
      schoolIndex: -1,
      majorIndex: -1,
      sortIndex: -1
    };
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState("match", [
    "teachers",
    "currentPage",
    "totalPages",
    "loading",
    "loadingMore"
  ])), common_vendor.mapGetters("match", [
    "filteredTeachers",
    "isLoading",
    "isLoadingMore",
    "hasMoreData"
  ])),
  methods: Object.assign(Object.assign({}, common_vendor.mapActions("match", [
    "getTeachers",
    "loadMoreTeachers",
    "searchTeachers",
    "resetAndGetTeachers",
    "selectTeacher"
  ])), {
    // 获取老师列表
    getTeachersList() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield this.getTeachers(new UTSJSONObject({ page: 1, limit: 10 }));
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
    },
    // 应用筛选
    applyFilter() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const filters = new UTSJSONObject({
          school: this.tempSelectedSchool,
          major: this.tempSelectedMajor
        });
        common_vendor.index.__f__("log", "at pages/match/match.uvue:201", "应用筛选:", filters);
        yield this.searchTeachers(filters);
      });
    },
    // 下拉框选择处理
    onSchoolClick(position = null) {
      this.schoolIndex = position;
      this.tempSelectedSchool = this.schoolList[position].choiceItemContent;
    },
    onMajorClick(position = null) {
      this.majorIndex = position;
      this.tempSelectedMajor = this.majorList[position].choiceItemContent;
    },
    onSortClick(position = null) {
      this.sortIndex = position;
      this.tempSelectedSort = this.sortList[position].choiceItemContent;
    },
    /**
     * @description 处理学校搜索输入事件
     * @param {String} keyword - 搜索关键词
     */
    onSchoolSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:231", "学校搜索:", keyword);
    },
    // 与老师沟通
    handleCommunicate(teacherId = null) {
      this.selectTeacher(teacherId);
      common_vendor.index.showLoading({
        title: "正在连接..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        router_Router.Navigator.toChat(teacherId);
      }, 1e3);
    },
    // 查看老师详情
    viewTeacherDetail(teacherId = null) {
      this.selectTeacher(teacherId);
      router_Router.Navigator.toTeacher(teacherId);
    }
  })
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  _component_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onSchoolClick),
    b: common_vendor.o($options.onSchoolSearch),
    c: common_vendor.p({
      defaultText: "学校",
      choiceIndex: $data.schoolIndex,
      choiceList: $data.schoolList,
      mode: "search",
      searchPlaceholder: "学校"
    }),
    d: common_vendor.o($options.onMajorClick),
    e: common_vendor.p({
      defaultText: "专业",
      choiceIndex: $data.majorIndex,
      choiceList: $data.majorList
    }),
    f: common_vendor.o($options.onSortClick),
    g: common_vendor.p({
      defaultText: "排序筛选",
      choiceIndex: $data.sortIndex,
      choiceList: $data.sortList
    }),
    h: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args)),
    i: common_vendor.o(() => {
    }),
    j: common_vendor.f(_ctx.filteredTeachers, (teacher, index, i0) => {
      return {
        a: teacher.avatar || "/static/image/tab-bar/default_avatar.png",
        b: common_vendor.o(($event) => $options.viewTeacherDetail(teacher.id), index),
        c: common_vendor.t(teacher.nickname),
        d: common_vendor.t(teacher.school),
        e: common_vendor.t(teacher.major),
        f: common_vendor.t(teacher.score),
        g: common_vendor.f(teacher.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        h: common_vendor.o(($event) => $options.handleCommunicate(teacher.id), index),
        i: index
      };
    }),
    k: _ctx.filteredTeachers.length === 0 && !_ctx.isLoading && !_ctx.isLoadingMore
  }, _ctx.filteredTeachers.length === 0 && !_ctx.isLoading && !_ctx.isLoadingMore ? {} : {}, {
    l: _ctx.isLoadingMore
  }, _ctx.isLoadingMore ? {} : {}, {
    m: !_ctx.hasMoreData && _ctx.filteredTeachers.length > 0 && !_ctx.isLoadingMore
  }, !_ctx.hasMoreData && _ctx.filteredTeachers.length > 0 && !_ctx.isLoadingMore ? {} : {}, {
    n: common_vendor.sei("step2", "scroll-view"),
    o: common_vendor.o((...args) => _ctx.loadMoreTeachers && _ctx.loadMoreTeachers(...args)),
    p: _ctx.isLoading
  }, _ctx.isLoading ? {} : {}, {
    q: common_vendor.sei(_ctx.virtualHostId, "view"),
    r: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

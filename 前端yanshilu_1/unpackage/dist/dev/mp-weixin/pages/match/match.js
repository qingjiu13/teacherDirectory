"use strict";
const common_vendor = require("../../common/vendor.js");
const router = require("../../router.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:86", "匹配页面已加载");
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
      // 实际应用的筛选变量（点击筛选按钮后才会更新）
      appliedSelectedSchool: "",
      appliedSelectedMajor: "",
      appliedSelectedSort: "综合排序",
      // 下拉框索引
      schoolIndex: -1,
      majorIndex: -1,
      sortIndex: -1,
      // 加载状态
      isLoading: false,
      // 老师数据
      teachers: [
        new UTSJSONObject({
          id: 1,
          nickname: "王教授",
          avatar: "/static/image/tab-bar/default_avatar.png",
          school: "北京大学",
          major: "计算机科学",
          title: "教授",
          score: "考研400分",
          tags: ["认证学校", "经验丰富", "答疑及时", "通俗易懂"]
        }),
        new UTSJSONObject({
          id: 2,
          nickname: "李博士",
          avatar: "/static/image/tab-bar/default_avatar.png",
          school: "清华大学",
          major: "软件工程",
          title: "副教授",
          score: "考研390分",
          tags: ["认证学校", "教学认真"]
        }),
        new UTSJSONObject({
          id: 3,
          nickname: "张老师",
          avatar: "/static/image/tab-bar/default_avatar.png",
          school: "复旦大学",
          major: "数学",
          title: "讲师",
          score: "考研380分",
          tags: ["认证学校", "耐心细致"]
        }),
        new UTSJSONObject({
          id: 4,
          nickname: "刘教授",
          avatar: "/static/image/tab-bar/default_avatar.png",
          school: "浙江大学",
          major: "物理",
          title: "教授",
          score: "考研410分",
          tags: ["认证学校", "通俗易懂"]
        }),
        new UTSJSONObject({
          id: 5,
          nickname: "陈老师",
          avatar: "/static/image/tab-bar/default_avatar.png",
          school: "南京大学",
          major: "化学",
          title: "副教授",
          score: "考研385分",
          tags: ["认证学校", "答疑及时"]
        })
      ]
    };
  },
  computed: {
    filteredTeachers() {
      let result = [...this.teachers];
      if (this.appliedSelectedSchool) {
        result = result.filter((teacher) => {
          return teacher.school === this.appliedSelectedSchool;
        });
      }
      if (this.appliedSelectedMajor) {
        result = result.filter((teacher) => {
          return teacher.major === this.appliedSelectedMajor;
        });
      }
      result.sort((a, b) => {
        const scoreA = parseInt(a.score.match(/\d+/)[0]);
        const scoreB = parseInt(b.score.match(/\d+/)[0]);
        return scoreB - scoreA;
      });
      return result;
    }
  },
  methods: {
    // 页面点击事件
    onPageClick() {
      let comboboxComponents = this.$children.filter((child) => {
        return child.$options.name === "ChoiceSelected";
      });
      comboboxComponents.forEach((component) => {
        if (component.isShowChoice) {
          component.isShowChoice = false;
        }
      });
    },
    // 应用筛选
    applyFilter() {
      this.appliedSelectedSchool = this.tempSelectedSchool;
      this.appliedSelectedMajor = this.tempSelectedMajor;
      this.appliedSelectedSort = this.tempSelectedSort;
      common_vendor.index.__f__("log", "at pages/match/match.uvue:237", "应用筛选:", new UTSJSONObject({
        学校: this.appliedSelectedSchool,
        专业: this.appliedSelectedMajor,
        排序: this.appliedSelectedSort
      }));
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
    // 保留原有方法
    handleCommunicate(teacherId = null) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        router.Navigator.toChat(teacherId);
      }, 1e3);
    },
    viewTeacherDetail(teacherId = null) {
      router.Navigator.toTeacher(teacherId);
    }
  }
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  _component_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onSchoolClick),
    b: common_vendor.p({
      defaultText: "学校",
      choiceIndex: $data.schoolIndex,
      choiceList: $data.schoolList
    }),
    c: common_vendor.o($options.onMajorClick),
    d: common_vendor.p({
      defaultText: "专业",
      choiceIndex: $data.majorIndex,
      choiceList: $data.majorList
    }),
    e: common_vendor.o($options.onSortClick),
    f: common_vendor.p({
      defaultText: "排序筛选",
      choiceIndex: $data.sortIndex,
      choiceList: $data.sortList
    }),
    g: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args)),
    h: common_vendor.o(() => {
    }),
    i: common_vendor.f($options.filteredTeachers, (teacher, index, i0) => {
      return {
        a: teacher.avatar || "/static/image/tab-bar/default_avatar.svg",
        b: common_vendor.o(($event) => $options.viewTeacherDetail(teacher.id), index),
        c: common_vendor.t(teacher.nickname),
        d: common_vendor.t(teacher.title || "教授"),
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
    j: $options.filteredTeachers.length === 0
  }, $options.filteredTeachers.length === 0 ? {} : {}, {
    k: common_vendor.sei("step2", "scroll-view"),
    l: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    m: common_vendor.sei(_ctx.virtualHostId, "view"),
    n: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

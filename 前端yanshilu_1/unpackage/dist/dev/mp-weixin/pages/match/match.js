"use strict";
const common_vendor = require("../../common/vendor.js");
const router = require("../../router.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:116", "匹配页面已加载");
  },
  data() {
    return {
      // 筛选相关数据
      schoolList: [
        new UTSJSONObject({ choiceItemId: "bjdx", choiceItemContent: "北京大学" }),
        new UTSJSONObject({ choiceItemId: "qhdx", choiceItemContent: "清华大学" }),
        new UTSJSONObject({ choiceItemId: "fddx", choiceItemContent: "复旦大学" }),
        new UTSJSONObject({ choiceItemId: "zjdx", choiceItemContent: "浙江大学" }),
        new UTSJSONObject({ choiceItemId: "njdx", choiceItemContent: "南京大学" })
      ],
      majorList: [
        new UTSJSONObject({ choiceItemId: "jsjkx", choiceItemContent: "计算机科学" }),
        new UTSJSONObject({ choiceItemId: "rjgc", choiceItemContent: "软件工程" }),
        new UTSJSONObject({ choiceItemId: "sx", choiceItemContent: "数学" }),
        new UTSJSONObject({ choiceItemId: "wl", choiceItemContent: "物理" }),
        new UTSJSONObject({ choiceItemId: "hx", choiceItemContent: "化学" }),
        new UTSJSONObject({ choiceItemId: "sw", choiceItemContent: "生物" })
      ],
      sortList: [
        new UTSJSONObject({ choiceItemId: "zh", choiceItemContent: "综合排序" })
      ],
      selectedSchool: "",
      selectedMajor: "",
      selectedSort: "综合排序",
      schoolIndex: 0,
      majorIndex: 0,
      sortIndex: 0,
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
          tags: ["认证学校", "经验丰富"]
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
      ],
      showTeacherDetail: false,
      currentTeacher: null,
      activeTab: "chat"
    };
  },
  computed: {
    filteredTeachers() {
      let result = [...this.teachers];
      if (this.selectedSchool) {
        result = result.filter((teacher) => {
          return teacher.school === this.selectedSchool;
        });
      }
      if (this.selectedMajor) {
        result = result.filter((teacher) => {
          return teacher.major === this.selectedMajor;
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
    // 下拉框选择处理
    onSchoolClick(position = null) {
      this.schoolIndex = position;
      this.selectedSchool = position > 0 ? this.schoolList[position].choiceItemContent : "";
    },
    onMajorClick(position = null) {
      this.majorIndex = position;
      this.selectedMajor = position > 0 ? this.majorList[position].choiceItemContent : "";
    },
    onSortClick(position = null) {
      this.sortIndex = position;
      this.selectedSort = this.sortList[position].choiceItemContent;
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
      this.currentTeacher = UTS.arrayFind(this.teachers, (t) => {
        return t.id === teacherId;
      });
      this.showTeacherDetail = true;
    },
    closeTeacherDetail() {
      this.showTeacherDetail = false;
    },
    switchTab(tab = null) {
      this.activeTab = tab;
    },
    startChat() {
      this.closeTeacherDetail();
      if (this.currentTeacher) {
        this.handleCommunicate(this.currentTeacher.id);
      }
    },
    viewTeacherProfile() {
      if (this.currentTeacher) {
        common_vendor.index.navigateTo({
          url: `/pages/teacher/teacher?id=${this.currentTeacher.id}`
        });
      }
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
      choiceContent: $data.selectedSchool || "学校",
      choiceIndex: $data.schoolIndex,
      choiceList: $data.schoolList
    }),
    c: common_vendor.o($options.onMajorClick),
    d: common_vendor.p({
      choiceContent: $data.selectedMajor || "专业",
      choiceIndex: $data.majorIndex,
      choiceList: $data.majorList
    }),
    e: common_vendor.o($options.onSortClick),
    f: common_vendor.p({
      choiceContent: $data.selectedSort || "排序筛选",
      choiceIndex: $data.sortIndex,
      choiceList: $data.sortList
    }),
    g: common_vendor.f($options.filteredTeachers, (teacher, index, i0) => {
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
    h: $options.filteredTeachers.length === 0
  }, $options.filteredTeachers.length === 0 ? {} : {}, {
    i: common_vendor.sei("step2", "scroll-view"),
    j: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    k: $data.showTeacherDetail
  }, $data.showTeacherDetail ? common_vendor.e({
    l: common_vendor.o((...args) => $options.closeTeacherDetail && $options.closeTeacherDetail(...args)),
    m: $data.currentTeacher.avatar || "/static/image/tab-bar/default_avatar.png",
    n: common_vendor.t($data.currentTeacher.nickname),
    o: common_vendor.t($data.currentTeacher.title),
    p: common_vendor.t($data.currentTeacher.school),
    q: $data.activeTab === "chat" ? 1 : "",
    r: common_vendor.o(($event) => $options.switchTab("chat")),
    s: $data.activeTab === "profile" ? 1 : "",
    t: common_vendor.o(($event) => $options.switchTab("profile")),
    v: $data.activeTab === "chat"
  }, $data.activeTab === "chat" ? {
    w: common_vendor.o((...args) => $options.startChat && $options.startChat(...args))
  } : {}, {
    x: $data.activeTab === "profile"
  }, $data.activeTab === "profile" ? {
    y: common_vendor.t($data.currentTeacher.background || "暂无介绍"),
    z: common_vendor.t($data.currentTeacher.experience || "暂无介绍"),
    A: common_vendor.f($data.currentTeacher.expertise || [], (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    B: common_vendor.o((...args) => $options.viewTeacherProfile && $options.viewTeacherProfile(...args))
  } : {}) : {}, {
    C: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

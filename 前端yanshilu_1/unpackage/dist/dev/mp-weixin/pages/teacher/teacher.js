"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const store_services_index = require("../../store/services/index.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      teacherId: null,
      teacherInfo: new UTSJSONObject({
        id: null,
        name: "",
        avatar: "",
        school: "",
        major: "",
        is_certified: false,
        tags: [],
        introduction: ""
      }),
      activeTab: "services",
      services: [],
      isLoading: false
      // 是否正在加载
    };
  },
  onLoad(options) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      this.teacherId = options.id || 1;
      this.isLoading = true;
      try {
        yield store_index.loadTeacherData();
        common_vendor.index.__f__("log", "at pages/teacher/teacher.uvue:118", "教师模块数据已加载");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/teacher/teacher.uvue:120", "加载教师模块数据失败:", error);
      }
      this.loadTeacherInfo();
      this.loadServices();
    });
  },
  methods: {
    /**
     * @description 切换标签页
     * @param {String} tab - 标签名称
     */
    switchTab(tab = null) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
      }
    },
    /**
     * @description 加载老师信息
     */
    loadTeacherInfo() {
      this.isLoading = true;
      setTimeout(() => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          try {
            yield store_services_index.mock.mockDelay(500);
            const teacherId = parseInt(this.teacherId);
            const teacher = store_services_index.mock.mockTeachers.find((t = null) => {
              return t.id === teacherId;
            }) || store_services_index.mock.mockTeachers[0];
            this.teacherInfo = {
              id: teacher.id,
              name: teacher.nickname,
              avatar: teacher.avatar,
              school: teacher.school,
              major: teacher.major,
              score: teacher.score,
              is_certified: teacher.tags.includes("认证学校"),
              tags: teacher.tags,
              introduction: teacher.introduction
            };
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/teacher/teacher.uvue:168", "加载老师信息失败:", error);
            this.teacherInfo = {
              id: this.teacherId,
              name: "王教授",
              avatar: "/static/image/tab-bar/default_avatar.png",
              school: "北京大学",
              major: "计算机科学",
              score: "400",
              is_certified: true,
              tags: ["已认证", "其他标签", "其他标签"],
              introduction: "从事计算机教学20年，专注于算法和数据结构领域研究。曾指导多名学生成功考取清华、北大等名校研究生。教学风格深入浅出，善于将复杂概念简单化。"
            };
          } finally {
            this.isLoading = false;
          }
        });
      }, 100);
    },
    /**
     * @description 加载服务列表
     */
    loadServices() {
      this.isLoading = true;
      setTimeout(() => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          try {
            yield store_services_index.mock.mockDelay(300);
            this.services = store_services_index.mock.mockServices;
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/teacher/teacher.uvue:202", "加载服务列表失败:", error);
            this.services = [
              {
                id: 1,
                title: "考研数学一对一辅导",
                price: 300,
                image: "/static/image/tab-bar/default_avatar.png",
                description: "针对考研数学难点，提供个性化辅导，帮助你掌握核心解题技巧。"
              },
              {
                id: 2,
                title: "计算机专业课指导",
                price: 250,
                image: "/static/image/tab-bar/default_avatar.png",
                description: "数据结构、操作系统、计算机网络、计算机组成原理全面指导。"
              },
              {
                id: 3,
                title: "考研复习规划制定",
                price: 180,
                image: "/static/image/tab-bar/default_avatar.png",
                description: "根据个人情况定制复习计划，科学规划时间，提高复习效率。"
              }
            ];
          } finally {
            this.isLoading = false;
          }
        });
      }, 100);
    },
    /**
     * @description 发起咨询
     */
    startConsultation() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        router_Router.Navigator.toChat(this.teacherId);
      }, 800);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.teacherInfo.avatar,
    b: common_vendor.t($data.teacherInfo.name),
    c: $data.teacherInfo.tags && $data.teacherInfo.tags.length > 0
  }, $data.teacherInfo.tags && $data.teacherInfo.tags.length > 0 ? {
    d: common_vendor.t($data.teacherInfo.tags[0])
  } : {}, {
    e: common_vendor.f($data.teacherInfo.tags.slice(1), (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    f: common_vendor.t($data.teacherInfo.school),
    g: common_vendor.t($data.teacherInfo.major),
    h: common_vendor.t($data.teacherInfo.score),
    i: common_vendor.t($data.teacherInfo.introduction),
    j: $data.activeTab === "services" ? 1 : "",
    k: common_vendor.o(($event) => $options.switchTab("services")),
    l: $data.activeTab === "services"
  }, $data.activeTab === "services" ? common_vendor.e({
    m: $data.services.length > 0
  }, $data.services.length > 0 ? {
    n: common_vendor.f($data.services, (service, index, i0) => {
      return {
        a: service.image,
        b: common_vendor.t(service.title),
        c: common_vendor.t(service.price),
        d: common_vendor.t(service.description),
        e: index
      };
    }),
    o: common_vendor.o((...args) => $options.startConsultation && $options.startConsultation(...args))
  } : {}) : {}, {
    p: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacher/teacher.js.map

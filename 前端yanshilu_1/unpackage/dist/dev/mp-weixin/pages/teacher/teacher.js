"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
require("../../store/services/mock-data.js");
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
      this.loadTeacherData();
    });
  },
  methods: new UTSJSONObject({
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
     * @description 加载老师信息和服务列表（合并为一个API调用）
     */
    loadTeacherData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield store_index.store.dispatch("teacher/getTeacherInfo", this.teacherId);
          if (result.success) {
            this.teacherInfo = store_index.store.getters["teacher/teacherInfo"];
            this.services = store_index.store.getters["teacher/services"];
          } else {
            throw new Error("获取老师数据失败");
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/teacher/teacher.uvue:155", "加载老师数据失败:", error);
          common_vendor.index.showToast({
            title: "加载失败，请重试",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
          this.isLoading = false;
        }
      });
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
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.teacherInfo.avatar,
    b: common_vendor.t($data.teacherInfo.nickname),
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
    p: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacher/teacher.js.map

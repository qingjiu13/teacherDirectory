"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
require("../../store/index.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      teacherId: null,
      activeTab: "services",
      isLoading: false
      // 是否正在加载
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapGetters("match", ["teacherInfo"])), {
    /**
    * @description 获取当前老师对象
    * @returns {Object} 老师对象
    */
    teacher() {
      const teacherData = this.teacherInfo(this.teacherId);
      return teacherData || new UTSJSONObject({
        id: null,
        name: "",
        avatar: "/static/image/tab-bar/default_avatar.png",
        school: "",
        major: "",
        teacherScore: 0,
        certificate: 0,
        selfIntroduction: "加载中..."
      });
    },
    /**
    * @description 获取老师的服务列表
    * @returns {Array} 服务列表
    */
    services() {
      if (!this.teacher || !this.teacher.service) {
        return [];
      }
      return this.teacher.service || [];
    }
  })),
  onLoad(options) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      this.teacherId = options.id || "";
      this.isLoading = true;
      this.isLoading = false;
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
    a: $options.teacher.avatar || "/static/image/tab-bar/default_avatar.png",
    b: common_vendor.t($options.teacher.name),
    c: common_vendor.t($options.teacher.school),
    d: common_vendor.t($options.teacher.major),
    e: common_vendor.t($options.teacher.teacherScore),
    f: common_vendor.t($options.teacher.selfIntroduction || "这位老师很懒，还没有填写个人简介。"),
    g: $data.activeTab === "services" ? 1 : "",
    h: common_vendor.o(($event) => $options.switchTab("services")),
    i: $data.activeTab === "services"
  }, $data.activeTab === "services" ? common_vendor.e({
    j: $options.services.length > 0
  }, $options.services.length > 0 ? {
    k: common_vendor.f($options.services, (service, index, i0) => {
      return {
        a: service.image || "/static/image/services/default_service.png",
        b: common_vendor.t(service.name),
        c: common_vendor.t(service.price),
        d: common_vendor.t(service.description),
        e: index
      };
    }),
    l: common_vendor.o((...args) => $options.startConsultation && $options.startConsultation(...args))
  } : {}) : {}, {
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/teacher/teacher.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const Loading = () => "../../components/loading-animation/loading.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    Loading
  },
  data() {
    return {
      services: [
        new UTSJSONObject({
          id: 1,
          name: "考研全年VIP班",
          price: "¥12800",
          description: "一站式考研备考方案，包含全年公共课与专业课辅导，专属学习规划师制定个性化学习计划，配套核心教材和真题资料，定期模拟测试及学习情况分析，考前冲刺点题，适合零基础考生。",
          checked: true,
          imageUrl: "/static/images/kaoyan1.jpg"
        }),
        new UTSJSONObject({
          id: 2,
          name: "考研政治精讲班",
          price: "¥1580",
          description: "由资深政治老师授课，系统讲解考研政治核心知识点，深度剖析马原、毛中特、史纲、思修法基，配套专属内部讲义和大量真题解析，掌握答题技巧和方法，突破政治高分。",
          checked: false,
          imageUrl: "/static/images/kaoyan2.jpg"
        }),
        new UTSJSONObject({
          id: 3,
          name: "考研英语强化班",
          price: "¥1880",
          description: "针对考研英语一/二，重点讲解阅读理解、翻译、写作等高频考点，配合历年真题详解和独家预测题，教授解题思路和答题模板，针对性提升英语应试能力，助力高分突破。",
          checked: false,
          imageUrl: "/static/images/kaoyan3.jpg"
        }),
        new UTSJSONObject({
          id: 4,
          name: "专业课一对一定制",
          price: "¥4980",
          description: "根据不同院校不同专业量身定制辅导计划，由目标院校毕业导师或博士生授课，提供内部资料和历年真题解析，深度挖掘考试重点和命题规律，定期模拟测试和答疑，确保专业课高分。",
          checked: false,
          imageUrl: "/static/images/kaoyan4.jpg"
        }),
        new UTSJSONObject({
          id: 5,
          name: "考研数学基础班",
          price: "¥2280",
          description: "专为数学基础薄弱的考生设计，从高数、线代、概率论基础讲起，循序渐进，配合大量例题和习题，帮助考生建立数学思维，掌握核心解题方法，突破数学难关。",
          checked: false,
          imageUrl: "/static/images/kaoyan1.jpg"
        }),
        new UTSJSONObject({
          id: 6,
          name: "考研复试指导班",
          price: "¥3680",
          description: "全面覆盖复试各环节，包括专业课笔试、英语听说、专业面试和综合面试，提供院校复试真题和模拟题，安排多轮模拟面试演练，指导简历制作和自我介绍，提高复试通过率。",
          checked: false,
          imageUrl: "/static/images/kaoyan2.jpg"
        }),
        new UTSJSONObject({
          id: 7,
          name: "考研暑期集训营",
          price: "¥5980",
          description: "暑期30天高强度集训，每日8小时专业授课，涵盖公共课和专业课，配合每日测试和强化训练，建立系统知识框架，培养高效学习习惯，为后期复习打下坚实基础。",
          checked: false,
          imageUrl: "/static/images/kaoyan3.jpg"
        }),
        new UTSJSONObject({
          id: 8,
          name: "考研考前冲刺班",
          price: "¥3280",
          description: "针对考前最后3个月开设，重点突破历年真题和模拟题，总结各科目重点难点，进行专项训练和查漏补缺，配合心理调适和应试技巧指导，确保考生以最佳状态应考。",
          checked: false,
          imageUrl: "/static/images/kaoyan4.jpg"
        }),
        new UTSJSONObject({
          id: 9,
          name: "考研专业课资料包",
          price: "¥980",
          description: "包含目标院校专业课内部资料、历年真题及详解、考试大纲解析、核心知识点总结、重点院校考研经验分享等，电子版+纸质版双重提供，助力专业课复习事半功倍。",
          checked: false,
          imageUrl: "/static/images/kaoyan1.jpg"
        }),
        new UTSJSONObject({
          id: 10,
          name: "考研院校专业选择指导",
          price: "¥1280",
          description: "由专业顾问团队提供一对一院校专业选择指导，包括个人情况评估、目标设定、院校专业分析、报考策略制定等，为考生提供科学合理的择校方案，提高复试录取成功率。",
          checked: false,
          imageUrl: "/static/images/kaoyan2.jpg"
        })
      ],
      selectedService: new UTSJSONObject({
        id: 1,
        name: "考研全年VIP班",
        price: "¥12800",
        description: "一站式考研备考方案，包含全年公共课与专业课辅导，专属学习规划师制定个性化学习计划，配套核心教材和真题资料，定期模拟测试及学习情况分析，考前冲刺点题，适合零基础考生。",
        checked: true,
        imageUrl: "/static/images/kaoyan1.jpg"
      }),
      isDetailExpanded: false,
      overlayVisible: false
    };
  },
  onShow() {
    if (getApp().globalData && getApp().globalData.newServiceAdded) {
      getApp().globalData.newServiceAdded = false;
      if (getApp().globalData.newService) {
        const newService = getApp().globalData.newService;
        if (newService.price && !newService.price.startsWith("¥")) {
          newService.price = "¥" + newService.price;
        }
        this.services.unshift(newService);
        this.selectedService = newService;
        common_vendor.index.showToast({
          title: "新服务已添加",
          icon: "success"
        });
        getApp().globalData.newService = null;
      }
    }
    this.loadServices();
  },
  onLoad() {
    common_vendor.index.$on("serviceAdded", this.handleServiceAdded);
    common_vendor.index.$on("serviceEdited", this.handleServiceEdited);
    getApp().globalData = getApp().globalData || new UTSJSONObject({});
    getApp().globalData.defaultServices = UTS.JSON.parse(UTS.JSON.stringify(this.services));
  },
  onUnload() {
    common_vendor.index.$off("serviceAdded", this.handleServiceAdded);
    common_vendor.index.$off("serviceEdited", this.handleServiceEdited);
  },
  methods: new UTSJSONObject({
    goBack() {
      common_vendor.index.navigateBack();
    },
    toggleService(index = null) {
      this.services[index].checked = !this.services[index].checked;
    },
    editService(index = null) {
      this.$refs.loadingRef.show();
      setTimeout(() => {
        this.$refs.loadingRef.hide();
        this.selectedService = this.services[index];
        const currentService = this.services[index];
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.editingService = UTS.JSON.parse(UTS.JSON.stringify(currentService));
        common_vendor.index.navigateTo({
          url: "/pages/mine/service_newbuilt?mode=edit&id=" + currentService.id
        });
      }, 600);
    },
    deleteService(index = null) {
      this.$refs.loadingRef.show();
      setTimeout(() => {
        this.$refs.loadingRef.hide();
        this.services.splice(index, 1);
        this.saveServices();
        common_vendor.index.showToast({
          title: "服务已删除",
          icon: "success"
        });
      }, 800);
    },
    handleAddService() {
      this.$refs.loadingRef.show();
      setTimeout(() => {
        this.$refs.loadingRef.hide();
        common_vendor.index.navigateTo({
          url: "/pages/mine/service_newbuilt"
        });
      }, 800);
    },
    // 处理新添加的服务
    handleServiceAdded(newService = null) {
      if (newService.price && !newService.price.startsWith("¥")) {
        newService.price = "¥" + newService.price;
      }
      this.services.unshift(newService);
      this.selectedService = newService;
      this.saveServices();
      common_vendor.index.showToast({
        title: "新服务已添加",
        icon: "success"
      });
    },
    // 处理编辑后的服务
    handleServiceEdited(editedService = null) {
      const index = this.services.findIndex((service) => {
        return service.id === editedService.id;
      });
      if (index !== -1) {
        this.services[index] = editedService;
        this.saveServices();
        common_vendor.index.showToast({
          title: "服务已修改",
          icon: "success"
        });
      }
    },
    // 保存服务列表到本地存储
    saveServices() {
      try {
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(this.services));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/service.vue:327", "保存服务列表失败", e);
      }
    },
    // 从本地存储加载服务列表
    loadServices() {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        if (servicesStr) {
          const storedServices = UTS.JSON.parse(servicesStr);
          if (storedServices && storedServices.length > 0) {
            this.services = storedServices;
            this.selectedService = this.services[0];
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/service.vue:344", "加载服务列表失败", e);
      }
    },
    showServiceDetail(index = null) {
      this.selectedService = this.services[index];
      this.overlayVisible = true;
      setTimeout(() => {
        this.isDetailExpanded = true;
      }, 20);
    },
    hideServiceDetail() {
      this.isDetailExpanded = false;
      setTimeout(() => {
        this.overlayVisible = false;
      }, 300);
    }
  })
}));
if (!Array) {
  const _component_loading = common_vendor.resolveComponent("loading");
  _component_loading();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleAddService && $options.handleAddService(...args)),
    b: common_vendor.f($data.services, (service, index, i0) => {
      return {
        a: `url(${service.imageUrl})`,
        b: common_vendor.t(service.name),
        c: common_vendor.t(service.price),
        d: common_vendor.o(($event) => $options.editService(index), service.id),
        e: common_vendor.o(($event) => $options.deleteService(index), service.id),
        f: common_vendor.o(() => {
        }, service.id),
        g: service.id,
        h: service.checked ? 1 : "",
        i: common_vendor.o(($event) => $options.showServiceDetail(index), service.id)
      };
    }),
    c: $data.selectedService
  }, $data.selectedService ? {
    d: common_vendor.o((...args) => $options.hideServiceDetail && $options.hideServiceDetail(...args)),
    e: `url(${$data.selectedService.imageUrl})`,
    f: common_vendor.t($data.selectedService.name),
    g: common_vendor.t($data.selectedService.price),
    h: common_vendor.t($data.selectedService.description),
    i: $data.isDetailExpanded ? 1 : ""
  } : {}, {
    j: $data.overlayVisible
  }, $data.overlayVisible ? {
    k: common_vendor.o((...args) => $options.hideServiceDetail && $options.hideServiceDetail(...args))
  } : {}, {
    l: common_vendor.sr("loadingRef", "d7d562ac-0"),
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/service.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const Loading = () => "../../components/loading-animation/loading.js";
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    Loading,
    ChoiceSelected
  },
  data() {
    return {
      mode: "add",
      serviceId: null,
      selectedServiceType: "",
      selectedServiceTypeIndex: -1,
      serviceTypes: [
        "考研全年VIP班",
        "考研政治精讲班",
        "考研英语强化班",
        "专业课一对一定制",
        "考研数学基础班",
        "考研复试指导班",
        "考研暑期集训营",
        "考研考前冲刺班",
        "考研专业课资料包",
        "考研院校专业选择指导",
        "一对一课程",
        "小组课程",
        "学习资料",
        "专业辅导"
      ],
      showServiceTypeDropdown: false,
      duration: "",
      description: "",
      price: "",
      files: [],
      showDuration: true,
      showAttachment: false,
      originalService: null
      // 保存原始服务数据
    };
  },
  onLoad(options) {
    if (options.mode === "edit" && options.id) {
      this.mode = "edit";
      this.serviceId = options.id;
      if (getApp().globalData && getApp().globalData.editingService) {
        const serviceData = getApp().globalData.editingService;
        this.originalService = UTS.JSON.parse(UTS.JSON.stringify(serviceData));
        this.fillFormWithServiceData(serviceData);
      }
    }
    common_vendor.index.$on("serviceEdited", this.handleServiceEdited);
  },
  onUnload() {
    common_vendor.index.$off("serviceEdited", this.handleServiceEdited);
  },
  methods: {
    fillFormWithServiceData(serviceData = null) {
      this.selectedServiceType = serviceData.name || "";
      this.selectedServiceTypeIndex = this.serviceTypes.findIndex((type) => {
        return type === serviceData.name;
      });
      this.price = serviceData.price ? serviceData.price.replace("¥", "") : "";
      this.description = serviceData.description || "";
      this.duration = serviceData.duration || "";
      this.updateFormFields();
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    handleServiceTypeSelect(index = null) {
      this.selectedServiceTypeIndex = index;
      this.selectedServiceType = this.serviceTypes[index];
      this.updateFormFields();
    },
    updateFormFields() {
      if (this.selectedServiceType === "学习资料") {
        this.showDuration = false;
        this.showAttachment = true;
      } else {
        this.showDuration = true;
        this.showAttachment = this.selectedServiceType === "学习资料";
      }
    },
    chooseFile() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        success: (res) => {
          this.files = res.tempFilePaths;
        }
      }));
    },
    submitForm() {
      this.$refs.loadingRef.show();
      if (!this.selectedServiceType) {
        common_vendor.index.showToast({
          title: "请选择服务类型",
          icon: "none"
        });
        this.$refs.loadingRef.hide();
        return null;
      }
      if (this.showDuration && !this.duration) {
        common_vendor.index.showToast({
          title: "请填写课程时长",
          icon: "none"
        });
        this.$refs.loadingRef.hide();
        return null;
      }
      if (!this.price) {
        common_vendor.index.showToast({
          title: "请填写服务价格",
          icon: "none"
        });
        this.$refs.loadingRef.hide();
        return null;
      }
      let serviceData = new UTSJSONObject(
        {
          name: this.selectedServiceType,
          price: this.price.startsWith("¥") ? this.price : "¥" + this.price,
          description: this.description || `这是一个${this.selectedServiceType}服务`,
          duration: this.duration,
          checked: false,
          imageUrl: this.files.length > 0 ? this.files[0] : "/static/images/kaoyan" + Math.floor(Math.random() * 4 + 1) + ".jpg"
        }
        // 根据模式执行不同操作
      );
      if (this.mode === "edit" && this.serviceId && this.originalService) {
        serviceData.id = this.serviceId;
        serviceData.checked = this.originalService.checked;
        this.updateExistingService(serviceData);
      } else {
        serviceData.id = Date.now();
        this.addNewService(serviceData);
      }
    },
    addNewService(newService = null) {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        let services = [];
        if (servicesStr) {
          services = UTS.JSON.parse(servicesStr);
        }
        services.push(newService);
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(services));
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.newServiceAdded = true;
        getApp().globalData.newService = newService;
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack(new UTSJSONObject({
            delta: 1,
            success: () => {
              common_vendor.index.$emit("serviceAdded", newService);
            }
          }));
        }, 1500);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/service_newbuilt.vue:283", "保存服务失败", e);
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
    },
    updateExistingService(updatedService = null) {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        let services = [];
        if (servicesStr) {
          services = UTS.JSON.parse(servicesStr);
        }
        const index = services.findIndex((s) => {
          return s.id == this.serviceId;
        });
        if (index !== -1) {
          services[index] = updatedService;
        } else {
          const defaultServices = getApp().globalData.defaultServices || [];
          const defaultIndex = defaultServices.findIndex((s = null) => {
            return s.id == this.serviceId;
          });
          if (defaultIndex !== -1) {
            defaultServices[defaultIndex] = updatedService;
          } else {
            services.push(updatedService);
          }
        }
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(services));
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.serviceEdited = true;
        getApp().globalData.editedService = updatedService;
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack(new UTSJSONObject({
            delta: 1,
            success: () => {
              common_vendor.index.$emit("serviceEdited", updatedService);
            }
          }));
        }, 1500);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mine/service_newbuilt.vue:345", "更新服务失败", e);
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "更新失败，请重试",
          icon: "none"
        });
      }
    },
    handleServiceEdited(service = null) {
      common_vendor.index.__f__("log", "at pages/mine/service_newbuilt.vue:354", "Service edited", service);
    }
  }
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  const _component_loading = common_vendor.resolveComponent("loading");
  (_component_choice_selected + _component_loading)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o($options.handleServiceTypeSelect),
    c: common_vendor.p({
      choiceIndex: $data.selectedServiceTypeIndex,
      choiceList: $data.serviceTypes,
      defaultText: "请选择服务类型"
    }),
    d: $data.showDuration
  }, $data.showDuration ? {
    e: $data.duration,
    f: common_vendor.o(($event) => $data.duration = $event.detail.value)
  } : {}, {
    g: $data.description,
    h: common_vendor.o(($event) => $data.description = $event.detail.value),
    i: $data.price,
    j: common_vendor.o(($event) => $data.price = $event.detail.value),
    k: $data.showAttachment
  }, $data.showAttachment ? {
    l: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}, {
    m: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    n: common_vendor.sr("loadingRef", "7b0712fa-1"),
    o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/service_newbuilt.js.map

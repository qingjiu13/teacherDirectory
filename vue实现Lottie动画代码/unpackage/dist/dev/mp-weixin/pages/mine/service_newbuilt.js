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
        "一对一课程",
        "一对多课程",
        "学习资料"
      ],
      coursequantity: "",
      showServiceTypeDropdown: false,
      duration: "",
      description: "",
      price: "",
      files: [],
      showDuration: true,
      showAttachment: false,
      originalService: null,
      // 一对一课程相关数据
      serviceName: "",
      selectedLessonsIndex: -1,
      lessonOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      selectedHoursIndex: -1,
      hourOptions: ["1", "2", "3", "4", "5", "6", "8", "10"],
      selectedMinutesIndex: -1,
      minuteOptions: ["0", "15", "30", "45"],
      // 一对多课程相关数据
      selectedMultiLessonsIndex: -1,
      multiLessonOptions: ["1", "2", "3", "4", "5", "6", "7", "20"],
      selectedMultiHoursIndex: -1,
      selectedMultiMinutesIndex: -1,
      multiServiceName: "",
      selectedPersonCountIndex: -1,
      personCountOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
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
      if (this.selectedServiceType === "一对一课程") {
        this.serviceName = serviceData.serviceName || "";
        if (serviceData.lessons) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex((l) => {
            return l === serviceData.lessons.toString();
          });
        }
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/);
          if (match) {
            this.selectedHoursIndex = this.hourOptions.findIndex((h) => {
              return h === match[1];
            });
            this.selectedMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === match[2];
            });
          }
        }
      } else if (this.selectedServiceType === "一对多课程") {
        this.multiServiceName = serviceData.serviceName || "";
        if (serviceData.lessons) {
          this.selectedMultiLessonsIndex = this.multiLessonOptions.findIndex((l) => {
            return l === serviceData.lessons.toString();
          });
        }
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/);
          if (match) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex((h) => {
              return h === match[1];
            });
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === match[2];
            });
          }
        }
        if (serviceData.personCount) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex((p) => {
            return p === serviceData.personCount.toString();
          });
        }
      } else {
        this.coursequantity = serviceData.coursequantity || "";
      }
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
    handleLessonsSelect(index = null) {
      this.selectedLessonsIndex = index;
    },
    handleHoursSelect(index = null) {
      this.selectedHoursIndex = index;
    },
    handleMinutesSelect(index = null) {
      this.selectedMinutesIndex = index;
    },
    handleMultiLessonsSelect(index = null) {
      this.selectedMultiLessonsIndex = index;
    },
    handleMultiHoursSelect(index = null) {
      this.selectedMultiHoursIndex = index;
    },
    handleMultiMinutesSelect(index = null) {
      this.selectedMultiMinutesIndex = index;
    },
    handlePersonCountSelect(index = null) {
      this.selectedPersonCountIndex = index;
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
      if (this.selectedServiceType === "一对一课程") {
        if (this.selectedLessonsIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程节数",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
        if (this.selectedHoursIndex === -1 || this.selectedMinutesIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程时长",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
        if (!this.serviceName) {
          common_vendor.index.showToast({
            title: "请填写服务名称",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
      } else if (this.selectedServiceType === "一对多课程") {
        if (this.selectedMultiLessonsIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课时",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
        if (this.selectedMultiHoursIndex === -1 || this.selectedMultiMinutesIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程时长",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
        if (!this.multiServiceName) {
          common_vendor.index.showToast({
            title: "请填写服务名称",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
        if (this.selectedPersonCountIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程人数",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
      } else if (this.selectedServiceType === "学习资料") {
        if (!this.coursequantity) {
          common_vendor.index.showToast({
            title: "请填写课程数量",
            icon: "none"
          });
          this.$refs.loadingRef.hide();
          return null;
        }
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
          checked: false,
          imageUrl: this.files.length > 0 ? this.files[0] : "/static/images/kaoyan" + Math.floor(Math.random() * 4 + 1) + ".jpg"
        }
        // 为一对一课程添加特殊字段
      );
      if (this.selectedServiceType === "一对一课程") {
        serviceData.serviceName = this.serviceName;
        serviceData.lessons = this.lessonOptions[this.selectedLessonsIndex];
        serviceData.totalDuration = `${this.hourOptions[this.selectedHoursIndex]}小时${this.minuteOptions[this.selectedMinutesIndex]}分钟`;
      } else if (this.selectedServiceType === "一对多课程") {
        serviceData.serviceName = this.multiServiceName;
        serviceData.lessons = this.multiLessonOptions[this.selectedMultiLessonsIndex];
        serviceData.totalDuration = `${this.hourOptions[this.selectedMultiHoursIndex]}小时${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`;
        serviceData.personCount = this.personCountOptions[this.selectedPersonCountIndex];
      } else {
        serviceData.coursequantity = this.coursequantity;
      }
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
        common_vendor.index.__f__("error", "at pages/mine/service_newbuilt.vue:550", "保存服务失败", e);
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
        common_vendor.index.__f__("error", "at pages/mine/service_newbuilt.vue:612", "更新服务失败", e);
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "更新失败，请重试",
          icon: "none"
        });
      }
    },
    handleServiceEdited(service = null) {
      common_vendor.index.__f__("log", "at pages/mine/service_newbuilt.vue:621", "Service edited", service);
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
    a: common_vendor.o($options.handleServiceTypeSelect),
    b: common_vendor.p({
      choiceIndex: $data.selectedServiceTypeIndex,
      choiceList: $data.serviceTypes,
      defaultText: "请选择服务类型"
    }),
    c: $data.selectedServiceType === "一对一课程"
  }, $data.selectedServiceType === "一对一课程" ? {
    d: common_vendor.o($options.handleLessonsSelect),
    e: common_vendor.p({
      choiceIndex: $data.selectedLessonsIndex,
      choiceList: $data.lessonOptions,
      defaultText: "请选择节数"
    })
  } : {}, {
    f: $data.selectedServiceType === "一对多课程"
  }, $data.selectedServiceType === "一对多课程" ? {
    g: common_vendor.o($options.handleLessonsSelect),
    h: common_vendor.p({
      choiceIndex: $data.selectedLessonsIndex,
      choiceList: $data.lessonOptions,
      defaultText: "请选择节数"
    })
  } : {}, {
    i: $data.selectedServiceType === "一对一课程"
  }, $data.selectedServiceType === "一对一课程" ? {
    j: common_vendor.o($options.handleHoursSelect),
    k: common_vendor.p({
      choiceIndex: $data.selectedHoursIndex,
      choiceList: $data.hourOptions,
      defaultText: "小时"
    }),
    l: common_vendor.o($options.handleMinutesSelect),
    m: common_vendor.p({
      choiceIndex: $data.selectedMinutesIndex,
      choiceList: $data.minuteOptions,
      defaultText: "分钟"
    }),
    n: $data.serviceName,
    o: common_vendor.o(($event) => $data.serviceName = $event.detail.value)
  } : {}, {
    p: $data.selectedServiceType === "一对多课程"
  }, $data.selectedServiceType === "一对多课程" ? {
    q: common_vendor.o($options.handleMultiHoursSelect),
    r: common_vendor.p({
      choiceIndex: $data.selectedMultiHoursIndex,
      choiceList: $data.hourOptions,
      defaultText: "小时"
    }),
    s: common_vendor.o($options.handleMultiMinutesSelect),
    t: common_vendor.p({
      choiceIndex: $data.selectedMultiMinutesIndex,
      choiceList: $data.minuteOptions,
      defaultText: "分钟"
    }),
    v: common_vendor.o($options.handlePersonCountSelect),
    w: common_vendor.p({
      choiceIndex: $data.selectedPersonCountIndex,
      choiceList: $data.personCountOptions,
      defaultText: "请选择课程人数"
    }),
    x: $data.multiServiceName,
    y: common_vendor.o(($event) => $data.multiServiceName = $event.detail.value)
  } : {}, {
    z: $data.selectedServiceType === "学习资料"
  }, $data.selectedServiceType === "学习资料" ? {
    A: $data.coursequantity,
    B: common_vendor.o(common_vendor.m(($event) => $data.coursequantity = $event.detail.value, {
      number: true
    }))
  } : {}, {
    C: $data.description,
    D: common_vendor.o(($event) => $data.description = $event.detail.value),
    E: $data.price,
    F: common_vendor.o(($event) => $data.price = $event.detail.value),
    G: $data.showAttachment
  }, $data.showAttachment ? {
    H: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}, {
    I: $data.mode === "add"
  }, $data.mode === "add" ? {} : {}, {
    J: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    K: common_vendor.sr("loadingRef", "7b0712fa-8"),
    L: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/service_newbuilt.js.map

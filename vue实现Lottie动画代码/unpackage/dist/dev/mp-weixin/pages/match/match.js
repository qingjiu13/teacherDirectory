"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "match",
  setup(__props) {
    const store = common_vendor.useStore();
    const options = [
      new UTSJSONObject({ key: "school", label: "学校" }),
      new UTSJSONObject({ key: "professional", label: "专业课" }),
      new UTSJSONObject({ key: "nonProfessional", label: "非专业课" }),
      new UTSJSONObject({ key: "filter", label: "筛选" })
    ];
    const currentOption = common_vendor.ref("");
    const showPopup = common_vendor.ref(false);
    const changedOptions = common_vendor.reactive(new UTSJSONObject({}));
    const isLoading = common_vendor.ref(false);
    const matchTeachers = common_vendor.ref([]);
    common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.reactive(new UTSJSONObject({
      certified: null
    }));
    const getPopupTitle = () => {
      const option = UTS.arrayFind(options, (o) => {
        return o.key === currentOption.value;
      });
      return option ? option.label : "";
    };
    const isActive = (key = null) => {
      if (key === "professional" && changedOptions.nonProfessional)
        return false;
      if (key === "nonProfessional" && changedOptions.professional)
        return false;
      if (changedOptions[key])
        return true;
      return currentOption.value === key;
    };
    const onOptionClick = (key = null) => {
      if (key === "professional" && changedOptions.nonProfessional || key === "nonProfessional" && changedOptions.professional) {
        return null;
      }
      if (currentOption.value === key && showPopup.value) {
        showPopup.value = false;
        currentOption.value = "";
        return null;
      }
      currentOption.value = key;
      showPopup.value = true;
      if (!changedOptions[key]) {
        changedOptions[key] = true;
      }
    };
    const onPopupClose = () => {
      showPopup.value = false;
      if (!changedOptions[currentOption.value]) {
        currentOption.value = "";
      }
    };
    const viewTeacherDetail = (teacherId = null) => {
      router_Router.Navigator.toTeacher(teacherId);
    };
    const handleCommunicate = (teacherId = null) => {
      router_Router.Navigator.toChat(teacherId);
    };
    const loadMoreTeachers = () => {
      if (isLoading.value)
        return null;
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 1e3);
    };
    common_vendor.onMounted(() => {
      if (store.state.user && store.state.user.match) {
        matchTeachers.value = store.state.user.match.matchList || [];
      }
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: _ctx.searchText,
        b: common_vendor.o(($event = null) => {
          return _ctx.searchText = $event.detail.value;
        }),
        c: common_vendor.f(options, (item = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(item.label),
            b: currentOption.value === item.key ? 1 : "",
            c: item.key,
            d: isActive(item.key) ? 1 : "",
            e: common_vendor.o(($event = null) => {
              return onOptionClick(item.key);
            }, item.key)
          });
        }),
        d: showPopup.value
      }), showPopup.value ? new UTSJSONObject({
        e: common_vendor.o(onPopupClose)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        f: showPopup.value
      }), showPopup.value ? common_vendor.e(new UTSJSONObject({
        g: common_vendor.t(getPopupTitle()),
        h: common_vendor.o(onPopupClose),
        i: changedOptions[currentOption.value]
      }), changedOptions[currentOption.value] ? new UTSJSONObject({}) : new UTSJSONObject({})) : new UTSJSONObject({}), new UTSJSONObject({
        j: common_vendor.f(matchTeachers.value, (teacher = null, index = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: teacher.avatar || "/static/image/tab-bar/default_avatar.png",
            b: common_vendor.o(($event = null) => {
              return viewTeacherDetail(teacher.id);
            }, teacher.id || index),
            c: common_vendor.t(teacher.name),
            d: common_vendor.t(teacher.school),
            e: common_vendor.t(teacher.major),
            f: common_vendor.t(teacher.teacherScore),
            g: teacher.certificate
          }), teacher.certificate ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
            h: common_vendor.o(($event = null) => {
              return handleCommunicate(teacher.id);
            }, teacher.id || index),
            i: teacher.id || index
          }));
        }),
        k: matchTeachers.value.length === 0 && !isLoading.value
      }), matchTeachers.value.length === 0 && !isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        l: isLoading.value
      }), isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        m: common_vendor.sei("step2", "scroll-view"),
        n: common_vendor.o(loadMoreTeachers),
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d5601611"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map

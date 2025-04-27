"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_uni_search_bar = common_vendor.resolveComponent("uni-search-bar");
  const _component_uni_segmented_control = common_vendor.resolveComponent("uni-segmented-control");
  const _component_uni_rate = common_vendor.resolveComponent("uni-rate");
  (_component_uni_search_bar + _component_uni_segmented_control + _component_uni_rate)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "course",
  setup(__props) {
    const courses = common_vendor.ref([
      new UTSJSONObject({
        id: 2,
        name: "考研政治冲刺班",
        teacher: "李老师",
        time: "2023-10-15 至 2023-12-15",
        status: "upcoming",
        // 修改头像路径
        avatar: "/static/image/default_avatar.png",
        rating: 4.8,
        progress: 0
      }),
      new UTSJSONObject({
        id: 3,
        name: "考研数学基础班",
        teacher: "王老师",
        time: "2023-09-01 至 2023-11-30",
        status: "completed",
        avatar: "/static/image/default_avatar.png",
        rating: 4.5,
        progress: 100
      }),
      new UTSJSONObject({
        id: 4,
        name: "考研专业课辅导",
        teacher: "赵老师",
        time: "2023-11-01 至 2024-01-15",
        status: "ongoing",
        avatar: "/static/image/teacher4.png",
        rating: 4.7,
        progress: 30
      }),
      new UTSJSONObject({
        id: 5,
        name: "考研复试指导",
        teacher: "钱老师",
        time: "2024-02-15 至 2024-03-31",
        status: "upcoming",
        avatar: "/static/image/teacher5.png",
        rating: 4.9,
        progress: 0
      }),
      new UTSJSONObject(
        // 新增课程数据
        {
          id: 6,
          name: "考研写作专项",
          teacher: "孙老师",
          time: "每周一、三 19:00-21:00",
          status: "ongoing",
          avatar: "/static/image/default_avatar.png",
          rating: 4.6,
          progress: 45,
          details: new UTSJSONObject({
            duration: "24课时",
            students: 128
          })
        }
      ),
      new UTSJSONObject({
        id: 7,
        name: "考研英语强化班",
        teacher: "周老师",
        time: "每周二、四 19:00-21:00",
        status: "ongoing",
        avatar: "/static/image/default_avatar.png",
        rating: 4.7,
        progress: 60
      }),
      new UTSJSONObject({
        id: 8,
        name: "考研专业课冲刺",
        teacher: "吴老师",
        time: "2024-01-10 至 2024-02-28",
        status: "upcoming",
        avatar: "/static/image/default_avatar.png",
        rating: 4.9,
        progress: 0
      })
    ]);
    const currentTab = common_vendor.ref(0);
    const tabs = ["全部", "进行中", "即将开始", "已结束"];
    const searchText = common_vendor.ref("");
    const filteredCourses = common_vendor.computed(() => {
      let filtered = courses.value;
      if (currentTab.value === 1) {
        filtered = filtered.filter((course) => {
          return course.status === "ongoing";
        });
      } else if (currentTab.value === 2) {
        filtered = filtered.filter((course) => {
          return course.status === "upcoming";
        });
      } else if (currentTab.value === 3) {
        filtered = filtered.filter((course) => {
          return course.status === "completed";
        });
      }
      if (searchText.value) {
        filtered = filtered.filter((course) => {
          return course.name.includes(searchText.value) || course.teacher.includes(searchText.value);
        });
      }
      return filtered;
    });
    const getStatusText = (status = null) => {
      const statusMap = new UTSJSONObject({
        ongoing: "进行中",
        upcoming: "即将开始",
        completed: "已结束"
      });
      return statusMap[status] || "";
    };
    const searchCourse = (e = null) => {
      searchText.value = e.value;
    };
    const changeTab = (e = null) => {
      currentTab.value = e.currentIndex;
    };
    const goToDetail = (id = null) => {
      common_vendor.index.navigateTo({
        url: `/pages/mine/course/course_detail?id=${id}`
      });
    };
    const onRefresh = () => {
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.o(searchCourse),
        b: common_vendor.p({
          placeholder: "搜索课程"
        }),
        c: common_vendor.o(changeTab),
        d: common_vendor.p({
          current: currentTab.value,
          values: tabs
        }),
        e: common_vendor.f(filteredCourses.value, (course = null, index = null, i0 = null) => {
          return {
            a: course.avatar || "/static/image/default_avatar.png",
            b: common_vendor.t(course.name),
            c: "0cb8e478-2-" + i0,
            d: common_vendor.p({
              value: course.rating,
              disabled: true,
              size: "14"
            }),
            e: common_vendor.t(course.progress),
            f: common_vendor.t(course.teacher),
            g: common_vendor.t(getStatusText(course.status)),
            h: common_vendor.n(course.status),
            i: common_vendor.t(course.time),
            j: "0cb8e478-3-" + i0,
            k: common_vendor.p({
              value: course.rating,
              disabled: true,
              size: "14"
            }),
            l: course.progress,
            m: course.progress,
            n: common_vendor.o(($event = null) => {
              return goToDetail(course.id);
            }, index),
            o: index
          };
        }),
        f: common_vendor.o(onRefresh),
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course.js.map

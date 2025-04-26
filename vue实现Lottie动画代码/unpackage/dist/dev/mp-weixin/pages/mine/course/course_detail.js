"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
if (!Array) {
  const _component_uni_segmented_control = common_vendor.resolveComponent("uni-segmented-control");
  _component_uni_segmented_control();
}
if (!Math) {
  uniRate();
}
const uniRate = () => "../../../node-modules/@dcloudio/uni-ui/lib/uni-rate/uni-rate.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "course_detail",
  setup(__props) {
    const course = common_vendor.ref(new UTSJSONObject({}));
    const currentTab = common_vendor.ref(0);
    const detailTabs = ["介绍", "大纲", "资料"];
    const mockCourses = new UTSJSONObject({
      1: new UTSJSONObject({
        id: 1,
        name: "考研英语强化班",
        teacher: "张老师",
        time: "2023-09-01 至 2023-12-31",
        status: "ongoing",
        rating: 4.5,
        progress: 65,
        introduction: "本课程针对考研英语进行全面强化训练，重点突破阅读理解和写作两大难点。通过系统讲解和大量练习，帮助考生在短时间内提升英语成绩。",
        syllabus: [
          new UTSJSONObject({
            title: "第一部分: 阅读理解",
            lessons: [
              new UTSJSONObject({ title: "阅读技巧精讲", duration: 45 }),
              new UTSJSONObject({ title: "真题解析", duration: 60 }),
              new UTSJSONObject({ title: "模拟训练", duration: 90 })
            ]
          }),
          new UTSJSONObject({
            title: "第二部分: 写作",
            lessons: [
              new UTSJSONObject({ title: "写作模板讲解", duration: 45 }),
              new UTSJSONObject({ title: "高分句型训练", duration: 60 }),
              new UTSJSONObject({ title: "真题作文批改", duration: 90 })
            ]
          })
        ],
        resources: [
          new UTSJSONObject({ name: "考研英语高频词汇表.pdf" }),
          new UTSJSONObject({ name: "阅读理解真题集.zip" }),
          new UTSJSONObject({ name: "写作模板.docx" })
        ]
      }),
      2: new UTSJSONObject({
        id: 2,
        name: "高等数学基础班",
        teacher: "李老师",
        time: "2023-10-01 至 2024-01-31",
        status: "ongoing",
        rating: 4.8,
        progress: 40,
        introduction: "本课程系统讲解高等数学基础知识，包括微积分、线性代数和概率统计等内容，适合数学基础薄弱的学生。",
        syllabus: [
          new UTSJSONObject({
            title: "第一部分: 微积分",
            lessons: [
              new UTSJSONObject({ title: "极限与连续", duration: 60 }),
              new UTSJSONObject({ title: "导数与微分", duration: 60 }),
              new UTSJSONObject({ title: "积分与应用", duration: 90 })
            ]
          }),
          new UTSJSONObject({
            title: "第二部分: 线性代数",
            lessons: [
              new UTSJSONObject({ title: "矩阵与行列式", duration: 60 }),
              new UTSJSONObject({ title: "向量空间", duration: 60 }),
              new UTSJSONObject({ title: "特征值与特征向量", duration: 90 })
            ]
          })
        ],
        resources: [
          new UTSJSONObject({ name: "高等数学公式大全.pdf" }),
          new UTSJSONObject({ name: "微积分习题集.zip" }),
          new UTSJSONObject({ name: "线性代数讲义.docx" })
        ]
      }),
      3: new UTSJSONObject({
        id: 3,
        name: "数据结构与算法",
        teacher: "王老师",
        time: "2023-11-01 至 2024-02-28",
        status: "upcoming",
        rating: 4.7,
        progress: 0,
        introduction: "本课程讲解常见数据结构和算法，包括数组、链表、树、图等数据结构，以及排序、查找等经典算法。",
        syllabus: [
          new UTSJSONObject({
            title: "第一部分: 数据结构",
            lessons: [
              new UTSJSONObject({ title: "线性结构", duration: 60 }),
              new UTSJSONObject({ title: "树与二叉树", duration: 60 }),
              new UTSJSONObject({ title: "图与图算法", duration: 90 })
            ]
          }),
          new UTSJSONObject({
            title: "第二部分: 算法",
            lessons: [
              new UTSJSONObject({ title: "排序算法", duration: 60 }),
              new UTSJSONObject({ title: "查找算法", duration: 60 }),
              new UTSJSONObject({ title: "动态规划", duration: 90 })
            ]
          })
        ],
        resources: [
          new UTSJSONObject({ name: "数据结构图解.pdf" }),
          new UTSJSONObject({ name: "算法练习题.zip" }),
          new UTSJSONObject({ name: "编程实践案例.docx" })
        ]
      })
    });
    const getStatusText = (status = null) => {
      const statusMap = new UTSJSONObject({
        ongoing: "进行中",
        upcoming: "即将开始",
        completed: "已结束"
      });
      return statusMap[status] || "";
    };
    const changeDetailTab = (e = null) => {
      currentTab.value = e.currentIndex;
    };
    const downloadResource = (resource = null) => {
      common_vendor.index.showToast({
        title: `正在下载: ${resource.name}`,
        icon: "none"
      });
    };
    const startLearning = () => {
      common_vendor.index.showToast({
        title: "即将进入学习页面",
        icon: "none"
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad((options = null) => {
      const id = options.id;
      course.value = mockCourses[id] || new UTSJSONObject({});
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_assets._imports_0$1,
        b: common_vendor.t(course.value.name),
        c: common_vendor.t(course.value.teacher),
        d: common_vendor.t(getStatusText(course.value.status)),
        e: common_vendor.n(course.value.status),
        f: common_vendor.t(course.value.time),
        g: common_vendor.p(new UTSJSONObject({
          value: course.value.rating,
          disabled: true,
          size: "14"
        })),
        h: common_vendor.t(course.value.rating),
        i: course.value.progress,
        j: common_vendor.t(course.value.progress),
        k: common_vendor.o(changeDetailTab),
        l: common_vendor.p(new UTSJSONObject({
          current: currentTab.value,
          values: detailTabs
        })),
        m: currentTab.value === 0
      }), currentTab.value === 0 ? new UTSJSONObject({
        n: common_vendor.t(course.value.introduction || "暂无课程介绍")
      }) : new UTSJSONObject({}), new UTSJSONObject({
        o: currentTab.value === 1
      }), currentTab.value === 1 ? new UTSJSONObject({
        p: common_vendor.f(course.value.syllabus, (chapter = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(chapter.title),
            b: common_vendor.f(chapter.lessons, (lesson = null, i = null, i1 = null) => {
              return new UTSJSONObject({
                a: common_vendor.t(lesson.title),
                b: common_vendor.t(lesson.duration),
                c: i
              });
            }),
            c: index
          });
        })
      }) : new UTSJSONObject({}), new UTSJSONObject({
        q: currentTab.value === 2
      }), currentTab.value === 2 ? new UTSJSONObject({
        r: common_vendor.f(course.value.resources, (resource = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(resource.name),
            b: common_vendor.o(($event = null) => {
              return downloadResource(resource);
            }, index),
            c: index
          });
        })
      }) : new UTSJSONObject({}), new UTSJSONObject({
        s: common_vendor.o(startLearning),
        t: common_vendor.o(goBack),
        v: common_vendor.sei(_ctx.virtualHostId, "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course_detail.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/student`;
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url,
      data: options.data,
      method: options.method || "GET",
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const getStudentProfile = () => {
  return request({
    url: `${API_PREFIX}/profile`
  });
};
const updateStudentProfile = (profileData) => {
  return request({
    url: `${API_PREFIX}/profile`,
    method: "PUT",
    data: profileData
  });
};
const getEnrolledCourses = (params = {}) => {
  return request({
    url: `${API_PREFIX}/courses/enrolled`,
    data: params
  });
};
const getLearningProgress = (courseId) => {
  return request({
    url: `${API_PREFIX}/courses/${courseId}/progress`
  });
};
const student = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getEnrolledCourses,
  getLearningProgress,
  getStudentProfile,
  updateStudentProfile
}, Symbol.toStringTag, { value: "Module" }));
exports.student = student;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/student.api.js.map

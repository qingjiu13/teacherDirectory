"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/courses`;
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
const getCourses = (params = {}) => {
  return request({
    url: `${API_PREFIX}`,
    data: params
  });
};
const getCourseDetails = (courseId) => {
  return request({
    url: `${API_PREFIX}/${courseId}`
  });
};
const getCourseChapters = (courseId) => {
  return request({
    url: `${API_PREFIX}/${courseId}/chapters`
  });
};
const getCourseReviews = (courseId, params = {}) => {
  return request({
    url: `${API_PREFIX}/${courseId}/reviews`,
    data: params
  });
};
const submitCourseReview = (courseId, reviewData) => {
  return request({
    url: `${API_PREFIX}/${courseId}/reviews`,
    method: "POST",
    data: reviewData
  });
};
const course = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCourseChapters,
  getCourseDetails,
  getCourseReviews,
  getCourses,
  submitCourseReview
}, Symbol.toStringTag, { value: "Module" }));
exports.course = course;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/course.api.js.map

"use strict";
const PAGE_INDEX = "index";
const PAGE_MESSAGE = "message";
const PAGE_PUBLISH = "publish";
const PAGE_MINE = "mine";
const PAGE_AI_SELECTION = "ai_selection";
const pageMap = {
  [PAGE_INDEX]: "/pages/index/index",
  [PAGE_MESSAGE]: "/pages/message/message",
  [PAGE_PUBLISH]: "/pages/publish/publish",
  [PAGE_MINE]: "/pages/mine/mine",
  [PAGE_AI_SELECTION]: "/pages/ai/selection/selection"
};
const aiSelectionApis = {
  // 获取学校列表
  getSchools: "getSchools",
  // 获取本科专业列表（简单字符串数组）
  getUndergraduateMajors: "getUndergraduateMajors",
  // 获取研究生专业列表（包含编号和类别）
  getGraduateMajors: "getGraduateMajors",
  // 获取专业列表（旧接口，为保持兼容）
  getMajors: "getMajors",
  // 保存分析请求
  saveAnalysisRequest: "saveAnalysisRequest",
  // 开始分析
  startAnalysis: "startAnalysis",
  // 获取分析结果
  getSchoolAnalysis: "getSchoolAnalysis"
};
exports.aiSelectionApis = aiSelectionApis;
exports.pageMap = pageMap;
//# sourceMappingURL=../.sourcemap/mp-weixin/config.js.map

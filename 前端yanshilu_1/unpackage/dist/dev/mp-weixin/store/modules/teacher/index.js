"use strict";
const store_modules_teacher_state = require("./state.js");
const store_modules_teacher_mutations = require("./mutations.js");
const store_modules_teacher_actions = require("./actions.js");
const store_modules_teacher_getters = require("./getters.js");
const teacher = {
  namespaced: true,
  state: store_modules_teacher_state.state,
  mutations: store_modules_teacher_mutations.mutations,
  actions: store_modules_teacher_actions.actions,
  getters: store_modules_teacher_getters.getters
};
exports.teacher = teacher;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/index.js.map

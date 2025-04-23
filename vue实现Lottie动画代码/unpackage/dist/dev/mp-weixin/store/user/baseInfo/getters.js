"use strict";
const getters = {
  /**
   * @description 获取用户ID
   * @param {Object} state - 当前状态
   * @returns {string} 用户ID
   */
  userId: (state) => state.id,
  /**
   * @description 获取用户头像
   * @param {Object} state - 当前状态
   * @returns {string} 用户头像URL
   */
  avatar: (state) => state.avatar,
  /**
   * @description 获取用户名称
   * @param {Object} state - 当前状态
   * @returns {string} 用户名称
   */
  name: (state) => state.name,
  /**
   * @description 获取用户角色
   * @param {Object} state - 当前状态
   * @returns {string} 用户角色
   */
  userRole: (state) => state.userInfo.role,
  /**
   * @description 判断用户是否为教师
   * @param {Object} state - 当前状态
   * @returns {boolean} 是否为教师
   */
  isTeacher: (state) => state.userInfo.role === "teacher",
  /**
   * @description 获取完整用户信息（适用于表单展示）
   * @param {Object} state - 当前状态
   * @returns {Object} 完整用户信息对象
   */
  profile: (state) => {
    return {
      id: state.id,
      avatar: state.avatar,
      nickname: state.name,
      gender: state.gender,
      introduction: state.selfIntroduction,
      wechat: state.wechatNumber,
      phone: state.phoneNumber,
      password: state.password,
      role: state.userInfo.role,
      // 扩展信息
      certificate: state.userInfo.certificate,
      school: state.userInfo.school,
      major: state.userInfo.major,
      targetSchool: state.userInfo.targetSchool,
      targetMajor: state.userInfo.targetMajor,
      studentGrade: state.userInfo.studentGrade,
      teacherGrade: state.userInfo.teacherGrade,
      teacherScore: state.userInfo.teacherScore
    };
  }
};
exports.getters = getters;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/getters.js.map

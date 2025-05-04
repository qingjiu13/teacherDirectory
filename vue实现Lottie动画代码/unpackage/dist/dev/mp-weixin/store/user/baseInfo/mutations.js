"use strict";
const common_vendor = require("../../../common/vendor.js");
const mutations = {
  /**
   * 更新用户角色
   * @param {Object} state - 当前状态
   * @param {string} role - 新的用户角色（学生或老师）
   */
  updateRole(state, role) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:13", "updateRole mutation执行, 参数:", role);
    state.userInfo.role = role === "teacher" ? "老师" : "学生";
    common_vendor.index.setStorageSync("userBaseInfo", JSON.stringify({
      id: state.id,
      avatar: state.avatar,
      name: state.name,
      gender: state.gender,
      selfIntroduction: state.selfIntroduction,
      wechatNumber: state.wechatNumber,
      phoneNumber: state.phoneNumber,
      role
      // 保存角色代码
    }));
    common_vendor.index.setStorageSync("userRole", role);
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:31", "角色更新完成, 新角色:", state.userInfo.role);
  },
  /**
   * 设置用户完整信息
   * @param {Object} state - 当前状态
   * @param {Object} userData - 服务器返回的用户信息
   */
  SET_USER_INFO(state, userData) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:40", "SET_USER_INFO mutation执行, 入参:", userData);
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:41", "更新前state:", {
      id: state.id,
      name: state.name,
      avatar: state.avatar
    });
    state.id = userData.id || "";
    state.avatar = userData.avatar || "";
    state.name = userData.nickname || userData.name || "";
    state.gender = userData.gender || "";
    state.selfIntroduction = userData.introduction || userData.selfIntroduction || "";
    state.wechatNumber = userData.wechat || userData.wechatNumber || "";
    state.phoneNumber = userData.phone || userData.phoneNumber || "";
    state.password = userData.password || "";
    const roleCode = userData.role || "student";
    if (userData.userInfo) {
      state.userInfo = {
        ...state.userInfo,
        ...userData.userInfo
      };
      if (!userData.userInfo.role || userData.userInfo.role === roleCode) {
        state.userInfo.role = roleCode === "teacher" ? "老师" : "学生";
      }
    } else {
      state.userInfo.role = roleCode === "teacher" ? "老师" : "学生";
    }
    common_vendor.index.setStorageSync("userBaseInfo", JSON.stringify({
      id: state.id,
      avatar: state.avatar,
      name: state.name,
      gender: state.gender,
      selfIntroduction: state.selfIntroduction,
      wechatNumber: state.wechatNumber,
      phoneNumber: state.phoneNumber,
      role: roleCode
    }));
    common_vendor.index.setStorageSync("userRole", roleCode);
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:91", "更新后state:", {
      id: state.id,
      name: state.name,
      avatar: state.avatar,
      role: state.userInfo.role
    });
  },
  /**
   * 更新用户个人信息
   * @param {Object} state - 当前状态
   * @param {Object} userInfo - 用户个人信息对象
   * @param {string} userInfo.avatar - 用户头像
   * @param {string} userInfo.name - 用户姓名
   * @param {string} userInfo.gender - 用户性别
   * @param {string} userInfo.selfIntroduction - 用户自我介绍
   * @param {string} userInfo.wechatNumber - 用户微信号
   * @param {string} userInfo.phoneNumber - 用户手机号
   * @param {string} userInfo.password - 用户密码
   */
  UPDATE_USER_INFO(state, userInfo) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:112", "UPDATE_USER_INFO mutation执行, 入参:", userInfo);
    const {
      avatar,
      name,
      nickname,
      gender,
      selfIntroduction,
      introduction,
      wechatNumber,
      wechat,
      phoneNumber,
      phone,
      password,
      role
    } = userInfo;
    if (avatar !== void 0)
      state.avatar = avatar;
    if (name !== void 0)
      state.name = name;
    if (nickname !== void 0)
      state.name = nickname;
    if (gender !== void 0)
      state.gender = gender;
    if (selfIntroduction !== void 0)
      state.selfIntroduction = selfIntroduction;
    if (introduction !== void 0)
      state.selfIntroduction = introduction;
    if (wechatNumber !== void 0)
      state.wechatNumber = wechatNumber;
    if (wechat !== void 0)
      state.wechatNumber = wechat;
    if (phoneNumber !== void 0)
      state.phoneNumber = phoneNumber;
    if (phone !== void 0)
      state.phoneNumber = phone;
    if (password !== void 0)
      state.password = password;
    if (role !== void 0) {
      state.userInfo.role = role === "teacher" ? "老师" : "学生";
      common_vendor.index.setStorageSync("userRole", role);
    }
    common_vendor.index.setStorageSync("userBaseInfo", JSON.stringify({
      id: state.id,
      avatar: state.avatar,
      name: state.name,
      gender: state.gender,
      selfIntroduction: state.selfIntroduction,
      wechatNumber: state.wechatNumber,
      phoneNumber: state.phoneNumber,
      role: common_vendor.index.getStorageSync("userRole") || "student"
    }));
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:162", "更新后state:", {
      id: state.id,
      name: state.name,
      avatar: state.avatar
    });
  },
  /**
   * 更新用户个人档案（UPDATE_USER_INFO的别名，用于modify.vue页面）
   * @param {Object} state - 当前状态
   * @param {Object} profileData - 用户个人档案数据
   */
  UPDATE_USER_PROFILE(state, profileData) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:175", "UPDATE_USER_PROFILE mutation执行, 入参:", profileData);
    this.commit("user/baseInfo/UPDATE_USER_INFO", profileData);
    common_vendor.index.$emit("userProfileUpdated", {
      timestamp: Date.now(),
      data: profileData
    });
  },
  /**
   * 清除用户信息（用于登出）
   * @param {Object} state - 当前状态
   */
  CLEAR_USER_INFO(state) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:192", "CLEAR_USER_INFO mutation执行");
    state.id = "";
    state.avatar = "";
    state.name = "";
    state.gender = "";
    state.selfIntroduction = "";
    state.wechatNumber = "";
    state.phoneNumber = "";
    state.password = "";
    const currentRole = state.userInfo.role;
    state.userInfo = {
      certificate: 0,
      role: currentRole,
      // 保留当前角色
      school: "",
      major: "",
      targetSchool: "",
      targetMajor: "",
      studentGrade: "",
      teacherGrade: "",
      teacherScore: 0
    };
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:218", "清除后state:", {
      id: state.id,
      name: state.name,
      avatar: state.avatar,
      role: state.userInfo.role
    });
  },
  /**
   * 更新用户扩展信息
   * @param {Object} state - 当前模块状态
   * @param {Object} userInfoData - 用户扩展信息
   */
  UPDATE_USER_INFO_DATA(state, userInfoData) {
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:232", "UPDATE_USER_INFO_DATA mutation执行, 入参:", userInfoData);
    state.userInfo = {
      ...state.userInfo,
      ...userInfoData
    };
    common_vendor.index.setStorageSync("userInfoData", JSON.stringify(state.userInfo));
    common_vendor.index.__f__("log", "at store/user/baseInfo/mutations.js:243", "更新后userInfo:", state.userInfo);
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/mutations.js.map

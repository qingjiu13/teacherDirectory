"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_baseInfo_mockData = require("./mock-data.js");
const login = async (data) => {
  try {
    await store_user_baseInfo_mockData.delay(500);
    const user = store_user_baseInfo_mockData.mockUsers.find(
      (user2) => user2.username === data.username && user2.password === data.password
    );
    if (user) {
      return store_user_baseInfo_mockData.mockApiResponse(true, {
        userId: user.id,
        role: user.role,
        message: "登录成功"
      });
    } else {
      return store_user_baseInfo_mockData.mockApiResponse(false, null, {
        message: "用户名或密码错误"
      });
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/baseInfo/mock-api.js:41", "模拟登录失败:", error);
    return store_user_baseInfo_mockData.mockApiResponse(false, null, {
      message: "登录请求失败"
    });
  }
};
const getUserInfo = async () => {
  try {
    await store_user_baseInfo_mockData.delay(300);
    const userId = common_vendor.index.getStorageSync("userId");
    if (!userId) {
      return store_user_baseInfo_mockData.mockApiResponse(true, store_user_baseInfo_mockData.DEFAULT_USER_INFO);
    }
    const user = store_user_baseInfo_mockData.mockUsers.find((user2) => user2.id === userId);
    if (user) {
      return store_user_baseInfo_mockData.mockApiResponse(true, { ...user });
    } else {
      common_vendor.index.removeStorageSync("userId");
      common_vendor.index.removeStorageSync("user-token");
      return store_user_baseInfo_mockData.mockApiResponse(true, store_user_baseInfo_mockData.DEFAULT_USER_INFO);
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/baseInfo/mock-api.js:76", "模拟获取用户信息失败:", error);
    return store_user_baseInfo_mockData.mockApiResponse(false, null, {
      message: "获取用户信息失败"
    });
  }
};
const updateUserInfo = async (userInfo) => {
  try {
    await store_user_baseInfo_mockData.delay(400);
    const userId = common_vendor.index.getStorageSync("userId");
    if (!userId) {
      return store_user_baseInfo_mockData.mockApiResponse(false, null, {
        message: "用户未登录"
      });
    }
    const userIndex = store_user_baseInfo_mockData.mockUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      store_user_baseInfo_mockData.mockUsers[userIndex] = {
        ...store_user_baseInfo_mockData.mockUsers[userIndex],
        ...userInfo,
        // 处理不同字段名的映射
        nickname: userInfo.name || userInfo.nickname || store_user_baseInfo_mockData.mockUsers[userIndex].nickname,
        name: userInfo.nickname || userInfo.name || store_user_baseInfo_mockData.mockUsers[userIndex].name,
        introduction: userInfo.selfIntroduction || userInfo.introduction || store_user_baseInfo_mockData.mockUsers[userIndex].introduction,
        selfIntroduction: userInfo.introduction || userInfo.selfIntroduction || store_user_baseInfo_mockData.mockUsers[userIndex].selfIntroduction,
        wechat: userInfo.wechatNumber || userInfo.wechat || store_user_baseInfo_mockData.mockUsers[userIndex].wechat,
        wechatNumber: userInfo.wechat || userInfo.wechatNumber || store_user_baseInfo_mockData.mockUsers[userIndex].wechatNumber,
        phone: userInfo.phoneNumber || userInfo.phone || store_user_baseInfo_mockData.mockUsers[userIndex].phone,
        phoneNumber: userInfo.phone || userInfo.phoneNumber || store_user_baseInfo_mockData.mockUsers[userIndex].phoneNumber
      };
      if (userInfo.role) {
        store_user_baseInfo_mockData.mockUsers[userIndex].userInfo.role = userInfo.role === "teacher" ? "老师" : "学生";
      }
      return store_user_baseInfo_mockData.mockApiResponse(true, {
        message: "用户信息更新成功",
        userInfo: store_user_baseInfo_mockData.mockUsers[userIndex]
      });
    } else {
      return store_user_baseInfo_mockData.mockApiResponse(false, null, {
        message: "用户不存在"
      });
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/baseInfo/mock-api.js:134", "模拟更新用户信息失败:", error);
    return store_user_baseInfo_mockData.mockApiResponse(false, null, {
      message: "更新用户信息失败"
    });
  }
};
const updateRole = async (role) => {
  try {
    await store_user_baseInfo_mockData.delay(200);
    const userId = common_vendor.index.getStorageSync("userId");
    if (!userId) {
      return store_user_baseInfo_mockData.mockApiResponse(false, null, {
        message: "用户未登录"
      });
    }
    const userIndex = store_user_baseInfo_mockData.mockUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      store_user_baseInfo_mockData.mockUsers[userIndex].role = role;
      store_user_baseInfo_mockData.mockUsers[userIndex].userInfo.role = role === "teacher" ? "老师" : "学生";
      return store_user_baseInfo_mockData.mockApiResponse(true, {
        message: "角色更新成功",
        role
      });
    } else {
      return store_user_baseInfo_mockData.mockApiResponse(false, null, {
        message: "用户不存在"
      });
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/baseInfo/mock-api.js:176", "模拟更新用户角色失败:", error);
    return store_user_baseInfo_mockData.mockApiResponse(false, null, {
      message: "更新用户角色失败"
    });
  }
};
const mockApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getUserInfo,
  login,
  updateRole,
  updateUserInfo
}, Symbol.toStringTag, { value: "Module" }));
exports.mockApi = mockApi;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/mock-api.js.map

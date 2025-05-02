"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const components_combobox_graduate_school_major = require("../../components/combobox/graduate_school_major.js");
const components_combobox_undergraduate = require("../../components/combobox/undergraduate.js");
const ____ = require("../../本科专业.js");
const ChoiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  onPageScroll() {
    common_vendor.index.$emit("page-scroll");
  },
  components: {
    ChoiceSelected
  },
  onLoad() {
    this.loadUniversityData();
    this.initSchoolAndMajorSearch();
    this.initUserInfo();
  },
  data() {
    return {
      formData: new UTSJSONObject({
        nickname: "",
        avatar: "/static/image/tab-bar/default_avatar.png",
        schoolIndex: -1,
        majorIndex: -1,
        targetSchoolIndex: -1,
        targetMajorIndex: -1,
        gradeIndex: -1,
        targetSchool: "",
        targetMajor: ""
        // 目标专业值
      }),
      schoolList: [],
      majorList: [],
      targetSchoolList: [],
      targetMajorList: [],
      allGradeList: ["大一", "大二", "大三", "大四", "研一", "研二", "研三"],
      showAgreementModal: false,
      pendingUserInfo: null,
      // 分离筛选器状态
      graduateStore: null,
      schoolStore: null,
      majorStore: null,
      token: "",
      userId: ""
      // 用户ID
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapState("user/baseInfo", new UTSJSONObject({
    userRole: (state = null) => {
      return state.userInfo.role;
    },
    userSchool: (state = null) => {
      return state.userInfo.school;
    },
    userMajor: (state = null) => {
      return state.userInfo.major;
    },
    userTargetSchool: (state = null) => {
      return state.userInfo.targetSchool;
    },
    userTargetMajor: (state = null) => {
      return state.userInfo.targetMajor;
    },
    userStudentGrade: (state = null) => {
      return state.userInfo.studentGrade;
    },
    userTeacherGrade: (state = null) => {
      return state.userInfo.teacherGrade;
    }
  }))), {
    /**
     * 根据用户角色筛选年级列表
     * @returns {Array} 筛选后的年级列表
     */
    gradeList() {
      if (this.userRole === "老师") {
        return this.allGradeList.filter((grade) => {
          return grade.includes("研");
        });
      } else {
        return this.allGradeList.filter((grade) => {
          return grade.includes("大");
        });
      }
    },
    /**
     * @description 获取过滤后的目标学校列表
     * @returns {Array} 过滤后的目标学校列表
     */
    filteredTargetSchoolList() {
      if (!this.graduateStore)
        return [];
      return components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    /**
     * @description 获取过滤后的目标专业列表
     * @returns {Array} 过滤后的目标专业列表
     */
    filteredTargetMajorList() {
      if (!this.graduateStore)
        return [];
      return components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(this.graduateStore);
    },
    /**
     * @description 获取过滤后的本科学校列表
     * @returns {Array} 过滤后的本科学校列表
     */
    filteredSchoolList() {
      if (!this.schoolStore)
        return [];
      return this.schoolStore.getters.filteredData(this.schoolStore.state);
    }
  })),
  methods: Object.assign(Object.assign({}, common_vendor.mapMutations("user/baseInfo", ["UPDATE_USER_INFO", "SET_USER_INFO"])), {
    /**
     * @description 初始化用户信息
     */
    initUserInfo() {
      this.token = common_vendor.index.getStorageSync("token") || "";
      this.userId = common_vendor.index.getStorageSync("userId") || "";
      if (!this.token) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          complete: () => {
            setTimeout(() => {
              router_Router.Navigator.redirectTo("/pages/login/wechat_login");
            }, 1500);
          }
        });
        return null;
      }
      const storedNickname = common_vendor.index.getStorageSync("nickname") || "";
      const storedAvatar = common_vendor.index.getStorageSync("avatar") || "";
      if (storedNickname) {
        this.formData.nickname = storedNickname;
      }
      if (storedAvatar) {
        this.formData.avatar = storedAvatar;
      }
      this.fetchUserProfile();
    },
    /**
     * @description 从后端获取用户信息
     */
    fetchUserProfile() {
      if (!this.token || !this.userId)
        return null;
      common_vendor.index.request({
        url: `http://localhost:8080/users/profile/${this.userId}`,
        method: "GET",
        header: new UTSJSONObject({
          "Authorization": `Bearer ${this.token}`
        }),
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            const userData = res.data;
            if (userData.nickname) {
              this.formData.nickname = userData.nickname;
              common_vendor.index.setStorageSync("nickname", userData.nickname);
            }
            if (userData.avatar) {
              this.formData.avatar = userData.avatar;
              common_vendor.index.setStorageSync("avatar", userData.avatar);
            }
            this.SET_USER_INFO(new UTSJSONObject({
              id: userData.id || this.userId,
              name: userData.nickname || this.formData.nickname,
              avatar: userData.avatar || this.formData.avatar,
              isRegistered: 1
            }));
            common_vendor.index.__f__("log", "at pages/login/login_detail.vue:342", "用户信息已更新");
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:346", "获取用户信息失败", err);
        }
      });
    },
    /**
     * @description 上传头像
     */
    uploadAvatar() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          this.formData.avatar = tempFilePaths[0];
          setTimeout(() => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "头像已更新",
              icon: "success"
            });
            common_vendor.index.setStorageSync("avatar", tempFilePaths[0]);
          }, 1e3);
        }
      }));
    },
    /**
     * @description 初始化学校和专业搜索引擎
     */
    initSchoolAndMajorSearch() {
      this.schoolStore = components_combobox_undergraduate.createDataModule(____.schoolData);
      this.majorStore = components_combobox_undergraduate.createDataModule(____.majorData);
      this.schoolStore.actions.initSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }));
      this.majorStore.actions.initSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }));
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
    },
    /**
     * @description 处理学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleSchoolSelect(index = null, school = null) {
      this.formData.schoolIndex = index;
    },
    /**
     * @description 处理专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleMajorSelect(index = null, major = null) {
      this.formData.majorIndex = index;
    },
    /**
     * @description 处理目标学校选择 - 级联选择的父项
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleTargetSchoolSelect(index = null, school = null) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }), school);
      this.resetMajorSelection();
    },
    /**
     * @description 处理目标专业选择 - 级联选择的子项
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleTargetMajorSelect(index = null, major = null) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
    },
    /**
     * @description 处理年级选择
     * @param {Number} index - 选择的索引
     */
    handleGradeSelect(index = null) {
      this.formData.gradeIndex = index;
    },
    /**
     * @description 处理学校搜索输入 - 使用本科学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword = null) {
      this.schoolStore.actions.updateFilterKeyword(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }), keyword);
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:484", `学校搜索: "${keyword}", 结果数: ${this.schoolList.length}`);
    },
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword = null) {
      this.majorStore.actions.updateFilterKeyword(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }), keyword);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:503", `专业搜索: "${keyword}", 结果数: ${this.majorList.length}`);
    },
    /**
     * @description 处理目标学校搜索输入 - 使用研究生学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:511", "处理学校搜索:", keyword);
      if (!keyword || keyword.trim() === "") {
        const allSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = allSchools;
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:517", "关键词为空，显示前50所学校");
        return null;
      }
      if (!this.graduateStore.schoolFuse) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:523", "Fuse搜索引擎未初始化，强制重新初始化中...");
        components_combobox_graduate_school_major.GraduateStore.actions.reinitializeSearch(new UTSJSONObject({
          commit: (mutation = null, payload = null) => {
            components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
          },
          state: this.graduateStore
        }));
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setSchoolKeyword(this.graduateStore, keyword);
      const filteredSchools = components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(this.graduateStore);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:538", "过滤后的学校列表:", filteredSchools);
      this.targetSchoolList = filteredSchools;
      this.$nextTick(() => {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:546", `最终显示学校数量: ${filteredSchools.length}`);
        if (this.$refs.targetSchoolDropdown) {
          this.$refs.targetSchoolDropdown.$forceUpdate();
        }
      });
    },
    /**
     * @description 处理目标专业搜索输入 - 使用研究生专业搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:560", "处理专业搜索:", keyword);
      if (!this.graduateStore.selectedSchool) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:564", "未选择学校，专业搜索无效");
        return null;
      }
      if (!keyword || keyword.trim() === "") {
        const allMajors = this.graduateStore.schools[this.graduateStore.selectedSchool] || [];
        this.targetMajorList = allMajors.slice(0, 20);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:572", "关键词为空，显示前20个专业");
        return null;
      }
      if (!this.graduateStore.majorFuse) {
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:578", "专业搜索引擎未初始化，重新初始化中...");
        components_combobox_graduate_school_major.GraduateStore.mutations.setSelectedSchool(this.graduateStore, this.graduateStore.selectedSchool);
      }
      components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(this.graduateStore, keyword);
      const filteredMajors = components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(this.graduateStore);
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:588", "过滤后的专业列表:", filteredMajors);
      this.targetMajorList = filteredMajors;
      this.$nextTick(() => {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:596", `最终显示专业数量: ${filteredMajors.length}`);
        if (this.$refs.targetMajorDropdown) {
          this.$refs.targetMajorDropdown.$forceUpdate();
        }
      });
    },
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      const dropdowns = ["schoolDropdown", "majorDropdown", "targetSchoolDropdown", "targetMajorDropdown"];
      dropdowns.forEach((dropdown) => {
        if (this.$refs && this.$refs[dropdown]) {
          this.$refs[dropdown].closeDropdown && this.$refs[dropdown].closeDropdown();
        }
      });
    },
    /**
     * @description 加载大学数据
     */
    loadUniversityData() {
      try {
        this.initGraduateData();
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:625", "成功加载学校数据");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:627", "加载大学数据失败:", error);
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.schoolList = defaultSchools;
        this.targetSchoolList = defaultSchools;
        common_vendor.index.showToast({
          title: "加载大学数据失败，使用默认列表",
          icon: "none"
        });
      }
    },
    /**
     * @description 关闭协议确认浮窗
     */
    closeModal() {
      this.showAgreementModal = false;
      this.pendingUserInfo = null;
    },
    /**
     * @description 确认同意协议并提交信息
     */
    confirmAgreement() {
      if (this.pendingUserInfo) {
        this.UPDATE_USER_INFO(this.pendingUserInfo);
        this.submitToBackend(this.pendingUserInfo);
        common_vendor.index.setStorageSync("nickname", this.pendingUserInfo.userInfo.nickname);
        common_vendor.index.setStorageSync("avatar", this.pendingUserInfo.userInfo.avatar);
        common_vendor.index.showToast({
          title: "信息保存成功",
          icon: "success"
        });
        this.showAgreementModal = false;
        setTimeout(() => {
          router_Router.Navigator.toMine();
        }, 1500);
      }
    },
    /**
     * @description 提交表单信息
     */
    submitForm() {
      try {
        if (!this.formData.nickname.trim()) {
          common_vendor.index.showToast({
            title: "请输入昵称",
            icon: "none"
          });
          return null;
        }
        const currentRole = this.userRole;
        const userInfo = new UTSJSONObject({
          // 顶级字段更新
          id: this.userId || common_vendor.index.getStorageSync("userId"),
          name: this.formData.nickname,
          avatar: this.formData.avatar,
          isRegistered: 1,
          userInfo: new UTSJSONObject({
            // 保留证书状态
            certificate: this.$store.state.user.baseInfo.userInfo.certificate,
            role: currentRole,
            school: this.formData.schoolIndex >= 0 ? this.schoolList[this.formData.schoolIndex] : this.userSchool,
            major: this.formData.majorIndex >= 0 ? this.majorList[this.formData.majorIndex] : this.userMajor,
            studentGrade: currentRole === "学生" && this.formData.gradeIndex >= 0 ? this.gradeList[this.formData.gradeIndex] : this.userStudentGrade,
            teacherGrade: currentRole === "老师" && this.formData.gradeIndex >= 0 ? this.gradeList[this.formData.gradeIndex] : this.userTeacherGrade,
            // 保留原有的考研成绩
            teacherScore: this.$store.state.user.baseInfo.userInfo.teacherScore,
            // 新增昵称和头像
            nickname: this.formData.nickname,
            avatar: this.formData.avatar
          })
        });
        if (currentRole === "学生") {
          userInfo.userInfo.targetSchool = this.formData.targetSchool || this.userTargetSchool;
          userInfo.userInfo.targetMajor = this.formData.targetMajor || this.userTargetMajor;
        }
        if (currentRole === "老师") {
          this.pendingUserInfo = userInfo;
          this.showAgreementModal = true;
          return null;
        }
        this.UPDATE_USER_INFO(userInfo);
        this.submitToBackend(userInfo);
        common_vendor.index.setStorageSync("nickname", this.formData.nickname);
        common_vendor.index.setStorageSync("avatar", this.formData.avatar);
        common_vendor.index.showToast({
          title: "信息保存成功",
          icon: "success"
        });
        setTimeout(() => {
          router_Router.Navigator.toIndex();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:760", "提交表单时出错:", error);
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * @description 提交用户信息到后端
     * @param {Object} userInfo - 用户信息对象
     */
    submitToBackend(userInfo = null) {
      if (!this.token) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:775", "没有token，无法提交用户信息");
        return null;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      const submitData = new UTSJSONObject({
        id: userInfo.id,
        nickname: userInfo.userInfo.nickname,
        name: userInfo.name,
        avatar: userInfo.avatar,
        school: userInfo.userInfo.school,
        major: userInfo.userInfo.major,
        grade: userInfo.userInfo.role === "学生" ? userInfo.userInfo.studentGrade : userInfo.userInfo.teacherGrade
      });
      if (userInfo.userInfo.role === "学生") {
        submitData.targetSchool = userInfo.userInfo.targetSchool;
        submitData.targetMajor = userInfo.userInfo.targetMajor;
      }
      common_vendor.index.request({
        url: "http://localhost:8080/users/profile/update",
        method: "POST",
        header: new UTSJSONObject({
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }),
        data: submitData,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login_detail.vue:811", "用户信息提交成功", res);
          common_vendor.index.hideLoading();
          if (res.data && res.data.user) {
            const user = res.data.user;
            const updateData = new UTSJSONObject({
              id: user.id || userInfo.id,
              name: user.name || userInfo.name,
              avatar: user.avatar || userInfo.avatar
            });
            this.UPDATE_USER_INFO(updateData);
            common_vendor.index.setStorageSync("userId", updateData.id);
            common_vendor.index.setStorageSync("nickname", updateData.name);
            common_vendor.index.setStorageSync("avatar", updateData.avatar);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:835", "用户信息提交失败", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "网络异常，信息已本地保存",
            icon: "none"
          });
        }
      });
    },
    /**
     * @description 验证表单内容 - 所有字段均为选填，无需验证
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      return true;
    },
    /**
     * @description 初始化考研数据
     */
    initGraduateData() {
      try {
        this.graduateStore = UTS.JSON.parse(UTS.JSON.stringify(components_combobox_graduate_school_major.GraduateStore.state));
        if (!this.graduateStore.schools) {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:864", "研究生学校数据不完整");
          throw new Error("学校数据结构不完整");
        }
        components_combobox_graduate_school_major.GraduateStore.mutations.initSchoolFuse(this.graduateStore);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:870", "Fuse引擎初始化状态:", !!this.graduateStore.schoolFuse);
        if (this.graduateStore.schoolFuse) {
          common_vendor.index.__f__("log", "at pages/login/login_detail.vue:874", "Fuse配置验证:", new UTSJSONObject({
            keys: this.graduateStore.schoolFuse._docs[0] ? Object.keys(this.graduateStore.schoolFuse._docs[0]) : "未知",
            ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
            threshold: this.graduateStore.schoolFuse.options.threshold
          }));
        } else {
          common_vendor.index.__f__("error", "at pages/login/login_detail.vue:880", "Fuse.js搜索引擎初始化失败");
        }
        const graduateSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = graduateSchools;
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:887", "初始化考研数据成功");
        return true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login_detail.vue:890", "初始化考研数据失败:", error);
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.targetSchoolList = defaultSchools;
        return false;
      }
    },
    /**
     * @description 处理学校变更事件
     * @param {String} school - 变更后的学校名称
     */
    handleSchoolChange(school = null) {
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:904", "学校变更事件:", school);
      if (!school) {
        this.resetMajorSelection();
        return null;
      }
      components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }), school);
      if (this.graduateStore.schools[school]) {
        this.targetMajorList = this.graduateStore.schools[school].slice(0, 30);
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:922", `已加载 ${school} 的专业列表，共 ${this.targetMajorList.length} 个`);
      } else {
        this.resetMajorSelection();
        common_vendor.index.__f__("warn", "at pages/login/login_detail.vue:925", `${school} 没有关联的专业数据`);
      }
    },
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = "";
    }
  }),
  // 监听页面显示时更新搜索引擎
  onShow() {
    if (this.graduateStore) {
      components_combobox_graduate_school_major.GraduateStore.actions.reinitializeSearch(new UTSJSONObject({
        commit: (mutation = null, payload = null) => {
          components_combobox_graduate_school_major.GraduateStore.mutations[mutation](this.graduateStore, payload);
        },
        state: this.graduateStore
      }));
      common_vendor.index.__f__("log", "at pages/login/login_detail.vue:949", "Fuse引擎强制重新初始化完成，状态:", !!this.graduateStore.schoolFuse);
      if (this.graduateStore.schoolFuse) {
        common_vendor.index.__f__("log", "at pages/login/login_detail.vue:953", "重新初始化后的Fuse配置:", new UTSJSONObject({
          threshold: this.graduateStore.schoolFuse.options.threshold,
          ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
          items: this.graduateStore.schoolFuse._docs.length
        }));
      }
    }
    if (this.schoolStore && this.majorStore) {
      this.initSchoolAndMajorSearch();
    }
  }
});
if (!Array) {
  const _component_ChoiceSelected = common_vendor.resolveComponent("ChoiceSelected");
  const _component_template = common_vendor.resolveComponent("template");
  (_component_ChoiceSelected + _component_template)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.formData.nickname,
    b: common_vendor.o(($event) => $data.formData.nickname = $event.detail.value),
    c: $data.formData.avatar,
    d: common_vendor.o((...args) => $options.uploadAvatar && $options.uploadAvatar(...args)),
    e: _ctx.userRole === "学生"
  }, _ctx.userRole === "学生" ? {
    f: common_vendor.sr("schoolDropdown", "5ca72b3d-0"),
    g: common_vendor.o($options.handleSchoolSelect),
    h: common_vendor.o($options.handleSchoolSearch),
    i: common_vendor.p({
      componentType: "undergraduate",
      choiceIndex: $data.formData.schoolIndex,
      choiceList: $data.schoolList,
      defaultText: "请选择学校",
      mode: "search",
      searchPlaceholder: "输入学校名称"
    }),
    j: common_vendor.sr("majorDropdown", "5ca72b3d-1"),
    k: common_vendor.o($options.handleMajorSelect),
    l: common_vendor.o($options.handleMajorSearch),
    m: common_vendor.p({
      componentType: "undergraduate",
      choiceIndex: $data.formData.majorIndex,
      choiceList: $data.majorList,
      defaultText: "请选择专业",
      mode: "search",
      searchPlaceholder: "输入专业名称"
    })
  } : {}, {
    n: common_vendor.o($options.handleGradeSelect),
    o: common_vendor.p({
      choiceIndex: $data.formData.gradeIndex,
      choiceList: $options.gradeList,
      defaultText: "请选择年级",
      mode: "select"
    }),
    p: common_vendor.t(_ctx.userRole === "学生" ? "目标学校" : "就读学校"),
    q: common_vendor.sr("targetSchoolDropdown", "5ca72b3d-3"),
    r: common_vendor.o($options.handleTargetSchoolSelect),
    s: common_vendor.o($options.handleTargetSchoolSearch),
    t: common_vendor.o($options.handleSchoolChange),
    v: common_vendor.p({
      componentType: "graduateSchool",
      choiceIndex: $data.formData.targetSchoolIndex,
      choiceList: $data.targetSchoolList,
      defaultText: _ctx.userRole === "学生" ? "请选择目标学校" : "请选择学校",
      mode: "search",
      searchPlaceholder: _ctx.userRole === "学生" ? "输入目标学校名称" : "输入学校名称",
      enablePagination: true,
      pageSize: 10
    }),
    w: common_vendor.t(_ctx.userRole === "学生" ? "目标专业" : "就读专业"),
    x: common_vendor.sr("targetMajorDropdown", "5ca72b3d-4"),
    y: common_vendor.o($options.handleTargetMajorSelect),
    z: common_vendor.o($options.handleTargetMajorSearch),
    A: common_vendor.o($options.resetMajorSelection),
    B: common_vendor.p({
      componentType: "graduateMajor",
      choiceIndex: $data.formData.targetMajorIndex,
      choiceList: $data.targetMajorList,
      parentValue: $data.formData.targetSchool,
      isLinkage: true,
      defaultText: $data.formData.targetSchool ? _ctx.userRole === "学生" ? "请选择专业" : "请选择专业" : "请先选择学校",
      mode: "search",
      searchPlaceholder: _ctx.userRole === "学生" ? "输入目标专业名称" : "输入专业名称",
      enablePagination: true,
      pageSize: 10
    }),
    C: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    D: $data.showAgreementModal
  }, $data.showAgreementModal ? {
    E: common_vendor.o((...args) => $options.confirmAgreement && $options.confirmAgreement(...args)),
    F: common_vendor.o(() => {
    }),
    G: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  } : {}, {
    H: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ca72b3d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login_detail.js.map

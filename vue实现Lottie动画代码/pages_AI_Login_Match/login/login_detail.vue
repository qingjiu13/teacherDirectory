<template>
  <Header :title="'登录详情'" @back="handleBack" class="header-container"/>
	<view class="background-image">
    <image
        src="/static/image/bgPicture/background1.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
    <view class="background-image">
      <image
        src="/static/image/bgPicture/background.png"
        mode="aspectFill" alt="背景图"
      />
  </view>
  <view class="form-container">
          <!-- 表单内容 -->
    <view class="form-card">
      <view class="reminder-outer">
        <view class="reminder-inner">
          <text class="reminder-text">以下信息为选填项，您可以选择填写您想提供的信息</text>
        </view>
      </view>
      <!-- 普通学校和专业筛选框 - 仅学生显示 -->
      <block v-if="userRole === '学生'">
        <!-- School - 使用单输入筛选框 -->
        <view class="form-row">
          <view class="label-container">
            <text class="form-label">就读学校</text>
            <text class="optional-tag">(选填)</text>
          </view>
          <ChoiceSelected
            class="form-select"
            componentType="undergraduate"
            :choiceIndex="formData.schoolIndex"
            :choiceList="schoolList"
            defaultText="请选择学校"
            mode="search"
            searchPlaceholder="输入学校名称"
            @onChoiceClick="handleSchoolSelect"
            @search-input="handleSchoolSearch"
            ref="schoolDropdown"
          />
        </view>
        
        <!-- Major - 使用单输入筛选框 -->
        <view class="form-row">
          <view class="label-container">
            <text class="form-label">就读专业</text>
            <text class="optional-tag">(选填)</text>
          </view>
          <ChoiceSelected
            class="form-select"
            componentType="undergraduate"
            :choiceIndex="formData.majorIndex"
            :choiceList="majorList"
            defaultText="请选择专业"
            mode="search"
            searchPlaceholder="输入专业名称"
            @onChoiceClick="handleMajorSelect"
            @search-input="handleMajorSearch"
            ref="majorDropdown"
          />
        </view>
      </block>

      <!-- Grade -->
      <view class="form-row">
        <view class="label-container">
          <text class="form-label">年级</text>
          <text class="optional-tag">(选填)</text>
        </view>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.gradeIndex"
          :choiceList="gradeList"
          defaultText="请选择年级"
          mode="select"
          @onChoiceClick="handleGradeSelect"
        />
      </view>
      
      <!-- 目标学校和目标专业筛选框 - 学生和老师都显示，但标签有区别 -->
      <block>
          <!-- Target School -->
          <view class="form-row">
            <view class="label-container">
              <text class="form-label">{{ userRole === '学生' ? '目标学校' : '就读学校' }}</text>
              <text class="optional-tag">(选填)</text>
            </view>
            <ChoiceSelected
              class="form-select"
              componentType="graduateSchool"
              :choiceIndex="formData.targetSchoolIndex"
              :choiceList="targetSchoolList"
              :defaultText="userRole === '学生' ? '请选择目标学校' : '请选择学校'"
              mode="search"
              :searchPlaceholder="userRole === '学生' ? '输入目标学校名称' : '输入学校名称'"
              @onChoiceClick="handleTargetSchoolSelect"
              @search-input="handleTargetSchoolSearch"
              @linkage-change="handleSchoolChange"
              :enablePagination="true"
              :pageSize="10"
              ref="targetSchoolDropdown"
            />
          </view>
          
          <!-- Target Major -->
          <view class="form-row">
            <view class="label-container">
              <text class="form-label">{{ userRole === '学生' ? '目标专业' : '就读专业' }}</text>
              <text class="optional-tag">(选填)</text>
            </view>
            <ChoiceSelected
              class="form-select"
              componentType="graduateMajor"
              :choiceIndex="formData.targetMajorIndex"
              :choiceList="targetMajorList"
              :parentValue="formData.targetSchool"
              :isLinkage="true"
              :defaultText="formData.targetSchool ? '请选择专业' : '请先选择学校'"
              mode="search"
              :searchPlaceholder="!formData.targetSchool ? '请先选择学校' : (userRole === '学生' ? '请选择目标专业' : '请选择专业')"
              @onChoiceClick="handleTargetMajorSelect"
              @search-input="handleTargetMajorSearch"
              @reset-selection="resetMajorSelection"
              :enablePagination="true"
              :pageSize="10"
              ref="targetMajorDropdown"
            />
          </view>
      </block>
      <!-- 按钮区域 -->
      <view class="button-container">
        <button class="skip-btn" @click="skipForm">
          <image src="../static/login/skip.png" class="skip-btn-icon"/>
          <text class="btn-text">跳过</text>
        </button>
        <button class="submit-btn" @click="submitForm">
          <image src="../static/login/submit.png" class="submit-btn-icon"/>
          <text class="btn-text">提交</text>
        </button>
      </view>
    </view>

    
    <!-- 老师角色协议确认浮窗 -->
    <view class="modal-overlay" v-if="showAgreementModal" @click.stop="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-title">入驻协议</view>
        <view class="modal-body">
          <view class="agreement-text">
            <view class="agreement-item">就平台入驻涉及的权利和义务与您做出如下约定：</view>
            <view class="agreement-item">1、您知晓并同意，登署本协议即代表您依照本协议公布的规则履行义务并享有权利。</view>
            <view class="agreement-item">2、您同意，申请入驻平台认证老师后按照平台要求提供服务，包括并不限于向平台用户提供线上线下考研咨询及资料服务。</view>
            <view class="agreement-item">3、您同意，入驻平台认证学长通过后，进行线上服务时就服务标准内容进行回复，不得向用户索要用户私人联系方式包括(微信、手机号等)，平台会对站内聊天内容进行监控，若发现违规内容，平台有权进行处理，处理方式包括并不限于限制消息发送、删除消息等，若违规行为次数超过2次，平台有权对您的认证状态进行撤销。</view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="agree-btn" @click="confirmAgreement">我已悉知并同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ChoiceSelected from '/pages_AI_Login_Match/components/combobox/combobox'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { Navigator } from '@/router/Router';
import GraduateStore from '/pages_AI_Login_Match/components/combobox/graduate_school_major.js';
import createDataModule from '/pages_AI_Login_Match/components/combobox/undergraduate.js';
import schoolData from '/pages_AI_Login_Match/static/data/2886所大学.json';
import majorData from '/pages_AI_Login_Match/static/data/本科专业.json';
import Header from '@/components/navigationTitleBar/header';

export default {
  onPageScroll() {
    // 通知所有组件页面已滚动
    uni.$emit('page-scroll');
  },
  components: {
    ChoiceSelected,
    Header
  },
  onLoad() {
    this.loadUniversityData();
    this.initSchoolAndMajorSearch();
    // 加载用户信息
    this.initUserInfo();
  },
  data() {
    return {
      formData: {
        nickname: '', // 用户昵称
        avatar: '/static/image/defaultAvatar/teacher-man.png', // 默认头像
        schoolIndex: -1,
        majorIndex: -1,
        targetSchoolIndex: -1,  // 目标学校索引
        targetMajorIndex: -1,   // 目标专业索引
        gradeIndex: -1,
        targetSchool: '',
        targetMajor: '', // 目标专业值
      },
      schoolList: [], // 普通学校列表
      majorList: [], // 普通专业列表
      targetSchoolList: [], // 目标学校列表（考研）
      targetMajorList: [], // 目标专业列表（考研）
      allGradeList: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
      showAgreementModal: false, // 控制协议浮窗显示
      pendingUserInfo: null, // 暂存待提交的用户信息
      // 分离筛选器状态
      graduateStore: null, // 研究生数据状态
      schoolStore: null, // 本科学校数据状态
      majorStore: null, // 本科专业数据状态
      token: '', // 用户token
      userId: '', // 用户ID
    };
  },
  computed: {
    // 使用mapState映射userInfo相关状态
    ...mapState('user/baseInfo', {
      userRole: state => state.userInfo.role,
      userSchool: state => state.userInfo.school,
      userMajor: state => state.userInfo.major,
      userTargetSchool: state => state.userInfo.targetSchool,
      userTargetMajor: state => state.userInfo.targetMajor,
      userStudentGrade: state => state.userInfo.studentGrade,
      userTeacherGrade: state => state.userInfo.teacherGrade,
    }),
    
    /**
     * 根据用户角色筛选年级列表
     * @returns {Array} 筛选后的年级列表
     */
    gradeList() {
      if (this.userRole === '老师') {
        return this.allGradeList.filter(grade => grade.includes('研'));
      } else {
        return this.allGradeList.filter(grade => grade.includes('大'));
      }
    },
    /**
     * @description 获取过滤后的目标学校列表
     * @returns {Array} 过滤后的目标学校列表
     */
    filteredTargetSchoolList() {
      if (!this.graduateStore) return [];
      return GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    
    /**
     * @description 获取过滤后的目标专业列表
     * @returns {Array} 过滤后的目标专业列表
     */
    filteredTargetMajorList() {
      if (!this.graduateStore) return [];
      return GraduateStore.getters.filteredMajorList(this.graduateStore);
    },

    /**
     * @description 获取过滤后的本科学校列表
     * @returns {Array} 过滤后的本科学校列表
     */
    filteredSchoolList() {
      if (!this.schoolStore) return [];
      return this.schoolStore.getters.filteredData(this.schoolStore.state);
    }
  },
  methods: {
    // 使用mapMutations映射UPDATE_USER_INFO方法
    ...mapMutations('user/baseInfo', ['UPDATE_USER_INFO', 'SET_USER_INFO']),
    handleBack() {
      Navigator.toLogin();
    },
    /**
     * @description 初始化用户信息
     */
    initUserInfo() {
      // 获取token和userId
      this.token = uni.getStorageSync('token') || '';
      this.userId = uni.getStorageSync('userId') || '';
      
      if (!this.token) {
        // 如果没有token，可能需要重新登录
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      // 如果有已存储的用户信息，显示它们
      const storedNickname = uni.getStorageSync('nickname') || '';
      const storedAvatar = uni.getStorageSync('avatar') || '';
      
      if (storedNickname) {
        this.formData.nickname = storedNickname;
      }
      
      if (storedAvatar) {
        this.formData.avatar = storedAvatar;
      }
      
      // 如果需要，可以尝试从后端获取最新的用户信息
      this.fetchUserProfile();
    },
    
    /**
     * @description 从后端获取用户信息
     */
    fetchUserProfile() {
      if (!this.token || !this.userId) return;
      
      uni.request({
        url: `http://localhost:8080/users/profile/${this.userId}`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${this.token}`
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            const userData = res.data;
            
            // 更新表单数据
            if (userData.nickname) {
              this.formData.nickname = userData.nickname;
              uni.setStorageSync('nickname', userData.nickname);
            }
            
            if (userData.avatar) {
              this.formData.avatar = userData.avatar;
              uni.setStorageSync('avatar', userData.avatar);
            }
            
            // 更新Vuex状态
            this.SET_USER_INFO({
              id: userData.id || this.userId,
              name: userData.nickname || this.formData.nickname,
              avatar: userData.avatar || this.formData.avatar,
              isRegistered: 1
            });
            
            console.log('用户信息已更新');
          }
        },
        fail: (err) => {
          console.error('获取用户信息失败', err);
        }
      });
    },
    
    /**
     * @description 上传头像
     */
    uploadAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          
          // 显示加载中
          uni.showLoading({
            title: '上传中...'
          });
          
          // 预览选择的图片
          this.formData.avatar = tempFilePaths[0];
          
          // 真实环境中，这里应该调用上传API
          // 模拟上传完成
          setTimeout(() => {
            uni.hideLoading();
            uni.showToast({
              title: '头像已更新',
              icon: 'success'
            });
            
            // 存储到本地以便下次显示
            uni.setStorageSync('avatar', tempFilePaths[0]);
          }, 1000);
        }
      });
    },
    
    /**
     * @description 初始化学校和专业搜索引擎
     */
    initSchoolAndMajorSearch() {
      // 初始化本科学校数据状态
      this.schoolStore = createDataModule(schoolData);
      
      // 初始化本科专业数据状态
      this.majorStore = createDataModule(majorData);
      
      // 初始化搜索引擎
      this.schoolStore.actions.initSearch({
        commit: (mutation, payload) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      });
      
      this.majorStore.actions.initSearch({
        commit: (mutation, payload) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      });
      
      // 初始填充数据
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
    },

    /**
     * @description 处理学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleSchoolSelect(index, school) {
      this.formData.schoolIndex = index;
    },

    /**
     * @description 处理专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleMajorSelect(index, major) {
      this.formData.majorIndex = index;
    },

    /**
     * @description 处理目标学校选择 - 级联选择的父项
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleTargetSchoolSelect(index, school) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      
      // 更新专业列表的依赖值
      GraduateStore.actions.selectSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 重置专业选择
      this.resetMajorSelection();
    },
    /**
     * @description 处理目标专业选择 - 级联选择的子项
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleTargetMajorSelect(index, major) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
    },
    /**
     * @description 处理年级选择
     * @param {Number} index - 选择的索引
     */
    handleGradeSelect(index) {
      this.formData.gradeIndex = index;
    },
    
    /**
     * @description 处理学校搜索输入 - 使用本科学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword) {
      // 更新学校搜索关键词
      this.schoolStore.actions.updateFilterKeyword({
        commit: (mutation, payload) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }, keyword);
      
      // 获取过滤结果
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      
      // 调试信息
      console.log(`学校搜索: "${keyword}", 结果数: ${this.schoolList.length}`);
    },
    
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword) {
      // 更新专业搜索关键词
      this.majorStore.actions.updateFilterKeyword({
        commit: (mutation, payload) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }, keyword);
      
      // 获取过滤结果
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
      
      // 调试信息
      console.log(`专业搜索: "${keyword}", 结果数: ${this.majorList.length}`);
    },
    
    /**
     * @description 处理目标学校搜索输入 - 使用研究生学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword) {
      console.log('处理学校搜索:', keyword);
      
      // 特殊处理: 如果关键词为空，显示所有学校（但限制数量）
      if (!keyword || keyword.trim() === '') {
        const allSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = allSchools;
        console.log('关键词为空，显示前50所学校');
        return;
      }
      
      // 确保搜索引擎已初始化
      if (!this.graduateStore.schoolFuse) {
        console.warn('Fuse搜索引擎未初始化，强制重新初始化中...');
        // 强制重新初始化搜索引擎，确保搜索质量
        GraduateStore.actions.reinitializeSearch({
          commit: (mutation, payload) => {
            GraduateStore.mutations[mutation](this.graduateStore, payload);
          },
          state: this.graduateStore
        });
      }
      
      // 更新学校搜索关键词
      GraduateStore.mutations.setSchoolKeyword(this.graduateStore, keyword);
      
      // 手动获取过滤结果并更新列表
      const filteredSchools = GraduateStore.getters.filteredSchoolList(this.graduateStore);
      console.log('过滤后的学校列表:', filteredSchools);
      
      // 直接更新目标学校列表，不依赖watch
      this.targetSchoolList = filteredSchools;
      
      // 强制刷新组件
      this.$nextTick(() => {
        // 记录结果数量
        console.log(`最终显示学校数量: ${filteredSchools.length}`);
        
        // 确保下拉框组件刷新
        if (this.$refs.targetSchoolDropdown) {
          this.$refs.targetSchoolDropdown.$forceUpdate();
        }
      });
    },
    
    /**
     * @description 处理目标专业搜索输入 - 使用研究生专业搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword) {
      console.log('处理专业搜索:', keyword);
      
      // 确保当前有选中的学校
      if (!this.graduateStore.selectedSchool) {
        console.warn('未选择学校，专业搜索无效');
        return;
      }
      
      // 如果关键词为空，显示所有专业（但限制数量）
      if (!keyword || keyword.trim() === '') {
        const allMajors = this.graduateStore.schools[this.graduateStore.selectedSchool] || [];
        this.targetMajorList = allMajors.slice(0, 20); // 限制初始显示数量
        console.log('关键词为空，显示前20个专业');
        return;
      }
      
      // 确保专业搜索引擎已初始化
      if (!this.graduateStore.majorFuse) {
        console.warn('专业搜索引擎未初始化，重新初始化中...');
        // 重新初始化当前学校的专业搜索引擎
        GraduateStore.mutations.setSelectedSchool(this.graduateStore, this.graduateStore.selectedSchool);
      }
      
      // 更新专业搜索关键词
      GraduateStore.mutations.setMajorKeyword(this.graduateStore, keyword);
      
      // 手动获取过滤结果并更新列表
      const filteredMajors = GraduateStore.getters.filteredMajorList(this.graduateStore);
      console.log('过滤后的专业列表:', filteredMajors);
      
      // 直接更新目标专业列表，不依赖watch
      this.targetMajorList = filteredMajors;
      
      // 强制刷新组件
      this.$nextTick(() => {
        // 记录结果数量
        console.log(`最终显示专业数量: ${filteredMajors.length}`);
        
        // 确保下拉框组件刷新
        if (this.$refs.targetMajorDropdown) {
          this.$refs.targetMajorDropdown.$forceUpdate();
        }
      });
    },
    
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      const dropdowns = ['schoolDropdown', 'majorDropdown', 'targetSchoolDropdown', 'targetMajorDropdown'];
      dropdowns.forEach(dropdown => {
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
        // 初始化考研数据（目标学校和专业）
        this.initGraduateData(); 
        
        console.log('成功加载学校数据');
      } catch (error) {
        console.error('加载大学数据失败:', error);
        
        // 设置默认学校列表
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        
        // 设置普通学校列表（就读学校）
        this.schoolList = defaultSchools;
        
        // 设置目标学校列表（考研学校）
        this.targetSchoolList = defaultSchools;
        
        uni.showToast({
          title: '加载大学数据失败，使用默认列表',
          icon: 'none'
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
        // 使用mapMutations映射的方法更新用户信息
        this.UPDATE_USER_INFO(this.pendingUserInfo);
        
        // 提交到后端
        this.submitToBackend(this.pendingUserInfo);
        
        // 本地存储用户昵称和头像，方便下次加载
        uni.setStorageSync('nickname', this.pendingUserInfo.userInfo.nickname);
        uni.setStorageSync('avatar', this.pendingUserInfo.userInfo.avatar);
        
        // 提示成功
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        });
        
        // 关闭浮窗
        this.showAgreementModal = false;
        
        // 跳转到下一个页面
        setTimeout(() => {
          Navigator.toMine();
        }, 1500);
      }
    },
    skipForm(){
      Navigator.toIndex();
    },
    /**
     * @description 提交表单信息
     */
    submitForm() {
      try {
        // 检查必填信息
        if (!this.formData.nickname.trim()) {
          uni.showToast({
            title: '请输入昵称',
            icon: 'none'
          });
          return;
        }
        
        // 从Vuex获取角色，无需本地存储
        const currentRole = this.userRole;
        
        // 构建用户信息对象，与state.js中的结构保持一致
        const userInfo = {
          // 顶级字段更新
          id: this.userId || uni.getStorageSync('userId'), // 保持ID不变
          name: this.formData.nickname, // 使用昵称更新name字段
          avatar: this.formData.avatar, // 更新头像
          isRegistered: 1, // 标记为已注册
          
          userInfo: {
            // 保留证书状态
            certificate: this.$store.state.user.baseInfo.userInfo.certificate,
            role: currentRole, // 使用vuex中的角色
            school: this.formData.schoolIndex >= 0 ? this.schoolList[this.formData.schoolIndex] : this.userSchool,
            major: this.formData.majorIndex >= 0 ? this.majorList[this.formData.majorIndex] : this.userMajor,
            studentGrade: (currentRole === '学生' && this.formData.gradeIndex >= 0) ? this.gradeList[this.formData.gradeIndex] : this.userStudentGrade,
            teacherGrade: (currentRole === '老师' && this.formData.gradeIndex >= 0) ? this.gradeList[this.formData.gradeIndex] : this.userTeacherGrade,
            // 新增昵称和头像
            nickname: this.formData.nickname,
            avatar: this.formData.avatar
          }
        };
        
        // 如果是学生角色，添加目标学校和目标专业
        if (currentRole === '学生') {
          // 使用保存的目标学校和专业值或者保留原有值
          userInfo.userInfo.targetSchool = this.formData.targetSchool || this.userTargetSchool;
          userInfo.userInfo.targetMajor = this.formData.targetMajor || this.userTargetMajor;
        }
        
        // 如果是老师角色，显示协议确认浮窗
        if (currentRole === '老师') {
          this.pendingUserInfo = userInfo; // 暂存用户信息
          this.showAgreementModal = true; // 显示协议浮窗
          return; // 终止后续处理，等待用户确认
        }
        
        // 学生角色直接提交信息，使用mapMutations映射的方法
        this.UPDATE_USER_INFO(userInfo);
        
        // 提交到后端
        this.submitToBackend(userInfo);
        
        // 本地存储用户昵称和头像，方便下次加载
        uni.setStorageSync('nickname', this.formData.nickname);
        uni.setStorageSync('avatar', this.formData.avatar);
        
        // 提示成功
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        });
        
        // 跳转到下一个页面
        setTimeout(() => {
          Navigator.toIndex();
        }, 1500);
      } catch (error) {
        console.error('提交表单时出错:', error);
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 提交用户信息到后端
     * @param {Object} userInfo - 用户信息对象
     */
    submitToBackend(userInfo) {
      // 确保有token
      if (!this.token) {
        console.error('没有token，无法提交用户信息');
        return;
      }
      
      // 显示加载中
      uni.showLoading({
        title: '提交中...'
      });
      
      // 构造提交的数据
      const submitData = {
        id: userInfo.id, // 包含用户ID
        nickname: userInfo.userInfo.nickname,
        name: userInfo.name, // 使用顶级name字段
        avatar: userInfo.avatar, // 使用顶级avatar字段
        school: userInfo.userInfo.school,
        major: userInfo.userInfo.major,
        grade: userInfo.userInfo.role === '学生' ? userInfo.userInfo.studentGrade : userInfo.userInfo.teacherGrade
      };
      
      // 如果是学生，添加目标学校和专业
      if (userInfo.userInfo.role === '学生') {
        submitData.targetSchool = userInfo.userInfo.targetSchool;
        submitData.targetMajor = userInfo.userInfo.targetMajor;
      }
      
      // 发送请求到后端
      uni.request({
        url: 'http://localhost:8080/users/profile/update',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        data: submitData,
        success: (res) => {
          console.log('用户信息提交成功', res);
          uni.hideLoading();
          
          // 如果后端返回了更新后的用户信息，更新本地存储
          if (res.data && res.data.user) {
            const user = res.data.user;
            
            // 更新Vuex状态
            const updateData = {
              id: user.id || userInfo.id,
              name: user.name || userInfo.name,
              avatar: user.avatar || userInfo.avatar
            };
            
            // 更新Vuex
            this.UPDATE_USER_INFO(updateData);
            
            // 更新本地存储
            uni.setStorageSync('userId', updateData.id);
            uni.setStorageSync('nickname', updateData.name);
            uni.setStorageSync('avatar', updateData.avatar);
          }
        },
        fail: (err) => {
          console.error('用户信息提交失败', err);
          uni.hideLoading();
          uni.showToast({
            title: '网络异常，信息已本地保存',
            icon: 'none'
          });
        }
      });
    },

    /**
     * @description 验证表单内容 - 所有字段均为选填，无需验证
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      // 所有字段均为选填，直接返回true
      return true;
    },

    /**
     * @description 初始化考研数据
     */
    initGraduateData() {
      try {
        // 初始化研究生数据状态 - 使用深拷贝确保数据完整性
        this.graduateStore = JSON.parse(JSON.stringify(GraduateStore.state));
        
        // 确保数据结构完整
        if (!this.graduateStore.schools) {
          console.error('研究生学校数据不完整');
          throw new Error('学校数据结构不完整');
        }
        
        // 使用优化的搜索引擎配置初始化
        GraduateStore.mutations.initSchoolFuse(this.graduateStore);
        console.log('Fuse引擎初始化状态:', !!this.graduateStore.schoolFuse);
        
        // 验证搜索引擎配置
        if (this.graduateStore.schoolFuse) {
          console.log('Fuse配置验证:', {
            keys: this.graduateStore.schoolFuse._docs[0] ? Object.keys(this.graduateStore.schoolFuse._docs[0]) : '未知',
            ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
            threshold: this.graduateStore.schoolFuse.options.threshold
          });
        } else {
          console.error('Fuse.js搜索引擎初始化失败');
        }
        
        // 设置目标学校列表初始值 - 仅用于目标学校下拉框
        const graduateSchools = Object.keys(this.graduateStore.schools).slice(0, 50); // 初始只显示前50所
        this.targetSchoolList = graduateSchools;
        
        console.log('初始化考研数据成功');
        return true;
      } catch (error) {
        console.error('初始化考研数据失败:', error);
        
        // 设置默认数据
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.targetSchoolList = defaultSchools;
        return false;
      }
    },
    
    /**
     * @description 处理学校变更事件
     * @param {String} school - 变更后的学校名称
     */
    handleSchoolChange(school) {
      console.log('学校变更事件:', school);
      
      if (!school) {
        // 学校被清空，重置专业选择
        this.resetMajorSelection();
        return;
      }
      
      // 在选择新学校后，立即更新专业搜索实例
      GraduateStore.actions.selectSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 更新目标专业列表
      if (this.graduateStore.schools[school]) {
        this.targetMajorList = this.graduateStore.schools[school].slice(0, 30); // 初始显示前30个专业
        console.log(`已加载 ${school} 的专业列表，共 ${this.targetMajorList.length} 个`);
      } else {
        this.resetMajorSelection();
        console.warn(`${school} 没有关联的专业数据`);
      }
    },
    
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = '';
    }
  },
  // 监听页面显示时更新搜索引擎
  onShow() {
    // 每次显示页面时强制重新初始化搜索引擎，确保搜索功能正常工作
    if (this.graduateStore) {
      // 使用强制重新初始化搜索方法
      GraduateStore.actions.reinitializeSearch({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        },
        state: this.graduateStore
      });
      
      console.log('Fuse引擎强制重新初始化完成，状态:', !!this.graduateStore.schoolFuse);
      
      // 验证搜索引擎配置
      if (this.graduateStore.schoolFuse) {
        console.log('重新初始化后的Fuse配置:', {
          threshold: this.graduateStore.schoolFuse.options.threshold,
          ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
          items: this.graduateStore.schoolFuse._docs.length
        });
      }
    }
    
    // 重新初始化本科学校和专业搜索引擎
    if (this.schoolStore && this.majorStore) {
      this.initSchoolAndMajorSearch();
    }
  },
};
</script>

<style lang="scss" scoped>
.header-container {
	/**
	 * @description 固定顶部导航栏，背景不透明，确保在最上层
	 */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 100;
}
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
.background-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.reminder-outer {
  width: 100%;
  border-radius: 10rpx;
  padding: 2rpx 2rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
  margin-bottom: 30rpx;
}

.reminder-inner {
  width: 100%;
  border-radius: 10rpx;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 20rpx 30rpx;
  align-items: center;
  justify-content: center;
}

.reminder-inner::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(194, 221, 250, 0.1) 11.54%, rgba(34, 136, 249, 0.1) 111.54%);
}

.reminder-text {
  color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  position: relative;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 100%;
  letter-spacing: -1.1rpx;
}

.form-card {
  background-color: transparent;
  border-radius: 20rpx;
  padding: 30rpx;
}

.label-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15rpx;
}

.form-row {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -1.1rpx;

}

.optional-tag {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.required-tag {
  font-size: 24rpx;
  color: #ff4d4f;
  margin-left: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.radio-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.radio-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30px;
  margin-left: 30px;
}

.option-text {
  margin-left: 8px;
  font-size: 28rpx;
  color: #333;
}

.form-select {
  width: 100%;
  border: 2rpx solid rgba(151, 151, 151, 1);
  border-radius: 8rpx;
  box-sizing: border-box;
}

.button-container {
  margin-top: 50rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.skip-btn{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 76rpx;
  border-radius: 10px;
  background: linear-gradient(180deg, #B2D7FF 0%, #2288F9 100%);
}
.skip-btn-icon{
  width: 36rpx;
  height: 36rpx;
}

.submit-btn-icon{
  width: 36rpx;
  height: 36rpx;
}
.submit-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 76rpx;
  border-radius: 10px;
  background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
  margin-left: 80rpx;
}
.btn-text{
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  line-height: 100%;
  letter-spacing: -1.1rpx;
  text-align: center;
  color:rgba(255, 255, 255, 1);
  margin-left: 20rpx;
}
/* 头像上传相关样式 */
.avatar-upload-container {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  overflow: hidden;
  margin: 10rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-upload-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50rpx;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-text {
  color: #fff;
  font-size: 22rpx;
}

/* 协议浮窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 80%;
  max-height: 70vh;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  padding: 30rpx 0;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.modal-body {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
}

.agreement-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.agreement-item {
  margin-bottom: 20rpx;
}

.modal-footer {
  padding: 20rpx 30rpx 40rpx;
  border-top: 1px solid #f0f0f0;
}

.agree-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007AFF;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
}
</style>
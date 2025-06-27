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
            :choiceList="schoolOptions"
            defaultText="请选择学校"
            mode="search"
            searchPlaceholder="输入学校名称"
            @onChoiceClick="handleSchoolSelect"
            @search-input="handleSchoolSearch"
            :enablePagination="true"
            :pageSize="10"
            :loading="undergraduateSchoolSearchData.isLoading"
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
            :choiceList="majorOptions"
            defaultText="请选择专业"
            mode="search"
            searchPlaceholder="输入专业名称"
            @onChoiceClick="handleMajorSelect"
            @search-input="handleMajorSearch"
            :enablePagination="true"
            :pageSize="10"
            :loading="undergraduateMajorSearchData.isLoading"
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
              :choiceList="targetSchoolOptions"
              :defaultText="userRole === '学生' ? '请选择目标学校' : '请选择学校'"
              mode="search"
              :searchPlaceholder="userRole === '学生' ? '输入目标学校名称' : '输入学校名称'"
              @onChoiceClick="handleTargetSchoolSelect"
              @search-input="handleTargetSchoolSearch"
              @linkage-change="handleSchoolChange"
              :enablePagination="true"
              :pageSize="10"
              :loading="graduateSchoolSearchData.isLoading"
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
              :choiceList="targetMajorOptions"
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
import Header from '@/components/navigationTitleBar/header';
import { submitUserInfo } from './login_detail.js';

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
    // 加载用户信息
    this.initUserInfo();
  },
  onUnload() {
    // 页面卸载时清理防抖定时器
    Object.values(this.searchTimers).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
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
      
      allGradeList: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
      showAgreementModal: false, // 控制协议浮窗显示
      pendingUserInfo: null, // 暂存待提交的用户信息
      
      // 搜索防抖定时器
      searchTimers: {
        school: null,
        major: null,
        targetSchool: null,
        targetMajor: null
      },
      
      token: '', // 用户token
      userId: '', // 用户ID
    };
  },
  computed: {
    // 使用mapState映射userInfo相关状态
    ...mapState('user/baseInfo', {
      userRole: state => state.userInfo.role,
      userSchoolId: state => state.userInfo.schoolId,
      userMajorId: state => state.userInfo.majorId,
      userTargetSchoolId: state => state.userInfo.targetSchoolId,
      userTargetMajorId: state => state.userInfo.targetMajorId,
      userStudentGrade: state => state.userInfo.studentGrade,
      userTeacherGrade: state => state.userInfo.teacherGrade
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
     * 本科学校选项列表 - 使用 schoolMajorRequest 模块
     * @returns {Array} 学校名称列表
     */
    schoolOptions() {
      return this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'].map(item => item.name);
    },
    
    /**
     * 本科专业选项列表 - 使用 schoolMajorRequest 模块
     * @returns {Array} 专业名称列表
     */
    majorOptions() {
      return this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'].map(item => item.name);
    },
    
    /**
     * 研究生学校选项列表 - 使用 schoolMajorRequest 模块
     * @returns {Array} 学校名称列表
     */
    targetSchoolOptions() {
      return this.$store.getters['user/schoolMajorRequest/graduateSchoolOptions'].map(item => item.name);
    },
    
    /**
     * 研究生专业选项列表 - 使用 schoolMajorRequest 模块
     * @returns {Array} 专业名称列表
     */
    targetMajorOptions() {
      return this.$store.getters['user/schoolMajorRequest/graduateMajorOptions'].map(item => item.name);
    },
    
    /**
     * 本科学校搜索状态 - 使用 schoolMajorRequest 模块
     * @returns {Object} 搜索状态信息
     */
    undergraduateSchoolSearchData() {
      return this.$store.getters['user/schoolMajorRequest/undergraduateSchoolSearchStatus'];
    },
    
    /**
     * 本科专业搜索状态 - 使用 schoolMajorRequest 模块
     * @returns {Object} 搜索状态信息
     */
    undergraduateMajorSearchData() {
      return this.$store.getters['user/schoolMajorRequest/undergraduateMajorSearchStatus'];
    },
    
    /**
     * 研究生学校搜索状态 - 使用 schoolMajorRequest 模块
     * @returns {Object} 搜索状态信息
     */
    graduateSchoolSearchData() {
      return this.$store.getters['user/schoolMajorRequest/graduateSchoolSearchStatus'];
    },
    
    /**
     * 研究生专业搜索状态 - 使用 schoolMajorRequest 模块
     * @returns {Object} 搜索状态信息
     */
    graduateMajorSearchData() {
      return this.$store.getters['user/schoolMajorRequest/graduateMajorSearchStatus'];
    }
  },
  watch: {
    // 监听学校选项变化，更新索引
    schoolOptions: {
      handler(newOptions) {
        this.updateSchoolIndex(newOptions);
      },
      immediate: true
    },
    
    // 监听专业选项变化，更新索引
    majorOptions: {
      handler(newOptions) {
        this.updateMajorIndex(newOptions);
      },
      immediate: true
    },
    
    // 监听目标学校选项变化，更新索引
    targetSchoolOptions: {
      handler(newOptions) {
        this.updateTargetSchoolIndex(newOptions);
      },
      immediate: true
    },
    
    // 监听目标专业选项变化，更新索引
    targetMajorOptions: {
      handler(newOptions) {
        this.updateTargetMajorIndex(newOptions);
      },
      immediate: true
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
      
      // // 如果需要，可以尝试从后端获取最新的用户信息
      // this.fetchUserProfile();
    },
    
    // /**
    //  * @description 从后端获取用户信息
    //  */
    // fetchUserProfile() {
    //   if (!this.token || !this.userId) return;
      
    //   uni.request({
    //     url: `http://localhost:8080/users/profile/${this.userId}`,
    //     method: 'GET',
    //     header: {
    //       'Authorization': `Bearer ${this.token}`
    //     },
    //     success: (res) => {
    //       if (res.statusCode === 200 && res.data) {
    //         const userData = res.data;
            
    //         // 更新表单数据
    //         if (userData.nickname) {
    //           this.formData.nickname = userData.nickname;
    //           uni.setStorageSync('nickname', userData.nickname);
    //         }
            
    //         if (userData.avatar) {
    //           this.formData.avatar = userData.avatar;
    //           uni.setStorageSync('avatar', userData.avatar);
    //         }
            
    //         // 更新Vuex状态
    //         this.SET_USER_INFO({
    //           id: userData.id || this.userId,
    //           name: userData.nickname || this.formData.nickname,
    //           avatar: userData.avatar || this.formData.avatar,
    //           isRegistered: 1
    //         });
            
    //         console.log('用户信息已更新');
    //       }
    //     },
    //     fail: (err) => {
    //       console.error('获取用户信息失败', err);
    //     }
    //   });
    // },
    
    /**
     * @description 更新本科学校索引
     * @param {Array} schoolOptions - 学校选项列表
     */
    updateSchoolIndex(schoolOptions) {
      const selectedSchool = this.$store.getters['user/schoolMajorRequest/selectedUndergraduateSchool'];
      if (selectedSchool.name && schoolOptions.length > 0) {
        const schoolIndex = schoolOptions.indexOf(selectedSchool.name);
        this.formData.schoolIndex = schoolIndex !== -1 ? schoolIndex : -1;
      } else {
        this.formData.schoolIndex = -1;
      }
    },
    
    /**
     * @description 更新本科专业索引
     * @param {Array} majorOptions - 专业选项列表
     */
    updateMajorIndex(majorOptions) {
      const selectedMajor = this.$store.getters['user/schoolMajorRequest/selectedUndergraduateMajor'];
      if (selectedMajor.name && majorOptions.length > 0) {
        const majorIndex = majorOptions.indexOf(selectedMajor.name);
        this.formData.majorIndex = majorIndex !== -1 ? majorIndex : -1;
      } else {
        this.formData.majorIndex = -1;
      }
    },
    
    /**
     * @description 更新目标学校索引
     * @param {Array} targetSchoolOptions - 目标学校选项列表
     */
    updateTargetSchoolIndex(targetSchoolOptions) {
      const selectedSchool = this.$store.getters['user/schoolMajorRequest/selectedGraduateSchool'];
      if (selectedSchool.name && targetSchoolOptions.length > 0) {
        const schoolIndex = targetSchoolOptions.indexOf(selectedSchool.name);
        this.formData.targetSchoolIndex = schoolIndex !== -1 ? schoolIndex : -1;
        this.formData.targetSchool = selectedSchool.name;
      } else {
        this.formData.targetSchoolIndex = -1;
        this.formData.targetSchool = '';
      }
    },
    
    /**
     * @description 更新目标专业索引
     * @param {Array} targetMajorOptions - 目标专业选项列表
     */
    updateTargetMajorIndex(targetMajorOptions) {
      const selectedMajor = this.$store.getters['user/schoolMajorRequest/selectedGraduateMajor'];
      if (selectedMajor.name && targetMajorOptions.length > 0) {
        const majorIndex = targetMajorOptions.indexOf(selectedMajor.name);
        this.formData.targetMajorIndex = majorIndex !== -1 ? majorIndex : -1;
        this.formData.targetMajor = selectedMajor.name;
      } else {
        this.formData.targetMajorIndex = -1;
        this.formData.targetMajor = '';
      }
    },
    
    /**
     * @description 处理本科学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleSchoolSelect(index, school) {
      this.formData.schoolIndex = index;
      
      // 通过新的 schoolMajorRequest 模块更新选择
      const schoolOptions = this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'];
      const schoolOption = schoolOptions.find(item => item.name === school);
      if (schoolOption) {
        this.$store.dispatch('user/schoolMajorRequest/selectUndergraduateSchool', {
          id: schoolOption.id,
          name: schoolOption.name
        });
      }
    },
    
    /**
     * @description 处理本科专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleMajorSelect(index, major) {
      this.formData.majorIndex = index;
      
      // 通过新的 schoolMajorRequest 模块更新选择
      const majorOptions = this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'];
      const majorOption = majorOptions.find(item => item.name === major);
      if (majorOption) {
        this.$store.dispatch('user/schoolMajorRequest/selectUndergraduateMajor', {
          id: majorOption.id,
          name: majorOption.name
        });
      }
    },
    
    /**
     * @description 处理目标学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleTargetSchoolSelect(index, school) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      
      // 通过新的 schoolMajorRequest 模块更新选择
      const schoolOptions = this.$store.getters['user/schoolMajorRequest/graduateSchoolOptions'];
      const schoolOption = schoolOptions.find(item => item.name === school);
      if (schoolOption) {
        this.$store.dispatch('user/schoolMajorRequest/selectGraduateSchool', {
          id: schoolOption.id,
          name: schoolOption.name
        });
      }
    },
    
    /**
     * @description 处理目标专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleTargetMajorSelect(index, major) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
      
      // 通过新的 schoolMajorRequest 模块更新选择
      const majorOptions = this.$store.getters['user/schoolMajorRequest/graduateMajorOptions'];
      const majorOption = majorOptions.find(item => item.name === major);
      if (majorOption) {
        this.$store.dispatch('user/schoolMajorRequest/selectGraduateMajor', {
          id: majorOption.id,
          name: majorOption.name
        });
      }
    },
    
    /**
     * @description 处理年级选择
     * @param {Number} index - 选择的索引
     * @param {String} grade - 选择的年级
     */
    handleGradeSelect(index, grade) {
      this.formData.gradeIndex = index;
    },
    
    /**
     * @description 处理本科学校搜索输入（带防抖）
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword) {
      // 清除之前的定时器
      if (this.searchTimers.school) {
        clearTimeout(this.searchTimers.school);
      }
      
      // 设置防抖延迟500ms
      this.searchTimers.school = setTimeout(() => {
        this.performSchoolSearch(keyword);
      }, 500);
    },
    
    /**
     * @description 执行本科学校搜索
     * @param {String} keyword - 搜索关键词
     */
    async performSchoolSearch(keyword) {
      try {
        await this.$store.dispatch('user/schoolMajorRequest/searchUndergraduateSchools', {
          keyword: keyword
        });
      } catch (error) {
        console.error('学校搜索失败:', error);
        uni.showToast({
          title: '学校搜索失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 处理本科专业搜索输入（带防抖）
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword) {
      // 清除之前的定时器
      if (this.searchTimers.major) {
        clearTimeout(this.searchTimers.major);
      }
      
      // 设置防抖延迟500ms
      this.searchTimers.major = setTimeout(() => {
        this.performMajorSearch(keyword);
      }, 500);
    },
    
    /**
     * @description 执行本科专业搜索
     * @param {String} keyword - 搜索关键词
     */
    async performMajorSearch(keyword) {
      try {
        await this.$store.dispatch('user/schoolMajorRequest/searchUndergraduateMajors', {
          keyword: keyword
        });
      } catch (error) {
        console.error('专业搜索失败:', error);
        uni.showToast({
          title: '专业搜索失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 处理目标学校搜索输入（带防抖）
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword) {
      // 清除之前的定时器
      if (this.searchTimers.targetSchool) {
        clearTimeout(this.searchTimers.targetSchool);
      }
      
      // 设置防抖延迟500ms
      this.searchTimers.targetSchool = setTimeout(() => {
        this.performTargetSchoolSearch(keyword);
      }, 500);
    },
    
    /**
     * @description 执行目标学校搜索
     * @param {String} keyword - 搜索关键词
     */
    async performTargetSchoolSearch(keyword) {
      try {
        await this.$store.dispatch('user/schoolMajorRequest/searchGraduateSchools', {
          keyword: keyword
        });
      } catch (error) {
        console.error('目标学校搜索失败:', error);
        uni.showToast({
          title: '目标学校搜索失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 处理目标专业搜索输入（带防抖）
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword) {
      // 清除之前的定时器
      if (this.searchTimers.targetMajor) {
        clearTimeout(this.searchTimers.targetMajor);
      }
      
      // 设置防抖延迟500ms
      this.searchTimers.targetMajor = setTimeout(() => {
        this.performTargetMajorSearch(keyword);
      }, 500);
    },
    
    /**
     * @description 执行目标专业搜索
     * @param {String} keyword - 搜索关键词
     */
    async performTargetMajorSearch(keyword) {
      try {
        await this.$store.dispatch('user/schoolMajorRequest/searchGraduateMajors', {
          keyword: keyword
        });
      } catch (error) {
        console.error('目标专业搜索失败:', error);
        uni.showToast({
          title: '目标专业搜索失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 处理学校变化（联动效果）
     * @param {String} school - 新选择的学校
     */
    handleSchoolChange(school) {
      // 清空专业选择
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = '';
      
      // 通过新的 schoolMajorRequest 模块清空专业列表
      this.$store.commit('user/schoolMajorRequest/CLEAR_GRADUATE_MAJOR_SELECTION');
    },
    
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = '';
    },
    
    /**
     * @description 跳过表单填写
     */
    async skipForm() {
      try {
        uni.showLoading({
          title: '跳过中...'
        });
        
        // 调用API，传入跳过标识
        const result = await submitUserInfo({
          userRole: this.userRole,
          userInfo: {},
          isSkip: true
        });
        
        uni.hideLoading();
        
        if (result.success) {
          uni.showToast({
            title: '跳过成功',
            icon: 'success'
          });
          
          // 延迟跳转到首页
          setTimeout(() => {
            Navigator.toIndex();
          }, 1500);
        } else {
          uni.showToast({
            title: result.message || '跳过失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('跳过失败:', error);
        uni.showToast({
          title: '跳过失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 提交表单
     */
    submitForm() {
      // 从新的 schoolMajorRequest 模块获取选项数据
      const undergraduateSchoolOptions = this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'];
      const undergraduateMajorOptions = this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'];
      const graduateSchoolOptions = this.$store.getters['user/schoolMajorRequest/graduateSchoolOptions'];
      const graduateMajorOptions = this.$store.getters['user/schoolMajorRequest/graduateMajorOptions'];
      
      // 检查必填字段（虽然是可选填写，但老师角色需要确认协议）
      const selectedSchoolOption = undergraduateSchoolOptions[this.formData.schoolIndex];
      const selectedMajorOption = undergraduateMajorOptions[this.formData.majorIndex];
      const selectedTargetSchoolOption = graduateSchoolOptions[this.formData.targetSchoolIndex];
      const selectedTargetMajorOption = graduateMajorOptions[this.formData.targetMajorIndex];
      const selectedGrade = this.gradeList[this.formData.gradeIndex];
      
      // 构造用户信息
      const userInfo = {
        nickname: this.formData.nickname || '',
        avatar: this.formData.avatar || '',
        schoolId: selectedSchoolOption ? selectedSchoolOption.id : null,
        majorId: selectedMajorOption ? selectedMajorOption.id : null,
        targetSchoolId: selectedTargetSchoolOption ? selectedTargetSchoolOption.id : null,
        targetMajorId: selectedTargetMajorOption ? selectedTargetMajorOption.id : null,
        grade: selectedGrade || ''
      };
      
      // 如果是老师角色，需要确认协议
      if (this.userRole === '老师') {
        this.pendingUserInfo = userInfo;
        this.showAgreementModal = true;
      } else {
        // 学生角色直接提交
        this.doSubmit(userInfo);
      }
    },
    
    /**
     * @description 执行提交操作
     * @param {Object} userInfo - 用户信息
     */
    async doSubmit(userInfo) {
      try {
        uni.showLoading({
          title: '提交中...'
        });
        
        // 构造年级类型映射
        const gradeTypeMap = {
          '大一': 1,
          '大二': 2,
          '大三': 3,
          '大四': 4,
          '研一': 5,
          '研二': 6,
          '研三': 7
        };
        
        // 添加年级类型到用户信息
        const processedUserInfo = {
          ...userInfo,
          gradeType: userInfo.grade ? gradeTypeMap[userInfo.grade] : null
        };
        
        // 调用API提交数据
        const result = await submitUserInfo({
          userRole: this.userRole,
          userInfo: processedUserInfo,
          isSkip: false
        });
        
        uni.hideLoading();
        
        if (result.success) {
          // 更新Vuex状态
          this.UPDATE_USER_INFO(userInfo);
          
          uni.showToast({
            title: result.message || '提交成功',
            icon: 'success'
          });
          
          // 延迟跳转到首页
          setTimeout(() => {
            Navigator.toIndex();
          }, 1500);
        } else {
          uni.showToast({
            title: result.message || '提交失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('提交失败:', error);
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 确认协议
     */
    confirmAgreement() {
      this.showAgreementModal = false;
      
      if (this.pendingUserInfo) {
        this.doSubmit(this.pendingUserInfo);
        this.pendingUserInfo = null;
      }
    },
    
    /**
     * @description 关闭协议弹窗
     */
    closeModal() {
      this.showAgreementModal = false;
      this.pendingUserInfo = null;
    }
  }
}
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
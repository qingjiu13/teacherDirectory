<template>
  <view class="form-container">
    <!-- 表单内容 -->
    <view class="form-card">
      <!-- Nickname -->
      <view class="form-row">
        <text class="form-label">昵称</text>
        <input class="form-input" type="text" v-model="formData.nickname" placeholder="请输入昵称" />
      </view>
      
      <!-- Gender -->
      <view class="form-row">
        <text class="form-label">性别</text>
        <view class="radio-group">
          <view class="radio-item">
            <radio :checked="formData.gender === '男'" @click="formData.gender = '男'" color="#007AFF" />
            <text>男</text>
          </view>
          <view class="radio-item">
            <radio :checked="formData.gender === '女'" @click="formData.gender = '女'" color="#007AFF" />
            <text>女</text>
          </view>
        </view>
      </view>
      
      <!-- Phone Number -->
      <view class="form-row">
        <text class="form-label">手机号</text>
        <input class="form-input" type="text" v-model="formData.phone" placeholder="请输入手机号" />
      </view>
      
      <!-- School -->
      <view class="form-row">
        <text class="form-label">就读学校</text>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.schoolIndex"
          :choiceList="schoolList"
          defaultText="请选择学校"
          mode="search"
          searchPlaceholder="输入学校名称"
          @onChoiceClick="handleSchoolSelect"
        />
      </view>
      
      <!-- Major -->
      <view class="form-row">
        <text class="form-label">就读专业</text>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.majorIndex"
          :choiceList="majorList"
          defaultText="请选择专业"
          mode="search"
          searchPlaceholder="输入专业名称"
          @onChoiceClick="handleMajorSelect"
        />
      </view>
      
      <!-- Grade -->
      <view class="form-row">
        <text class="form-label">年级</text>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.gradeIndex"
          :choiceList="gradeList"
          defaultText="请选择年级"
          mode="select"
          @onChoiceClick="handleGradeSelect"
        />
      </view>

      <!-- 添加教师特有的字段，根据角色条件渲染 -->
      <view class="form-row" v-if="userRole === '老师'">
        <text class="form-label">考研分数</text>
        <input class="form-input" type="number" v-model="formData.teacherScore" placeholder="请输入考研分数" />
      </view>
      
      <!-- 按钮区域 -->
      <view class="button-container">
        <button class="submit-btn" @click="submitForm">提交信息</button>
      </view>
    </view>
  </view>
</template>

<script>
import ChoiceSelected from '../../components/combobox/combobox'
import { mapState } from 'vuex'

export default {
  components: {
    ChoiceSelected,
  },
  data() {
    return {
      formData: {
        nickname: '',
        gender: '男',
        phone: '',
        schoolIndex: -1,
        majorIndex: -1,
        gradeIndex: -1,
        teacherScore: ''
      },
      schoolList: [
        '北京大学',
        '清华大学',
        '复旦大学',
        '上海交通大学',
        '浙江大学',
      ],
      majorList: [
        '计算机科学',
        '电子工程',
        '机械工程',
        '经济学',
        '法学',
      ],
      gradeList: ['大一', '大二', '大三', '大四', '研究生'],
    };
  },
  computed: {
    ...mapState({
      userRole: state => state.user.baseInfo.userInfo.role
    })
  },
  methods: {
    handleSchoolSelect(index) {
      this.formData.schoolIndex = index;
    },
    handleMajorSelect(index) {
      this.formData.majorIndex = index;
    },
    handleGradeSelect(index) {
      this.formData.gradeIndex = index;
    },
    /**
     * 提交表单信息
     */
    submitForm() {
      // 验证表单内容
      if (!this.validateForm()) {
        return;
      }
      
      // 构建用户信息对象
      const userInfo = {
        name: this.formData.nickname,
        gender: this.formData.gender,
        phoneNumber: this.formData.phone,
        userInfo: {
          school: this.schoolList[this.formData.schoolIndex] || '',
          major: this.majorList[this.formData.majorIndex] || '',
          studentGrade: this.userRole === '学生' ? this.gradeList[this.formData.gradeIndex] || '' : '',
          teacherGrade: this.userRole === '老师' ? this.gradeList[this.formData.gradeIndex] || '' : '',
        }
      };
      
      // 如果是老师，添加考研分数
      if (this.userRole === '老师' && this.formData.teacherScore) {
        userInfo.userInfo.teacherScore = parseInt(this.formData.teacherScore);
      }
      
      // 更新用户信息到vuex
      this.$store.commit('user/baseInfo/UPDATE_USER_INFO', userInfo);
      
      // 提示成功
      uni.showToast({
        title: '信息保存成功',
        icon: 'success'
      });
      
      // 跳转到下一个页面
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    },
    /**
     * 验证表单内容
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      if (!this.formData.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        });
        return false;
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      if (this.formData.schoolIndex === -1) {
        uni.showToast({
          title: '请选择学校',
          icon: 'none'
        });
        return false;
      }
      if (this.formData.majorIndex === -1) {
        uni.showToast({
          title: '请选择专业',
          icon: 'none'
        });
        return false;
      }
      if (this.formData.gradeIndex === -1) {
        uni.showToast({
          title: '请选择年级',
          icon: 'none'
        });
        return false;
      }
      if (this.userRole === '老师' && !this.formData.teacherScore) {
        uni.showToast({
          title: '请输入考研分数',
          icon: 'none'
        });
        return false;
      }
      return true;
    }
  },
  created() {
    console.log('当前用户角色:', this.userRole);
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  padding: 30rpx;
}

.form-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-row {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
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
}

.radio-item {
  display: flex;
  align-items: center;
  margin-right: 40rpx;
  
  text {
    font-size: 28rpx;
    margin-left: 10rpx;
    color: #333;
  }
}

.form-select {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.button-container {
  margin-top: 50rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}
</style>
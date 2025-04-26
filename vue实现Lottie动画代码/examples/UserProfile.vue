<template>
  <view class="user-profile">
    <view class="user-info">
      <text>用户名: {{ userName }}</text>
      <text>邮箱: {{ userEmail }}</text>
      <text>等级: {{ userLevel }}</text>
      <text>余额: {{ accountBalance }}</text>
    </view>
    <button @click="login">登录</button>
    <button @click="logout">登出</button>
    <button @click="updateUserInfo">更新信息</button>
  </view>
</template>

<script>
/**
 * 用户资料组件示例
 * 展示如何使用Vuex模块
 */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// 导入辅助函数工具
import { userBaseInfoModule } from '@/store/helpers'

export default {
  name: 'UserProfile',
  computed: {
    // 方式1: 直接使用mapState等指定命名空间
    ...mapState('user/baseInfo', ['userName', 'userEmail']),
    ...mapGetters('user/baseInfo', ['userLevel']),
    
    // 方式2: 使用辅助函数工具简化使用
    ...userBaseInfoModule.mapState(['isVip']),
    ...userBaseInfoModule.mapGetters(['accountBalance']),
    
    // 方式3: 使用对象形式自定义属性名
    ...mapState('user/baseInfo', {
      myName: state => state.userName,
      myEmail: 'userEmail' // 简写形式
    })
  },
  methods: {
    // 直接使用mapActions和mapMutations
    ...mapActions('user', ['login', 'logout']),
    ...mapMutations('user/baseInfo', ['SET_USER_NAME']),
    
    // 使用辅助函数工具
    ...userBaseInfoModule.mapActions(['fetchUserInfo']),
    
    // 自定义方法，可以组合使用store中的action和mutation
    updateUserInfo() {
      // 先获取用户信息
      this.fetchUserInfo();
      // 然后更新用户名
      this.SET_USER_NAME('新用户名');
    }
  }
}
</script>

<style>
.user-profile {
  padding: 20px;
}
.user-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
</style> 
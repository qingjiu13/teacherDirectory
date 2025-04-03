# UniApp uVue 状态管理系统

## 项目概述

这是一个基于uniapp uvue环境开发的Vuex状态管理系统，用于管理应用的认证状态和用户数据。系统采用模块化结构，支持JWT认证和自动刷新令牌机制。

## 系统架构

### 目录结构

```
store/
  ├── index.js           # Vuex主入口
  ├── actions.js         # 根级别actions
  ├── mutations.js       # 根级别mutations
  ├── getters.js         # 根级别getters
  └── modules/
      └── auth.js        # 用户认证模块
```

### 状态设计

#### 根状态

```javascript
{
  isLoading: false,      // 应用加载状态
  error: null,           // 错误信息
  appVersion: '1.0.0'    // 应用版本
}
```

#### 认证模块状态

```javascript
{
  isRegistered: Boolean,  // 是否注册过
  role: null,             // 'student'/'teacher'
  isLoggedIn: false,      // 是否已登录
  userInfo: {
    name: '',             // 用户名
    avatar: '',           // 头像
    tags: [],             // 用户标签数组
    balance: null,        // 老师余额(老师角色才有值)
    orders: {
      // 学生订单状态
      student: { pendingPayment: [], pendingService: [], completed: [], cancelled: [] },
      // 老师订单状态
      teacher: { pendingService: [], completed: [], cancelled: [] }
    }
  },
  token: '',              // JWT token
  refreshToken: '',       // 刷新token
  tokenExpireTime: null   // token过期时间
}
```

## 功能特性

1. **JWT认证**：完整的登录/登出流程
2. **角色管理**：支持学生和老师角色
3. **订单管理**：按状态分类的订单处理
4. **自动令牌刷新**：token过期自动刷新机制
5. **持久化存储**：使用uni.setStorageSync实现状态持久化

## 使用方法

### 初始化

应用启动时在App.uvue中自动初始化：

```javascript
// App.uvue
import { initializeApp } from './store/index'

// 在onLaunch中调用
await initializeApp()
```

### 登录

```javascript
// 登录示例
import store from '@/store'

const credentials = {
  username: 'test',
  password: '123456',
  role: 'student' // 或 'teacher'
}

const result = await store.dispatch('auth/login', credentials)
if (result.success) {
  // 登录成功
  console.log('登录成功')
} else {
  // 登录失败
  console.error(result.message)
}
```

### 获取用户信息

```javascript
// 获取用户信息
await store.dispatch('auth/getUserInfo')

// 使用getters
const userName = store.getters['auth/userName']
const userAvatar = store.getters['auth/userAvatar']
const isTeacher = store.getters['auth/isTeacher']
const teacherBalance = store.getters['auth/teacherBalance']
```

### 登出

```javascript
// 登出
await store.dispatch('auth/logout')
```

### 检查登录状态

```javascript
// 检查登录状态
const result = await store.dispatch('auth/checkLoginStatus')
if (result.success) {
  // 登录有效
} else {
  // 未登录或登录已过期
}
```

## 订单管理

根据角色获取不同类型的订单：

### 学生订单

```javascript
// 获取学生订单
const pendingPaymentOrders = store.getters['auth/studentPendingPaymentOrders']
const pendingServiceOrders = store.getters['auth/studentPendingServiceOrders']
const completedOrders = store.getters['auth/studentCompletedOrders']
const cancelledOrders = store.getters['auth/studentCancelledOrders']
```

### 老师订单

```javascript
// 获取老师订单
const pendingServiceOrders = store.getters['auth/teacherPendingServiceOrders']
const completedOrders = store.getters['auth/teacherCompletedOrders']
const cancelledOrders = store.getters['auth/teacherCancelledOrders']
```

## 本地存储

系统使用uni.setStorageSync存储以下关键信息：

- token
- refreshToken
- tokenExpireTime
- isLoggedIn
- role
- userBaseInfo (包含name和avatar) 
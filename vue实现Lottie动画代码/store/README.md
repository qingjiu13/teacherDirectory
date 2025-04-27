# Vuex 模块化使用指南

## 多层嵌套模块的访问方式

在复杂应用中，Vuex模块可能有多层嵌套。以下是访问多层嵌套模块的正确方式：

### 1. 路径式访问

```javascript
// 假设有以下嵌套结构：user -> baseInfo -> profile
// 在组件中访问
...mapState('user/baseInfo/profile', ['avatar', 'nickname'])
...mapActions('user/baseInfo/profile', ['updateAvatar'])
```

### 2. 创建更精细的辅助函数

```javascript
// 在store/helpers.js中
export const profileModule = createNamespacedHelpers('user/baseInfo/profile')

// 在组件中使用
...profileModule.mapState(['avatar', 'nickname'])
...profileModule.mapActions(['updateAvatar'])
```

### 3. 直接访问store示例

有时可能需要在非组件环境下访问store，可以直接使用以下方式：

```javascript
// 获取状态
const avatar = this.$store.state.user.baseInfo.profile.avatar

// 获取getter
const fullName = this.$store.getters['user/baseInfo/profile/fullName']

// 提交mutation
this.$store.commit('user/baseInfo/profile/SET_AVATAR', newAvatar)

// 分发action
this.$store.dispatch('user/baseInfo/profile/updateProfile', profileData)
```

## 模块注册的两种方式

### 1. 静态注册（推荐用于核心模块）

在`store/index.js`中直接导入并注册模块：

```javascript
import user from './user'
import products from './products'

export default createStore({
  modules: {
    user,
    products
  }
})
```

### 2. 动态注册（适用于按需加载的模块）

```javascript
// 在需要时动态注册模块
store.registerModule('dynamicModule', {
  namespaced: true,
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
})

// 使用完后可以卸载
store.unregisterModule('dynamicModule')
```

按需加载可以提高应用性能，特别是对于大型应用。 
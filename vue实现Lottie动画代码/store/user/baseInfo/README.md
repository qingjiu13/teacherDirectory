# 用户基本信息模块

这个模块包含了用户基本信息的状态管理和API接口，支持使用真实API或模拟数据进行开发和测试。

## 文件结构

- `index.js` - 模块入口，定义Vuex模块
- `state.js` - 状态定义
- `getters.js` - 获取器
- `mutations.js` - 修改器
- `actions.js` - 操作
- `api.js` - API接口
- `mock.js` - 模拟数据和API
- `config.js` - 配置选项
- `test.js` - 测试工具
- `helpers.js` - Vuex辅助工具

## 如何使用模拟数据

1. 在 `config.js` 中设置 `USE_MOCK_DATA` 为 `true` 以启用模拟数据
2. 在生产环境中，将 `USE_MOCK_DATA` 设置为 `false` 以使用真实API

## 模拟数据说明

模拟数据定义在 `mock.js` 文件中，包含以下内容：

- `mockUsers` - 模拟用户数据数组
- `mockLogin` - 模拟登录API
- `mockGetUserInfo` - 模拟获取用户信息API
- `mockUpdateUserInfo` - 模拟更新用户信息API

## 如何测试

使用 `test.js` 中提供的测试工具进行测试：

```javascript
import { testLogin, testGetUserInfo, testUpdateUserInfo, runFullTest } from './store/user/baseInfo/test';

// 测试单个功能
testLogin();
testGetUserInfo();
testUpdateUserInfo();

// 或者运行完整测试流程
runFullTest();
```

## 与后端对接

当需要与真实后端对接时：

1. 将 `config.js` 中的 `USE_MOCK_DATA` 设置为 `false`
2. 确保 `api.js` 中的API路径与实际后端接口一致
3. 检查请求和响应的数据格式是否与后端匹配

## 模拟数据的默认账号

开发测试可使用以下账号：

1. 学生账号:
   - 用户名: zhangsan
   - 密码: 123456

2. 老师账号:
   - 用户名: lisi
   - 密码: 654321

## 常见问题解决

### Vuex相关错误

如果遇到以下Vuex相关错误：

1. `Cannot read property 'dispatch' of undefined`
2. `Cannot read property '_modulesNamespaceMap' of undefined`

可以使用 `helpers.js` 中提供的安全访问方法：

```javascript
import { safeDispatch, safeGetState } from './store/user/baseInfo/helpers';

// 安全分发操作
safeDispatch('getUserInfo').then(userInfo => {
  console.log('用户信息', userInfo);
}).catch(error => {
  console.error('获取用户信息失败', error);
});

// 安全获取状态
const userName = safeGetState('name');
console.log('用户名', userName);
```

### 属性重复定义

如果遇到计算属性和数据属性重复定义的警告，请检查您的组件：

```javascript
// 错误示例
export default {
  data() {
    return {
      userRole: 'student'  // 在data中定义
    }
  },
  computed: {
    userRole() {  // 在computed中重复定义
      return this.$store.state.user.baseInfo.userInfo.role;
    }
  }
}

// 正确示例
export default {
  data() {
    return {
      // 移除 userRole 或重命名为其他名称
    }
  },
  computed: {
    userRole() {
      return this.$store.state.user.baseInfo.userInfo.role;
    }
  }
}
```

### 初始化顺序问题

如果在Vuex存储创建之前尝试访问它，可以使用以下方法处理：

1. 在组件的`created`或`mounted`钩子中进行Vuex操作
2. 使用`helpers.js`中的安全方法
3. 在调用Vuex方法前检查store是否存在 
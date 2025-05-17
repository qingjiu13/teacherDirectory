## 使用用例：

### 1. 获取用户信息示例:

```javascript
import { getUserInfo } from 'store/user/APIroute/baseInfo_api.js';

// 使用异步/await方式调用
async function loadUserData() {
  try {
    const userId = '1566454';
    const userData = await getUserInfo(userId);
    console.log('用户数据:', userData);
    // 处理获取到的用户数据
  } catch (error) {
    console.error('加载用户数据失败:', error);
  }
}

// 或使用Promise方式调用
getUserInfo('1566454')
  .then(userData => {
    console.log('用户数据:', userData);
    // 处理获取到的用户数据
  })
  .catch(error => {
    console.error('加载用户数据失败:', error);
  });
```

### 2. 更新用户信息示例:

```javascript
import { updateUserInfo } from 'store/user/APIroute/baseInfo_api.js';

// 使用异步/await方式调用
async function saveUserProfile() {
  try {
    const userId = '1566454';
    const updatedData = {
      avatar: '/path/to/new/avatar.png',
      name: '张三',
      selfIntroduction: '我是一个热爱学习的人',
      gender: '男',
      phoneNumber: '1234567890',
      wechatNumber: 'zhangsan123',
      password: '123456'
    };
    
    const result = await updateUserInfo(userId, updatedData);
    console.log('更新结果:', result);
    // 处理更新结果
  } catch (error) {
    console.error('更新用户信息失败:', error);
  }
}
```


功能介绍
我已经创建了Login_api.js文件，实现了三个用户登录相关的API函数。这些函数提供了完整的用户认证流程支持，包括判断用户是否注册过、验证登录状态以及新用户注册功能。每个函数都支持回调函数和Promise两种使用方式，满足不同开发风格的需求。
函数详细说明
1. 检查用户是否注册过 (checkUserRegistration)
这个函数使用微信登录返回的临时code向后端发送请求，检查用户是否已注册。后端会返回isRegistered的值（0表示未注册，1表示已注册）。
使用示例：
```javascript
import { checkUserRegistration } from '@/store/user/APIroute/Login_api';

// 使用Promise方式
checkUserRegistration({ code: wxLoginCode })
  .then(data => {
    console.log('用户注册状态：', data.isRegistered);
  })
  .catch(error => {
    console.error('请求失败：', error);
  });

// 使用回调方式
checkUserRegistration({
  code: wxLoginCode,
  success: (data) => {
    console.log('用户注册状态：', data.isRegistered);
  },
  fail: (error) => {
    console.error('请求失败：', error);
  }
});
```
2. 验证用户登录状态 (verifyLoginStatus)
这个函数会首先检查本地是否存在token，如果存在则携带token向后端发送请求进行验证。如果token无效或过期，会自动清除本地存储的token。
使用示例：
```javascript
import { verifyLoginStatus } from '@/store/user/APIroute/Login_api';

// 使用Promise方式
verifyLoginStatus()
  .then(data => {
    console.log('用户已登录：', data);
  })
  .catch(error => {
    console.error('未登录或登录已过期：', error);
  });

// 使用回调方式
verifyLoginStatus({
  success: (data) => {
    console.log('用户已登录：', data);
  },
  fail: (error) => {
    console.error('未登录或登录已过期：', error);
  }
});
``` 
3. 新用户注册 (registerUser)
这个函数用于新用户注册，需要传入微信登录的临时code和其他用户信息。注册成功后会自动保存返回的token到本地存储。
使用示例
```javascript
import { registerUser } from '@/store/user/APIroute/Login_api';

// 使用Promise方式
registerUser({
  code: wxLoginCode,
  nickName: '张三',
  avatarUrl: 'https://example.com/avatar.jpg',
  gender: '男',
  school: '北京大学',
  major: '计算机科学'
})
  .then(data => {
    console.log('注册成功：', data);
  })
  .catch(error => {
    console.error('注册失败：', error);
  });

// 使用回调方式
registerUser({
  code: wxLoginCode,
  nickName: '张三',
  avatarUrl: 'https://example.com/avatar.jpg',
  success: (data) => {
    console.log('注册成功：', data);
  },
  fail: (error) => {
    console.error('注册失败：', error);
  }
});
```
如何在微信登录页面集成
在wechat_login.vue页面中，您可以使用这些API函数替换现有的登录逻辑：
1. 当用户点击"微信一键登录"按钮时，先调用uni.login获取临时code
获取code后，调用checkUserRegistration检查用户是否已注册
根据注册状态，引导用户完成授权或直接登录
这样可以使登录流程更加清晰和模块化，方便后续维护和扩展
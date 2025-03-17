'use strict';

const crypto = require('crypto');
const db = uniCloud.database();
const usersCollection = db.collection('users');
const userAuthInfoCollection = db.collection('user_auth_info');

/**
 * 用户相关云函数
 * @description 处理用户登录、注册、认证等功能
 */
exports.main = async (event, context) => {
  const { action, params } = event;
  
  // 根据action执行不同的操作
  switch (action) {
    case 'login':
      return await login(params);
    case 'register':
      return await register(params);
    case 'authenticate':
      return await authenticate(params);
    case 'getUserInfo':
      return await getUserInfo(params);
    case 'updateUserInfo':
      return await updateUserInfo(params);
    default:
      return {
        code: -1,
        message: '未知操作'
      };
  }
};

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {String} params.username - 用户名或手机号
 * @param {String} params.password - 密码
 * @returns {Object} 登录结果
 */
async function login(params) {
  const { username, password } = params;
  
  if (!username || !password) {
    return {
      code: -1,
      message: '用户名和密码不能为空'
    };
  }
  
  try {
    // 查询用户
    const userResult = await usersCollection.where({
      $or: [
        { username },
        { phone: username }
      ]
    }).get();
    
    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在'
      };
    }
    
    const user = userResult.data[0];
    
    // 验证密码
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return {
        code: -1,
        message: '密码错误'
      };
    }
    
    // 更新最后登录时间
    await usersCollection.doc(user._id).update({
      last_login_date: new Date()
    });
    
    // 获取用户认证信息
    let authInfo = null;
    if (user.is_authenticated) {
      const authResult = await userAuthInfoCollection.where({
        user_id: user._id
      }).get();
      
      if (authResult.data.length > 0) {
        authInfo = authResult.data[0];
      }
    }
    
    // 返回用户信息
    return {
      code: 0,
      message: '登录成功',
      data: {
        token: generateToken(user._id),
        userInfo: {
          id: user._id,
          username: user.username,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isAuthenticated: user.is_authenticated,
          authInfo: authInfo
        }
      }
    };
  } catch (error) {
    console.error('登录失败', error);
    return {
      code: -1,
      message: '登录失败，请稍后重试'
    };
  }
}

/**
 * 用户注册
 * @param {Object} params - 注册参数
 * @param {String} params.username - 用户名
 * @param {String} params.password - 密码
 * @param {String} params.phone - 手机号
 * @param {String} params.role - 角色
 * @returns {Object} 注册结果
 */
async function register(params) {
  const { username, password, phone, role } = params;
  
  if (!username || !password || !phone || !role) {
    return {
      code: -1,
      message: '注册信息不完整'
    };
  }
  
  try {
    // 检查用户名是否已存在
    const usernameCheck = await usersCollection.where({
      username
    }).get();
    
    if (usernameCheck.data.length > 0) {
      return {
        code: -1,
        message: '用户名已存在'
      };
    }
    
    // 检查手机号是否已存在
    const phoneCheck = await usersCollection.where({
      phone
    }).get();
    
    if (phoneCheck.data.length > 0) {
      return {
        code: -1,
        message: '手机号已被注册'
      };
    }
    
    // 创建用户
    const hashedPassword = hashPassword(password);
    const now = new Date();
    
    const userResult = await usersCollection.add({
      username,
      password: hashedPassword,
      phone,
      role,
      avatar: '',
      is_authenticated: false,
      create_date: now,
      last_login_date: now,
      status: 1
    });
    
    return {
      code: 0,
      message: '注册成功',
      data: {
        token: generateToken(userResult.id),
        userInfo: {
          id: userResult.id,
          username,
          phone,
          role,
          isAuthenticated: false
        }
      }
    };
  } catch (error) {
    console.error('注册失败', error);
    return {
      code: -1,
      message: '注册失败，请稍后重试'
    };
  }
}

/**
 * 用户身份认证
 * @param {Object} params - 认证参数
 * @param {String} params.userId - 用户ID
 * @param {Object} params.authInfo - 认证信息
 * @returns {Object} 认证结果
 */
async function authenticate(params) {
  const { userId, authInfo } = params;
  
  if (!userId || !authInfo) {
    return {
      code: -1,
      message: '认证信息不完整'
    };
  }
  
  try {
    // 检查用户是否存在
    const userResult = await usersCollection.doc(userId).get();
    
    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在'
      };
    }
    
    const user = userResult.data[0];
    
    // 检查是否已认证
    if (user.is_authenticated) {
      return {
        code: -1,
        message: '用户已完成认证'
      };
    }
    
    // 保存认证信息
    const now = new Date();
    const authData = {
      user_id: userId,
      real_name: authInfo.realName,
      school: authInfo.school,
      major: authInfo.major,
      create_date: now,
      update_date: now
    };
    
    // 根据角色添加不同的认证信息
    if (user.role === 'student') {
      authData.student_id = authInfo.studentId;
      authData.target_school = authInfo.targetSchool;
      authData.target_major = authInfo.targetMajor;
    } else if (user.role === 'mentor') {
      authData.education = authInfo.education;
      authData.score = parseInt(authInfo.score) || 0;
      authData.direction = authInfo.direction;
      authData.certificate_image = authInfo.certificateImage;
    }
    
    // 保存认证信息
    await userAuthInfoCollection.add(authData);
    
    // 更新用户认证状态
    await usersCollection.doc(userId).update({
      is_authenticated: true
    });
    
    return {
      code: 0,
      message: '认证成功',
      data: {
        isAuthenticated: true,
        authInfo: authData
      }
    };
  } catch (error) {
    console.error('认证失败', error);
    return {
      code: -1,
      message: '认证失败，请稍后重试'
    };
  }
}

/**
 * 获取用户信息
 * @param {Object} params - 查询参数
 * @param {String} params.userId - 用户ID
 * @returns {Object} 用户信息
 */
async function getUserInfo(params) {
  const { userId } = params;
  
  if (!userId) {
    return {
      code: -1,
      message: '用户ID不能为空'
    };
  }
  
  try {
    // 查询用户
    const userResult = await usersCollection.doc(userId).get();
    
    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在'
      };
    }
    
    const user = userResult.data[0];
    
    // 获取用户认证信息
    let authInfo = null;
    if (user.is_authenticated) {
      const authResult = await userAuthInfoCollection.where({
        user_id: userId
      }).get();
      
      if (authResult.data.length > 0) {
        authInfo = authResult.data[0];
      }
    }
    
    // 返回用户信息
    return {
      code: 0,
      message: '获取成功',
      data: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isAuthenticated: user.is_authenticated,
        authInfo: authInfo
      }
    };
  } catch (error) {
    console.error('获取用户信息失败', error);
    return {
      code: -1,
      message: '获取用户信息失败，请稍后重试'
    };
  }
}

/**
 * 更新用户信息
 * @param {Object} params - 更新参数
 * @param {String} params.userId - 用户ID
 * @param {Object} params.userInfo - 用户信息
 * @returns {Object} 更新结果
 */
async function updateUserInfo(params) {
  const { userId, userInfo } = params;
  
  if (!userId || !userInfo) {
    return {
      code: -1,
      message: '更新信息不完整'
    };
  }
  
  try {
    // 更新用户信息
    const updateData = {};
    
    if (userInfo.avatar) {
      updateData.avatar = userInfo.avatar;
    }
    
    if (userInfo.phone) {
      // 检查手机号是否已存在
      const phoneCheck = await usersCollection.where({
        phone: userInfo.phone,
        _id: {
          $ne: userId
        }
      }).get();
      
      if (phoneCheck.data.length > 0) {
        return {
          code: -1,
          message: '手机号已被其他用户使用'
        };
      }
      
      updateData.phone = userInfo.phone;
    }
    
    if (Object.keys(updateData).length === 0) {
      return {
        code: -1,
        message: '没有需要更新的信息'
      };
    }
    
    // 更新用户
    await usersCollection.doc(userId).update(updateData);
    
    return {
      code: 0,
      message: '更新成功'
    };
  } catch (error) {
    console.error('更新用户信息失败', error);
    return {
      code: -1,
      message: '更新用户信息失败，请稍后重试'
    };
  }
}

/**
 * 生成密码哈希
 * @param {String} password - 原始密码
 * @returns {String} 哈希后的密码
 */
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

/**
 * 生成token
 * @param {String} userId - 用户ID
 * @returns {String} token
 */
function generateToken(userId) {
  // 实际应用中应该使用JWT等更安全的方式
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2);
  return Buffer.from(`${userId}:${timestamp}:${randomStr}`).toString('base64');
} 
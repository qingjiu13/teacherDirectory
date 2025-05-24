/**
 * baseInfo模块的状态
 * @module store/user/baseInfo/state
 */

export default {
    // 用户基本身份信息
    id: '1566454',
    avatar: '/static/image/defaultAvatar/teacher-man.png',
    name: '张三',
    gender: '男',
    selfIntroduction: '我是一个热爱学习的人',
    phoneNumber: '1234567890',
    password: '123456',
    isLogin: 0, // 是否登录，0为未登录，1为已登录
    isRegistered: 0, // 是否注册过
    campusAmbassador: 1, // 是否为校园大使
    userInfo:{    
        certificate: 0,//是否认证，0为未认证，1为已认证
        role: '学生',//学生或老师
        school: '北京大学',//学校
        major: '计算机科学与技术',//专业
        targetSchool: '清华大学',//目标学校
        targetMajor: '计算机科学与技术',//目标专业
        studentGrade: '大三',//学生年级
        teacherGrade: '研一',//老师年级
    }
};
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
        certificate: 0,//认证
        role: '学生',//学生或老师
        schoolId: null,//学校ID
        majorId: null,//专业ID
        targetSchoolId: null,//目标学校ID
        targetMajorId: null,//目标专业ID  
        studentGrade: '大三',//学生年级
        teacherGrade: '研一',//老师年级
    },
    jwtToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJpZCI6MSwibG9naW5fdXNlcl9rZXkiOiI0YjMwYmQ1Yy04ZDUwLTQ0OGEtYTA4Mi1kZWUxOGMwNmIyMzEifQ.sDcrRbV52iDBs2AHVI5t7_ZfqWZaZm9la861HZyRjZvsbVz2ucI-e3RsYOSkUHSACPG3SGD0_5m-pcKyYCUofg',
};
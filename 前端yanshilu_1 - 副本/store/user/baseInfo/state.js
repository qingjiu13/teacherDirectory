/**
 * baseInfo模块的状态
 * @module store/user/baseInfo/state
 */

export default {
    id: '',
    avatar: '',
    name: '',
    gender: '',
    selfIntroduction: '',
    wechatNumber: '',
    phoneNumber: '',
    password: '',
    userInfo:{    
        certificate: 0,//是否认证，0为未认证，1为已认证
        role: '',//学生或老师
        school: '',//学校
        major: '',//专业
        targetSchool: '',//目标学校
        targetMajor: '',//目标专业
        studentGrade: '',//学生年级
        teacherGrade: '',//老师年级
        teacherScore:0,//老师考研成绩
    }
}; 
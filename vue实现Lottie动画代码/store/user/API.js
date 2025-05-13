/**
 * @description 应用配置
 */

// uploadFile API配置：上传文件
export const UPLOAD_FILE_URL = 'http://localhost:8080/user/myService/uploadFile';

// API配置
export const API_BASE_URL = 'http://localhost:8080';

// AIQA测试API配置
export const AIQA_TEST_URL = 'http://localhost:8080/AIQA/test';//AIQA测试API

// MATCH API配置：筛选老师
export const MATCH_API_BASE_URL = 'http://localhost:8080/match/match';

// teacherDetails API配置：加载老师详细信息
export const USER_TEACHER_DETAIL_URL = 'http://localhost:8080/user/teacherDetails';

// myService API配置：我的服务
export const USER_MY_SERVICE_URL = 'http://localhost:8080/user/myService';

// myService_Newbuilt API配置：我的服务
export const USER_MY_SERVICE_NEWBUILT_URL = 'http://localhost:8080/user/myService_Newbuilt';

// myService_delete API配置：我的服务
export const USER_MY_SERVICE_DELETE_URL = 'http://localhost:8080/user/myService_delete';

// getUserInfo API配置：拉取默认信息
export const USER_GET_USER_INFO_URL = 'http://localhost:8080/user/getUserInfo';

// getCourse   API配置：拉取课程信息
export const COURSE_GET_COURSE_URL = 'http://localhost:8080/course/getCourse';

// getOrder API配置：订单查询
export const ORDER_GET_ORDER_URL = 'http://localhost:8080/order/getOrder';

// updateUserInfo API配置：更新用户信息
export const USER_UPDATE_USER_INFO_URL = 'http://localhost:8080/user/updateUserInfo';

// getBalance API配置：账单查询
export const TRANSACTION_GET_TRANSACTION_URL = 'http://localhost:8080/transaction/getTransaction';

// wetherSignIn API配置：判断是否注册过
export const LOGIN_WETHER_SIGN_IN_URL = 'http://localhost:8080/login/wetherSignIn';

// login API配置：用户登录
export const LOGIN_URL = 'http://localhost:8080/login/login';

// SignIn API配置：用户注册
export const LOGIN_SIGN_IN_URL = 'http://localhost:8080/login/SignIn';

// auto API配置：自动资格认证
export const QUALIFICATION_AUTO_URL = 'http://localhost:8080/qualification/anto';

// manual API配置：手动资格认证
export const QUALIFICATION_MANUAL_URL = 'http://localhost:8080/qualification/manual';

// getQualification API配置：获取资格认证信息
export const QUALIFICATION_GET_QUALIFICATION_URL = 'http://localhost:8080/qualification/getQualification';

// question API配置：AI问答
export const AIQA_QUESTION_URL = 'http://localhost:8080/AIQA/question';

// getHistory API配置：获取问答历史
export const AIQA_GET_HISTORY_URL = 'http://localhost:8080/AIQA/getHistory';

// deleteHistory API配置：删除问答历史
export const AIQA_DELETE_HISTORY_URL = 'http://localhost:8080/AIQA/deleteHistory';

// getHistoryDetail API配置：获取问答历史详情
export const AIQA_GET_HISTORY_DETAIL_URL = 'http://localhost:8080/AIQA/getHistoryDetail';

// generatePaymentUrl API配置：生成支付链接
export const PAY_GENERATE_PAYMENT_URL = 'http://localhost:8080/pay/generatePaymentUrl';

// 其他全局配置
export const APP_CONFIG = {
  APP_NAME: '研师录',
  VERSION: '1.0.0'
}; 
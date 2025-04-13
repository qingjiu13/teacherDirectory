# 状态管理架构说明

本项目使用Vuex进行状态管理，采用模块化设计，按照用户角色（教师/学生）和功能进行划分，以提高代码的可维护性和可扩展性。

## 目录结构

```
store/
├── index.js                # 主入口文件
├── modules/                # 模块目录
│   ├── common/             # 共享模块（老师和学生共用）
│   │   ├── auth.js         # 认证模块
│   │   ├── user.js         # 用户基本信息
│   │   ├── app.js          # 应用全局状态
│   │   ├── message.js      # 消息通知
│   │   ├── settings.js     # 用户设置
│   │   └── ai-chat.js      # AI聊天功能
│   ├── teacher/            # 教师特有模块
│   │   ├── index.js        # 教师模块入口
│   │   ├── students.js     # 学生管理
│   │   ├── courses.js      # 课程管理
│   │   ├── statistics.js   # 统计分析
│   │   └── schedule.js     # 课程安排
│   └── student/            # 学生特有模块
│       ├── index.js        # 学生模块入口
│       ├── courses.js      # 已选课程
│       ├── learning.js     # 学习进度
│  
├── services/               # API服务
│   ├── index.js            # 服务入口
│   ├── auth.api.js         # 认证相关API
│   ├── common.api.js       # 共享API
│   ├── teacher.api.js      # 教师特有API
│   ├── student.api.js      # 学生特有API
│   ├── course.api.js       # 课程相关API
│   ├── order.api.js        # 订单相关API
│   └── ai-chat.api.js      # AI聊天API
└── types/                  # 类型定义
    └── index.js            # 类型定义入口
```

## 架构说明

### 1. 核心设计原则

- **角色分离**：将教师和学生的功能完全分离，避免混淆
- **共享复用**：提取共享模块，减少代码重复
- **高内聚低耦合**：每个模块专注于特定功能，减少模块间依赖
- **命名空间**：使用命名空间隔离不同模块的状态和行为

### 2. 模块划分

#### 2.1 共享模块（common）

这些模块包含教师和学生共用的功能：

- **认证（auth）**：处理登录、注册、登出等认证相关功能
- **用户信息（user）**：管理用户基本信息
- **应用状态（app）**：全局应用状态，如加载状态、主题设置等
- **消息通知（message）**：系统通知和用户间消息
- **设置（settings）**：用户偏好设置
- **AI聊天（ai-chat）**：AI对话功能，支持聊天历史管理、会话创建和删除等

#### 2.2 教师模块（teacher）

教师特有的功能模块：

- **学生管理（students）**：查看和管理学生信息
- **课程管理（courses）**：创建和管理课程
- **统计分析（statistics）**：教学数据分析
- **课程安排（schedule）**：排课和课程时间管理

#### 2.3 学生模块（student）

学生特有的功能模块：

- **已选课程（courses）**：学生选课列表和课程详情
- **学习进度（learning）**：课程学习进度跟踪

### 3. API服务（services）

将所有API调用集中在services目录下，按功能区分不同的API文件，方便统一管理和复用。

### 4. 使用方式

```javascript
// 在组件中使用
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    // 根据用户角色使用不同的状态
    ...mapGetters('auth', ['isTeacher', 'isStudent']),
    
    // 教师特有状态
    ...mapState('teacher/students', {
      teacherStudentsList: state => state.studentsList
    }),
    
    // 学生特有状态
    ...mapState('student/courses', {
      enrolledCourses: state => state.enrolledCourses
    }),
    
    // 共享状态
    ...mapState('message', ['notifications'])
  },
  
  methods: {
    // 调用actions
    ...mapActions('auth', ['login', 'logout']),
    ...mapActions('teacher/students', ['fetchStudentsList']),
    ...mapActions('student/courses', ['fetchEnrolledCourses'])
  }
}
```

## 扩展指南

添加新功能时，应遵循以下原则：

1. 确定功能属于哪个角色（共享、教师特有、学生特有）
2. 在对应目录下创建新模块文件
3. 在相应的入口文件中导入并注册新模块
4. 添加相关的API服务
5. 保持代码风格一致，使用JSDoc注释

## 注意事项

- 使用命名空间访问模块状态和操作
- 避免不必要的状态共享，减少模块间耦合
- 添加详细的代码注释，特别是对复杂逻辑的解释
- 保持一致的代码风格和命名规范

## API按需加载

在应用优化过程中，我们将API调用与用户点击事件绑定，避免在程序启动时就加载所有数据。主要更新如下：

### 更新的文件

1. `store/index.js` - 修改了初始化函数，将API调用拆分为按需加载的独立函数
   - `initializeApp()` - 轻量级版本，只检查登录状态
   - `loadTeacherData()` - 教师数据按需加载
   - `loadStudentData()` - 学生数据按需加载
   - `loadMatchRecommendations()` - 匹配推荐数据按需加载

2. 页面更新
   - `pages/match/match.uvue` - 匹配页面加载时调用`loadMatchRecommendations()`
   - `pages/teacher/teacher.uvue` - 教师页面加载时调用`loadTeacherData()`
   - `pages/mine/mine/mine_common.uvue` - 根据用户角色调用相应的数据加载函数
   - `pages/AI/AI.uvue` - AI聊天页面按需加载聊天历史

### 使用方法

在需要加载特定模块数据的页面中，导入相应的加载函数并在合适的生命周期钩子中调用:

```js
import store, { loadTeacherData } from '@/store/index.js'

export default {
  async onLoad() {
    try {
      await loadTeacherData();
      // 后续操作...
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }
}
```

这种方式确保数据只在用户需要时才加载，提高了应用的启动速度和性能。 
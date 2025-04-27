# 筛选框组件使用说明

## 组件概述

本文件夹包含两个主要的筛选框（下拉选择框）实现：
1. **单输入筛选框** - 基于 `undergraduate_school.js`，适用于简单的单字段筛选场景
2. **联合输入筛选框** - 基于 `graduate_school_major.js`，适用于有父子关系的级联筛选场景（例如：学校和专业）

两种筛选框均使用 Fuse.js 实现模糊搜索功能，支持不严格匹配的智能搜索。

## 单输入筛选框

### 特点
- 单一数据源筛选
- 模糊搜索
- 可自定义匹配阈值和排序规则

### 使用方法

```vue
<ChoiceSelected
  class="form-select"
  :choiceIndex="selectedIndex"
  :choiceList="dataList"
  defaultText="请选择数据"
  mode="search"
  searchPlaceholder="输入关键词搜索"
  @onChoiceClick="handleSelect"
  @search-input="handleSearch"
/>
```

```javascript
// 引入数据源
import UndergraduateStore from '../../components/combobox/undergraduate_school.js';

// 在组件方法中实现处理函数
methods: {
  handleSelect(index) {
    this.selectedIndex = index;
  },
  
  handleSearch(keyword) {
    // 使用 store 提供的筛选功能
    UndergraduateStore.actions.updateFilterKeyword({
      commit: (mutation, payload) => {
        UndergraduateStore.mutations[mutation](this.storeState, payload);
      }
    }, keyword);
    
    // 更新筛选列表
    this.dataList = UndergraduateStore.getters.filteredSchools(this.storeState);
  }
}
```

## 联合输入筛选框

### 特点
- 支持父子级联关系（如学校-专业）
- 父选项变更时自动更新子选项
- 支持分页加载
- 双重模糊搜索能力

### 使用方法

```vue
<!-- 父级选择框 -->
<ChoiceSelected
  class="form-select"
  componentType="parentType"
  :choiceIndex="parentIndex"
  :choiceList="parentList"
  defaultText="请选择父项"
  mode="search"
  searchPlaceholder="搜索父项"
  @onChoiceClick="handleParentSelect"
  @search-input="handleParentSearch"
  ref="parentDropdown"
/>

<!-- 子级选择框 -->
<ChoiceSelected
  class="form-select"
  componentType="childType"
  :choiceIndex="childIndex"
  :choiceList="childList"
  :parentValue="selectedParent" 
  :isLinkage="true"
  :defaultText="selectedParent ? '请选择子项' : '请先选择父项'"
  mode="search"
  searchPlaceholder="搜索子项"
  @onChoiceClick="handleChildSelect"
  @search-input="handleChildSearch"
  @reset-selection="resetChildSelection"
  ref="childDropdown"
/>
```

```javascript
// 引入级联数据源
import GraduateStore from '../../components/combobox/graduate_school_major.js';

methods: {
  // 父级选择处理
  handleParentSelect(index, value) {
    this.parentIndex = index;
    this.selectedParent = value;
    
    // 更新依赖关系
    GraduateStore.actions.updateSelectedSchool({
      commit: (mutation, payload) => {
        GraduateStore.mutations[mutation](this.storeState, payload);
      }
    }, value);
    
    // 重置子级选择
    this.resetChildSelection();
  },
  
  // 父级搜索处理
  handleParentSearch(keyword) {
    GraduateStore.actions.updateSchoolKeyword({
      commit: (mutation, payload) => {
        GraduateStore.mutations[mutation](this.storeState, payload);
      }
    }, keyword);
    
    // 子组件通过计算属性或watch监听筛选结果变化
  },
  
  // 子级选择处理
  handleChildSelect(index, value) {
    this.childIndex = index;
    this.selectedChild = value;
  },
  
  // 子级搜索处理
  handleChildSearch(keyword) {
    GraduateStore.actions.updateMajorKeyword({
      commit: (mutation, payload) => {
        GraduateStore.mutations[mutation](this.storeState, payload);
      }
    }, keyword);
  },
  
  // 重置子级选择
  resetChildSelection() {
    this.childIndex = -1;
    this.selectedChild = '';
  }
}
```

## 注意事项

1. 初始化：使用前需初始化数据源，例如：
   ```javascript
   // 初始化筛选器
   this.storeState = JSON.parse(JSON.stringify(GraduateStore.state));
   ```

2. 性能优化：
   - 使用计算属性（computed）或监听器（watch）响应列表变化
   - 避免频繁更新大型数据列表
   - 可考虑使用分页或虚拟滚动处理大量数据
   
3. 数据格式：
   - 单输入筛选框使用简单数组作为数据源
   - 联合筛选框使用对象嵌套数组的结构，如 `{ parent1: [child1, child2], parent2: [child3, child4] }`

4. 自定义：
   - 可根据需要调整 Fuse.js 的参数，如匹配阈值、排序方式等
   - 支持通过 CSS 自定义外观 
下拉框组件增强说明
我已经对 combobox.vue 组件进行了增强，并创建了一个示例文件展示如何使用它来实现本科生学校选择和考研学校专业联动选择。以下是主要的增强内容：
1. 组件增强内容
新增属性
    componentType：组件类型，用于区分不同的数据模式
    default：默认模式
    undergraduate：本科生学校
    graduateSchool：考研学校（父级）
    graduateMajor：考研专业（子级）
    parentValue：父级选择的值，用于联动模式
    isLinkage：是否属于联动模式
    autoCloseOthers：是否自动关闭其他下拉框
新增事件
    linkage-change：联动变化事件，当父级组件选择变化时触发
    reset-selection：重置选择事件，用于通知父组件子组件已重置
新增方法
    reset()：重置组件状态
    getSelectedValue()：获取当前选中的值
    updateDisplayContent()：更新显示内容
增强的现有功能
选项点击事件：现在会传递选中的项值作为第二个参数
条件过滤：联动模式下，如果父级未选择，子级不显示选项
自动处理联动关系：父级选择变化时，自动通知子级

2. 示例文件
本科生学校选择器
<ChoiceSelected
  mode="search"
  componentType="undergraduate"
  :choiceList="undergraduateSchools"
  :choiceIndex="selectedUndergraduateIndex"
  searchPlaceholder="输入院校名称搜索"
  @search-input="updateUndergraduateKeyword"
  @onChoiceClick="selectUndergraduateSchool"
  ref="undergraduateSelector"
/>

考研学校专业选择器
<!-- 考研院校选择 -->
<ChoiceSelected
  mode="search"
  componentType="graduateSchool"
  :choiceList="graduateSchools"
  :choiceIndex="selectedGraduateSchoolIndex"
  @search-input="updateGraduateSchoolKeyword"
  @onChoiceClick="selectGraduateSchool"
  @linkage-change="handleSchoolChange"
  ref="graduateSchoolSelector"
/>

<!-- 考研专业选择 -->
<ChoiceSelected
  mode="search"
  componentType="graduateMajor"
  :choiceList="graduateMajors"
  :choiceIndex="selectedGraduateMajorIndex"
  :parentValue="selectedGraduateSchool"
  :isLinkage="true"
  @search-input="updateGraduateMajorKeyword"
  @onChoiceClick="selectGraduateMajor"
  @reset-selection="resetMajorSelection"
  ref="graduateMajorSelector"
/>

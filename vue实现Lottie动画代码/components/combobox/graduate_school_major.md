
---

# 学校与专业搜索模块

## 简介
本模块基于 [Fuse.js](https://fusejs.io/)，实现了对**学校**和**专业**的模糊搜索功能，支持输入简称、关键词快速查找目标学校及其专业。  
主要用于考研择校、小程序智能筛选等场景。

---

## 文件结构
```plaintext
modules/
  └── searchModule.js     # 本模块
static/data/
  └── school_graduate_changed.json   # 学校与专业数据
```

---

## 功能概览

| 功能 | 描述 |
|:---|:---|
| 学校搜索 | 根据输入关键词模糊匹配学校名称或简称 |
| 专业搜索 | 在选定学校下，根据关键词匹配专业 |
| 自动推荐 | 根据关键词自动推荐匹配度最高的学校 |
| Fuse.js 高阶配置 | 宽松阈值，支持简称、省略等非完整关键词匹配 |

---

## 依赖
- `fuse.js`
- 本地学校与专业数据文件：`school_graduate_changed.json`

---

## 使用方法

### 1. 初始化搜索引擎
```javascript
dispatch('initSearch')
```
初始化学校搜索引擎（首次进入应用时调用）。

---

### 2. 搜索学校
```javascript
dispatch('updateSchoolKeyword', '北理')
```
更新搜索关键词，自动刷新匹配的学校列表。

获取当前筛选后的学校列表：
```javascript
const schools = getters.filteredSchoolList
```

---

### 3. 选择学校并搜索专业
```javascript
dispatch('selectSchool', '北京理工大学')
```
选择一个学校后，再更新专业关键词：
```javascript
dispatch('updateMajorKeyword', '计算机')
```
获取当前学校下筛选后的专业列表：
```javascript
const majors = getters.filteredMajorList
```

---

### 4. 自动选择最佳匹配学校
根据关键词智能推荐最合适的学校：
```javascript
dispatch('autoSelectSchool')
```
（自动将 `bestMatchedSchool` 作为已选学校）

---

## 核心模块说明

- **state**
  - `schools`：全部学校与专业数据。
  - `schoolKeyword`：学校搜索关键词。
  - `selectedSchool`：当前选定学校。
  - `majorKeyword`：专业搜索关键词。
  - `schoolFuse`：学校搜索引擎实例。
  - `majorFuse`：专业搜索引擎实例。

- **mutations**
  - `initSchoolFuse`：初始化学校 Fuse。
  - `setSchoolKeyword` / `setMajorKeyword`：设置关键词。
  - `setSelectedSchool`：设置选中的学校，并初始化专业 Fuse。

- **getters**
  - `filteredSchoolList`：返回当前搜索匹配的学校列表。
  - `filteredMajorList`：返回当前学校下匹配的专业列表。
  - `bestMatchedSchool`：返回当前关键词匹配度最高的学校。

- **actions**
  - `initSearch`、`updateSchoolKeyword`、`selectSchool`、`updateMajorKeyword`、`autoSelectSchool`、`reinitializeSearch`

---

## 特别说明

- **模糊搜索优化**：通过 `generateShortNames(name)` 为学校自动生成多种简称，极大提升了输入匹配宽容度。例如：
  - "北京理工大学" 可通过 "北理"、"北理工"、"理工大学" 匹配。
- **Fuse 配置特点**：
  - `threshold: 0.6` 宽松匹配，允许小错误。
  - `ignoreLocation: true` 忽略关键词位置。
  - `includeScore: true` 返回相关度得分，便于排序。

---

## 示例

```javascript
// 初始化
await store.dispatch('initSearch')

// 搜索"北航"
await store.dispatch('updateSchoolKeyword', '北航')

// 获取搜索结果
const schools = store.getters.filteredSchoolList
console.log('学校搜索结果:', schools)

// 选择学校
await store.dispatch('selectSchool', '北京航空航天大学')

// 搜索专业"软件"
await store.dispatch('updateMajorKeyword', '软件')
const majors = store.getters.filteredMajorList
console.log('专业搜索结果:', majors)
```

---

## License
MIT License

---

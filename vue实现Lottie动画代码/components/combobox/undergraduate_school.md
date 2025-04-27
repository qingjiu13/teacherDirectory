
---

# 学校搜索模块（基于 Fuse.js）

## 简介
本模块提供了基于 `Fuse.js` 的学校模糊搜索功能。  
支持学校全名、常见简称、简写（如“北理”对应“北京理工大学”）等宽松搜索体验。  
可用于高校列表筛选、智能联想推荐等功能。

---

## 依赖
- [`fuse.js`](https://fusejs.io/)
- 学校数据源：`2886所大学.json`（包含全国高校名称）

---

## 文件结构
```plaintext
└── modules
    └── searchSchools.js  （本模块）
└── static
    └── data
        └── 2886所大学.json  （学校数据）
```

---

## 核心功能

| 功能 | 描述 |
|:---|:---|
| 初始化搜索引擎 | 加载所有学校信息，并生成支持模糊搜索的索引 |
| 模糊搜索学校 | 输入关键词（如"北理"），返回相关匹配学校列表 |
| 自动选择最佳匹配 | 根据搜索关键词，智能推荐匹配度最高的学校 |
| 支持简称/缩写搜索 | 内置生成学校常见简称逻辑，增强搜索宽容性 |

---

## 使用方法

### 1. 初始化
在应用启动时调用：

```javascript
dispatch('initSearch')
```

用于生成搜索引擎（`Fuse`实例），准备搜索。

---

### 2. 搜索学校
当用户输入搜索关键词时：

```javascript
dispatch('updateFilterKeyword', '你的关键词')
```

然后通过 Getter 获取匹配的学校列表：

```javascript
computedSchools = getters.filteredSchools
```

---

### 3. 自动推荐最佳学校
如果需要自动推荐最匹配的学校（比如输入即选）：

```javascript
const bestMatch = dispatch('autoSelectBestMatch')
```

---

## 示例
```javascript
// 初始化
await store.dispatch('initSearch')

// 用户输入"北理"
await store.dispatch('updateFilterKeyword', '北理')

// 获取过滤后的学校列表
const filtered = store.getters.filteredSchools
console.log('搜索结果:', filtered)

// 获取最佳匹配
const bestMatch = await store.dispatch('autoSelectBestMatch')
console.log('最佳匹配:', bestMatch)
```

---

## 备注

- 首次使用时需调用 `initSearch` 进行索引初始化。
- 搜索支持模糊匹配、宽松匹配，关键词可为简称、拼音首字母组合等。
- 返回结果默认按相关度降序排列。
- 输入为空时返回部分热门学校（默认前100所）。

---

## 相关说明
- `generateShortNames` 函数自动提取学校常见简称（如“北京理工大学” → “北理”、“北理工”、“理工大学”）。
- 采用 `Fuse.js` 高阶配置，提升模糊搜索体验。

---

## License
MIT License

---

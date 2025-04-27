import Fuse from 'fuse.js'
import schoolData from '../../store/data/school_graduate_changed.json'

export default {
  state: {
    schools: schoolData,        // 原始学校+专业数据
    schoolKeyword: '',          // 搜索学校的关键词
    selectedSchool: '',         // 选择的学校名
    majorKeyword: '',           // 搜索专业的关键词
    schoolFuse: null,           // 学校搜索 Fuse 实例
    majorFuse: null             // 专业搜索 Fuse 实例
  },
  
  mutations: {
    setSchoolKeyword(state, keyword) {
      state.schoolKeyword = keyword
    },
    
    setSelectedSchool(state, schoolName) {
      state.selectedSchool = schoolName
      state.majorKeyword = '' // 切换学校时，清空专业搜索
      
      // 初始化当前学校的专业搜索
      if (schoolName) {
        const majors = state.schools[schoolName] || []
        
        // 为每个专业增加可能的简称和拼音首字母
        const majorItems = majors.map(major => {
          return {
            name: major,
            // 为专业添加额外的搜索字段
            display: major
          }
        })
        
        state.majorFuse = new Fuse(majorItems, {
          keys: ['name', 'display'],
          // Fuse配置 - 专业搜索
          threshold: 0.6,          // 非常宽松的阈值，允许更多模糊匹配
          includeScore: true,      // 包含分数以便排序
          shouldSort: true,        // 确保按相关性排序
          minMatchCharLength: 1,   // 最小匹配长度
          ignoreLocation: true,    // 忽略位置限制，更宽松
          findAllMatches: true,    // 找到所有匹配项
          useExtendedSearch: true, // 使用扩展搜索
          distance: 1000,          // 大的距离值
          location: 0,
          includeMatches: true     // 包含匹配详细信息
        })
      }
    },
    
    setMajorKeyword(state, keyword) {
      state.majorKeyword = keyword
    },
    
    // 初始化学校搜索 Fuse 实例，增强模糊搜索能力
    initSchoolFuse(state) {
      // 对每个学校添加额外的搜索字段，帮助匹配简称和拼音首字母
      const schoolItems = Object.keys(state.schools).map(name => {
        // 生成可能的简称组合
        const shortNames = generateShortNames(name)
        
        return {
          name: name,          // 原始学校名
          short: shortNames,   // 可能的简称
          display: name        // 显示名称
        }
      })
      
      // 创建具有高级配置的Fuse实例
      state.schoolFuse = new Fuse(schoolItems, {
        keys: [
          { name: 'name', weight: 0.7 },    // 学校全名权重较高
          { name: 'short', weight: 0.3 }     // 简称权重次之
        ],
        // Fuse配置 - 高度宽松以便能匹配简称
        threshold: 0.6,          // 非常宽松的阈值，允许更多模糊匹配
        includeScore: true,      // 包含分数以便排序
        shouldSort: true,        // 确保按相关性排序
        minMatchCharLength: 1,   // 最小匹配长度
        ignoreLocation: true,    // 忽略位置限制，更宽松
        findAllMatches: true,    // 找到所有匹配项
        useExtendedSearch: false, // 不使用扩展搜索语法
        distance: 1000,          // 大的距离值
        location: 0,
        includeMatches: true     // 包含匹配详细信息
      })
      
      console.log('搜索引擎初始化完成，包含学校:', schoolItems.length)
    }
  },
  
  getters: {
    // 学校列表（使用 Fuse.js 模糊搜索）
    filteredSchoolList(state) {
      if (!state.schoolKeyword) {
        return Object.keys(state.schools).slice(0, 50) // 限制初始显示数量
      }
      
      if (!state.schoolFuse) {
        // 如果 Fuse 未初始化，立即初始化
        this.mutations.initSchoolFuse(state)
      }

      // 优化关键词处理，移除多余空格
      let keyword = state.schoolKeyword.trim()
      
      // 使用 Fuse.js 搜索并排序
      const results = state.schoolFuse.search(keyword)
      
      // 详细记录结果信息，用于调试
      console.log('Fuse原始结果:', keyword, results.length)
      
      if (results.length > 0) {
        // 输出前5个结果及其匹配分数，帮助调试
        console.log('前5个结果:', results.slice(0, 5).map(r => ({
          name: r.item.name, 
          score: r.score,
          matches: r.matches
        })))
      }
      
      // 提取名称并返回 - 注意这里会保留Fuse返回的排序
      const names = results.map(result => result.item.name)
      
      return names
    },
    
    // 当前学校下的专业列表（使用 Fuse.js 模糊搜索）
    filteredMajorList(state) {
      if (!state.selectedSchool) {
        return []
      }
      
      const majors = state.schools[state.selectedSchool] || []
      
      if (!state.majorKeyword) {
        return majors
      }
      
      if (!state.majorFuse) {
        // 如果 Fuse 未初始化，立即初始化
        this.mutations.setSelectedSchool(state, state.selectedSchool)
      }

      // 使用 Fuse.js 搜索并排序
      const results = state.majorFuse.search(state.majorKeyword.trim())
      return results.map(result => result.item.name)
    },
    
    // 获取匹配度最高的学校（用于自动选择）
    bestMatchedSchool(state, getters) {
      if (!state.schoolKeyword || !state.schoolFuse) {
        return ''
      }
      
      const results = state.schoolFuse.search(state.schoolKeyword.trim())
      return results.length > 0 ? results[0].item.name : ''
    }
  },
  
  actions: {
    // 初始化学校搜索
    initSearch({ commit }) {
      commit('initSchoolFuse')
    },
    
    // 更新学校关键词
    updateSchoolKeyword({ commit }, keyword) {
      commit('setSchoolKeyword', keyword)
    },
    
    // 选择学校
    selectSchool({ commit }, schoolName) {
      commit('setSelectedSchool', schoolName)
    },
    
    // 更新专业关键词
    updateMajorKeyword({ commit }, keyword) {
      commit('setMajorKeyword', keyword)
    },
    
    // 自动选择最佳匹配学校
    autoSelectSchool({ commit, getters }) {
      const bestMatch = getters.bestMatchedSchool
      if (bestMatch) {
        commit('setSelectedSchool', bestMatch)
      }
    },
    
    // 强制重新初始化搜索引擎
    reinitializeSearch({ commit, state }) {
      // 清除现有实例
      state.schoolFuse = null
      // 重新初始化
      commit('initSchoolFuse')
    }
  }
}

/**
 * @description 为学校名称生成可能的简称和缩写，用于提高模糊搜索能力
 * @param {String} name - 学校完整名称
 * @returns {String} - 可能的简称组合
 */
function generateShortNames(name) {
  let shortNames = []
  
  // 提取每个字的首字母
  const initials = name.split('').filter(char => /[\u4e00-\u9fa5]/.test(char)).join('')
  
  // 处理常见模式
  // 例如："北京理工大学" => "北理" "北理工" "理工大"
  if (name.length >= 2) {
    // 取前两个字作为简称
    shortNames.push(name.substring(0, 2))
  }
  
  if (name.length >= 3) {
    // 取前三个字作为简称
    shortNames.push(name.substring(0, 3))
    
    // 地名+关键词，如"北京理工"
    const locationKeyword = name.match(/^([\u4e00-\u9fa5]{2})([\u4e00-\u9fa5]{1,3})/)
    if (locationKeyword) {
      shortNames.push(locationKeyword[1][0] + locationKeyword[2])
    }
  }
  
  if (name.length >= 4) {
    // 跳过地名，如"北京理工大学" => "理工大学"
    if (name.includes('大学') || name.includes('学院')) {
      const skipLocation = name.substring(2)
      shortNames.push(skipLocation)
    }
  }
  
  // 合并所有可能的简称
  return shortNames.join(' ')
}
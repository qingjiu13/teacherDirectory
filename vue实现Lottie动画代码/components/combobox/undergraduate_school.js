import Fuse from 'fuse.js'
import schoolList from '../../static/data/2886所大学.json'

export default {
  state: {
    schools: schoolList,
    filterKeyword: '',
    schoolFuse: null // 存储 Fuse 实例
  },
  
  mutations: {
    setFilterKeyword(state, keyword) {
      state.filterKeyword = keyword
    },
    
    // 初始化 Fuse 实例
    initFuse(state) {
      state.schoolFuse = new Fuse(
        state.schools.map(name => ({ name })),
        {
          keys: ['name'],
          threshold: 0.4, // 匹配阈值（0-1之间，越小越严格）
          includeScore: true,
          shouldSort: true, // 按匹配度排序
          minMatchCharLength: 2, // 最小匹配字符长度
          ignoreLocation: true, // 忽略字符位置
          distance: 100 // 最大匹配距离
        }
      )
    }
  },
  
  getters: {
    filteredSchools(state) {
      if (!state.filterKeyword) {
        return state.schools
      }
      
      // 如果关键词太短，使用简单匹配
      if (state.filterKeyword.length < 2) {
        return state.schools.filter(name =>
          name.toLowerCase().includes(state.filterKeyword.toLowerCase())
        )
      }
      
      if (!state.schoolFuse) {
        // 如果 Fuse 未初始化，回退到简单搜索
        return state.schools.filter(name =>
          name.toLowerCase().includes(state.filterKeyword.toLowerCase())
        )
      }

      // 使用 Fuse.js 进行模糊搜索
      const results = state.schoolFuse.search(state.filterKeyword)
      return results.map(result => result.item.name)
    },
    
    // 获取最佳匹配的学校（用于自动完成）
    bestMatchedSchool(state, getters) {
      if (!state.filterKeyword || !state.schoolFuse) return ''
      
      const results = state.schoolFuse.search(state.filterKeyword)
      return results.length > 0 ? results[0].item.name : ''
    }
  },
  
  actions: {
    updateFilterKeyword({ commit }, keyword) {
      commit('setFilterKeyword', keyword)
    },
    
    // 初始化搜索
    initSearch({ commit }) {
      commit('initFuse')
    },
    
    // 自动选择最佳匹配
    autoSelectBestMatch({ state, getters }) {
      return getters.bestMatchedSchool
    }
  }
}
import Fuse from 'fuse.js'
import majorList from '../../static/data/本科专业.json'

export default {
  state: {
    majors: majorList,
    filterKeyword: '',
    majorFuse: null // 存储 Fuse 实例
  },

  mutations: {
    setFilterKeyword(state, keyword) {
      state.filterKeyword = keyword
    },

    // 初始化 Fuse 实例
    initFuse(state) {
      const majorItems = state.majors.map(name => {
        const shortNames = generateShortNames(name)
        return {
          name: name,
          short: shortNames,
          display: name
        }
      })

      state.majorFuse = new Fuse(
        majorItems,
        {
          keys: [
            { name: 'name', weight: 0.7 },
            { name: 'short', weight: 0.3 }
          ],
          threshold: 0.6,
          includeScore: true,
          shouldSort: true,
          minMatchCharLength: 1,
          ignoreLocation: true,
          findAllMatches: true,
          distance: 1000,
          location: 0,
          includeMatches: true
        }
      )

      console.log('专业搜索引擎初始化完成，总数量:', majorItems.length)
    }
  },

  getters: {
    filteredMajors(state) {
      if (!state.filterKeyword) {
        return state.majors.slice(0, 50) // 初始显示前50个专业
      }

      if (!state.majorFuse) {
        this.mutations.initFuse(state)
      }

      const keyword = state.filterKeyword.trim()

      const results = state.majorFuse.search(keyword)

      if (results.length > 0) {
        console.log('搜索专业关键词:', keyword, '找到结果数:', results.length)
      }

      return results.map(result => result.item.name)
    },

    bestMatchedMajor(state, getters) {
      if (!state.filterKeyword || !state.majorFuse) return ''

      const results = state.majorFuse.search(state.filterKeyword.trim())
      return results.length > 0 ? results[0].item.name : ''
    }
  },

  actions: {
    updateFilterKeyword({ commit }, keyword) {
      commit('setFilterKeyword', keyword)
    },

    initSearch({ commit }) {
      commit('initFuse')
    },

    autoSelectBestMatch({ state, getters }) {
      return getters.bestMatchedMajor
    }
  }
}

/**
 * @description 为专业名称生成可能的简称组合，提高模糊搜索能力
 * @param {String} name - 专业完整名称
 * @returns {String} - 简称组合（空格分隔）
 */
function generateShortNames(name) {
  let shortNames = []

  const chineseChars = name.split('').filter(char => /[\u4e00-\u9fa5]/.test(char)).join('')

  if (chineseChars.length >= 2) {
    shortNames.push(chineseChars.substring(0, 2))
  }

  if (chineseChars.length >= 3) {
    shortNames.push(chineseChars.substring(0, 3))
  }

  return shortNames.join(' ')
}



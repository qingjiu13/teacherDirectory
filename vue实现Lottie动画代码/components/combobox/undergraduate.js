import Fuse from 'fuse.js'

export default function createDataModule(dataList) {
  return {
    state: {
      data: dataList,
      filterKeyword: '',
      dataFuse: null // 存储 Fuse 实例
    },

    mutations: {
      setFilterKeyword(state, keyword) {
        state.filterKeyword = keyword
      },

      // 初始化 Fuse 实例
      initFuse(state) {
        const dataItems = state.data.map(name => {
          const shortNames = generateShortNames(name)
          return {
            name: name,         // 原数据名
            short: shortNames,  // 生成的简称组合
            display: name       // 可显示名（备用）
          }
        })

        state.dataFuse = new Fuse(
          dataItems,
          {
            keys: [
              { name: 'name', weight: 0.7 },   // 正式全名匹配，权重大
              { name: 'short', weight: 0.3 }   // 简称匹配，权重小
            ],
            threshold: 0.6,          // 宽松匹配
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

        console.log('数据搜索引擎初始化完成，总数量:', dataItems.length)
      }
    },

    getters: {
      filteredData(state) {
        if (!state.filterKeyword) {
          return state.data.slice(0, 30) // 限制初始显示数量（比如前30个）
        }

        if (!state.dataFuse) {
          this.mutations.initFuse(state)
        }

        const keyword = state.filterKeyword.trim()

        const results = state.dataFuse.search(keyword)

        if (results.length > 0) {
          console.log('搜索关键词:', keyword, '找到结果数:', results.length)
        }

        return results.map(result => result.item.name)
      },

      // 获取最佳匹配的数据（用于自动完成）
      bestMatchedData(state, getters) {
        if (!state.filterKeyword || !state.dataFuse) return ''

        const results = state.dataFuse.search(state.filterKeyword.trim())
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
        return getters.bestMatchedData
      }
    }
  }
}

/**
 * @description 为名称生成可能的简称组合，用于提高模糊搜索能力
 * @param {String} name - 完整名称
 * @returns {String} - 可能的简称组合（空格分隔）
 */
function generateShortNames(name) {
  let shortNames = []

  const chineseChars = name.split('').filter(char => /[\u4e00-\u9fa5]/.test(char)).join('')

  if (chineseChars.length >= 2) {
    shortNames.push(chineseChars.substring(0, 2)) // 前两个字
  }

  if (chineseChars.length >= 3) {
    shortNames.push(chineseChars.substring(0, 3)) // 前三个字
    const match = chineseChars.match(/^([\u4e00-\u9fa5]{2})([\u4e00-\u9fa5]{1,3})/)
    if (match) {
      shortNames.push(match[1][0] + match[2]) // 地名+关键词，比如"北理"
    }
  }

  if (chineseChars.length >= 4 && (name.includes('大学') || name.includes('学院'))) {
    shortNames.push(chineseChars.substring(2)) // 去掉地名
  }

  return shortNames.join(' ')
}

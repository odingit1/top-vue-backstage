import type { RouteLocationNormalized } from 'vue-router'
import { defineStore } from 'pinia'
import { TabBarState, TagProps } from './types'

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route
  return {
    title: meta.locale || '',
    name: String(name),
    fullPath,
    query,
  }
}

const useAppStore = defineStore('tabBar', {
  state: (): TabBarState => ({
    cacheTabList: new Set(),
    tagList: [
      // Set the first element dynamically as needed
      {
        title: 'me.account',
        name: 'MeInfo',
        fullPath: '/me',
      },
    ],
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList)
    },
  },

  actions: {
    updateTabList(route: RouteLocationNormalized) {
      if (route.name === 'MeInfo') return
      this.tagList.push(formatTag(route))
      if (!route.meta.ignoreCache) {
        this.cacheTabList.add(route.name as string)
      }
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1)
      this.cacheTabList.delete(tag.name)
    },
  },
})

export default useAppStore

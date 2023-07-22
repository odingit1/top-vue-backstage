<script lang="tsx">
import { defineComponent, ref, h, compile, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { useMeStore,useAppStore } from '@/store'
import { listenerRouteChange } from '@/utils/routeListener'
export default defineComponent({
  emit: ['collapse'],
  setup() {
    const { t } = useI18n()
    const appStore = useAppStore()
   
    const router = useRouter()
    const collapsed = computed({
      get() {
        return appStore.menuCollapse
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value })
      },
    })

    const selectedKey = ref<string[]>([])
    const defaultOpenKeys = ref<string[]>([])
    const goto = (item: RouteRecordRaw) => {
      router.push({
        name: item.name,
      })
}

    listenerRouteChange((newRoute) => {
      if (newRoute.meta.requiresAuth && !newRoute.meta.hideInMenu) {
        if (newRoute.meta.activeMenu) {
          selectedKey.value = [newRoute.meta.activeMenu]
        } else {
          const key = newRoute.matched[newRoute.matched.length - 1]
            ?.name as string
          selectedKey.value = [key]
        }
        defaultOpenKeys.value = [newRoute.name.split('_')[0]]||[]
      }
   
    }, true)
    const setCollapse = (val: boolean) => {
      appStore.updateSettings({ menuCollapse: val })
    }
  
    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
        
            // This is demo, modify nodes as needed
            const icon = element?.meta?.icon
              ? () => h(compile(`<${element?.meta?.icon}/>`))
              : null
            const node =
              element?.children && element?.children.length !== 0 ? (
                <a-sub-menu
                  key={element?.name}
                  v-slots={{
                    icon,
                    title: () => h(compile(t(element?.meta?.locale || ''))),
                  }}
                >
                  {travel(element?.children)}
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element?.name}
                  v-slots={{ icon }}
                  onClick={() => goto(element)}
                >
                  {t(element?.meta?.locale || '')}
                </a-menu-item>
              )
            nodes.push(node as never)
          })
        }
        return nodes
      }
    
      return travel(useMeStore().allConfMenu as any)
    }

    return () => (
        
      <a-menu
      v-model:collapsed={collapsed.value}
        show-collapse-button
        auto-scroll-into-view={true}
        selected-keys={selectedKey.value}
        default-open-keys={defaultOpenKeys.value}
        default-selected-keys={selectedKey.value}
        level-indent={34}
        style="height: 100%"
        onCollapse={setCollapse}
        accordion
      >
        {renderSubMenu()}
      </a-menu>
    )
  },
})
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
    .arco-menu-inline-header {
        display: flex;
        align-items: center;
    }

    .arco-icon {
        &:not(.arco-icon-down) {
            font-size: 18px;
        }
    }
}
</style>

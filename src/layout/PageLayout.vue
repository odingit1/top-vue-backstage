<template>
    <RouterView v-slot="{ Component, route }">

        <transition name="fade" mode="out-in" appear>
            <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
            <KeepAlive v-else :include="cacheList">
                <component :is="Component" :key="route.fullPath" />
            </KeepAlive>
        </transition>
    </RouterView>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useTabBarStore } from '@/store'
import { useRoute } from 'vue-router'
const isChildrenRoute = computed(() => {
    return JSON.stringify(useRoute().matched[0].meta) === '{}'
})
import { appInfoStore, useMeStore } from '@/store'
import { onMounted } from 'vue'
import { rootadminplatform, appallapp } from '@/api/me'
const tabBarStore = useTabBarStore()
const meStore = useMeStore()
const cacheList = computed(() => tabBarStore.getCacheList)

const appInfo = appInfoStore()
const getData = async () => {
    const platform = await rootadminplatform()
    const platform_list = platform.data.data || []
    appInfo.platform_data = platform_list
    const allapp = await appallapp()
    const allapp_list = allapp.data.List || []
    appInfo.allapp_data = allapp_list
}
onMounted(() => {
    getData()
    meStore.menuInfo()
})
</script>\

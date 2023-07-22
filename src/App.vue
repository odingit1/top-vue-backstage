<template>
    <AConfigProvider :locale="locale">
        <RouterView />
    </AConfigProvider>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import useLocale from '@/hooks/locale'
import { useMeStore } from '@/store'
import { useRouter } from 'vue-router'
const route = useRouter()
const routerArr = useMeStore().allConfMenu
const { currentLocale } = useLocale()
const locale = computed(() => {
    switch (currentLocale.value) {
        case 'zh-CN':
            return zhCN
        case 'en-US':
            return enUS
        default:
            return enUS
    }
})

</script>

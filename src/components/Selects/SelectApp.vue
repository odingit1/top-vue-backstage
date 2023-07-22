<template>
    <ASelect :model-value="value" placeholder="请选择包网信息" :disabled="disabled" allow-search allow-clear :loading="isLoading"
        :multiple="multiple" @popup-visible-change="onClick" @change="updateValue" :max-tag-count="3">
        <AOption v-for="item of appInfo.allapp_data" :key="item.appid" :value="item.appid"
            :label="`${item.appName}【${item.appid ? item.appid : 0}】`" class="option-box" />
    </ASelect>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'

export interface appOption {
    appid: number
    appName: string
    platform: number
    sale_type: number
}
import { appInfoStore } from '@/store'
const appInfo = appInfoStore()
const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: [Number, String, Array],
        default() {
            return null
        },
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: '',
    },
})

const isLoading = ref(false)
const isCheckAll = ref(false)
const options = ref<appOption[]>([])

const checkAll = () => {
    if (isCheckAll.value) {
        return emit(
            'update:value',
            appInfo.allapp_data.map((x: appOption) => x.appid)
        )
    }
    return emit('update:value', [])
}
const onClick = () => {
    if (options.value.length) return
}

const updateValue = (value: number) => {
    emit('update:value', value)
}
</script>
  
<style scoped lang="scss"></style>
  
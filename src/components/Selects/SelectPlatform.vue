<template>
    <ASelect :model-value="value" placeholder="请选择平台信息" :disabled="disabled" allow-search allow-clear :loading="isLoading"
        :multiple="multiple" @popup-visible-change="onClick" @change="updateValue" :max-tag-count="3">
        <AOption v-for="item of appInfo.platform_data" :key="item.id" :value="item.id" :label="`${item.name}【${item.id}】`"
            class="option-box" />
    </ASelect>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'

export interface platformOption {
    id: number
    name: string
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
    placeholder: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

const isLoading = ref(false)
const isCheckAll = ref(false)
const options = ref<platformOption[]>([])

const checkAll = () => {
    if (isCheckAll.value) {
        return emit(
            'update:value',
            appInfo.platform_data.map((x: platformOption) => x.id)
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
  
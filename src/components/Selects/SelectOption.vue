<template>
    <ASelect :model-value="value" :placeholder="placeholder" allow-clear allow-search :loading="isLoading"
        @popup-visible-change="onClick" @change="updateValue">
        <AOption v-for="option of Object.keys(options)" :key="options[option]" :value="options[option]"
            :label="$t(`${labelHead}.${labelUseValue ? options[option] : option}`)" class="option-box" />
    </ASelect>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { requestHandler } from '@/utils/tool'
// import { queryOptions, OptionParams } from '@/api/option'

const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: String,
        default: null,
    },
    placeholder: {
        type: String,
        default: '',
    },
    model: {
        type: String,
        default: '',
    },
    column: {
        type: String,
        default: '',
    },
    labelHead: {
        type: String,
        default: 'option',
    },
    labelUseValue: {
        type: Boolean,
        default: false,
    },
})

const options = ref([])
const isLoading = ref(false)
const onClick = () => {
    if (Object.keys(options.value).length) return
    fetchData()
}

const updateValue = (value: number) => {
    emit('update:value', value)
}
const fetchData = requestHandler(async () => {
    if (!props.model || !props.column) return
    // const response = await queryOptions({
    //     model: props.model,
    //     column: props.column,
    // } as OptionParams)
    // options.value = response.data
}, isLoading)
</script>

<style scoped lang="scss"></style>

<template>
    <ASelect :model-value="value" :placeholder="placeholder ? $t(`${placeholder}`) : $t(`${label}`)" allow-clear
        allow-search :loading="isLoading" @change="updateValue">
        <AOptgroup v-if="group" v-for="optgroup of selectList as any" :label="optgroup.tag_name">
            <AOption v-for="option of optgroup.tag_name_list" :value="option[optionValue]" :label="option[optionName]"
                class="option-box">{{ option[optionName] }}({{ option[optionValue] }})</AOption>
        </AOptgroup>
        <AOption v-else v-for="option of selectList as any" :key="option[optionValue]" :value="option[optionValue]"
            :label="option[optionName]" class="option-box" />
    </ASelect>
</template>
  
<script lang="ts" setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: String,
        default: null,
    },
    label: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: null,
    },
    group: {
        type: Boolean,
        default: false,
    },
    optionName: {
        type: String,
        default: 'name',
    },
    optionValue: {
        type: String,
        default: 'value',
    },
    selectionArr: {
        type: Array,
        default() {
            return []
        },
    },
})
const isLoading = ref(false)
const selectList = computed(() => {
    if (props.selectionArr.length) {
        return props.selectionArr
    }
    return []
})

const updateValue = (value: string) => {
    emit('update:value', value)
}
</script>
  
<style scoped lang="scss"></style>
  
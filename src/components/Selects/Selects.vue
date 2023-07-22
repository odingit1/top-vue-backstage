<template>
    <component :is="selectComponent" :label="label" :group="group" :type="type" :optionName="optionName"
        :optionValue="optionValue" :generals="generals" :value="modelValue" :parent-value="parentValue" :multiple="multiple"
        :disabled="disabled" :selection-arr="selectionArr" @update:value="updateValue" />
</template>
  
<script lang="ts" setup>
import { watch, computed } from 'vue'
import SelectGames from './SelectGame.vue'
import SelectUniversal from './SelectUniversal.vue'
import SelectPlatform from './SelectPlatform.vue'
import SelectApp from './SelectApp.vue'
const emit = defineEmits(['onChangeParent', 'update:value'])
const props = defineProps({
    modelValue: {
        type: [Number, String, Array],
        default() {
            return null
        },
    },
    selectionArr: {
        type: Array,
        default() {
            return []
        },
    },
    generals: {
        type: [Array, Number],
        default() {
            return null
        },
    },

    label: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: null,
    },
    parentKey: {
        type: String,
        default: null,
    },
    parentValue: {
        type: [String, Number],
        default: null,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
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
})
const selectComponent = computed(() => {
    switch (props.type) {
        case 'plat_id':
            return SelectPlatform
        case 'app_id':
            return SelectApp
        case 'gameId':
            return SelectGames
        default:
            return SelectUniversal
    }
})
const updateValue = (value: number | string) => {
    emit('update:value', value)
}
watch(
    () => props.parentValue,
    () => {
        if (!props.parentKey) return
        emit('onChangeParent')
    }
)
</script>
  
<style scoped lang="scss"></style>
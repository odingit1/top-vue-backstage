<template>
  <ASelect
    :model-value="value"
    :placeholder="placeholder ? placeholder : null"
    :allow-clear="!required"
    allow-search
    @change="updateValue"
  >
    <AOption
      v-for="option of options"
      :key="option.id"
      :value="option.id"
      :label="option.name"
      class="option-box"
    />
  </ASelect>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  optionText: {
    type: Array,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const options = computed(() => {
  return [
    { id: 0, name: props.optionText[0] },
    { id: 1, name: props.optionText[1] },
  ]
})
const updateValue = (value: number) => {
  emit('update:value', value)
}
</script>

<style scoped lang="scss"></style>

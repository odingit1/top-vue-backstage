<template>
  <div>
    <span
      :style="{
        color: contentValue.hasOwnProperty('color')
          ? contentValue.color
          : '#000',
      }"
    >
      {{ contentValue.name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps({
  fieldKeyList: {
    type: Object,
    default() {
      return []
    },
  },
  field: {
    type: String,
    default: null,
    require: true,
  },
  data: {
    type: Number,
    default: null,
    require: true,
  },
})

const contentValue = computed(() => {
  const obj = props.fieldKeyList.find(
    (item: any) => item.value == props.data
  ) || {
    name: '',
  }

  return obj
})
</script>

<style scoped lang="scss"></style>

<template>
  <ATypographyText :type="isNegativeNumber ? 'danger' : 'success'">
    {{ isNegativeNumber ? '' : '+' }}
    {{ amount }}
  </ATypographyText>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
// import { getPoint } from '@/utils/utils'
const props = defineProps({
  amount: {
    type: [String, Number],
    default: 0,
  },
  rate: {
    type: [String],
    default: [],
  },
  point: {
    type: [String],
    default: [],
  },
})
const valueNum = computed(() => {
  return JSON.stringify(props.amount).includes('-')
})
const isNegativeNumber = computed(() => {
  return JSON.stringify(props.amount).includes('-')
})
</script>

<style scoped lang="scss"></style>

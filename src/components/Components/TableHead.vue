<template>
  <ASpace>
    <span :class="hasTip ? 'pl-3' : ''">
      {{ $t(title) }}
      <span v-for="text in titleArray" :key="text">
        {{ $t(`${text}`) }}
      </span>
    </span>
    <ATooltip v-if="hasTip" :content="$t(tip)">
      <iconExclamationCircle />
    </ATooltip>
  </ASpace>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleArray: {
    type: Array,
    default() {
      return []
    },
  },
  tip: {
    type: String,
    default: null,
  },
})
const hasTip = computed(() => {
  return Boolean(props.tip)
})
</script>

<style scoped lang="scss"></style>

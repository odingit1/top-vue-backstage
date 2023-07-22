<template>
  <ASpace :size="size" fill align="start" :direction="direction">
    <ATypography
      v-for="item in infoData"
      :key="item.key"
      class="flex items-center flex-wrap"
    >
      <ATypographyText type="secondary" class="pr-2">
        {{ $t(item.label) }} :
      </ATypographyText>
      <slot name="content">
        <ATypographyText
          v-if="priceTypeList.includes(item.label.replace('label.', ''))"
        >
          {{ formatThousandsSeparator(item.value) || '-' }}
        </ATypographyText>
        <ATypographyText
          v-else-if="counterTypeList.includes(item.label.replace('label.', ''))"
        >
          {{ formatThousandsSeparator(item.value, false) || '-' }}
        </ATypographyText>
        <ATypographyText v-else>
          {{ item.value || item.value === 0 ? item.value : '-' }}
        </ATypographyText>
      </slot>
    </ATypography>
  </ASpace>
</template>

<script lang="ts" setup>
import { formatThousandsSeparator } from '@/utils/tool'

const props = defineProps({
  infoData: {
    type: Array,
    default() {
      return []
    },
  },
  priceTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  counterTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  direction: {
    type: String,
    default: 'horizontal',
  },
  size: {
    type: Number,
    default: 20,
  },
})
</script>

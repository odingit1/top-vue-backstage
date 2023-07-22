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
        <ATag v-if="item.label === 'label.vipLevel'" bordered size="small">
          {{ item.value }}
        </ATag>
        <ATypographyText
          v-else-if="item.isPrice || item.isCounter"
          :type="checkPriceStyle(item)"
        >
          {{
            formatThousandsSeparator(item.value, Boolean(item.isPrice)) || '-'
          }}
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
  direction: {
    type: String,
    default: 'vertical',
  },
  size: {
    type: Number,
    default: 4,
  },
})

const checkPriceStyle = (item) => {
  if (item.priceStyle) {
    return String(item.value).includes('-') ? 'danger' : 'success'
  }
  return ''
}
</script>

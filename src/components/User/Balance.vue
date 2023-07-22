<template>
  <ASpace>
    <ATypographyText type="secondary">
      {{ $t('label.balance') }} :
    </ATypographyText>
    <ATypographyText>
      {{ formatThousandsSeparator(balance) }}
    </ATypographyText>
    <!-- <AButton type="text" class="px-1" @click="updateBalance">
      <iconLoading v-if="isLoadingBalance" />
      <iconRefresh v-else />
    </AButton> -->
  </ASpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { formatThousandsSeparator } from '@/utils/tool'

const props = defineProps({
  balance: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
    default: null,
  },
})

const isLoadingBalance = ref(false)
const updateBalance = () => {
  if (isLoadingBalance.value) return
  isLoadingBalance.value = true
  setTimeout(() => {
    isLoadingBalance.value = false
  }, '1000')
}
</script>

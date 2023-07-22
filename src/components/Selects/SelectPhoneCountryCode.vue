<template>
  <ASelect
    :model-value="value"
    :placeholder="$t('label.countryCode.placeholder')"
    allow-clear
    allow-search
    :loading="isLoading"
    @popup-visible-change="onClick"
    @change="updateValue"
  >
    <AOption
      v-for="option of countryCode"
      :key="option.phone_code"
      :value="option.phone_code"
      :label="`+【${option.phone_code}】${option.cn}`"
      class="option-box"
    >
    </AOption>
  </ASelect>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { countryCode } from '@/timezone'

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const isLoading = ref(false)
const options = ref([])
const onClick = () => {
  if (options.value.length) return
}

const updateValue = (value: number) => {
  emit('update:value', value)
}
</script>

<style scoped lang="scss"></style>

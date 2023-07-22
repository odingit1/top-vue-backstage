<template>
  <ABreadcrumb class="my-2 sm:my-4 container-breadcrumb">
    <ABreadcrumbItem>
      <IconApps />
    </ABreadcrumbItem>
    <ABreadcrumbItem v-for="item in items" :key="item">
      {{ $t(item) }}
    </ABreadcrumbItem>
  </ABreadcrumb>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  items: {
    type: Array as PropType<string[]>,
    default() {
      return []
    },
  },
})
</script>

<style scoped lang="less">
.container-breadcrumb {
  :deep(.arco-breadcrumb-item) {
    color: rgb(var(--gray-6));
    &:last-child {
      color: rgb(var(--gray-8));
    }
  }
}
</style>

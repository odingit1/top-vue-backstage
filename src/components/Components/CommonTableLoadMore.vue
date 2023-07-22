@@ -0,0 +1,58 @@
<template>
  <ATable
    :row-key="rowKey"
    :data="data"
    :pagination="pagination"
    :loading="isLoading"
    :bordered="{ cell: true }"
    :scroll="{ x: isMobile ? '414px' : '800px', y: '50vh' }"
    page-position="bottom"
    :align="'center'"
    :stripe="true"
    :load-more="loadMore"
    @page-change="onPageChange"
    @page-size-change="changePageSize"
  >
    <template #columns>
      <slot name="content" />
    </template>
  </ATable>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { useAppStore } from '@/store'

const emit = defineEmits(['onPageChange'])
const props = defineProps({
  data: {
    type: Array,
    default() {
      return []
    },
  },
  rowKey: {
    type: String,
    default: 'key',
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizeOptions: {
    type: Array,
    default() {
      return [10, 20, 50, 100]
    },
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
  loadMore: {
    type: Function,
    default() {
      return null
    },
  },
})

const appStore = useAppStore()
const isMobile = computed(() => appStore.device === 'mobile')
const pagination = reactive({
  current: props.currentPage,
  pageSize: props.pageSize,
  pageSizeOptions: props.pageSizeOptions,
  total: props.totalCount,
  simple: true,
  showJumper: true,
  showPageSize: true,
  showTotal: true,
})
const onPageChange = async (currentPage: number) => {
  pagination.current = currentPage
  await emit('onPageChange', pagination)
}
const changePageSize = (pageSize: number) => {
  pagination.pageSize = pageSize
  onPageChange(1)
}

watch(
  [() => props.totalCount, () => props.currentPage],
  ([totalCount, current]) => {
    if (pagination.total !== totalCount) {
      pagination.total = totalCount
    }
    if (pagination.current !== current) {
      pagination.current = current
    }
  }
)
</script>
<style scoped>
:deep(.arco-table-pagination) {
  margin: 24px auto 0;
}

:deep(.arco-table-container) {
  height: 85%;
}

:deep(.arco-table-body) {
  border-bottom: 1px solid var(--color-neutral-3);
}

:deep(.arco-table-td) {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>

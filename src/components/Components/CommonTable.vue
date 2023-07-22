@@ -0,0 +1,58 @@
<template>
    <ATable :row-key="rowKey" :data="data" :pagination="showPagination ? pagination : false" :loading="isLoading"
        :bordered="{ cell: true }" :scroll="{
            x: isMobile ? '414px' : '800px',
            y: isMobile ? '58vh' : desktopScrollHeight,
        }" page-position="bottom" :align="'center'" :stripe="true" :indent-size="indentSize"
        :row-selection="rowSelection" :selectedKeys="selectedKeys" @page-change="onPageChange"
        @page-size-change="changePageSize" @selection-change="selectionChange" :key="Math.random()">
        <template #columns>
            <slot name="content" />
        </template>
    </ATable>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { useAppStore } from '@/store'

const emit = defineEmits(['onPageChange', 'selectionChange'])
const props = defineProps({
    data: {
        type: Array,
        default() {
            return []
        },
    },
    rowSelection: {
        type: Object,
        default() {
            return undefined
        },
    },
    selectedKeys: {
        type: Array,
        default() {
            return []
        },
    },
    rowKey: {
        type: String,
        default: 'key',
    },
    showPagination: {
        type: Boolean,
        default: true,
    },
    indentSize: {
        type: Number,
        default: 16,
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
    height: {
        type: Number,
        default: 0,
    },
})

const appStore = useAppStore()
const isMobile = computed(() => appStore.device === 'mobile')
const desktopScrollHeight = computed(() => {
    if (props.height) {
        return props.height
    } else {
        return null
        const minHeight = window.innerHeight / 2
        return appStore.formTopHeight > minHeight
            ? '50vh'
            : `calc(100vh - ${appStore.formTopHeight}px)`
    }
})
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
const selectionChange = async (rowKeys: (string | number)[]) => {
    await emit('selectionChange', rowKeys)
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
    flex: 1;
}

:deep(.arco-table-body) {
    border-bottom: 1px solid var(--color-neutral-3);
}

:deep(.arco-table-td) {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
}
</style>

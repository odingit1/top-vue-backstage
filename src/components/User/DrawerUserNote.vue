<template>
  <AButton type="text" size="mini" class="flex-1 p-0" @click="openDrawer">
    <div class="flex items-center justify-between">
      <span>
        <span>{{ latestDate || '-' }}</span>
      </span>
      <IconPlus class="border ml-2" />
    </div>
    <ADrawer
      v-model:visible="isOpenDrawer"
      :width="isMobile ? '100vw' : '45vw'"
      :footer="false"
      @cancel="closeDrawer"
    >
      <template #title>
        {{ $t('userNote.notes') }}
      </template>
      <ASpace direction="vertical" size="large" fill>
        <ACard
          v-permission="['UserNote.create', 'admin']"
          :title="$t('userNote.notes')"
        >
          <div class="d-flex-center">
            <ATextarea
              v-model="noteText"
              size="large"
              auto-size
              :placeholder="$t('userNote.note.placeholder')"
              allow-clear
              class="flex-1"
              :style="{
                minHeight: '80px',
                minWidth: '180px',
                height: '100%',
                margin: '8px',
              }"
            />
            <AButton
              :style="{ minHeight: '40px', height: 'auto', margin: '8px' }"
              type="primary"
              :disabled="!noteText"
              @click="sendNote()"
              >Submit
            </AButton>
          </div>
        </ACard>
        <ACard :title="$t('userNote.history')">
          <ATable
            row-key="id"
            :pagination="pagination"
            :loading="isLoading"
            :data="renderData"
            :bordered="false"
            :scroll="{ y: '55vh' }"
            @page-change="onPageChange"
          >
            <template #columns>
              <ATableColumn
                v-for="item in [
                  { key: 'createdAt', label: 'createdAt' },
                  { key: 'id', label: 'id' },
                  { key: 'adminAccount', label: 'operator' },
                  { key: 'content', label: 'note' },
                ]"
                :key="item.key"
                :title="$t(`userNote.history.${item.label}`)"
                :data-index="item.key"
              >
                <template #cell="{ record }">
                  <span v-if="item.key === 'operator'">
                    {{ record.user?.account }}
                  </span>

                  <span v-if="item.key === 'createdAt'">
                    {{ formatDate(record.createdAt) }}
                  </span>
                  <span v-else>{{ record[item.key] }}</span>
                </template>
              </ATableColumn>
            </template>
          </ATable>
        </ACard>
      </ASpace>
    </ADrawer>
  </AButton>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { Pagination } from '@/types/global'
import { requestHandler, formatDate } from '@/utils/tool'
import { UserData, createNote, getNotes, noteParams } from '@/api/user'
import { useAppStore } from '@/store'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  request: {
    type: Function,
    default() {
      return false
    },
  },
  submitText: {
    type: String,
    default: '-',
  },
})
const appStore = useAppStore()
const isMobile = computed(() => appStore.device === 'mobile')
const isOpenDrawer = ref(false)
const noteText = ref('')
const renderData = ref<UserData[]>([])
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
}
const pagination = reactive({
  ...basePagination,
})
const latestDate = computed(() => {
  if (renderData.value.length) {
    return formatDate(renderData.value[0].createdAt, 'YYYY-MM-DD')
  }
  return formatDate(props.submitText, 'YYYY-MM-DD')
})
const isLoading = ref(false)

const onPageChange = (page: number) => {
  pagination.current = page
  fetchData()
}
const openDrawer = async () => {
  isOpenDrawer.value = true
  await fetchData()
}
const closeDrawer = () => {
  isOpenDrawer.value = false
}
const sendNote = requestHandler(async () => {
  if (!noteText.value) return
  await createNote({
    id: props.id,
    note: noteText.value,
  } as noteParams)
  const res = await getNotes({
    id: props.id,
    current: pagination.current,
    pageSize: pagination.pageSize,
  })
  noteText.value = ''
  renderData.value = res.data.notes
  pagination.total = res.data.meta.totalCount
}, isLoading)

const fetchData = requestHandler(async () => {
  const res = await getNotes({
    id: props.id,
    current: pagination.current,
    pageSize: pagination.pageSize,
  })
  noteText.value = ''
  renderData.value = res.data.notes
  pagination.total = res.data.meta.totalCount
}, isLoading)
</script>

<style scoped>
.flex-1 {
  flex: 1;
}
.d-flex-center {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}
.border {
  border: 1px solid;
  border-radius: 2px;
}
</style>

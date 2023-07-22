<template>
  <div class="container">
    <ASpace v-if="userStore.createdAt" direction="vertical" size="large" fill>
      <ACard :title="$t('userNote.notes')">
        <ARow :gutter="[16, 8]" align="stretch" wrap>
          <ACol :xs="24" :sm="20">
            <ATextarea
              v-model="noteText"
              size="large"
              auto-size
              :placeholder="$t('userNote.note.placeholder')"
              allow-clear
              :style="{ minHeight: '80px', height: '100%' }"
            />
          </ACol>
          <ACol :xs="24" :sm="4">
            <AButton
              long
              :style="{ minHeight: '40px', height: '100%' }"
              type="primary"
              :disabled="!noteText"
              @click="handleSubmit()"
              >Submit
            </AButton>
          </ACol>
        </ARow>
      </ACard>
      <ACard :title="$t('userNote.history')">
        <ATable
          row-key="id"
          :pagination="pagination"
          :loading="isLoading"
          :data="renderData"
          :bordered="false"
          align="center"
          @page-change="onPageChange"
          @page-size-change="changePageSize"
        >
          <template #columns>
            <ATableColumn
              v-for="column in ['createdAt', 'id', 'adminAccount', 'note']"
              :key="column"
              :title="$t(`userNote.history.${column}`)"
              :data-index="column"
              :width="column === 'note' ? '-' : 120"
            >
              <template #cell="{ record }">
                <span v-if="column === 'note'">
                  {{ record.content }}
                </span>
                <CheckObjectKeyExist
                  v-else
                  :object="record"
                  :object-key="column"
                />
              </template>
            </ATableColumn>
          </template>
        </ATable>
      </ACard>
    </ASpace>
    <AEmpty v-else :description="$t('empty.noUsers')" class="empty-content" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { createNote, getNotes } from '@/api/user'
import { requestHandler } from '@/utils/tool'
import { MeData } from '@/api/me'
import { useUserStore } from '@/store'
import CheckObjectKeyExist from '@/components/Components/CheckObjectKeyExist.vue'

const userStore = useUserStore()
const noteText = ref('')
const renderData = ref<MeData[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20],
  total: 0,
  simple: true,
  showJumper: true,
  showPageSize: true,
})
const isLoading = ref(false)

const fetchData = requestHandler(async () => {
  const res = await getNotes({
    id: userStore.id,
    type: 'User',
    page: pagination.current,
    perPage: pagination.pageSize,
  })
  noteText.value = ''
  renderData.value = res.data.notes
  pagination.total = res.data.meta.totalCount
}, isLoading)

const created = requestHandler(async () => {
  if (!noteText.value) return
  await createNote({
    id: userStore.id,
    type: 'User',
    content: noteText.value,
  })
}, isLoading)

const onPageChange = async (currentPage: number) => {
  pagination.current = currentPage
  await fetchData()
}
const changePageSize = (pageSize: number) => {
  pagination.pageSize = pageSize
  onPageChange(1)
}
const handleSubmit = async () => {
  await created()
  await fetchData()
}
onMounted(() => {
  fetchData()
})
watch(
  () => userStore.id,
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  }
)
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>

<template>
  <AButton type="primary" size="large" @click="togglePop">
    {{ $t('department.member.add') }}
    <AModal
      v-model:visible="isOpenPop"
      :title="$t('department.member.add')"
      :width="'80vw'"
    >
      <AForm ref="formRef" :model="formData">
        <ARow :gutter="16">
          <ACol :span="8">
            <AFormItem field="name" hide-label>
              <AInput
                v-model="formData.name"
                :placeholder="$t('label.name.placeholder')"
              />
            </AFormItem>
          </ACol>
          <ACol :span="4">
            <AButton type="primary" long @click="fetchData">
              <template #icon>
                <IconSearch />
              </template>
              {{ $t('button.search') }}
            </AButton>
          </ACol>
          <ACol :span="4">
            <AButton long outlined @click="reset">
              {{ $t('button.reset') }}
            </AButton>
          </ACol>
        </ARow>
      </AForm>
      <ATable
        row-key="id"
        v-model:selectedKeys="selectedKeys"
        :loading="isLoading"
        :pagination="pagination"
        :data="renderData"
        :row-selection="rowSelection"
        :bordered="false"
        :scroll="{ maxHeight: '60vh' }"
        page-position="bottom"
        align="center"
        @page-change="onPageChange"
      >
        <template #columns>
          <ATableColumn
            v-for="column in columns"
            :key="column"
            :title="$t(`label.${column}`)"
            :data-index="column"
            align="center"
          >
            <template #cell="{ record }">
              <span>{{ getValue(column, record) }}</span>
            </template>
          </ATableColumn>
        </template>
        <template #pagination-left>
          <ASpace size="4">
            <ASelect
              v-model="pagination.pageSize"
              :options="pagination.pageSizeOptions"
              @change="fetchData"
            />
            <ATypographyText type="secondary"
              >/ {{ $t('pagination.page') }}</ATypographyText
            >
          </ASpace>
        </template>
        <template #pagination-right>
          <ASpace size="4">
            <ATypographyText type="secondary">{{
              $t('pagination.go')
            }}</ATypographyText>
            <AInputNumber
              v-model="pagination.current"
              :max="pageMax"
              :min="1"
              :style="{ width: `2.5em` }"
              hide-button
              @change="onPageChange"
            />
          </ASpace>
        </template>
      </ATable>
      <template #footer>
        <ASpace :size="12">
          <AButton @click="togglePop">
            {{ $t('button.back') }}
          </AButton>
          <DialogEnterAdminPassword
            buttonText="button.save"
            buttonStatus="normal"
            buttonType="primary"
            @popSubmit="(event) => saveDepartment(event)"
          />
        </ASpace>
      </template>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { formatDate, requestHandler } from '@/utils/tool'
import { queryAdmins } from '@/api/admin'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { DepartmentsData, updateDepartmentUsers } from '@/api/department'
import { Pagination } from '@/types/global'
import DialogEnterAdminPassword from '@/components/Dialog/DialogEnterAdminPassword.vue'

const { t } = useI18n()
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})
const isOpenPop = ref(false)
const generateFormModel = () => {
  return {
    name: '',
  }
}
const formData = reactive(generateFormModel())
const formRef = ref<FormInstance>()
const reset = () => {
  Object.assign(formData, generateFormModel())
}
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20],
}
const pagination = reactive({
  ...basePagination,
})
const pageMax = computed(() => {
  return Math.round(pagination.total / pagination.pageSize)
})
const columns = ['name', 'department', 'role', 'lastSignInAt', 'signInCount']
const renderData = ref<DepartmentsData[]>([])
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})
const selectedKeys = ref([])

const getValue = (column: string, data: object) => {
  switch (column) {
    case 'name':
      return data.account
      break
    case 'department':
      return data.department ? data.department.name : t('label.noGroup')
      break
    case 'role':
      return data.roles[0] ? data.roles[0].name : t('label.noGroup')
      break
    case 'lastSignInAt':
      return formatDate(data[column])
    default:
      return data[column]
      break
  }
}
const togglePop = () => {
  isOpenPop.value = !isOpenPop.value
}
const emit = defineEmits(['onClose'])

const editSuccess = () => {
  Modal.success({
    title: t('modal.edit.success'),
    content: t('modal.edit.success'),
  })
}
const saveDepartment = (event: string) => {
  const submit = requestHandler(async () => {
    const params = {
      id: props.id,
      userIds: selectedKeys.value,
      adminPassword: event,
    }
    await updateDepartmentUsers(params)
    emit('onClose')
    togglePop()
  }, isLoading)
  submit()
}
const onPageChange = (page: number) => {
  pagination.current = page
  fetchData()
}
const isLoading = ref(false)
const fetchData = requestHandler(async () => {
  if (pagination.current > pageMax.value) {
    pagination.current = pageMax.value
  }
  const params = {
    page: pagination.current,
    perPage: pagination.pageSize,
    account: formData.name,
  }
  const res = await queryAdmins(params)
  pagination.total = res.data.meta.totalCount
  renderData.value = res.data.users
  renderData.value.forEach((user) => {
    const id = user.department ? user.department.id : 0
    if (id === props.id) {
      selectedKeys.value.push(user.id)
    }
  })
}, isLoading)
fetchData()
</script>

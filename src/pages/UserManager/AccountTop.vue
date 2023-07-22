<template>
    <ACard class="general-card">
        <SearchForm :form-items="[
            {
                key: 'user',
                placeholder: '请输入用户ID或用户名',
                span: 1
            },

            {
                key: 'role_id',
                label: '权限角色',
                isSelects: true,
                SelectionArr: oprole_list,
                span: 1,
            },
        ]" :cols="{ xs: 2, sm: 2, md: 3, lg: 6, xl: 8, xxl: 10 }" :is-loading="isLoading"
            :export-disabled="isLoading || isExportLimited" @search="search">
            <template #button>
                <UpdataManager status="success" size="small" :oprole-list="oprole_list" submit-text="新增用户"
                    @updata="getTransactionRecord">
                </UpdataManager>

            </template>

        </SearchForm>
        <ADivider />
        <CommonTable :data="renderData" :is-loading="isLoading" :total-count="totalCount" :current-page="currentPage"
            :page-size="pageSize" @on-page-change="onPageChange">
            <template #content>
                <ATableColumn v-for="item in [
                    { key: 'user_id', title: '账户ID' },
                    { key: 'username', title: '用户名' },
                    { key: 'nickname', title: '姓名' },
                    { key: 'role_id', title: '权限角色' },
                    { key: 'status', title: '状态' },
                    { key: 'google_status', title: '登录安全配置' },
                    { key: 'create_time', title: '创建时间' },
                    { key: 'last_login', title: '最后登录时间' },
                    { key: 'last_login_ip', title: '最后登录IP' },
                ]" :key="item.key" :title="item.title" :data-index="item.key" align="center" :width="120">
                    <template #cell="{ record }">
                        <StatusType v-if="item.key === 'status'" :field-key-list="status_type_list" :data="record.status">
                        </StatusType>
                        <StatusType v-else-if="item.key === 'role_id'" :field-key-list="oprole_list" :data="record.role_id">
                        </StatusType>
                        <StatusType v-else-if="item.key === 'google_status'" :field-key-list="status_type_list"
                            :data="record.google_status == 2 ? 0 : 1"></StatusType>
                        <CheckObjectKeyExist v-else :object="record" :object-key="item.key" />
                    </template>
                </ATableColumn>
                <ATableColumn :title="$t('label.action')" align="center" :width="150" data-index="action">
                    <template #cell="{ record }">
                        <ASpace wrap>
                            <UpdataManager size="mini" :form-data-item="record" :oprole-list="oprole_list" submit-text="编辑"
                                @updata="getTransactionRecord"></UpdataManager>
                            <DialogConfirm size="mini" :title="$t('confirm.deletion')" :submitText="$t('button.delete')"
                                :content="`是否要删除该用户`" @clickButton="promoItemData(record.user_id)"
                                @popSubmit="delPromoItem"></DialogConfirm>
                            <DialogConfirm size="mini" status="success" :disabled="record.google_status == 2" title="重置谷歌验证"
                                submitText="重置谷歌验证" :content="`是否要确认重置谷歌验证`" @clickButton="promoItemData(record.user_id)"
                                @popSubmit="resetGoogle"></DialogConfirm>
                        </ASpace>
                    </template>
                </ATableColumn>
            </template>
        </CommonTable>
    </ACard>
</template>
  
<script lang="ts">
export default { name: 'AdminManager' }
</script>
  
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { requestHandler } from '@/utils/tool'
import { Pagination } from '@/types/global'
import UpdataManager from '@/components/topadmin/UserManager/AccountTop/UpdataManager.vue'
import { status_type_list } from '@/utils/optionList'
import StatusType from '@/components/Render/StatusType.vue'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import { AdminManagerGetManagerList, AdminManagerDelManager, AdminManagerResetGoogleCode } from '@/api/UserManager/AccountTop'
import { AdminRoleGetRoleList } from '@/api/UserManager/AdminRole'
import { Message } from '@arco-design/web-vue'
const platform_id = ref<number[]>([])
const isOpenPop = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const renderData = ref([])
const isLoading = ref(false)
const isExportLimited = ref(false)
const responseParams = reactive({})
const user_id = ref(0)
const oprole_list = ref<{ value: number, name: string }[]>([])
const queryParams = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        ...responseParams,
    } as Pagination & {
        user: string
        role_id: number
    }
})

const onPageChange = async (pageParams: Pagination) => {
    currentPage.value = pageParams.current
    pageSize.value = pageParams.pageSize
    await getTransactionRecord()
}

const search = async (event: object) => {
    currentPage.value = 1
    await Object.assign(responseParams, event)
    await getTransactionRecord()
}
const getTransactionRecord = requestHandler(async () => {

    const response = await AdminManagerGetManagerList(queryParams.value)
    renderData.value = response.data.list || []
    totalCount.value = response.data.total
}, isLoading)

const promoItemData = (id: number) => {
    user_id.value = id
}
const delPromoItem = async () => {
    await AdminManagerDelManager(user_id.value)
    Message.success({ content: '用户删除成功' })
    await getTransactionRecord()
}
const resetGoogle = async () => {
    await AdminManagerResetGoogleCode(user_id.value)
    Message.success({ content: '谷歌验证重置成功' })
    await getTransactionRecord()
}
const getOpRoleList = requestHandler(async () => {
    const response = await AdminRoleGetRoleList()
    const list = response.data.list || []
    oprole_list.value = []
    list.map(item => {
        let obj = {
            value: item.role_id,
            name: item.name,
        }
        oprole_list.value.push(obj)
    })
}, isLoading)

onMounted(async () => {
    await getOpRoleList()
    await getTransactionRecord()
})
</script>
  
<style scoped lang="less"></style>
  
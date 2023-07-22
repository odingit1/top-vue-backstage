<template>
    <ACard class="general-card">
        <SearchForm :form-items="[
            {
                key: 'user_id',
                placeholder: '请输入用户ID',
                span: 1
            },
            {
                key: 'user_name',
                placeholder: '请输入用戶名',
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

                <AButton type="primary" size="small" status="warning" @click="isOpenPopFun">
                    <slot name="buttonTitle">同步配置</slot>
                    <AModal v-model:visible="isOpenPop" title="同步配置" :footer="false" :width="400"
                        :modal-style="{ 'max-width': '90%' }">
                        <slot name="content">
                            <SelectPlatform v-model="platform_id" multiple @update:value="platformVal"></SelectPlatform>
                        </slot>
                        <ADivider />
                        <slot name="footer">
                            <AButton type="primary" long status="success" :disabled="!platform_id?.length"
                                @click="clickopmanagersync">确定</AButton>
                        </slot>
                    </AModal>
                </AButton>
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
                    { key: 'point_limit', title: '单次充值上限' },
                    { key: 'day_point_limit', title: '单日充值上限' },
                    { key: 'status', title: '状态' },
                    { key: 'google_status', title: '登录安全配置' },
                    { key: 'created_at', title: '创建时间' },
                ]" :key="item.key" :title="item.title" :data-index="item.key" align="center" :width="120">
                    <template #cell="{ record }">
                        <StatusType v-if="item.key === 'status'" :field-key-list="status_type_list" :data="record.status">
                        </StatusType>
                        <StatusType v-else-if="item.key === 'role_id'" :field-key-list="oprole_list" :data="record.role_id">
                        </StatusType>
                        <StatusType v-else-if="item.key === 'google_status'" :field-key-list="status_type_list"
                            :data="record.google_status"></StatusType>
                        <CheckObjectKeyExist v-else :object="record" :object-key="item.key"
                            :date-format-type-list="['created_at']" :point-type-list="[
                                'point_limit',
                                'day_point_limit',

                            ]" />
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
                            <DialogConfirm size="mini" status="success" title="重置谷歌验证" submitText="重置谷歌验证"
                                :content="`是否要确认重置谷歌验证`" @clickButton="promoItemData(record.user_id)"
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
import { ref, reactive, computed } from 'vue'
import { requestHandler } from '@/utils/tool'
import { Pagination } from '@/types/global'
import UpdataManager from '@/components/topadmin/OperationAdmin/NewAdminAccount/UpdataManager.vue'
import { status_type_list } from '@/utils/optionList'
import StatusType from '@/components/Render/StatusType.vue'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import SelectPlatform from '@/components/Selects/SelectPlatform.vue'
import { oprolelist } from '@/api/OperationAdmin/newAdminRole'
import { opmanagerList, opmanagerdel, opmanagerrefreshgooglecode, opmanagersync } from '@/api/OperationAdmin/AdminAccount'
import { onMounted } from 'vue'
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
        user_id: string
        user_name: string
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

    const response = await opmanagerList(queryParams.value)
    renderData.value = response.list || []
    totalCount.value = response.total
}, isLoading)

const promoItemData = (id: number) => {
    user_id.value = id
}
const delPromoItem = async () => {
    await opmanagerdel(user_id.value)
    Message.success({ content: '用户删除成功' })
    await getTransactionRecord()
}
const resetGoogle = async () => {
    await opmanagerrefreshgooglecode(user_id.value)
    Message.success({ content: '谷歌验证重置成功' })
    await getTransactionRecord()
}
const getOpRoleList = requestHandler(async () => {
    const response = await oprolelist()
    const list = response.list || []
    oprole_list.value = []
    list.map(item => {
        let obj = {
            value: item.role_id,
            name: item.name,
        }
        oprole_list.value.push(obj)
    })
}, isLoading)
const isOpenPopFun = () => {
    isOpenPop.value = true
    platform_id.value = []
}
const platformVal = (val: number[]) => {
    platform_id.value = val
}
const clickopmanagersync = () => {
    platform_id.value.map(async (item, index) => {
        await opmanagersync(item)
        if (index == platform_id.value?.length - 1) {
            Message.success({ content: '平台信息同步成功' })
        }
    })
    isOpenPop.value = false
}
onMounted(async () => {
    await getOpRoleList()
    await getTransactionRecord()
})
</script>
  
<style scoped lang="less"></style>
  
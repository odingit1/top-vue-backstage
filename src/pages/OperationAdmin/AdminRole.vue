<template>
    <ACard class="general-card">
        <ASpace>

            <AButton type="primary" size="small" @click="getOpRoleList">刷新</AButton>
            <DialogAdminRoleCreateEdit :status="'success'" :size="'small'" submit-text=" 新增角色"
                @update:value="getOpRoleList">
            </DialogAdminRoleCreateEdit>
        </ASpace>

        <ADivider />
        <CommonTable :data="renderData" :is-loading="isLoading" :showPagination="false">
            <template #content>
                <ATableColumn v-for="item in 
                    [
                        { key: 'role_id', title: 'ID' },
                        { key: 'name', title: '角色名称' },
                        { key: 'description', title: '描述' },
                        { key: 'is_prefab', title: '是否预设' },
                        { key: 'status', title: '状态' },
                    ]" :key="item.key" :title="item.title || item.key" align="center">
                    <template #cell="{ record }">
                        <template v-if="item.key === 'is_prefab'">
                            <StatusType :field-key-list="status_type_list" :data="record.is_prefab"></StatusType>
                        </template>
                        <template v-else-if="item.key === 'status'">
                            <StatusType :field-key-list="status_type_list" :data="record.status"></StatusType>
                        </template>
                        <span v-else>
                            {{ record[item.key] }}
                        </span>
                    </template>
                </ATableColumn>
                <ATableColumn :title="$t('label.action')" align="center" data-index="action" :fixed="'right'">
                    <template #cell="{ record }">
                        <ASpace wrap>
                            <DialogAdminRoleCreateEdit @update:value="getOpRoleList" submit-text="编辑角色" size="small"
                                :item-data="record" :isCreate="false" :Visible="visible">
                            </DialogAdminRoleCreateEdit>

                            <RoleMenu size="small" :form-data-item="record" :tree-data="treeData" submit-text="角色权限"
                                @update:value="(event) => setRolemenu(event, record)">
                            </RoleMenu>

                            <APopconfirm content="是否要删除该用户的此条权限配置" @ok="delPromoItem(record.role_id)" type="error">
                                <AButton type="primary" status="danger" size="small"> <!-- Delete note btn -->
                                    删除
                                </AButton>
                            </APopconfirm>
                        </ASpace>
                    </template>
                </ATableColumn>
            </template>
        </CommonTable>
    </ACard>
</template>

<script lang="ts">
export default { name: 'NewAdminRole' }
</script>

<script lang="ts" setup>

import { ref, reactive, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { requestHandler } from '@/utils/tool'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import DialogAdminRoleCreateEdit from '@/components/topadmin/OperationAdmin/NewAdminRole/DialogAdminRoleCreateEdit.vue'
import RoleMenu from '@/components/topadmin/OperationAdmin/NewAdminRole/RoleMenu.vue'

import { oprolelist, roleParams, oproleupdate, oproledel } from '@/api/OperationAdmin/newAdminRole'
import { status_type_list } from '@/utils/optionList'
import StatusType from '@/components/Render/StatusType.vue'
import { opmenulist } from '@/api/OperationAdmin/NewAdminMenu'
import { IconStar, IconDriveFile } from '@arco-design/web-vue/es/icon'
const treeData = ref([])
const router = useRouter()
const renderData = ref([])
const isLoading = ref(false)
const visible = ref(false)
const goToRolePermission = () => {
    router.push({ name: 'newOperationAdmin_newAdminMenu' })
}
const getOpRoleList = requestHandler(async () => {
    const response = await oprolelist()
    renderData.value = response.list || []
}, isLoading)

// const setRole = async (event: roleParams) => {
//     await opRoleSave(event)
//     await getOpRoleList()
// }
const setRolemenu = async (event: number[], data: roleParams) => {
    await oproleupdate({
        button_list: data.button_list,
        description: data.description,
        is_prefab: data.is_prefab,
        menus: event,
        status: data.status,
        name: data.name,
        role_id: data.role_id,
    })

    await getOpRoleList()
}

const delPromoItem = async (id: number) => {
    await oproledel(id)
    await getOpRoleList()
}
const getopmenulist = requestHandler(async () => {
    const response = await opmenulist()
    const list = response.list || []
    list.map((item) => {
        let obj = {
            title: item.title,
            key: item.id,
            ispage: item.ispage,
            children: [],
        }
        item.subs.map((item1) => {
            let obj1 = {
                title: item1.title,
                key: item1.id,
                ispage: item1.ispage,
                children: [],
                // icon: item1.buttons.length ? () => h(IconDriveFile) : null,
            }
            if (item1.subs.length) {
                item1.subs.map((item2: any) => {
                    let obj2 = {
                        title: item2.title,
                        key: item2.id,
                        ispage: item2.ispage,
                        children: item2.subs,
                        // icon: item2.buttons.length
                        //     ? () => h(IconStar, { style: { color: 'red' } })
                        //     : null,
                    }
                    obj1.children.push(obj2)
                })
            }
            obj.children.push(obj1)
        })

        treeData.value.push(obj)
    })

}, isLoading)
onMounted(async () => {
    await getOpRoleList()
    await getopmenulist()

})
</script>
<style lang=""></style>

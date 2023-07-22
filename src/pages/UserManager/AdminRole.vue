<template>
    <ACard class="general-card">
        <ASpace>

            <AButton type="primary" size="small" @click="getOpRoleList">刷新</AButton>
            <UpdataRole :status="'success'" :size="'small'" submit-text=" 新增角色" @update:value="getOpRoleList">
            </UpdataRole>
        </ASpace>

        <ADivider />
        <CommonTable :data="renderData" :is-loading="isLoading" :showPagination="false">
            <template #content>
                <ATableColumn v-for="item in 
                    [
                        { key: 'role_id', title: '角色ID' },
                        { key: 'name', title: '角色名称' },
                        { key: 'description', title: '描述' },
                        { key: 'sort', title: '角色等级' },
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
                            <UpdataRole @update:value="getOpRoleList" submit-text="编辑角色" size="small" :item-data="record"
                                :isCreate="false" :Visible="visible">
                            </UpdataRole>

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
export default { name: 'AdminRole' }
</script>

<script lang="ts" setup>

import { ref, reactive, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { requestHandler } from '@/utils/tool'
import UpdataRole from '@/components/topadmin/UserManager/AdminRole/UpdataRole.vue'
import RoleMenu from '@/components/topadmin/UserManager/AdminRole/RoleMenu.vue'
import { AdminMenuAllMenu } from '@/api/UserManager/AdminMenuTop'
import { status_type_list } from '@/utils/optionList'
import StatusType from '@/components/Render/StatusType.vue'
import { AdminRoleGetRoleList, AdminRoleSaveRole, AdminRoleDelRole, RoleParams } from '@/api/UserManager/AdminRole'
const treeData = ref([])
const router = useRouter()
const renderData = ref([])
const isLoading = ref(false)
const visible = ref(false)

const getOpRoleList = requestHandler(async () => {
    const response = await AdminRoleGetRoleList()
    renderData.value = response.data.list || []
}, isLoading)

const setRolemenu = async (event: number[], data: RoleParams) => {
    await AdminRoleSaveRole({
        description: data.description,
        menus: event,
        status: data.status,
        name: data.name,
        role_id: data.role_id,
        sort: data.role_id,
    })

    await getOpRoleList()
}

const delPromoItem = async (id: number) => {
    await AdminRoleDelRole(id)
    await getOpRoleList()
}
const getopmenulist = requestHandler(async () => {
    const response = await AdminMenuAllMenu()
    const list = response.data.list || []
    list.map((item) => {
        let obj = {
            title: item.title,
            key: item.menu_id,
            children: [],
        }
        item.children.map((item1) => {
            let obj1 = {
                title: item1.title,
                key: item1.menu_id,
                children: [],
            }
            item1.children.map((item2) => {
                let obj2 = {
                    title: item2.title,
                    key: item2.menu_id,
                    children: [],
                }

                obj1.children.push(obj2)
            })
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

<template>
    <ACard class="general-card">
        <ASpace>
            <AButton type="primary" :size="'small'" @click="getopmenulist">刷新</AButton>
            <UpdataMenu :menu="menuArr" :size="'small'" :status="'success'" :submit-text="'新增菜单'" @updata="getopmenulist">
            </UpdataMenu>
        </ASpace>
        <ADivider />
        <CommonTable :data="renderData" :is-loading="isLoading" :showPagination="false" :indentSize="32">
            <template #content>
                <ATableColumn v-for="item in [
                    {
                        key: 'title',
                        title: '菜单名称',
                    },

                    {
                        key: 'key',
                        title: '菜单ID',
                    },
                    { key: 'classname', title: '菜单path' },
                    { key: 'index', title: '菜单name' },
                    { key: 'sort', title: '排序' },
                    { key: 'ispage', title: '类型' },

                ]" :key="item.key" :title="item.title" :data-index="item.key" align="center" class="word-break-word"
                    :width="150">

                    <template #cell="{ record }">
                        <StatusType v-if="item.key === 'ispage'" :field-key-list="topadmin_ispage_type_list"
                            :data="record.ispage">
                        </StatusType>
                        <CheckObjectKeyExist v-else :object="record" :object-key="item.key"></CheckObjectKeyExist>
                    </template>
                </ATableColumn>
                <ATableColumn title="操作" align="center" :width="150" data-index="action"
                    :fixed="isMobile ? undefined : 'right'">
                    <template #cell="{ record }">
                        <ASpace wrap>
                            <UpdataMenu :menu="menuArr" :size="'small'" :form-data-item="record" :status="'success'"
                                :submit-text="'编辑菜单'" @updata="getopmenulist">
                            </UpdataMenu>
                            <APopconfirm content="你确定你要删除该用户" @ok="delPromoItem(record.key)" type="error">
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
export default { name: 'AdminMenuTop' }
</script>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store'
import { requestHandler } from '@/utils/tool'
import { topadmin_ispage_type_list } from '@/utils/optionList'
import StatusType from '@/components/Render/StatusType.vue'
import UpdataMenu from '@/components/topadmin/UserManager/AdminMenuTop/UpdataMenu.vue'
import { AdminMenuAllMenu, AdminMenuDelMenu } from '@/api/UserManager/AdminMenuTop'
const isMobile = computed(() => useAppStore().device === 'mobile')
const renderData = ref([])
const isLoading = ref(false)
const delPromoItem = async (id: number) => {
    await AdminMenuDelMenu(id)
    await getopmenulist()
}

const menuArr = ref<{ id: number, title: string }[]>([])
const getopmenulist = requestHandler(async () => {
    const response = await AdminMenuAllMenu()
    console.error(response)
    renderData.value = []


    const list = response.data.list[0].children || []
    menuArr.value = [{
        id: response.data.list[0].menu_id,
        title: "TopAdmin",
    }]
    list.map((item) => {
        let obj = {
            title: item.title,
            key: item.menu_id,
            ispage: item.ispage,
            classname: item.classname,
            index: item.url,
            pid: item.pid,
            sort: item.sort,
            is_old: item.is_old,
            children: []
        }
        menuArr.value.push({
            id: item.menu_id,
            title: `└---${item.title}`,
        })
        item.children.map((item1) => {
            let obj1 = {
                title: item1.title,
                key: item1.menu_id,
                ispage: item1.ispage,
                classname: item1.classname,
                index: item1.url,
                pid: item1.pid,
                sort: item1.sort,
                is_old: item1.is_old,
            }
            menuArr.value.push({
                id: item1.menu_id,
                title: `└---└---${item1.title}`,
            })
            obj.children.push(obj1)
        })

        renderData.value.push(obj)
    })

}, isLoading)



onMounted(async () => {
    await getopmenulist()
})
</script>
<style lang=""></style>

<template>
    <ACard class="general-card">
        <SearchForm :form-items="[
            {
                key: 'tab_name',
                label: '请选择表名',
                isSelects: true,
                SelectionArr: name_list,
                optionName: 'title',
                optionValue: 'tab_name',
                group: true,
                search: true,
                span: 1,
            },
            {
                key: 'plat_id',
                label: '平台信息',
                isSelects: true,
                search: true,
                disabled: Boolean(!responseParams.tab_name),
                span: 1,
            },
            {
                key: 'app_id',
                label: '包网信息',
                isSelects: true,
                search: true,
                disabled: Boolean(responseParams.plat_id < 0),
                span: 1,
            },

        ]" :cols="{ xs: 2, sm: 2, md: 3, lg: 6, xl: 8, xxl: 10 }" :is-loading="isLoading"
            :export-disabled="isLoading || isExportLimited" @search="search" :defaultSearch="false"
            :searchDisabled="Boolean(!responseParams.tab_name)">
            <template #button>
                <DialogJson submitText="查看schema" :content="schemaData" :disabled="Boolean(!responseParams.tab_name)"
                    status='success' size="small" :hideFooter="true"> </DialogJson>

                <OpmanagerSync size="small" status="warning" :name-list="name_list" submitText="同步配置"></OpmanagerSync>
                <Uploadschema size="small" status="warning" submitText="上传"></Uploadschema>
                <UpdataSchema size="small" status="success" submitText="新增配置" :schema="schema"></UpdataSchema>
            </template>

        </SearchForm>
        <ADivider />
        <CommonTable :data="renderData" :is-loading="isLoading" :total-count="totalCount" :current-page="currentPage"
            :page-size="pageSize" @on-page-change="onPageChange">
            <template #content>
                <ATableColumn v-for="item in  columnData" :key="item.key" :title="item.title" :data-index="item.key"
                    align="center" :width="120">
                    <template #cell="{ record }">

                        <CheckObjectKeyExist :object="record" :object-key="item.key" />
                    </template>
                </ATableColumn>
                <ATableColumn title="操作" align="center" :width="150" data-index="action" fixed="right">
                    <template #cell="{ record }">
                        <ASpace wrap>
                            <UpdataSchema size="mini" status="success" submitText="编辑配置" :data="record" :schema="schema">
                            </UpdataSchema>
                            <DialogConfirm size="mini" title="删除配置" submitText="删除" :content="`确认删除此条配置`"
                                @popSubmit="delPromoItem(record._id)"></DialogConfirm>
                            <UpdataSchema size="mini" submitText="复制配置" :data="record" :schema="schema"></UpdataSchema>
                        </ASpace>
                    </template>
                </ATableColumn>
            </template>
        </CommonTable>
        <!-- <VueForm :schema="schema" ref="modalFormRef"></VueForm> -->
    </ACard>
</template>
  
<script lang="ts">
export default { name: 'generalConfig' }
</script>
  
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { requestHandler } from '@/utils/tool'
import { Pagination } from '@/types/global'
import DialogJson from '@/components/Dialog/DialogJson.vue'
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue'
import { commoncfgnamelist, commoncfglist, commoncfglistParams, commoncfgdel, } from '@/api/Development/GeneralConfig'
import OpmanagerSync from '@/components/topadmin/Development/GeneralConfig/OpmanagerSync.vue'
import Uploadschema from '@/components/topadmin/Development/GeneralConfig/Uploadschema.vue'
import UpdataSchema from '@/components/topadmin/Development/GeneralConfig/UpdataSchema.vue'

import { Message } from '@arco-design/web-vue'
const platform_id = ref<number[]>([])
const isOpenPop = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const renderData = ref([])
const isLoading = ref(false)
const isExportLimited = ref(false)
const responseParams = reactive({ plat_id: -1, tab_name: '', app_id: -1, query: '{}', sort_field: '' })
const name_list = ref<{ value: number, name: string }[]>([])
const schemaData = ref()
const schema = ref()
const queryParams = computed(() => {
    return {
        current: currentPage.value,
        pageSize: pageSize.value,
        ...responseParams,
    } as Pagination & {
        tab_name: string
        app_id: number
        plat_id: number
        query: string
        sort_field: string
        filter: []
    }
})
const columnData = ref<any[]>([])
const onPageChange = async (pageParams: Pagination) => {
    currentPage.value = pageParams.current
    pageSize.value = pageParams.pageSize
    await getcommoncfglist()
}

const search = async (event: object) => {
    if (!event.tab_name) return Message.error('请选择表名称')
    currentPage.value = 1
    await Object.assign(responseParams, event)
    await getcommoncfglist()
}
const getcommoncfglist = requestHandler(async () => {

    const response = await commoncfglist(queryParams.value)
    schemaData.value = JSON.stringify(JSON.parse(response.schema), null, '\t')
    schema.value = response.schema
    renderData.value = response.list || []
    totalCount.value = response.total
    getColumn(JSON.parse(response.schema).properties)
}, isLoading)
const getColumn = async (obj: any) => {
    columnData.value = []
    Object.keys(obj).forEach((key, index) => {
        if (JSON.stringify(obj[key]) !== '{}') {
            if (!obj[key].hasOwnProperty('ignore_title')) {
                columnData.value.push({
                    title: obj[key]['title'],
                    key: key,
                    minWidth: 120,
                    resizable: true,
                    align: "center",
                    sortable: obj[key].type == "integer"
                })
                // if (index < 4) {
                //     this.opencopymodel.table.column.push({
                //         title: obj[key]['title'],
                //         key: key,
                //         minWidth: 80,
                //         resizable: true,
                //         align: "center",
                //     })
                // }
            }
        }
    }
    )
}

const delPromoItem = async (id: string) => {
    await commoncfgdel({ _id: id, tab_name: queryParams.value.tab_name })
    Message.success({ content: '此条配置删除成功' })
    await getcommoncfglist()
}

const getcommoncfgnamelist = requestHandler(async () => {
    const response = await commoncfgnamelist()
    const list = response.list || []
    name_list.value = []
    let groupedData = list.reduce((acc, curr) => {
        let key = curr.tag || '默认分组';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
    }, {});
    Object.keys(groupedData).forEach(el => {
        let obj = {
            tag_name: el,
            tag_name_list: groupedData[el]
        };
        name_list.value.push(obj)
    })
    console.error(name_list.value)
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
    await getcommoncfgnamelist()
})
</script>
  
<style scoped lang="less"></style>
  
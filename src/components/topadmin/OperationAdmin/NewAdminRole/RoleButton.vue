<template>
    <AModal v-model:visible="resetAdminRoleVisible" title="编辑角色对应按钮" :width="900" @before-ok="handleSubmit"
        @cancel="handleCancel">
        <ASpace direction="vertical">
            <FormButton size="small" status="success" submit-text="新增" :roleId="roleId" :menuId="menuId" @updata='getData'>
            </FormButton>

            <CommonTable row-key="id" :is-loading="false" :data="buttonData" :row-selection="{
                type: 'checkbox',
                showCheckedAll: true,
            }
                " :selected-keys="idList" :showPagination="false" @selection-change="selectionChange">
                <template #content>
                    <ATableColumn v-for=" item  in 
    [
        { title: 'id', key: 'id' },
        { title: '按钮名称', key: 'desc' },
        { title: '关联方法', key: 'func' },
    ]
" :key="item.key" :title="item.title" :data-index="item.key" align="center" :width="80">
                    </ATableColumn>
                    <ATableColumn :title="$t('label.action')" align="center" :width="100" data-index="action">
                        <template #cell="{ record }">
                            <ASpace>
                                <FormButton size="small" :form-data-item="record" status="success" submit-text="编辑"
                                    @updata='getData'>
                                </FormButton>
                                <APopconfirm content="是否要删除该用户的此条权限配置" @ok="delPromoItem(record.id)" type="error">
                                    <AButton type="primary" status="danger" size="small"> <!-- Delete note btn -->
                                        删除
                                    </AButton>
                                </APopconfirm>
                            </ASpace>
                        </template>
                    </ATableColumn>
                </template>
            </CommonTable>
            <!-- <ASpace>
            <ACheckboxGroup v-model="buttons" @change="changeBtns">
                <ACheckbox v-for="item in buttonData" :key="item.id" :value="item.id">
                    {{
                        item.desc
                    }}
                </ACheckbox>
            </ACheckboxGroup>
        </ASpace> -->
        </ASpace>
    </AModal>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import FormButton from '@/components/topadmin/OperationAdmin/NewAdminRole/FormButton.vue'
import { oprolerolebuttons, oprolerolebuttonsupdate, oprolebuttondel } from '@/api/OperationAdmin/newAdminRole'
const resetAdminRoleVisible = ref(false)
const emit = defineEmits(['update:value', 'cancel'])
const buttonData = ref([])
const props = defineProps({
    visible: {
        type: Boolean,
        default: null,
    },
    roleId: {
        type: Number,
        default: 0,
    },
    menuId: {
        type: Number,
        default: 0,
    },

})
const idList = ref<number[]>([])

const delPromoItem = async (id: number) => {
    await oprolebuttondel(id)
    getData()
}
const handleCancel = () => {
    emit('cancel')
    resetAdminRoleVisible.value = false
}
const handleSubmit = async () => {
    emit('update:value', idList.value)
}
const openForm = async () => {
    getData()
}
const getData = async () => {
    const res = await oprolerolebuttons({
        role_id: props.roleId,
        menu_id: props.menuId,
    })
    buttonData.value = res.button || []
    idList.value = buttonData.value
        .filter((val) => val.status)
        .map((v) => {
            return v.id
        })
}
const selectionChange = (rowKeys: number[]) => {
    idList.value = rowKeys
}
watch(
    () => props.visible,
    (value) => {
        resetAdminRoleVisible.value = value
        if (value) {
            openForm()

        }
    }
)
</script>
<style scoped></style>
  
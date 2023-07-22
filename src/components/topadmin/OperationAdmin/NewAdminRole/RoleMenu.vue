<template>
    <DialogForm :title="submitText" :submit-text="submitText" :class="class" :size="size" :status="status"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <ATree v-model:checked-keys="checkedKeys" :only-check-leaf="true" :data="treeData" @select="selectMenu"
                @check="checkId" checkable></ATree>
        </template>
    </DialogForm>
    <RoleButton :visible="visible" :roleId="formDataItem.role_id" :menuId="menu_id" @cancel="cancelRoleButton"
        @update:value="(event) => setRolemenuBtns(event)" />
</template>
    
<script lang="ts" setup>
import { ref, h } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import RoleButton from './RoleButton.vue'
import { oprolerolebuttonsupdate } from '@/api/OperationAdmin/newAdminRole'
import { Message } from '@arco-design/web-vue'
const visible = ref(false)
const openShow = ref(false)
const checkedKeys = ref([])
const menus = ref<number[]>([])
const menu_id = ref(0)
const emit = defineEmits(['update:value', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },
    type: {
        type: Number,
        default: 0,
    },
    class: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: 'normal',
    },
    formDataItem: {
        type: Object,
        default() {
            return {}
        },
    },
    treeData: {
        type: Array,
        default: [],
    }
})
const cancelRoleButton = () => {
    visible.value = false
}
const checkId = (data: Array<number>, checkedKeys: any) => {
    checkedKeys.value = data.concat(checkedKeys.halfCheckedKeys)
    menus.value = data.concat(checkedKeys.halfCheckedKeys)
}
const openForm = () => {
    menus.value = props.formDataItem.menus || []
    checkedKeys.value = props.formDataItem.menus || []

    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    emit('update:value', menus.value)
    openShow.value = false
}
const setRolemenuBtns = async (event: Array<number>) => {
    await oprolerolebuttonsupdate({
        role_id: props.formDataItem.role_id,
        menu_id: menu_id.value,
        buttons: event,
    })
    Message.success({ content: '角色权限编辑成功' })
    visible.value = false
}
const selectMenu = async (
    selectedKeys: Array<string | number>,
    data: Object
) => {
    if (data.node.ispage == 1) {
        menu_id.value = Number(selectedKeys[0])
        visible.value = true
    }
}
</script>
    
<style scoped lang="less"></style>
  
    
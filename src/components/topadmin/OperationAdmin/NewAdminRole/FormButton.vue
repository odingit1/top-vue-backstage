<template>
    <DialogForm :title="submitText" :submit-text="submitText" :size="size" :status="status" :width="500"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width>
                <AFormItem label="按钮名称" field="desc" :rules="[
                    { required: true, message: '请输入按钮名称' }]">
                    <AInput v-model="formData.desc" placeholder="请输入按钮名称" />
                </AFormItem>
                <AFormItem label="对应标识" field="client_tag" :rules="[
                    { required: true, message: '请输入对应标识' }]">
                    <AInput v-model="formData.client_tag" placeholder="请输入对应标识" />
                </AFormItem>
                <AFormItem label="关联方法" field="func" :rules="[
                    { required: true, message: '请输入关联方法' }]">
                    <AInput v-model="formData.func" placeholder="请输入关联方法" />
                </AFormItem>
            </AForm>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { oprolebuttonupdate, oprolebuttonupdateParams } from '@/api/OperationAdmin/newAdminRole'
import { admin_ispage_type_list } from '@/utils/optionList'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const openShow = ref(false)
const formData = reactive<oprolebuttonupdateParams>({
    client_tag: '',
    desc: "",
    func: "",
    id: 0,
    menu_id: 0,
    role_id: 0
})

const modalFormRef = ref<FormInstance>()

const emit = defineEmits(['updata', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },
    roleId: {
        type: Number,
        default: 0,
    },
    menuId: {
        type: Number,
        default: 0,
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
})
const openForm = () => {
    modalFormRef.value?.resetFields()
    if (props.formDataItem.id) {
        formData.client_tag = props.formDataItem.client_tag
        formData.desc = props.formDataItem.desc
        formData.func = props.formDataItem.func
        formData.id = props.formDataItem.id
        formData.menu_id = props.formDataItem.menu_id
        formData.role_id = props.formDataItem.role_id
    } else {
        formData.role_id = props.roleId
        formData.menu_id = props.menuId
    }
    openShow.value = true
    emit('clickButton')
}

const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await oprolebuttonupdate(formData)
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


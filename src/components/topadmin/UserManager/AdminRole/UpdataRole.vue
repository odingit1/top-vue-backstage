<template>
    <DialogForm :title="submitText" :submit-text="submitText" :classes="classes" :size="size"
        :is-ready-to-show="resetAdminRoleVisible" :status="status" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="formRef" :model="formData" auto-label-width label-align="right">
                <AFormItem label="角色ID" field="role_id" v-if="formData.role_id">
                    <AInputNumber v-model="formData.role_id" :disabled="Boolean(formData.role_id)" />
                </AFormItem>
                <AFormItem label="角色名称" field="name" :rules="[{ required: true, message: '请输入角色名称' }]"
                    :validate-trigger="['change', 'blur']">
                    <AInput v-model="formData.name" />
                </AFormItem>
                <AFormItem label="角色描述" field="name" :rules="[{ required: true, message: '请输入角色描述' }]"
                    :validate-trigger="['change', 'blur']">
                    <AInput v-model="formData.description" />
                </AFormItem>
                <AFormItem label="角色等级" field="sort" :rules="[{ required: true, message: '请输入角色等级' }]"
                    :validate-trigger="['change', 'blur']">
                    <AInputNumber v-model="formData.sort" />
                </AFormItem>
                <AFormItem field="status" label="角色状态">
                    <ARadioGroup v-model="formData.status">
                        <ARadio v-for="item in status_type_list" :key="item.value" :value="item.value">{{ item.name }}
                        </ARadio>
                    </ARadioGroup>
                </AFormItem>
            </AForm>
        </template>
    </DialogForm>
</template>
  
<script lang="ts" setup>
import { ref, watchEffect, reactive, computed } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { status_type_list } from '@/utils/optionList'
import { opRoleSaveParams } from '@/api/controlCenter/adminrole'
import { AdminRoleSaveRole, RoleParams } from '@/api/UserManager/AdminRole'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { Message } from '@arco-design/web-vue'
const resetAdminRoleVisible = ref(false)

const formRef = ref<FormInstance>()
const emit = defineEmits(['update:value', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },

    classes: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: 'medium',
    },

    formDataItem: {
        type: Object,
        default() {
            return {}
        },
    },
    itemData: {
        type: Object,
        default() {
            return {}
        },
    },

    isCreate: {
        type: Boolean,
        default: true,
    },
    Visible: {
        type: Boolean,
        default: false,
    },
})

const formData = reactive<RoleParams>({
    description: '',
    menus: [],
    name: '',
    role_id: 0,
    sort: 0,
    status: 1
})
const handleCancel = () => {
    formRef.value?.resetFields()
}
const SubmitForm = async () => {
    const validate = await formRef.value?.validate()
    if (!validate) {
        const res = await AdminRoleSaveRole(formData)
        Message.success({ content: '角色权限编辑成功' })
        emit('update:value')
        resetAdminRoleVisible.value = false
    }
}
const openForm = () => {
    formRef.value?.resetFields()
    if (props.itemData.role_id) {
        formData.role_id = props.itemData.role_id
        formData.name = props.itemData.name
        formData.description = props.itemData.description
        formData.status = props.itemData.status
        formData.menus = props.itemData.menus
        formData.sort = props.itemData.sort
    }
    resetAdminRoleVisible.value = true
}
</script>
<style scoped>
:deep(.arco-modal) {
    max-width: 90%;
}
</style>
  
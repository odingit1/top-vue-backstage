<template>
    <DialogForm :title="submitText" :submit-text="submitText" :classes="classes" :size="size" :status="status" :width="800"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width autocomplete="off">
                <AFormItem label="请选择权限" field="role_id" :rules="[{ required: true, message: '请选择权限' }]"
                    :validate-trigger="['change', 'blur']">
                    <ASelect v-model="formData.role_id" placeholder="请选择用户权限">
                        <AOption v-for="item in (oproleList as any)" :key="item.value" :value="item.value"
                            :label="item.name">{{
                                item.name }}
                        </AOption>
                    </ASelect>
                </AFormItem>
                <AFormItem :disabled="formDataItem.user_id" label="用户名" autocomplete='new-password' field="username" :rules="[
                    { required: true, message: '请输入用户名' },
                ]" :validate-trigger="['change', 'blur']">
                    <AInput v-model="formData.username" autocomplete='new-password' placeholder="请输入用户名" />
                </AFormItem>
                <AFormItem field="password" label="用户密码" :rules="[
                    { required: true, message: '请输入6~18位用户密码', minLength: 5, maxLength: 18 },

                ]">
                    <AInputPassword allow-clear autocomplete='new-password' v-model="formData.password"
                        placeholder="请输入用户密码" />

                </AFormItem>
                <AFormItem v-if="!formDataItem.user_id" field="password2" :label="$t('reset.password.confirm')" :rules="[
                    {
                        required: true,
                        message: $t('reset.password.confirm.placeholder'),
                    },
                    {
                        validator: checkConfirmPassword,
                    },
                ]">
                    <AInputPassword v-model="formData.password2" allow-clear autocomplete="off" placeholder="请输入确认密码" />
                </AFormItem>
                <AFormItem label="真实姓名" field="nickname" :rules="[{ required: true, message: '请输入真实姓名' }]"
                    :validate-trigger="['change', 'blur']">
                    <AInput v-model="formData.nickname" placeholder="请输入真实姓名" />
                </AFormItem>
                <AFormItem field="status" label="状态">
                    <ARadioGroup v-model="formData.status">
                        <ARadio v-for="item in status_type_list" :key="item.value" :value="item.value">{{ item.name }}
                        </ARadio>
                    </ARadioGroup>
                </AFormItem>
                <AFormItem field="status" label="谷歌验证">
                    <ARadioGroup v-model="formData.google_status">
                        <ARadio :value="1">启用</ARadio>
                        <ARadio :value="2">禁用</ARadio>
                    </ARadioGroup>
                </AFormItem>

            </AForm>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { status_type_list } from '@/utils/optionList'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { Message } from '@arco-design/web-vue'

import { AdminManagerSaveManagerParams, AdminManagerSaveManager } from '@/api/UserManager/AccountTop'
const openShow = ref(false)
const formData = reactive<AdminManagerSaveManagerParams>({
    nickname: '',
    desc: '',
    google_status: 1,
    password: '',
    role_id: null,
    user_id: 0,
    status: 1,
    username: '',
    password2: '',
})

const modalFormRef = ref<FormInstance>()
const checkConfirmPassword = (value, callback) => {
    if (formData.password2 !== formData.password) {
        callback('新密码输入不一致')
    }
}


const emit = defineEmits(['updata', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },
    type: {
        type: Number,
        default: 0,
    },
    classes: {
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
    oproleList: {
        type: Array,
        default() {
            return []
        },
    }
})
const openForm = () => {
    modalFormRef.value?.resetFields()
    if (props.formDataItem.user_id) {
        formData.user_id = props.formDataItem.user_id
        formData.username = props.formDataItem.username
        formData.nickname = props.formDataItem.nickname
        formData.role_id = props.formDataItem.role_id
        formData.status = props.formDataItem.status
        formData.status = props.formDataItem.status
        formData.google_status = props.formDataItem.google_status
        formData.password = '******'
    }
    // formData.type = props.type
    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await AdminManagerSaveManager(formData)
        Message.success({ content: '用户配置编辑成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


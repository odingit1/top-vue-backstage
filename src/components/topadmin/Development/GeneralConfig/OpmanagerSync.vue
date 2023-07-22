<template>
    <DialogForm :title="submitText" :submit-text="submitText" :size="size" :status="status" :width="500"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width autocomplete="off">
                <AFormItem label="请选择平台" field="plat_ids" :rules="[{ required: true, message: '请选择平台' }]"
                    :validate-trigger="['change', 'blur']">
                    <SelectPlatform v-model="formData.plat_ids" multiple></SelectPlatform>

                </AFormItem>
                <AFormItem label="选择配置表" autocomplete='new-password' field="tab_names" :rules="[
                    { required: true, message: '请选择配置表' },
                ]" :validate-trigger="['change', 'blur']">
                    <SelectCfg v-model="formData.tab_names" optionName='title' placeholder="请选择配置表" optionValue='tab_name'
                        :group='true' :selectionArr="nameList" multiple></SelectCfg>
                </AFormItem>
            </AForm>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import SelectPlatform from '@/components/Selects/SelectPlatform.vue'
import SelectCfg from '@/components/Selects/SelectUniversal.vue'
import { commoncfgbatchsync, syncParams } from '@/api/Development/GeneralConfig'
import { Message } from '@arco-design/web-vue'

const openShow = ref(false)
const formData = reactive<syncParams>({
    tab_names: [],
    plat_ids: [],
})
const modalFormRef = ref<FormInstance>()
const emit = defineEmits(['updata', 'clickButton'])
const props = defineProps({
    submitText: {
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
    nameList: {
        type: Array,
        default() {
            return []
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
    formData.plat_ids = []
    formData.tab_names = []
    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await commoncfgbatchsync(formData)
        Message.success({ content: '同步配置成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


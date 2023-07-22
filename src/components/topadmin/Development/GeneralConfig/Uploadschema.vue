<template>
    <DialogForm title="上传配置" :submit-text="submitText" :size="size" :status="status" :width="600"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width autocomplete="off">
                <AFormItem label="请输入配置DATA" field="data" :rules="[{ required: true, message: '请输入配置DATA' }]"
                    :validate-trigger="['change', 'blur']">
                    <AInput v-model="formData.data" placeholder="请输入配置DATA" />
                </AFormItem>
                <AFormItem label="是否可修改" field="all_rpc_modify">
                    <ARadioGroup v-model="formData.all_rpc_modify">
                        <ARadio :value="1">可修改</ARadio>
                        <ARadio :value="0">不可修改</ARadio>
                    </ARadioGroup>
                </AFormItem>
            </AForm>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { commoncfguploadschema, uploadschemaParams } from '@/api/Development/GeneralConfig'
import { Message } from '@arco-design/web-vue'

const openShow = ref(false)
const formData = reactive<uploadschemaParams>({
    data: '',
    all_rpc_modify: 1,
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

})
const openForm = () => {
    modalFormRef.value?.resetFields()
    formData.data = ''
    formData.all_rpc_modify = 1
    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await commoncfguploadschema(formData)
        Message.success({ content: '同步配置成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


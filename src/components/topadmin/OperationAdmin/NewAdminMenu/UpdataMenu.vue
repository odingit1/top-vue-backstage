<template>
    <DialogForm :title="submitText" :submit-text="submitText" :classes="classes" :size="size" :status="status" :width="500"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width>
                <AFormItem label="菜单名称" field="title" :rules="[
                    { required: true, message: '请输入菜单名称' }]">
                    <AInput v-model="formData.title" placeholder="请输入菜单名称" />
                </AFormItem>
                <AFormItem label="菜单path" field="index" :rules="[
                    { required: true, message: '请输入菜单path' }]">
                    <AInput v-model="formData.index" placeholder="请输入菜单path" />
                </AFormItem>
                <AFormItem label="菜单name" field="classname" :rules="[
                    { required: true, message: '请输入菜单classname' }]">
                    <AInput v-model="formData.classname" placeholder="请输入菜单classname" />
                </AFormItem>
                <AFormItem label="上级菜单" field="pid">
                    <ASelect :style="{ width: '320px' }" v-model="formData.pid" placeholder="请选择上级菜单" allow-clear>
                        <AOption v-for="item in menu" :key="item.id" :label="item.title" :value="item.id">{{
                            item.title }}
                        </AOption>
                    </ASelect>

                </AFormItem>
                <AFormItem label="菜单类型" field="ispage">
                    <ARadioGroup v-model="formData.ispage">
                        <ARadio v-for="item in admin_ispage_type_list" :key="item.value" :value="item.value">{{ item.name }}
                        </ARadio>

                    </ARadioGroup>
                </AFormItem>
                <AFormItem label="排序" field="sort">
                    <AInputNumber v-model="formData.sort" :style="{ width: '320px' }" placeholder="菜单排序" :min="0"
                        :max="100" />

                </AFormItem>
            </AForm>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { opmenuupdate, menuParams } from '@/api/OperationAdmin/NewAdminMenu'
import { admin_ispage_type_list } from '@/utils/optionList'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
const { t } = useI18n()

const openShow = ref(false)
const formData = reactive<menuParams>({
    classname: '',
    ispage: 1,
    id: 0,
    title: "",
    sort: 0,
    pid: null,
    index: ''
})

const modalFormRef = ref<FormInstance>()

const emit = defineEmits(['updata', 'clickButton'])
const props = defineProps({
    submitText: {
        type: String,
        default: '',
    },
    menu: {
        type: Array,
        default: [],
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
})
const openForm = () => {
    modalFormRef.value?.resetFields()
    if (props.formDataItem.key) {
        formData.classname = props.formDataItem.classname
        formData.ispage = props.formDataItem.ispage
        formData.id = props.formDataItem.key
        formData.title = props.formDataItem.title
        formData.sort = props.formDataItem.sort
        formData.pid = props.formDataItem.pid
        formData.index = props.formDataItem.index
    }
    openShow.value = true
    emit('clickButton')
}

const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await opmenuupdate(formData)
        Message.success({ content: '菜单编辑成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


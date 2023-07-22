<template>
    <DialogForm :title="submitText" :submit-text="submitText" :classes="classes" :size="size" :status="status" :width="500"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <AForm ref="modalFormRef" :model="formData" auto-label-width>
                <AFormItem label="菜单名称" field="name" :rules="[
                    { required: true, message: '请输入菜单名称' }]">
                    <AInput v-model="formData.name" placeholder="请输入菜单名称" />
                </AFormItem>
                <AFormItem label="菜单path" field="url" :rules="[
                    { required: true, message: '请输入菜单path' }]">
                    <AInput v-model="formData.url" placeholder="请输入菜单path" />
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
                <AFormItem label="菜单分类" field="pid">
                    <ASelect :style="{ width: '320px' }" v-model="formData.is_old" placeholder="请选择上级菜单" allow-clear>
                        <AOption :value="0">旧</AOption>
                        <AOption :value="1">新</AOption>
                    </ASelect>

                </AFormItem>
                <AFormItem label="菜单类型" field="ispage">
                    <ARadioGroup v-model="formData.ispage">
                        <ARadio v-for="item in topadmin_ispage_type_list" :key="item.value" :value="item.value">{{ item.name
                        }}
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
import { topadmin_ispage_type_list } from '@/utils/optionList'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { Message } from '@arco-design/web-vue'
import { AdminMenuSaveMenu, menuParams } from '@/api/UserManager/AdminMenuTop'

const openShow = ref(false)
const formData = reactive<menuParams>({
    classname: '',
    ispage: 1,
    menu_id: 0,
    name: "",
    sort: 0,
    pid: null,
    is_old: 0
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
        formData.menu_id = props.formDataItem.key
        formData.name = props.formDataItem.title
        formData.sort = props.formDataItem.sort
        formData.pid = props.formDataItem.pid
        formData.url = props.formDataItem.index
        formData.is_old = props.formDataItem.is_old
    }
    openShow.value = true
    emit('clickButton')
}

const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        const res = await AdminMenuSaveMenu(formData)
        Message.success({ content: '菜单编辑成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


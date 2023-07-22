<template>
    <DialogForm :title="submitText" :submit-text="submitText" :size="size" :status="status" :width="1200"
        :is-ready-to-show="openShow" @click-button="openForm" @pop-submit="SubmitForm()">
        <template #content>
            <template v-if="schema">
                <VueForm :schema="configSchema" :ui-schema="uiSchema" ref="modalFormRef" v-model="formData"
                    :formFooter="formFooter" :formProps="formProps"></VueForm>
            </template>
        </template>
    </DialogForm>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import DialogForm from '@/components/Dialog/DialogForm.vue'
import { FormInstance } from '@arco-design/web-vue/es/form'

import { Message } from '@arco-design/web-vue'
const uiSchema = ref({
    'ui:type': {
        width: '100px',
        attrs: {
            width: '99px', // 这里直接传给widget组件，而非外层的width配置
        },
        style: {
            // 通过 vue render函数 style 传递给 Widget 组件，只能配置在叶子节点
            boxShadow: '0 0 6px 2px #2b9939'
        },
    },

})
const formFooter = ref({
    show: false, // 是否显示默认底部
    okBtn: '确认编辑', // 确认按钮文字
    okBtnProps: { type: 'success' }, // 传递确认按钮的 props，例如配置按钮 loading 状态 okBtnProps: { loading: true }
    cancelBtn: '取消编辑', // 取消按钮文字
    cancelBtnProps: { type: 'warning' },
    // 透传给formFooter 中的formItem组件的参数
    // 例如 vue3-ant 配置wrapperCol  formItemAttrs = { wrapperCol: { span: 10, offset: 5 }}
    formItemAttrs: {}
})
const formProps = ref({
    layoutColumn: 3, // 1 2 3 ，支持 1 2 3 列布局，如果使用inline表单这里配置无效
    inline: false, // 行内表单模式，建议：开启时labelPosition不要配置top, antd不要配置labelCol wrapperCol
    inlineFooter: false, // 如果想要保存按钮和表单元素一行显示，需要配置 true
    labelSuffix: '', // label后缀
    labelPosition: 'top', // 表单域标签的位置
    isMiniDes: true, // 是否优先mini形式显示描述信息（label文字和描述信息同行显示）
    defaultSelectFirstOption: true, // 单选框必填，是否默认选中第一个
})
const openShow = ref(false)
const configSchema = ref()
const formData = reactive<any>({})
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
    schema: {
        type: String,
        default: '',
    },
    data: {
        type: Object,
        default() {
            return {}
        },
    }
})
const openForm = () => {
    modalFormRef.value?.resetFields()
    configSchema.value = JSON.parse(props.schema)
    openShow.value = true
    emit('clickButton')
}
const SubmitForm = async () => {
    const validate = await modalFormRef.value?.validate()
    if (!validate) {
        // const res = await commoncfgbatchsync(formData)
        Message.success({ content: '同步配置成功' })
        emit('updata')
        openShow.value = false
    }
}
</script>

<style scoped lang="less"></style>


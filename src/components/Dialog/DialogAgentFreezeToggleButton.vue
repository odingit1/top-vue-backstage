<template>
    <AButton :status="buttonStatus" :disabled="disabled" size="mini" type="primary" @click="openCheckPop">
        {{ $t(`button.${actionType}`) }}
        <AModal v-model:visible="isOpenCheckPop" :modal-style="{ 'max-width': '90%' }" @cancel="handleCancel"
            @before-ok="handleSubmit">
            <template #title>
                <p v-if="title">{{ title }}</p>
            </template>
            <ASpace direction="vertical" :size="20" class="w-full">
                <slot name="content">
                    <ATypographyText v-if="content"> {{ content }}</ATypographyText>
                </slot>
                <AForm ref="modalFormRef" :model="formData" auto-label-width layout="vertical">
                    <AFormItem field="note" hide-asterisk :label="$t('label.note')" required>
                        <ATextarea v-model="formData.note" />
                    </AFormItem>
                    <AFormItem field="adminPassword" hide-asterisk :label="$t('mePassword.placeholder')" :rules="[
                        {
                            required: true,
                            message: $t('mePassword.placeholder'),
                        },
                        { minLength: 8, message: $t('input.wrongFormat') },
                    ]">
                        <AInputPassword v-model="formData.adminPassword" allow-clear autocomplete="off" />
                    </AFormItem>
                </AForm>
            </ASpace>
        </AModal>
    </AButton>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
    buttonText: {
        type: String,
        default: 'button.start',
    },
    actionType: {
        type: String,
        default: 'start',
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    isSuccess: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})
const { t } = useI18n()
const emit = defineEmits(['popSubmit', 'resetSuccess'])
const buttonStatus = computed(() => {
    if (props.actionType === 'frozen') {
        return 'danger'
    }
    return 'success'
})
const title = computed(() => {
    switch (props.actionType) {
        case 'frozen':
            return t('freeze.title')
        case 'thaw':
            return t('unfreeze.title')
        default:
            return t('button.start') + t('label.account')
    }
})
const content = computed(() => {
    switch (props.actionType) {
        case 'frozen':
            return t('freeze.content')
        default:
            return t('unfreeze.content')
    }
})
const isOpenCheckPop = ref(false)
const formData = reactive<{
    id: number
    note: string
    adminPassword: string
    updateAction: string
}>({
    id: props.id,
    note: '',
    adminPassword: '',
    updateAction: props.actionType,
})
const modalFormRef = ref<FormInstance>()
const openCheckPop = () => {
    isOpenCheckPop.value = true
}
const reset = async () => {
    await modalFormRef.value?.resetFields()
}
const handleCancel = async () => {
    await reset()
    isOpenCheckPop.value = false
    emit('resetSuccess')
}
const handleSubmit = async (done: (closed: boolean) => void) => {
    if (props.isLoading) return
    const validate = await modalFormRef.value?.validate()

    if (validate) {
        done(false)
        return
    }
    emit('popSubmit', formData)
    await reset()
    isOpenCheckPop.value = false
    done(false)
}
watch(
    () => props.isSuccess,
    (newVal) => {
        if (newVal) {
            handleCancel()
        }
    }
)
</script>

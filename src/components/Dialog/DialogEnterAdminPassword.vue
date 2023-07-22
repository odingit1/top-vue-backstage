<template>
  <AButton
    :type="buttonType"
    :status="buttonStatus"
    :disabled="disabled"
    size="mini"
    @click="openCheckPop"
  >
    {{ $t(buttonText) }}
    <AModal
      v-model:visible="isOpenCheckPop"
      :modal-style="{ 'max-width': '90%' }"
      @cancel="handleCancel"
      @before-ok="handleSubmit"
    >
      <template #title>
        <p v-if="title">{{ title }}</p>
      </template>
      <ASpace direction="vertical" :size="20">
        <slot name="content">
          <ATypographyText v-if="content"> {{ content }}</ATypographyText>
        </slot>
        <AForm
          ref="modalFormRef"
          :model="formData"
          auto-label-width
          layout="vertical"
        >
          <AFormItem
            field="adminPassword"
            hide-asterisk
            :label="$t('mePassword.placeholder')"
            :rules="[
              {
                required: true,
                message: $t('mePassword.placeholder'),
              },
              { minLength: 8, message: $t('input.wrongFormat') },
            ]"
          >
            <AInputPassword
              v-model="formData.adminPassword"
              allow-clear
              autocomplete="off"
            />
          </AFormItem>
        </AForm>
      </ASpace>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'

const props = defineProps({
  buttonText: {
    type: String,
    default: 'button.delete',
  },
  buttonStatus: {
    type: String,
    default: 'danger',
  },
  buttonType: {
    type: String,
    default: 'outline',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
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
const emit = defineEmits(['popSubmit', 'resetSuccess'])
const isOpenCheckPop = ref(false)
const formData = reactive<{ adminPassword: string }>({
  adminPassword: '',
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
  emit('popSubmit', formData.adminPassword)
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

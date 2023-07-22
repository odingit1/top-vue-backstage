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
      :title="$t(`modal.checkResetPassword.title`)"
      @cancel="handleCancel"
      @before-ok="handleSubmit"
    >
      <ASpace direction="vertical" :size="20">
        <slot name="content">
          <ATypographyText>
            {{
              $t(`admin.resetPassword.content`, {
                adminAccount: account,
              })
            }}</ATypographyText
          >
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
    <AModal
      :visible="isOpenCopyPop"
      :title="$t(`modal.resetPassword.success`)"
      title-align="start"
      simple
      hide-cancel
      :footer="false"
      :modal-style="{ 'max-width': '90%' }"
    >
      <ATypographyParagraph
        copyable
        :copy-tooltip-props="{
          popupVisible: false,
        }"
        @copy="copyText"
      >
        <ASpace direction="vertical" class="mb-4">
          <span>{{ $t('login.account') }} : {{ account }}</span>
          <span> {{ $t('login.password') }} : {{ password }} </span>
        </ASpace>
        <template #copy-icon>
          <div class="button-copy">
            <AButton type="primary" class="float-right">{{
              $t('button.copyAndClose')
            }}</AButton>
          </div>
        </template>
      </ATypographyParagraph>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { requestHandler } from '@/utils/tool'
import { resetAdminPassword } from '@/api/admin'

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  account: {
    type: String,
    default: null,
  },
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
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['popSubmit', 'resetSuccess'])
const isOpenCheckPop = ref(false)
const isLoading = ref(false)
const isOpenCopyPop = ref(false)
const password = ref(null)
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
const copyText = () => {
  isOpenCopyPop.value = false
  password.value = null
}
const resetPassword = requestHandler(async () => {
  const response = await resetAdminPassword({
    id: props.id,
    adminPassword: formData.adminPassword,
  })
  password.value = response.data.password
  isOpenCheckPop.value = false
}, isLoading)
const handleSubmit = async (done: (closed: boolean) => void) => {
  if (isLoading.value) return
  const validate = await modalFormRef.value?.validate()

  if (validate) {
    done(false)
    return
  }
  await resetPassword()
  done(false)
  isOpenCopyPop.value = Boolean(password.value)
}
</script>

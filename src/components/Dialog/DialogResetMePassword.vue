<template>
  <AButton type="outline" @click="showResetPassword">
    {{ $t('me.resetPassword') }}
    <AModal
      v-model:visible="resetPasswordVisible"
      :title="$t('reset.password')"
      :modal-style="{ 'max-width': '90%' }"
      @before-ok="handleSubmit"
      @cancel="handleCancel"
    >
      <div v-if="errorMessage" class="text-red-500 text-center w-full mb-4">
        {{ errorMessage }}
      </div>
      <AForm
        ref="formRef"
        :model="formData"
        layout="vertical"
        auto-label-width
        label-align="right"
      >
        <AFormItem
          field="oldPassword"
          :label="$t('reset.password.old')"
          :rules="[
            { required: true, message: $t('reset.password.old.placeholder') },
            { minLength: 6, message: $t('input.wrongFormat') },
          ]"
        >
          <AInputPassword
            v-model="formData.oldPassword"
            allow-clear
            autocomplete="off"
          />
        </AFormItem>
        <AFormItem
          field="newPassword"
          :label="$t('reset.password.new')"
          :rules="[
            { required: true, message: $t('reset.password.new.placeholder') },
            {
              match: /^(?=.*[A-Z])(?=.*[1-9])[a-zA-Z0-9].{7,}$/,
              message: $t('input.wrongFormat'),
            },
          ]"
        >
          <AInputPassword
            v-model="formData.newPassword"
            allow-clear
            autocomplete="off"
          />
          <template #extra>
            <div>
              {{ $t('reset.password.extra') }}
            </div>
          </template>
        </AFormItem>
        <AFormItem
          field="confirmPassword"
          :label="$t('reset.password.confirm')"
          :rules="[
            {
              required: true,
              message: $t('reset.password.confirm.placeholder'),
            },
            {
              validator: checkConfirmPassword,
            },
          ]"
        >
          <AInputPassword
            v-model="formData.confirmPassword"
            allow-clear
            autocomplete="off"
          />
        </AFormItem>
        <AFormItem
          v-if="meData.google_status"
          field="otpCode"
          :label="$t('reset.authenticatorCode.confirm')"
          :rules="[
            {
              required: true,
              message: $t('reset.authenticatorCode.confirm.placeholder'),
            },
          ]"
        >
          <AInputPassword
            v-model="formData.otpCode"
            allow-clear
            autocomplete="off"
          />
        </AFormItem>
      </AForm>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive, computed } from 'vue'
import useUser from '@/hooks/user'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { resetMePassword, ResetMePasswordParams } from '@/api/me'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, useMeStore } from '@/store'

const appStore = useAppStore()
const meStore = useMeStore()
const meData = computed(() => {
  return meStore.userInfo
})
const { t } = useI18n()
const { logout } = useUser()
const resetPasswordVisible = ref(false)
const isMobile = computed(() => appStore.device === 'mobile')

const showResetPassword = () => {
  resetPasswordVisible.value = !resetPasswordVisible.value
}
const formRef = ref<FormInstance>()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  uid: {
    type: Number,
    default: 0,
  },
})

const visible = ref(props.visible)
const errorMessage = ref('')

watchEffect(() => {
  visible.value = props.visible
})
const formData = reactive<ResetMePasswordParams>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  otpCode: '',
})
const reset = async () => {
  await formRef.value?.resetFields()
}
const handleCancel = async () => {
  await reset()
  errorMessage.value = ''
  resetPasswordVisible.value = false
}
const handleSubmit = async (done: (closed: boolean) => void) => {
  const validate = await formRef.value?.validate()
  if (validate) {
    done(false)
    return
  }

  try {
    const params: ResetMePasswordParams = {
      newPassword: formData.newPassword,
      oldPassword: formData.oldPassword,
      otpCode: formData.otpCode,
    }
    await resetMePassword(params)
    Message.success(t('button.success'))
    await logout()
  } catch (err) {
    // if (err.response) {
    //   if (err.response.data.errors) {
    //     const errors = err.response.data.errors
    //     Object.keys(errors).forEach((errorKey) => {
    //       const errorType = errorKey
    //       const errorText = errors[errorKey][0]
    //       errorMessage.value = `${t(errorType)} ${t(errorText)}`
    //     })
    //   }
    //   if (err.response.data.error) {
    //     errorMessage.value = t(err.response.data.error)
    //   }
    // } else {
    //   console.error(err)
    // }
    done(false)
  }
}
const checkConfirmPassword = (value, callback) => {
  if (formData.newPassword !== formData.confirmPassword) {
    callback(t('reset.password.confirm.failed'))
  }
}
</script>
<style scoped>
:deep(.arco-modal) {
  max-width: 90%;
}
</style>

<template>
  <AButton type="outline" @click="showResetEmail">
    {{ $t('me.resetEmail') }}
    <AModal
      v-model:visible="resetEmailVisible"
      :title="$t('reset.email')"
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
        <AFormItem field="email" :label="$t('reset.email.old')">
          <AInput v-model="meStore.userInfo.email" disabled />
        </AFormItem>
      </AForm>
      <AForm
        ref="formRef"
        :model="formData"
        layout="vertical"
        auto-label-width
        label-align="right"
      >
        <AFormItem
          field="email"
          :label="$t('reset.email.new')"
          :rules="[
            { required: true, message: $t('label.email.placeholder') },
            {
              validator: checkEmail,
            },
          ]"
        >
          <AInput
            v-model="formData.email"
            :placeholder="$t('label.email.placeholder')"
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
import { ResetMeEmailParams } from '@/api/me'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, useMeStore } from '@/store'

const appStore = useAppStore()
const { t } = useI18n()
const meStore = useMeStore()
const resetEmailVisible = ref(false)
const isMobile = computed(() => appStore.device === 'mobile')

const showResetEmail = () => {
  resetEmailVisible.value = !resetEmailVisible.value
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
const formData = reactive<ResetMeEmailParams>({
  email: '',
})
const reset = async () => {
  await formRef.value?.resetFields()
}
const handleCancel = async () => {
  await reset()
  errorMessage.value = ''
  resetEmailVisible.value = false
}
const handleSubmit = async (done: (closed: boolean) => void) => {
  const validate = await formRef.value?.validate()
  if (validate) {
    done(false)
    return
  }

  try {
    const params: ResetMeEmailParams = {
      email: formData.email,
    }
    await meStore.info()
    Message.success(t('button.success'))
    resetEmailVisible.value = false
  } catch (err) {
    if (err.response) {
      if (err.response.data.errors) {
        const errors = err.response.data.errors
        Object.keys(errors).forEach((errorKey) => {
          const errorType = errorKey
          const errorText = errors[errorKey][0]
          errorMessage.value = `${t(errorType)} ${t(errorText)}`
        })
      }
      if (err.response.data.error) {
        errorMessage.value = t(err.response.data.error)
      }
    } else {
      console.error(err)
    }
    done(false)
  }
}
const checkEmail = (email, callback) => {
  if (!email) return
  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  if (email.search(emailRule) === -1) {
    callback(`${t('label.email')} ${t('input.wrongFormat')}`)
  }
}
</script>
<style scoped>
:deep(.arco-modal) {
  max-width: 90%;
}
</style>

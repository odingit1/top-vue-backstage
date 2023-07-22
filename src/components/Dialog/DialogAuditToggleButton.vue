<template>
  <AButton
    :status="buttonStatus"
    :disabled="disabled"
    type="primary"
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
      <ASpace direction="vertical" :size="20" class="w-full">
        <slot name="content">
          <ATypographyText>{{ $t('audit.confirm.text') }}</ATypographyText>
        </slot>
        <AForm
          ref="modalFormRef"
          :model="formData"
          auto-label-width
          layout="vertical"
        >
          <AFormItem
            field="note"
            :label="$t('label.note')"
            :required="!isApprove"
          >
            <ATextarea v-model="formData.note" />
          </AFormItem>
        </AForm>
      </ASpace>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'

const props = defineProps({
  buttonText: {
    type: String,
    default: 'button.delete',
  },
  actionType: {
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
const isApprove = computed(() => {
  return Boolean(props.actionType === 'approve')
})
const buttonStatus = computed(() => {
  return isApprove.value ? 'success' : 'danger'
})
const isOpenCheckPop = ref(false)
const formData = reactive<{ note: string }>({
  note: '',
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
  emit('popSubmit', formData.note)
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

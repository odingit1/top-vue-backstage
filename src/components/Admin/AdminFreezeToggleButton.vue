<template>
  <DialogEnterAdminPassword
    :button-text="buttonText"
    :button-type="isFreeze ? 'primary' : 'outline'"
    :title="isFreeze ? $t('button.unfreeze') : $t(`modal.checkDelete.title`)"
    :content="buttonContent"
    :is-success="isSuccess"
    @reset-success="resetSuccess"
    @pop-submit="
      (event) => (isFreeze ? restore(admin.id, event) : freeze(admin.id, event))
    "
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { requestHandler } from '@/utils/tool'
import { freezeAdmin, restoreAdmin } from '@/api/admin'
import DialogEnterAdminPassword from '../Dialog/DialogEnterAdminPassword.vue'

const emit = defineEmits(['refresh'])
const props = defineProps({
  admin: {
    type: Object,
    default() {
      return {}
    },
  },
})

const { t } = useI18n()
const isLoading = ref(false)
const isSuccess = ref(false)
const resetSuccess = () => {
  isSuccess.value = false
}
const isFreeze = computed(() => {
  return Boolean(props.admin.deletedAt)
})
const buttonText = computed(() => {
  return isFreeze.value ? 'button.unfreeze' : 'button.freeze'
})
const buttonContent = computed(() => {
  return isFreeze.value
    ? ''
    : t('admin.delete.content', {
        adminAccount: props.admin.account,
      })
})
const restore = (id: number, event: string) => {
  const submit = requestHandler(async () => {
    const params = {
      id: id,
      adminPassword: event,
    }
    await restoreAdmin(params)
    await emit('refresh')
    isSuccess.value = true
  }, isLoading)
  submit()
}
const freeze = (id: number, event: string) => {
  const submit = requestHandler(async () => {
    const params = {
      id: id,
      adminPassword: event,
    }
    await freezeAdmin(params)
    await emit('refresh')
    isSuccess.value = true
  }, isLoading)
  submit()
}
</script>

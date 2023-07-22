<template>
  <AButton class="px-5" :disabled="disabled" :type="type" :size="size" :status="status" @click="onClick">
    <slot name="buttonTitle">{{ submitText }}</slot>
    <AModal
      v-if="isOpenPop"
      :visible="isOpenPop"
      :title="title"
      :width="width"
      :modal-style="{ 'max-width': '90%' }"
      :footer="!hideFooter"
      @before-ok="handleSubmit"
      @cancel="closePop"
    >
      <slot name="content">
        <ATypographyText v-if="content">{{ content }}</ATypographyText>
      </slot>
    </AModal>
  </AButton>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['popSubmit', 'clickButton'])

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
  },
  status: {
    type: String,
    default: 'danger',
  },
  request: {
    type: Function,
    default() {
      return false
    },
  },
  submitText: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: 400,
  },
  content: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'Medium',
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  isReadyToClose: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const isOpenPop = ref(false)

const onClick = async () => {
  let valid = true
  // if (props.request) {
  //     valid = !Boolean(await props.request())
  // }
  emit('clickButton')
  if (valid) {
    isOpenPop.value = true
  }
}
const closePop = () => {
  isOpenPop.value = false
}
const handleSubmit = async (done: (closed: boolean) => void) => {
  emit('popSubmit')
  done(true)
  closePop()
}

watch(
  () => props.isReadyToClose,
  (newVal) => {
    if (newVal) {
      closePop()
    }
  }
)
</script>
  
<style scoped lang="less"></style>
  
<template>
  <AButton :class="classes" type="primary" :size="size" :status="status" @click="onClick" :disabled="disabled">
    <slot name="buttonTitle">{{ submitText }}</slot>
    <AModal
      v-if="isOpenPop"
      :visible="isOpenPop"
      :title="title"
      :footer="footer"
      :modal-style="{ 'max-width': '90%' }"
      :width="width"
      :cancel-text="cancelText"
      :okText="okText"
      @ok="handleSubmit"
      @cancel="closePop"
    >
      <slot name="content"></slot>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
const emit = defineEmits(['popSubmit', 'clickButton', 'closeModal'])
const isOpenPop = ref(false)

const props = defineProps({
  submitText: {
    type: String,
    default: '',
  },

  title: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  width: {
    type: Number,
    default: 600,
  },
  classes: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'Medium',
  },
  status: {
    type: String,
    default: 'normal',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isReadyToShow: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  formSubmit: {
    type: Function,
    default() {
      return false
    },
  },
})
const onClick = async () => {
  emit('clickButton')
  if (props.isReadyToShow) {
    isOpenPop.value = true
  }
}
const closePop = () => {
  emit('closeModal')
  isOpenPop.value = false
}
const handleSubmit = async (done: (closed: boolean) => void) => {
  emit('popSubmit')
}

watch(
  () => props.isReadyToShow,
  (newVal) => {
    if (newVal) {
      isOpenPop.value = true
    } else {
      isOpenPop.value = false
    }
  }
)
</script>

<style scoped lang="less">
// :deep(.arco-form-item-message-help) {
//     color: red;
// }
</style>

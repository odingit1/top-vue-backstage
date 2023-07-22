<template>
  <AButton :class="buttonDefaultClass" :type="type" @click="onClick">
    {{ submitText }}
    <AModal
      :visible="isOpenPop"
      :title="title"
      title-align="start"
      simple
      hide-cancel
      :footer="false"
      :modal-style="{ 'max-width': '90%' }"
    >
      <slot name="content"></slot>
      <ATypographyParagraph
        copyable
        :copy-tooltip-props="{
          popupVisible: false,
        }"
        @copy="copyText"
      >
        <div :class="hideCopyText ? 'hide' : ''">
          <slot name="copyContent"></slot>
        </div>
        <template #copy-icon>
          <div class="button-copy">
            <AButton type="primary">{{ $t('button.copyAndClose') }}</AButton>
          </div>
        </template>
      </ATypographyParagraph>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { buttonDefaultClass } from '@/utils/class'

const emit = defineEmits(['clickButton'])
const router = useRouter()
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
  isReadyToCopy: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: '',
  },
  hideCopyText: {
    type: Boolean,
    default: false,
  },
})
const isOpenPop = ref(false)

const onClick = async () => {
  emit('clickButton')
  isOpenPop.value = true
}

const copyText = () => {
  isOpenPop.value = false
  Message.success({
    content: '已成功复制',
    duration: 2000,
  })
}

watch(
  () => props.isReadyToCopy,
  (newVal) => {
    if (newVal) {
      isOpenPop.value = true
    }
  }
)
</script>

<style scoped lang="less">
.button-copy {
  display: flex;
  justify-content: flex-end;
}

.hide {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>

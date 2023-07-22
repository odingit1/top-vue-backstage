<template>
  <div>
    <ACollapse :default-active-key="['teaching']" :bordered="false">
      <ACollapseItem key="teaching" class="mb-2" :show-expand-icon="false">
        <template #header>
          <div class="block">
            <span class="mr-1">{{ $t('2FA.teaching') }}</span>
            <IconQuestionCircle />
          </div>
        </template>
        <div class="mb-4 mt-4">
          <p class="mb-2">{{ $t('login.download2FA') }}</p>
          <div class="flex">
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              class="h-min p-0 mr-4"
            >
              <img class="h-10" :src="GooglePlay" />
            </a>
            <a
              href="https://apps.apple.com/app/google-authenticator/id388497605"
              target="_blank"
              class="h-min p-0"
            >
              <img class="h-10" :src="AppleStore" />
            </a>
          </div>
        </div>
        <div>A.{{ $t('2FA.stepA') }}</div>
        <div class="mb-4">
          B. {{ $t('2FA.choose') }}
          <span class="font-bold">{{ $t('2FA.scan') }}</span>
        </div>
      </ACollapseItem>
    </ACollapse>
    <div
      class="flex flex-wrap sm:flex-nowrap items-center justify-center py-2 mb-2"
    >
      <QrcodeVue :value="provisioningUri" :size="150" />
      <ASpace :size="4" direction="vertical" class="p-4">
        <div class="flex flex-wrap">
          <span>{{ $t('2FA.secretKey') }}:</span>
          <ATypographyParagraph class="mb-0 flex justify-between" copyable>
            <p class="break-all">{{ copyKey }}</p>
          </ATypographyParagraph>
        </div>
        <p>{{ $t('2FA.note') }}</p>
      </ASpace>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import AppleStore from '@/assets/images/apple_store.png'
import GooglePlay from '@/assets/images/google_play.png'

const props = defineProps({
  provisioningUri: {
    type: String,
    default: null,
  },
})

const copyKey = computed(() => {
  if (!props.provisioningUri) return null
  const key = props.provisioningUri.split('secret=')[1].split('&issuer')[0]
  return key
})
</script>

<style scoped lang="less">
:deep(.arco-collapse-item-header) {
  justify-content: flex-end;
}
:deep(div.arco-typography, p.arco-typography) {
  margin-bottom: 0;
}
:deep(.arco-icon-hover::before) {
  content: unset;
}
</style>

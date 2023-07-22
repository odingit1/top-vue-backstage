<template>
  <ASpace class="content" direction="vertical" size="large" fill>
    <ACard :bordered="false">
      <ADescriptions
        :column="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }"
        bordered
        :label-style="{
          maxWidth: '140px',
          minWidth: '140px',
          whiteSpace: 'normal',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          minWidth: '140px',
          whiteSpace: 'normal',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <ADescriptionsItem
          v-for="column of [
            { key: 'id', title: 'label.id' },
            { key: 'user_name', title: 'label.account' },
            { key: 'login_time', title: 'label.lastSignInAt' },
            { key: 'google_status', title: 'label.2FA' },
          ]"
          :key="column.key"
          :label="$t(column.title)"
        >
          <CheckObjectKeyExist
            :object="meData"
            :object-key="column.key"
            :date-type-list="['login_time']"
          >
            <template v-if="column.key === 'google_status'" #content>
              {{
                meData['google_status']
                  ? $t('label.2FA.radio.on')
                  : $t('label.2FA.radio.off')
              }}
            </template>
          </CheckObjectKeyExist>
        </ADescriptionsItem>
      </ADescriptions>
      <div class="mt-4 flex gap-x-2">
        <DialogResetMePassword />
      </div>
    </ACard>
  </ASpace>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMeStore } from '@/store'
import CheckObjectKeyExist from '@/components/Components/CheckObjectKeyExist.vue'
import DialogResetMePassword from '@/components/Dialog/DialogResetMePassword.vue'
import { getUserData } from '@/utils/auth'
const meStore = useMeStore()
// const meData = computed(() => {
//   return meStore.userInfo
// })
const meData = getUserData()
</script>

<style scoped lang="less">
.wrapper {
  min-height: 580px;
  padding: 20px 0 0 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>

<template>
  <div class="container">
    <ARow style="margin-bottom: 16px">
      <ACol :span="24">
        <MePanel />
      </ACol>
    </ARow>
    <ACard :title="$t('userSetting.action')">
      <DialogResetMePassword />
    </ACard>
  </div>
</template>

<script lang="ts" setup>
import DialogResetMePassword from '@/components/Me/DialogResetMePassword.vue'
import MePanel from '@/components/Me/MePanel.vue'
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

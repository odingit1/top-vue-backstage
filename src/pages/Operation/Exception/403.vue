<template>
  <div class="content">
    <AResult
      class="result"
      status="403"
      :subtitle="$t('exception.result.403.description')"
    />
    <AButton key="back" type="primary">
      {{ $t('exception.result.403.back') }}
    </AButton>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default {
  name: '403',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100% - 40px);
  :deep(.content) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background-color: var(--color-bg-1);
    border-radius: 4px;
  }
}
</style>

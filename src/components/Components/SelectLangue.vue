@@ -0,0 +1,58 @@
<template>
  <ADropdown trigger="click" position="bottom" @select="changeLocale">
    <AButton ref="triggerBtn" class="nav-btn" type="outline" :shape="'circle'">
      <template #icon>
        <IconLanguage />
      </template>
    </AButton>
    <template #content>
      <ADoption v-for="item in locales" :key="item.value" :value="item.value">
        {{ item.label }}
      </ADoption>
    </template>
  </ADropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { LOCALE_OPTIONS } from '@/locale'
import useLocale from '@/hooks/locale'

const triggerBtn = ref()
const { changeLocale } = useLocale()
const locales = [...LOCALE_OPTIONS]
</script>

<style scoped>
.nav-btn {
  color: rgb(var(--gray-8));
  border-color: inherit;
  font-size: 16px;
}
</style>

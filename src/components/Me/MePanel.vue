<template>
  <ASpace class="content" direction="vertical" size="large" fill>
    <ACard :bordered="false" :title="$t('me.account')">
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
            { key: 'account', title: 'label.account' },
            { key: 'roles', title: 'label.roles' },
            { key: 'departments', title: 'label.department' },
          ]"
          :key="column.key"
          :label="$t(column.title)"
        >
          <CheckObjectKeyExist :object="meData" :object-key="column.key">
            <template
              v-if="['roles', 'departments'].includes(column.key)"
              #content
            >
              <ASpace wrap>
                <ATag
                  v-for="item in meData[column.key]"
                  :key="item.id"
                  class="mt-2"
                >
                  {{ $t(`${column.key}.${item.name}`) }}
                </ATag>
              </ASpace>
            </template>
          </CheckObjectKeyExist>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="$t('me.activity')">
      <ADescriptions
        :column="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }"
        bordered
        :label-style="{
          maxWidth: '140px',
          minWidth: '140px',
          whiteSpace: 'normal',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          minWidth: '200px',
          whiteSpace: 'normal',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <ADescriptionsItem
          v-for="item of ['createdAt', 'lastSignInAt', 'signInCount']"
          :key="item"
          :label="$t(`label.${item}`)"
        >
          <CheckObjectKeyExist
            :object="meData"
            :object-key="item"
            :date-type-list="['createdAt', 'lastSignInAt']"
          />
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
  </ASpace>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMeStore } from '@/store'
import CheckObjectKeyExist from '@/components/Components/CheckObjectKeyExist.vue'

const meStore = useMeStore()
const meData = computed(() => {
  return meStore.userInfo
})
</script>

<style scoped lang="less"></style>

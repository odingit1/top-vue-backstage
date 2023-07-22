<template>
  <ACollapse
    :bordered="false"
    :default-active-key="['cs', 'agent', 'op']"
    class="flex flex-wrap w-full"
  >
    <ACollapseItem
      key="cs"
      :header="$t('system.customerService')"
      class="permission-box mr-8"
    >
      <ASpace :size="16" direction="vertical">
        <PermissionCheckbox
          v-for="group in csPermissionGroup"
          :key="group.name"
          :value="selected[group.name]"
          :default-value="defaultValue"
          :permissions="group.permissions"
          :title="group.name"
          @change-selected="(permission) => changeSelected(permission)"
        />
      </ASpace>
    </ACollapseItem>
    <ACollapseItem
      key="agent"
      :header="$t('system.agentService')"
      class="permission-box mr-8"
    >
      <ASpace :size="16" direction="vertical">
        <PermissionCheckbox
          v-for="group in agentPermissionGroup"
          :key="group.name"
          :value="selected[group.name]"
          :default-value="defaultValue"
          :permissions="group.permissions"
          :title="group.name"
          @change-selected="(permission) => changeSelected(permission)"
        />
      </ASpace>
    </ACollapseItem>
    <ACollapseItem
      key="op"
      :header="$t('system.operation')"
      class="permission-box"
    >
      <ASpace :size="16" direction="vertical">
        <PermissionCheckbox
          v-for="group in opPermissionGroup"
          :key="group.name"
          :value="selected[group.name]"
          :default-value="defaultValue"
          :permissions="group.permissions"
          :title="group.name"
          @change-selected="(permission) => changeSelected(permission)"
        />
      </ASpace>
    </ACollapseItem>
  </ACollapse>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { queryPermissionGroups } from '@/api/role'
import { requestHandler } from '@/utils/tool'
import PermissionCheckbox from '@/components/Selects/PermissionCheckbox.vue'

const props = defineProps({
  defaultValue: {
    type: Array,
    required: true,
  },
})

const selected = ref([])
const emit = defineEmits(['changePermissions'])
const groupList = ref([])
const opPermissionGroup = computed(() => {
  return groupList.value
    .filter((group) => {
      return group.name.startsWith('op_')
    })
    .sort((a, b) => {
      return (a.permissions.length || 0) - (b.permissions.length || 0)
    })
})
const csPermissionGroup = computed(() => {
  return groupList.value
    .filter((group) => {
      return group.name.startsWith('cs_')
    })
    .sort((a, b) => {
      return (a.permissions.length || 0) - (b.permissions.length || 0)
    })
})
const agentPermissionGroup = computed(() => {
  return groupList.value
    .filter((group) => {
      return group.name.startsWith('agent_')
    })
    .sort((a, b) => {
      return (a.permissions.length || 0) - (b.permissions.length || 0)
    })
})

const changeSelected = (permission) => {
  selected.value[permission.title] = permission.value
  let array = []
  groupList.value.forEach((group) => {
    if (selected.value[group.name]) {
      array = array.concat(selected.value[group.name])
    }
  })
  emit('changePermissions', array)
}

const getPermissionGroups = requestHandler(async () => {
  const response = await queryPermissionGroups()
  groupList.value = response.data.permissionGroups
})

onMounted(async () => {
  await getPermissionGroups()
})
</script>

<style scoped lang="less">
.permission-box {
  width: 40%;
  min-width: 360px;
}
:deep(.arco-collapse-item) {
  border-bottom: 1px solid transparent !important;
}
</style>

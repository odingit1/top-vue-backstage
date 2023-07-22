<template>
  <ASpace :size="4" direction="vertical">
    <ACheckbox
      v-if="permissions.length > 1"
      v-model="isCheckAll"
      @change="checkAll"
    >
      {{ $t(`permission.${title}`) }}
    </ACheckbox>
    <ACheckboxGroup v-model="selected" @change="changeSelected">
      <ASpace wrap :size="0">
        <ACheckbox
          v-for="permission in permissionList"
          :key="permission.id"
          :value="permission.id"
        >
          {{
            $t(
              ['permission', permission.resource, permission.actions[0]].join(
                '.'
              )
            )
          }}
          {{
            permissions.length > 1 || title.includes('login')
              ? null
              : $t(`permission.${title}`)
          }}
        </ACheckbox>
      </ASpace>
    </ACheckboxGroup>
  </ASpace>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, ref } from 'vue'
import { hasSameValueOnArray } from '@/utils/tool'

const props = defineProps({
  value: {
    type: Array,
    default() {
      return []
    },
  },
  permissions: {
    type: Array,
    default() {
      return []
    },
  },
  title: {
    type: String,
    default: '',
  },
  defaultValue: {
    type: Array,
    default() {
      return []
    },
  },
})
const emit = defineEmits(['changeSelected'])
const isLoading = ref(false)
const isCheckAll = ref(false)
const selected = ref([])
const list = computed(() => {
  const array = [] as []
  props.permissions.forEach((permission) => {
    array.push(permission.id)
  })
  return array
})
const permissionList = computed(() => {
  if (props.title === 'op_agent_agent') {
    return props.permissions
  }
  const sortName = ['read', 'create']
  let sortList: Array<any> = []
  let array: Array<any> = []
  Object.values(props.permissions)
    .sort((a, b) => a.actions[0] - b.actions[0])
    .forEach((item) => {
      if (item.resource === 'ExportCsv' || sortName.includes(item.actions[0])) {
        sortList.unshift(item)
      } else {
        array.push(item)
      }
    })
  sortList.forEach((item) => array.unshift(item))
  return array
})

const changeSelected = () => {
  isLoading.value = true
  if (
    selected.value.length > 0 &&
    hasSameValueOnArray(selected.value, list.value)
  ) {
    isCheckAll.value = true
    isLoading.value = false
    return
  }
  isCheckAll.value = false
  isLoading.value = false
}

const checkAll = () => {
  if (isCheckAll.value) {
    return (selected.value = list.value)
  }
  selected.value = []
}
const setDefault = async (val) => {
  selected.value = []
  if (!val) return
  list.value.forEach((id) => {
    if (Object.values(val).includes(id)) {
      if (selected.value.includes(id)) {
        return
      }
      selected.value.push(id)
    }
  })
}
onMounted(async () => {
  await setDefault(props.defaultValue)
  await changeSelected()
})

watch(
  () => ({ ...props.defaultValue }),
  async (newVal) => {
    await setDefault(newVal)
    changeSelected()
  }
)
watch(
  () => selected.value,
  (newVal, oldVal) => {
    if (newVal.length === oldVal.length) {
      return
    }
    emit('changeSelected', { title: props.title, value: newVal })
  }
)
</script>

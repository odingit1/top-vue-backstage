<template>
  <AButton
    type="text"
    class="w-full"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <p class="overflow-hidden whitespace-nowrap text-ellipsis">
      {{ buttonText }}
    </p>
    <AModal
      v-model:visible="visible"
      :width="'80vw'"
      :title="$t('label.note')"
      :footer="false"
    >
      <ATable
        row-key="id"
        :data="noteList"
        :bordered="false"
        :stripe="true"
        :pagination="false"
        :scroll="{ x: '500px' }"
        page-position="bottom"
        align="left"
      >
        <template #columns>
          <ATableColumn
            v-for="column in tableColumns"
            :key="column.key"
            :title="$t(column.title)"
            :data-index="column.key"
            :width="column.width"
            :align="onlyNotes ? 'left' : 'center'"
            class="word-break-word"
          >
            <template #cell="{ record }">
              <span v-if="onlyNotes">{{ record }}</span>
              <span v-else>
                {{
                  isDateType(column.key)
                    ? formatDate(record[column.key])
                    : record[column.key]
                }}
              </span>
            </template>
          </ATableColumn>
        </template>
      </ATable>
    </AModal>
  </AButton>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/tool'

const props = defineProps({
  notes: {
    type: Array,
    default() {
      return []
    },
  },
  onlyNotes: {
    type: Boolean,
    default: false,
  },
})

const visible = ref(false)
const buttonText = computed(() => {
  if (!props.notes) return '-'
  if (props.onlyNotes) {
    return props.notes[0]
  }
  return props.notes[0]?.content
})
const isDisabled = computed(() => {
  return Boolean(!props.notes || props.notes?.length === 0)
})
const noteList = computed(() => {
  const notes = props.notes
  if (!notes) return []
  if (props.onlyNotes) {
    notes.reverse()
  }
  return notes
})
const tableColumns = computed(() => {
  if (props.onlyNotes) {
    return [{ key: 'content', title: 'userNote.history.note' }]
  }
  return [
    {
      key: 'id',
      title: 'userNote.history.id',
      width: 80,
    },

    { key: 'content', title: 'userNote.history.note', width: 200 },
    {
      key: 'createdAt',
      title: 'userNote.history.createdAt',
      width: 180,
    },

    {
      key: 'adminAccount',
      title: 'label.operator',
      width: 180,
    },
  ]
})
const handleClick = () => {
  if (!props.notes || props.notes?.length === 0) return
  visible.value = true
}
const isDateType = (type: string) => {
  return ['createdAt'].includes(type)
}
</script>

<style scoped lang="scss"></style>

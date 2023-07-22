<template>
  <div>
    <!-- <ABadge v-show="isObjectKeyNotExisit && isTestEnvironment" text="noKey(ಥ＿ಥ)" /> -->
    <slot name="content">
      <ATypographyText
        v-if="isColorPointType && isPointTypeList"
        :type="isNegative(contentValue) ? 'danger' : 'success'"
      >
        {{ isNegative(contentValue) ? '' : '+' }}
        {{ contentValue }}
      </ATypographyText>
      <ATypographyText
        v-else-if="isColorRatioType && isRatioTypeList"
        :type="isNegative(contentValue) ? 'danger' : 'success'"
      >
        {{ isNegative(contentValue) ? '' : '+' }}
        {{ contentValue }}
      </ATypographyText>
      <span v-else>{{ contentValue }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, formatThousandsSeparator } from '@/utils/tool'
import { getPoint, getRatio } from '@/utils/utils'
import { timeDate } from '@/timezone/date'
import { appInfoStore } from '@/store'
const props = defineProps({
  object: {
    type: Object,
    default() {
      return {}
    },
  },
  objectKey: {
    type: String,
    default: null,
    require: true,
  },
  dateTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  dateFormatTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  priceTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  counterTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  ratioTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  ratioTypeList2: {
    type: Array,
    default() {
      return []
    },
  },
  pointTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  langTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  colorPointTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  colorRatioTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  timeTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  integralTypeList: {
    type: Array,
    default() {
      return []
    },
  },
  selectTypeList: {
    type: Array,
    default() {
      return []
    },
  },
})
const { t } = useI18n()
const isNegative = (val: String) => {
  return JSON.stringify(val).includes('-')
}

const isDateType = computed(() => {
  return props.dateTypeList.includes(props.objectKey)
})
const isDateFormatType = computed(() => {
  return props.dateFormatTypeList.includes(props.objectKey)
})
const isSelectType = computed(() => {
  return props.selectTypeList.find((item) => item.key == props.objectKey)
})
const isIntegraType = computed(() => {
  return props.integralTypeList.includes(props.objectKey)
})
const isPriceType = computed(() => {
  return props.priceTypeList.includes(props.objectKey)
})
const isColorPointType = computed(() => {
  return props.colorPointTypeList.includes(props.objectKey)
})
const isColorRatioType = computed(() => {
  return props.colorRatioTypeList.includes(props.objectKey)
})
const isRatioTypeList2 = computed(() => {
  return props.ratioTypeList2.includes(props.objectKey)
})

const isRatioTypeList = computed(() => {
  return props.ratioTypeList.includes(props.objectKey)
})
const isPointTypeList = computed(() => {
  return props.pointTypeList.includes(props.objectKey)
})
const isLangTypeList = computed(() => {
  let list = props.objectKey.split('.')
  return props.langTypeList.includes(list[0])
})
const isCounterTypeList = computed(() => {
  return props.counterTypeList.includes(props.objectKey)
})
const contentValue = computed(() => {
  const value = props.object[props.objectKey]
  if (props.objectKey === 'recordType') {
    return t(`recordType.${value}`)
  }
  if (isDateType.value) {
    return timeDate(value)
  }
  if (isDateFormatType.value) {
    return formatDate(value)
  }
  if (isPriceType.value) {
    return formatThousandsSeparator(value)
  }
  if (isCounterTypeList.value) {
    return formatThousandsSeparator(value, false)
  }
  if (isSelectType.value) {
  }

  if (isPointTypeList.value) {
    return getPoint(value)
  }
  if (isLangTypeList.value) {
    let list = props.objectKey.split('.')
    let value = props.object[list[0]]
    if (value) {
      let result: any = value[appInfoStore().default_lang]
      if (list.length > 1) {
        for (let i = 1; i < list.length; i++) {
          result = result[list[i]]
        }
      }
      return result
    } else {
      return ''
    }
  }
  if (isRatioTypeList.value) {
    return getRatio(value)
  }
  if (isRatioTypeList2.value) {
    return getRatio(value, 2)
  }
  if (isIntegraType.value) {
    return value / 100
  }

  if (value === 0) {
    return value
  }
  return value || '-'
})
const isObjectKeyNotExisit = computed(() => {
  return !(props.objectKey in props.object)
})
const isTestEnvironment = computed(() => {
  return !['staging', 'production'].includes(process.env.NODE_ENV)
})
</script>

<style scoped lang="scss"></style>

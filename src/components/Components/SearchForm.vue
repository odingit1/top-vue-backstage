<template>
    <AForm ref="formRef" :model="formModel" :layout="layout" label-align="left" auto-label-width hide-asterisk
        class="relative">
        <ACollapse v-if="hadCollapse" :bordered="false" expand-icon-position="right">
            <ACollapseItem key="searchForm">
                <template #header>
                    <div class="flex flex-wrap items-center pr-8">
                        <IconFilter />
                        <ATypographyText v-if="searchList.length === 0" disabled class="mx-2">NO Filters</ATypographyText>
                        <span v-for="searchKey in searchList" v-else :key="searchKey" class="m-1">
                            <ATag v-if="formModel[searchKey]" class="max-w-xs">
                                {{ $t(`label.${searchKey}`) }}:
                                {{
                                    [
                                        'betTime',
                                        'refundTime',
                                        'payoutAt',
                                        'transactedAt',
                                        'date',
                                    ].includes(searchKey)
                                    ? dateDisplay(searchKey)
                                    : formModel[searchKey]
                                }}
                            </ATag>
                        </span>
                    </div>
                </template>
                <AGrid :cols="cols" :col-gap="8" :row-gap="12" class="mb-4">
                    <AGridItem v-for="item in formItems" :key="item.key" :span="item.span ? item.span : 1">
                        <AFormItem hide-label :field="item.key" :extra="item.extra" class="mb-0"
                            :disabled="checkParentKeyValid(item)" :rules="[
                                {
                                    required: item.isRequired,
                                    message: $t('input.errorMsg.empty'),
                                },
                                {
                                    validator: async (event, callback) =>
                                        callback(await checkRequired(event, item)),
                                },
                                {
                                    validator: (event, callback) =>
                                        callback(checkDateRange(event, item.date)),
                                },
                                {
                                    validator: (event, callback) =>
                                        callback(checkStringListMax(event, item.stringListMax)),
                                },
                            ]">
                            <SelectOption v-if="item.select" v-model="formModel[item.key]"
                                :placeholder="setPlaceholder(item)" :model="item.select.model" :column="item.select.column"
                                :label-head="item.select.labelHead" :label-use-value="item.select.labelUseValue" />

                            <ADatePicker v-else-if="item.isDate" v-model="formModel[item.key]"
                                :show-time="item.date?.showTime || false" :format="item.date?.format || 'YYYY-MM-DD'"
                                :disabled-date="disabledDate" class="w-full" :placeholder="setPlaceholder(item)" />
                            <ARangePicker v-else-if="item.isDateRange && item.date?.showTime" v-model="formModel[item.key]"
                                :show-time="true" :format="item.date?.format || 'YYYY-MM-DD'" class="w-full" :disabled-date="(current) => disabledDateRange(current, item.date?.maxRange)
                                    " :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }"
                                @select="changeDateRange" @ok="okRangeHandler" :placeholder="item.placeholder" />
                            <ARangePicker v-else-if="item.isDateRange && !item.date?.showTime" v-model="formModel[item.key]"
                                :show-time="false" :format="item.date?.format || 'YYYY-MM-DD'" class="w-full"
                                :allow-clear="!item.hideClear" :disabled-date="(current) => disabledDateRange(current, item.date?.maxRange)
                                    " :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }"
                                @select="changeDateRange" @change="okRangeHandler" :placeholder="item.placeholder" />

                            <SelectBoolean v-else-if="item.isBooleanSelect" v-model="formModel[item.key]"
                                :placeholder="setPlaceholder(item)" :option-text="item.optionText"
                                :required="item.isRequired" />
                            <Selects v-else-if="item.isSelects" :disabled="item.disabled" :generals="generalIds"
                                :selection-arr="item.SelectionArr" v-model="formModel[item.key]" :multiple="item.multiple"
                                :type="item.key" :parent-key="item.parentKey" :label="item.label"
                                :optionName="item.optionName" :optionValue="item.optionValue" :group="item.group"
                                :parent-value="formModel[item.parentKey]" @on-change-parent="clearValue(item.key)"
                                @update:value="(event) => updateValue(item.key, event, item)" />
                            <AInputNumber v-else-if="item.isNumber" v-model="formModel[item.key]"
                                :placeholder="setPlaceholder(item)" allow-clear hide-button />
                            <AInput v-else v-model="formModel[item.key]" :placeholder="setPlaceholder(item)" allow-clear />
                        </AFormItem>
                    </AGridItem>
                </AGrid>
            </ACollapseItem>
        </ACollapse>

        <AGrid v-else :cols="cols" :col-gap="8" :row-gap="12" class="mb-4">
            <AGridItem v-for="item in formItems" :key="item.key" :span="item.span ? item.span : 1">
                <AFormItem hide-label :field="item.key" :extra="item.extra" class="mb-0"
                    :disabled="checkParentKeyValid(item)" :rules="[
                        {
                            required: item.isRequired,
                            message: $t('input.errorMsg.empty'),
                        },
                        {
                            validator: async (event, callback) =>
                                callback(await checkRequired(event, item)),
                        },
                        {
                            validator: (event, callback) =>
                                callback(checkDateRange(event, item.date)),
                        },
                        {
                            validator: (event, callback) =>
                                callback(checkStringListMax(event, item.stringListMax)),
                        },
                    ]">
                    <SelectOption v-if="item.select" v-model="formModel[item.key]" :placeholder="setPlaceholder(item)"
                        :model="item.select.model" :column="item.select.column" :label-head="item.select.labelHead"
                        :label-use-value="item.select.labelUseValue" />


                    <ADatePicker v-else-if="item.isDate" v-model="formModel[item.key]" :allow-clear="!item.hideClear"
                        :show-time="item.date?.showTime || false" :format="item.date?.format || 'YYYY-MM-DD'"
                        :disabled-date="disabledDate" class="w-full" :placeholder="setPlaceholder(item)" />
                    <ARangePicker v-else-if="item.isDateRange && item.date?.showTime" v-model="formModel[item.key]"
                        :show-time="true" :format="item.date?.format || 'YYYY-MM-DD'" class="w-full"
                        :allow-clear="!item.hideClear" :disabled-date="(current) => disabledDateRange(current, item.date?.maxRange)
                            " :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" @select="changeDateRange"
                        @ok="okRangeHandler" :placeholder="item.placeholder" />
                    <ARangePicker v-else-if="item.isDateRange && !item.date?.showTime" v-model="formModel[item.key]"
                        :show-time="false" :format="item.date?.format || 'YYYY-MM-DD'" class="w-full"
                        :allow-clear="!item.hideClear" :disabled-date="(current) => disabledDateRange(current, item.date?.maxRange)
                            " :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" @select="changeDateRange"
                        @change="okRangeHandler" :placeholder="item.placeholder" />

                    <SelectBoolean v-else-if="item.isBooleanSelect" v-model="formModel[item.key]"
                        :placeholder="setPlaceholder(item)" :option-text="item.optionText" :required="item.isRequired" />

                    <Selects v-else-if="item.isSelects" :generals="generalIds" :disabled="item.disabled"
                        :selection-arr="item.SelectionArr" v-model="formModel[item.key]" :multiple="item.multiple"
                        :type="item.key" :parent-key="item.parentKey" :parent-value="formModel[item.parentKey]"
                        :optionName="item.optionName" :optionValue="item.optionValue" :group="item.group"
                        :label="item.label" @on-change-parent="clearValue(item.key)"
                        @update:value="(event) => updateValue(item.key, event, item)" />

                    <AInputNumber v-else-if="item.isNumber" v-model="formModel[item.key]"
                        :placeholder="setPlaceholder(item)" allow-clear hide-button />
                    <AInput v-else v-model="formModel[item.key]" :placeholder="setPlaceholder(item)" allow-clear />
                </AFormItem>
            </AGridItem>
            <slot name="systemGiftCheck" :formData="formModel"></slot>
            <template v-if="showButton">
                <ASpace>
                    <AButton type="primary" size="small" :disabled="searchDisabled" :loading="isLoading" @click="search">
                        <template #icon>
                            <IconSearch />
                        </template>
                        {{ $t('button.search') }}
                    </AButton>
                    <slot name="button"></slot>
                </ASpace>
            </template>
        </AGrid>
        <ATypographyText v-if="errorMessage" type="danger">
            {{
                $t(errorMessage)
            }}
        </ATypographyText>

    </AForm>
</template>
  
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'
import { formatDate } from '@/utils/tool'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store'
import SelectOption from '@/components/Selects/SelectOption.vue'
import Selects from '../Selects/Selects.vue'
import SelectBoolean from '../Selects/SelectBoolean.vue'

const parentMessage = ref('Hello from parent!')

const emit = defineEmits(['search', 'update:value'])
const props = defineProps({
    formItems: {
        type: Array,
        default() {
            return []
        },
    },

    cols: {
        type: Object,
        default() {
            return { xs: 3, sm: 3, md: 3, lg: 6, xl: 8, xxl: 10 }
        },
    },
    layout: {
        type: String,
        default: 'horizontal',
    },
    apiName: {
        type: String,
        default: null,
    },
    hadCollapse: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
        default: null,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    searchDisabled: {
        type: Boolean,
        default: false,
    },

    showButton: {
        type: Boolean,
        default: true,
    },
    defaultSearch: {
        type: Boolean,
        default: true,
    },
})

const { t } = useI18n()
const appStore = useAppStore()
const formRef = ref<FormInstance>()
const formModel = reactive({})
const formDate = ref([])
const LimitedMinDate = '2022-07-01 00:00:00'
const isVerificationFailed = ref(false)
const searchList = computed(() => {
    return Object.keys(formModel).filter((key) => formModel[key])
})
const generalIds = computed(() => {
    if (formModel.hasOwnProperty('generalId')) {
        return formModel['generalId']
    }
    return null
})
const setPlaceholder = (item: any) => {
    let placeholder = item.placeholder
    if (!item.placeholder) {
        placeholder = item.label ? `${item.label}.placeholder` : `label.${item.key}.placeholder`
    }
    let value = ''
    if (Array.isArray(placeholder)) {
        placeholder.forEach((text) => {
            value += t(text)
        })
    } else {
        value = t(placeholder)
    }
    return value
}
const setLabel = (label = '') => {
    let value = ''
    if (Array.isArray(label)) {
        label.forEach((text) => {
            if (text === '/') {
                return (value += text)
            }
            value += t(text)
        })
    } else {
        value = t(label)
    }
    return value
}
const setDefaultSearchObject = async () => {
    for (const item of props.formItems) {
        if (item.key === 'affiliateId' && item.multiple && !item.default) {
            const affiliateIdList = await getAffiliateDefaultList()
            formModel[item.key] = affiliateIdList
        } else if (item.key === 'generalId' && item.multiple && !item.default) {
            // const res = await GeneralSimpleList() || {}
            // const general_list = res._param.general_list || []
            // formModel[item.key] = general_list.map(obj => { return obj.general })
        } else if (checkValueExist(item.default)) {
            formModel[item.key] = await (item.default >= 0 ? Number(item.default) : item.default)
        }
    }
}

const getAffiliateDefaultList = async () => {
    // const response = await queryAffiliates()
    // const testAgentList = await getTestAgentList()
    // let array = []
    // await response.data.affiliates.forEach((x) => {
    //     if (!testAgentList.includes(x.affiliateId)) {
    //         array.push(x.affiliateId)
    //     }
    // })
    return []
}
const checkStringListMax = (value, max = 0) => {
    if (!max || !value) return false
    return value.toString().split(',').length > max ? t('input.errorMsg.overMaxRange') : false
}
const checkRequired = async (value, item) => {
    if (item.key === 'recordType') {
        return false
    } else if (!item.requiredGroup) return false
    else if (item.requiredGroup.includes(item.key)) {
        let labelText = ''
        let result = 0
        item.requiredGroup.forEach((key) => {
            labelText += t(`label.${key}`) + ', '
            if (formModel[key]) {
                result++
            }
        })
        if (result > 0) return false
        return t('input.errorMsg.atLeastOne', { name: labelText })
    }
}

const disabledDate = (current) => {
    const currentDate = dayjs(current)
    const beforeSomeDate = currentDate.isBefore(dayjs(LimitedMinDate))
    return beforeSomeDate
}

const checkDateRange = (date, rule) => {
    if (date && dayjs(date[0], 'YYYY-MM-DD').isValid() && dayjs(date[0]).isBefore(dayjs(LimitedMinDate))) {
        return t('input.errorMsg.overLimitedMinDate')
    }
    if (!date || !rule) return
    const dateStart = dayjs(date[0]).startOf('date')
    const dateEnd = dayjs(date[1]).endOf('date')
    const max = rule.maxRange - 1 || 34
    if (dateEnd.diff(dateStart, 'day') > max) {
        return t('input.errorMsg.overMaxDateRange', { day: max + 1 })
    }
    return false
}
const disabledDateRange = (current, max = 35) => {
    const dates = formDate.value
    if (!dates) return
    if (dates.length > 1) {
        if (Boolean(dates[0]) && Boolean(dates[1])) {
            return
        }
    }
    const currentDate = dayjs(current)
    const beforeSomeDate = currentDate.isBefore(dayjs(LimitedMinDate))
    const tooLate = dates[0] && Math.abs(currentDate.diff(dayjs(dates[0]).startOf('date'), 'day')) > max - 1
    const tooEarly = dates[1] && Math.abs(currentDate.diff(dayjs(dates[1]).endOf('date'), 'day')) > max - 2
    return beforeSomeDate || tooEarly || tooLate
}
const changeDateRange = (valueString, value) => {
    formDate.value = value
}
const okRangeHandler = (value, date, dateString) => {
    if (value && dayjs(value[0]).isBefore(dayjs(LimitedMinDate))) {
        formDate.value[0] = new Date(dayjs(LimitedMinDate))
        if (formModel.date) {
            setTimeout(() => {
                formModel.date[0] = dayjs(LimitedMinDate).format('YYYY-MM-DD')
            }, 0)
        } else if (formModel.createdAt) {
            formModel.createdAt[0] = LimitedMinDate
        } else if (formModel.statisticsDates) {
            setTimeout(() => {
                formModel.statisticsDates[0] = dayjs(LimitedMinDate).format('YYYY-MM-DD')
            }, 0)
        }
    }
}
const dateDisplay = (key: string) => {
    let text = ''
    Object.values(formModel[key]).forEach((date, index) => {
        if (index > 0) {
            text = text + ' - '
        }
        text = text + formatDate(date, 'YYYY-MM-DD')
    })
    return text
}

const checkParentKeyValid = (item) => {
    return item.parentKey ? !formModel[item.parentKey] : false
}

const reset = async () => {
    await formRef.value?.resetFields()
}
const clearValue = (key) => {
    formModel[key] = null
}
const updateValue = (key: string, value: Array<number | string> | string | number, item: any) => {
    formModel[key] = value
    emit('update:value', value, key)
    if (item.search) {
        search()
    }
}

const checkValue = async () => {
    const validate = await formRef.value?.validate()
    if (validate) {
        isVerificationFailed.value = true
        return
    }
    isVerificationFailed.value = false
}
const checkValueExist = (value) => {
    return Boolean(value || value === 0)
}

const search = async () => {
    await checkValue()
    if (isVerificationFailed.value) {
        return
    }
    await emit('search', formModel)
}

onMounted(async () => {
    await setDefaultSearchObject()
    const searchFormHeight = formRef.value?.$el.clientHeight
    appStore.setSearchFormHeight(searchFormHeight)

    if (props.defaultSearch) {
        search()
    }
})
</script>
  
<style scoped>
.arco-switch {
    background-color: var(--color-fill-4);
}

.arco-switch-checked {
    background-color: rgb(var(--primary-6));
}

:deep(.arco-form-item-layout-vertical > .arco-form-item-label-col) {
    margin-bottom: 2px;
}

:deep(.arco-collapse-item-content) {
    background-color: transparent;
    padding: 4px 0;
}

:deep(.arco-collapse-item-header-right) {
    padding: 8px 4px;
}
</style>
  
<template>
    <AButton v-if="apiName" v-permission="checkPermission" type="primary" :size="size" :disabled="disabled"
        @click="onClick">
        {{ $t('button.export') }}
        <template #icon>
            <ATooltip :content="$t('button.export.limited')">
                <iconInfoCircle size="16" />
            </ATooltip>
        </template>
        <AModal :visible="isOpenPop" :modal-style="{ 'max-width': '90%' }" simple hide-cancel @ok="closePop">
            <template #title>
                <div class="flex items-center">
                    <IconCheckCircleFill v-if="email" class="text-green-500 text-xl mr-2" />
                    <IconCloseCircleFill v-else class="text-red-500 text-xl mr-2" />
                    <span>{{
                        email ? $t('sendEmail.content.success') : $t('export.missEmail')
                    }}</span>
                </div>
            </template>
            <p v-if="email" class="text-center">
                {{ $t('export.alreadySendEmail') }} : {{ email }}
            </p>
            <p v-else class="text-center">{{ $t('export.missEmail.content') }}</p>
        </AModal>
    </AButton>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { requestHandler } from '@/utils/tool'
import { useMeStore } from '@/store'
// import {
//   queryBetReports,
//   queryGameRecords,
//   queryBetHistories,
//   queryDailyProviderReport,
// } from '@/api/bet'
// import { queryOrders } from '@/api/order'
// import {
//   queryOperationReports,
//   queryChannelReports,
//   queryRevenueReports,
//   queryAffiliateReports,
//   queryRetentionIndicatorStatisticReports,
//   queryBonusStatisticsReports,
// } from '@/api/report'
// import {
//   queryUsers,
//   queryUserReports,
//   queryIPDeviceRelation,
//   queryIPDeviceList,
//   queryRetentionStatisticsReports,
//   queryRetentionDailyReports,
// } from '@/api/user'
// import { queryTransactions } from '@/api/record'

const props = defineProps({
    searchData: {
        type: Object,
        default() {
            return null
        },
    },
    request: {
        type: Function,
        default() {
            return false
        },
    },
    apiName: {
        type: String,
        default: null,
    },
    isReadyToExport: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'small',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const i18 = useI18n()
const meStore = useMeStore()
const isOpenPop = ref(false)
const isLoading = ref(false)
const email = computed(() => {
    return meStore.email
})
const currentLocale = computed(() => {
    return i18.locale.value
})
const permissions = reactive({
    '/v1/users': ['ExportCsv.user'],
    '/v1/retention_statistics_reports': ['ExportCsv.retention_statistics_report'],
    '/v1/retention_daily_reports': ['ExportCsv.retention_daily_report'],
    '/v1/user_dailies': ['ExportCsv.user_daily'],
    '/v1/ip_device_statistics': ['ExportCsv.ip_device_statistic'],
    '/v1/action_logs': ['ExportCsv.action_log'],
    '/v1/channel_dailies': ['ExportCsv.channel_daily'],
    '/v1/revenue_reports': ['ExportCsv.revenue_report'],
    '/v1/retention_indicator_statistic_reports': [
        'ExportCsv.retention_indicator_statistic_report',
    ],
    '/v1/affiliate_reports': ['ExportCsv.affiliate_report'],
    '/v1/channel_reports': ['ExportCsv.channel_report'],
    '/v1/bonus_statistic_reports': ['ExportCsv.bonus_statistic_report'],
    '/v1/bet_histories': ['ExportCsv.bet_history'],
    '/v1/bet_reports': ['ExportCsv.bet_report'],
    '/v1/game_provider_reports': ['ExportCsv.game_provider_report'],
    '/v1/game_reports': ['ExportCsv.game_report'],
    '/v1/orders': ['ExportCsv.order'],
    '/v1/transactions': ['ExportCsv.transaction'],
})
const checkPermission = computed(() => {
    return permissions[props.apiName] || [null]
})

const setExportReport = (params) => {
    const isExport = {
        apiName: params.apiName,
    }
    // switch (params.apiName) {
    //     case '/v1/users':
    //         return queryUsers({ isExport: isExport, ...params })
    //     case '/v1/retention_statistics_reports':
    //         return queryRetentionStatisticsReports({ isExport: isExport, ...params })
    //     case '/v1/retention_daily_reports':
    //         return queryRetentionDailyReports({ isExport: isExport, ...params })
    //     case '/v1/user_dailies':
    //         return queryUserReports({ isExport: isExport, ...params })
    //     case '/v1/action_logs':
    //         return queryIPDeviceList({ isExport: isExport, ...params })
    //     case '/v1/ip_device_statistics':
    //         return queryIPDeviceRelation({ isExport: isExport, ...params })
    //     case '/v1/channel_dailies':
    //         return queryOperationReports({ isExport: isExport, ...params })
    //     case '/v1/affiliate_reports':
    //         return queryAffiliateReports({ isExport: isExport, ...params })
    //     case '/v1/revenue_reports':
    //         return queryRevenueReports({ isExport: isExport, ...params })
    //     case '/v1/retention_indicator_statistic_reports':
    //         return queryRetentionIndicatorStatisticReports({
    //             isExport: isExport,
    //             ...params,
    //         })
    //     case '/v1/channel_reports':
    //         return queryChannelReports({ isExport: isExport, ...params })
    //     case '/v1/bet_histories':
    //         return queryBetHistories({ isExport: isExport, ...params })
    //     case '/v1/bet_reports':
    //         return queryBetReports({ isExport: isExport, ...params })
    //     case '/v1/game_provider_reports':
    //         return queryDailyProviderReport({ isExport: isExport, ...params })
    //     case '/v1/game_reports':
    //         return queryGameRecords({ isExport: isExport, ...params })
    //     case '/v1/orders':
    //         return queryOrders({ isExport: isExport, ...params })
    //     case '/v1/bonus_statistic_reports':
    //         return queryBonusStatisticsReports({ isExport: isExport, ...params })
    //     case '/v1/transactions':
    //         return queryTransactions({ isExport: isExport, ...params })
    //     default:
    //         return
    // }
}
const onClick = async () => {
    await props.request()
    if (props.isReadyToExport) {
        return
    }
    if (!email.value) {
        isOpenPop.value = true
        return
    }
    await exportCSV()
    isOpenPop.value = true
}

const exportCSV = requestHandler(async () => {
    await setExportReport({
        lang: currentLocale.value,
        apiName: props.apiName,
        ...props.searchData,
    })
}, isLoading)
const closePop = () => {
    isOpenPop.value = false
}
</script>

<style scoped lang="scss"></style>

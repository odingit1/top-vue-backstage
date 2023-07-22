@@ -0,0 +1,58 @@
<template>
    <ATypography class="mr-4 tivezonecol" v-if="!isMobile">
        <ATypographyParagraph>
            {{ timezoneTip }}
        </ATypographyParagraph>
        <ATypographyParagraph>
            {{ nowTime }}
        </ATypographyParagraph>
    </ATypography>
    <ADropdown trigger="click" position="bottom" @select="changeTimeZone">
        <AButton ref="triggerBtn" class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
                <icon-clock-circle />
            </template>
        </AButton>
        <template #content>
            <ADoption v-for="item in timeZoneObject" :key="item.value" :value="item.value">
                {{ item.label }}
            </ADoption>
        </template>

    </ADropdown>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, toRefs, onMounted } from 'vue'
import { timeZoneObject } from '@/timezone'
import { setTimeZone, getTimeZone } from '@/utils/auth'
import { useAppStore } from '@/store'
import dayjs from 'dayjs'
const appStore = useAppStore()
const timerData = ref()
const isMobile = computed(() => appStore.device === 'mobile')
const triggerBtn = ref()
const changeTimeZone = (value: string) => {
    setTimeZone(value)
    window.location.reload()
}
const timezoneTip = computed(() => {
    // const obj = timeZoneObject.find(el => el.value == getTimeZone())
    // return obj?.label || "(UTC-03:00) 巴西利亚"
})
const state = reactive({
    nowTime: dayjs.tz(new Date()).format('YYYY-MM-DD HH:mm:ss')
})
const getnowTime = (nowTime: any) => {
    setInterval(() => {
        let date = dayjs.tz(new Date()).format('YYYY-MM-DD HH:mm:ss')
        nowTime.value = date.toLocaleString();
    }, 1000)
}
onMounted(() => {
    // getnowTime(nowTime)
})
const { nowTime } = toRefs(state)
</script>

<style scoped lang="less">
.nav-btn {
    color: rgb(var(--gray-8));
    border-color: inherit;
    font-size: 16px;
}

body[arco-theme='dark'] {
    .tivezonecol {
        color: #ffffff
    }
}

div.arco-typography,
p.arco-typography {
    margin-bottom: 0
}
</style>

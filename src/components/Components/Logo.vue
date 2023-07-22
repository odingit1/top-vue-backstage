<template>
    <img alt="logo" :src="logo" :width="logoWidth" class="logo object-cover" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getAppid } from '@/utils/auth'
// import afunLogo from '@/assets/logo/afun.png'
// import gmcLogo from '@/assets/logo/gmc.png'
// import megabossLogo from '@/assets/logo/megaboss.png'

const logo = computed(() => {
    const location = "https://web-res-ccc.afunimg8.com/admin_img/"
    if (import.meta.env.MODE == "production") {
        // return `${location}${getAppid()}.png`
        return `${location}afun.png`
    } else {
        return `${location}afun.png`
    }

})

const logoWidth = computed(() => {
    switch (import.meta.env.VITE_APP_ID) {
        case 'gmc':
            return 100
        default:
            return undefined
    }
})
</script>

<style scoped>
.logo {
    border-radius: 5px;
}
</style>

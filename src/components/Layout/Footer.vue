<template>
    <ALayoutFooter class="footer">© {{ appInfoStore().appname }} 2023. All rights reserved.</ALayoutFooter>
</template>

<script lang="ts" setup>
import { appInfoStore } from '@/store'
</script>

<style lang="less" scoped>
.footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
}
</style>

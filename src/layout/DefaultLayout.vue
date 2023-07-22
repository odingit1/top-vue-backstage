<template>
    <ALayout class="layout">
        <ATooltip v-if="isHeader" content="打开导航栏">
            <AButton @click="showHiader" class="nav-btn down-icon" type="outline" :shape="'circle'">
                <template #icon>
                    <icon-down-circle :size="18" />
                </template>
            </AButton>
        </ATooltip>
        <div v-if="navbar" :style="{ top: isHeader ? '-60px' : '0' }" class="transition layout-navbar">
            <NavBar />
        </div>
        <ALayout>
            <ALayoutSider v-if="renderMenu" class="layout-sider" breakpoint="xl" :collapsed="collapsed" :collapsible="true"
                :width="menuWidth" :collapsed-width="menuWidth" :style="{ paddingTop: navbar && !isHeader ? '60px' : '' }"
                :hide-trigger="true" @collapse="setCollapsed">
                <div class="menu-wrapper">
                    <div v-if='isHeader' class="mt-5 pl-4 sm:pl-8">
                        <ASpace>
                            <ATypographyTitle :style="{ margin: 0, fontSize: '18px' }" :heading="5">
                                {{ appInfoStore().appname }}
                            </ATypographyTitle>
                        </ASpace>
                    </div>
                    <Menu />
                </div>
            </ALayoutSider>
            <ALayout class="layout-content" :style="paddingStyle" @click="isMaskShow ? setCollapsed(true) : null">
                <div :class="{ 'blur-sm pointer-events-none': isMaskShow }">
                    <TabBar v-if="appStore.tabBar" />
                    <ALayoutContent class="mt-4 px-4 sm:px-8">
                        <PageLayout />
                    </ALayoutContent>
                    <!-- <Footer v-if="footer" /> -->
                </div>
            </ALayout>
        </ALayout>
    </ALayout>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { useAppStore, appInfoStore } from '@/store'
import NavBar from '@/components/Layout/Navbar.vue'
import Menu from '@/components/Layout/Menu.vue'
// import Footer from '@/components/Layout/Footer.vue'
import TabBar from '@/components/Layout/TabBar.vue'
import useResponsive from '@/hooks/responsive'
import PageLayout from './PageLayout.vue'

const appStore = useAppStore()
useResponsive(true)
const navbarHeight = '60px'
const navbar = computed(() => appStore.navbar)
const renderMenu = computed(() => appStore.menu)
const hideMenu = computed(() => appStore.hideMenu)
const isMobile = computed(() => appStore.device === 'mobile')
const footer = computed(() => appStore.footer)
const isHeader = computed(() => appStore.hideHeader)
const isMaskShow = computed(() => {
    return isMobile.value && !appStore.menuCollapse
})


const menuWidth = computed(() => {
    if (appStore.menuCollapse) {
        return isMobile.value ? 0 : 48
    }
    return appStore.menuWidth
})
const collapsed = computed(() => {
    return appStore.menuCollapse
})
const paddingStyle = computed(() => {
    const paddingLeft = {
        paddingLeft: `${hideMenu.value ? 0 : menuWidth.value}px`,
    }
    const paddingTop = navbar.value && !isHeader.value ? { paddingTop: navbarHeight } : {}
    return { ...paddingLeft, ...paddingTop }
})
const setCollapsed = (val: boolean) => {
    appStore.updateSettings({ menuCollapse: val })
}
const showHiader = () => {
    appStore.hideHeader = false
}
provide('toggleDrawerMenu', () => {
    setCollapsed(!appStore.menuCollapse)
})
</script>

<style scoped lang="less">
@nav-size-height: 60px;
@layout-max-width: 1100px;

.layout {
    width: 100%;
    height: 100%;
}

.layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
    box-shadow: 0 5px 4px rgba(0, 21, 41, 0.08);
}

.layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &::after {
        position: absolute;
        top: 0;
        right: -1px;
        display: block;
        width: 1px;
        height: 100%;
        background-color: var(--color-border);
        content: '';
    }

    > :deep(.arco-layout-sider-children) {
        overflow-y: hidden;
    }
}

.menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;

    :deep(.arco-menu) {
        ::-webkit-scrollbar {
            width: 12px;
            height: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--color-text-4);
            background-clip: padding-box;
            border: 4px solid transparent;
            border-radius: 7px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--color-text-3);
        }
    }
}

.layout-content {
    min-height: 100vh;
    min-width: 320px;
    overflow-x: auto;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}

.down-icon {
    position: fixed;
    right: 28px;
    top: 5px;
    z-index: 1000;
    border: 1px solid #ccc;
}
</style>

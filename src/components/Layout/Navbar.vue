<template>
    <div class="navbar">

        <div class="left-side pl-4 sm:pl-8">
            <ASpace>
                <!-- <Logo v-if="!isMobile" class="max-h-12" /> -->
                <ATypographyTitle :style="{ margin: 0, fontSize: '18px' }" style="transition: none" :heading="5">
                    TOP-ADMIN
                </ATypographyTitle>
            </ASpace>
            <IconMenuUnfold v-if="isMobile" :size="24" class="nav-btn ml-2" @click="toggleMenu" />
        </div>
        <ul class="right-side pr-4 sm:pr-8">

            <!-- <li>
                <ATooltip content="时区" :position="isMobile ? 'lt' : 'bottom'">
                    <SelectTIveZone />
                </ATooltip>
            </li> -->
            <!-- <li>
                <ATooltip content="平台" :position="isMobile ? 'lt' : 'bottom'">
                    <SelectAppid />
                </ATooltip>
            </li> -->

            <!-- <li>
                <ATooltip :content="$t('settings.language')" :position="isMobile ? 'lt' : 'bottom'">
                    <SelectLangue />
                </ATooltip>
            </li> -->
            <li v-if="!isMobile">
                <ATooltip content="收起导航栏" :position="isMobile ? 'lt' : 'bottom'">
                    <AButton @click="headerset" ref="triggerBtn" class="nav-btn" type="outline" :shape="'circle'">
                        <template #icon>
                            <icon-up-circle :size="18" />
                        </template>
                    </AButton>
                </ATooltip>
            </li>
            <li>
                <ATooltip :content="theme === 'light'
                    ? $t('settings.navbar.theme.toDark')
                    : $t('settings.navbar.theme.toLight')
                    ">
                    <AButton class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
                        <template #icon>
                            <IconMoonFill v-if="theme === 'dark'" />
                            <IconSunFill v-else />
                        </template>
                    </AButton>
                </ATooltip>
            </li>
            <li v-show="!isMobile">
                <ATooltip :content="isFullscreen
                    ? $t('settings.navbar.screen.toExit')
                    : $t('settings.navbar.screen.toFull')
                    ">
                    <AButton class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
                        <template #icon>
                            <IconFullscreenExit v-if="isFullscreen" />
                            <IconFullscreen v-else />
                        </template>
                    </AButton>
                </ATooltip>
            </li>
            <li>
                <ADropdown trigger="click">
                    <AAvatar :size="32" :style="{ cursor: 'pointer' }">
                        <img :src="avatar" />
                    </AAvatar>
                    <template #content>
                        <ADoption>
                            <ASpace @click="$router.push({ name: 'MeInfo' })">
                                <IconSettings />
                                <span>
                                    {{ $t('me.account') }}
                                </span>
                            </ASpace>
                        </ADoption>
                        <ADoption>
                            <ASpace fill @click="handleLogout">
                                <IconExport />
                                <span>
                                    {{ $t('messageBox.logout') }}
                                </span>
                            </ASpace>
                        </ADoption>
                    </template>
                </ADropdown>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, watch } from 'vue'
import { useDark, useToggle, useFullscreen } from '@vueuse/core'
import { useAppStore, appInfoStore } from '@/store'
import useUser from '@/hooks/user'
import avatar from '@/assets/avatar.png'
import SelectTIveZone from '../Components/SelectTIveZone.vue'
const appStore = useAppStore()
const { logout } = useUser()
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen()
const theme = computed(() => {
    return appStore.theme
})

const isMobile = computed(() => appStore.device === 'mobile')
const headerset = () => {
    appStore.hideHeader = true
}
const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
        appStore.toggleTheme(dark)
    },
})
const toggleTheme = useToggle(isDark)
const handleToggleTheme = () => {
    toggleTheme()
}

const handleLogout = () => {
    logout()
}

const toggleMenu = inject('toggleDrawerMenu')


import { useMeStore } from '@/store'
import { useRouter } from 'vue-router'
const route = useRouter()
const routerArr = useMeStore().allConfMenu
watch(() => route.currentRoute.value.name,
    (newPath, oldPath) => {
        useMeStore().allConfMenu.map(item => {
            if (newPath == item.name) {
                useMeStore().mid = item.id
            } else {
                item.children?.map(item1 => {
                    if (newPath == item1.name) {
                        useMeStore().mid = item1.id
                    }
                })
            }
        })
    }
);
</script>

<style scoped lang="less">
.navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .nav-btn {
        color: rgb(var(--gray-8));
        font-size: 16px;
    }
}

.left-side {
    display: flex;
    align-items: center;
}

.right-side {
    display: flex;
    list-style: none;

    :deep(.locale-select) {
        border-radius: 20px;
    }

    li {
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    a {
        color: var(--color-text-1);
        text-decoration: none;
    }

    .nav-btn {
        border-color: rgb(var(--gray-2));
    }

    .trigger-btn,
    .ref-btn {
        position: absolute;
        bottom: 14px;
    }

    .trigger-btn {
        margin-left: 14px;
    }
}
</style>

<style lang="less">
.message-popover {
    .arco-popover-content {
        margin-top: 0;
    }
}
</style>

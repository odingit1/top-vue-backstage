<template>
    <div class="content">
        <p> 5454</p>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { FormInstance } from '@arco-design/web-vue/es/form'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const generateFormModel = () => {
    return {
        searchText: undefined,
    }
}
const formModel = reactive(generateFormModel())
const formRef = ref<FormInstance>()
const errorMessage = ref('')
const isLoading = ref(false)
const userStore = useUserStore()

const handleSearch = async () => {
    if (isLoading.value) {
        return
    }
    await userStore.setUserId(formModel.searchText)
    const isValid = await formRef.value?.validate()
    if (isValid) {
        errorMessage.value = ''
        return
    }
    if (formModel.searchText) {
        await getUserInfo()
        if (!userStore.createdAt) {
            errorMessage.value = t('form.error.idNotFount')
        }
        if (route.name !== 'userNote') {
            router.push({
                name: 'userInfo',
            })
        }
    }
}
</script>

<style scoped lang="less">
.content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
}

:deep(.arco-input-wrapper) {
    padding: 4px 12px;
    border-radius: 4px;
    background: #fff;
}
</style>

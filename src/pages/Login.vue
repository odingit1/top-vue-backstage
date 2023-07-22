<template>
    <div class="flex items-center h-screen">
        <LoginBanner class="hidden sm:block h-full w-5/12" />
        <div class="flex flex-col flex-1 h-full">
            <!-- <div class="absolute top-6 right-10">
                <SelectLangue />
            </div> -->
            <div class="flex flex-col items-center justify-center flex-1 w-10/12 max-w-md mx-auto">
                <div class="mb-2 w-full">
                    <p class="font-bold text-3xl mb-2">{{ $t('login.form.title') }}</p>
                    <div class="text-red-500 text-left w-full">{{ errorMessage }}</div>
                </div>
                <AForm ref="loginForm" :model="loginConfig" layout="vertical">
                    <AFormItem field="username" :rules="[
                        { required: true, message: $t('login.form.username.errMsg') },
                    ]" :validate-trigger="['change', 'blur']" hide-label>
                        <AInput v-model="loginConfig.username" :placeholder="$t('login.form.account.placeholder')">
                            <template #prefix>
                                <IconUser />
                            </template>
                        </AInput>
                    </AFormItem>
                    <AFormItem field="password" :rules="[
                        { required: true, message: $t('login.form.password.errMsg') },
                    ]" :validate-trigger="['change', 'blur']" hide-label>
                        <AInputPassword v-model="loginConfig.password" :placeholder="$t('login.form.password.placeholder')"
                            allow-clear>
                            <template #prefix>
                                <IconLock />
                            </template>
                        </AInputPassword>
                    </AFormItem>
                    {{ provisioningUri }}
                    <TeachingOf2FA v-if="show2FATeaching" :provisioning-uri="provisioningUri" />
                    <AFormItem field="otpCode" :label="$t('login.googleAuthenticator.label')"
                        :extra="show2FATeaching ? '' : $t('2FA.extra')">
                        <AInput v-model="loginConfig.code" :placeholder="$t('login.googleAuthenticator.placeholder')" />
                    </AFormItem>
                    <ASpace :size="16" direction="vertical">
                        <AButton type="primary" html-type="submit" long :loading="isLoading" @click="login">{{
                            $t('login.form.login') }}</AButton>
                    </ASpace>
                </AForm>
            </div>
            <Footer />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMeStore } from '@/store'
import { LoginData } from '@/api/me'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import LoginBanner from '@/components/Login/LoginBanner.vue'
import Footer from '@/components/Layout/Footer.vue'
import TeachingOf2FA from '@/components/Login/TeachingOf2FA.vue'
import SelectLangue from '@/components/Components/SelectLangue.vue'

const router = useRouter()
const { t } = useI18n()
const meStore = useMeStore()
const isLoading = ref(false)
const errorMessage = ref('')
const loginConfig = reactive<LoginData>({
    username: '',
    password: '',
    code: '',
})
const provisioningUri = ref('')
const show2FATeaching = computed(() => {
    return Boolean(provisioningUri.value)
})
const login = async () => {
    if (!loginConfig) return
    isLoading.value = true
    try {
        if (provisioningUri.value) {
            const googleData = await meStore.googleBind(loginConfig)
            provisioningUri.value = googleData.data.code_qr_url
        }
        const data = await meStore.login(loginConfig)

        if (data.data.token) {
            const { redirect, ...othersQuery } = router.currentRoute.value.query
            router.push({
                name: 'MeInfo',
            })
            errorMessage.value = ''
            Message.success(t('login.success'))
        } else {
            errorMessage.value = data.msg
            if (data.code == 1067) {
                const googleData = await meStore.googleBind(loginConfig)
                provisioningUri.value = googleData.data.code_qr_url
            }
        }
    } catch (err) {
        console.error(err)
    }
    isLoading.value = false
}


</script>

import { createI18n } from 'vue-i18n'
import en from './en-US'
import cn from './zh-CN'
import pt from './pt-BR'

export const LOCALE_OPTIONS = [
    { label: 'Português', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
    { label: '中文', value: 'zh-CN' }
]
const defaultLocale = localStorage.getItem('arco-locale') || 'zh-CN'

const i18n = createI18n({
    locale: defaultLocale,
    globalInjection: true,
    fallbackLocale: 'zh-CN',
    allowComposition: true,
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    messages: {
        'en-US': en,
        'zh-CN': cn,
        'pt-BR': pt,
    }
})
export default i18n

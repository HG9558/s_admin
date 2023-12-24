import { lang as _lang, i18n, locale } from '@/config/config'
import { changeElLang } from '@/utils/component'


export const handleChangeLang = (lang, isReload) => {
  localStorage.setItem('lang', lang)
  if (isReload) {
    location.reload()
  } else {
    changeElLang(lang)
    i18n.locale = lang
    console.log('locale ===', lang)
  }
}

handleChangeLang(locale)

export const langArr = [
  { locale: 'zh', name: '中文简体' },
  { locale: 'en_us', name: 'English' },
  // { locale: 'vi', name: 'Việt Nam' }
]

export const lang = _lang

export default i18n

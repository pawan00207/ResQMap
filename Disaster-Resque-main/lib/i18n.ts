import en from '@/i18n/en.json'
import hi from '@/i18n/hi.json'

const translations = { en, hi }

export function useTranslation(lang: string = 'en') {
  const t = (key: string): string => {
    const keys = key.split('.')
    let current: any = translations[lang as keyof typeof translations] || translations.en

    for (const k of keys) {
      current = current?.[k]
    }

    return current || key
  }

  return { t }
}

export function getLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en'
  }
  return 'en'
}

export function setLanguage(lang: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
  }
}

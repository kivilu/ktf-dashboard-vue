import defaultSettings from '@/settings'

const title = defaultSettings.title || 'KTF Vue Dashboard'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

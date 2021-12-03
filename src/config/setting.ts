export interface Preference {
  directory: string
  theme: string
}
interface Setting {
  api: string
  sentry_dsn: string
}

const setting: Setting = {
  api: 'https://api.melt.qazsato.com',
  sentry_dsn: '',
}

export default setting

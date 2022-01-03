export interface Preference {
  directory: string
  theme: string
  initialNote: string
  fontFamily: string
  fontSize: number
}

interface Setting {
  api: string
}

const setting: Setting = {
  api: 'https://api.melt.qazsato.com',
}

export default setting

export interface Preference {
  directory: string
  theme: string
  initialNote: string
  fontFamily: string
  fontSize: number
  wordWrap: boolean
  lineNumber: boolean
}

interface Setting {
  api: string
}

const setting: Setting = {
  api: 'https://api.melt.qazsato.com',
}

export default setting

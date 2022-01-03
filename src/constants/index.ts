export const THEME = {
  LIGHT: 'melt-light',
  DARK: 'melt-dark',
}

export const INITIAL_NOTE = {
  BLANK: 'blank',
  RECENTRY_OPENED: 'recently-opened',
}

export const PAGE = {
  MAIN: 'main',
  PREFERENCE: 'preference',
}

export const VIEW_MODE = {
  EDITOR: 'editor',
  PREVIEW: 'preview',
}

export const LIST_TYPE = {
  ORDERED: 'ordered',
  BULLET: 'bullet',
  TASK: 'task',
}

export const ALLOW_DROP_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif']

export const DEFAULT_PREFERENCE = {
  directory: '',
  theme: THEME.LIGHT,
  initialNote: INITIAL_NOTE.BLANK,
  fontFamily: 'Source Code Pro',
  fontSize: 16,
}

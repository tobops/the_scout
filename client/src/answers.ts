import type { Answer } from './api'
import type { IconName } from './components/Icon'

export const ANSWER_OPTIONS: { value: Answer; label: string; icon: IconName }[] = [
  { value: 'yes', label: 'Yes', icon: 'check' },
  { value: 'no', label: 'No', icon: 'cross' },
  { value: 'dont_know', label: "Don't know", icon: 'question' },
  { value: 'probably', label: 'Probably', icon: 'up' },
  { value: 'probably_not', label: 'Probably not', icon: 'down' },
]
import type { Answer } from '../api'
import { ANSWER_OPTIONS } from '../answers'
import Icon from './Icon'

export default function AnswerBadge({ answer }: { answer: Answer }) {
  const option = ANSWER_OPTIONS.find((item) => item.value === answer)
  if (!option) return null

  return (
    <span className={`badge badge-${answer}`}>
      <Icon name={option.icon} size={14} />
      {option.label}
    </span>
  )
}
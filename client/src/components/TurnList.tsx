import type { Turn } from '../api'
import AnswerBadge from './AnswerBadge'

type Props = { turns: Turn[]; highlight?: number; className?: string }

export default function TurnList({ turns, highlight, className = '' }: Props) {
  return (
    <ol className={`turn-list ${className}`}>
      {turns.map((turn) => (
        <li key={turn.number} className={turn.number === highlight ? 'turn turn-highlight' : 'turn'}>
          <span className="display turn-number">{turn.number}</span>
          <span className="turn-text">{turn.type === 'guess' ? `Is it ${turn.text}?` : turn.text}</span>
          {turn.answer && <AnswerBadge answer={turn.answer} />}
        </li>
      ))}
    </ol>
  )
}
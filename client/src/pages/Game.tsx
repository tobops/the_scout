import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getGame, sendAnswer, MAX_QUESTIONS, type Answer, type Game as GameData } from '../api'
import { ANSWER_OPTIONS } from '../answers'
import Icon from '../components/Icon'
import TurnList from '../components/TurnList'
import './Game.css'

export default function Game() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameData | null>(null)
  const [pending, setPending] = useState<Answer | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getGame(id)
      .then((data) => {
        if (data.status === 'in_progress') setGame(data)
        else navigate(`/game/${id}/result`, { replace: true })
      })
      .catch(() => setError('This game could not be found.'))
  }, [id, navigate])

  async function handleAnswer(answer: Answer) {
    setPending(answer)
    setError('')
    try {
      const updated = await sendAnswer(id, answer)
      if (updated.status === 'in_progress') setGame(updated)
      else navigate(`/game/${id}/result`)
    } catch {
      setError('The Scout lost its train of thought. Please try that answer again.')
    } finally {
      setPending(null)
    }
  }

  if (!game) {
    return (
      <main className="game-message">
        {error ? <p className="error">{error}</p> : <p>Loading game…</p>}
        {error && (
          <Link to="/" className="btn btn-green">
            Back home
          </Link>
        )}
      </main>
    )
  }

  const current = game.turns[game.turns.length - 1]
  const thinking = pending !== null
  const answered = game.turns.filter((turn) => turn.answer)
  const history = thinking ? [...answered, { ...current, answer: pending }] : answered
  const left = MAX_QUESTIONS - current.number

  if (current.type === 'guess' && !thinking) {
    return (
      <main className="game game-guess">
        <Progress label={`Guess after ${current.number - 1} questions`} left={left} value={current.number} />
        <section className="card guess-card">
          <span className="guess-icon">
            <Icon name="person" size={48} />
          </span>
          <p className="guess-intro">I think your player is…</p>
          <h1 className="display guess-name">{current.text}</h1>
          {error && <p className="error">{error}</p>}
          <div className="guess-actions">
            <button type="button" className="btn btn-green btn-large" onClick={() => handleAnswer('yes')}>
              <Icon name="check" size={22} /> Yes, that's my player
            </button>
            <button type="button" className="btn btn-outline btn-large" onClick={() => handleAnswer('no')}>
              <Icon name="arrow" size={22} /> No, keep going
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="game">
      <section className="game-main">
        <Progress label={`Question ${current.number} of ${MAX_QUESTIONS}`} left={left} value={current.number} />
        {thinking ? (
          <div className="thinking-card" role="status">
            <div className="dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h1 className="display thinking-title">The Scout is thinking…</h1>
            <p>Narrowing down the shortlist</p>
          </div>
        ) : (
          <div className="card question-card">
            <span className="eyebrow question-label">
              <Icon name="search" size={18} /> The Scout asks
            </span>
            <h1 className="display question-text">{current.text}</h1>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <div className="answers">
          {ANSWER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`answer-btn answer-${option.value}`}
              disabled={thinking}
              onClick={() => handleAnswer(option.value)}
            >
              <Icon name={option.icon} size={24} />
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <aside className="card history">
        <h2 className="display history-title">Previous questions</h2>
        {history.length > 0 ? (
          <TurnList turns={history} highlight={thinking ? current.number : undefined} />
        ) : (
          <p className="history-empty">Your answers will show up here.</p>
        )}
      </aside>
    </main>
  )
}

function Progress({ label, left, value }: { label: string; left: number; value: number }) {
  return (
    <div className="progress">
      <div className="progress-top">
        <span className="display progress-label">{label}</span>
        <span className="progress-left">{left} left</span>
      </div>
      <div
        className="bar progress-bar"
        role="progressbar"
        aria-label="Question progress"
        aria-valuemin={0}
        aria-valuemax={MAX_QUESTIONS}
        aria-valuenow={value}
      >
        <div className="bar-fill" style={{ width: `${(value / MAX_QUESTIONS) * 100}%` }} />
      </div>
    </div>
  )
}
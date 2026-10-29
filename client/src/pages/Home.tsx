import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { createGame, getStats, type Stats } from '../api'
import Icon from '../components/Icon'
import './Home.css'

const STEPS = [
  { title: 'Pick a player', text: 'Think of any footballer, past or present. Keep it to yourself.' },
  { title: 'Answer the questions', text: "Yes, No, Don't know, Probably or Probably not. Up to 20 questions." },
  { title: 'Get scouted', text: 'The Scout makes its guess. Confirm it, or stump it and win.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
  }, [])

  async function handleStart(event: FormEvent) {
    event.preventDefault()
    setStarting(true)
    setError('')
    try {
      const game = await createGame(nickname.trim())
      navigate(`/game/${game._id}`)
    } catch {
      setError('Could not start a game. Is the server running?')
      setStarting(false)
    }
  }

  const scoutWins = stats?.scoutWins ?? 0
  const playerWins = stats?.playerWins ?? 0
  const total = scoutWins + playerWins
  const winRate = total ? Math.round((scoutWins / total) * 100) : 0

  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow hero-eyebrow">The football guessing game</p>
          <h1 className="display hero-title">
            Think of any footballer.
            <br />
            The Scout will name them in 20 questions.
          </h1>
          <form className="start-form" onSubmit={handleStart}>
            <label htmlFor="nickname" className="label">
              Your nickname
            </label>
            <div className="start-row">
              <input
                id="nickname"
                className="input"
                placeholder="e.g. Tobias"
                maxLength={30}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <button type="submit" className="btn btn-ink" disabled={starting}>
                {starting ? 'Starting…' : 'Start'}
                <Icon name="arrow" />
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </form>
        </div>

        <aside className="record">
          <p className="eyebrow record-title">The Scout's record</p>
          <div className="record-numbers">
            <div>
              <span className="display record-number record-wins">{scoutWins}</span>
              <span className="record-label">
                <Icon name="check" size={16} /> Wins
              </span>
            </div>
            <div>
              <span className="display record-number">{playerWins}</span>
              <span className="record-label">
                <Icon name="cross" size={16} /> Losses
              </span>
            </div>
          </div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${winRate}%` }} />
          </div>
          <p className="record-note">{total ? `${winRate}% of players guessed` : 'No games played yet'}</p>
        </aside>
      </section>

      <section className="steps">
        <h2 className="display steps-title">How to play</h2>
        <div className="steps-grid">
          {STEPS.map((step, index) => (
            <div key={step.title} className="card step">
              <span className="display step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
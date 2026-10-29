import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getGame, getStats, revealPlayer, MAX_QUESTIONS, type Game as GameData, type Stats } from '../api'
import Icon from '../components/Icon'
import TurnList from '../components/TurnList'
import './Result.css'

export default function Result() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameData | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    Promise.all([getGame(id), getStats().catch(() => null)])
      .then(([data, statsData]) => {
        if (data.status === 'in_progress') {
          navigate(`/game/${id}`, { replace: true })
          return
        }
        setGame(data)
        setStats(statsData)
      })
      .catch(() => setError('This game could not be found.'))
  }, [id, navigate])

  async function handleReveal(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      setGame(await revealPlayer(id, playerName.trim()))
    } catch {
      setSaveError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!game) {
    return (
      <main className="result-message">
        {error ? <p className="error">{error}</p> : <p>Loading result…</p>}
        {error && (
          <Link to="/" className="btn btn-green">
            Back home
          </Link>
        )}
      </main>
    )
  }

  const scoutWon = game.status === 'scout_won'
  const count = game.turns.length
  const lastTurn = game.turns[count - 1]

  return (
    <main className="result">
      {scoutWon ? (
        <section className="banner banner-win">
          <span className="banner-icon">
            <Icon name="trophy" size={48} />
          </span>
          <div className="banner-text">
            <h1 className="display banner-title">
              The Scout got it in {count} {count === 1 ? 'question' : 'questions'}
            </h1>
            <p className="banner-subtitle">
              Your player: <strong>{lastTurn.text}</strong>
              {stats && ` · Scout's record now ${stats.scoutWins} – ${stats.playerWins}`}
            </p>
          </div>
          <Link to="/" className="btn btn-white btn-large">
            <Icon name="replay" size={22} /> Play again
          </Link>
        </section>
      ) : (
        <section className="banner banner-stumped">
          <div className="banner-text">
            <h1 className="display banner-title">You stumped the Scout!</h1>
            <p className="banner-subtitle">{MAX_QUESTIONS} questions and no match. Tell the Scout who it was.</p>
          </div>
          {game.revealedPlayer ? (
            <p className="reveal-saved">
              Saved! Your player was <strong>{game.revealedPlayer}</strong>.
            </p>
          ) : (
            <form className="reveal-form" onSubmit={handleReveal}>
              <label htmlFor="player" className="label">
                Who was your player?
              </label>
              <div className="reveal-row">
                <input
                  id="player"
                  className="input"
                  placeholder="Player name"
                  maxLength={60}
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                />
                <button type="submit" className="btn btn-save" disabled={saving || !playerName.trim()}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
              {saveError && <p className="error">{saveError}</p>}
            </form>
          )}
        </section>
      )}

      <section className="card answers-card">
        <div className="answers-header">
          <h2 className="display answers-title">Your answers</h2>
          {!scoutWon && (
            <Link to="/" className="btn btn-green">
              <Icon name="replay" /> Play again
            </Link>
          )}
        </div>
        <TurnList turns={game.turns} className="turn-grid" />
      </section>
    </main>
  )
}
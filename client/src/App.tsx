import { useEffect, useState } from 'react'
import axios from 'axios'

type Health = { ok: boolean; db: boolean }

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    axios
      .get<Health>('/api/health')
      .then((res) => setHealth(res.data))
      .catch(() => setError('Could not reach the server. Is it running?'))
  }, [])

  if (error) return <p>{error}</p>
  if (!health) return <p>Checking server...</p>

  return (
    <p>
      Server: {health.ok ? 'OK' : 'down'} | Database: {health.db ? 'connected' : 'not connected'}
    </p>
  )
}

export default App
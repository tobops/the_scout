import { useParams } from 'react-router'

export default function Game() {
  const { id } = useParams()
  return <main style={{ padding: 48 }}>Game {id} (coming in Part D2)</main>
}
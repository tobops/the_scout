import { useParams } from 'react-router'

export default function Result() {
  const { id } = useParams()
  return <main style={{ padding: 48 }}>Result for {id} (coming in Part D3)</main>
}
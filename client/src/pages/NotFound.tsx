import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1 className="display">Offside!</h1>
      <p>This page doesn't exist.</p>
      <Link to="/" className="btn btn-green">
        Back home
      </Link>
    </main>
  )
}
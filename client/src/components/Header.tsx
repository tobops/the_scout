import { Link } from 'react-router'
import Icon from './Icon'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-mark">
          <Icon name="search" size={22} />
        </span>
        The Scout
      </Link>
      <nav aria-label="Main">
        <Link to="/" className="btn btn-green btn-small">
          Play
        </Link>
      </nav>
    </header>
  )
}
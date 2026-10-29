import { Route, Routes } from 'react-router'
import Header from './components/Header'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/game/:id/result" element={<Result />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
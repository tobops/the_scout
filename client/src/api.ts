import axios from 'axios'

export const MAX_QUESTIONS = 20

export type Answer = 'yes' | 'no' | 'dont_know' | 'probably' | 'probably_not'

export type Turn = {
  number: number
  type: 'question' | 'guess'
  text: string
  answer?: Answer
}

export type Game = {
  _id: string
  nickname?: string
  status: 'in_progress' | 'scout_won' | 'player_won'
  turns: Turn[]
  revealedPlayer?: string
}

export type Stats = { scoutWins: number; playerWins: number }

export async function createGame(nickname: string) {
  const res = await axios.post<Game>('/api/games', { nickname })
  return res.data
}

export async function getGame(id: string) {
  const res = await axios.get<Game>(`/api/games/${encodeURIComponent(id)}`)
  return res.data
}

export async function sendAnswer(id: string, answer: Answer) {
  const res = await axios.post<Game>(`/api/games/${encodeURIComponent(id)}/answer`, { answer })
  return res.data
}

export async function revealPlayer(id: string, playerName: string) {
  const res = await axios.post<Game>(`/api/games/${encodeURIComponent(id)}/reveal`, { playerName })
  return res.data
}

export async function getStats() {
  const res = await axios.get<Stats>('/api/stats')
  return res.data
}
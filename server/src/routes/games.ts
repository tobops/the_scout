import { Router } from 'express'
import mongoose from 'mongoose'
import { ANSWERS, Game, MAX_QUESTIONS } from '../models/Game'
import { nextMove } from '../scout'


export const gamesRouter = Router()

async function findGame(id: string) {
  if (!mongoose.isValidObjectId(id)) return null
  return Game.findById(id)
}

gamesRouter.post('/', async (req, res) => {
  const firstMove = await nextMove([], false)
  const game = await Game.create({
    nickname: req.body?.nickname,
    turns: [{ number: 1, ...firstMove }],
  })
  res.status(201).json(game)
})

gamesRouter.get('/:id', async (req, res) => {
  const game = await findGame(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }
  res.json(game)
})

gamesRouter.post('/:id/answer', async (req, res) => {
  const answer = req.body?.answer
  if (!ANSWERS.includes(answer)) {
    res.status(400).json({ error: `answer must be one of: ${ANSWERS.join(', ')}` })
    return
  }

  const game = await findGame(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }
  if (game.status !== 'in_progress') {
    res.status(409).json({ error: 'This game is already over' })
    return
  }

  const current = game.turns[game.turns.length - 1]
  if (current.type === 'guess' && answer !== 'yes' && answer !== 'no') {
    res.status(400).json({ error: 'Answer a guess with yes or no' })
    return
  }
  current.answer = answer

  if (current.type === 'guess' && answer === 'yes') {
    game.status = 'scout_won'
  } else if (game.turns.length >= MAX_QUESTIONS) {
    game.status = 'player_won'
  } else {
    const mustGuess = game.turns.length + 1 === MAX_QUESTIONS
    const move = await nextMove(game.turns, mustGuess)
    game.turns.push({ number: game.turns.length + 1, ...move })
  }

  await game.save()
  res.json(game)
})

gamesRouter.post('/:id/reveal', async (req, res) => {
  const playerName = req.body?.playerName
  if (typeof playerName !== 'string' || !playerName.trim()) {
    res.status(400).json({ error: 'playerName is required' })
    return
  }

  const game = await findGame(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }
  if (game.status !== 'player_won') {
    res.status(409).json({ error: 'You can only reveal your player after you win' })
    return
  }

  game.revealedPlayer = playerName
  await game.save()
  res.json(game)
})
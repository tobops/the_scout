import { Router } from 'express'
import { Game } from '../models/Game'

export const statsRouter = Router()

statsRouter.get('/', async (_req, res) => {
  const [scoutWins, playerWins] = await Promise.all([
    Game.countDocuments({ status: 'scout_won' }),
    Game.countDocuments({ status: 'player_won' }),
  ])
  res.json({ scoutWins, playerWins })
})
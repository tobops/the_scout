import 'dotenv/config'
import express, { type NextFunction, type Request, type Response } from 'express'
import mongoose from 'mongoose'
import { gamesRouter } from './routes/games'
import { statsRouter } from './routes/stats'

const app = express()
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})
app.use('/api/games', gamesRouter)
app.use('/api/stats', statsRouter)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

const port = Number(process.env.PORT) || 3000
const mongoUri = process.env.MONGODB_URI
if (!mongoUri) throw new Error('MONGODB_URI is missing from server/.env')

await mongoose.connect(mongoUri)
console.log('Connected to MongoDB')

app.listen(port, (error?: Error) => {
  if (error) throw error
  console.log(`Server running on http://localhost:${port}`)
})
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
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
import { Schema, model } from 'mongoose'

export const ANSWERS = ['yes', 'no', 'dont_know', 'probably', 'probably_not']

const turnSchema = new Schema(
  {
    number: { type: Number, required: true },
    type: { type: String, enum: ['question', 'guess'], required: true },
    text: { type: String, required: true },
    answer: { type: String, enum: ANSWERS },
  },
  { _id: false },
)

const gameSchema = new Schema(
  {
    nickname: { type: String, trim: true, maxlength: 30 },
    status: {
      type: String,
      enum: ['in_progress', 'scout_won', 'player_won'],
      default: 'in_progress',
    },
    turns: [turnSchema],
    revealedPlayer: { type: String, trim: true, maxlength: 60 },
  },
  { timestamps: true },
)

export const Game = model('Game', gameSchema)
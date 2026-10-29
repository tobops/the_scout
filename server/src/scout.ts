import OpenAI from 'openai'
import { MAX_QUESTIONS } from './models/Game'

type Turn = { type: string; text: string; answer?: string | null }
type Move = { type: 'question' | 'guess'; text: string }

const model = process.env.OPENAI_MODEL || 'gpt-6-luna'
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ timeout: 20_000, maxRetries: 1 }) : null

const INSTRUCTIONS = `You are "The Scout", the AI in a football (soccer) guessing game like Akinator.
The user is thinking of a real professional football player from any era or country, in men's or women's football.
Work out who it is by asking yes/no questions, one per turn.

Rules:
- Ask one short yes/no question per turn. Never repeat a question.
- Start broad (still playing? position? nationality? league?), then narrow down. Pick questions that split the remaining candidates roughly in half.
- Answers can be "yes", "no", "probably", "probably not" or "dont know". Treat the unsure answers as weak evidence.
- When you are fairly sure, guess: use action "guess" with only the player's full name as the text.
- If a guess is wrong, rule that player out and keep asking.
- You have ${MAX_QUESTIONS} turns in total, and guesses count as turns.`

export async function nextMove(turns: readonly Turn[], mustGuess: boolean): Promise<Move> {
  if (!openai) return fakeMove(turns, mustGuess)

  const history =
    turns
      .map((turn, i) => {
        const kind = turn.type === 'guess' ? 'Guess' : 'Question'
        return `${i + 1}. ${kind}: ${turn.text} -> ${turn.answer?.replace('_', ' ')}`
      })
      .join('\n') || 'No questions asked yet.'
  const nextStep = mustGuess ? 'This is your last turn, so you must guess now.' : 'What is your next move?'

  const response = await openai.responses.create({
    model,
    instructions: INSTRUCTIONS,
    input: `${history}\n\nTurns used: ${turns.length} of ${MAX_QUESTIONS}. ${nextStep}`,
    reasoning: { effort: 'low' },
    text: {
      format: {
        type: 'json_schema',
        name: 'scout_move',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: mustGuess ? ['guess'] : ['ask', 'guess'] },
            text: { type: 'string' },
          },
          required: ['action', 'text'],
          additionalProperties: false,
        },
      },
    },
  })

  if (response.status !== 'completed') throw new Error(`OpenAI response was ${response.status}`)
  const move = JSON.parse(response.output_text) as { action: 'ask' | 'guess'; text: string }
  return { type: move.action === 'guess' ? 'guess' : 'question', text: move.text.trim() }
}

const FAKE_QUESTIONS = [
  'Is your player still playing?',
  'Is your player a forward?',
  'Does your player play in the Premier League?',
  'Has your player won the World Cup?',
  'Is your player from South America?',
]
const FAKE_GUESSES = ['Lionel Messi', 'Kylian Mbappé', 'Erling Haaland']

// Used when OPENAI_API_KEY is empty, so the game still runs without credits.
function fakeMove(turns: readonly Turn[], mustGuess: boolean): Move {
  const questionsAsked = turns.filter((turn) => turn.type === 'question').length
  const guessesMade = turns.length - questionsAsked

  if (mustGuess || questionsAsked >= FAKE_QUESTIONS.length) {
    return { type: 'guess', text: FAKE_GUESSES[guessesMade % FAKE_GUESSES.length] }
  }
  return { type: 'question', text: FAKE_QUESTIONS[questionsAsked] }
}
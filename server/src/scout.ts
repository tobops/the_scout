type Turn = { type: string; text: string; answer?: string | null }
type Move = { type: 'question' | 'guess'; text: string }

const FAKE_QUESTIONS = [
  'Is your player still playing?',
  'Is your player a forward?',
  'Does your player play in the Premier League?',
  'Has your player won the World Cup?',
  'Is your player from South America?',
]
const FAKE_GUESSES = ['Lionel Messi', 'Kylian Mbappé', 'Erling Haaland']

// Fake Scout for testing. Part C replaces the inside of this function with OpenAI.
export async function nextMove(turns: readonly Turn[], mustGuess: boolean): Promise<Move> {
  const questionsAsked = turns.filter((turn) => turn.type === 'question').length
  const guessesMade = turns.length - questionsAsked

  if (mustGuess || questionsAsked >= FAKE_QUESTIONS.length) {
    return { type: 'guess', text: FAKE_GUESSES[guessesMade % FAKE_GUESSES.length] }
  }
  return { type: 'question', text: FAKE_QUESTIONS[questionsAsked] }
}
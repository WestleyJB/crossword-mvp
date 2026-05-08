import type { CrosswordData } from './types'; // We'll move the interface there

export const pokemonMock: CrosswordData = {
  metadata: {
    title: "Kanto Starters",
    dimensions: { rows: 5, cols: 5 },
    difficulty: "Easy"
  },
  grid: {
    across: [
      { number: 1, clue: "Fire-type lizard", answer: "CHAR", row: 0, col: 0, length: 4 }
    ],
    down: [
      { number: 1, clue: "Electric mouse", answer: "PKA", row: 0, col: 0, length: 3 }
    ]
  }
};
// src/types.ts
export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface Clue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
}

export interface CrosswordData {
  metadata: {
    title: string;
    dimensions: GridDimensions;
    difficulty: 'Easy' | 'Intermediate' | 'Hard';
  };
  grid: {
    across: Clue[];
    down: Clue[];
  };
}
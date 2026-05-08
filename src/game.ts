// src/game.ts
import { pokemonMock } from './data';
import type { CrosswordData } from './types';

// Track the currently active cell and current typing direction
let activeCell: HTMLElement | null = null;
let currentDirection: 'across' | 'down' = 'across';

// Global maps to track which clue number belongs to which cell
const cellToAcrossClue = new Map<string, number>();
const cellToDownClue = new Map<string, number>();

/**
 * Parses the URL to find which category was selected.
 */
function getSelectedCategory(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

/**
 * Finds the next logical cell in the current direction and focuses it.
 */
function advanceCursor(currentRow: number, currentCol: number) {
    const nextRow = currentDirection === 'down' ? currentRow + 1 : currentRow;
    const nextCol = currentDirection === 'across' ? currentCol + 1 : currentCol;
    
    const nextCell = document.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`) as HTMLElement;

    if (nextCell && !nextCell.classList.contains('black')) {
        nextCell.click(); 
    }
}

/**
 * Highlights all cells belonging to the current word and updates the Clue Bar.
 */
function updateHighlights(data: CrosswordData) {
    document.querySelectorAll('.cell.word-highlight').forEach(el => el.classList.remove('word-highlight'));

    if (!activeCell) return;

    const r = activeCell.dataset.row;
    const c = activeCell.dataset.col;
    const key = `${r},${c}`;

    const targetClueNumber = currentDirection === 'across' 
        ? cellToAcrossClue.get(key) 
        : cellToDownClue.get(key);

    if (targetClueNumber) {
        // 1. Highlight word cells
        document.querySelectorAll('.cell').forEach(el => {
            const cellEl = el as HTMLElement;
            const cellKey = `${cellEl.dataset.row},${cellEl.dataset.col}`;
            const compareClue = currentDirection === 'across' 
                ? cellToAcrossClue.get(cellKey) 
                : cellToDownClue.get(cellKey);

            if (compareClue === targetClueNumber) {
                cellEl.classList.add('word-highlight');
            }
        });

        // 2. Update Clue Display
        const clueDisplay = document.getElementById('current-clue');
        if (clueDisplay) {
            const clueObj = data.grid[currentDirection].find(clue => clue.number === targetClueNumber);
            if (clueObj) {
                const directionShort = currentDirection === 'across' ? 'A' : 'D';
                clueDisplay.innerText = `${clueObj.number}${directionShort}: ${clueObj.clue}`;
            }
        }
    }
}

/**
 * Sets up the hidden input listeners to capture keyboard events.
 */
function setupInputHandling(data: CrosswordData) {
    const input = document.getElementById('hidden-input') as HTMLInputElement;
    if (!input) return;

    input.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        const char = val.slice(-1);
        
        if (activeCell && char.match(/[a-z]/i)) {
            const letterSpan = activeCell.querySelector('.letter') as HTMLElement;
            if (letterSpan) {
                letterSpan.innerText = char.toUpperCase();
                const r = parseInt(activeCell.dataset.row || "0");
                const c = parseInt(activeCell.dataset.col || "0");
                advanceCursor(r, c); 
                // Refresh highlights in case the word is completed
                updateHighlights(data);
            }
        }
        input.value = ''; 
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && activeCell) {
            const letterSpan = activeCell.querySelector('.letter') as HTMLElement;
            if (letterSpan) {
                letterSpan.innerText = '';
            }
        }
    });
}

/**
 * Renders the crossword grid based on the provided data.
 */
function renderGrid(data: CrosswordData): void {
    const gridContainer = document.getElementById('crossword-grid');
    const titleElement = document.getElementById('puzzle-title');
    const input = document.getElementById('hidden-input') as HTMLInputElement;
    
    if (!gridContainer || !titleElement || !input) return;

    titleElement.innerText = data.metadata.title;
    const { rows, cols } = data.metadata.dimensions;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.innerHTML = ''; 

    cellToAcrossClue.clear();
    cellToDownClue.clear();
    const startNumbers = new Map<string, number>();

    const mapClues = (clues: any[], type: 'across' | 'down') => {
        clues.forEach(clue => {
            for (let i = 0; i < clue.length; i++) {
                const r = clue.row + (type === 'down' ? i : 0);
                const c = clue.col + (type === 'across' ? i : 0);
                const key = `${r},${c}`;
                
                if (type === 'across') cellToAcrossClue.set(key, clue.number);
                if (type === 'down') cellToDownClue.set(key, clue.number);
                if (i === 0) startNumbers.set(key, clue.number);
            }
        });
    };

    mapClues(data.grid.across, 'across');
    mapClues(data.grid.down, 'down');

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r},${c}`;
            const cell = document.createElement('div');
            cell.dataset.row = r.toString();
            cell.dataset.col = c.toString();

            const hasAcross = cellToAcrossClue.has(key);
            const hasDown = cellToDownClue.has(key);

            if (hasAcross || hasDown) {
                cell.classList.add('cell');
                const num = startNumbers.get(key);
                const numberSpan = num ? `<span class="cell-number">${num}</span>` : '';
                cell.innerHTML = `${numberSpan}<span class="letter"></span>`;
                
                cell.addEventListener('click', () => {
                    if (activeCell === cell) {
                        if (hasAcross && hasDown) {
                            currentDirection = currentDirection === 'across' ? 'down' : 'across';
                        }
                    } else {
                        if (activeCell) activeCell.classList.remove('focused');
                        activeCell = cell;
                        cell.classList.add('focused');

                        if (hasAcross && !hasDown) currentDirection = 'across';
                        if (hasDown && !hasAcross) currentDirection = 'down';
                    }

                    updateHighlights(data);
                    input.focus();
                });
            } else {
                cell.classList.add('cell', 'black');
            }
            gridContainer.appendChild(cell);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const category = getSelectedCategory();
    const backBtn = document.getElementById('back-button');
    backBtn?.addEventListener('click', () => window.location.href = './index.html');

    if (category === 'pokemon') {
        setupInputHandling(pokemonMock);
        renderGrid(pokemonMock);
    } else {
        const titleElement = document.getElementById('puzzle-title');
        if (titleElement) titleElement.innerText = "Coming Soon!";
    }
});
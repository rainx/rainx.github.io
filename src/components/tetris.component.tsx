import { useEffect, useState, useCallback } from 'react';
import styles from './tetris.module.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

const SHAPES = [
  [
    [1, 1, 1, 1], // I
  ],
  [
    [1, 1],
    [1, 1], // O
  ],
  [
    [1, 1, 1],
    [0, 1, 0], // T
  ],
  [
    [1, 1, 1],
    [1, 0, 0], // L
  ],
  [
    [1, 1, 1],
    [0, 0, 1], // J
  ],
  [
    [1, 1, 0],
    [0, 1, 1], // S
  ],
  [
    [0, 1, 1],
    [1, 1, 0], // Z
  ],
];

interface IPosition {
  x: number;
  y: number;
}

interface ITetrisPiece {
  shape: number[][];
  position: IPosition;
}

export function Tetris() {
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<ITetrisPiece | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const createBoard = useCallback(() => {
    return (
      Array(BOARD_HEIGHT)
        .fill(0)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)) as number[][]
    );
  }, []);

  const createNewPiece = useCallback(() => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: randomShape,
      position: {
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(randomShape[0].length / 2),
        y: 0,
      },
    };
  }, []);

  const isValidMove = useCallback(
    (piece: ITetrisPiece, gameBoard: number[][]) => {
      for (let y = 0; y < piece.shape.length; y += 1) {
        for (let x = 0; x < piece.shape[y].length; x += 1) {
          if (piece.shape[y][x]) {
            const newX = piece.position.x + x;
            const newY = piece.position.y + y;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && gameBoard[newY][newX] !== EMPTY_CELL)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [],
  );

  const mergePiece = useCallback(
    (piece: ITetrisPiece, gameBoard: number[][]) => {
      const newBoard = gameBoard.map((row) => [...row]);
      for (let y = 0; y < piece.shape.length; y += 1) {
        for (let x = 0; x < piece.shape[y].length; x += 1) {
          if (piece.shape[y][x]) {
            const newY = piece.position.y + y;
            if (newY >= 0) {
              newBoard[newY][piece.position.x + x] = 1;
            }
          }
        }
      }
      return newBoard;
    },
    [],
  );

  const clearLines = useCallback((gameBoard: number[][]) => {
    let linesCleared = 0;
    const newBoard = gameBoard.filter((row) => {
      const isFull = row.every((cell) => cell !== EMPTY_CELL);
      if (isFull) linesCleared += 1;
      return !isFull;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }

    setScore((prev) => prev + linesCleared * 100);
    return newBoard;
  }, []);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const newPiece = {
      ...currentPiece,
      position: { ...currentPiece.position, y: currentPiece.position.y + 1 },
    };

    if (isValidMove(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      const newBoard = mergePiece(currentPiece, board);
      const clearedBoard = clearLines(newBoard);
      setBoard(clearedBoard);

      const nextPiece = createNewPiece();
      if (isValidMove(nextPiece, clearedBoard)) {
        setCurrentPiece(nextPiece);
      } else {
        setGameOver(true);
      }
    }
  }, [
    board,
    currentPiece,
    gameOver,
    isValidMove,
    mergePiece,
    clearLines,
    createNewPiece,
  ]);

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const newPiece = {
      ...currentPiece,
      position: { ...currentPiece.position, x: currentPiece.position.x - 1 },
    };

    if (isValidMove(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  }, [board, currentPiece, gameOver, isValidMove]);

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const newPiece = {
      ...currentPiece,
      position: { ...currentPiece.position, x: currentPiece.position.x + 1 },
    };

    if (isValidMove(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  }, [board, currentPiece, gameOver, isValidMove]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const newShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map((row) => row[i]).reverse(),
    );

    const newPiece = {
      ...currentPiece,
      shape: newShape,
    };

    if (isValidMove(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  }, [board, currentPiece, gameOver, isValidMove]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.code === 'Space') {
          setBoard(createBoard());
          setCurrentPiece(createNewPiece());
          setGameOver(false);
          setScore(0);
        }
        return;
      }

      // eslint-disable-next-line default-case
      switch (e.code) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
      }
    },
    [
      gameOver,
      moveLeft,
      moveRight,
      moveDown,
      rotate,
      createBoard,
      createNewPiece,
    ],
  );

  useEffect(() => {
    setBoard(createBoard());
    setCurrentPiece(createNewPiece());
  }, [createBoard, createNewPiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveDown, 1000);
      return () => clearInterval(interval);
    }
  }, [moveDown, gameOver]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y += 1) {
        for (let x = 0; x < currentPiece.shape[y].length; x += 1) {
          if (currentPiece.shape[y][x]) {
            const newY = currentPiece.position.y + y;
            const newX = currentPiece.position.x + x;
            if (
              newY >= 0 &&
              newY < BOARD_HEIGHT &&
              newX >= 0 &&
              newX < BOARD_WIDTH
            ) {
              displayBoard[newY][newX] = 1;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={y} className={styles.row}>
        {row.map((cell, x) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${y}-${x}`}
            className={`${styles.cell} ${cell ? styles.filled : ''}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.tetris}>
      <div className={styles.board}>{renderBoard()}</div>
      <div className={styles.score} style={{ display: 'none' }}>
        Score: {score}
      </div>
      {gameOver && (
        <div className={styles.gameOver}>Game Over! Press Space to restart</div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // UP

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isGameOver: boolean;
  setIsGameOver: (isOver: boolean) => void;
}

export default function SnakeGame({ onScoreChange, isGameOver, setIsGameOver }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          onScoreChange(newSnake.length - INITIAL_SNAKE.length);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120);
    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange, setIsGameOver]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        className="grid bg-zinc-950/80 neon-box-cyan rounded-lg overflow-hidden relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 500px)',
          aspectRatio: '1/1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-full h-full border border-zinc-900/30 ${
                isHead ? 'bg-cyan-300 shadow-[0_0_10px_#0ff]' :
                isSnake ? 'bg-cyan-500/80 shadow-[0_0_5px_#0ff]' :
                isFood ? 'bg-pink-500 shadow-[0_0_15px_#f0a] rounded-full scale-75' :
                'bg-transparent'
              }`}
            />
          );
        })}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <h2 className="text-4xl font-bold neon-text-pink mb-4">GAME OVER</h2>
            <p className="text-xl text-zinc-300 mb-6 font-mono">Score: {snake.length - INITIAL_SNAKE.length}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-transparent neon-box-cyan text-cyan-400 font-bold tracking-widest uppercase hover:bg-cyan-950/50 transition-colors rounded"
            >
              Play Again
            </button>
          </div>
        )}
        
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
            <h2 className="text-3xl font-bold neon-text-green tracking-widest">PAUSED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-zinc-500 font-mono text-sm uppercase tracking-widest flex gap-6">
        <span>WASD / Arrows to move</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
}

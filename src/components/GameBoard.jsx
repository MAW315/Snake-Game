import { useRef, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import GameControls from './GameControls';

const GameBoard = () => {
  const canvasRef = useRef(null);
  const { gameState, GRID_SIZE, GRID_COUNT, resetGame, changeDifficulty } = useGame();
  const width = GRID_SIZE * GRID_COUNT;
  const height = GRID_SIZE * GRID_COUNT;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // 绘制网格
    ctx.strokeStyle = '#ddd';
    for (let i = 0; i <= width; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    for (let i = 0; i <= height; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    gameState.snake.forEach(segment => {
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
      );
    });

    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(
      gameState.food.x * GRID_SIZE,
      gameState.food.y * GRID_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    );
  }, [gameState, width, height, GRID_SIZE]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '2px solid #333',
          borderRadius: '4px',
        }}
      />
      <GameControls
        score={gameState.score}
        isGameOver={gameState.isGameOver}
        difficulty={gameState.difficulty}
        onRestart={resetGame}
        onDifficultyChange={changeDifficulty}
      />
    </div>
  );
};

export default GameBoard;
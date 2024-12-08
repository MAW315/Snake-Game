import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Difficulty } from '../types/game';

const GRID_SIZE = 20;
const GRID_COUNT = 20;

const DIFFICULTY_SPEEDS = {
  [Difficulty.EASY]: 200,
  [Difficulty.MEDIUM]: 150,
  [Difficulty.HARD]: 100,
};

export const useGame = () => {
  const [gameState, setGameState] = useState({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: Direction.RIGHT,
    isGameOver: false,
    score: 0,
    difficulty: Difficulty.MEDIUM,
  });

  const gameLoopRef = useRef();

  // 检查是否撞到墙或自身
  const checkCollision = (head) => {
    // 检查墙壁碰撞
    if (
      head.x < 0 || 
      head.x >= GRID_COUNT || 
      head.y < 0 || 
      head.y >= GRID_COUNT
    ) {
      return true;
    }

    // 检查自身碰撞
    return gameState.snake.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  };

  // 生成新的食物位置
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT),
      };
    } while (
      gameState.snake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, [gameState.snake]);

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      // 根据方向移动蛇头
      switch (prev.direction) {
        case Direction.UP:
          head.y -= 1;
          break;
        case Direction.DOWN:
          head.y += 1;
          break;
        case Direction.LEFT:
          head.x -= 1;
          break;
        case Direction.RIGHT:
          head.x += 1;
          break;
      }

      // 检查碰撞
      if (checkCollision(head)) {
        return { ...prev, isGameOver: true };
      }

      // 将新头部添加到蛇身前端
      newSnake.unshift(head);

      // 检查是否吃到食物
      if (head.x === prev.food.x && head.y === prev.food.y) {
        // 吃到食物，增加分数并生成新食物
        return {
          ...prev,
          snake: newSnake,
          score: prev.score + 10,
          food: generateFood(),
        };
      }

      // 没吃到食物，移除尾部
      newSnake.pop();

      return {
        ...prev,
        snake: newSnake,
      };
    });
  }, [gameState.isGameOver, generateFood]);

  // 处理键盘事件
  const handleKeyPress = useCallback((event) => {
    if (gameState.isGameOver) return;

    const { direction } = gameState;
    
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== Direction.DOWN) {
          setGameState(prev => ({ ...prev, direction: Direction.UP }));
        }
        break;
      case 'ArrowDown':
        if (direction !== Direction.UP) {
          setGameState(prev => ({ ...prev, direction: Direction.DOWN }));
        }
        break;
      case 'ArrowLeft':
        if (direction !== Direction.RIGHT) {
          setGameState(prev => ({ ...prev, direction: Direction.LEFT }));
        }
        break;
      case 'ArrowRight':
        if (direction !== Direction.LEFT) {
          setGameState(prev => ({ ...prev, direction: Direction.RIGHT }));
        }
        break;
    }
  }, [gameState.direction, gameState.isGameOver]);

  // 重置游戏
  const resetGame = useCallback(() => {
    // 清除现有的游戏循环
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    // 重置游戏状态
    setGameState(prev => ({
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      direction: Direction.RIGHT,
      isGameOver: false,
      score: 0,
      difficulty: prev.difficulty, // 保持当前难度
    }));
  }, []);

  // 改变难度
  const changeDifficulty = useCallback((newDifficulty) => {
    setGameState(prev => ({ ...prev, difficulty: newDifficulty }));
  }, []);

  // 设置游戏循环
  useEffect(() => {
    if (!gameState.isGameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      gameLoopRef.current = setInterval(
        moveSnake, 
        DIFFICULTY_SPEEDS[gameState.difficulty]
      );
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, gameState.isGameOver, gameState.difficulty]);

  // 设置键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return {
    gameState,
    GRID_SIZE,
    GRID_COUNT,
    resetGame,
    changeDifficulty,
  };
};
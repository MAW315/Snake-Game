import { Difficulty } from '../types/game';

const GameControls = ({ 
  score, 
  isGameOver, 
  difficulty,
  onRestart,
  onDifficultyChange 
}) => {
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0 5px'
  };

  const difficultyButtonStyle = (selected) => ({
    ...buttonStyle,
    backgroundColor: selected ? '#2196F3' : '#90CAF9',
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        分数: {score}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button
          style={difficultyButtonStyle(difficulty === Difficulty.EASY)}
          onClick={() => onDifficultyChange(Difficulty.EASY)}
          disabled={!isGameOver}
        >
          简单
        </button>
        <button
          style={difficultyButtonStyle(difficulty === Difficulty.MEDIUM)}
          onClick={() => onDifficultyChange(Difficulty.MEDIUM)}
          disabled={!isGameOver}
        >
          中等
        </button>
        <button
          style={difficultyButtonStyle(difficulty === Difficulty.HARD)}
          onClick={() => onDifficultyChange(Difficulty.HARD)}
          disabled={!isGameOver}
        >
          困难
        </button>
      </div>

      {isGameOver && (
        <div>
          <div style={{ 
            color: 'red', 
            fontSize: '24px', 
            marginBottom: '10px' 
          }}>
            游戏结束！
          </div>
          <button 
            onClick={onRestart}
            style={buttonStyle}
          >
            重新开始
          </button>
        </div>
      )}
      
      {!isGameOver && (
        <div style={{ 
          color: '#666', 
          marginTop: '10px' 
        }}>
          使用方向键控制蛇的移动
        </div>
      )}
    </div>
  );
};

export default GameControls;
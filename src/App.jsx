import GameBoard from './components/GameBoard'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1>贪吃蛇游戏</h1>
      <GameBoard />
    </div>
  )
}

export default App
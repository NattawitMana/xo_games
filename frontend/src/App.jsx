import { useState, useEffect } from 'react'
import './App.css'
import { calculateWinner } from './gameLogic.js'
import { getBestMove } from './bot.js'
import axios from 'axios';

function App() {
  const [size, setSize] = useState(3)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(false)
  const [history, setHistory] = useState([])
  const [isBot, setIsBot] = useState(false)
  const [isReplay, setIsReplay] = useState(false)
  const [currentMoves, setCurrentMoves] = useState([])

  useEffect(() => {
    getHistory();
  }, [])

  // bot
  useEffect(()=> {
    if (isBot && !isXNext && !winner && !isReplay) {
      const timer = setTimeout(() => {
        const botMove = getBestMove(board, 'O', 'X');

        if (botMove !== null) {
          const newBoard = [...board];
          newBoard[botMove] = 'O';
          setBoard(newBoard);

          const moveHistory = [...currentMoves, { index: botMove, player: 'O' }];
          setCurrentMoves(moveHistory);

          // calculate winner
          const win = calculateWinner(newBoard, size);
          
          if (win && win[1]) {
            setWinner(win[0]);
            saveHistory(size, win[0], moveHistory);
          } else {
            setIsXNext(true);
          }

          setIsXNext(true);
        }
    }, 500);

    return () => clearTimeout(timer);
    }
  }, [isXNext, size, board, winner, isBot]);


  // function
  // start new game
  const newGame = (size) => {
    const sizeInt = parseInt(size)
    setSize(sizeInt)
    setBoard(Array(sizeInt * sizeInt).fill(null))
    setIsXNext(true)
    setWinner(false)
    setIsReplay(false)
    setCurrentMoves([])
  }

  // cell click
  const handleClick = (index) => {
    if (board[index] || winner || isReplay) return;

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    
    setBoard(newBoard)

    const moveHistory = [...currentMoves, { index: index, player: isXNext ? 'X' : 'O' }];
    setCurrentMoves(moveHistory);

    // calculate winner
    const win = calculateWinner(newBoard, size)
    
    if (win && win[1]) {
      setWinner(win[0])
      saveHistory(size, win[0], moveHistory)
    }

    setIsXNext(!isXNext)
  }

  // save history
  const saveHistory = async(size, winner, moves) => {
    if (isReplay) return;
    try {
      const data = await axios.post('http://localhost:5000/api/v1/history', {
        boardSize: size,
        winner: winner,
        moves: moves
      });
      getHistory();
    } catch (err) {
      console.error(err);
    }
  }

  // get history
  const getHistory = async() => {
    try {
      const data = await axios.get('http://localhost:5000/api/v1/history');
      // console.log(data.data);
      setHistory(data.data);
    } catch (err) {
      console.error(err);
    }
  }

  // replay
  const replayGame = (game) => {
    setIsReplay(true);
    setIsXNext(true);
    setWinner(false);

    let currentBoard = Array(size * size).fill(null);
    setBoard(currentBoard);
    setSize(game.boardSize);
  
    
    let index = 0;
    let moves = game.moves;
  
    const interval = setInterval(() => {
      if (index >= moves.length) {
        clearInterval(interval);
        setIsReplay(false);
        return;
      }

      const moveData = moves[index];
  
      if (moveData) {
          currentBoard[moveData.index] = moveData.player;
          setBoard([...currentBoard]);
      }

      index++;
    }, 500);
  }

return (
    <div className="main-container">
      
      <div className="game-area">
        <div className="game-header">
          <h1>XO Game</h1>
        </div>
        {/* control */}
        <div className="controls">
          <label>Size:</label>
          <input 
            type="number" 
            value={size} 
            onChange={(e) => newGame(e.target.value)} 
          />
          <button 
            onClick={() => setIsBot(!isBot)}
            style={{ backgroundColor: isBot ? '#10b981' : '#ef4444' }}
          >
            {isBot ? 'Bot: ON' : 'Bot: OFF'}
          </button>
          <button 
            onClick={() => newGame(size)}
            style={{ backgroundColor: '#3b82f6' }}
          >
            New Game
          </button>
        </div>
        {/* board */}
        <div 
          className="board"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`
          }}
        >
          {board.map((cell, index) => (
            <button 
              key={index} 
              className="cell" 
              onClick={() => handleClick(index)}
              style={{
                  color: cell === 'X' ? '#ef4444' : '#3b82f6',
                  fontSize: '28px'
              }}>
              {cell}
            </button>
          ))}
        </div>
      </div>
      {/* sidebar */}
      <div className="sidebar">
        
        <div className="status-card">
          <div className="status-title">
            {winner ? 'Winner' : 'Current Turn'}
          </div>
          <div 
            className="status-value"
            style={{ color: winner ? '#10b981' : (isXNext ? '#ef4444' : '#3b82f6') }}
          >
            {winner ? winner : (isXNext ? 'X' : 'O')}
          </div>
        </div>
        {/* history */}
        <div className="history-section">
          <div className="history-header">
            History ({history.length})
          </div>
          
          <div className="history-list">
            {history.slice().reverse().map((game, idx) => (
              <div key={idx} className="history-item">
                <div className="history-info">
                  <div style={{ fontWeight: 'bold', color: '#334155' }}>Match {history.length - idx}</div>
                  <div>Board: {game.boardSize}x{game.boardSize}</div>
                  <div>Winner: {game.winner}</div>
                </div>
                <button className="btn-replay" onClick={() => replayGame(game)}>
                  Replay
                </button>
              </div>
            ))}
            
            {history.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                No history found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default App

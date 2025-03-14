import React, { useState } from 'react';
import './GameInfo.css';

const GameInfo = ({ 
  playerTurn, 
  gameStatus, 
  moveHistory, 
  onResetGame, 
  isInCheck,
  aiDifficulty,
  onGetHint,
  aiThinking
}) => {
  const [activeTab, setActiveTab] = useState('moves');
  
  // Group moves into pairs (white and black)
  const groupedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1]
    });
  }
  
  // Calculate material advantage
  const calculateMaterialAdvantage = () => {
    const pieceValues = {
      'pawn': 1,
      'knight': 3,
      'bishop': 3,
      'rook': 5,
      'queen': 9,
      'king': 0
    };
    
    let whiteCaptured = 0;
    let blackCaptured = 0;
    
    moveHistory.forEach(move => {
      if (move.capturedPiece) {
        if (move.capturedPiece.color === 'white') {
          blackCaptured += pieceValues[move.capturedPiece.type];
        } else {
          whiteCaptured += pieceValues[move.capturedPiece.type];
        }
      }
    });
    
    const advantage = whiteCaptured - blackCaptured;
    
    if (advantage > 0) {
      return { color: 'white', value: advantage };
    } else if (advantage < 0) {
      return { color: 'black', value: Math.abs(advantage) };
    } else {
      return { color: 'equal', value: 0 };
    }
  };
  
  const materialAdvantage = calculateMaterialAdvantage();
  
  // Render game status
  const renderGameStatus = () => {
    let statusText = '';
    
    if (gameStatus === 'ongoing') {
      statusText = `${playerTurn === 'white' ? 'White' : 'Black'}'s turn`;
    } else if (gameStatus.includes('checkmate')) {
      statusText = gameStatus;
    } else if (gameStatus.includes('stalemate')) {
      statusText = 'Draw by stalemate';
    } else {
      statusText = gameStatus;
    }
    
    return (
      <div className="status-container">
        <div className="status">
          {statusText}
          {aiThinking && playerTurn === 'black' && (
            <div className="ai-thinking">
              <span>AI is thinking</span>
              <div className="thinking-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>
        <div className="player-indicators">
          <div className={`player-indicator ${playerTurn === 'white' ? 'active' : ''}`}>
            <span className="white">White</span>
          </div>
          <div className={`player-indicator ${playerTurn === 'black' ? 'active' : ''}`}>
            <span className="black">Black</span>
          </div>
        </div>
        {isInCheck && gameStatus === 'ongoing' && (
          <div className="check-status">
            {playerTurn === 'white' ? 'White' : 'Black'} is in check!
          </div>
        )}
        {gameStatus !== 'ongoing' && (
          <div className="game-over">
            {gameStatus}
          </div>
        )}
        <div className="button-container">
          <button className="reset-button" onClick={onResetGame}>
            New Game
          </button>
          <button 
            className="hint-button" 
            onClick={onGetHint}
            disabled={gameStatus !== 'ongoing' || playerTurn !== 'white' || aiThinking}
          >
            Hint
          </button>
        </div>
      </div>
    );
  };
  
  // Render move history
  const renderMoveHistory = () => {
    if (moveHistory.length === 0) {
      return <div className="no-moves">No moves yet</div>;
    }
    
    return (
      <div className="moves-container">
        <table className="moves-table">
          <thead>
            <tr>
              <th>#</th>
              <th>White</th>
              <th>Black</th>
            </tr>
          </thead>
          <tbody>
            {groupedMoves.map(move => (
              <tr key={move.number}>
                <td className="move-number">{move.number}</td>
                <td className="white-move">{move.white ? move.white.notation : ''}</td>
                <td className="black-move">{move.black ? move.black.notation : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render analysis
  const renderAnalysis = () => {
    const searchDepth = {
      'easy': 1,
      'medium': 2,
      'hard': 3
    }[aiDifficulty];
    
    return (
      <div className="analysis-container">
        <div className="analysis-item">
          <span className="analysis-label">Total Moves</span>
          <span className="analysis-value">{moveHistory.length}</span>
        </div>
        <div className="analysis-item">
          <span className="analysis-label">Material Advantage</span>
          <span className={`analysis-value material-advantage ${materialAdvantage.color}`}>
            {materialAdvantage.color === 'equal' ? 'Equal' : `+${materialAdvantage.value} for ${materialAdvantage.color}`}
          </span>
        </div>
        <div className="analysis-item">
          <span className="analysis-label">AI Thinking Depth</span>
          <span className="analysis-value">{searchDepth} {searchDepth === 1 ? 'move' : 'moves'}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="game-info">
      <h2>Game Status</h2>
      {renderGameStatus()}
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'moves' ? 'active' : ''}`}
          onClick={() => setActiveTab('moves')}
        >
          Moves
        </div>
        <div 
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'moves' ? renderMoveHistory() : renderAnalysis()}
      </div>
    </div>
  );
};

export default GameInfo; 
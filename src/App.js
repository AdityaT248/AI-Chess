import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import PromotionDialog from './components/PromotionDialog';
import ThemeSelector from './components/ThemeSelector';
import themes from './themes';
import { 
  initializeBoard, 
  isValidMove, 
  makeMove, 
  isInCheck, 
  isCheckmate, 
  isStalemate,
  isPawnPromotion
} from './utils/chessLogic';
import { getAIMove } from './utils/aiPlayer';

// eslint-disable-next-line no-unused-vars
function App() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [playerTurn, setPlayerTurn] = useState('white');
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameState, setGameState] = useState({
    enPassantTarget: null,
    castlingRights: {
      white: { kingSide: true, queenSide: true },
      black: { kingSide: true, queenSide: true }
    }
  });
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [checkIndicator, setCheckIndicator] = useState(null);
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [showHint, setShowHint] = useState(false);
  const [hintMove, setHintMove] = useState(null);
  const [promotionDialog, setPromotionDialog] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [aiThinking, setAiThinking] = useState(false);

  // Create a ref to store the handleMove function
  const handleMoveRef = useRef(null);

  // Generate algebraic notation for a move
  const generateMoveNotation = useCallback((piece, fromRow, fromCol, toRow, toCol, capturedPiece, promotionPiece) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    let notation = '';
    
    // Add piece letter (except for pawns)
    if (piece.type !== 'pawn') {
      notation += piece.type.charAt(0).toUpperCase();
    }
    
    // Add starting position for pawns if capturing
    if (piece.type === 'pawn' && capturedPiece) {
      notation += files[fromCol];
    }
    
    // Add 'x' if capturing
    if (capturedPiece) {
      notation += 'x';
    }
    
    // Add destination square
    notation += files[toCol] + ranks[toRow];
    
    // Add promotion piece
    if (promotionPiece) {
      notation += '=' + promotionPiece.charAt(0).toUpperCase();
    }
    
    return notation;
  }, []);

  // Handle move
  const handleMove = useCallback((fromRow, fromCol, toRow, toCol, promotionPiece = null) => {
    // Get the piece before making the move
    const piece = board[fromRow][fromCol];
    
    // Make the move
    const { board: newBoard, gameState: newGameState, capturedPiece } = makeMove(
      board, 
      fromRow, 
      fromCol, 
      toRow, 
      toCol, 
      gameState,
      promotionPiece
    );
    
    // Update the board and game state
    setBoard(newBoard);
    setGameState(newGameState);
    
    // Generate notation for the move
    const notation = generateMoveNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece, promotionPiece);
    
    // Add move to history
    const newMove = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece,
      capturedPiece,
      notation,
      color: piece.color
    };
    
    setMoveHistory(prevHistory => [...prevHistory, newMove]);
    
    // Switch turns
    setPlayerTurn(prevTurn => prevTurn === 'white' ? 'black' : 'white');
    
    // Clear selection and highlights
    setSelectedPiece(null);
    setHighlightedSquares([]);
    setShowHint(false);
    setHintMove(null);
  }, [board, gameState, generateMoveNotation]);

  // Update the ref whenever handleMove changes
  useEffect(() => {
    handleMoveRef.current = handleMove;
  }, [handleMove]);

  // Make AI move - optimized version
  const makeAIMove = useCallback(() => {
    if (playerTurn === 'black' && gameStatus === 'ongoing' && !aiThinking) {
      setAiThinking(true);
      
      // Add a small delay before starting AI calculation to ensure UI updates
      setTimeout(() => {
        try {
          // Get AI move with a timeout to prevent infinite calculations
          const aiMove = getAIMove(board, 'black', gameState, aiDifficulty);
          
          if (aiMove) {
            const { fromRow, fromCol, toRow, toCol } = aiMove;
            const piece = board[fromRow][fromCol];
            
            // Check if this is a pawn promotion
            if (isPawnPromotion(piece, toRow)) {
              // AI always promotes to queen
              handleMoveRef.current(fromRow, fromCol, toRow, toCol, 'queen');
            } else {
              handleMoveRef.current(fromRow, fromCol, toRow, toCol);
            }
          } else {
            // If no move found, try a random move
            const moves = [];
            for (let fromRow = 0; fromRow < 8; fromRow++) {
              for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = board[fromRow][fromCol];
                if (piece && piece.color === 'black') {
                  for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                      if (isValidMove(board, fromRow, fromCol, toRow, toCol, gameState)) {
                        moves.push({ fromRow, fromCol, toRow, toCol });
                      }
                    }
                  }
                }
              }
            }
            
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              const { fromRow, fromCol, toRow, toCol } = randomMove;
              handleMoveRef.current(fromRow, fromCol, toRow, toCol);
            }
          }
        } catch (error) {
          console.error("Error in AI move calculation:", error);
        } finally {
          // Always set aiThinking to false when done, even if there was an error
          setAiThinking(false);
        }
      }, 300); // Add a 300ms delay to ensure UI updates before AI calculation
    }
  }, [board, playerTurn, gameStatus, gameState, aiDifficulty, aiThinking]);

  // AI makes a move when it's black's turn - with debounce protection
  useEffect(() => {
    let timeoutId = null;
    
    if (playerTurn === 'black' && gameStatus === 'ongoing' && !aiThinking) {
      // Use a timeout to debounce multiple calls
      timeoutId = setTimeout(() => {
        makeAIMove();
      }, 500);
    }
    
    // Cleanup function to clear the timeout if component updates before timeout completes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [playerTurn, gameStatus, makeAIMove, aiThinking]);

  // Check for check, checkmate, or stalemate after each move
  useEffect(() => {
    if (moveHistory.length > 0) {
      // Check if any king is in check
      const whiteInCheck = isInCheck(board, 'white');
      const blackInCheck = isInCheck(board, 'black');
      
      if (whiteInCheck) {
        setCheckIndicator('white');
        
        // Check if it's checkmate
        if (isCheckmate(board, 'white', gameState)) {
          setGameStatus('Checkmate! Black wins.');
        }
      } else if (blackInCheck) {
        setCheckIndicator('black');
        
        // Check if it's checkmate
        if (isCheckmate(board, 'black', gameState)) {
          setGameStatus('Checkmate! White wins.');
        }
      } else {
        setCheckIndicator(null);
      }
      
      // Check for stalemate
      if (playerTurn === 'white' && isStalemate(board, 'white', gameState)) {
        setGameStatus('Draw by stalemate');
      } else if (playerTurn === 'black' && isStalemate(board, 'black', gameState)) {
        setGameStatus('Draw by stalemate');
      }
    }
  }, [board, playerTurn, moveHistory, gameState]);

  // Calculate valid moves for the selected piece - memoized
  const validMoves = useMemo(() => {
    if (!selectedPiece) return [];
    
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(board, selectedPiece.row, selectedPiece.col, row, col, gameState)) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }, [selectedPiece, board, gameState]);

  // Update highlighted squares when valid moves change
  useEffect(() => {
    setHighlightedSquares(validMoves);
  }, [validMoves]);

  // eslint-disable-next-line no-unused-vars
  const getPieceSymbol = useCallback((pieceType) => {
    switch (pieceType) {
      case 'pawn': return '';
      case 'knight': return 'N';
      case 'bishop': return 'B';
      case 'rook': return 'R';
      case 'queen': return 'Q';
      case 'king': return 'K';
      default: return '';
    }
  }, []);

  const handleSquareClick = useCallback((row, col) => {
    // If game is over or promotion dialog is open, don't allow any moves
    if (gameStatus !== 'ongoing' || promotionDialog) return;
    
    // If it's not the player's turn, don't allow any moves
    if (playerTurn !== 'white') return;
    
    const piece = board[row][col];
    
    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        return;
      }
      
      // If clicking on a different piece of the same color, select that piece instead
      if (piece && piece.color === playerTurn) {
        setSelectedPiece({ row, col, piece });
        return;
      }
      
      // Try to make a move
      if (isValidMove(board, selectedPiece.row, selectedPiece.col, row, col, gameState)) {
        // Check if this is a pawn promotion
        if (isPawnPromotion(selectedPiece.piece, row)) {
          // Show promotion dialog
          const boardRect = document.querySelector('.chess-board').getBoundingClientRect();
          const squareSize = boardRect.width / 8;
          
          setPromotionDialog({
            fromRow: selectedPiece.row,
            fromCol: selectedPiece.col,
            toRow: row,
            toCol: col,
            position: {
              x: boardRect.left + col * squareSize + squareSize / 2,
              y: boardRect.top + row * squareSize + squareSize / 2
            }
          });
          return;
        }
        
        // Regular move
        handleMove(selectedPiece.row, selectedPiece.col, row, col);
      }
    } else {
      // If no piece is selected and clicked on a piece of the player's color, select it
      if (piece && piece.color === playerTurn) {
        setSelectedPiece({ row, col, piece });
      }
    }
  }, [board, gameState, gameStatus, handleMove, playerTurn, promotionDialog, selectedPiece]);

  const handlePromotion = useCallback((pieceType) => {
    if (!promotionDialog) return;
    
    const { fromRow, fromCol, toRow, toCol } = promotionDialog;
    
    // Make the move with promotion
    handleMove(fromRow, fromCol, toRow, toCol, pieceType);
    setPromotionDialog(null);
  }, [handleMove, promotionDialog]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setPlayerTurn('white');
    setGameStatus('ongoing');
    setMoveHistory([]);
    setGameState({
      enPassantTarget: null,
      castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
      }
    });
    setHighlightedSquares([]);
    setCheckIndicator(null);
    setShowHint(false);
    setHintMove(null);
    setPromotionDialog(null);
  }, []);

  const handleDifficultyChange = useCallback((difficulty) => {
    setAiDifficulty(difficulty);
    resetGame();
  }, [resetGame]);

  const getHint = useCallback(() => {
    // Use the AI to suggest a move for the player
    if (playerTurn === 'white' && gameStatus === 'ongoing') {
      const suggestedMove = getAIMove(board, 'white', gameState, 2);
      if (suggestedMove) {
        setShowHint(true);
        setHintMove(suggestedMove);
      }
    }
  }, [board, gameState, gameStatus, playerTurn]);

  // Handle theme change
  const handleThemeChange = useCallback((themeKey) => {
    setCurrentTheme(themeKey);
    // Save theme preference to localStorage
    localStorage.setItem('chessTheme', themeKey);
  }, []);

  // Load saved theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('chessTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Memoize the last move for better performance
  const lastMove = useMemo(() => {
    return moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
  }, [moveHistory]);

  // Memoize the current theme object
  const currentThemeObject = useMemo(() => themes[currentTheme], [currentTheme]);

  return (
    <div className="app">
      <div className="app-header">
        <h1>AI Chess</h1>
        <div className="author-credits">
          <span>Created by Aditya Thakkar</span>
        </div>
      </div>
      <div className="difficulty-selector">
        <span className="difficulty-label">AI Difficulty:</span>
        <div className="difficulty-buttons">
          <button 
            className={`difficulty-button ${aiDifficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
          >
            Easy
          </button>
          <button 
            className={`difficulty-button ${aiDifficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('medium')}
          >
            Medium
          </button>
          <button 
            className={`difficulty-button ${aiDifficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
          >
            Hard
          </button>
        </div>
      </div>
      <ThemeSelector 
        currentTheme={currentTheme} 
        onThemeChange={handleThemeChange} 
      />
      <div className="game-container">
        <ChessBoard 
          board={board} 
          selectedPiece={selectedPiece} 
          onSquareClick={handleSquareClick}
          highlightedSquares={highlightedSquares}
          checkIndicator={checkIndicator}
          lastMove={lastMove}
          hintMove={showHint ? hintMove : null}
          theme={currentThemeObject}
        />
        <GameInfo 
          playerTurn={playerTurn} 
          gameStatus={gameStatus} 
          moveHistory={moveHistory} 
          onResetGame={resetGame} 
          isInCheck={checkIndicator !== null}
          aiDifficulty={aiDifficulty}
          onGetHint={getHint}
          aiThinking={aiThinking}
        />
      </div>
      {promotionDialog && (
        <PromotionDialog 
          position={promotionDialog.position}
          color="white"
          onSelect={handlePromotion}
          onCancel={() => setPromotionDialog(null)}
        />
      )}
      <div className="app-footer">
        <div className="footer-content">
          <p>Chess AI with Minimax Algorithm & Alpha-Beta Pruning</p>
          <p>© {new Date().getFullYear()} AI Chess by Aditya Thakkar</p>
        </div>
      </div>
    </div>
  );
}

export default App; 

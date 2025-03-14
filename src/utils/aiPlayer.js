import { 
  makeMove, 
  isValidMove, 
  isInCheck, 
  isCheckmate, 
  isStalemate,
  cloneBoard
} from './chessLogic';

// Piece values for evaluation
const pieceValues = {
  'pawn': 100,
  'knight': 320,
  'bishop': 330,
  'rook': 500,
  'queen': 900,
  'king': 20000
};

// Position bonuses to encourage good piece placement
const positionBonus = {
  'pawn': [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  'knight': [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  'bishop': [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  'rook': [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  'queen': [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  'king': [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

// Memoization cache for position evaluation
const evaluationCache = new Map();
const MAX_CACHE_SIZE = 10000;

// Clear cache when it gets too large
const checkCacheSize = () => {
  if (evaluationCache.size > MAX_CACHE_SIZE) {
    // Clear the entire cache for simplicity and performance
    evaluationCache.clear();
  }
};

// Get a simple hash for the board position
const getBoardHash = (board) => {
  let hash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        hash += `${row}${col}${piece.type[0]}${piece.color[0]}`;
      }
    }
  }
  return hash;
};

// Evaluate the board position
const evaluateBoard = (board, gameState) => {
  // Check for checkmate or stalemate
  if (isCheckmate(board, 'black', gameState)) {
    return 10000; // White wins
  }
  if (isCheckmate(board, 'white', gameState)) {
    return -10000; // Black wins
  }
  if (isStalemate(board, 'white', gameState) || isStalemate(board, 'black', gameState)) {
    return 0; // Draw
  }
  
  let score = 0;
  
  // Material and position evaluation
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      // Base material value
      const materialValue = pieceValues[piece.type];
      
      // Position value
      const positionValue = piece.color === 'white' 
        ? positionBonus[piece.type][row][col] 
        : positionBonus[piece.type][7 - row][col];
      
      // Additional bonuses
      let bonusValue = 0;
      
      // Mobility bonus (simplified)
      if (piece.type === 'knight' || piece.type === 'bishop') {
        // Bonus for developed pieces
        if ((piece.color === 'white' && row < 6) || (piece.color === 'black' && row > 1)) {
          bonusValue += 10;
        }
      }
      
      // Pawn structure bonuses
      if (piece.type === 'pawn') {
        // Bonus for advanced pawns
        const advancementBonus = piece.color === 'white' ? (6 - row) * 5 : (row - 1) * 5;
        bonusValue += advancementBonus;
        
        // Bonus for pawns near promotion
        if ((piece.color === 'white' && row <= 1) || (piece.color === 'black' && row >= 6)) {
          bonusValue += 50;
        }
      }
      
      // Calculate total value for this piece
      const totalValue = materialValue + positionValue + bonusValue;
      
      // Add to score (positive for white, negative for black)
      if (piece.color === 'white') {
        score += totalValue;
      } else {
        score -= totalValue;
      }
    }
  }
  
  // Check bonus/penalty
  if (isInCheck(board, 'black', gameState)) {
    score += 50; // Bonus for putting black in check
  }
  if (isInCheck(board, 'white', gameState)) {
    score -= 50; // Penalty for white being in check
  }
  
  return score;
};

// Find all valid moves for a player
const findAllValidMoves = (board, color, gameState) => {
  const moves = [];
  
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
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
  
  // Sort moves to improve alpha-beta pruning efficiency
  // Try captures first
  moves.sort((a, b) => {
    const targetA = board[a.toRow][a.toCol];
    const targetB = board[b.toRow][b.toCol];
    
    // Prioritize captures of high-value pieces
    const captureValueA = targetA ? pieceValues[targetA.type] : 0;
    const captureValueB = targetB ? pieceValues[targetB.type] : 0;
    
    return captureValueB - captureValueA;
  });
  
  return moves;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (board, depth, alpha, beta, maximizingPlayer, gameState, startTime, maxTime) => {
  // Check if we've exceeded the time limit
  if (Date.now() - startTime > maxTime) {
    throw new Error("Time limit exceeded");
  }
  
  // Check for terminal states
  if (isCheckmate(board, 'white', gameState)) {
    return -10000;
  }
  if (isCheckmate(board, 'black', gameState)) {
    return 10000;
  }
  if (isStalemate(board, 'white', gameState) || isStalemate(board, 'black', gameState)) {
    return 0;
  }
  
  // If we've reached the maximum depth, evaluate the board
  if (depth === 0) {
    return evaluateBoard(board, gameState);
  }
  
  // Get the hash for the current position
  const boardHash = getBoardHash(board);
  const cacheKey = `${boardHash}-${depth}-${maximizingPlayer}`;
  
  // Check if we've already evaluated this position
  if (evaluationCache.has(cacheKey)) {
    return evaluationCache.get(cacheKey);
  }
  
  const color = maximizingPlayer ? 'white' : 'black';
  const moves = findAllValidMoves(board, color, gameState);
  
  // If no valid moves, it's either checkmate or stalemate
  if (moves.length === 0) {
    if (isInCheck(board, color, gameState)) {
      return maximizingPlayer ? -10000 : 10000; // Checkmate
    } else {
      return 0; // Stalemate
    }
  }
  
  let bestValue = maximizingPlayer ? -Infinity : Infinity;
  
  for (const move of moves) {
    const { fromRow, fromCol, toRow, toCol } = move;
    
    // Make the move
    const { board: newBoard, gameState: newGameState } = makeMove(
      board, fromRow, fromCol, toRow, toCol, gameState
    );
    
    // Recursively evaluate the position
    const value = minimax(
      newBoard, 
      depth - 1, 
      alpha, 
      beta, 
      !maximizingPlayer, 
      newGameState,
      startTime,
      maxTime
    );
    
    // Update the best value
    if (maximizingPlayer) {
      bestValue = Math.max(bestValue, value);
      alpha = Math.max(alpha, bestValue);
    } else {
      bestValue = Math.min(bestValue, value);
      beta = Math.min(beta, bestValue);
    }
    
    // Alpha-beta pruning
    if (beta <= alpha) {
      break;
    }
  }
  
  // Cache the result
  evaluationCache.set(cacheKey, bestValue);
  checkCacheSize();
  
  return bestValue;
};

// Iterative deepening search
const iterativeDeepeningSearch = (board, color, gameState, maxDepth, maxTime) => {
  const startTime = Date.now();
  let bestMove = null;
  
  // Get all valid moves
  const moves = findAllValidMoves(board, color, gameState);
  
  // If only one move is available, return it immediately
  if (moves.length === 1) {
    return moves[0];
  }
  
  // Try increasing depths until we run out of time or reach maxDepth
  for (let depth = 1; depth <= maxDepth; depth++) {
    let currentBestMove = null;
    let currentBestScore = color === 'white' ? -Infinity : Infinity;
    
    try {
      for (const move of moves) {
        const { fromRow, fromCol, toRow, toCol } = move;
        
        // Make the move
        const { board: newBoard, gameState: newGameState } = makeMove(
          board, fromRow, fromCol, toRow, toCol, gameState
        );
        
        // Evaluate the position
        const score = minimax(
          newBoard, 
          depth - 1, 
          -Infinity, 
          Infinity, 
          color === 'black', // If color is black, next player is white (maximizing)
          newGameState,
          startTime,
          maxTime
        );
        
        // Update the best move
        if ((color === 'white' && score > currentBestScore) || 
            (color === 'black' && score < currentBestScore)) {
          currentBestScore = score;
          currentBestMove = move;
        }
      }
      
      // Update the overall best move if we completed this depth
      bestMove = currentBestMove;
      
      // If we found a winning move, return it immediately
      if ((color === 'white' && currentBestScore > 9000) || 
          (color === 'black' && currentBestScore < -9000)) {
        break;
      }
    } catch (error) {
      // If we ran out of time, use the best move from the previous depth
      if (error.message === "Time limit exceeded") {
        console.log(`Completed depth ${depth - 1}`);
        break;
      } else {
        throw error; // Re-throw other errors
      }
    }
    
    // Check if we're running out of time
    if (Date.now() - startTime > maxTime * 0.8) {
      console.log(`Completed depth ${depth}`);
      break;
    }
  }
  
  return bestMove;
};

// Export a function that matches the getAIMove signature
export const getAIMove = (board, color, gameState, difficulty) => {
  try {
    // Set parameters based on difficulty
    let maxDepth, maxTime;
    
    switch (difficulty) {
      case 'easy':
        maxDepth = 2;
        maxTime = 1000; // 1 second
        break;
      case 'medium':
        maxDepth = 3;
        maxTime = 2000; // 2 seconds
        break;
      case 'hard':
        maxDepth = 4;
        maxTime = 3000; // 3 seconds
        break;
      default:
        maxDepth = 3;
        maxTime = 2000;
    }
    
    // Add randomness for easier difficulties
    const randomChance = difficulty === 'easy' ? 0.3 : (difficulty === 'medium' ? 0.1 : 0);
    if (Math.random() < randomChance) {
      const moves = findAllValidMoves(board, color, gameState);
      if (moves.length > 0) {
        return moves[Math.floor(Math.random() * moves.length)];
      }
    }
    
    // Use iterative deepening to find the best move
    return iterativeDeepeningSearch(board, color, gameState, maxDepth, maxTime);
  } catch (error) {
    console.error("Error in AI move calculation:", error);
    
    // Fallback to a simple random move
    try {
      const moves = findAllValidMoves(board, color, gameState);
      if (moves.length > 0) {
        return moves[Math.floor(Math.random() * moves.length)];
      }
    } catch (fallbackError) {
      console.error("Error in fallback move generation:", fallbackError);
    }
    
    return null;
  }
}; 
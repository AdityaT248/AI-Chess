import { 
  // eslint-disable-next-line no-unused-vars
  makeMove, 
  isValidMove, 
  // eslint-disable-next-line no-unused-vars
  isInCheck, 
  // eslint-disable-next-line no-unused-vars
  isCheckmate, 
  // eslint-disable-next-line no-unused-vars
  isStalemate,
  cloneBoard
} from './chessLogic';

// Piece values for evaluation (standard chess values)
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
  'king_middlegame': [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ],
  'king_endgame': [
    [-50, -40, -30, -20, -20, -30, -40, -50],
    [-30, -20, -10, 0, 0, -10, -20, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -30, 0, 0, 0, 0, -30, -30],
    [-50, -30, -30, -30, -30, -30, -30, -50]
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

// Check if we're in the endgame (simplified)
const isEndgame = (board) => {
  let pieceCount = 0;
  let queenCount = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type !== 'king' && piece.type !== 'pawn') {
        pieceCount++;
        if (piece.type === 'queen') {
          queenCount++;
        }
      }
    }
  }
  
  // Endgame if few pieces remain or no queens
  return pieceCount <= 6 || queenCount === 0;
};

// Evaluate the board position
const evaluateBoard = (board, gameState) => {
  // Check for checkmate or stalemate
  if (isCheckmate(board, 'black', gameState)) {
    return 100000; // White wins
  }
  if (isCheckmate(board, 'white', gameState)) {
    return -100000; // Black wins
  }
  if (isStalemate(board, 'white', gameState) || isStalemate(board, 'black', gameState)) {
    return 0; // Draw
  }
  
  let score = 0;
  const endgame = isEndgame(board);
  
  // Material and position evaluation
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      // Base material value
      const materialValue = pieceValues[piece.type];
      
      // Position value
      let positionValue = 0;
      if (piece.type === 'king') {
        // Use different tables for king in middlegame vs endgame
        const table = endgame ? 'king_endgame' : 'king_middlegame';
        positionValue = piece.color === 'white' 
          ? positionBonus[table][row][col] 
          : positionBonus[table][7 - row][col];
      } else {
        positionValue = piece.color === 'white' 
          ? positionBonus[piece.type][row][col] 
          : positionBonus[piece.type][7 - row][col];
      }
      
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
        
        // Penalty for doubled pawns
        let doubledPawns = 0;
        for (let r = 0; r < 8; r++) {
          if (r !== row && board[r][col] && 
              board[r][col].type === 'pawn' && 
              board[r][col].color === piece.color) {
            doubledPawns++;
          }
        }
        bonusValue -= doubledPawns * 20;
        
        // Bonus for protected pawns
        const direction = piece.color === 'white' ? 1 : -1;
        if ((col > 0 && board[row + direction] && board[row + direction][col - 1] && 
             board[row + direction][col - 1].type === 'pawn' && 
             board[row + direction][col - 1].color === piece.color) ||
            (col < 7 && board[row + direction] && board[row + direction][col + 1] && 
             board[row + direction][col + 1].type === 'pawn' && 
             board[row + direction][col + 1].color === piece.color)) {
          bonusValue += 10;
        }
      }
      
      // Rook bonuses
      if (piece.type === 'rook') {
        // Bonus for rooks on open files
        let openFile = true;
        for (let r = 0; r < 8; r++) {
          if (board[r][col] && board[r][col].type === 'pawn') {
            openFile = false;
            break;
          }
        }
        if (openFile) {
          bonusValue += 25;
        }
        
        // Bonus for rooks on 7th rank
        if ((piece.color === 'white' && row === 1) || (piece.color === 'black' && row === 6)) {
          bonusValue += 30;
        }
      }
      
      // Bishop pair bonus
      if (piece.type === 'bishop') {
        let hasPair = false;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (r !== row || c !== col) {
              if (board[r][c] && board[r][c].type === 'bishop' && board[r][c].color === piece.color) {
                hasPair = true;
                break;
              }
            }
          }
          if (hasPair) break;
        }
        if (hasPair) {
          bonusValue += 30;
        }
      }
      
      // King safety
      if (piece.type === 'king' && !endgame) {
        // Penalty for exposed king
        if (isInCheck(board, piece.color)) {
          bonusValue -= 50;
        }
        
        // Bonus for castled king
        if ((piece.color === 'white' && (col <= 2 || col >= 6) && row === 7) ||
            (piece.color === 'black' && (col <= 2 || col >= 6) && row === 0)) {
          bonusValue += 60;
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
  if (isInCheck(board, 'black')) {
    score += 50; // Bonus for putting black in check
  }
  if (isInCheck(board, 'white')) {
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
  // Try captures, checks, and promotions first
  moves.sort((a, b) => {
    const pieceA = board[a.fromRow][a.fromCol];
    const pieceB = board[b.fromRow][b.fromCol];
    const targetA = board[a.toRow][a.toCol];
    const targetB = board[b.toRow][b.toCol];
    
    // Prioritize captures of high-value pieces
    const captureValueA = targetA ? pieceValues[targetA.type] : 0;
    const captureValueB = targetB ? pieceValues[targetB.type] : 0;
    
    // Prioritize pawn promotions
    const promotionA = pieceA.type === 'pawn' && (a.toRow === 0 || a.toRow === 7) ? 1000 : 0;
    const promotionB = pieceB.type === 'pawn' && (b.toRow === 0 || b.toRow === 7) ? 1000 : 0;
    
    return (captureValueB + promotionB) - (captureValueA + promotionA);
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
    return -100000;
  }
  if (isCheckmate(board, 'black', gameState)) {
    return 100000;
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
    if (isInCheck(board, color)) {
      return maximizingPlayer ? -100000 : 100000; // Checkmate
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
  let bestScore = color === 'white' ? -Infinity : Infinity;
  
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
      bestScore = currentBestScore;
      
      // If we found a winning move, return it immediately
      if ((color === 'white' && bestScore > 90000) || 
          (color === 'black' && bestScore < -90000)) {
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
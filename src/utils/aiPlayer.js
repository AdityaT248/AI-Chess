import { 
  // eslint-disable-next-line no-unused-vars
  makeMove, 
  isValidMove, 
  // eslint-disable-next-line no-unused-vars
  isInCheck, 
  // eslint-disable-next-line no-unused-vars
  isCheckmate, 
  // eslint-disable-next-line no-unused-vars
  isStalemate 
} from './chessLogic';

// Piece values for evaluation
const pieceValues = {
  'pawn': 10,
  'knight': 30,
  'bishop': 30,
  'rook': 50,
  'queen': 90,
  'king': 900
};

// Position bonuses to encourage good piece placement
const positionBonus = {
  'pawn': [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  'knight': [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5]
  ],
  'bishop': [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2]
  ],
  'rook': [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 1, 1, 1, 1, 1, 1, 0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [0, 0, 0, 0.5, 0.5, 0, 0, 0]
  ],
  'queen': [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-1, 0, 0.5, 0, 0, 0, 0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
  ],
  'king': [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2, 2, 0, 0, 0, 0, 2, 2],
    [2, 3, 1, 0, 0, 1, 3, 2]
  ]
};

// Memoization cache for position evaluation
const evaluationCache = new Map();
const MAX_CACHE_SIZE = 1000;

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

// Evaluate a single move
const evaluateMove = (board, move, gameState) => {
  const { fromRow, fromCol, toRow, toCol } = move;
  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];
  
  let score = 0;
  
  // Capture value
  if (targetPiece) {
    score += pieceValues[targetPiece.type] * 2; // Prioritize captures
  }
  
  // Position improvement
  const currentPositionValue = positionBonus[piece.type][piece.color === 'white' ? fromRow : 7 - fromRow][fromCol];
  const newPositionValue = positionBonus[piece.type][piece.color === 'white' ? toRow : 7 - toRow][toCol];
  score += (newPositionValue - currentPositionValue) * 0.5;
  
  // Center control bonus
  const centerDistance = Math.abs(3.5 - toRow) + Math.abs(3.5 - toCol);
  score += (7 - centerDistance) * 0.2;
  
  // Pawn advancement bonus
  if (piece.type === 'pawn') {
    const advancementBonus = piece.color === 'white' ? (7 - toRow) : toRow;
    score += advancementBonus * 0.5;
    
    // Bonus for pawns near promotion
    if ((piece.color === 'white' && toRow <= 1) || (piece.color === 'black' && toRow >= 6)) {
      score += 5;
    }
  }
  
  // Avoid moving the king early in the game
  if (piece.type === 'king') {
    score -= 2;
  }
  
  // Encourage development of knights and bishops early
  if ((piece.type === 'knight' || piece.type === 'bishop') && 
      ((piece.color === 'white' && fromRow === 7) || (piece.color === 'black' && fromRow === 0))) {
    score += 1;
  }
  
  return score;
};

// Knight move offsets for faster move generation
const knightOffsets = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
];

// Directional offsets for sliding pieces (bishop, rook, queen)
const directions = {
  bishop: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
  rook: [[-1, 0], [0, -1], [0, 1], [1, 0]],
  queen: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
};

// Generate moves for a specific piece - optimized for speed
const generatePieceMoves = (board, row, col, gameState) => {
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves = [];
  
  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      
      // Move forward one square
      if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
        moves.push({ fromRow: row, fromCol: col, toRow: row + direction, toCol: col, isCapture: false });
        
        // Move forward two squares from starting position
        if (!piece.hasMoved && 
            row + 2 * direction >= 0 && row + 2 * direction < 8 && 
            !board[row + direction][col] && !board[row + 2 * direction][col]) {
          moves.push({ fromRow: row, fromCol: col, toRow: row + 2 * direction, toCol: col, isCapture: false });
        }
      }
      
      // Capture diagonally
      for (const colOffset of [-1, 1]) {
        if (col + colOffset >= 0 && col + colOffset < 8 && row + direction >= 0 && row + direction < 8) {
          // Normal capture
          if (board[row + direction][col + colOffset] && 
              board[row + direction][col + colOffset].color !== piece.color) {
            moves.push({ 
              fromRow: row, 
              fromCol: col, 
              toRow: row + direction, 
              toCol: col + colOffset, 
              isCapture: true 
            });
          }
          
          // En passant capture
          if (!board[row + direction][col + colOffset] && gameState.enPassantTarget &&
              row + direction === gameState.enPassantTarget.row && 
              col + colOffset === gameState.enPassantTarget.col) {
            moves.push({ 
              fromRow: row, 
              fromCol: col, 
              toRow: row + direction, 
              toCol: col + colOffset, 
              isCapture: true,
              isEnPassant: true
            });
          }
        }
      }
      break;
    }
    
    case 'knight': {
      for (const [rowOffset, colOffset] of knightOffsets) {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];
          if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push({ 
              fromRow: row, 
              fromCol: col, 
              toRow: newRow, 
              toCol: newCol, 
              isCapture: !!targetPiece 
            });
          }
        }
      }
      break;
    }
    
    case 'bishop':
    case 'rook':
    case 'queen': {
      const dirs = directions[piece.type];
      
      for (const [rowDir, colDir] of dirs) {
        let newRow = row + rowDir;
        let newCol = col + colDir;
        
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];
          
          if (!targetPiece) {
            moves.push({ 
              fromRow: row, 
              fromCol: col, 
              toRow: newRow, 
              toCol: newCol, 
              isCapture: false 
            });
          } else {
            if (targetPiece.color !== piece.color) {
              moves.push({ 
                fromRow: row, 
                fromCol: col, 
                toRow: newRow, 
                toCol: newCol, 
                isCapture: true 
              });
            }
            break; // Stop in this direction after hitting a piece
          }
          
          newRow += rowDir;
          newCol += colDir;
        }
      }
      break;
    }
    
    case 'king': {
      // Regular king moves
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) continue;
          
          const newRow = row + rowOffset;
          const newCol = col + colOffset;
          
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetPiece = board[newRow][newCol];
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ 
                fromRow: row, 
                fromCol: col, 
                toRow: newRow, 
                toCol: newCol, 
                isCapture: !!targetPiece 
              });
            }
          }
        }
      }
      
      // Castling
      if (!piece.hasMoved && gameState.castlingRights) {
        const castlingRights = gameState.castlingRights[piece.color];
        
        // Kingside castling
        if (castlingRights && castlingRights.kingSide && 
            !board[row][col + 1] && !board[row][col + 2] &&
            board[row][col + 3] && board[row][col + 3].type === 'rook' && 
            !board[row][col + 3].hasMoved) {
          moves.push({ 
            fromRow: row, 
            fromCol: col, 
            toRow: row, 
            toCol: col + 2, 
            isCapture: false,
            isCastling: true,
            castlingSide: 'kingside'
          });
        }
        
        // Queenside castling
        if (castlingRights && castlingRights.queenSide && 
            !board[row][col - 1] && !board[row][col - 2] && !board[row][col - 3] &&
            board[row][col - 4] && board[row][col - 4].type === 'rook' && 
            !board[row][col - 4].hasMoved) {
          moves.push({ 
            fromRow: row, 
            fromCol: col, 
            toRow: row, 
            toCol: col - 2, 
            isCapture: false,
            isCastling: true,
            castlingSide: 'queenside'
          });
        }
      }
      break;
    }
    
    default:
      // No moves for unknown piece types
      break;
  }
  
  return moves;
};

// Generate all valid moves for a player - optimized version
const generateMoves = (board, color, gameState) => {
  const moves = [];
  const candidateMoves = [];
  
  // First, collect all candidate moves without checking if they're valid
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const pieceMoves = generatePieceMoves(board, row, col, gameState);
        candidateMoves.push(...pieceMoves);
      }
    }
  }
  
  // Then filter out moves that would leave the king in check
  for (const move of candidateMoves) {
    const { fromRow, fromCol, toRow, toCol } = move;
    if (isValidMove(board, fromRow, fromCol, toRow, toCol, gameState)) {
      moves.push(move);
    }
  }
  
  return moves;
};

// Find the best move using a simple greedy algorithm
export const findBestMove = (board, color, gameState, difficulty = 'medium') => {
  // Generate all valid moves
  let moves = generateMoves(board, color, gameState);
  
  // If no valid moves, return null
  if (moves.length === 0) {
    return null;
  }
  
  // If only one move is available, return it immediately
  if (moves.length === 1) {
    return moves[0];
  }
  
  // Add randomness based on difficulty
  const randomChance = difficulty === 'easy' ? 0.3 : (difficulty === 'medium' ? 0.15 : 0.05);
  if (Math.random() < randomChance) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }
  
  // Check if we have this position cached
  const boardHash = getBoardHash(board);
  const cacheKey = `${boardHash}-${color}-${difficulty}`;
  
  if (evaluationCache.has(cacheKey)) {
    return evaluationCache.get(cacheKey);
  }
  
  // Evaluate each move
  const evaluatedMoves = moves.map(move => {
    const score = evaluateMove(board, move, gameState);
    return { ...move, score };
  });
  
  // Sort moves by score (descending for white, ascending for black)
  evaluatedMoves.sort((a, b) => {
    return color === 'white' ? b.score - a.score : a.score - b.score;
  });
  
  // Add some randomness to the top moves based on difficulty
  const topMovesCount = difficulty === 'easy' ? 5 : (difficulty === 'medium' ? 3 : 2);
  const topMoves = evaluatedMoves.slice(0, Math.min(topMovesCount, evaluatedMoves.length));
  
  // Select a random move from the top moves
  const selectedIndex = Math.floor(Math.random() * topMoves.length);
  const bestMove = topMoves[selectedIndex];
  
  // Cache the result
  evaluationCache.set(cacheKey, bestMove);
  checkCacheSize();
  
  return bestMove;
};

// Export a function that matches the getAIMove signature from chessLogic
export const getAIMove = (board, color, gameState, difficulty) => {
  return findBestMove(board, color, gameState, difficulty);
}; 
// Chess piece types and their values
const PIECE_VALUES = {
  'pawn': 1,
  'knight': 3,
  'bishop': 3,
  'rook': 5,
  'queen': 9,
  'king': 0 // King has no material value for evaluation
};

// Initialize the chess board with pieces in their starting positions
export const initializeBoard = () => {
  const board = Array(8).fill().map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black', hasMoved: false };
    board[6][col] = { type: 'pawn', color: 'white', hasMoved: false };
  }
  
  // Set up rooks
  board[0][0] = { type: 'rook', color: 'black', hasMoved: false };
  board[0][7] = { type: 'rook', color: 'black', hasMoved: false };
  board[7][0] = { type: 'rook', color: 'white', hasMoved: false };
  board[7][7] = { type: 'rook', color: 'white', hasMoved: false };
  
  // Set up knights
  board[0][1] = { type: 'knight', color: 'black', hasMoved: false };
  board[0][6] = { type: 'knight', color: 'black', hasMoved: false };
  board[7][1] = { type: 'knight', color: 'white', hasMoved: false };
  board[7][6] = { type: 'knight', color: 'white', hasMoved: false };
  
  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'black', hasMoved: false };
  board[0][5] = { type: 'bishop', color: 'black', hasMoved: false };
  board[7][2] = { type: 'bishop', color: 'white', hasMoved: false };
  board[7][5] = { type: 'bishop', color: 'white', hasMoved: false };
  
  // Set up queens
  board[0][3] = { type: 'queen', color: 'black', hasMoved: false };
  board[7][3] = { type: 'queen', color: 'white', hasMoved: false };
  
  // Set up kings
  board[0][4] = { type: 'king', color: 'black', hasMoved: false };
  board[7][4] = { type: 'king', color: 'white', hasMoved: false };
  
  return board;
};

// Deep clone the board to avoid mutation
export const cloneBoard = (board) => {
  return JSON.parse(JSON.stringify(board));
};

// Find the position of the king for a given color
export const findKing = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

// Check if a square is under attack by the opponent
export const isSquareUnderAttack = (board, row, col, attackerColor) => {
  // Check attacks from pawns
  const pawnDirection = attackerColor === 'white' ? -1 : 1;
  if (row - pawnDirection >= 0 && row - pawnDirection < 8) {
    if (col - 1 >= 0) {
      const piece = board[row - pawnDirection][col - 1];
      if (piece && piece.type === 'pawn' && piece.color === attackerColor) {
        return true;
      }
    }
    if (col + 1 < 8) {
      const piece = board[row - pawnDirection][col + 1];
      if (piece && piece.type === 'pawn' && piece.color === attackerColor) {
        return true;
      }
    }
  }
  
  // Check attacks from knights
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [rowOffset, colOffset] of knightMoves) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const piece = board[newRow][newCol];
      if (piece && piece.type === 'knight' && piece.color === attackerColor) {
        return true;
      }
    }
  }
  
  // Check attacks from bishops, rooks, and queens
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1],
    [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  
  for (const [rowDir, colDir] of directions) {
    let newRow = row + rowDir;
    let newCol = col + colDir;
    
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const piece = board[newRow][newCol];
      
      if (piece) {
        if (piece.color === attackerColor) {
          if (piece.type === 'queen' ||
              (piece.type === 'bishop' && Math.abs(rowDir) === Math.abs(colDir)) ||
              (piece.type === 'rook' && (rowDir === 0 || colDir === 0))) {
            return true;
          }
          
          // King can attack adjacent squares
          if (piece.type === 'king' && 
              Math.abs(newRow - row) <= 1 && 
              Math.abs(newCol - col) <= 1) {
            return true;
          }
        }
        break; // Stop checking in this direction if we hit any piece
      }
      
      newRow += rowDir;
      newCol += colDir;
    }
  }
  
  return false;
};

// Check if the king of the given color is in check
export const isInCheck = (board, color, gameState) => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  
  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(board, kingPos.row, kingPos.col, opponentColor);
};

// Check if a move would leave the king in check
const wouldBeInCheck = (board, fromRow, fromCol, toRow, toCol, color, gameState) => {
  // Make the move on a cloned board
  const newBoard = cloneBoard(board);
  const piece = newBoard[fromRow][fromCol];
  
  // Handle en passant capture
  if (piece.type === 'pawn' && fromCol !== toCol && !newBoard[toRow][toCol] && 
      gameState && gameState.enPassantTarget &&
      toRow === gameState.enPassantTarget.row && toCol === gameState.enPassantTarget.col) {
    // Remove the captured pawn
    const capturedPawnRow = color === 'white' ? toRow + 1 : toRow - 1;
    newBoard[capturedPawnRow][toCol] = null;
  }
  
  // Handle castling
  if (piece.type === 'king' && Math.abs(fromCol - toCol) === 2) {
    // Kingside castling
    if (toCol > fromCol) {
      newBoard[toRow][toCol - 1] = newBoard[toRow][7]; // Move rook
      newBoard[toRow][7] = null; // Remove rook from original position
    } 
    // Queenside castling
    else {
      newBoard[toRow][toCol + 1] = newBoard[toRow][0]; // Move rook
      newBoard[toRow][0] = null; // Remove rook from original position
    }
  }
  
  // Make the move
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  
  // Check if the king is in check after the move
  return isInCheck(newBoard, color, gameState);
};

// Check if a move is valid
export const isValidMove = (board, fromRow, fromCol, toRow, toCol, gameState) => {
  // Check if the coordinates are valid
  if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
      toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false;
  }
  
  // Check if there is a piece at the starting position
  const piece = board[fromRow][fromCol];
  if (!piece) {
    return false;
  }
  
  // Check if the destination has a piece of the same color
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }
  
  // Prevent capturing the king
  if (targetPiece && targetPiece.type === 'king') {
    return false;
  }
  
  // Check piece-specific movement rules
  let isValid = false;
  
  switch (piece.type) {
    case 'pawn':
      isValid = isValidPawnMove(board, fromRow, fromCol, toRow, toCol, gameState);
      break;
    case 'knight':
      isValid = isValidKnightMove(fromRow, fromCol, toRow, toCol);
      break;
    case 'bishop':
      isValid = isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'rook':
      isValid = isValidRookMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'queen':
      isValid = isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
      break;
    case 'king':
      isValid = isValidKingMove(board, fromRow, fromCol, toRow, toCol, gameState);
      break;
    default:
      isValid = false;
  }
  
  // If the move is valid according to piece rules, check if it would leave the king in check
  if (isValid) {
    // Check if the king would be in check after the move
    if (wouldBeInCheck(board, fromRow, fromCol, toRow, toCol, piece.color, gameState)) {
      return false;
    }
  }
  
  return isValid;
};

// Check if a pawn move is valid
const isValidPawnMove = (board, fromRow, fromCol, toRow, toCol, gameState) => {
  const piece = board[fromRow][fromCol];
  const direction = piece.color === 'white' ? -1 : 1;
  
  // Moving forward one square
  if (fromCol === toCol && toRow === fromRow + direction && !board[toRow][toCol]) {
    return true;
  }
  
  // Moving forward two squares from starting position
  if (fromCol === toCol && 
      ((piece.color === 'white' && fromRow === 6) || (piece.color === 'black' && fromRow === 1)) && 
      toRow === fromRow + 2 * direction &&
      !board[fromRow + direction][fromCol] && !board[toRow][toCol]) {
    return true;
  }
  
  // Capturing diagonally
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
    // Normal capture
    if (board[toRow][toCol] && board[toRow][toCol].color !== piece.color) {
      return true;
    }
    
    // En passant capture
    if (!board[toRow][toCol] && gameState && gameState.enPassantTarget &&
        toRow === gameState.enPassantTarget.row && toCol === gameState.enPassantTarget.col) {
      return true;
    }
  }
  
  return false;
};

// Check if a rook move is valid
const isValidRookMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Rooks move horizontally or vertically
  if (fromRow !== toRow && fromCol !== toCol) return false;
  
  // Check if path is clear
  if (fromRow === toRow) {
    // Horizontal move
    const start = Math.min(fromCol, toCol);
    const end = Math.max(fromCol, toCol);
    for (let col = start + 1; col < end; col++) {
      if (board[fromRow][col]) return false;
    }
  } else {
    // Vertical move
    const start = Math.min(fromRow, toRow);
    const end = Math.max(fromRow, toRow);
    for (let row = start + 1; row < end; row++) {
      if (board[row][fromCol]) return false;
    }
  }
  
  return true;
};

// Check if a knight move is valid
const isValidKnightMove = (fromRow, fromCol, toRow, toCol) => {
  // Knights move in an L-shape: 2 squares in one direction and 1 square perpendicular
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

// Check if a bishop move is valid
const isValidBishopMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Bishops move diagonally
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  
  if (rowDiff !== colDiff) return false;
  
  // Check if path is clear
  const rowDirection = fromRow < toRow ? 1 : -1;
  const colDirection = fromCol < toCol ? 1 : -1;
  
  for (let i = 1; i < rowDiff; i++) {
    if (board[fromRow + i * rowDirection][fromCol + i * colDirection]) return false;
  }
  
  return true;
};

// Check if a queen move is valid
const isValidQueenMove = (board, fromRow, fromCol, toRow, toCol) => {
  // Queens can move like rooks or bishops
  return isValidRookMove(board, fromRow, fromCol, toRow, toCol) || 
         isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
};

// Check if a king move is valid
const isValidKingMove = (board, fromRow, fromCol, toRow, toCol, gameState) => {
  const piece = board[fromRow][fromCol];
  
  // Kings move one square in any direction
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  
  // Normal king move
  if (rowDiff <= 1 && colDiff <= 1) {
    return true;
  }
  
  // Castling
  if (rowDiff === 0 && colDiff === 2 && !piece.hasMoved && !isInCheck(board, piece.color, gameState)) {
    // Kingside castling
    if (toCol > fromCol) {
      const rook = board[fromRow][7];
      if (rook && rook.type === 'rook' && rook.color === piece.color && !rook.hasMoved) {
        // Check if squares between king and rook are empty
        if (!board[fromRow][5] && !board[fromRow][6]) {
          // Check if king passes through or ends up on a square under attack
          const opponentColor = piece.color === 'white' ? 'black' : 'white';
          if (!isSquareUnderAttack(board, fromRow, 5, opponentColor) &&
              !isSquareUnderAttack(board, fromRow, 6, opponentColor)) {
            return true;
          }
        }
      }
    }
    // Queenside castling
    else {
      const rook = board[fromRow][0];
      if (rook && rook.type === 'rook' && rook.color === piece.color && !rook.hasMoved) {
        // Check if squares between king and rook are empty
        if (!board[fromRow][1] && !board[fromRow][2] && !board[fromRow][3]) {
          // Check if king passes through or ends up on a square under attack
          const opponentColor = piece.color === 'white' ? 'black' : 'white';
          if (!isSquareUnderAttack(board, fromRow, 2, opponentColor) &&
              !isSquareUnderAttack(board, fromRow, 3, opponentColor)) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
};

// Check if a pawn can be promoted
export const isPawnPromotion = (piece, toRow) => {
  if (!piece || piece.type !== 'pawn') return false;
  
  // White pawns promote on row 0, black pawns on row 7
  return (piece.color === 'white' && toRow === 0) || (piece.color === 'black' && toRow === 7);
};

// Make a move on the board
export const makeMove = (board, fromRow, fromCol, toRow, toCol, gameState, promotionPiece = null) => {
  // Create a deep copy of the board and game state
  const newBoard = JSON.parse(JSON.stringify(board));
  const newGameState = JSON.parse(JSON.stringify(gameState || { enPassantTarget: null, castlingRights: { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } } }));
  
  const piece = newBoard[fromRow][fromCol];
  const targetPiece = newBoard[toRow][toCol];
  let capturedPiece = targetPiece;
  
  // Handle castling
  if (piece.type === 'king' && Math.abs(fromCol - toCol) === 2) {
    // Kingside castling
    if (toCol > fromCol) {
      newBoard[toRow][toCol - 1] = newBoard[toRow][7]; // Move rook
      newBoard[toRow][toCol - 1].hasMoved = true; // Mark rook as moved
      newBoard[toRow][7] = null; // Remove rook from original position
    } 
    // Queenside castling
    else {
      newBoard[toRow][toCol + 1] = newBoard[toRow][0]; // Move rook
      newBoard[toRow][toCol + 1].hasMoved = true; // Mark rook as moved
      newBoard[toRow][0] = null; // Remove rook from original position
    }
  }
  
  // Handle en passant capture
  if (piece.type === 'pawn' && fromCol !== toCol && !targetPiece) {
    // This is a diagonal move without a target piece, must be en passant
    const captureRow = fromRow; // The pawn to be captured is on the same row as the moving pawn
    capturedPiece = newBoard[captureRow][toCol]; // Store the captured pawn
    newBoard[captureRow][toCol] = null; // Capture the pawn that just moved
  }
  
  // Update en passant target
  newGameState.enPassantTarget = null;
  if (piece.type === 'pawn' && Math.abs(fromRow - toRow) === 2) {
    const direction = piece.color === 'white' ? -1 : 1;
    newGameState.enPassantTarget = { row: fromRow + direction, col: fromCol };
  }
  
  // Update castling rights
  if (piece.type === 'king') {
    newGameState.castlingRights[piece.color].kingSide = false;
    newGameState.castlingRights[piece.color].queenSide = false;
  } else if (piece.type === 'rook') {
    if (fromRow === 7 && fromCol === 0 && piece.color === 'white') {
      newGameState.castlingRights.white.queenSide = false;
    } else if (fromRow === 7 && fromCol === 7 && piece.color === 'white') {
      newGameState.castlingRights.white.kingSide = false;
    } else if (fromRow === 0 && fromCol === 0 && piece.color === 'black') {
      newGameState.castlingRights.black.queenSide = false;
    } else if (fromRow === 0 && fromCol === 7 && piece.color === 'black') {
      newGameState.castlingRights.black.kingSide = false;
    }
  }
  
  // Handle pawn promotion
  if (piece.type === 'pawn' && isPawnPromotion(piece, toRow) && promotionPiece) {
    // Create a new piece of the specified type
    newBoard[toRow][toCol] = { type: promotionPiece, color: piece.color, hasMoved: true };
  } else {
    // Regular move
    newBoard[toRow][toCol] = piece;
    newBoard[toRow][toCol].hasMoved = true; // Mark the piece as moved
  }
  
  // Remove the piece from its original position
  newBoard[fromRow][fromCol] = null;
  
  return { board: newBoard, gameState: newGameState, capturedPiece };
};

// Check if a player is in checkmate
export const isCheckmate = (board, color, gameState) => {
  // If the king is not in check, it's not checkmate
  if (!isInCheck(board, color, gameState)) {
    return false;
  }
  
  // Check if any legal move exists
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, fromRow, fromCol, toRow, toCol, gameState)) {
              // If any legal move exists, it's not checkmate
              return false;
            }
          }
        }
      }
    }
  }
  
  // If no legal move exists and the king is in check, it's checkmate
  return true;
};

// Check if a player is in stalemate
export const isStalemate = (board, color, gameState) => {
  // If the king is in check, it's not stalemate
  if (isInCheck(board, color, gameState)) {
    return false;
  }
  
  // Check if any legal move exists
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, fromRow, fromCol, toRow, toCol, gameState)) {
              // If any legal move exists, it's not stalemate
              return false;
            }
          }
        }
      }
    }
  }
  
  // If no legal move exists and the king is not in check, it's stalemate
  return true;
};

// Evaluate the board position (for AI)
const evaluateBoard = (board, gameState) => {
  let score = 0;
  
  // Material evaluation
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        
        // Add positional bonuses
        let positionalValue = 0;
        
        // Pawns: encourage advancement and center control
        if (piece.type === 'pawn') {
          // Advancement bonus
          const advancementBonus = piece.color === 'white' ? (7 - row) * 0.1 : row * 0.1;
          positionalValue += advancementBonus;
          
          // Center control bonus
          if ((col === 3 || col === 4) && (row === 3 || row === 4)) {
            positionalValue += 0.2;
          }
        }
        
        // Knights: bonus for being near the center
        if (piece.type === 'knight') {
          const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
          positionalValue += (4 - centerDistance) * 0.1;
        }
        
        // Bishops: bonus for controlling diagonals
        if (piece.type === 'bishop') {
          // Count available diagonal moves as a proxy for bishop activity
          let diagonalMoves = 0;
          const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
          
          for (const [rowDir, colDir] of directions) {
            let newRow = row + rowDir;
            let newCol = col + colDir;
            
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
              if (!board[newRow][newCol]) {
                diagonalMoves++;
              } else {
                break;
              }
              newRow += rowDir;
              newCol += colDir;
            }
          }
          
          positionalValue += diagonalMoves * 0.05;
        }
        
        // Rooks: bonus for open files
        if (piece.type === 'rook') {
          let openFile = true;
          for (let r = 0; r < 8; r++) {
            if (r !== row && board[r][col] && board[r][col].type === 'pawn' && 
                board[r][col].color === piece.color) {
              openFile = false;
              break;
            }
          }
          
          if (openFile) {
            positionalValue += 0.3;
          }
        }
        
        // King safety: penalize exposed king in the middle
        if (piece.type === 'king') {
          // In the opening and middlegame, the king should stay in a corner
          const centerDistance = Math.min(
            Math.abs(0 - row) + Math.abs(0 - col),
            Math.abs(0 - row) + Math.abs(7 - col),
            Math.abs(7 - row) + Math.abs(0 - col),
            Math.abs(7 - row) + Math.abs(7 - col)
          );
          
          positionalValue += centerDistance * 0.1;
        }
        
        const totalValue = value + positionalValue;
        
        if (piece.color === 'white') {
          score += totalValue;
        } else {
          score -= totalValue;
        }
      }
    }
  }
  
  // Check and checkmate evaluation
  if (isCheckmate(board, 'black', gameState)) {
    score += 1000; // White wins
  } else if (isCheckmate(board, 'white', gameState)) {
    score -= 1000; // Black wins
  } else {
    if (isInCheck(board, 'black', gameState)) {
      score += 0.5; // Black is in check
    }
    if (isInCheck(board, 'white', gameState)) {
      score -= 0.5; // White is in check
    }
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
  
  return moves;
};

// Minimax algorithm for AI with alpha-beta pruning
const minimax = (board, depth, alpha, beta, isMaximizing, gameState) => {
  if (depth === 0) {
    return evaluateBoard(board, gameState);
  }
  
  // Check for terminal states
  if (isCheckmate(board, 'white', gameState)) {
    return -1000 - depth; // Black wins, prefer quicker checkmate
  }
  if (isCheckmate(board, 'black', gameState)) {
    return 1000 + depth; // White wins, prefer quicker checkmate
  }
  if (isStalemate(board, 'white', gameState) || isStalemate(board, 'black', gameState)) {
    return 0; // Draw
  }
  
  if (isMaximizing) {
    // White's turn (maximizing)
    let maxEval = -Infinity;
    const moves = findAllValidMoves(board, 'white', gameState);
    
    for (const move of moves) {
      const { fromRow, fromCol, toRow, toCol } = move;
      const { board: newBoard, gameState: newGameState } = makeMove(board, fromRow, fromCol, toRow, toCol, gameState);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, newGameState);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return maxEval;
  } else {
    // Black's turn (minimizing)
    let minEval = Infinity;
    const moves = findAllValidMoves(board, 'black', gameState);
    
    for (const move of moves) {
      const { fromRow, fromCol, toRow, toCol } = move;
      const { board: newBoard, gameState: newGameState } = makeMove(board, fromRow, fromCol, toRow, toCol, gameState);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, newGameState);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    
    return minEval;
  }
};

// Get the best move for the AI
export const getAIMove = (board, color, gameState) => {
  const moves = findAllValidMoves(board, color, gameState);
  if (moves.length === 0) return null;
  
  let bestMove = null;
  let bestValue = color === 'white' ? -Infinity : Infinity;
  
  // For black (AI), we want to minimize the score
  const isMaximizing = color === 'white';
  
  // Sort moves to improve alpha-beta pruning efficiency
  // Try capturing moves first
  moves.sort((a, b) => {
    const aCapture = board[a.toRow][a.toCol] !== null ? 1 : 0;
    const bCapture = board[b.toRow][b.toCol] !== null ? 1 : 0;
    return bCapture - aCapture;
  });
  
  for (const move of moves) {
    const { fromRow, fromCol, toRow, toCol } = move;
    const { board: newBoard, gameState: newGameState } = makeMove(board, fromRow, fromCol, toRow, toCol, gameState);
    
    // Use a limited depth for performance (can be increased for stronger AI)
    // Deeper depth for captures to reduce horizon effect
    const isCapture = board[toRow][toCol] !== null;
    const searchDepth = isCapture ? 3 : 2;
    
    const value = minimax(newBoard, searchDepth, -Infinity, Infinity, !isMaximizing, newGameState);
    
    if ((isMaximizing && value > bestValue) || (!isMaximizing && value < bestValue)) {
      bestValue = value;
      bestMove = move;
    }
  }
  
  return bestMove;
}; 
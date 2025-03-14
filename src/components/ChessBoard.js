import React, { useMemo, memo } from 'react';
import './ChessBoard.css';

// Import SVG pieces
import whitePawn from '../assets/pieces/white-pawn.svg';
import whiteRook from '../assets/pieces/white-rook.svg';
import whiteKnight from '../assets/pieces/white-knight.svg';
import whiteBishop from '../assets/pieces/white-bishop.svg';
import whiteQueen from '../assets/pieces/white-queen.svg';
import whiteKing from '../assets/pieces/white-king.svg';
import blackPawn from '../assets/pieces/black-pawn.svg';
import blackRook from '../assets/pieces/black-rook.svg';
import blackKnight from '../assets/pieces/black-knight.svg';
import blackBishop from '../assets/pieces/black-bishop.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import blackKing from '../assets/pieces/black-king.svg';

// Map piece types to SVG images - moved outside component for better performance
const pieceImages = {
  'white': {
    'pawn': whitePawn,
    'rook': whiteRook,
    'knight': whiteKnight,
    'bishop': whiteBishop,
    'queen': whiteQueen,
    'king': whiteKing
  },
  'black': {
    'pawn': blackPawn,
    'rook': blackRook,
    'knight': blackKnight,
    'bishop': blackBishop,
    'queen': blackQueen,
    'king': blackKing
  }
};

// Memoized Square component for better performance
const Square = memo(({ 
  row, 
  col, 
  piece, 
  isLight, 
  isSelected, 
  isHighlighted, 
  isCheck, 
  isLastMove, 
  isHint, 
  squareColor, 
  onClick 
}) => {
  let squareClassName = `square ${isLight ? 'light' : 'dark'}`;
  if (isSelected) squareClassName += ' selected';
  if (isHighlighted) squareClassName += ' highlighted';
  if (isCheck) squareClassName += ' check';
  if (isLastMove) squareClassName += ' last-move';
  if (isHint) squareClassName += ' hint';
  
  const squareStyle = {
    backgroundColor: squareColor
  };
  
  return (
    <div 
      className={squareClassName}
      style={squareStyle}
      onClick={onClick}
    >
      {piece && !piece.captured && (
        <img 
          src={pieceImages[piece.color][piece.type]} 
          alt={`${piece.color} ${piece.type}`} 
          className={`piece ${piece.color}`}
        />
      )}
    </div>
  );
});

// Memoized coordinates component
const Coordinates = memo(() => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  return (
    <div className="board-coordinates">
      <div className="files">
        {files.map(file => (
          <div key={file}>{file}</div>
        ))}
      </div>
      <div className="ranks">
        {ranks.map(rank => (
          <div key={rank}>{rank}</div>
        ))}
      </div>
    </div>
  );
});

// Memoized captured pieces component
const CapturedPieces = memo(({ capturedPieces, color }) => {
  const capturedByOpponent = color === 'white' ? capturedPieces.black : capturedPieces.white;
  
  if (capturedByOpponent.length === 0) return null;
  
  return (
    <div className="captured-row">
      {capturedByOpponent.map((piece, index) => (
        <img 
          key={index}
          src={pieceImages[piece.color][piece.type]} 
          alt={`${piece.color} ${piece.type}`} 
          className="captured-piece"
        />
      ))}
    </div>
  );
});

const ChessBoard = ({ 
  board, 
  selectedPiece, 
  onSquareClick, 
  highlightedSquares, 
  checkIndicator,
  lastMove,
  hintMove,
  theme
}) => {
  // Calculate captured pieces - memoized for performance
  const capturedPieces = useMemo(() => {
    const captured = {
      white: [],
      black: []
    };
    
    board.flat().forEach(piece => {
      if (piece && piece.captured) {
        captured[piece.color].push(piece);
      }
    });
    
    return captured;
  }, [board]);

  // Check if a square is highlighted (valid move) - memoized lookup map
  const highlightedSquaresMap = useMemo(() => {
    const map = {};
    highlightedSquares.forEach(square => {
      map[`${square.row}-${square.col}`] = true;
    });
    return map;
  }, [highlightedSquares]);
  
  // Check if a square is part of the last move - memoized
  const lastMoveMap = useMemo(() => {
    if (!lastMove) return {};
    
    const { from, to } = lastMove;
    return {
      [`${from.row}-${from.col}`]: true,
      [`${to.row}-${to.col}`]: true
    };
  }, [lastMove]);
  
  // Check if a square is part of a hint - memoized
  const hintSquareMap = useMemo(() => {
    if (!hintMove) return {};
    
    const { fromRow, fromCol, toRow, toCol } = hintMove;
    return {
      [`${fromRow}-${fromCol}`]: true,
      [`${toRow}-${toCol}`]: true
    };
  }, [hintMove]);

  // Render the board - memoized for performance
  const boardRows = useMemo(() => {
    const squares = [];
    
    // Define these functions inside the useMemo callback to avoid dependency issues
    const isHighlighted = (row, col) => {
      return !!highlightedSquaresMap[`${row}-${col}`];
    };
    
    const isLastMove = (row, col) => {
      return !!lastMoveMap[`${row}-${col}`];
    };
    
    const isHintSquare = (row, col) => {
      return !!hintSquareMap[`${row}-${col}`];
    };
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        const isLight = (row + col) % 2 === 0;
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
        const isCheck = checkIndicator && piece && piece.type === 'king' && piece.color === checkIndicator;
        
        squares.push(
          <Square 
            key={`${row}-${col}`}
            row={row}
            col={col}
            piece={piece}
            isLight={isLight}
            isSelected={isSelected}
            isHighlighted={isHighlighted(row, col)}
            isCheck={isCheck}
            isLastMove={isLastMove(row, col)}
            isHint={isHintSquare(row, col)}
            squareColor={isLight ? theme.lightSquare : theme.darkSquare}
            onClick={() => onSquareClick(row, col)}
          />
        );
      }
    }
    
    return squares;
  }, [board, selectedPiece, checkIndicator, theme, onSquareClick, highlightedSquaresMap, lastMoveMap, hintSquareMap]);

  // Apply theme styles
  const containerStyle = useMemo(() => ({
    background: theme.boardBg,
    '--highlight-color': theme.highlightColor,
    '--check-color': theme.checkColor,
    '--last-move-color': theme.lastMoveColor,
    '--accent-color': theme.accentColor
  }), [theme]);

  return (
    <div className="chess-board-container" style={containerStyle}>
      <div className="chess-board">
        {boardRows}
      </div>
      <Coordinates />
      <div className="captured-pieces">
        <CapturedPieces capturedPieces={capturedPieces} color="white" />
        <CapturedPieces capturedPieces={capturedPieces} color="black" />
      </div>
    </div>
  );
};

export default memo(ChessBoard); 
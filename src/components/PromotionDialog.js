import React from 'react';
import './PromotionDialog.css';

// Import SVG pieces
import whiteQueen from '../assets/pieces/white-queen.svg';
import whiteRook from '../assets/pieces/white-rook.svg';
import whiteBishop from '../assets/pieces/white-bishop.svg';
import whiteKnight from '../assets/pieces/white-knight.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import blackRook from '../assets/pieces/black-rook.svg';
import blackBishop from '../assets/pieces/black-bishop.svg';
import blackKnight from '../assets/pieces/black-knight.svg';

const PromotionDialog = ({ position, color, onSelect, onCancel }) => {
  const pieceImages = {
    'white': {
      'queen': whiteQueen,
      'rook': whiteRook,
      'bishop': whiteBishop,
      'knight': whiteKnight
    },
    'black': {
      'queen': blackQueen,
      'rook': blackRook,
      'bishop': blackBishop,
      'knight': blackKnight
    }
  };

  const pieces = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="promotion-dialog-backdrop" onClick={onCancel}>
      <div 
        className="promotion-dialog" 
        style={{ 
          top: position.y, 
          left: position.x 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="promotion-title">Promote to:</div>
        <div className="promotion-options">
          {pieces.map(piece => (
            <div 
              key={piece} 
              className="promotion-piece" 
              onClick={() => onSelect(piece)}
            >
              <img 
                src={pieceImages[color][piece]} 
                alt={`${color} ${piece}`} 
                className="promotion-piece-image"
              />
              <div className="promotion-piece-name">{piece}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog; 
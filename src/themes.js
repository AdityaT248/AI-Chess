// Chess board themes
const themes = {
  // Classic wooden theme
  classic: {
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    highlightColor: 'rgba(78, 205, 196, 0.7)',
    checkColor: 'rgba(255, 107, 107, 0.6)',
    lastMoveColor: 'rgba(255, 209, 102, 0.4)',
    boardBg: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
    accentColor: '#4ecdc4'
  },
  
  // Blue theme
  blue: {
    name: 'Ocean Blue',
    lightSquare: '#dee3e6',
    darkSquare: '#8ca2ad',
    highlightColor: 'rgba(106, 168, 79, 0.7)',
    checkColor: 'rgba(244, 67, 54, 0.6)',
    lastMoveColor: 'rgba(255, 193, 7, 0.4)',
    boardBg: 'linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(13, 71, 161, 0.9))',
    accentColor: '#03a9f4'
  },
  
  // Dark theme
  dark: {
    name: 'Midnight',
    lightSquare: '#6b7987',
    darkSquare: '#2e3947',
    highlightColor: 'rgba(121, 134, 203, 0.7)',
    checkColor: 'rgba(255, 82, 82, 0.6)',
    lastMoveColor: 'rgba(255, 215, 64, 0.4)',
    boardBg: 'linear-gradient(135deg, rgba(20, 20, 31, 0.9), rgba(10, 10, 18, 0.9))',
    accentColor: '#9c27b0'
  },
  
  // Green theme
  green: {
    name: 'Forest',
    lightSquare: '#eeeed2',
    darkSquare: '#769656',
    highlightColor: 'rgba(119, 149, 86, 0.7)',
    checkColor: 'rgba(255, 97, 97, 0.6)',
    lastMoveColor: 'rgba(255, 213, 79, 0.4)',
    boardBg: 'linear-gradient(135deg, rgba(27, 94, 32, 0.9), rgba(46, 125, 50, 0.9))',
    accentColor: '#8bc34a'
  },
  
  // Coral theme
  coral: {
    name: 'Coral',
    lightSquare: '#fce4ec',
    darkSquare: '#f06292',
    highlightColor: 'rgba(128, 203, 196, 0.7)',
    checkColor: 'rgba(255, 82, 82, 0.6)',
    lastMoveColor: 'rgba(255, 202, 40, 0.4)',
    boardBg: 'linear-gradient(135deg, rgba(216, 27, 96, 0.9), rgba(142, 36, 170, 0.9))',
    accentColor: '#00bcd4'
  }
};

export default themes; 
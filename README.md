# AI Chess

A beautiful, modern chess application with an AI opponent built using React.

![AI Chess Screenshot](screenshot.png)

## Features

- Play chess against an AI with adjustable difficulty levels
- Multiple board themes to customize your experience
- Visual move highlighting and hints
- Captured pieces display
- Move history and game analysis
- Pawn promotion
- Check and checkmate detection
- Responsive design for all devices

## Technologies Used

- React
- JavaScript/ES6
- CSS3 with animations and responsive design
- Minimax algorithm with alpha-beta pruning for AI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-chess.git
   cd ai-chess
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```
npm run build
```

This builds the app for production to the `build` folder.

## How to Play

1. Select the AI difficulty level (Easy, Medium, or Hard)
2. Choose your preferred board theme
3. You play as White, and the AI plays as Black
4. Click on a piece to see valid moves
5. Click on a highlighted square to move your piece
6. Use the "Hint" button if you need help with your next move
7. Use the "New Game" button to start a new game

## AI Implementation

The AI uses the Minimax algorithm with alpha-beta pruning to determine the best move. The search depth varies based on the selected difficulty:

- Easy: 1-ply search depth
- Medium: 2-ply search depth
- Hard: 3-ply search depth

The evaluation function considers:
- Material value
- Piece positioning
- Check and checkmate states

## Author

Created by Aditya Thakkar

## License

This project is licensed under the MIT License - see the LICENSE file for details. # AI-Chess

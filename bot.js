const {Move} = require('./board');

class Bot {

  /**
   * @constructor
   * @param {Board} board
   * @param {'black' | 'white'} color
   */
  constructor(board, color, maxDepth) {
    this.board = board;
    this.color = color;
    this.maxDepth = maxDepth || 2;
  }

  minimizeScoreBlack(board, depth) {

  }

  maximizeScoreWhite(board, depth) {

    let bestMoves = [];
    let bestEvaluation = -Number.MAX_SAFE_INTEGER;

    const legalMoves = board.getLegalMoves();

    for (const legalMove of legalMoves) {
      const tempBoard = board.copy();
      tempBoard.move(legalMove);
      const evaluation = tempBoard.evaluatePosition();
      if (evaluation > bestEvaluation) {
        bestEvaluation = evaluation;
        bestMoves = [legalMove];
      } else if (evaluation === bestEvaluation) {
        bestMoves.push(legalMove);
      }
    }

    if (depth >= this.maxDepth) {
      // or win?
      return bestEvaluation;
    }

    return this.minimizeScoreBlack(board, depth);

  }

  /**
   *
   * @return {Move} - move found by the bot
   */
  async getMove() {

    if (this.color === 'white') {
      this.maximizeScoreWhite(this.board, 2);
    } else {
      this.minimizeScoreBlack(this.board, 2)
    }

    const legalMoves = this.board.getLegalMoves();

    let bestMoves = [];
    let bestEvaluation;
    if (this.color === 'white') {
      bestEvaluation = -Number.MAX_SAFE_INTEGER;
    } else {
      bestEvaluation = Number.MAX_SAFE_INTEGER
    }

    for (const legalMove of legalMoves) {
      const tempBoard = this.board.copy();
      tempBoard.move(legalMove);
      const evaluation = tempBoard.evaluatePosition();
      if (this.color === 'white') {
        if (evaluation > bestEvaluation) {
          bestEvaluation = evaluation;
          bestMoves = [legalMove];
        } else if (evaluation === bestEvaluation) {
          bestMoves.push(legalMove);
        }
      } else {
        if (evaluation < bestEvaluation) {
          bestEvaluation = evaluation;
          bestMoves = [legalMove];
        } else if (evaluation === bestEvaluation) {
          bestMoves.push(legalMove);
        }
      }
    }

    if (bestMoves.length === 0) {
      console.log(this.color)
      process.exit(1)
      throw new Error('game over?');
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }
}

module.exports = {Bot};

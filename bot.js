const {Move} = require('./board');

class PositionTree {
  constructor(board, color) {
    this.children = [];
    this.board = board;
    this.color = color;
  }

  evaluateLevel() {
    const legalMoves = this.board.getLegalMoves(this.color);
    for (const legalMove of legalMoves) {
      const node = new PositionTree(this.board.moveCopy(legalMove), this.color === 'white' ? 'black' : 'white');
      this.children.push(node);
    }
  };
}

class Bot {

  /**
   * @constructor
   * @param {Board} board
   * @param {'black' | 'white'} color
   */
  constructor(board, color) {
    this.board = board;
    this.color = color;
  }

  /**
   *
   * @return {Move} - move found by the bot
   */
  async getMove() {

    const legalMoves = this.board.getLegalMoves(this.color);

    let bestMoves = [];
    let bestEvaluation;
    if (this.color === 'white') {
      bestEvaluation = -Number.MAX_SAFE_INTEGER;
    } else {
      bestEvaluation = Number.MAX_SAFE_INTEGER
    }

    for (const legalMove of legalMoves) {
      const tempBoard = this.board.copy();
      tempBoard.move(legalMove, this.color);
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

    // for (const legalMove of legalMoves) {
    //   // const tempBoard = this.board.moveCopy(legalMove);
    //   this.board.move(legalMove, this.color);
    //   console.log(this.board.evaluatePosition());
    //   this.children.push(legalMove);
    // }

    // const positionTree = new PositionTree(this.board);
    // positionTree.buildLevel();
    //
    // for (const num of [1,2,3,4]) {
    //   for (const node of positionTree.children) {
    //     node.
    //   }
    // }

    if (bestMoves.length === 0) {
      console.log(this.color)
      process.exit(1)
      throw new Error('game over?');
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }
}

module.exports = {Bot};

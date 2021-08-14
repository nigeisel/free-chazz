const {Move} = require('./board');

class PositionTree {
  constructor(board, color) {
    this.children = [];
    this.board = board;
    this.color = color;
  }

  buildLevel() {
    const legalMoves = this.board.getLegalMoves(this.color);
    for (const legalMove of legalMoves) {
      // const tempBoard = this.board.moveCopy(legalMove);
      this.children.push(legalMove);
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

    if (legalMoves.length === 0) {
      throw new Error('game over?');
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }
}

module.exports = {Bot};

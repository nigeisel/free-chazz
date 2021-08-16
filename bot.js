// const {Move} = require('./board');

class Bot {

  /**
   * @constructor
   * @param {Board} board
   * @param {'black' | 'white'} color
   */
  constructor(board, color, maxDepth) {
    this.board = board;
    this.color = color;
    this.maxDepth = maxDepth || 5;
  }

  // maximize(board, depth) {
  //   if (depth >= this.maxDepth) {
  //     return board.evaluatePosition();
  //   }
  //
  //   const boards = board.getLegalMoves().map((move) => {
  //     const tempBoard = board.copy();
  //     tempBoard.move(move);
  //     return tempBoard;
  //   });
  //
  //   return Math.max(...boards.map((board) => this.minimize(board, ++depth)));
  // }

  maximize(board, move, depth) {
    // TODO return infinity on win, zero on stalemate
    // TODO a-b pruning
    // TODO monitor performance + and optimize, use multiple cores, measure time.
    // TODO return multiple equal moves

    this.nodesVisited++;
    let tempBoard = board;
    if (move) {
      tempBoard = board.copy();
      tempBoard.move(move);
    }

    if (depth >= this.maxDepth) {
      return {move: move, score: tempBoard.evaluatePosition()};
    }

    depth++;
    const maxResult = tempBoard.getLegalMoves()
        .map(move => this.minimize(tempBoard, move, depth))
        .reduce((prev, curr) => prev.score > curr.score ? prev : curr);

    return {move: move || maxResult.move, score: maxResult.score}
  }

  minimize(board, move, depth) {
    this.nodesVisited++;

    let tempBoard = board;
    if (move) {
      tempBoard = board.copy();
      tempBoard.move(move);
    }

    if (depth >= this.maxDepth) {
      return {move: move, score: tempBoard.evaluatePosition()};
    }

    depth++;
    const minResult = tempBoard.getLegalMoves()
        .map(move => this.maximize(tempBoard, move, depth))
        .reduce((prev, curr) => prev.score < curr.score ? prev : curr);

    return {move: move || minResult.move, score: minResult.score}
  }

  getMoveImproved() {
    this.nodesVisited = 0;
    if (this.color === 'white') {
      return this.maximize(this.board, null,1).move;
    } else {
      return this.minimize(this.board, null,1).move;
    }
  }

  /**
   *
   * @return {Move} - move found by the bot
   */
  async getMove() {

    // if (this.color === 'white') {
    //   this.maximizeScoreWhite(this.board, 2);
    // } else {
    //   this.minimizeScoreBlack(this.board, 2)
    // }

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

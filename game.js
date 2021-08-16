const {Board, Move} = require('./board');
const {Bot} = require('./bot');

class Game {
  constructor() {
    this.board = new Board();
    this.board.print();
    this.gameOver = false;

    this.bot = new Bot(this.board, 'black');
    this.bot2 = new Bot(this.board, 'white');
  }

  makeMove(move) {
    if (this.board.isLegal(move)) {
      this.board.move(move);
    } else {
      throw new Error('Illegal Move.');
    }
  }

  /**
   *
   * @return {Promise<Move>}
   */
  async waitForMove() {

    await new Promise(resolve => setTimeout(resolve, 500));
    if (this.board.colorTurn === 'white') {
      // const readline = require('readline');
      //
      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout
      // });
      //
      // return new Promise((resolve, reject) => {
      //   rl.question(this.board.colorTurn + '\'s move: ', (move) => {
      //     rl.close();
      //     try {
      //       const moveParsed = Move.parse(move);
      //       return resolve(moveParsed);
      //     } catch (err) {
      //       return reject(err);
      //     }
      //   });
      // });
      return this.bot2.getMove();
    } else {
      return this.bot.getMove();
    }

  }

  async start() {
    do {
      try {
        const move = await this.waitForMove();
        this.makeMove(move);
        this.board.print();
        console.log(this.board.evaluatePosition());
      } catch (err) {
        console.warn(err);
      }
    } while (!this.board.isGameOver().gameOver);
  }
}

module.exports = {Game};

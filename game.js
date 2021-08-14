const {Board, Move} = require('./board');
const {Bot} = require('./bot');

class Game {
  constructor() {
    const {Square} = require('./board');

    this.board = new Board();
    this.board.print();
    let piece1 = this.board.getPiece(Square.parse('B1'));

    const test = this.board.copy();
    test.print();
    let piece2 = test.getPiece(Square.parse('B1'));
    this.colorTurn = 'white';
    this.gameOver = false;

    this.bot = new Bot(this.board, 'black');
    this.bot2 = new Bot(this.board, 'white');
  }

  makeMove(move) {
    this.board.move(move, this.colorTurn);
    this.colorTurn = this.colorTurn === 'white' ? 'black' : 'white';
  }

  /**
   *
   * @return {Promise<Move>}
   */
  async waitForMove() {

    await new Promise(resolve => setTimeout(resolve, 0));
    if (this.colorTurn === 'white') {
      const readline = require('readline');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve, reject) => {
        rl.question(this.colorTurn + '\'s move: ', (move) => {
          rl.close();
          try {
            const moveParsed = Move.parse(move);
            return resolve(moveParsed);
          } catch (err) {
            return reject(err);
          }
        });
      });
      // return this.bot2.getMove();
    } else {
      return this.bot.getMove();
    }

  }

  async start() {
    while (!this.gameOver) {

      try {
        const move = await this.waitForMove();
        this.makeMove(move);
        this.board.print();
        console.log(this.board.evaluatePosition());
      } catch (err) {
        console.warn(err);
      }
    }
  }
}

module.exports = {Game};

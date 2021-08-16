let moveFrom = null;
let canvas, ctx;

function setup() {
  canvas = document.getElementById("board");
  ctx = canvas.getContext("2d");

  const game = new Game();

  game.board.draw(ctx, canvas.width);

  canvas.addEventListener('mousedown', function(event) {
    const square = game.board.getSquare(...getRealMousePos(canvas, event), canvas.width);
    if (square) {
      moveFrom = square;
    }
  });

  canvas.addEventListener('mouseup', function(event) {
    const square = game.board.getSquare(...getRealMousePos(canvas, event), canvas.width);
    if (square && moveFrom && !moveFrom.equals(square)) {
      const move = new Move(moveFrom, square);
      game.makeMove(move);
    } else {
      moveFrom = null;
    }
  });
}

function getRealMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return [x, y];
}

class Game {
  constructor() {
    this.board = new Board();
    this.blackBot = new Bot(this.board, 'black');
  }

  makeMove(move) {
    if (this.board.isLegal(move)) {
      this.board.move(move);
      this.board.draw(ctx, canvas.width);

      if (this.board.colorTurn === 'black') {
        const botMove = this.blackBot.getMoveImproved();
        console.log(this.blackBot.nodesVisited)
        this.board.move(botMove);
        this.board.draw(ctx, canvas.width);
      }

    } else {
      throw new Error('Illegal Move.');
    }
  }

}

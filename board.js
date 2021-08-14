const terminalColorCodes = {
  blackPiece: '\u001b[38;5;236m',
  whitePiece: '\u001b[38;5;252m',
  blackSquare: '\u001b[48;5;94m',
  whiteSquare: '\u001b[48;5;178m',
  resetCode: '\u001b[0m',
}

class Board {
  #piecesByColorAndField = {
    white: {},
    black: {},
  }

  constructor(empty) {

    if (!empty) {
      this.#piecesByColorAndField['white']['A1'] = new Rook('white');
      this.#piecesByColorAndField['white']['B1'] = new Knight('white');
      this.#piecesByColorAndField['white']['C1'] = new Bishop('white');
      this.#piecesByColorAndField['white']['D1'] = new Queen('white');
      this.#piecesByColorAndField['white']['E1'] = new King('white');
      this.#piecesByColorAndField['white']['F1'] = new Bishop('white');
      this.#piecesByColorAndField['white']['G1'] = new Knight('white');
      this.#piecesByColorAndField['white']['H1'] = new Rook('white');
      this.#piecesByColorAndField['white']['A2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['B2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['C2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['D2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['E2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['F2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['G2'] = new Pawn('white');
      this.#piecesByColorAndField['white']['H2'] = new Pawn('white');

      this.#piecesByColorAndField['black']['A8'] = new Rook('black');
      this.#piecesByColorAndField['black']['B8'] = new Knight('black');
      this.#piecesByColorAndField['black']['C8'] = new Bishop('black');
      this.#piecesByColorAndField['black']['D8'] = new Queen('black');
      this.#piecesByColorAndField['black']['E8'] = new King('black');
      this.#piecesByColorAndField['black']['F8'] = new Bishop('black');
      this.#piecesByColorAndField['black']['G8'] = new Knight('black');
      this.#piecesByColorAndField['black']['H8'] = new Rook('black');
      this.#piecesByColorAndField['black']['A7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['B7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['C7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['D7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['E7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['F7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['G7'] = new Pawn('black');
      this.#piecesByColorAndField['black']['H7'] = new Pawn('black');
    }

  }

  /**
   * Returns the piece that is currently on the passed square of the board
   *
   * @param square the square of the piece
   * @return {Piece|null|undefined} Piece if square is occupied, null if square is empty,
   *                                undefined if square is out of bounds of the chess board
   */
  getPiece(square) {
    if (!square.isInBoard()) {
      return undefined;
    }

    return this.#piecesByColorAndField['white'][square.toString()] ||
        this.#piecesByColorAndField['black'][square.toString()] ||
        null;
  }

  print() {
    // TODO clear before each reprint: https://nodejs.org/api/readline.html#readline_readline_clearline_stream_dir_callback

    const files = Array.from({ length: 8 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
    const ranks = Array.from({ length: 8 }, (max, i) => (i + 1).toString()).reverse();

    let squareColor = 'white';
    for (const rank of ranks) {
      process.stdout.write(rank + ' ');
      for (const file of files) {
        const square = Square.parse(file, rank);
        const piece = this.getPiece(square);

        if (squareColor === 'black') {
          process.stdout.write(terminalColorCodes.blackSquare);
          squareColor = 'white';
        } else {
          process.stdout.write(terminalColorCodes.whiteSquare);
          squareColor = 'black';
        }
        if (!piece) {
          process.stdout.write('   ');
        } else {
          process.stdout.write(' ');
          piece.print();
          process.stdout.write(' ');
        }
        process.stdout.write(terminalColorCodes.resetCode);
      }
      squareColor = squareColor === 'black' ? 'white' : 'black';
      process.stdout.write('\n');
    }

    process.stdout.write('  ');
    for (const letter of files) {
      process.stdout.write(' ' + letter + ' ');
    }

    process.stdout.write('\n');
  }

  /**
   * returns numerical value representing the material on the board
   * @return {number} negative if black has material advantage, positive if white has material advantage
   */
  evaluatePosition() {
    const sumWhitePieces = Object.values(this.#piecesByColorAndField['white'])
        .reduce((combined, current) => combined + current.value, 0);
    const sumBlackPieces = Object.values(this.#piecesByColorAndField['black'])
        .reduce((combined, current) => combined + current.value, 0);
    return sumWhitePieces - sumBlackPieces;
  }

  /**
   * Returns a list of all legal moves for a color in the current position
   *
   * @param {'white' | 'black'} color
   * @return {Array.<Move>} list of legal moves
   */
  getLegalMoves(color) {
    return Object.entries(this.#piecesByColorAndField[color])
      .flatMap(([square, piece]) =>
          piece.getLegalMoves(this, Square.parse(square)));
  }

  /**
   * Return if the move is legal
   *
   * @param {Move} triedMove
   * @param {'black' | 'white'} color
   * @return {Boolean} true if the move is legal in current position
   */
  isLegal(triedMove, color) {
    if (!triedMove) {
      console.log('s')
    }
    const piece = this.getPiece(triedMove.from);
    if (piece.color !== color) {
      return false;
    }

    return piece
        .getLegalMoves(this, triedMove.from)
        .some((legalMove) => {
          return legalMove.equals(triedMove)
        });
  }

  /**
   * Execute a move
   *
   * @throws {Error} if the move is not legal
   * @param {Move} move
   * @param {'black' | 'white'} color
   */
  move(move, color) {
    if (!this.isLegal(move, color)) {
      throw new Error('Illegal Move.');
    }

    this.#piecesByColorAndField[color][move.to.toString()] = this.#piecesByColorAndField[color][move.from.toString()];

    delete this.#piecesByColorAndField[color][move.from.toString()];

    if (this.#piecesByColorAndField[color === 'white' ? 'black' : 'white'][move.to.toString()]) {
      delete this.#piecesByColorAndField[color === 'white' ? 'black' : 'white'][move.to.toString()];
    }

  }

  /**
   * return a copy of this board
   *
   * @return {Board} - deep copy of this instance
   */
  copy() {
    const board = new Board(true);
    for (const [square, whitePiece] of Object.entries(this.#piecesByColorAndField['white'])) {
      board.#piecesByColorAndField['white'][square] = whitePiece.copy();
    }
    for (const [square, blackPiece] of Object.entries(this.#piecesByColorAndField['black'])) {
      board.#piecesByColorAndField['black'][square] = blackPiece.copy();
    }

    return board;
  }

  /**
   *
   * @param move
   * @param color
   * @return {Board} copy of the board with the move executed
   */
  moveOnCopy(move, color) {
    const board = this.copy();
    board.move(move, color);
    return board;
  }
}

class Move {
  /**
   * @constructor
   * @param {Square} from Move piece from this square
   * @param {Square} to Move piece to this square
   * @param {Object?} options
   * @param {Boolean?} options.capture true if this move captures opponents piece
   * @param {Boolean?} options.enPassant true if this move captures via en passant rule
   * @param {Piece?} options.promotionTo if set to a piece, a pawn will be promoted to this piece in this move
   * @param {Boolean?} options.check true if this move checks the opponents king
   * @param {Boolean?} options.checkMate true if this move checkmates the opponents king / ends the game
   */
  constructor(from, to, options) {
    this.from = from;
    this.to = to;
    this.capture = options && options.capture;
    this.enPassant = options && options.enPassant;
    this.promotionTo = options && options.promotionTo;
    this.check = options && options.check;
    this.checkMate = options && options.checkMate;
  }

  /**
   * Check whether two moves are the same
   *
   * @param {Move} move
   * @return {Boolean} true if both moves describe the same move
   */
  equals(move) {
    return this.from.equals(move.from)
        && this.to.equals(move.to) &&
        this.promotionTo === move.promotionTo;
  }

  /**
   * parse chess move formatted as algebraic notation, such as Ne3
   *
   * @param move
   * @return {Move} the parsed move
   */
  static parse(move) {
    // TODO implement properly
    const from = Square.parse(move.substr(0, 2));
    const to = Square.parse(move.substr(2, 2));
    return new Move(from, to);
  }
}

class Square {
  /**
   * @constructor
   * @param {string} square string representation of the square, e.g. A1
   * @param {string} file - The file as an Upper case single char, e.g. A-H
   * @param {number} fileNumeric - The file as a number, e.g. 1-8
   * @param {number} rank - the rank as a number. e.g. 1-8
   */
  constructor(square, file, fileNumeric, rank) {
    this.square = square;
    this.file = file;
    this.fileNumeric = fileNumeric;
    this.rank = rank;
  }

  /**
   * Returns whether this is within bounds of the chess board
   * @return {boolean} true if square is within bounds of the chess board
   */
  isInBoard() {
    return (this.rank <= 8 && this.rank >= 1 && this.fileNumeric <= 8 && this.fileNumeric >= 1);
  }

  toString() {
    return this.file + this.rank;
  }

  /**
   * Check whether two squares are the same
   *
   * @param {Square} square
   * @return {Boolean} true if both squares are equal
   */
  equals(square) {
    return this.fileNumeric === square.fileNumeric && this.rank === square.rank;
  }

  /**
   * Parsed different representations of a square, such as 'A1', file: A, rank: 1, or file: 1, rank: 1
   *
   * @param {string | char | number} file Can be a string representation of the Square such as 'A1'
   *                                 or be used together with rank param and represent file only
   *                                 as numeric (1-8) or char (A-H) value
   * @param {number?} rank
   * @returns {Square}
   */
  static parse(file, rank) {
    let fileNumeric;

    if (rank === undefined) {
      if (typeof file !== 'string' || file.length !== 2) {
        throw new Error('Either pass file/rank separately or just the square as a string formatted as "A1", got ' + file);
      }
      rank = file[1];
      file = file[0].toUpperCase();
    }

    rank = parseInt(rank);

    if (!Number.isInteger(rank)) {
      throw new Error('Expects rank to be an Integer such as 1,2,...,8.');
    }

    if (typeof file === 'number') {
      fileNumeric = file;
      file = String.fromCharCode(file + 64);
    } else if (typeof file === 'string') {
      if (file.length !== 1) {
        throw new Error('Unexpected file length. Expects one character such as A,B,...,H')
      }
      file = file.toUpperCase();
      fileNumeric = file.charCodeAt(0) - 64;
    } else {
      throw new Error('Unexpected file type (expects either character or number).')
    }

    return new Square(file + rank, file, fileNumeric, rank);
  }
}

/**
 * Piece
 * @property {Board} board - the board the piece is placed on
 * @property {'black' | 'white'} color - the square the piece is placed on
 * @property {Square} square - the color the piece belongs to
 * @property {Number} value - the numerical value a piece has according to common chess calculations
 */
class Piece {
  /**
   * @constructor
   *
   * @param {'black' | 'white'} color
   */
  constructor(color) {
    this.color = color;
  }

  /**
   * returns a copy of the piece
   * @return {Piece}
   */
  copy() {
    return new this.constructor(this.color);
  }

  /**
   * Return all legal Moves for the Piece in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    throw new Error('Implement in subclass');
  }

  /**
   * return bishop-like indefinite diagonal moves
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  _getDiagonalMoves(board, square) {
    const moves = [];

    for (let moveFile = 1, moveRank = 1;
         square.fileNumeric + moveFile <= 8 && square.rank + moveRank <= 8; moveFile++, moveRank++) {

      const targetSquare = Square.parse(square.fileNumeric + moveFile, square.rank + moveRank);
      const piece = board.getPiece(targetSquare);

      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveFile = -1, moveRank = 1;
         square.fileNumeric + moveFile >= 1 && square.rank + moveRank <= 8; moveFile--, moveRank++) {

      const targetSquare = Square.parse(square.fileNumeric + moveFile, square.rank + moveRank);
      const piece = board.getPiece(targetSquare);

      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveFile = -1, moveRank = -1;
         square.fileNumeric + moveFile >= 1 && square.rank + moveRank >= 1; moveFile--, moveRank--) {

      const targetSquare = Square.parse(square.fileNumeric + moveFile, square.rank + moveRank);
      const piece = board.getPiece(targetSquare);

      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveFile = 1, moveRank = -1;
         square.fileNumeric + moveFile <= 8 && square.rank + moveRank >= 1; moveFile++, moveRank--) {

      const targetSquare = Square.parse(square.fileNumeric + moveFile, square.rank + moveRank);
      const piece = board.getPiece(targetSquare);

      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    return moves;
  }

  /**
   * return rook-like indefinite straight moves
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  _getStraightMoves(board, square) {
    const moves = [];

    for (let moveFile = square.fileNumeric + 1; moveFile <= 8; moveFile++) {
      const targetSquare = Square.parse(moveFile, square.rank);
      const piece = board.getPiece(targetSquare);
      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveFile = square.fileNumeric - 1; moveFile >= 1; moveFile--) {
      const targetSquare = Square.parse(moveFile, square.rank);
      const piece = board.getPiece(targetSquare);
      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveRank = square.rank + 1; moveRank <= 8; moveRank++) {
      const targetSquare = Square.parse(square.fileNumeric, moveRank);
      const piece = board.getPiece(targetSquare);
      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    for (let moveRank = square.rank - 1; moveRank >= 8; moveRank--) {
      const targetSquare = Square.parse(square.fileNumeric, moveRank);
      const piece = board.getPiece(targetSquare);
      if (piece === null) {
        moves.push(new Move(square, targetSquare, {capture: false}));
      } else if (piece.color === this.color) {
        break;
      } else {
        moves.push(new Move(square, targetSquare, {capture: true}));
        break;
      }
    }

    return moves;
  }

  print() {
    throw new Error('implement in subclass');
  }
}

class Pawn extends Piece {

  constructor(color) {
    super(color);
    this.value = 1;
    this.hasMovedLastMove = false;
  }

  copy() {
    const copy = super.copy();
    copy.hasMovedLastMove = this.hasMovedLastMove;
    return copy;
  }

  print() {
    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265F')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265F')
    }
  }

  /**
   * Return all legal Moves for the Pawn in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    const moves = [];

    const moveDir = this.color === 'white' ? 1 : -1;

    const targetSquare = Square.parse(square.fileNumeric, square.rank + moveDir);
    const targetSquareTwoSteps = Square.parse(square.fileNumeric, square.rank + (moveDir * 2));

    if (board.getPiece(targetSquare) === null) {
      moves.push(new Move(square, targetSquare, {capture: false}));

      const hasNotYetMoved =
          (this.color === 'white' && square.rank === 2) ||
          (this.color === 'black' && square.rank === 7)

      if (hasNotYetMoved && board.getPiece(targetSquareTwoSteps) === null) {
        moves.push(new Move(square, targetSquareTwoSteps, {capture: false}));
      }
    }

    const targetSquareCaptureLeft = Square.parse(square.fileNumeric + 1, square.rank + moveDir);
    const targetPieceCaptureLeft = board.getPiece(targetSquareCaptureLeft);

    if (targetPieceCaptureLeft && targetPieceCaptureLeft.color !== this.color) {
      moves.push(new Move(square, targetSquareCaptureLeft, {capture: true}));
    }

    const targetSquareCaptureRight = Square.parse(square.fileNumeric - 1, square.rank + moveDir);
    const targetPieceCaptureRight = board.getPiece(targetSquareCaptureRight);

    if (targetPieceCaptureRight && targetPieceCaptureRight.color !== this.color) {
      moves.push(new Move(square, targetSquareCaptureRight, {capture: true}));
    }

    return moves;

    // TODO en passant, promotion
  }
}

class Bishop extends Piece {

  constructor(color) {
    super(color);
    this.value = 3;
  }

  print() {
    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265D')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265D')
    }
  }

  /**
   * Return all legal Moves for the Bishop in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    return this._getDiagonalMoves(board, square);
  }
}

class Knight extends Piece {

  constructor(color) {
    super(color);
    this.value = 3;
  }

  print() {

    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265E')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265E')
    }
  }

  /**
   * Return all legal Moves for the Knight in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    const moves = [];
    for (const longMove of [-2, 2]) {
      for (const shortMove of [-1, 1]) {

        const targetSquareA = Square.parse(square.fileNumeric + longMove, square.rank + shortMove);
        let piece = board.getPiece(targetSquareA);

        // TODO put in function canBeCaptured? ()
        if (piece !== undefined && (piece === null || piece.color !== this.color)) {
          moves.push(new Move(square, targetSquareA, {capture: piece !== null}));
        }

        const targetSquareB = Square.parse(square.fileNumeric + shortMove, square.rank + longMove);
        piece = board.getPiece(targetSquareB);

        if (piece !== undefined && (piece === null || piece.color !== this.color)) {
          moves.push(new Move(square, targetSquareB, {capture: piece !== null}));
        }
      }
    }

    return moves;
  }
}

class Rook extends Piece {
  constructor(color) {
    super(color);
    this.value = 5;
  }

  print() {
    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265C')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265C')
    }
  }

  /**
   * Return all legal Moves for the Rook in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    return this._getStraightMoves(board, square);
  }
}

class Queen extends Piece {
  constructor(color) {
    super(color);
    this.value = 9;
  }

  print() {
    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265B')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265B')
    }
  }

  /**
   * Return all legal Moves for the Queen in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    return [...this._getDiagonalMoves(board, square),
      ...this._getStraightMoves(board, square)];
  }
}

class King extends Piece {
  constructor(color) {
    super(color);
    this.value = 1000;
  }

  print() {
    if (this.color === 'white') {
      process.stdout.write(terminalColorCodes.whitePiece);
      process.stdout.write('\u265A')
    } else {
      process.stdout.write(terminalColorCodes.blackPiece);
      process.stdout.write('\u265A')
    }
  }

  /**
   * Return all legal Moves for the King in the current position
   *
   * @param {Board} board - the board the piece is on
   * @param {Square} square - the square the piece is on
   * @return {Array.<Move>}
   */
  getLegalMoves(board, square) {
    // TODO implement check
    const moves = []

    const moveRanks = [-1, 0, 1];
    const moveFiles = [-1, 0, 1];

    for (const moveRank of moveRanks) {
      for (const moveFile of moveFiles) {
        if (moveRank === 0 && moveFile === 0) {
          continue;
        }

        const targetSquare = Square.parse(square.fileNumeric + moveFile, square.rank + moveRank);
        const piece = board.getPiece(targetSquare);
        if (piece !== undefined) {
          if (piece === null || piece.color !== this.color) {
            moves.push(new Move(square, targetSquare, {capture: piece !== null}));
          }
        }

      }
    }

    return moves;
  }
}

module.exports = {Board, Move, Square, Piece, Pawn, Bishop, Knight, Rook, Queen, King};

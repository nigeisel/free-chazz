/**
 * Board
 * @property {Object.<string, Piece>} piecesByField - all Pieces currently on the board by their square such as 'A1'
 */
class Board {
    constructor () {
        const pieces = [
            new Rook(this,'white', Square.parse('A1')),
            new Knight(this,'white', Square.parse('B1')),
            new Bishop(this,'white',Square.parse('C1')),
            new Queen(this,'white', Square.parse('D1')),
            new King(this,'white', Square.parse('E1')),
            new Bishop(this,'white',Square.parse('F1')),
            new Knight(this,'white',Square.parse('G1')),
            new Rook(this,'white', Square.parse('H1')),
            new Pawn(this,'white', Square.parse('A2')),
            new Pawn(this,'white', Square.parse('B2')),
            new Pawn(this,'white', Square.parse('C2')),
            new Pawn(this,'white', Square.parse('D2')),
            new Pawn(this,'white', Square.parse('E2')),
            new Pawn(this,'white', Square.parse('F2')),
            new Pawn(this,'white', Square.parse('G2')),
            new Pawn(this,'white', Square.parse('H2')),
            new Rook(this,'black', Square.parse('A8')),
            new Knight(this,'black', Square.parse('B8')),
            new Bishop(this,'black', Square.parse('C8')),
            new Queen(this,'black', Square.parse('D8')),
            new King(this,'black', Square.parse('E8')),
            new Bishop(this,'black', Square.parse('F8')),
            new Knight(this,'black', Square.parse('G8')),
            new Rook(this,'black', Square.parse('H8')),
            new Pawn(this,'black', Square.parse('A7')),
            new Pawn(this,'black', Square.parse('B7')),
            new Pawn(this,'black', Square.parse('C7')),
            new Pawn(this,'black', Square.parse('D7')),
            new Pawn(this,'black', Square.parse('E7')),
            new Pawn(this,'black', Square.parse('F7')),
            new Pawn(this,'black', Square.parse('G7')),
            new Pawn(this,'black', Square.parse('H7')),
        ];

        this.piecesByField = {};
        for (const piece of pieces) {
            this.piecesByField[piece.square.toString()] = piece;
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
        return this.piecesByField[square.toString()] || null;
    }

    print() {
        const files = Array.from({ length: 8 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
        const ranks = Array.from({ length: 8 }, (max, i) => (i + 1).toString()).reverse();

        let color = 'black';
        for (const rank of ranks) {
            process.stdout.write(rank + ' ');
            for (const file of files) {
                const square = file + rank;
                const piece = this.piecesByField[square];

                if (color === 'black') {
                    process.stdout.write('\x1b[44m');
                    color = 'white';
                } else {
                    process.stdout.write('\x1b[47m');
                    color = 'black';
                }
                if (!piece) {
                    process.stdout.write('   ');
                } else {
                    process.stdout.write(' ');
                    piece.print();
                    process.stdout.write(' ');
                }
                process.stdout.write('\x1b[0m');
            }
            color = color === 'black' ? 'white' : 'black';
            process.stdout.write('\n');
        }

        process.stdout.write('  ');
        for (const letter of files) {
            process.stdout.write(' ' + letter + ' ');
        }

    }

    /**
     * Returns a list of all legal moves for a color in the current position
     *
     * @param {'white' | 'black'} color
     * @return {Array.<Move>} list of legal moves
     */
    getLegalMoves(color) {
        const moves = [];
        for (const piece of Object.values(this.piecesByField)) {
            if (piece.color !== color) {
                continue;
            }
            const pieceLegalMoves = piece.getLegalMoves();
            moves.push(...pieceLegalMoves);
        }

        return moves;
    }

    /**
     * Return if the move is legal
     *
     * @param {Move} triedMove
     * @param {'black' | 'white'} color
     * @return {Boolean} true if the move is legal in current position
     */
    isLegal(triedMove, color) {
        const piece = this.getPiece(triedMove.from);
        if (piece.color !== color) {
            return false;
        }
        return piece
            .getLegalMoves()
            .some((legalMove) => legalMove.equals(triedMove));
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

        this.piecesByField[move.to.toString()] = this.piecesByField[move.from.toString()];
        this.piecesByField[move.to.toString()].move(move.to);
        delete this.piecesByField[move.from.toString()];
    }
}

class Piece {
    /**
     * @constructor
     *
     * @param {Board} board
     * @param {'black' | 'white'} color
     * @param {Square} square
     */
    constructor(board, color, square) {
        this.board = board;
        this.color = color;
        this.square = square;
    }

    /**
     * Move piece to a square
     *
     * @param {Square} to
     */
    move(to) {
        this.square = to;
    }

    /**
     * Return all legal Moves for the Piece in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        return [];
    }

    print() {}
}

class Pawn extends Piece {

    constructor(board, color, square) {
        super(board, color, square);
        this.hasMoved = false;
        this.hasMovedLastMove = false;
    }

    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2659')
        } else {
            process.stdout.write('\u265F')
        }
    }

    /**
     * Return all legal Moves for the Pawn in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        const moves = [];

        const moveDir = this.color === 'white' ? 1 : -1;

        const targetSquare = Square.parse(this.square.fileNumeric, this.square.rank + moveDir);
        const targetSquareTwoSteps = Square.parse(this.square.fileNumeric, this.square.rank + (moveDir * 2));

        if (this.board.getPiece(targetSquare) === null) {
            moves.push(new Move(this.square, targetSquare, {capture: false}));

            if (!this.hasMoved && this.board.getPiece(targetSquareTwoSteps) === null) {
                moves.push(new Move(this.square, targetSquareTwoSteps, {capture: false}));
            }
        }

        const targetSquareCaptureLeft = Square.parse(this.square.fileNumeric + 1, this.square.rank + moveDir);
        const targetPieceCaptureLeft = this.board.getPiece(targetSquareCaptureLeft);

        if (targetPieceCaptureLeft && targetPieceCaptureLeft.color !== this.color) {
            moves.push(new Move(this.square.square, targetSquareCaptureLeft, {capture: true}));
        }

        const targetSquareCaptureRight = Square.parse(this.square.fileNumeric - 1, this.square.rank + moveDir);
        const targetPieceCaptureRight = this.board.getPiece(targetSquareCaptureRight);

        if (targetPieceCaptureRight && targetPieceCaptureRight.color !== this.color) {
            moves.push(new Move(this.square, targetSquareCaptureRight, {capture: true}));
        }

        return moves;

        // TODO en passant, promotion
    }
}

class Bishop extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2657')
        } else {
            process.stdout.write('\u265D')
        }
    }

    /**
     * Return all legal Moves for the Pawn in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        // TODO implement
        const moves = [];

        for (let moveFile = this.square.fileNumeric + 1; moveFile <= 8; moveFile++) {
            const targetSquare = Square.parse(moveFile, this.square.rank);
            const piece = this.board.getPiece(targetSquare);
            if (piece === null) {
                moves.push(new Move(this.square, targetSquare), {capture: false});
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(new Move(this.square, targetSquare, {capture: true}));
                break;
            }
        }

        return moves;
    }
}

class Knight extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2658')
        } else {
            process.stdout.write('\u265E')
        }
    }

    /**
     * Return all legal Moves for the Knight in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        const moves = [];
        for (const longMove of [-2, 2]) {
            for (const shortMove of [-1, 1]) {

                const targetSquareA = Square.parse(this.square.fileNumeric + longMove, this.square.rank + shortMove);
                let piece = this.board.getPiece(targetSquareA);

                // TODO put in function canBeCaptured? ()
                if (piece !== undefined && (piece === null || piece.color !== this.color)) {
                    moves.push(new Move(this.square, targetSquareA, {capture: piece !== null}));
                }

                const targetSquareB = Square.parse(this.square.fileNumeric + shortMove, this.square.rank + longMove);
                piece = this.board.getPiece(targetSquareB);

                if (piece !== undefined && (piece === null || piece.color !== this.color)) {
                    moves.push(new Move(this.square, targetSquareB, {capture: piece !== null}));
                }
            }
        }

        return moves;
    }
}

class Rook extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2656')
        } else {
            process.stdout.write('\u265C')
        }
    }

    /**
     * Return all legal Moves for the Rook in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        const moves = [];

        for (let moveFile = this.square.fileNumeric + 1; moveFile <= 8; moveFile++) {
            const targetSquare = Square.parse(moveFile, this.square.rank);
            const piece = this.board.getPiece(targetSquare);
            if (piece === null) {
                moves.push(new Move(this.square, targetSquare), {capture: false});
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(new Move(this.square, targetSquare, {capture: true}));
                break;
            }
        }

        for (let moveFile = this.fileNumeric - 1; moveFile >= 1; moveFile--) {
            const targetSquare = Square.parse(moveFile, this.square.rank);
            const piece = this.board.getPiece(targetSquare);
            if (piece === null) {
                moves.push(new Move(this.square, targetSquare), {capture: false});
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(new Move(this.square, targetSquare, {capture: true}));
                break;
            }
        }

        for (let moveRank = this.square.rank + 1; moveRank <= 8; moveRank++) {
            const targetSquare = Square.parse(this.square.fileNumeric, moveRank);
            const piece = this.board.getPiece(targetSquare);
            if (piece === null) {
                moves.push(new Move(this.square, targetSquare), {capture: false});
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(new Move(this.square, targetSquare), {capture: true});
                break;
            }
        }

        for (let moveRank = this.square.rank - 1; moveRank >= 8; moveRank--) {
            const targetSquare = Square.parse(this.square.fileNumeric, moveRank);
            const piece = this.board.getPiece(targetSquare);
            if (piece === null) {
                moves.push(new Move(this.square, targetSquare), {capture: false});
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(new Move(this.square, targetSquare), {capture: true});
                break;
            }
        }

        return moves;
    }
}

class Queen extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2655')
        } else {
            process.stdout.write('\u265B')
        }
    }

    /**
     * Return all legal Moves for the Queen in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        // TODO implement
        return super.getLegalMoves();
    }
}

class King extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2654')
        } else {
            process.stdout.write('\u265A')
        }
    }

    /**
     * Return all legal Moves for the King in the current position
     *
     * @return {Array.<Move>}
     */
    getLegalMoves() {
        // TODO implement
        return super.getLegalMoves();
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
        if (!this.from.equals(move.from) || !this.to.equals(move.to)) {
            return false;
        }

        if (this.promotionTo !== move.promotionTo) {
            return false;
        }

        return true;
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
     * @param {char} file - The file as an Upper case single char, e.g. A-H
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
            fileNumeric = file.charCodeAt(0) - 64;
        }

        rank = parseInt(rank);

        if (isNaN(rank)) {
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
        } else {
            throw new Error('Unexpected file type (expects either character or number).')
        }

        return new Square(file + rank, file, fileNumeric, rank);
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.board.print();
        this.colorTurn = 'white';
        this.gameOver = false;
        //
    }

    makeMove(move) {
        this.board.move(move, this.colorTurn);
        this.colorTurn = this.colorTurn === 'white' ? 'black' : 'white';
    }

    async waitForMove() {
        const readline = require('readline');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve, reject) => {
            rl.question(this.colorTurn + '\'s move: ', (move) => {
                rl.close();
                return resolve(move);
            });
        });

    }

    async start() {
        while (!this.gameOver) {
            const move = await this.waitForMove(this.colorTurn);

            const moveParsed = Move.parse(move);
            this.makeMove(moveParsed);
            this.board.print();
        }
    }
}

const game = new Game();
game.start()
    .then(() => console.log('thats it'))
    .catch((err) => console.error(err));


class Board {
    constructor () {
        this.fields = [
            [new Rook('white', 1, 1), new Knight('white'), new Bishop('white'), new King('white'), new Queen('white'), new Bishop('white'), new Knight('white'), new Rook('white')],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            [new Rook('black'), new Knight('black'), new Bishop('black'), new King('black'), new Queen('black'), new Bishop('black'), new Knight('black'), new Rook('black')],
        ];
    }

    getLegalMoves(color) {
        const moves = [];
        for (const row of this.fields) {
            for (const field of row) {
                if (field !== null) {
                    moves.push(...field.getLegalMoves(this.field));
                }
            }
        }
    }

    print() {
        let number = 1;
        let color = 'black';

        for (const row of this.fields) {
            process.stdout.write(number++ + ' ');
            for (const field of row) {
                if (color === 'black') {
                    process.stdout.write('\x1b[44m');
                    color = 'white';
                } else {
                    process.stdout.write('\x1b[47m');
                    color = 'black';
                }
                if (!field) {
                   //console.log('')
                   process.stdout.write('   ');
                } else {
                    process.stdout.write(' ');
                    field.print();
                    process.stdout.write(' ');
                }
                process.stdout.write('\x1b[0m');
            }

            color = color === 'black' ? 'white' : 'black';
            process.stdout.write('\n');
        }

        const files = [' A ', ' B ', ' C ', ' D ', ' E ', ' F ', ' G ', ' H '];
        process.stdout.write('  ');
        for (const letter of files) {
            process.stdout.write(letter);
        }
    }

    getField(field) {
    }

    move(move, color) {
        // TODO castling, en passant, promotion, check, stalemate
    }
}

class Piece {
    constructor(color, rank, file) {
        this.rank = rank;
        this.file = file;
        this.color = color;
    }
    move(field) {}
    getLegalMoves(board) {}
    print() {}
    getMoves(position) {}
}

class Pawn extends Piece {

    constructor(color, rank, file) {
        super(color, rank, file);
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

    getLegalMoves() {
        const moves = [];

        const moveDir = this.color === 'white' ? -1 : 1;

        if (this.board.getPiece(this.file, this.rank + moveDir) === null) {
            moves.push(this.file, this.rank + moveDir);

            if (!this.hasMoved && this.board.getPiece(this.file, this.rank + (moveDir * 2)) === null) {
                moves.push(this.file, this.rank + (moveDir * 2));
            }    
        }


        if (this.board.getPiece(this.file + 1, this.rank + moveDir).color !== this.color) {
            moves.push(this.file + 1, this.rank + moveDir);
        }

        if (this.board.getPiece(this.file - 1, this.rank + moveDir).color !== this.color) {
            moves.push(this.file - 1, this.rank + moveDir);
        }

        return moves;
        
        // TODO en passant
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
}

class Knight extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2658')
        } else {
            process.stdout.write('\u265E')
        }
    }

    getLegalMoves() {
        const moves = [];
        for (const longMove of [-2, 2]) {
            for (const shortMove of [-1, 1]) {
                let piece = this.board.getPiece(this.file + longMove, this.rank + shortMove);

                if (piece === null || piece.color !== this.color) {
                    moves.push(this.file + longMove, this.rank + shortMove);
                }

                piece = this.board.getPiece(this.file + shortMove, this.rank + longMove);

                if (piece === null || piece.color !== this.color) {
                    moves.push(this.file + longMove, this.rank + shortMove);
                }
            }
        }
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
    getLegalMoves() {
        const moves = [];

        for (let moveFile = this.file + 1; moveFile <= 8; moveFile++) {
            const piece = this.board.getPiece(moveFile, this.rank);
            if (piece === null) {
                moves.push(moveFile, this.rank);
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(moveFile, this.rank);
                break;
            }
        }

        for (moveFile = this.file - 1; moveFile >= 1; moveFile--) {
            const piece = this.board.getPiece(moveFile, this.rank);
            if (piece === null) {
                moves.push(moveFile, this.rank);
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(moveFile, this.rank);
                break;
            }
        }

        for (let moveRank = this.rank + 1; moveRank <= 8; moveRank++) {
            const piece = this.board.getPiece(this.file, moveRank);
            if (piece === null) {
                moves.push(this.file, moveRank);
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(this.file, moveRank);
                break;
            }
        }


        for (let moveRank = this.rank - 1; moveRank >= 8; moveRank--) {
            const piece = this.board.getPiece(this.file, moveRank);
            if (piece === null) {
                moves.push(this.file, moveRank);
            } else if (piece.color === this.color) {
                break;
            } else {
                moves.push(this.file, moveRank);
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
}

class King extends Piece {
    print() {
        if (this.color === 'white') {
            process.stdout.write('\u2654')
        } else {
            process.stdout.write('\u265A')
        }
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.board.print();
        this.colorTurn = 'white';
        //
        this.start();
    }

    move(move) {

    }

    start() {
        //process.stdin.read();
    }
}

new Game();
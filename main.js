const {Game} = require('./game');

const game = new Game();
game.start()
    .then(() => console.log('that is it'))
    .catch((err) => console.error(err));

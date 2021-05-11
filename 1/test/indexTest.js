import {mathGame} from '../src/index.js';

describe('mathGame variable as the main class managing the game', () => {
    it('has a function to start the game', () => {
        expect(mathGame).to.respondTo('start');
    });

    it('has a function to setup the next round', () => {
        expect(mathGame).to.respondTo('setupNextRound');
    });

    it('has a function to finish the game', () => {
        expect(mathGame).to.respondTo('finish');
    });
});

describe('When the game is started', () => {
    it('the user should have three number of rounds to play', () => {
        expect(mathGame.NumberOfTries).to.equal(3);
    });
});

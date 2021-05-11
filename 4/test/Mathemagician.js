import Mathemagician from '../src/logic/Mathemagician';

const summationGenerator = () => {
    let i = 0;
    return () => {
        i += 1;
        return {
            lhs: i,
            rhs: i,
            operator: '+',
        };
    };
};

const multiplicationGenerator = () => {
    let i = 0;
    return () => {
        i += 1;
        return {
            lhs: i,
            rhs: i,
            operator: '*',
        };
    };
};

const subtractionGenerator = () => {
    let i = 0;
    return () => {
        i += 1;
        return {
            lhs: i,
            rhs: i,
            operator: '-',
        };
    };
};

const divisionGenerator = () => {
    let i = 0;
    return () => {
        i += 1;
        return {
            lhs: i,
            rhs: i,
            operator: '/',
        };
    };
};

describe('Mathemagician', () => {
    it('checks summation', () => {
        const game = new Mathemagician(summationGenerator(), 3);
        game.checkAnswer(2);
        game.checkAnswer(4);
        game.checkAnswer(6);
        expect(game.gameOver).to.eq(true);
    });

    it('checks multiplication', () => {
        const game = new Mathemagician(multiplicationGenerator(), 3);
        game.checkAnswer(1);
        game.checkAnswer(4);
        game.checkAnswer(9);
        expect(game.gameOver).to.eq(true);
    });

    it('checks subtraction', () => {
        const game = new Mathemagician(subtractionGenerator(), 3);
        game.checkAnswer(0);
        game.checkAnswer(0);
        game.checkAnswer(0);
        expect(game.gameOver).to.eq(true);
    });

    it('checks division', () => {
        const game = new Mathemagician(divisionGenerator(), 3);
        game.checkAnswer(1);
        game.checkAnswer(1);
        game.checkAnswer(1);
        expect(game.gameOver).to.eq(true);
    });
});

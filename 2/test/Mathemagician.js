import Mathemagician from '../src/logic/Mathemagician';
import Library from '../src/logic/Library';

describe('Mathemagician', () => {
    const lib = new Library();
    let game;
    beforeEach(() => game = new Mathemagician(lib.generateExpression, 4));

    it('keeps same expression when wrong answer', () => {
        expect(game.expression).to.eql(game.expressions[0]);

        game.checkAnswer(1);
        expect(game.expression).to.eql(game.expressions[0]);
    });

    it('are both operation + and * included', () => {
        let hasAddition = false;
        let hasMultiplication = false;
        for (let index = 0; index < game.expressions.length; index++) {
            if (!hasAddition) {
                hasAddition = game.expressions[index].operator == '+';
            }
            if (!hasMultiplication) {
                hasMultiplication = game.expressions[index].operator == '*';
            }
        }
        expect(hasAddition).to.eq(true);
        expect(hasMultiplication).to.eq(true);
    });

    it('is game over after successful answers based on number of rounds', () => {
        for (let index = 0; index < game.expressions.length; index++) {
            game.checkAnswer(game.getTheCorrectAnswer());
        }
        expect(game.gameOver).to.eq(true);
    });
});

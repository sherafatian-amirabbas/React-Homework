import Mathemagician from '../src/logic/Mathemagician';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/component/App';
import Game from '../src/component/Game';
import GameResult from '../src/component/GameResult';
import Starter from '../src/component/Starter';
import SingleNumberInputForm from '../src/component/SingleNumberInputForm';
import ExpressionList from '../src/component/ExpressionList';
import Expression from '../src/component/Expression';

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

describe('App', () => {
    it('render', () => {
        render(<App PlayerName='Amir' />);
    });

    it('defines 3 rounds to play', () => {
        // confirms that we have in the first page
        render(<App PlayerName='Amir' />);
        screen.getByText('Amir');

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // confirms we have the correct elements
        expect(roundsForm.getAllByRole('spinbutton')).to.have.length(1);
        expect(roundsForm.getAllByRole('button')).to.have.length(1);

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // the form in which the user input the results
        const gameForm = within(screen.getByRole('game-form'));

        // checks if the input is already there to receive the result
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we enter the result, three times in the input element and we expect 3 rows of history
        userEvent.type(gameForm.getByRole('spinbutton'), '111111');
        userEvent.type(gameForm.getByRole('spinbutton'), '222222');
        userEvent.type(gameForm.getByRole('spinbutton'), '333333');

        // we also check for histories
        expect(screen.getAllByRole('history')).to.have.length(3);

        // we check if the game is over
        expect(screen.getAllByRole('game-over')).to.have.length(1);

        // we check again if the histories are shown again at the end
        expect(screen.getAllByRole('history')).to.have.length(3);
    });
});

describe('Game', () => {
    it('render', () => {
        render(<Game NumberOfRound={3} Operand1={1} Operand2={2}
            Operator={'+'} onEvaluate={() => {}} AlertMessageOnWrongUserInput={false} />);
    });
});

describe('GameResult', () => {
    it('render', () => {
        render(<GameResult Duration={1000} Histories={[]} />);
    });
});

describe('Starter', () => {
    it('render', () => {
        render(<Starter PlayerName='Amir' onSubmit={() => {}} AlertMessageOnWrongUserInput={false} />);
    });
});

describe('SingleNumberInputForm', () => {
    it('render', () => {
        render(<SingleNumberInputForm Label='Number of rounds:'
            MinNumber={1}
            MaxNumber={20}
            DefaultNumber={3}
            SubmissionLabel='START'
            AlertMessageOnWrongUserInput={false}
            onSubmit={() => {}} />);
    });
});

describe('ExpressionList', () => {
    it('render', () => {
        const expressions = [{
            operand1: 1,
            operator: '+',
            operand2: 2,
            result: 3,
            color: 'green',
            duration: 1000
        },
        {
            operand1: 4,
            operator: '-',
            operand2: 2,
            result: 2,
            color: 'orange',
            duration: 4000
        },
        {
            operand1: 4,
            operator: '*',
            operand2: 2,
            result: 2,
            color: 'red',
            duration: 3500
        }];

        render(<ExpressionList expressions={expressions} />);

        // we check again if 3 histories are shown
        expect(screen.getAllByRole('history')).to.have.length(3);
    });
});

describe('Expression', () => {
    it('render', () => {
        render(<Expression Operand1={1}
            Operator={'+'}
            Operand2={1}
            Result={2}
            Color={'green'}
            key={1}
            Duration={1000} />);
    });
});

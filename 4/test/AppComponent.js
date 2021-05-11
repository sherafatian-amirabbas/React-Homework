import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/component/App';

// import Library from '../src/logic/Library';

describe('AppComponent', () => {
    it('render - with player name', () => {
        render(<App PlayerName='Amir' />);
        screen.getByText('Amir');
    });

    it('app flow - defines 3 rounds to play, with \'Skip\' and \'New Game\' at the end', () => {
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
        let gameForm = within(screen.getByRole('game-form'));

        // checks if the input is already there to receive the result
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we skip the first calculation
        let skipButton = gameForm.getByRole('button');
        userEvent.click(skipButton);

        // we enter the result, two times in the input element and we expect 2 rows of history
        let inputText = gameForm.getByRole('spinbutton');
        userEvent.type(inputText, '222222');

        // I tried to cover lines of 70-72 from reducer with some delay, but delay more than 2000 ms
        // is caused for an error to be thrown
        {
            // for the second calculation we are passing 3000 ms to cover all of the lines of the logic
            // const lib = new Library();
            // lib.sleep(3500);
        }
        userEvent.type(inputText, '333333');

        // we also check for histories
        expect(screen.getAllByRole('history')).to.have.length(2);

        // we check if the game is over
        expect(screen.getAllByRole('game-over')).to.have.length(1);

        // we check again if the histories are shown again at the end
        const gameOver = within(screen.getByRole('game-over'));
        expect(gameOver.getAllByRole('history')).to.have.length(2);

        // setting up a new game
        userEvent.click(screen.getByRole('button'));

        // we expect to have the Game component with an input to receive the result
        gameForm = within(screen.getByRole('game-form'));
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we enter the result, two times in the input element and we will skip the last calculation this time
        // to cover line 122-124 (But I'm getting these lines uncovered!)
        inputText = gameForm.getByRole('spinbutton');
        userEvent.type(inputText, '222222');
        userEvent.type(inputText, '333333');

        skipButton = gameForm.getByRole('button');
        userEvent.click(skipButton);
    });
});

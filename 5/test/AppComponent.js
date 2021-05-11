import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ServerContext} from '../src/Server/ServerContext';
import {createFakeServer} from '../src/Server/FakeServerAPI';

import App from '../src/component/App';

const renderAppComponent = () => {
    const server = createFakeServer();
    render(
        <ServerContext.Provider value={server}>
            <App PlayerName='Amir' />
        </ServerContext.Provider>
    );

    return server;
};

describe('AppComponent', () => {
    it('render - with player name', () => {
        renderAppComponent();

        // confirms that we have in the first page
        screen.getByText('Amir');
    });

    it('render - the inFlight scenario when game is about to begin', async () => {
        renderAppComponent();

        // confirms that we have in the first page
        screen.getByText('Amir');

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // while it's in flight, we have just the text "Processing..." in the page
        screen.getByText('Processing...');

        // after that we have just the game form
        await screen.findByRole('game-form');
    });

    it('render - the scenario when the startGame request fails', async () => {
        const server = renderAppComponent();

        // confirms that we have in the first page
        screen.getByText('Amir');

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // we set the server to fail
        server.respondWithFailure();

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // after that we have just the game form
        await screen.findByText('Service currently unavailable');
    });

    it('app flow - defines 3 rounds to play, with \'Skip\' and \'New Game\' at the end', async () => {
        renderAppComponent();

        // confirms that we have in the first page
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

        // right after that we have a in flight request
        screen.getByText('Processing...');

        // the form in which the user input the results
        let gameForm = within(await screen.findByRole('game-form'));

        // checks if the input is already there to receive the result
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we skip the first calculation
        const skipButton = gameForm.getByRole('button');
        userEvent.click(skipButton);

        // we enter the result, two times in the input element and we expect 2 rows of history
        let inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '222222');

        inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '333333');

        // we also check for histories
        expect(await screen.findAllByRole('history')).to.have.length(2);

        // we check if the game is over
        expect(await screen.findAllByRole('game-over')).to.have.length(1);

        // we check again if the histories are shown again at the end
        let gameOver = within(screen.getByRole('game-over'));
        expect(gameOver.getAllByRole('history')).to.have.length(2);

        // setting up a new game
        userEvent.click(screen.getByRole('button'));

        // we expect to have the Game component with an input to receive the result
        gameForm = within(await screen.findByRole('game-form'));
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we enter the result 3 times
        inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '111111');

        inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '222222');

        inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '333333');

        // we check if the game is over
        gameOver = within(await screen.findByRole('game-over'));

        // we should have 5 histories in total
        expect(gameOver.getAllByRole('history')).to.have.length(5);
    });
});

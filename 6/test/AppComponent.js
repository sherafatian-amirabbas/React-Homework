import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ServerContext} from '../src/Server/ServerContext';
import {createFakeServer} from '../src/Server/FakeServerAPI';
import {createMockWebSocketInterface} from './CreateMockWebSocketInterface';

import App from '../src/component/App';

const renderAppComponent = (name) => {
    const server = createFakeServer();
    const connectWebSocket = createMockWebSocketInterface(name || 'AAAA');
    render(
        <ServerContext.Provider value={server}>
            <App PlayerName='Amir' connectWebSocket={connectWebSocket} />
        </ServerContext.Provider>
    );

    return {server, connectWebSocket};
};

describe('AppComponent', () => {
    it('render - with player name', () => {
        renderAppComponent();

        // confirms that we have in the first page
        screen.getByText('Amir');
    });

    it('the inFlight scenario when game is about to begin', async () => {
        renderAppComponent();

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // while it's in flight, we have just the text "Connecting..." in the page
        screen.getByText('Connecting...');

        // after that we have just the game form
        await screen.findByRole('game-form');
    });

    it('the scenario when the startGame request fails', async () => {
        const server = renderAppComponent().server;

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // we set the server to fail
        server.respondWithFailure();

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // after that we have just the game form
        await screen.findByText('Service currently unavailable');
    });

    it('the scenario when the evaluation request fails', async () => {
        const server = renderAppComponent().server;

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // the form in which the user input the results
        const gameForm = within(await screen.findByRole('game-form'));

        // we set the server to fail
        server.respondWithFailure();

        // we enter the result, two times in the input element and we expect 2 rows of history
        const inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '111111');

        // after that we have just the game form
        await screen.findByText('Service currently unavailable');
    });

    it('the scenario when the skip request fails', async () => {
        const server = renderAppComponent().server;

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // the form in which the user input the results
        const gameForm = within(await screen.findByRole('game-form'));

        // we set the server to fail
        server.respondWithFailure();

        // we skip the first calculation
        const skipButton = gameForm.getByRole('button', {name: 'skip-button'});
        userEvent.click(skipButton);

        // after that we have just the game form
        await screen.findByText('Service currently unavailable');
    });

    it('app flow - defines 3 rounds to play, with \'Skip\' and \'New Game\' at the end', async () => {
        renderAppComponent();

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // confirms we have the correct elements
        expect(roundsForm.getAllByRole('spinbutton')).to.have.length(1);
        expect(roundsForm.getAllByRole('textbox')).to.have.length(1);
        expect(roundsForm.getAllByRole('button')).to.have.length(1);

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // right after that we have a in flight request
        screen.getByText('Connecting...');

        // the form in which the user input the results
        let gameForm = within(await screen.findByRole('game-form'));

        // checks if the input is already there to receive the result
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);

        // we skip the first calculation
        const skipButton = gameForm.getByRole('button', {name: 'skip-button'});
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
        userEvent.click(screen.getByRole('button', {name: 'newGame-button'}));

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

    it('app flow - defines 3 rounds to play, with \'Skip\' at the end', async () => {
        renderAppComponent();

        // the form in which we enter the number of rounds
        const roundsForm = within(screen.getByRole('rounds-form'));

        // writes 3 as number of rounds to play
        userEvent.type(roundsForm.getByRole('spinbutton'), 3);

        // writes AAAA as a name in the input
        userEvent.type(roundsForm.getByRole('textbox'), 'AAAA');

        // clicks on the button to start the game
        userEvent.click(roundsForm.getByRole('button'));

        // the form in which the user input the results
        let gameForm = within(await screen.findByRole('game-form'));

        // we enter the result 2 times
        let inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '111111');

        inputText = await gameForm.findByRole('spinbutton');
        userEvent.type(inputText, '222222');

        // we skip the last calculation
        gameForm = within(await screen.findByRole('game-form'));
        const skipButton = await gameForm.findByRole('button', {name: 'skip-button'});
        userEvent.click(skipButton, null);

        await screen.findByRole('game-over');
    });

    it('the scenario in which we have the player name with \'(you)\' and is disconnected when it is begun',
        async () => {
            const name = 'BBBB';
            renderAppComponent(name);

            // the form in which we enter the number of rounds
            const roundsForm = within(screen.getByRole('rounds-form'));

            // writes 3 as number of rounds to play
            userEvent.type(roundsForm.getByRole('spinbutton'), 3);

            // writes AAAA as a name in the input
            userEvent.type(roundsForm.getByRole('textbox'), name);

            // clicks on the button to start the game
            userEvent.click(roundsForm.getByRole('button'));

            // after that we have just the game form
            const monitorForm = within(await screen.findByRole('monitor-form'));

            screen.getByText(name + ' (you)');

            // clicks on the disconnect button
            userEvent.click(monitorForm.getByRole('button', {name: 'disconnect-button'}));

            // we expect to be in the starter form again
            screen.getByRole('rounds-form');
        }
    );

    it('the scenario when a duplicate name is entered',
        async () => {
            const name = 'CCCC';
            renderAppComponent(name);

            // the form in which we enter the number of rounds
            let roundsForm = within(screen.getByRole('rounds-form'));

            // writes 3 as number of rounds to play
            userEvent.type(roundsForm.getByRole('spinbutton'), 3);

            // writes CCCC as a name in the input, this is considered as duplicate
            userEvent.type(roundsForm.getByRole('textbox'), name);

            // clicks on the button to start the game
            userEvent.click(roundsForm.getByRole('button'));

            // we expect to be on the same form again
            roundsForm = within(await screen.findByRole('rounds-form'));

            // and the error message is shown
            screen.getByText('The name is already taken');
        }
    );

    it('app flow - checking the flow while the status is changing from "connecting" to "connected" regularly',
        async () => {
            renderAppComponent();

            // the form in which we enter the number of rounds
            screen.getByRole('rounds-form');

            // writes 3 as number of rounds to play
            userEvent.type(screen.getByRole('spinbutton'), 3);

            // writes AAAA as a name in the input
            userEvent.type(screen.getByRole('textbox'), 'AAAA');

            // clicks on the button to start the game
            userEvent.click(screen.getByRole('button'));

            // 1st connecting check: right after that we have a inflight request
            screen.getByText('Connecting...');

            // 1st connected check (when the server responds): we have the right form rendered
            // the form in which the user input the results
            await screen.findByRole('game-form');

            // we guess the first calculation
            userEvent.type(await screen.findByRole('spinbutton'), '111111');

            // 2st connecting check: right after entering our guess, we will have an inflight request
            screen.getByText('Connecting...');

            // 2st connected check (when the server responds to evaluation)
            await screen.findByRole('game-form');

            // we skip the second calculation
            userEvent.click(await screen.findByRole('button', {name: 'skip-button'}));

            // 3st connecting check: right after skipping a calculation
            screen.getByText('Connecting...');

            // 3st connected check (when the server responds to skip)
            await screen.findByRole('game-form');

            // clicks on the disconnect button
            userEvent.click(await screen.findByRole('button', {name: 'disconnect-button'}));

            // disconnected from the server: we expect to be in the starter form again
            await screen.findByRole('rounds-form');
        }
    );
});

import {render, within, screen} from '@testing-library/react';
import Starter from '../src/component/Starter';

describe('StarterComponent', () => {
    it('render - component is rendered and player name is shown', () => {
        render(<Starter PlayerName='Amir'
            onSubmit={() => {}}
            AlertMessageOnWrongUserInput={false} />);

        within(screen.getByRole('player-name'));
        screen.getByText('Amir');
    });
});

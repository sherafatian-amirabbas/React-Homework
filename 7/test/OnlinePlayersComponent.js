import {render} from '@testing-library/react';
import OnlinePlayers from '../src/component/OnlinePlayers';

describe('OnlinePlayersComponent', () => {
    it('render', () => {
        render(<OnlinePlayers players={[]}
            currentPlayer={{id: '', name: ''}}/>);
    });
});

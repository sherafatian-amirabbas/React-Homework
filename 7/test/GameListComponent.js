import {render} from '@testing-library/react';
import Game from '../src/component/GameList';

describe('GameListComponent', () => {
    it('render', () => {
        render(<Game onGameClick={() => {}}
            inProgressMode={true}
            gamesDic={{}}
        />);
    });
});

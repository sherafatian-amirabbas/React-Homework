import {render, within, screen} from '@testing-library/react';
import GameResult from '../src/component/GameResult';

describe('GameResultComponent', () => {
    it('render - \'New Game\' button is created ', () => {
        render(<GameResult
            Duration={1000}
            Histories={[]}
            onNew={() => {}}
            OrderHistoryColumnName={'timestamp'}
        />);

        const gameOverForm = within(screen.getByRole('game-over'));
        expect(gameOverForm.getAllByRole('button')).to.have.length(1);
    });
});

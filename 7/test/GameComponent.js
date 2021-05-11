import {render, screen, within} from '@testing-library/react';
import Game from '../src/component/Game';

describe('GameComponent', () => {
    it('render - form elements (skip button, input text) is created', () => {
        render(<Game Operand1={1}
            Operand2={2}
            Operator={'+'}
            onEvaluate={() => {}}
            AlertMessageOnWrongUserInput={false}
            Histories={[]}
            onSkip={() => {}}
            SkipVisibility={true}
            OrderHistoryColumnName={'timestamp'}
        />);

        const gameForm = within(screen.getByRole('game-form'));
        expect(gameForm.getAllByRole('spinbutton')).to.have.length(1);
        expect(gameForm.getAllByRole('button')).to.have.length(1);
    });
});

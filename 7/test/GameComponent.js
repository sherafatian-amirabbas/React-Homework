import {render} from '@testing-library/react';
import Game from '../src/component/Game';

describe('GameComponent', () => {
    it('render', () => {
        render(<Game gamesDic={{}}
            Operand1={1}
            Operand2={2}
            Operator={'+'}
            onEvaluate={() => {}}
            AlertMessageOnWrongUserInput={false}
            Histories={[]}
            onSkip={() => {}}
            SkipVisibility={true}
        />);
    });
});

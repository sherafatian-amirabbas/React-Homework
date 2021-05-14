import {render} from '@testing-library/react';
import GameResult from '../src/component/GameResult';

describe('GameResultComponent', () => {
    it('render', () => {
        render(<GameResult gamesDic={{}}
            Duration={1000}
            Histories={[]}
            onNew={() => {}}
        />);
    });
});

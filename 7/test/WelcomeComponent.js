import {render} from '@testing-library/react';
import Welcome from '../src/component/Welcome';

describe('WelcomeComponent', () => {
    it('render', () => {
        render(<Welcome playerName=''
            onConnect={() => {}}
            wsConnect={false}
            wsPlayerName=''/>);
    });
});

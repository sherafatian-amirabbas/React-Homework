import {render} from '@testing-library/react';
import Monitor from '../src/component/Monitor';

describe('MonitorComponent', () => {
    it('render', () => {
        render(<Monitor disconnectHandler={() => {}}
            players={[]}
            currentPlayer={{id: '', name: ''}}/>);
    });
});

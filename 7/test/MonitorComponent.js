import {render, screen} from '@testing-library/react';
import {expect} from 'chai';
import Monitor from '../src/component/Monitor';

describe('MonitorComponent', () => {
    it('render with disconnect button', () => {
        render(<Monitor disconnectHandler={() => {}}
            players={[]}
            currentPlayer={{id: '', name: ''}}/>);

        expect(screen.getAllByRole('button')).to.have.length(1);
        screen.getByRole('button', {name: 'disconnect-button'});
    });
});

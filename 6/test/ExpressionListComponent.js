import {render, screen} from '@testing-library/react';
import ExpressionList from '../src/component/ExpressionList';

describe('ExpressionListComponent', () => {
    it('render - with 3 expressions', () => {
        const expressions = [{
            operand1: 1,
            operator: '+',
            operand2: 2,
            result: 3,
            isAnswered: true,
            timeTaken: 'Fast',
            duration: 1000,
            round: 1,
            timestamp: 1618157990937
        },
        {
            operand1: 4,
            operator: '-',
            operand2: 2,
            result: 2,
            isAnswered: true,
            timeTaken: 'Long',
            duration: 4000,
            round: 1,
            timestamp: 1618157990948
        },
        {
            operand1: 4,
            operator: '*',
            operand2: 2,
            result: 2,
            isAnswered: false,
            timeTaken: 'Long',
            duration: 3500,
            round: 1,
            timestamp: 1618157990959
        }];

        render(<ExpressionList
            Expressions={expressions}
            ShowExpressionDuration={true}
            OrderColumnName={'timestamp'}
            ShowRoundTitle={false}
        />);

        // we check again if 3 histories are shown
        expect(screen.getAllByRole('history')).to.have.length(3);
    });
});

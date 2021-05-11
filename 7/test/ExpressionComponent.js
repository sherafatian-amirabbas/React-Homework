import {render, screen} from '@testing-library/react';
import Expression from '../src/component/Expression';

describe('ExpressionComponent', () => {
    it('render with duration', () => {
        render(<Expression Operand1={1}
            Operator={'+'}
            Operand2={1}
            Result={2}
            IsAnswered={true}
            TimeTaken={'Fast'}
            key={1}
            Duration={1000}
            ShowDuration={true} />);

        screen.getByRole('history-duration');
    });
});

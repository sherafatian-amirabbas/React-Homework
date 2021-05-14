import {render} from '@testing-library/react';
import Expression from '../src/component/Expression';

describe('ExpressionComponent', () => {
    it('render', () => {
        render(<Expression Operand1={1}
            Operator={'+'}
            Operand2={1}
            Result={2}
            IsAnswered={true}
            TimeTaken={'Fast'}
            Duration={1000}
            ShowDuration={true} />);
    });
});

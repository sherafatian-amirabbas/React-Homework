import {render} from '@testing-library/react';
import ExpressionList from '../src/component/ExpressionList';

describe('ExpressionListComponent', () => {
    it('render', () => {
        render(<ExpressionList
            gamesDic={{}}
            Expressions={[]}
            ShowExpressionDuration={true}
            isFinishedMode={false}
        />);
    });
});

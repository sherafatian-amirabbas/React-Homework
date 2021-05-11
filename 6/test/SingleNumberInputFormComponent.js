import {render, within, screen} from '@testing-library/react';
import SingleNumberInputForm from '../src/component/SingleNumberInputForm';

describe('SingleNumberInputFormComponent', () => {
    it('render - form is created with elements', () => {
        render(<SingleNumberInputForm
            Label='Number of rounds:'
            MinNumber={1}
            MaxNumber={20}
            DefaultNumber={3}
            SubmissionLabel='START'
            AlertMessageOnWrongUserInput={false}
            onSubmit={() => {}} />);

        const form = within(screen.getByRole('rounds-form'));
        expect(form.getAllByRole('spinbutton')).to.have.length(1);
        expect(form.getAllByRole('button')).to.have.length(1);
    });
});

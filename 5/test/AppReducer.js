import {
    initializer,
    appReducer,
} from '../src/Reducer/AppReducer';

describe('AppReducer', () => {
    it('when invalid action type is passed', () => {
        try {
            appReducer(initializer(), {});
        } catch (error) {
            expect(error.message).to.eql('Invalid reducer usage');
        }
    });
});

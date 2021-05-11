import {expect} from 'chai';
import {
    initializer,
    appReducer,
} from '../src/Reducer/AppReducer';

describe('AppReducer', () => {
    it('when invalid action type is passed, the state should not change', () => {
        const state = initializer();
        const newState = appReducer(state, {});
        expect(state).to.deep.equal(newState);
    });
});

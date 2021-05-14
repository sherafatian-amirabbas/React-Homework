import {render} from '@testing-library/react';
import Menu from '../src/component/Menu';
import {BrowserRouter} from 'react-router-dom';

describe('MenuComponent', () => {
    it('render', () => {
        render(<BrowserRouter><Menu/></BrowserRouter>);
    });
});

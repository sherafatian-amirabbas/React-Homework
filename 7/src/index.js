import '../css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(<BrowserRouter><App playerName='Amir'/></BrowserRouter>, document.getElementById('root'));

import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import ExpressionList from './ExpressionList';

let Game = (props, ref) => {
    const [histories, setHistories] = useState([]);
    const input = useRef();

    const onChange = (event) => {
        const inputValue = parseInt(input.current.value);
        if (isNaN(inputValue)) {
            if (props.AlertMessageOnWrongUserInput) {
                alert('input value is not valid!');
            }
            return;
        } else {
            props.onEvaluate(inputValue);
        }
    };

    useEffect(() => {
        input.current.focus();
    });

    // I guess I shouldn't use this, because I would go from imperative to declarative manner
    // but I want to taste it :D
    useImperativeHandle(ref, () => ({
        addExpressionToHistory: (operand1, operator, operand2, result, color) => {
            setHistories(histories.concat({
                operand1: operand1,
                operator: operator,
                operand2: operand2,
                result: result,
                color: color
            }));
        },
    }));

    return (
        <div role='game-form' style={{textAlign: 'center'}}>

            <div style={{display: 'inline-block', padding: '20px'}}>
                {props.Operand1}
            </div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                {props.Operator}
            </div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                {props.Operand2}
            </div>
            <div style={{display: 'inline-block', padding: '20px'}}>=</div>
            <div style={{display: 'inline-block', padding: '20px'}}>
                <ExpressionList expressions={histories}></ExpressionList>
                <input
                    name="result"
                    type='number'
                    ref={input}
                    style={{width: '90px', height: '30px', fontSize: '20px'}}
                    onChange={onChange}
                    key={(new Date()).getTime()}
                />
            </div>
        </div>
    );
};

Game = forwardRef(Game);

Game.propTypes = {
    NumberOfRound: PropTypes.number.isRequired,
    Operand1: PropTypes.number.isRequired,
    Operand2: PropTypes.number.isRequired,
    Operator: PropTypes.string.isRequired,
    onEvaluate: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired
};

export default Game;

import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import ExpressionList from './ExpressionList';

const Game = (props) => {
    const input = useRef();

    const onChange = (event) => {
        const inputValue = parseFloat(input.current.value);
        if (isNaN(inputValue)) {
            if (props.AlertMessageOnWrongUserInput) {
                alert('input value is not valid!');
            }
            return;
        } else {
            props.onEvaluate(inputValue);
        }
    };

    const onSkip = () => props.onSkip();

    useEffect(() => {
        input.current.focus();
    });

    let skipElement = '';
    if (props.SkipVisibility) {
        skipElement =
            <div style={{display: 'inline-block', padding: '20px'}}>
                <button style={{width: '70px', height: '30px', fontSize: '15px'}}
                    aria-label="skip-button" onClick={onSkip}>Skip</button>
            </div>;
    }

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
                <ExpressionList Expressions={props.Histories} ShowExpressionDuration={false}
                    isFinishedMode={false} gamesDic={props.gamesDic}></ExpressionList>
                <input name="result" type='number' ref={input}
                    style={{width: '90px', height: '30px', fontSize: '20px'}}
                    onChange={onChange} key={(new Date()).getTime()}/>
            </div>
            {skipElement}
        </div>
    );
};

Game.propTypes = {
    gamesDic: PropTypes.object.isRequired,
    Operand1: PropTypes.number.isRequired,
    Operand2: PropTypes.number.isRequired,
    Operator: PropTypes.string.isRequired,
    onEvaluate: PropTypes.func.isRequired,
    AlertMessageOnWrongUserInput: PropTypes.bool.isRequired,
    Histories: PropTypes.array.isRequired,
    onSkip: PropTypes.func.isRequired,
    SkipVisibility: PropTypes.bool.isRequired,
};

export default Game;
